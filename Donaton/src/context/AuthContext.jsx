import { createContext, useContext, useState, useEffect } from 'react'
import { auth, onAuthStateChanged, signOut } from '../modules/auth/service/authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}

const fetchPerfil = async (user) => {
  const idToken = await user.getIdToken()
  const res = await fetch(
    `${API_URL}/api/necesidades/usuarios/email/${encodeURIComponent(user.email)}`,
    { headers: { Authorization: `Bearer ${idToken}` } }
  )
  if (!res.ok) return null
  return res.json()
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null, rol: null, perfil: null, loading: true,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthState({ user: null, rol: null, perfil: null, loading: false })
        return
      }
      try {
        const perfil = await fetchPerfil(user)
        if (perfil) {
          setAuthState({ user, rol: perfil.rol?.nombre || null, perfil, loading: false })
        }
      } catch {
        setAuthState({ user, rol: null, perfil: null, loading: false })
      }
    })
    return () => unsubscribe()
  }, [])

  const refreshPerfil = async () => {
    const user = auth.currentUser
    if (!user) return
    const perfil = await fetchPerfil(user)
    if (perfil) {
      setAuthState({ user, rol: perfil.rol?.nombre || null, perfil, loading: false })
    }
  }

  const logout = async () => {
    await signOut(auth)
    setAuthState({ user: null, rol: null, perfil: null, loading: false })
  }

  return (
    <AuthContext.Provider value={{
      ...authState,
      logout,
      refreshPerfil,
      isAuthenticated: !!authState.user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}