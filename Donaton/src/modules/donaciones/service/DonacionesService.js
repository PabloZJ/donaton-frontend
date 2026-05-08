import { auth } from '../../auth/service/authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const getToken = async () => {
  const user = auth.currentUser
  if (!user) throw new Error('No autenticado')
  return user.getIdToken()
}

export const fetchCentrosAcopio = async () => {
  const token = await getToken()
  const res = await fetch(`${API_URL}/api/logistica/centros-acopio/activos`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Error al obtener centros de acopio')
  return res.json()
}

export const fetchEstadosDonacion = async () => {
  const token = await getToken()
  const res = await fetch(`${API_URL}/api/donaciones/estados-donacion`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Error al obtener estados')
  return res.json()
}
export const fetchDonaciones = async () => {
  const token = await getToken()
  const res = await fetch(`${API_URL}/api/donaciones/donaciones`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Error al obtener donaciones')
  return res.json()
}

export const crearDonacion = async (body) => {
  const token = await getToken()
  const res = await fetch(`${API_URL}/api/donaciones/donaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Error al crear donación')
  return res.json()
}