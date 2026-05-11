// ViewModel
import { useState, useEffect } from 'react'
import { fetchComunaPorId, fetchCentrosPorRegion, crearNecesidad } from '../service/NecesidadesService'
import { useAuth } from '../../../context/AuthContext'

export const useReportarNecesidadViewModel = () => {
  const { user, perfil } = useAuth()
  const [centros, setCentros] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    tipoRecursoId: '1',
    cantidad: '',
    descripcion: '',
    direccion: '',
    centroAcopioId: '',
  })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const comuna = await fetchComunaPorId(perfil.comunaId)
        const centrosData = await fetchCentrosPorRegion(comuna.region.id)
        setCentros(centrosData)
        setForm(prev => ({ ...prev, centroAcopioId: String(centrosData[0]?.id || '') }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingData(false)
      }
    }
    if (perfil?.comunaId) cargarDatos()
  }, [perfil])

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

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
        comunaId: perfil.comunaId,
        centroAcopioId: parseInt(form.centroAcopioId),
        estado: { id: 1 },
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

  return { form, handleChange, handleSubmit, centros, loading, loadingData, error, success }
}