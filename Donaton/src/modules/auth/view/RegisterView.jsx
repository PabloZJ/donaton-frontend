import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuthViewModel } from '../viewmodel/useAuthViewModel'
import { useAuth } from '../../../context/AuthContext'
import { getRolPath } from '../../../router/getRolPath'
import { validators, validateForm, withMinLength, compose } from '../../../utils/validations'

const COLORS = {
  primary: '#E8192C',
  dark: '#22181C',
  neutral: '#7C8483',
  accent: '#F4AC45',
}

const REGISTER_SCHEMA = {
  nombre: compose(
    withMinLength(2, 'El nombre'),
    (v) => validators.required(v, 'El nombre'),
  ),
  email: validators.email,
  password: validators.password,
  confirmPassword: (value, form) =>
    !value
      ? 'Confirma tu contraseña'
      : value !== form.password
      ? 'Las contraseñas no coinciden'
      : null,
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { errors, isValid } = validateForm(form, REGISTER_SCHEMA)
    setFormErrors(errors)
    if (!isValid) return
    await register({ email: form.email, password: form.password, nombre: form.nombre, rolId: '1' })
  }

  const inputClass = "w-full h-11 sm:h-13 lg:h-14 px-3 sm:px-4 rounded-xl sm:rounded-2xl outline-none transition-all duration-200 focus:scale-[1.01] text-sm sm:text-base"
  const borderStyle = (field) => ({
    backgroundColor: '#FFFFFF',
    border: `1px solid ${formErrors[field] ? 'rgba(232,25,44,0.40)' : 'rgba(124,132,131,0.20)'}`,
    color: COLORS.dark,
  })

  const FieldError = ({ field }) => formErrors[field] ? (
    <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2">
      <AlertCircle size={13} style={{ color: COLORS.primary }} />
      <span className="text-xs font-medium" style={{ color: COLORS.primary }}>
        {formErrors[field]}
      </span>
    </div>
  ) : null

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom right, rgba(232,25,44,0.06), #FFFFFF)' }}
    >
      <div
        className="absolute top-0 right-0 w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'rgba(232,25,44,0.10)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-56 sm:w-80 lg:w-[28rem] h-56 sm:h-80 lg:h-[28rem] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'rgba(244,172,69,0.10)' }}
      />

      <div
        className="relative w-full max-w-[92vw] sm:max-w-md rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl"
        style={{
          backgroundColor: 'rgba(255,255,255,0.82)',
          border: '1px solid rgba(124,132,131,0.12)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(232,25,44,0.10)', color: COLORS.primary }}
          >
            <UserPlus size={24} strokeWidth={2.2} className="sm:hidden" />
            <UserPlus size={30} strokeWidth={2.2} className="hidden sm:block" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black mb-1.5 sm:mb-2" style={{ color: COLORS.dark }}>
            Crear cuenta
          </h1>
          <p className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto" style={{ color: COLORS.neutral }}>
            Únete a Donaton y comienza a hacer la diferencia.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: COLORS.dark }}>
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              autoComplete="name"
              className={inputClass}
              style={borderStyle('nombre')}
            />
            <FieldError field="nombre" />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: COLORS.dark }}>
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
              className={inputClass}
              style={borderStyle('email')}
            />
            <FieldError field="email" />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: COLORS.dark }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              className={inputClass}
              style={borderStyle('password')}
            />
            <FieldError field="password" />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2" style={{ color: COLORS.dark }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              className={inputClass}
              style={borderStyle('confirmPassword')}
            />
            <FieldError field="confirmPassword" />
          </div>

          {authError && (
            <div
              className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(232,25,44,0.08)',
                border: '1px solid rgba(232,25,44,0.15)',
                color: COLORS.primary,
              }}
            >
              <AlertCircle size={15} className="shrink-0" />
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 sm:h-13 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-sm sm:text-base transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
            style={{
              backgroundColor: COLORS.primary,
              boxShadow: '0 8px 24px rgba(232,25,44,0.25)',
            }}
          >
            {loading ? 'Creando cuenta...' : (<>Crear cuenta <ArrowRight size={17} /></>)}
          </button>
        </form>

        <div className="flex items-center gap-3 sm:gap-4 my-5 sm:my-7">
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(124,132,131,0.15)' }} />
          <span className="text-xs sm:text-sm" style={{ color: COLORS.neutral }}>o</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(124,132,131,0.15)' }} />
        </div>

        <Link
          to="/login"
          className="w-full h-11 sm:h-13 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 hover:scale-[1.01]"
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