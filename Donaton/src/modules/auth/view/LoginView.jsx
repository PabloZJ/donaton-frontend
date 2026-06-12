import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react'

import { useAuthViewModel } from '../viewmodel/useAuthViewModel'
import { useAuth } from '../../../context/AuthContext'
import { getRolPath } from '../../../router/getRolPath'
import { validators, validateForm } from '../../../utils/validations'

const COLORS = {
  primary: '#E8192C',
  dark: '#22181C',
  neutral: '#7C8483',
  accent: '#F4AC45',
}

const LOGIN_SCHEMA = {
  email: validators.email,
  password: validators.password,
}

export const LoginView = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState({})

  const { login, loading, error: authError, clearError } = useAuthViewModel()
  const { rol, isAuthenticated } = useAuth()
  const navigate = useNavigate()

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
    const { errors, isValid } = validateForm(form, LOGIN_SCHEMA)
    setFormErrors(errors)
    if (!isValid) return
    await login(form)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom right, rgba(232,25,44,0.06), #FFFFFF)' }}
    >
      {/* Blobs decorativos */}
      <div
        className="absolute top-0 left-0 w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'rgba(232,25,44,0.10)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-56 sm:w-80 lg:w-[28rem] h-56 sm:h-80 lg:h-[28rem] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'rgba(244,172,69,0.10)' }}
      />

      {/* Card */}
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
            <ShieldCheck size={24} strokeWidth={2.2} className="sm:hidden" />
            <ShieldCheck size={30} strokeWidth={2.2} className="hidden sm:block" />
          </div>

          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-black mb-1.5 sm:mb-2"
            style={{ color: COLORS.dark }}
          >
            Bienvenido de nuevo
          </h1>
          <p
            className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto"
            style={{ color: COLORS.neutral }}
          >
            Inicia sesión para acceder a la plataforma Donaton y gestionar ayuda humanitaria.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div>
            <label
              className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2"
              style={{ color: COLORS.dark }}
            >
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
              className="w-full h-11 sm:h-13 lg:h-14 px-3 sm:px-4 rounded-xl sm:rounded-2xl outline-none transition-all duration-200 focus:scale-[1.01] text-sm sm:text-base"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${formErrors.email ? 'rgba(232,25,44,0.40)' : 'rgba(124,132,131,0.20)'}`,
                color: COLORS.dark,
              }}
            />
            {formErrors.email && (
              <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2">
                <AlertCircle size={13} style={{ color: COLORS.primary }} />
                <span className="text-xs font-medium" style={{ color: COLORS.primary }}>
                  {formErrors.email}
                </span>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2"
              style={{ color: COLORS.dark }}
            >
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full h-11 sm:h-13 lg:h-14 px-3 sm:px-4 rounded-xl sm:rounded-2xl outline-none transition-all duration-200 focus:scale-[1.01] text-sm sm:text-base"
              style={{
                backgroundColor: '#FFFFFF',
                border: `1px solid ${formErrors.password ? 'rgba(232,25,44,0.40)' : 'rgba(124,132,131,0.20)'}`,
                color: COLORS.dark,
              }}
            />
            {formErrors.password && (
              <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2">
                <AlertCircle size={13} style={{ color: COLORS.primary }} />
                <span className="text-xs font-medium" style={{ color: COLORS.primary }}>
                  {formErrors.password}
                </span>
              </div>
            )}
          </div>

          {/* Auth error */}
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
            {loading ? 'Ingresando...' : (<>Ingresar <ArrowRight size={17} /></>)}
          </button>
        </form>

        <div className="flex items-center gap-3 sm:gap-4 my-5 sm:my-7">
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(124,132,131,0.15)' }} />
          <span className="text-xs sm:text-sm" style={{ color: COLORS.neutral }}>o</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(124,132,131,0.15)' }} />
        </div>

        <Link
          to="/register"
          className="w-full h-11 sm:h-13 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 hover:scale-[1.01]"
          style={{
            border: '1px solid rgba(232,25,44,0.15)',
            color: COLORS.primary,
            backgroundColor: 'rgba(255,255,255,0.70)',
          }}
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  )
}

export default LoginView