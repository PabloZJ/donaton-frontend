import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { auth } from '../modules/auth/service/authService'
const Navbar = () => {
  const { user, rol, logout, isAuthenticated } = useAuth()
  auth.currentUser?.getIdToken().then(t => console.log('TOKEN:', t))
  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary">
          Donaton
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link to="/">Inicio</Link></li>
          {(rol === 'donante' || rol === 'admin') && (
            <>
            <li><Link to="/donaciones">Donaciones</Link></li>
            <li><Link to="/donaciones/crear">Crear donación</Link></li>
            </>
          )}

          {(rol === 'municipalidad' || rol === 'admin') && (
            <li><Link to="/necesidades">Necesidades</Link></li>
          )}

          {(rol === 'operador' || rol === 'admin') && (
            <>
              <li><Link to="/inventario">Inventario</Link></li>
              <li><Link to="/envios">Envíos</Link></li>
            </>
          )}

          {rol === 'admin' && (
            <li><Link to="/dashboard">Dashboard</Link></li>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-3">
        {isAuthenticated ? (
          <>
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="font-semibold text-sm">{user?.email}</span>
              <span className="text-xs opacity-60 uppercase tracking-wide">{rol}</span>
            </div>
            <button onClick={logout} className="btn btn-error btn-sm rounded-xl">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm rounded-xl">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm rounded-xl">Registro</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar