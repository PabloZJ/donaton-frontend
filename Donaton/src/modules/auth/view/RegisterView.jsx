import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthViewModel } from '../viewmodel/useAuthViewModel'
import { useAuth } from '../../../context/AuthContext'
import { getRolPath } from '../../../router/getRolPath'

const ROLES = [
  { id: 1, label: 'Donante' },
  { id: 2, label: 'Municipalidad' },
  { id: 3, label: 'Operador de Logística' },
]

export const RegisterView = () => {
  const navigate = useNavigate()
  const { rol, isAuthenticated } = useAuth()
  const { register, loading, error, clearError } = useAuthViewModel()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmPassword: '', rolId: '1' })
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !rol) return
    navigate(getRolPath(rol))
  }, [rol, isAuthenticated])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    clearError()
    setValidationError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) return setValidationError('Las contraseñas no coinciden')
    if (form.password.length < 6) return setValidationError('La contraseña debe tener al menos 6 caracteres')
    await register({ email: form.email, password: form.password, nombre: form.nombre, rolId: form.rolId })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center mb-4">Crear Cuenta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Nombre completo</span></label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} className="input input-bordered" placeholder="Tu nombre" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Correo electrónico</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input input-bordered" placeholder="tu@email.com" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Tipo de usuario</span></label>
              <select name="rolId" value={form.rolId} onChange={handleChange} className="select select-bordered w-full">
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Contraseña</span></label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input input-bordered" placeholder="Mínimo 6 caracteres" required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Confirmar contraseña</span></label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input input-bordered" placeholder="Repite tu contraseña" required />
            </div>
            {(validationError || error) && (
              <div className="alert alert-error text-sm"><span>{validationError || error}</span></div>
            )}
            <button type="submit" className={`btn btn-primary w-full ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>
          <div className="divider">¿Ya tienes cuenta?</div>
          <Link to="/login" className="btn btn-outline btn-block">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterView