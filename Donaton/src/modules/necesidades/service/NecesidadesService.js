import { auth } from '../../auth/service/authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const getToken = async () => {
  const user = auth.currentUser
  console.log('currentUser:', user)
  if (!user) throw new Error('No autenticado')
  return user.getIdToken()
}

export const fetchNecesidades = async () => {
  const token = await getToken()
  const res = await fetch(`${API_URL}/api/necesidades/necesidades`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (res.status === 204) return []
  if (!res.ok) throw new Error('Error al obtener necesidades')
  return res.json()
}

export const fetchEstadosNecesidad = async () => {
  const token = await getToken()
  const res = await fetch(`${API_URL}/api/necesidades/estados-necesidad`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log('estados status:', res.status)
  if (res.status === 204) return []
  if (!res.ok) throw new Error('Error al obtener estados')
  return res.json()
}

export const fetchComunas = async () => {
  const token = await getToken()
  const res = await fetch(`${API_URL}/api/logistica/comunas`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log('comunas status:', res.status)
  if (res.status === 204) return []
  if (!res.ok) throw new Error('Error al obtener comunas')
  return res.json()
}

export const crearNecesidad = async (body) => {
  const token = await getToken()
  const res = await fetch(`${API_URL}/api/necesidades/necesidades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Error al crear necesidad')
  return res.json()
}