// View
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, MapPin, Package, FileText, Building2,
  ArrowLeft, Send, ClipboardList, ChevronDown, Check,
} from 'lucide-react'
import { TIPOS_RECURSO } from '../../../utils/recursos'
import { useReportarNecesidadViewModel } from '../viewmodel/ReportarNecesidadViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

const ReportarNecesidadView = () => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { form, handleChange, handleSubmit, centros, loading, loadingData, error, success } = useReportarNecesidadViewModel()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => { if (success) navigate('/necesidades') }, [success])

  if (loadingData) return <LoadingSpinner />

  const centroSeleccionado = centros.find(c => c.id === parseInt(form.centroAcopioId))
  const tipoSeleccionado = TIPOS_RECURSO.find(t => t.id === parseInt(form.tipoRecursoId))
  const IconoSeleccionado = tipoSeleccionado?.icono || Package

  const handleSelectTipo = (tipoId) => {
    handleChange({ target: { name: 'tipoRecursoId', value: String(tipoId) } })
    setDropdownOpen(false)
  }

  return (
    <div className="min-h-screen px-4 py-12 relative overflow-hidden bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.07)]" />

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
              <AlertTriangle size={30} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">Municipalidad</p>
              <h1 className="text-4xl font-black leading-tight text-[var(--color-dark)]">Reportar Necesidad</h1>
              <p className="mt-2 text-sm leading-relaxed max-w-xl text-[var(--color-neutral)]">
                Registra recursos necesarios para coordinar ayuda humanitaria y distribución eficiente.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/necesidades')}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white transition-all hover:scale-[1.02] border border-[rgba(124,132,131,0.15)] text-[var(--color-dark)]"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>

        {/* Card */}
        <div className="rounded-[2rem] p-8 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[10px]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Paso 1 */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <ClipboardList size={18} className="text-[var(--color-primary)]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 1 · Recurso solicitado</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="text-sm font-semibold block mb-2 text-[var(--color-dark)]">Tipo de recurso</label>

                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] outline-none pl-4 pr-4 text-sm font-medium bg-white transition-all flex items-center gap-3 text-[var(--color-dark)]"
                  >
                    <IconoSeleccionado size={20} className="text-[var(--color-primary)]" />
                    <span className="flex-1 text-left">{tipoSeleccionado?.nombre || 'Seleccionar'}</span>
                    <ChevronDown size={18} className={`text-[var(--color-neutral)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                      {TIPOS_RECURSO.map((tipo) => {
                        const Icono = tipo.icono
                        const isSelected = parseInt(form.tipoRecursoId) === tipo.id
                        return (
                          <button
                            key={tipo.id}
                            type="button"
                            onClick={() => handleSelectTipo(tipo.id)}
                            className="w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-all hover:bg-gray-50 text-[var(--color-dark)]"
                          >
                            <Icono size={20} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />
                            <span className="flex-1 text-left">{tipo.nombre}</span>
                            {isSelected && <Check size={18} className="text-[var(--color-primary)]" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Cantidad */}
                <div>
                  <label className="text-sm font-semibold block mb-2 text-[var(--color-dark)]">
                    Cantidad requerida
                    {tipoSeleccionado && <span className="ml-2 text-xs font-medium text-[var(--color-neutral)]">({tipoSeleccionado.unidad})</span>}
                  </label>
                  <input
                    type="number" name="cantidad" value={form.cantidad} onChange={handleChange}
                    placeholder="Ej: 50" min="0.1" step="0.1" required
                    className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-5 text-sm outline-none bg-white transition-all focus:scale-[1.01] text-[var(--color-dark)]"
                  />
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Building2 size={18} className="text-[var(--color-primary)]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 2 · Centro de apoyo</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-semibold block mb-2 text-[var(--color-dark)]">Dirección afectada</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral)]" />
                    <input
                      type="text" name="direccion" value={form.direccion} onChange={handleChange}
                      placeholder="Ej: Av. Principal 123" required
                      className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] pl-12 pr-4 text-sm outline-none bg-white transition-all focus:scale-[1.01] text-[var(--color-dark)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2 text-[var(--color-dark)]">Centro de acopio</label>
                  <select
                    name="centroAcopioId" value={form.centroAcopioId} onChange={handleChange}
                    className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-5 text-sm outline-none bg-white transition-all focus:scale-[1.01] text-[var(--color-dark)]"
                  >
                    {centros.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>

                  {centroSeleccionado && (
                    <div className="mt-3 rounded-2xl p-4 bg-[rgba(244,172,69,0.08)] border border-[rgba(244,172,69,0.15)]">
                      <p className="text-sm font-semibold text-[var(--color-dark)]">{centroSeleccionado.nombre}</p>
                      <p className="text-xs mt-1 text-[var(--color-neutral)]">{centroSeleccionado.direccion}</p>
                      {centroSeleccionado.region && <p className="text-xs mt-1 text-[var(--color-accent)]">Región: {centroSeleccionado.region.nombre}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <FileText size={18} className="text-[var(--color-primary)]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">Paso 3 · Información adicional</p>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2 text-[var(--color-dark)]">Descripción</label>
                <textarea
                  name="descripcion" value={form.descripcion} onChange={handleChange}
                  rows={5} placeholder="Describe detalles importantes sobre la necesidad..."
                  className="w-full rounded-2xl border border-[rgba(124,132,131,0.18)] p-5 text-sm outline-none resize-none bg-white transition-all focus:scale-[1.01] text-[var(--color-dark)]"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button" onClick={() => navigate('/necesidades')}
                className="flex-1 h-14 rounded-2xl font-bold text-sm transition-all hover:scale-[1.01] border border-[rgba(124,132,131,0.18)] text-[var(--color-dark)] bg-white"
              >
                Cancelar
              </button>
              <button
                type="submit" disabled={loading}
                className="flex-1 h-14 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-70 bg-[var(--color-primary)] shadow-[0_10px_30px_rgba(232,25,44,0.20)]"
              >
                <Send size={18} />
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