// useAsignacionesViewModel.js
import { useState, useEffect } from 'react'
import { fetchAsignaciones, fetchInventarioPorCentro, fetchNecesidadesPorCentro, crearAsignacion, restarInventario, actualizarNecesidad } from '../service/LogisticaService'
import { useAuth } from '../../../context/AuthContext'

export const useAsignacionesViewModel = () => {
  const { user, perfil } = useAuth()
  const [asignaciones, setAsignaciones] = useState([])
  const [inventario, setInventario] = useState([])
  const [necesidades, setNecesidades] = useState([])
  const [necesidadesFiltradas, setNecesidadesFiltradas] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    tipoRecursoId: '',
    necesidadId: '',
    cantidadAsignada: '',
  })

  useEffect(() => {
    if (!perfil?.centroAcopioId) return
    const cargar = async () => {
      try {
        const [asigData, invData, necData] = await Promise.all([
          fetchAsignaciones(),
          fetchInventarioPorCentro(perfil.centroAcopioId),
          fetchNecesidadesPorCentro(perfil.centroAcopioId),
        ])
        setAsignaciones(asigData)
        setInventario(invData)
        setNecesidades(necData)

        const primerTipo = invData[0]?.tipoRecursoId
        const filtradas = necData.filter(n => n.tipoRecursoId === primerTipo)
        setNecesidadesFiltradas(filtradas)

        setForm(prev => ({
          ...prev,
          tipoRecursoId: String(primerTipo || ''),
          necesidadId: String(filtradas[0]?.id || ''),
        }))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingData(false)
      }
    }
    cargar()
  }, [perfil])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    if (name === 'tipoRecursoId') {
      const filtradas = necesidades.filter(n => n.tipoRecursoId === parseInt(value))
      setNecesidadesFiltradas(filtradas)
      setForm(prev => ({ ...prev, tipoRecursoId: value, necesidadId: String(filtradas[0]?.id || '') }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const necesidadActual = necesidades.find(n => n.id === parseInt(form.necesidadId))
      const nuevaCantidadCubierta = parseFloat(necesidadActual.cantidadCubierta || 0) + parseFloat(form.cantidadAsignada)

      await crearAsignacion({
        necesidadId: parseInt(form.necesidadId),
        cantidadAsignada: parseFloat(form.cantidadAsignada),
        fechaAsignacion: new Date().toISOString().slice(0, 19),
        responsableUid: user.uid,
      })

      await restarInventario({
        centroAcopioId: perfil.centroAcopioId,
        tipoRecursoId: parseInt(form.tipoRecursoId),
        cantidad: parseFloat(form.cantidadAsignada),
      })

      await actualizarNecesidad(parseInt(form.necesidadId), {
        cantidadCubierta: nuevaCantidadCubierta,
      })

      const [asigData, invData, necData] = await Promise.all([
        fetchAsignaciones(),
        fetchInventarioPorCentro(perfil.centroAcopioId),
        fetchNecesidadesPorCentro(perfil.centroAcopioId),
      ])
      setAsignaciones(asigData)
      setInventario(invData)
      setNecesidades(necData)
      setNecesidadesFiltradas(necData.filter(n => n.tipoRecursoId === parseInt(form.tipoRecursoId)))
      setSuccess(true)
      setForm(prev => ({ ...prev, cantidadAsignada: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    asignaciones, inventario, necesidadesFiltradas,
    form, handleChange, handleSubmit,
    loading, loadingData, error, success,
    centroAcopioId: perfil?.centroAcopioId,
  }
}