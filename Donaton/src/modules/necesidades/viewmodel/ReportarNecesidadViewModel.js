import { useState, useEffect } from 'react'
import { fetchEstadosNecesidad, fetchComunas, crearNecesidad } from '../service/NecesidadesService'
import { useAuth } from '../../../context/AuthContext'

const TIPOS_RECURSO = [
  { id: 1, nombre: 'Agua' },
  { id: 2, nombre: 'Comida no perecible' },
  { id: 3, nombre: 'Ropa' },
  { id: 4, nombre: 'Medicamentos' },
  { id: 5, nombre: 'Colchones' },
  { id: 6, nombre: 'Artículos de aseo' },
  { id: 7, nombre: 'Mantas' },
  { id: 8, nombre: 'Pañales' },
  { id: 9, nombre: 'Leche en polvo' },
  { id: 10, nombre: 'Alimentos para mascotas' },
]

export const useReportarNecesidadViewModel = () => {
  const { user } = useAuth()
  const [estados, setEstados] = useState([])
  const [comunas, setComunas] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    tipoRecursoId: '1',
    cantidad: '',
    cantidadCubierta: '0',
    descripcion: '',
    direccion: '',
    comunaId: '',
    estadoId: '',
  })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [estadosData, comunasData] = await Promise.all([
          fetchEstadosNecesidad(),
          fetchComunas(),
        ])
        setEstados(estadosData)
        setComunas(comunasData)
        setForm(prev => ({
          ...prev,
          estadoId: String(estadosData[0]?.id || ''),
          comunaId: String(comunasData[0]?.id || ''),
        }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingData(false)
      }
    }
    cargarDatos()
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await crearNecesidad({
        tipoRecursoId: parseInt(form.tipoRecursoId),
        cantidad: parseFloat(form.cantidad),
        cantidadCubierta: 0,
        descripcion: form.descripcion || null,
        direccion: form.direccion,
        comunaId: parseInt(form.comunaId),
        estado: { id: parseInt(form.estadoId) },
        reportadoPorUid: user.uid,
        fechaReporte: new Date().toISOString().slice(0, 19),
      })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    form, handleChange, handleSubmit,
    estados, comunas, TIPOS_RECURSO,
    loading, loadingData, error, success,
  }
}