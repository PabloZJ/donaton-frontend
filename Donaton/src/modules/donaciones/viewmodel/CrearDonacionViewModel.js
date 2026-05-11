// useCrearDonacionViewModel.js
import { useState, useEffect } from 'react'
import { fetchCentrosAcopio, crearDonacion } from '../service/DonacionesService'
import { useAuth } from '../../../context/AuthContext'

export const useCrearDonacionViewModel = () => {
  const { user } = useAuth()
  const [centros, setCentros] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    tipoRecursoId: '1',
    cantidad: '',
    centroAcopioId: '',
    fechaCita: '',
    observacion: '',
  })

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const centrosData = await fetchCentrosAcopio()
        setCentros(centrosData)
        setForm(prev => ({
          ...prev,
          centroAcopioId: String(centrosData[0]?.id || ''),
        }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingData(false)
      }
    }
    cargarDatos()
  }, [])

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

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
        estado: { id: 1 },
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

  return { form, handleChange, handleSubmit, centros, loading, loadingData, error, success }
}