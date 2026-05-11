import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuthViewModel } from '../viewmodel/useAuthViewModel'
import { useAuth } from '../../../context/AuthContext'
import { getRolPath } from '../../../router/getRolPath'

const COLORS = {
  primary: '#E8192C',
  dark: '#22181C',
  neutral: '#7C8483',
  accent: '#F4AC45',
}

export const RegisterView = () => {
  const navigate = useNavigate()
  const { rol, isAuthenticated } = useAuth()
  const { register, loading, error: authError, clearError } = useAuthViewModel()

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (!isAuthenticated || !rol) return
    navigate(getRolPath(rol))
  }, [rol, isAuthenticated])

  const validateForm = () => {
    const errors = {}

    if (!form.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio'
    } else if (form.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!form.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Ingresa un correo válido'
    }

    if (!form.password) {
      errors.password = 'La contraseña es obligatoria'
    } else if (form.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirma tu contraseña'
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }

    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    await register({
      email: form.email,
      password: form.password,
      nombre: form.nombre,
      rolId: '1',
    })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom right, rgba(232,25,44,0.06), #FFFFFF)' }}
    >
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(232,25,44,0.10)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: 'rgba(244,172,69,0.10)' }}
      />

      <div
        className="relative w-full max-w-md rounded-[2rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl"
        style={{
          backgroundColor: 'rgba(255,255,255,0.82)',
          border: '1px solid rgba(124,132,131,0.12)',
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(232,25,44,0.10)', color: COLORS.primary }}
          >
            <UserPlus size={30} strokeWidth={2.2} />
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: COLORS.dark }}>
            Crear cuenta
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.neutral }}>
            Únete a Donaton y comienza a hacer la diferencia.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.dark }}>
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              autoComplete="name"
              className="w-full h-14 px-4 rounded-2xl outline-none transition-all duration-200 focus:scale-[1.01]"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${
                  formErrors.nombre
                    ? 'rgba(232,25,44,0.40)'
                    : 'rgba(124,132,131,0.20)'
                }`,
                color: COLORS.dark,
              }}
            />
            {formErrors.nombre && (
              <div className="flex items-center gap-1.5 mt-2">
                <AlertCircle size={14} style={{ color: COLORS.primary }} />
                <span className="text-xs font-medium" style={{ color: COLORS.primary }}>
                  {formErrors.nombre}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.dark }}>
              Correo electrónico
            </label>
            <input
              type="text"
              inputMode="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              autoComplete="email"
              className="w-full h-14 px-4 rounded-2xl outline-none transition-all duration-200 focus:scale-[1.01]"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${
                  formErrors.email
                    ? 'rgba(232,25,44,0.40)'
                    : 'rgba(124,132,131,0.20)'
                }`,
                color: COLORS.dark,
              }}
            />
            {formErrors.email && (
              <div className="flex items-center gap-1.5 mt-2">
                <AlertCircle size={14} style={{ color: COLORS.primary }} />
                <span className="text-xs font-medium" style={{ color: COLORS.primary }}>
                  {formErrors.email}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.dark }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              className="w-full h-14 px-4 rounded-2xl outline-none transition-all duration-200 focus:scale-[1.01]"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${
                  formErrors.password
                    ? 'rgba(232,25,44,0.40)'
                    : 'rgba(124,132,131,0.20)'
                }`,
                color: COLORS.dark,
              }}
            />
            {formErrors.password && (
              <div className="flex items-center gap-1.5 mt-2">
                <AlertCircle size={14} style={{ color: COLORS.primary }} />
                <span className="text-xs font-medium" style={{ color: COLORS.primary }}>
                  {formErrors.password}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: COLORS.dark }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              className="w-full h-14 px-4 rounded-2xl outline-none transition-all duration-200 focus:scale-[1.01]"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${
                  formErrors.confirmPassword
                    ? 'rgba(232,25,44,0.40)'
                    : 'rgba(124,132,131,0.20)'
                }`,
                color: COLORS.dark,
              }}
            />
            {formErrors.confirmPassword && (
              <div className="flex items-center gap-1.5 mt-2">
                <AlertCircle size={14} style={{ color: COLORS.primary }} />
                <span className="text-xs font-medium" style={{ color: COLORS.primary }}>
                  {formErrors.confirmPassword}
                </span>
              </div>
            )}
          </div>

          {authError && (
            <div
              className="rounded-2xl px-4 py-3 text-sm font-medium flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(232,25,44,0.08)',
                border: '1px solid rgba(232,25,44,0.15)',
                color: COLORS.primary,
              }}
            >
              <AlertCircle size={16} />
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            style={{
              backgroundColor: COLORS.primary,
              boxShadow: '0 10px 30px rgba(232,25,44,0.25)',
            }}
          >
            {loading ? 'Creando cuenta...' : (
              <>Crear cuenta <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(124,132,131,0.15)' }} />
          <span className="text-sm" style={{ color: COLORS.neutral }}>o</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(124,132,131,0.15)' }} />
        </div>

        <Link
          to="/login"
          className="w-full h-14 rounded-2xl flex items-center justify-center font-bold transition-all duration-200 hover:scale-[1.01]"
          style={{
            border: '1px solid rgba(232,25,44,0.15)',
            color: COLORS.primary,
            backgroundColor: 'rgba(255,255,255,0.70)',
          }}
        >
          Ya tengo cuenta
        </Link>
      </div>
    </div>
  )
}

export default RegisterView