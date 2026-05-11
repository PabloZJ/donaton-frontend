import { useState, useCallback } from 'react'
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '../service/authService'
import { useAuth } from '../../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const getFriendlyError = (firebaseError) => {
  const code = firebaseError.code || ''
  
  const credentialErrors = [
    'auth/invalid-credential',
    'auth/user-not-found',
    'auth/wrong-password',
    'auth/invalid-email',
    'auth/invalid-login-credentials',
  ]
  
  if (credentialErrors.includes(code)) {
    return 'Email o contraseña inválidos'
  }
  
  if (code === 'auth/user-disabled') {
    return 'Esta cuenta ha sido deshabilitada'
  }
  
  if (code === 'auth/too-many-requests') {
    return 'Demasiados intentos fallidos. Intenta más tarde'
  }
  
  if (code === 'auth/network-request-failed') {
    return 'Error de conexión. Verifica tu internet'
  }
  
  if (code === 'auth/email-already-in-use') {
    return 'Este correo ya está registrado'
  }
  
  if (code === 'auth/weak-password') {
    return 'La contraseña debe tener al menos 6 caracteres'
  }
  
  return 'Ocurrió un error. Intenta de nuevo'
}

export const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { refreshPerfil } = useAuth()

  const register = useCallback(async ({ email, password, nombre, rolId }) => {
    setLoading(true)
    setError(null)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      const idToken = await user.getIdToken()

      const res = await fetch(`${API_URL}/api/necesidades/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          nombre,
          email,
          rol: { id: parseInt(rolId) },
        }),
      })

      if (!res.ok) throw new Error('Error al registrar en el backend')
      await refreshPerfil()
      return { success: true }
    } catch (err) {
      const friendlyMsg = getFriendlyError(err)
      setError(friendlyMsg)
      return { success: false, error: friendlyMsg }
    } finally {
      setLoading(false)
    }
  }, [refreshPerfil])

  const login = useCallback(async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      const friendlyMsg = getFriendlyError(err)
      setError(friendlyMsg)
      return { success: false, error: friendlyMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await signOut(auth)
      return { success: true }
    } catch (err) {
      const friendlyMsg = getFriendlyError(err)
      setError(friendlyMsg)
      return { success: false, error: friendlyMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  return { register, login, logout, loading, error, clearError: () => setError(null) }
}