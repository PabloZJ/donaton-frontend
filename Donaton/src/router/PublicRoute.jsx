import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { getRolPath } from './getRolPath.js'

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, rol } = useAuth()

  if (loading || (isAuthenticated && !rol)) return <LoadingSpinner />
  if (isAuthenticated && rol) return <Navigate to={getRolPath(rol)} replace />

  return children
}

export default PublicRoute