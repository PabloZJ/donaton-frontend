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
    <div className="min-h-screen px-3 sm:px-4 lg:px-6 py-8 sm:py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      {/* Blurs decorativos */}
      <div className="fixed top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-4xl mx-auto relative">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1 sm:mb-2 text-[var(--color-primary)]">Logística</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--color-dark)]">Donaciones de mi Centro</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[var(--color-neutral)]">Gestiona las donaciones entrantes.</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium mb-5 sm:mb-6 bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
            {error}
          </div>
        )}

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

        {/* Sin donaciones */}
        {centroAcopioId && donacionesOrdenadas.length === 0 && (
          <div className="rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)]">
              <Inbox size={28} className="sm:hidden text-[var(--color-primary)]" />
              <Inbox size={36} className="hidden sm:block text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg sm:text-xl font-black mb-2 text-[var(--color-dark)]">No hay donaciones</h3>
            <p className="text-xs sm:text-sm text-[var(--color-neutral)]">Tu centro aún no tiene donaciones registradas.</p>
          </div>
        )}

        {/* Lista */}
        {centroAcopioId && donacionesOrdenadas.length > 0 && (
          <div className="flex flex-col gap-4 sm:gap-5">
            {donacionesOrdenadas.map(d => {
              const estado = estadoConfig(d.estado?.nombre)
              const EstadoIcon = estado.icon
              const tipo = TIPOS_RECURSO.find(t => t.id === d.tipoRecursoId)
              const RecursoIcon = tipo?.icono || Package
              const puedeRecibir = d.estado?.nombre !== 'recibida' && d.estado?.nombre !== 'cancelada'

              return (
                <div
                  key={d.id}
                  className="rounded-2xl sm:rounded-[1.75rem] p-4 sm:p-6 bg-[rgba(255,255,255,0.85)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[10px] transition-all hover:shadow-lg"
                >
                  {/* Fila superior: icono + info + botón */}
                  <div className="flex gap-3 sm:gap-4 items-start">
                    {/* Icono recurso */}
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                      <RecursoIcon size={18} className="sm:hidden" />
                      <RecursoIcon size={24} className="hidden sm:block" />
                    </div>

                    {/* Info principal */}
                    <div className="flex-1 min-w-0">
                      {/* Nombre + badge — en móvil van en columna si no caben */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-base sm:text-lg text-[var(--color-dark)]">
                          {tipo?.nombre || 'Desconocido'}
                        </h3>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg sm:rounded-xl flex items-center gap-1.5 shrink-0 ${estado.bg} ${estado.color}`}>
                          <EstadoIcon size={13} />
                          {estado.label}
                        </span>
                      </div>

                      {/* Cantidad + fechas */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[var(--color-neutral)] mb-2 sm:mb-3">
                        <span className="font-semibold text-[var(--color-dark)]">
                          {d.cantidad}{' '}
                          <span className="font-normal text-[var(--color-neutral)]">{tipo?.unidad || 'unidades'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {new Date(d.fechaRegistro).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        {d.fechaCita && (
                          <span className="flex items-center gap-1">
                            <Clock size={13} />
                            Cita: {new Date(d.fechaCita).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      {/* Observación */}
                      {d.observacion && (
                        <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-neutral)] flex items-start gap-1.5">
                          <MessageSquare size={13} className="mt-0.5 shrink-0" />
                          {d.observacion}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Botón — ancho completo en móvil, auto en desktop */}
                  {puedeRecibir && (
                    <div className="mt-3 sm:mt-0 sm:flex sm:justify-end">
                      <button
                        onClick={() => marcarRecibida(d)}
                        disabled={procesando === d.id}
                        className={`
                          w-full sm:w-auto h-10 px-4 rounded-xl text-sm font-bold text-white transition-all
                          ${procesando === d.id
                            ? 'opacity-70 cursor-wait bg-[var(--color-primary)]'
                            : 'hover:scale-[1.02] bg-[var(--color-primary)] shadow-[0_4px_16px_rgba(232,25,44,0.25)]'
                          }
                        `}
                      >
                        {procesando === d.id ? 'Procesando...' : 'Marcar recibida'}
                      </button>
                    </div>
                  )}
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