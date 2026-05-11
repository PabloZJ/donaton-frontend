import { useState, useEffect } from 'react'
import { fetchTodosUsuarios, fetchTodasDonaciones, fetchTodasNecesidades, fetchTodoInventario } from '../service/AdminService'

const TIPOS_RECURSO = [
  { id: 1, nombre: 'Agua' }, { id: 2, nombre: 'Comida no perecible' },
  { id: 3, nombre: 'Ropa' }, { id: 4, nombre: 'Medicamentos' },
  { id: 5, nombre: 'Colchones' }, { id: 6, nombre: 'Artículos de aseo' },
  { id: 7, nombre: 'Mantas' }, { id: 8, nombre: 'Pañales' },
  { id: 9, nombre: 'Leche en polvo' }, { id: 10, nombre: 'Alimentos para mascotas' },
]

export const useDashboardViewModel = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    donaciones: [],
    necesidades: [],
    inventario: [],
    usuarios: [],
  })

  useEffect(() => {
    const cargar = async () => {
      try {
        const [donData, necData, invData, usrData] = await Promise.all([
          fetchTodasDonaciones(),
          fetchTodasNecesidades(),
          fetchTodoInventario(),
          fetchTodosUsuarios(),
        ])
        setStats({
          donaciones: donData,
          necesidades: necData,
          inventario: invData,
          usuarios: usrData,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  // Donaciones por estado
  const donacionesPorEstado = (nombre) =>
    stats.donaciones.filter(d => d.estado?.nombre === nombre).length

  // Necesidades por estado
  const necesidadesPorEstado = (nombre) =>
    stats.necesidades.filter(n => n.estado?.nombre === nombre).length

  // Inventario agrupado por tipo
  const inventarioPorTipo = TIPOS_RECURSO.map(tipo => ({
    nombre: tipo.nombre,
    total: stats.inventario
      .filter(i => i.tipoRecursoId === tipo.id)
      .reduce((acc, i) => acc + parseFloat(i.cantidadDisponible), 0)
  })).filter(t => t.total > 0)

  // Usuarios por rol
  const usuariosPorRol = (rolId) =>
    stats.usuarios.filter(u => u.rol?.id === rolId).length

  return {
    loading, error,
    totalDonaciones: stats.donaciones.length,
    totalNecesidades: stats.necesidades.length,
    totalUsuarios: stats.usuarios.length,
    donacionesPorEstado,
    necesidadesPorEstado,
    inventarioPorTipo,
    usuariosPorRol,
  }
}