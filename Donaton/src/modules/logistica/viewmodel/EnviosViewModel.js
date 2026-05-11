import { useState, useEffect } from 'react'
import { fetchEnvios, fetchEstadosEnvio, fetchCentrosAcopio, fetchComunas, crearEnvio } from '../service/LogisticaService'
import { useAuth } from '../../../context/AuthContext'

export const useEnviosViewModel = () => {
  const { user, perfil } = useAuth()
  const [envios, setEnvios] = useState([])
  const [estados, setEstados] = useState([])
  const [centros, setCentros] = useState([])
  const [comunas, setComunas] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    destino: '',
    comunaId: '',
    estadoId: '',
    fechaPlanificada: '',
  })

  useEffect(() => {
    const cargar = async () => {
      try {
        const [enviosData, estadosData, centrosData, comunasData] = await Promise.all([
          fetchEnvios(),
          fetchEstadosEnvio(),
          fetchCentrosAcopio(),
          fetchComunas(),
        ])
        setEnvios(enviosData)
        setEstados(estadosData)
        setCentros(centrosData)
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
    cargar()
  }, [])

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const centroId = perfil?.centroAcopioId
      const centro = centros.find(c => c.id === centroId)
      await crearEnvio({
        centroAcopio: { id: centroId },
        destino: form.destino,
        comuna: { id: parseInt(form.comunaId) },
        fechaPlanificada: form.fechaPlanificada,
        estado: { id: parseInt(form.estadoId) },
        responsableUid: user.uid,
      })
      const enviosData = await fetchEnvios()
      setEnvios(enviosData)
      setSuccess(true)
      setForm(prev => ({ ...prev, destino: '', fechaPlanificada: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getComunaNombre = (id) => comunas.find(c => c.id === id)?.nombre || id

  return {
    envios, estados, centros, comunas,
    form, handleChange, handleSubmit,
    loading, loadingData, error, success,
    getComunaNombre,
  }
}