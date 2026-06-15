import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, MapPin, Package, FileText, Building2,
  ArrowLeft, Send, ClipboardList, ChevronDown, Check, AlertCircle,
} from 'lucide-react'
import { TIPOS_RECURSO } from '../../../utils/recursos'
import { useReportarNecesidadViewModel } from '../viewmodel/ReportarNecesidadViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { validators, validateForm, withQuantity } from '../../../utils/validations'

const SCHEMA = {
  tipoRecursoId: (v) => validators.select(v, 'un tipo de recurso'),
  cantidad:      withQuantity({ min: 0.1, label: 'La cantidad', integer: false }),
  direccion:     (v) => validators.required(v, 'La dirección'),
  centroAcopioId:(v) => validators.select(v, 'un centro de acopio'),
}

const ReportarNecesidadView = () => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [centroDropdownOpen, setCentroDropdownOpen] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const dropdownRef = useRef(null)
  const centroDropdownRef = useRef(null)

  const { form, handleChange, handleSubmit, centros, loading, loadingData, error, success } = useReportarNecesidadViewModel()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
      if (centroDropdownRef.current && !centroDropdownRef.current.contains(e.target)) setCentroDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => { if (success) navigate('/necesidades') }, [success])

  if (loadingData) return <LoadingSpinner />

  const centroId = form.centroAcopioId !== '' ? Number(form.centroAcopioId) : null
  const tipoId   = form.tipoRecursoId  !== '' ? Number(form.tipoRecursoId)  : null

  const centroSeleccionado = centros.find(c => c.id === centroId)
  const tipoSeleccionado   = TIPOS_RECURSO.find(t => t.id === tipoId)
  const IconoSeleccionado  = tipoSeleccionado?.icono || Package

  const handleSelectTipo = (id) => {
    handleChange({ target: { name: 'tipoRecursoId', value: String(id) } })
    if (formErrors.tipoRecursoId) setFormErrors(prev => ({ ...prev, tipoRecursoId: '' }))
    setDropdownOpen(false)
  }

  const handleSelectCentro = (id) => {
    handleChange({ target: { name: 'centroAcopioId', value: String(id) } })
    if (formErrors.centroAcopioId) setFormErrors(prev => ({ ...prev, centroAcopioId: '' }))
    setCentroDropdownOpen(false)
  }

  const handleChangeWithClear = (e) => {
    const { name } = e.target
    handleChange(e)
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmitWithValidation = (e) => {
    e.preventDefault()
    const { errors, isValid } = validateForm(form, SCHEMA)
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
    <label className={`text-xs sm:text-sm font-semibold block mb-1.5 sm:mb-2 transition-colors ${
      formErrors[field] ? 'text-red-600' : 'text-[var(--color-dark)]'
    }`}>
      {children}
    </label>
  )

  const inputClass = (field) =>
    `w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl border px-4 sm:px-5 text-sm outline-none bg-white transition-all focus:scale-[1.01] text-[var(--color-dark)] ${
      formErrors[field] ? 'border-red-400' : 'border-[rgba(124,132,131,0.18)]'
    }`

  return (
    <div className="min-h-screen px-3 sm:px-4 lg:px-6 py-8 sm:py-12 relative overflow-hidden bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.07)]" />

      <div className="max-w-3xl mx-auto relative">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
              <AlertTriangle size={20} className="sm:hidden" />
              <AlertTriangle size={30} className="hidden sm:block" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1 sm:mb-2 text-[var(--color-primary)]">Municipalidad</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-[var(--color-dark)]">Reportar Necesidad</h1>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed text-[var(--color-neutral)]">
                Registra recursos necesarios para coordinar ayuda humanitaria y distribución eficiente.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/necesidades')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-white transition-all hover:scale-[1.02] border border-[rgba(124,132,131,0.15)] text-[var(--color-dark)] text-sm font-medium shrink-0"
          >
            <ArrowLeft size={16} className="sm:hidden" />
            <ArrowLeft size={18} className="hidden sm:block" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>

        {/* Formulario */}
        <div className="rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[10px]">
          <form onSubmit={handleSubmitWithValidation} className="space-y-6 sm:space-y-8">

            {/* Paso 1 */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <ClipboardList size={16} className="sm:hidden text-[var(--color-primary)]" />
                <ClipboardList size={18} className="hidden sm:block text-[var(--color-primary)]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 1 · Recurso solicitado</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Tipo de recurso */}
                <div className="relative" ref={dropdownRef}>
                  <FieldLabel field="tipoRecursoId">Tipo de recurso</FieldLabel>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl border outline-none pl-3 sm:pl-4 pr-3 sm:pr-4 text-sm font-medium bg-white transition-all flex items-center gap-2 sm:gap-3 text-[var(--color-dark)] ${
                      formErrors.tipoRecursoId ? 'border-red-400' : 'border-[rgba(124,132,131,0.18)]'
                    }`}
                  >
                    <IconoSeleccionado size={18} className="text-[var(--color-primary)] shrink-0" />
                    <span className="flex-1 text-left truncate">{tipoSeleccionado?.nombre || 'Seleccionar'}</span>
                    <ChevronDown size={16} className={`text-[var(--color-neutral)] transition-transform shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <FieldError field="tipoRecursoId" />

                  {dropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl sm:rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)] max-h-56 overflow-y-auto">
                      {TIPOS_RECURSO.map((tipo) => {
                        const Icono = tipo.icono
                        const isSelected = tipoId === tipo.id
                        return (
                          <button
                            key={tipo.id} type="button"
                            onClick={() => handleSelectTipo(tipo.id)}
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-sm font-medium transition-all ${
                              isSelected ? 'bg-[rgba(232,25,44,0.06)] text-[var(--color-primary)]' : 'text-[var(--color-dark)] hover:bg-gray-50'
                            }`}
                          >
                            <Icono size={16} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />
                            <span className="flex-1 text-left">{tipo.nombre}</span>
                            {isSelected && <Check size={15} className="text-[var(--color-primary)] shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Cantidad */}
                <div>
                  <FieldLabel field="cantidad">
                    Cantidad requerida
                    {tipoSeleccionado && <span className="ml-2 text-xs font-medium text-[var(--color-neutral)]">({tipoSeleccionado.unidad})</span>}
                  </FieldLabel>
                  <input
                    type="number" name="cantidad" value={form.cantidad}
                    onChange={handleChangeWithClear}
                    placeholder="Ej: 50" min="0.1" step="0.1"
                    className={inputClass('cantidad')}
                  />
                  <FieldError field="cantidad" />
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Building2 size={16} className="sm:hidden text-[var(--color-primary)]" />
                <Building2 size={18} className="hidden sm:block text-[var(--color-primary)]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 2 · Centro de apoyo</p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Dirección */}
                <div>
                  <FieldLabel field="direccion">Dirección afectada</FieldLabel>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral)] sm:hidden" />
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral)] hidden sm:block" />
                    <input
                      type="text" name="direccion" value={form.direccion}
                      onChange={handleChangeWithClear}
                      placeholder="Ej: Av. Principal 123"
                      className={`w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl border pl-10 sm:pl-12 pr-4 text-sm outline-none bg-white transition-all focus:scale-[1.01] text-[var(--color-dark)] ${
                        formErrors.direccion ? 'border-red-400' : 'border-[rgba(124,132,131,0.18)]'
                      }`}
                    />
                  </div>
                  <FieldError field="direccion" />
                </div>

                {/* Centro de acopio - custom dropdown */}
                <div className="relative" ref={centroDropdownRef}>
                  <FieldLabel field="centroAcopioId">Centro de acopio</FieldLabel>
                  <button
                    type="button"
                    onClick={() => setCentroDropdownOpen(!centroDropdownOpen)}
                    className={`w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl border outline-none pl-3 sm:pl-4 pr-3 sm:pr-4 text-sm font-medium bg-white transition-all flex items-center gap-2 sm:gap-3 text-[var(--color-dark)] ${
                      formErrors.centroAcopioId ? 'border-red-400' : 'border-[rgba(124,132,131,0.18)]'
                    }`}
                  >
                    <Building2 size={18} className="text-[var(--color-primary)] shrink-0" />
                    <span className="flex-1 text-left truncate">
                      {centroSeleccionado?.nombre || 'Seleccionar centro'}
                    </span>
                    <ChevronDown size={16} className={`text-[var(--color-neutral)] transition-transform shrink-0 ${centroDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <FieldError field="centroAcopioId" />

                  {centroDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl sm:rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)] max-h-56 overflow-y-auto">
                      {centros.map((centro) => {
                        const isSelected = centroId === centro.id
                        return (
                          <button
                            key={centro.id} type="button"
                            onClick={() => handleSelectCentro(centro.id)}
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-sm font-medium transition-all ${
                              isSelected ? 'bg-[rgba(232,25,44,0.06)] text-[var(--color-primary)]' : 'text-[var(--color-dark)] hover:bg-gray-50'
                            }`}
                          >
                            <Building2 size={16} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />
                            <span className="flex-1 text-left">{centro.nombre}</span>
                            {isSelected && <Check size={15} className="text-[var(--color-primary)] shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {centroSeleccionado && (
                    <div className="mt-2 sm:mt-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 bg-[rgba(244,172,69,0.08)] border border-[rgba(244,172,69,0.15)]">
                      <p className="text-xs sm:text-sm font-semibold text-[var(--color-dark)]">{centroSeleccionado.nombre}</p>
                      <p className="text-xs mt-1 text-[var(--color-neutral)]">{centroSeleccionado.direccion}</p>
                      {centroSeleccionado.region && <p className="text-xs mt-1 text-[var(--color-accent)]">Región: {centroSeleccionado.region.nombre}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <FileText size={16} className="sm:hidden text-[var(--color-primary)]" />
                <FileText size={18} className="hidden sm:block text-[var(--color-primary)]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 3 · Información adicional</p>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-semibold block mb-1.5 sm:mb-2 text-[var(--color-dark)]">Descripción</label>
                <textarea
                  name="descripcion" value={form.descripcion} onChange={handleChange}
                  rows={4} placeholder="Describe detalles importantes sobre la necesidad..."
                  className="w-full rounded-xl sm:rounded-2xl border border-[rgba(124,132,131,0.18)] p-3 sm:p-5 text-sm outline-none resize-none bg-white transition-all focus:scale-[1.01] text-[var(--color-dark)]"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 sm:pt-2">
              <button
                type="button" onClick={() => navigate('/necesidades')}
                className="flex-1 h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl font-bold text-sm transition-all hover:scale-[1.01] border border-[rgba(124,132,131,0.18)] text-[var(--color-dark)] bg-white"
              >
                Cancelar
              </button>
              <button
                type="submit" disabled={loading}
                className="flex-1 h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-70 bg-[var(--color-primary)] shadow-[0_10px_30px_rgba(232,25,44,0.20)]"
              >
                <Send size={16} className="sm:hidden" />
                <Send size={18} className="hidden sm:block" />
                {loading ? 'Reportando...' : 'Reportar necesidad'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportarNecesidadView