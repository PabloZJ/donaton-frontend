import { useState, useEffect } from 'react'
import { fetchInventarioPorCentro } from '../service/LogisticaService'
import { useAuth } from '../../../context/AuthContext'

export const useInventarioViewModel = () => {
  const { perfil } = useAuth()
  const [inventario, setInventario] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!perfil?.centroAcopioId) return
    const cargar = async () => {
      try {
        const data = await fetchInventarioPorCentro(perfil.centroAcopioId)
        setInventario(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [perfil])

  return { inventario, loading, error, centroAcopioId: perfil?.centroAcopioId }
}