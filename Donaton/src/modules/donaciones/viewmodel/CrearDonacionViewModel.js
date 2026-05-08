import { useState, useEffect } from 'react'
import { fetchCentrosAcopio, fetchEstadosDonacion, crearDonacion } from '../service/DonacionesService'
import { useAuth } from '../../../context/AuthContext'

const TIPOS_RECURSO = [
  { id: 1, nombre: 'Agua', unidad: 'litros' },
  { id: 2, nombre: 'Comida no perecible', unidad: 'kilos' },
  { id: 3, nombre: 'Ropa', unidad: 'unidades' },
  { id: 4, nombre: 'Medicamentos', unidad: 'unidades' },
  { id: 5, nombre: 'Colchones', unidad: 'unidades' },
  { id: 6, nombre: 'Artículos de aseo', unidad: 'unidades' },
  { id: 7, nombre: 'Mantas', unidad: 'unidades' },
  { id: 8, nombre: 'Pañales', unidad: 'unidades' },
  { id: 9, nombre: 'Leche en polvo', unidad: 'kilos' },
  { id: 10, nombre: 'Alimentos para mascotas', unidad: 'kilos' },
]

export const useCrearDonacionViewModel = () => {
  const { user } = useAuth()
  const [centros, setCentros] = useState([])
  const [estados, setEstados] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    tipoRecursoId: '1',
    cantidad: '',
    centroAcopioId: '',
    estadoId: '',
    fechaCita: '',
    observacion: '',
  })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [centrosData, estadosData] = await Promise.all([
          fetchCentrosAcopio(),
          fetchEstadosDonacion(),
        ])
        setCentros(centrosData)
        setEstados(estadosData)
        setForm(prev => ({
          ...prev,
          centroAcopioId: String(centrosData[0]?.id || ''),
          estadoId: String(estadosData[0]?.id || ''),
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
      await crearDonacion({
        tipoRecursoId: parseInt(form.tipoRecursoId),
        cantidad: parseFloat(form.cantidad),
        donanteUid: user.uid,
        centroAcopioId: parseInt(form.centroAcopioId),
        estado: { id: parseInt(form.estadoId) },
        fechaRegistro: new Date().toISOString().slice(0, 19),
        fechaCita: form.fechaCita ? form.fechaCita + ':00' : null,
        observacion: form.observacion || null,
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
    centros, estados, TIPOS_RECURSO,
    loading, loadingData, error, success,
  }
}