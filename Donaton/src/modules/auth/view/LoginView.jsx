import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthViewModel } from '../viewmodel/useAuthViewModel'
import { useAuth } from '../../../context/AuthContext'
import { getRolPath } from '../../../router/getRolPath'

export const LoginView = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, loading, error, clearError } = useAuthViewModel()
  const { rol, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated || !rol) return
    navigate(getRolPath(rol))
  }, [rol, isAuthenticated])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(form)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center mb-4">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Correo electrónico</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input input-bordered" placeholder="tu@email.com" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Contraseña</span></label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input input-bordered" placeholder="••••••••" required />
            </div>
            {error && <div className="alert alert-error text-sm"><span>{error}</span></div>}
            <button type="submit" className={`btn btn-primary w-full ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
          <div className="divider">¿No tienes cuenta?</div>
          <Link to="/register" className="btn btn-outline btn-block">Crear cuenta</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginView