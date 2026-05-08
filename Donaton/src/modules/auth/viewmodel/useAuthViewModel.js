import { useState, useCallback } from 'react'
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '../service/authService'
import { useAuth } from '../../../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

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
      setError(err.message)
      return { success: false, error: err.message }
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
      setError(err.message)
      return { success: false, error: err.message }
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
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  return { register, login, logout, loading, error, clearError: () => setError(null) }
}