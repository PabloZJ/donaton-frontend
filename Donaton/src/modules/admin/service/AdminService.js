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
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	if (res.status === 204) return []
	if (!res.ok) throw new Error(`Error ${res.status}`)

	return res.json()
}

export const fetchTodosUsuarios = () =>
	get('/api/necesidades/usuarios')

export const fetchTodasDonaciones = () =>
	get('/api/donaciones/donaciones')

export const fetchTodasNecesidades = () =>
	get('/api/necesidades/necesidades')

export const fetchTodoInventario = () =>
	get('/api/logistica/inventario')

export const fetchComunas = () =>
	get('/api/logistica/comunas')

export const fetchCentrosAcopio = () =>
	get('/api/logistica/centros-acopio/activos')

export const eliminarUsuario = async (id) => {
	const token = await getToken()

	const res = await fetch(
		`${API_URL}/api/necesidades/usuarios/${id}`,
		{
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	)

	if (!res.ok) throw new Error(`Error ${res.status}`)
}

export const crearUsuarioBackend = async (body) => {
	const token = await getToken()

	const res = await fetch(
		`${API_URL}/api/necesidades/usuarios`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		}
	)

	if (!res.ok) throw new Error(`Error ${res.status}`)
	return res.json()
}