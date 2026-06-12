import { Link } from 'react-router-dom'
import { useDonacionesViewModel } from '../viewmodel/DonacionesViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { Plus, Package, Calendar, Clock, CheckCircle2, Timer, XCircle, HelpCircle } from 'lucide-react'
import { TIPOS_RECURSO } from '../../../utils/recursos'

const estadoConfig = (nombre) => {
  const configs = {
    'pendiente': { bg: 'bg-[rgba(244,172,69,0.12)]', color: 'text-[#B87A00]', icon: Timer, label: 'Pendiente' },
    'agendada': { bg: 'bg-[rgba(59,130,246,0.10)]', color: 'text-[#2563EB]', icon: Clock, label: 'Agendada' },
    'recibida': { bg: 'bg-[rgba(34,197,94,0.10)]', color: 'text-[#16A34A]', icon: CheckCircle2, label: 'Recibida' },
    'cancelada': { bg: 'bg-[rgba(232,25,44,0.10)]', color: 'text-[var(--color-primary)]', icon: XCircle, label: 'Cancelada' },
  }
  return configs[nombre] || { bg: 'bg-[rgba(124,132,131,0.10)]', color: 'text-[var(--color-neutral)]', icon: HelpCircle, label: nombre }
}

const DonacionesView = () => {
  const { donaciones, loading, error } = useDonacionesViewModel()

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen px-3 sm:px-4 lg:px-6 py-8 sm:py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-3xl mx-auto relative">

        {/* Header */}
        <div className="flex justify-between items-start gap-3 mb-6 sm:mb-8">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1 text-[var(--color-primary)]">
              Panel donante
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--color-dark)]">
              Mis Donaciones
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--color-neutral)]">
              Historial de recursos que has donado
            </p>
          </div>

          <Link
            to="/donaciones/crear"
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-white font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] bg-[var(--color-primary)] shadow-[0_8px_24px_rgba(232,25,44,0.25)] shrink-0"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nueva donación</span>
            <span className="sm:hidden">Nueva</span>
          </Link>
        </div>

        {error && (
          <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium mb-5 sm:mb-6 bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
            {error}
          </div>
        )}

        {donaciones.length === 0 ? (
          <div className="rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)]">
              <Package size={28} className="sm:hidden text-[var(--color-primary)]" />
              <Package size={36} className="hidden sm:block text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg sm:text-xl font-black mb-2 text-[var(--color-dark)]">Aún no has donado</h3>
            <p className="text-xs sm:text-sm mb-5 sm:mb-6 text-[var(--color-neutral)] max-w-xs mx-auto">
              Tu aporte puede marcar la diferencia en la vida de muchas personas.
            </p>
            <Link
              to="/donaciones/crear"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-white font-bold text-sm transition-all hover:scale-[1.02] bg-[var(--color-primary)] shadow-[0_8px_24px_rgba(232,25,44,0.25)]"
            >
              <Plus size={15} />
              Hacer mi primera donación
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:gap-4">
            {donaciones.map(d => {
              const estado = estadoConfig(d.estado?.nombre)
              const EstadoIcon = estado.icon
              const tipo = TIPOS_RECURSO.find(t => t.id === d.tipoRecursoId)
              const RecursoIcon = tipo?.icono || Package

              return (
                <div
                  key={d.id}
                  className="rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-5 transition-all hover:shadow-md bg-[rgba(255,255,255,0.85)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex justify-between items-start gap-3 sm:gap-4">
                    <div className="flex gap-3 sm:gap-4 items-start min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                        <RecursoIcon size={18} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-[var(--color-dark)] truncate">
                          {tipo?.nombre || 'Desconocido'}
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 text-xs text-[var(--color-neutral)]">
                          <span className="font-semibold text-[var(--color-dark)]">
                            {d.cantidad}{' '}
                            <span className="font-normal text-[var(--color-neutral)]">{tipo?.unidad || 'unidades'}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(d.fechaRegistro).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          {d.fechaCita && (
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              Cita: {new Date(d.fechaCita).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        {d.observacion && (
                          <p className="text-xs mt-1 italic text-[var(--color-neutral)] line-clamp-2">{d.observacion}</p>
                        )}
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center gap-1 ${estado.bg} ${estado.color}`}>
                      <EstadoIcon size={11} />
                      <span className="hidden sm:inline">{estado.label}</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DonacionesView