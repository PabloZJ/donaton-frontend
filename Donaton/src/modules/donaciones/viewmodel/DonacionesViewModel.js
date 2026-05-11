// useDonacionesViewModel.js
import { useState, useEffect } from 'react'
import { fetchDonaciones } from '../service/DonacionesService'
import { useAuth } from '../../../context/AuthContext'

export const useDonacionesViewModel = () => {
  const { user } = useAuth()
  const [donaciones, setDonaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await fetchDonaciones()
        setDonaciones(data.filter(d => d.donanteUid === user.uid))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  return { donaciones, loading, error }
}