// DonacionesOperadorViewModel.js
import { useState, useEffect } from 'react'
import { fetchDonacionesPorCentro, actualizarEstadoDonacion, entradaInventario } from '../service/LogisticaService'
import { useAuth } from '../../../context/AuthContext'

export const useDonacionesOperadorViewModel = () => {
  const { perfil } = useAuth()
  const [donaciones, setDonaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [procesando, setProcesando] = useState(null)

  useEffect(() => {
    if (!perfil?.centroAcopioId) return
    cargar()
  }, [perfil])

  const cargar = async () => {
    try {
      const data = await fetchDonacionesPorCentro(perfil.centroAcopioId)
      setDonaciones(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const marcarRecibida = async (donacion) => {
    setProcesando(donacion.id)
    try {
      await actualizarEstadoDonacion(donacion.id, 3)
      await entradaInventario({
        centroAcopioId: perfil.centroAcopioId,
        tipoRecursoId: donacion.tipoRecursoId,
        cantidad: donacion.cantidad,
      })
      await cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setProcesando(null)
    }
  }

  return { donaciones, loading, error, procesando, marcarRecibida, centroAcopioId: perfil?.centroAcopioId }
}