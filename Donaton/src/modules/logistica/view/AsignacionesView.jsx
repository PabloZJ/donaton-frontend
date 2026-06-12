import { useState, useEffect, useRef } from 'react'
import { useAsignacionesViewModel } from '../viewmodel/AsignacionesViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'
import {
  Warehouse, ArrowRightLeft, ClipboardList,
  ChevronDown, Check, AlertTriangle, Calendar, Inbox,
  TrendingDown, CheckCircle2, MapPin, AlertCircle
} from 'lucide-react'
import { TIPOS_RECURSO } from '../../../utils/recursos'
import { validators, validateForm, withQuantity } from '../../../utils/validations'

const ASIGNACION_SCHEMA = {
  tipoRecursoId: (v) => validators.select(v, 'un tipo de recurso'),
  necesidadId: (v) => validators.select(v, 'una necesidad'),
  cantidadAsignada: withQuantity({ min: 0.1, label: 'La cantidad' }),
}

const AsignacionesView = () => {
  const {
    asignaciones, inventario, necesidadesFiltradas,
    form, handleChange, handleSubmit,
    loading, loadingData, error, success,
    centroAcopioId,
  } = useAsignacionesViewModel()

  const [formErrors, setFormErrors] = useState({})
  const [tipoOpen, setTipoOpen] = useState(false)
  const [necesidadOpen, setNecesidadOpen] = useState(false)
  const tipoRef = useRef(null)
  const necesidadRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tipoRef.current && !tipoRef.current.contains(e.target)) setTipoOpen(false)
      if (necesidadRef.current && !necesidadRef.current.contains(e.target)) setNecesidadOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loadingData) return <LoadingSpinner />

  const recursoSeleccionado = inventario.find(i => i.tipoRecursoId === parseInt(form.tipoRecursoId))
  const tipoSeleccionado = TIPOS_RECURSO.find(t => t.id === parseInt(form.tipoRecursoId))
  const necesidadSeleccionada = necesidadesFiltradas.find(n => n.id === parseInt(form.necesidadId))

  const handleSelectTipo = (tipoId) => {
    handleChange({ target: { name: 'tipoRecursoId', value: String(tipoId) } })
    if (formErrors.tipoRecursoId) setFormErrors(prev => ({ ...prev, tipoRecursoId: '' }))
    setTipoOpen(false)
  }

  const handleSelectNecesidad = (necesidadId) => {
    handleChange({ target: { name: 'necesidadId', value: String(necesidadId) } })
    if (formErrors.necesidadId) setFormErrors(prev => ({ ...prev, necesidadId: '' }))
    setNecesidadOpen(false)
  }

  const handleChangeWithClear = (e) => {
    const { name } = e.target
    handleChange(e)
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmitWithValidation = (e) => {
    e.preventDefault()
    const { errors, isValid } = validateForm(form, ASIGNACION_SCHEMA)
    setFormErrors(errors)
    if (!isValid) return
    handleSubmit(e)
  }

  const FieldError = ({ field }) => formErrors[field] ? (
    <div className="flex items-center gap-1.5 mt-1.5">
      <AlertCircle size={13} style={{ color: '#E8192C' }} />
      <span className="text-xs font-medium text-[var(--color-primary)]">{formErrors[field]}</span>
    </div>
  ) : null

  const dropdownBtnClass = (field) =>
    `w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl border outline-none pl-3 sm:pl-4 pr-3 sm:pr-4 text-sm font-medium bg-white transition-all flex items-center gap-2 sm:gap-3 text-[var(--color-dark)] ${
      formErrors[field] ? 'border-[rgba(232,25,44,0.40)]' : 'border-[rgba(124,132,131,0.18)]'
    }`
  const dropdownMenuClass = "absolute z-50 w-full mt-2 rounded-xl sm:rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)] max-h-56 overflow-y-auto"

  return (
    <div className="min-h-screen px-3 sm:px-4 lg:px-6 py-8 sm:py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-5xl mx-auto relative flex flex-col gap-6 sm:gap-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1 sm:mb-2 text-[var(--color-primary)]">Logística</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--color-dark)]">Asignación de Recursos</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[var(--color-neutral)]">Asigna recursos del inventario a las necesidades reportadas.</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)] shrink-0">
            <ArrowRightLeft size={20} className="sm:hidden" />
            <ArrowRightLeft size={24} className="hidden sm:block" />
          </div>
        </div>

        {/* Sin centro */}
        {!centroAcopioId && (
          <div className="rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)]">
              <Warehouse size={28} className="sm:hidden text-[var(--color-neutral)]" />
              <Warehouse size={36} className="hidden sm:block text-[var(--color-neutral)]" />
            </div>
            <h3 className="text-lg sm:text-xl font-black mb-2 text-[var(--color-dark)]">Sin centro asignado</h3>
            <p className="text-xs sm:text-sm text-[var(--color-neutral)]">No tienes un centro de acopio asignado a tu perfil.</p>
          </div>
        )}

        {centroAcopioId && (
          <>
            {/* Formulario */}
            <div className="rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[10px]">
              <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)] shrink-0">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h2 className="font-black text-base sm:text-xl text-[var(--color-dark)]">Nueva Asignación</h2>
                  <p className="text-xs sm:text-sm text-[var(--color-neutral)]">Selecciona el recurso y la necesidad a cubrir.</p>
                </div>
              </div>

              <form onSubmit={handleSubmitWithValidation} className="space-y-6 sm:space-y-8">

                {/* Paso 1 */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold shrink-0">1</span>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Recurso disponible</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="relative" ref={tipoRef}>
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-[var(--color-dark)]">Tipo de recurso</label>
                      <button type="button" onClick={() => setTipoOpen(!tipoOpen)} className={dropdownBtnClass('tipoRecursoId')}>
                        {tipoSeleccionado?.icono && <tipoSeleccionado.icono size={18} className="text-[var(--color-primary)] shrink-0" />}
                        <span className="flex-1 text-left truncate">{tipoSeleccionado?.nombre || 'Seleccionar'}</span>
                        <ChevronDown size={16} className={`text-[var(--color-neutral)] transition-transform shrink-0 ${tipoOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <FieldError field="tipoRecursoId" />

                      {tipoOpen && (
                        <div className={dropdownMenuClass}>
                          {inventario.map((item) => {
                            const tipo = TIPOS_RECURSO.find(t => t.id === item.tipoRecursoId)
                            const Icono = tipo?.icono
                            const isSelected = parseInt(form.tipoRecursoId) === item.tipoRecursoId
                            return (
                              <button
                                key={item.id} type="button"
                                onClick={() => handleSelectTipo(item.tipoRecursoId)}
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-sm font-medium transition-all ${isSelected ? 'bg-[rgba(232,25,44,0.06)] text-[var(--color-primary)]' : 'text-[var(--color-dark)] hover:bg-gray-50'}`}
                              >
                                {Icono && <Icono size={16} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />}
                                <span className="flex-1 text-left truncate">{tipo?.nombre || 'Desconocido'}</span>
                                <span className="text-xs text-[var(--color-neutral)] shrink-0">{item.cantidadDisponible} {tipo?.unidad}</span>
                                {isSelected && <Check size={15} className="text-[var(--color-primary)] shrink-0" />}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {recursoSeleccionado && (
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-[var(--color-dark)]">Stock disponible</label>
                        <div className="w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl border border-[rgba(124,132,131,0.18)] px-3 sm:px-4 flex items-center gap-2 bg-[rgba(124,132,131,0.04)] text-[var(--color-dark)] font-bold text-sm">
                          <TrendingDown size={16} className="text-[var(--color-primary)] shrink-0" />
                          {recursoSeleccionado.cantidadDisponible}
                          <span className="text-sm font-normal text-[var(--color-neutral)]">{tipoSeleccionado?.unidad}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Paso 2 */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold shrink-0">2</span>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Necesidad a cubrir</p>
                  </div>

                  {necesidadesFiltradas.length === 0 ? (
                    <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-[rgba(244,172,69,0.08)] border border-[rgba(244,172,69,0.15)] text-[var(--color-accent)] flex items-center gap-2">
                      <AlertTriangle size={15} className="shrink-0" />
                      No hay necesidades pendientes para este tipo de recurso
                    </div>
                  ) : (
                    <div className="relative" ref={necesidadRef}>
                      <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-[var(--color-dark)]">Selecciona la necesidad</label>
                      <button type="button" onClick={() => setNecesidadOpen(!necesidadOpen)} className={dropdownBtnClass('necesidadId')}>
                        <MapPin size={18} className="text-[var(--color-accent)] shrink-0" />
                        <span className="flex-1 text-left truncate text-xs sm:text-sm">
                          {necesidadSeleccionada
                            ? `${necesidadSeleccionada.nombreComuna || 'Sin comuna'} — ${necesidadSeleccionada.cantidad} ${TIPOS_RECURSO.find(t => t.id === necesidadSeleccionada.tipoRecursoId)?.unidad || 'unidades'}`
                            : 'Seleccionar necesidad'}
                        </span>
                        <ChevronDown size={16} className={`text-[var(--color-neutral)] transition-transform shrink-0 ${necesidadOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <FieldError field="necesidadId" />

                      {necesidadOpen && (
                        <div className={dropdownMenuClass}>
                          {necesidadesFiltradas.map((n) => {
                            const isSelected = parseInt(form.necesidadId) === n.id
                            const tipoNecesidad = TIPOS_RECURSO.find(t => t.id === n.tipoRecursoId)
                            const asignado = n.cantidadCubierta || 0
                            return (
                              <button
                                key={n.id} type="button"
                                onClick={() => handleSelectNecesidad(n.id)}
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-sm transition-all ${isSelected ? 'bg-[rgba(232,25,44,0.06)]' : 'hover:bg-gray-50'}`}
                              >
                                <MapPin size={15} className={`shrink-0 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'}`} />
                                <div className="flex-1 text-left min-w-0">
                                  <p className={`font-semibold truncate text-sm ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-dark)]'}`}>
                                    {n.nombreComuna || 'Sin comuna'}
                                  </p>
                                  <p className="text-xs text-[var(--color-neutral)]">
                                    Necesita {n.cantidad} {tipoNecesidad?.unidad || 'unidades'} · Asignado: {asignado}
                                  </p>
                                </div>
                                {isSelected && <Check size={15} className="text-[var(--color-primary)] shrink-0" />}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Paso 3 */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold shrink-0">3</span>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Cantidad</p>
                  </div>

                  <div className="w-full sm:max-w-xs">
                    <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 text-[var(--color-dark)]">Cantidad a asignar</label>
                    <input
                      type="number" name="cantidadAsignada" value={form.cantidadAsignada}
                      onChange={handleChangeWithClear}
                      step="0.1" placeholder="Ej: 50"
                      className={`w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl border px-4 sm:px-5 text-sm outline-none bg-white text-[var(--color-dark)] transition-all focus:scale-[1.01] ${
                        formErrors.cantidadAsignada ? 'border-[rgba(232,25,44,0.40)]' : 'border-[rgba(124,132,131,0.18)]'
                      }`}
                    />
                    <FieldError field="cantidadAsignada" />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)] text-[#16A34A] flex items-center gap-2">
                    <CheckCircle2 size={15} className="shrink-0" />
                    Recursos asignados correctamente
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || necesidadesFiltradas.length === 0}
                  className="w-full h-11 sm:h-12 lg:h-14 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-base transition-all hover:scale-[1.01] disabled:opacity-50 bg-[var(--color-primary)] shadow-[0_10px_30px_rgba(232,25,44,0.20)]"
                >
                  {loading ? 'Procesando...' : 'Confirmar asignación'}
                </button>
              </form>
            </div>

            {/* Historial */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-[var(--color-dark)]">Historial de Asignaciones</h2>

              {asignaciones.length === 0 ? (
                <div className="rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)]">
                    <Inbox size={28} className="sm:hidden text-[var(--color-neutral)]" />
                    <Inbox size={36} className="hidden sm:block text-[var(--color-neutral)]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black mb-2 text-[var(--color-dark)]">No hay asignaciones</h3>
                  <p className="text-xs sm:text-sm text-[var(--color-neutral)]">Aún no has realizado asignaciones de recursos.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:gap-4">
                  {asignaciones.map(a => (
                    <div
                      key={a.id}
                      className="rounded-2xl sm:rounded-[1.75rem] p-4 sm:p-6 bg-[rgba(255,255,255,0.85)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[10px] transition-all hover:shadow-lg"
                    >
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)] shrink-0">
                            <ArrowRightLeft size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm sm:text-base text-[var(--color-dark)] truncate">Necesidad #{a.necesidadId}</p>
                            <p className="text-xs text-[var(--color-neutral)] flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(a.fechaAsignacion).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xl sm:text-2xl font-black text-[var(--color-primary)]">{a.cantidadAsignada}</p>
                          <p className="text-xs text-[var(--color-neutral)]">unidades</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AsignacionesView