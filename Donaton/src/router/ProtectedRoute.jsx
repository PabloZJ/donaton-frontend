import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'

const ProtectedRoute = ({ children, roles }) => {
  const { user, rol, loading } = useAuth()

  if (loading || (user && !rol)) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(rol)) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute