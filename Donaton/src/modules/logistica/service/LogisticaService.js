import { auth } from '../../auth/service/authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const getToken = async () => {
    const user = auth.currentUser
    if (!user) throw new Error('No autenticado')
    return user.getIdToken()
}

const get = async (url) => {
    const token = await getToken()
    const res = await fetch(`${API_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    if (res.status === 204) return []
    if (!res.ok) throw new Error(`Error ${res.status}`)
    return res.json()
}

const post = async (url, body) => {
    const token = await getToken()
    const res = await fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Error ${res.status}`)
    return res.json()
}

const patch = async (url, body) => {
    const token = await getToken()
    const res = await fetch(`${API_URL}${url}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Error ${res.status}`)
    return res.json()
}

export const fetchInventarioPorCentro = (centroId) => get(`/api/logistica/inventario/centro/${centroId}`)
export const fetchEnvios = () => get('/api/logistica/envios')
export const fetchEstadosEnvio = () => get('/api/logistica/estados-envio')
export const fetchCentrosAcopio = () => get('/api/logistica/centros-acopio/activos')
export const fetchComunas = () => get('/api/logistica/comunas')
export const fetchNecesidades = () => get('/api/necesidades/necesidades')
export const fetchDonaciones = () => get('/api/donaciones/donaciones')
export const fetchAsignaciones = () => get('/api/logistica/asignaciones')

export const crearEnvio = (body) => post('/api/logistica/envios', body)
export const crearAsignacion = (body) => post('/api/logistica/asignaciones', body)
export const fetchDonacionesPorCentro = (centroId) => get(`/api/donaciones/donaciones/centro/${centroId}`)
export const restarInventario = (body) => patch('/api/logistica/inventario/salida', body)
export const entradaInventario = (body) => patch('/api/logistica/inventario/entrada', body)
export const actualizarEstadoDonacion = (id, estadoId) => patch(`/api/donaciones/donaciones/${id}`, { estado: { id: estadoId } })
export const fetchNecesidadesPorCentro = (centroId) => get(`/api/necesidades/necesidades/centro/${centroId}`)
export const actualizarNecesidad = (id, body) => patch(`/api/necesidades/necesidades/${id}`, body)

export const fetchPerfilPorUid = (uid) => get(`/api/usuarios/usuarios/perfil/${uid}`)
export const fetchComunaPorId = (id) => get(`/api/logistica/comunas/${id}`)