import { useState, useEffect } from 'react'
import {
  fetchAsignaciones,
  fetchInventarioPorCentro,
  fetchNecesidadesPorCentro,
  crearAsignacion,
  restarInventario,
  actualizarNecesidad,
  fetchComunaPorId,
} from '../service/LogisticaService'
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

  const enriquecerNecesidades = async (necesidadesRaw) => {
    const comunaIds = [...new Set(necesidadesRaw.map(n => n.comunaId).filter(Boolean))]
    
    if (comunaIds.length === 0) return necesidadesRaw.map(n => ({ ...n, nombreComuna: 'Sin comuna' }))

    const comunas = await Promise.all(
      comunaIds.map(async (id) => {
        try {
          const comuna = await fetchComunaPorId(id)
          return { id, nombre: comuna?.nombre || 'Sin comuna' }
        } catch {
          return { id, nombre: 'Sin comuna' }
        }
      })
    )

    const comunaMap = Object.fromEntries(comunas.map(c => [c.id, c.nombre]))

    return necesidadesRaw.map(n => ({
      ...n,
      nombreComuna: n.comunaId ? comunaMap[n.comunaId] : 'Sin comuna',
    }))
  }

  useEffect(() => {
    if (!perfil?.centroAcopioId) {
      setLoadingData(false)
      return
    }

    const cargar = async () => {
      try {
        const [asigData, invData, necDataRaw] = await Promise.all([
          fetchAsignaciones(),
          fetchInventarioPorCentro(perfil.centroAcopioId),
          fetchNecesidadesPorCentro(perfil.centroAcopioId),
        ])

        const necData = await enriquecerNecesidades(necDataRaw)

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

    if (name === 'tipoRecursoId') {
      const filtradas = necesidades.filter(n => n.tipoRecursoId === parseInt(value))
      setNecesidadesFiltradas(filtradas)
      setForm(prev => ({
        ...prev,
        tipoRecursoId: value,
        necesidadId: String(filtradas[0]?.id || ''),
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!form.tipoRecursoId || !form.necesidadId || !form.cantidadAsignada) {
        throw new Error('Completa todos los campos')
      }

      const cantidad = parseFloat(form.cantidadAsignada)
      if (cantidad <= 0) throw new Error('La cantidad debe ser mayor a 0')

      const necesidadActual = necesidades.find(n => n.id === parseInt(form.necesidadId))
      if (!necesidadActual) throw new Error('Necesidad no encontrada')

      const recursoActual = inventario.find(i => i.tipoRecursoId === parseInt(form.tipoRecursoId))
      if (!recursoActual || recursoActual.cantidadDisponible < cantidad) {
        throw new Error('No hay suficiente inventario disponible')
      }

      const nuevaCantidadCubierta = parseFloat(necesidadActual.cantidadCubierta || 0) + cantidad

      await crearAsignacion({
        necesidadId: parseInt(form.necesidadId),
        cantidadAsignada: cantidad,
        fechaAsignacion: new Date().toISOString().slice(0, 19),
        responsableUid: user.uid,
        centroAcopioId: perfil.centroAcopioId,
      })

      await restarInventario({
        centroAcopioId: perfil.centroAcopioId,
        tipoRecursoId: parseInt(form.tipoRecursoId),
        cantidad: cantidad,
      })

      await actualizarNecesidad(parseInt(form.necesidadId), {
        cantidadCubierta: nuevaCantidadCubierta,
      })

      const [asigData, invData, necDataRaw] = await Promise.all([
        fetchAsignaciones(),
        fetchInventarioPorCentro(perfil.centroAcopioId),
        fetchNecesidadesPorCentro(perfil.centroAcopioId),
      ])

      const necData = await enriquecerNecesidades(necDataRaw)

      setAsignaciones(asigData)
      setInventario(invData)
      setNecesidades(necData)
      setNecesidadesFiltradas(necData.filter(n => n.tipoRecursoId === parseInt(form.tipoRecursoId)))
      setSuccess(true)
      setForm(prev => ({ ...prev, cantidadAsignada: '' }))
    } catch (err) {
      setError(err.message || 'Error al asignar recurso')
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