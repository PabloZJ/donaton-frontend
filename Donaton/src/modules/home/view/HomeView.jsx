import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { getRolPath } from '../../../router/GetRolPath'

const HomeView = () => {
  const { isAuthenticated, rol } = useAuth()

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero */}
      <div className="hero min-h-[60vh] bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-extrabold text-primary mb-4">Donaton</h1>
            <p className="text-xl opacity-70 mb-8">
              Conectamos donantes con centros de acopio para ayudar a quienes más lo necesitan.
            </p>
            {isAuthenticated ? (
              <Link to={getRolPath(rol)} className="btn btn-primary btn-lg">
                Ir a mi panel
              </Link>
            ) : (
              <div className="flex gap-4 justify-center">
                <Link to="/register" className="btn btn-primary btn-lg">Comenzar</Link>
                <Link to="/login" className="btn btn-outline btn-lg">Iniciar sesión</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="card-title">Dona</h3>
                <p className="opacity-60">Registra tu donación y elige un centro de acopio cercano.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <div className="text-5xl mb-4">🏢</div>
                <h3 className="card-title">Acopiamos</h3>
                <p className="opacity-60">Los centros de acopio reciben y organizan las donaciones.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="card-title">Ayudamos</h3>
                <p className="opacity-60">Los recursos llegan a las comunidades que más los necesitan.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeView