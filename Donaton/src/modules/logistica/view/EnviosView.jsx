import { useState, useEffect, useRef } from 'react'
import { useEnviosViewModel } from '../viewmodel/EnviosViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'
import {
  Truck, MapPin, Calendar, Inbox, CheckCircle2,
  Clock3, PackageCheck, ChevronDown, Check, AlertCircle,
} from 'lucide-react'
import { validators, validateForm } from '../../../utils/validations'

const ESTADOS = {
  planificado: { style: 'bg-[rgba(244,172,69,0.12)] text-[#B87A00]', icon: Clock3 },
  'en camino': { style: 'bg-[rgba(59,130,246,0.10)] text-[#2563EB]', icon: Truck },
  entregado:   { style: 'bg-[rgba(34,197,94,0.10)] text-[#16A34A]', icon: PackageCheck },
}

const ENVIO_SCHEMA = {
  destino:         (v) => validators.required(v, 'El destino'),
  comunaId:        (v) => validators.select(v, 'una comuna'),
  fechaPlanificada:(v) => validators.date(v, { label: 'La fecha planificada', min: new Date().toISOString().split('T')[0] }),
}

const EnviosView = () => {
  const {
    envios, comunas, form, handleChange, handleSubmit,
    loading, loadingData, error, success, getComunaNombre,
  } = useEnviosViewModel()

  const [formErrors, setFormErrors] = useState({})
  const [comunaOpen, setComunaOpen] = useState(false)
  const comunaRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (comunaRef.current && !comunaRef.current.contains(e.target)) setComunaOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loadingData) return <LoadingSpinner />

  // Normalizar ID a número desde el principio
  const comunaId = form.comunaId !== '' ? Number(form.comunaId) : null
  const comunaSeleccionada = comunas.find(c => c.id === comunaId)

  const handleSelectComuna = (id) => {
    handleChange({ target: { name: 'comunaId', value: String(id) } })
    if (formErrors.comunaId) setFormErrors(prev => ({ ...prev, comunaId: '' }))
    setComunaOpen(false)
  }

  const handleChangeWithClear = (e) => {
    const { name } = e.target
    handleChange(e)
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmitWithValidation = (e) => {
    e.preventDefault()
    const { errors, isValid } = validateForm(form, ENVIO_SCHEMA)
    setFormErrors(errors)
    if (!isValid) return
    handleSubmit(e)
  }

  const FieldError = ({ field }) => formErrors[field] ? (
    <div className="flex items-center gap-1.5 mt-1.5">
      <AlertCircle size={13} className="text-red-600 shrink-0" />
      <span className="text-xs font-medium text-red-600">{formErrors[field]}</span>
    </div>
  ) : null

  const FieldLabel = ({ field, children }) => (
    <label className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 transition-colors ${
      formErrors[field] ? 'text-red-600' : 'text-[var(--color-dark)]'
    }`}>
      {children}
    </label>
  )

  const inputClass = (field) =>
    `w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl border px-4 sm:px-5 text-sm outline-none bg-white text-[var(--color-dark)] transition-all ${
      formErrors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-[rgba(124,132,131,0.18)] focus:border-[var(--color-primary)]'
    }`

  const dropdownBtnClass = (field) =>
    `w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl border outline-none pl-3 sm:pl-4 pr-3 sm:pr-4 text-sm font-medium bg-white transition-all flex items-center gap-2 sm:gap-3 text-[var(--color-dark)] ${
      formErrors[field]
        ? 'border-red-400'
        : 'border-[rgba(124,132,131,0.18)]'
    }`

  return (
    <div className="min-h-screen px-3 sm:px-4 lg:px-6 py-8 sm:py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-5xl mx-auto relative flex flex-col gap-6 sm:gap-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1 sm:mb-2 text-[var(--color-primary)]">Logística</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--color-dark)]">Gestión de Envíos</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[var(--color-neutral)]">Planifica y controla los envíos de ayuda humanitaria.</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[10px]">
          <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)] shrink-0">
              <Truck size={18} className="sm:hidden" />
              <Truck size={22} className="hidden sm:block" />
            </div>
            <div>
              <h2 className="font-black text-base sm:text-xl text-[var(--color-dark)]">Nuevo Envío</h2>
              <p className="text-xs sm:text-sm text-[var(--color-neutral)]">Todos los envíos nuevos quedan automáticamente planificados.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitWithValidation} className="space-y-4 sm:space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Destino */}
              <div>
                <FieldLabel field="destino">Destino</FieldLabel>
                <input
                  type="text" name="destino" value={form.destino}
                  onChange={handleChangeWithClear}
                  placeholder="Dirección del envío"
                  className={inputClass('destino')}
                />
                <FieldError field="destino" />
              </div>

              {/* Comuna */}
              <div className="relative" ref={comunaRef}>
                <FieldLabel field="comunaId">Comuna</FieldLabel>
                <button type="button" onClick={() => setComunaOpen(!comunaOpen)} className={dropdownBtnClass('comunaId')}>
                  <MapPin size={16} className="text-[var(--color-primary)] shrink-0 sm:hidden" />
                  <MapPin size={18} className="text-[var(--color-primary)] shrink-0 hidden sm:block" />
                  <span className="flex-1 text-left truncate">{comunaSeleccionada?.nombre || 'Seleccionar comuna'}</span>
                  <ChevronDown size={16} className={`text-[var(--color-neutral)] transition-transform shrink-0 ${comunaOpen ? 'rotate-180' : ''}`} />
                </button>
                <FieldError field="comunaId" />

                {comunaOpen && (
                  <div className="absolute z-50 w-full mt-2 rounded-xl sm:rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)] max-h-64 overflow-y-auto">
                    {comunas.map((c) => {
                      const isSelected = comunaId === c.id
                      return (
                        <button
                          key={c.id} type="button"
                          onClick={() => handleSelectComuna(c.id)}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-sm font-medium transition-all ${
                            isSelected ? 'bg-[rgba(232,25,44,0.06)] text-[var(--color-primary)]' : 'text-[var(--color-dark)] hover:bg-gray-50'
                          }`}
                        >
                          <MapPin size={15} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />
                          <span className="flex-1 text-left">{c.nombre}</span>
                          {isSelected && <Check size={15} className="text-[var(--color-primary)] shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Fecha */}
            <div className="w-full sm:max-w-sm">
              <FieldLabel field="fechaPlanificada">Fecha planificada</FieldLabel>
              <input
                type="date" name="fechaPlanificada" value={form.fechaPlanificada}
                onChange={handleChangeWithClear}
                className={inputClass('fechaPlanificada')}
              />
              <FieldError field="fechaPlanificada" />
            </div>

            {error && (
              <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)] text-[#16A34A] flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" />
                Envío creado correctamente
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-base transition-all hover:scale-[1.01] disabled:opacity-50 bg-[var(--color-primary)] shadow-[0_10px_30px_rgba(232,25,44,0.20)]"
            >
              {loading ? 'Procesando...' : 'Crear envío'}
            </button>
          </form>
        </div>

        {/* Historial */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-[var(--color-dark)]">Historial de Envíos</h2>

          {envios.length === 0 ? (
            <div className="rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)]">
                <Inbox size={28} className="sm:hidden text-[var(--color-neutral)]" />
                <Inbox size={36} className="hidden sm:block text-[var(--color-neutral)]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black mb-2 text-[var(--color-dark)]">No hay envíos</h3>
              <p className="text-xs sm:text-sm text-[var(--color-neutral)]">Aún no existen envíos registrados.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {envios.map(e => {
                const estado = ESTADOS[e.estado?.nombre] || {}
                const Icono = estado.icon || Truck

                return (
                  <div
                    key={e.id}
                    className="rounded-2xl sm:rounded-[1.75rem] p-4 sm:p-6 bg-[rgba(255,255,255,0.85)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[10px] transition-all hover:shadow-lg"
                  >
                    {/* Fila icono + info */}
                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                        <Truck size={17} className="sm:hidden" />
                        <Truck size={20} className="hidden sm:block" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Destino + badge en flex-wrap para que el badge baje si no cabe */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-black text-base sm:text-lg text-[var(--color-dark)] truncate">
                            {e.destino}
                          </h3>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg sm:rounded-xl flex items-center gap-1.5 shrink-0 ${estado.style}`}>
                            <Icono size={13} />
                            {e.estado?.nombre}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 text-xs sm:text-sm text-[var(--color-neutral)]">
                          <p className="flex items-center gap-1.5">
                            <MapPin size={13} className="shrink-0" />
                            {e.comuna?.nombre || getComunaNombre(e.comunaId)}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Calendar size={13} className="shrink-0" />
                            {new Date(e.fechaPlanificada).toLocaleDateString('es-CL')}
                          </p>
                          {e.fechaEntrega && (
                            <p className="flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="shrink-0" />
                              Entregado el {new Date(e.fechaEntrega).toLocaleDateString('es-CL')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default EnviosView