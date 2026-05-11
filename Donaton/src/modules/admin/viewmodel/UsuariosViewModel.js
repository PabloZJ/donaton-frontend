// useUsuariosViewModel.js
import { useState, useEffect } from 'react'
import { fetchTodosUsuarios, fetchComunas, fetchCentrosAcopio, eliminarUsuario, crearUsuarioBackend } from '../service/AdminService'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../auth/service/authService'

export const useUsuariosViewModel = () => {
  const [usuarios, setUsuarios] = useState([])
  const [comunas, setComunas] = useState([])
  const [centros, setCentros] = useState([])
  const [regiones, setRegiones] = useState([])
  const [comunasFiltradas, setComunasFiltradas] = useState([])
  const [centrosFiltrados, setCentrosFiltrados] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [filtroRol, setFiltroRol] = useState('todos')

  const [form, setForm] = useState({
    nombre: '', email: '', password: '',
    rolId: '1', regionId: '', comunaId: '',
    regionCentroId: '', centroAcopioId: '',
  })

  useEffect(() => {
    const cargar = async () => {
      try {
        const [usrData, comunasData, centrosData] = await Promise.all([
          fetchTodosUsuarios(), fetchComunas(), fetchCentrosAcopio(),
        ])
        setUsuarios(usrData)
        setComunas(comunasData)
        setCentros(centrosData)
        setCentrosFiltrados(centrosData)

        const regs = []
        comunasData.forEach(c => {
          if (!regs.find(r => r.id === c.region.id)) regs.push(c.region)
        })
        setRegiones(regs)

        const primeraRegion = regs[0]?.id || ''
        const comunasDeRegion = comunasData.filter(c => c.region.id === parseInt(primeraRegion))
        setComunasFiltradas(comunasDeRegion)

        setForm(prev => ({
          ...prev,
          regionId: String(primeraRegion),
          comunaId: String(comunasDeRegion[0]?.id || ''),
          regionCentroId: String(centrosData[0]?.region?.id || ''),
          centroAcopioId: String(centrosData[0]?.id || ''),
        }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingData(false)
      }
    }
    cargar()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === 'regionId') {
      const filtradas = comunas.filter(c => c.region.id === parseInt(value))
      setComunasFiltradas(filtradas)
      setForm(prev => ({ ...prev, regionId: value, comunaId: String(filtradas[0]?.id || '') }))
    }

    if (name === 'regionCentroId') {
      const filtrados = centros.filter(c => c.region?.id === parseInt(value))
      setCentrosFiltrados(filtrados)
      setForm(prev => ({ ...prev, regionCentroId: value, centroAcopioId: String(filtrados[0]?.id || '') }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password)
      const body = {
        firebaseUid: user.uid,
        nombre: form.nombre,
        email: form.email,
        rol: { id: parseInt(form.rolId) },
      }
      if (form.rolId === '2') body.comunaId = parseInt(form.comunaId)
      if (form.rolId === '3') body.centroAcopioId = parseInt(form.centroAcopioId)

      await crearUsuarioBackend(body)
      const data = await fetchTodosUsuarios()
      setUsuarios(data)
      setSuccess(true)
      setForm(prev => ({ ...prev, nombre: '', email: '', password: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id) => {
    try {
      await eliminarUsuario(id)
      setUsuarios(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const usuariosFiltrados = filtroRol === 'todos'
    ? usuarios
    : usuarios.filter(u => u.rol?.id === parseInt(filtroRol))

  const getRolNombre = (id) => ({ 1: 'Donante', 2: 'Municipalidad', 3: 'Operador', 4: 'Admin' }[id] || 'Desconocido')
  const getRolColor = (id) => ({ 1: 'text-green-600 bg-green-50 border-green-100', 2: 'text-blue-600 bg-blue-50 border-blue-100', 3: 'text-orange-600 bg-orange-50 border-orange-100', 4: 'text-purple-600 bg-purple-50 border-purple-100' }[id] || 'text-gray-600 bg-gray-50 border-gray-100')

  return {
    usuarios: usuariosFiltrados, comunas, comunasFiltradas, centros, centrosFiltrados, regiones,
    form, handleChange, handleSubmit, handleEliminar,
    loading, loadingData, error, success,
    filtroRol, setFiltroRol,
    getRolNombre, getRolColor,
  }
}