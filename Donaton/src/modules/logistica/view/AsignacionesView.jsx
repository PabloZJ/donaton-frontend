import { useState, useEffect, useRef } from 'react'
import { useAsignacionesViewModel } from '../viewmodel/AsignacionesViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'
import {
  Warehouse, Package, ArrowRightLeft, ClipboardList,
  ChevronDown, Check, AlertTriangle, Calendar, Inbox,
  TrendingDown, CheckCircle2, MapPin
} from 'lucide-react'
import { TIPOS_RECURSO } from '../../../utils/recursos'

const AsignacionesView = () => {
  const {
    asignaciones, inventario, necesidadesFiltradas,
    form, handleChange, handleSubmit,
    loading, loadingData, error, success,
    centroAcopioId,
  } = useAsignacionesViewModel()

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
    setTipoOpen(false)
  }

  const handleSelectNecesidad = (necesidadId) => {
    handleChange({ target: { name: 'necesidadId', value: String(necesidadId) } })
    setNecesidadOpen(false)
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-5xl mx-auto relative flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">Logística</p>
            <h1 className="text-4xl font-black text-[var(--color-dark)]">Asignación de Recursos</h1>
            <p className="mt-2 text-sm text-[var(--color-neutral)]">Asigna recursos del inventario a las necesidades reportadas.</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
            <ArrowRightLeft size={24} />
          </div>
        </div>

        {/* Sin centro */}
        {!centroAcopioId && (
          <div className="rounded-[2rem] p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)]">
              <Warehouse size={36} className="text-[var(--color-neutral)]" />
            </div>
            <h3 className="text-xl font-black mb-2 text-[var(--color-dark)]">Sin centro asignado</h3>
            <p className="text-sm text-[var(--color-neutral)]">No tienes un centro de acopio asignado a tu perfil.</p>
          </div>
        )}

        {/* Con centro */}
        {centroAcopioId && (
          <>
            {/* Formulario */}
            <div className="rounded-[2rem] p-8 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[10px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                  <ClipboardList size={22} />
                </div>
                <div>
                  <h2 className="font-black text-xl text-[var(--color-dark)]">Nueva Asignación</h2>
                  <p className="text-sm text-[var(--color-neutral)]">Selecciona el recurso y la necesidad a cubrir.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Paso 1: Recurso */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold">1</span>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Recurso disponible</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Dropdown tipo */}
                    <div className="relative" ref={tipoRef}>
                      <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Tipo de recurso</label>
                      <button
                        type="button"
                        onClick={() => setTipoOpen(!tipoOpen)}
                        className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] outline-none pl-4 pr-4 text-sm font-medium bg-white transition-all flex items-center gap-3 text-[var(--color-dark)]"
                      >
                        {tipoSeleccionado?.icono && <tipoSeleccionado.icono size={20} className="text-[var(--color-primary)]" />}
                        <span className="flex-1 text-left">{tipoSeleccionado?.nombre || 'Seleccionar'}</span>
                        <ChevronDown size={18} className={`text-[var(--color-neutral)] transition-transform ${tipoOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {tipoOpen && (
                        <div className="absolute z-50 w-full mt-2 rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                          {inventario.map((item) => {
                            const tipo = TIPOS_RECURSO.find(t => t.id === item.tipoRecursoId)
                            const Icono = tipo?.icono
                            const isSelected = parseInt(form.tipoRecursoId) === item.tipoRecursoId
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectTipo(item.tipoRecursoId)}
                                className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-all ${isSelected ? 'bg-[rgba(232,25,44,0.06)] text-[var(--color-primary)]' : 'text-[var(--color-dark)] hover:bg-gray-50'}`}
                              >
                                {Icono && <Icono size={18} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />}
                                <span className="flex-1 text-left">{tipo?.nombre || 'Desconocido'}</span>
                                <span className="text-xs text-[var(--color-neutral)]">{item.cantidadDisponible} {tipo?.unidad}</span>
                                {isSelected && <Check size={16} className="text-[var(--color-primary)]" />}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Stock */}
                    {recursoSeleccionado && (
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Stock disponible</label>
                        <div className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-4 flex items-center gap-2 bg-[rgba(124,132,131,0.04)] text-[var(--color-dark)] font-bold">
                          <TrendingDown size={18} className="text-[var(--color-primary)]" />
                          {recursoSeleccionado.cantidadDisponible} <span className="text-sm font-normal text-[var(--color-neutral)]">{tipoSeleccionado?.unidad}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Paso 2: Necesidad */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold">2</span>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Necesidad a cubrir</p>
                  </div>

                  {necesidadesFiltradas.length === 0 ? (
                    <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(244,172,69,0.08)] border border-[rgba(244,172,69,0.15)] text-[var(--color-accent)] flex items-center gap-2">
                      <AlertTriangle size={16} />
                      No hay necesidades pendientes para este tipo de recurso
                    </div>
                  ) : (
                    <div className="relative" ref={necesidadRef}>
                      <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Selecciona la necesidad</label>
                      <button
                        type="button"
                        onClick={() => setNecesidadOpen(!necesidadOpen)}
                        className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] outline-none pl-4 pr-4 text-sm font-medium bg-white transition-all flex items-center gap-3 text-[var(--color-dark)]"
                      >
                        <MapPin size={20} className="text-[var(--color-accent)]" />
                        <span className="flex-1 text-left truncate">
                          {necesidadSeleccionada
                            ? `${necesidadSeleccionada.nombreComuna || 'Sin comuna'} — ${necesidadSeleccionada.cantidad} ${TIPOS_RECURSO.find(t => t.id === necesidadSeleccionada.tipoRecursoId)?.unidad || 'unidades'}`
                            : 'Seleccionar necesidad'}
                        </span>
                        <ChevronDown size={18} className={`text-[var(--color-neutral)] transition-transform ${necesidadOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {necesidadOpen && (
                        <div className="absolute z-50 w-full mt-2 rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                          {necesidadesFiltradas.map((n) => {
                            const isSelected = parseInt(form.necesidadId) === n.id
                            const tipoNecesidad = TIPOS_RECURSO.find(t => t.id === n.tipoRecursoId)
                            const asignado = n.cantidadCubierta || 0

                            return (
                              <button
                                key={n.id}
                                type="button"
                                onClick={() => handleSelectNecesidad(n.id)}
                                className={`w-full px-4 py-3 flex items-center gap-3 text-sm transition-all ${isSelected ? 'bg-[rgba(232,25,44,0.06)]' : 'hover:bg-gray-50'}`}
                              >
                                <MapPin size={16} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />

                                <div className="flex-1 text-left min-w-0">
                                  <p className={`font-semibold truncate ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-dark)]'}`}>
                                    {n.nombreComuna || 'Sin comuna'}
                                  </p>
                                  <p className="text-xs text-[var(--color-neutral)]">
                                    Necesita {n.cantidad} {tipoNecesidad?.unidad || 'unidades'} · Asignado: {asignado}
                                  </p>
                                </div>

                                {isSelected && <Check size={16} className="text-[var(--color-primary)] flex-shrink-0" />}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Paso 3: Cantidad */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white text-xs font-bold">3</span>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Cantidad</p>
                  </div>

                  <div className="max-w-xs">
                    <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Cantidad a asignar</label>
                    <input
                      type="number" name="cantidadAsignada" value={form.cantidadAsignada} onChange={handleChange}
                      min="0.1" step="0.1" max={recursoSeleccionado?.cantidadDisponible} required placeholder="Ej: 50"
                      className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-5 text-sm outline-none bg-white text-[var(--color-dark)] transition-all focus:scale-[1.01]"
                    />
                  </div>
                </div>

                {/* Error / Success */}
                {error && (
                  <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)] text-[#16A34A] flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Recursos asignados correctamente
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || necesidadesFiltradas.length === 0}
                  className="w-full h-14 rounded-2xl text-white font-bold text-sm transition-all hover:scale-[1.01] disabled:opacity-50 bg-[var(--color-primary)] shadow-[0_10px_30px_rgba(232,25,44,0.20)]"
                >
                  {loading ? 'Procesando...' : 'Confirmar asignación'}
                </button>
              </form>
            </div>

            {/* Historial */}
            <div>
              <h2 className="text-2xl font-black mb-4 text-[var(--color-dark)]">Historial de Asignaciones</h2>

              {asignaciones.length === 0 ? (
                <div className="rounded-[2rem] p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)]">
                    <Inbox size={36} className="text-[var(--color-neutral)]" />
                  </div>
                  <h3 className="text-xl font-black mb-2 text-[var(--color-dark)]">No hay asignaciones</h3>
                  <p className="text-sm text-[var(--color-neutral)]">Aún no has realizado asignaciones de recursos.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {asignaciones.map(a => (
                    <div
                      key={a.id}
                      className="rounded-[1.75rem] p-6 bg-[rgba(255,255,255,0.85)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[10px] transition-all hover:shadow-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                            <ArrowRightLeft size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-[var(--color-dark)]">Necesidad #{a.necesidadId}</p>
                            <p className="text-xs text-[var(--color-neutral)] flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(a.fechaAsignacion).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-[var(--color-primary)]">{a.cantidadAsignada}</p>
                          <p className="text-xs text-[var(--color-neutral)]">unidades asignadas</p>
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