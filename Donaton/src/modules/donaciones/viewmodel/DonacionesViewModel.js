import { useState, useEffect } from 'react'
import { fetchDonaciones } from '../service/DonacionesService'
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

export const useDonacionesViewModel = () => {
  const { user } = useAuth()
  const [donaciones, setDonaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await fetchDonaciones()
        // solo las del donante actual
        setDonaciones(data.filter(d => d.donanteUid === user.uid))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const getTipoNombre = (id) => TIPOS_RECURSO.find(t => t.id === id)?.nombre || 'Desconocido'

  return { donaciones, loading, error, getTipoNombre }
}