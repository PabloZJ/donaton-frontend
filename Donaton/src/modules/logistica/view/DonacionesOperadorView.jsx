// DonacionesOperadorView.jsx
import { useDonacionesOperadorViewModel } from '../viewmodel/DonacionesOperadorViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { Warehouse, Package, CheckCircle2, Clock, Timer, XCircle, Inbox, Calendar, MessageSquare } from 'lucide-react'
import { TIPOS_RECURSO } from '../../../utils/recursos'

const estadoConfig = (nombre) => {
  const configs = {
    'pendiente': { bg: 'bg-[rgba(244,172,69,0.12)]', color: 'text-[#B87A00]', icon: Timer, label: 'Pendiente' },
    'agendada': { bg: 'bg-[rgba(59,130,246,0.10)]', color: 'text-[#2563EB]', icon: Clock, label: 'Agendada' },
    'recibida': { bg: 'bg-[rgba(34,197,94,0.10)]', color: 'text-[#16A34A]', icon: CheckCircle2, label: 'Recibida' },
    'cancelada': { bg: 'bg-[rgba(232,25,44,0.10)]', color: 'text-[var(--color-primary)]', icon: XCircle, label: 'Cancelada' },
  }
  return configs[nombre] || { bg: 'bg-[rgba(124,132,131,0.10)]', color: 'text-[var(--color-neutral)]', icon: Package, label: nombre }
}

const DonacionesOperadorView = () => {
  const { donaciones, loading, error, procesando, marcarRecibida, centroAcopioId } = useDonacionesOperadorViewModel()

  if (loading) return <LoadingSpinner />

  const donacionesOrdenadas = [...donaciones].sort((a, b) => {
    const prioridad = { 'pendiente': 0, 'agendada': 1, 'recibida': 2, 'cancelada': 3 }
    const prioA = prioridad[a.estado?.nombre] ?? 4
    const prioB = prioridad[b.estado?.nombre] ?? 4
    if (prioA !== prioB) return prioA - prioB
    return new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
  })

  return (
    <div className="min-h-screen px-4 py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">Logística</p>
            <h1 className="text-4xl font-black text-[var(--color-dark)]">Donaciones de mi Centro</h1>
            <p className="mt-2 text-sm text-[var(--color-neutral)]">Gestiona las donaciones entrantes.</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
            <Warehouse size={24} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl px-4 py-3 text-sm font-medium mb-6 bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
            {error}
          </div>
        )}

        {!centroAcopioId && (
          <div className="rounded-[2rem] p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)]">
              <Warehouse size={36} className="text-[var(--color-neutral)]" />
            </div>
            <h3 className="text-xl font-black mb-2 text-[var(--color-dark)]">Sin centro asignado</h3>
            <p className="text-sm text-[var(--color-neutral)]">No tienes un centro de acopio asignado a tu perfil.</p>
          </div>
        )}

        {centroAcopioId && donacionesOrdenadas.length === 0 ? (
          <div className="rounded-[2rem] p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)]">
              <Inbox size={36} className="text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-black mb-2 text-[var(--color-dark)]">No hay donaciones</h3>
            <p className="text-sm text-[var(--color-neutral)]">Tu centro aún no tiene donaciones registradas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {donacionesOrdenadas.map(d => {
              const estado = estadoConfig(d.estado?.nombre)
              const EstadoIcon = estado.icon
              const tipo = TIPOS_RECURSO.find(t => t.id === d.tipoRecursoId)
              const RecursoIcon = tipo?.icono || Package
              const puedeRecibir = d.estado?.nombre !== 'recibida' && d.estado?.nombre !== 'cancelada'

              return (
                <div
                  key={d.id}
                  className="rounded-[1.75rem] p-6 bg-[rgba(255,255,255,0.85)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[10px] transition-all hover:shadow-lg"
                >
                  <div className="flex justify-between items-start gap-5">
                    <div className="flex gap-4 items-start flex-1">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                        <RecursoIcon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-[var(--color-dark)]">{tipo?.nombre || 'Desconocido'}</h3>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${estado.bg} ${estado.color}`}>
                            <EstadoIcon size={14} />
                            {estado.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--color-neutral)] mb-3">
                          <span className="font-semibold text-[var(--color-dark)]">
                            {d.cantidad} <span className="font-normal text-[var(--color-neutral)]">{tipo?.unidad || 'unidades'}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {new Date(d.fechaRegistro).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          {d.fechaCita && (
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} />
                              Cita: {new Date(d.fechaCita).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        {d.observacion && (
                          <p className="text-sm leading-relaxed text-[var(--color-neutral)] flex items-start gap-1.5">
                            <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
                            {d.observacion}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {puedeRecibir && (
                        <button
                          onClick={() => marcarRecibida(d)}
                          disabled={procesando === d.id}
                          className={`
                            h-10 px-4 rounded-xl text-sm font-bold text-white transition-all
                            ${procesando === d.id ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02] bg-[var(--color-primary)] shadow-[0_4px_16px_rgba(232,25,44,0.25)]'}
                          `}
                        >
                          {procesando === d.id ? 'Procesando...' : 'Marcar recibida'}
                        </button>
                      )}
                    </div>
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

export default DonacionesOperadorView