import { Link } from 'react-router-dom'
import {
  Plus, MapPin, Calendar, HeartHandshake,
  CheckCircle2, Clock, Loader2
} from 'lucide-react'

import { TIPOS_RECURSO } from '../../../utils/recursos'
import { useNecesidadesViewModel } from '../viewmodel/NecesidadesViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

const estadoConfig = (nombre) => {
  const configs = {
    'pendiente': { bg: 'bg-[rgba(244,172,69,0.12)]', color: 'text-[#B87A00]', icon: Clock, label: 'Pendiente' },
    'en proceso': { bg: 'bg-[rgba(59,130,246,0.10)]', color: 'text-[#2563EB]', icon: Loader2, label: 'En proceso' },
    'cubierta': { bg: 'bg-[rgba(34,197,94,0.10)]', color: 'text-[#16A34A]', icon: CheckCircle2, label: 'Cubierta' },
  }
  return configs[nombre] || { bg: 'bg-[rgba(124,132,131,0.10)]', color: 'text-[var(--color-neutral)]', icon: Clock, label: nombre }
}

const NecesidadesView = () => {
  const { necesidades, loading, error } = useNecesidadesViewModel()

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen px-3 sm:px-4 lg:px-6 py-8 sm:py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-4xl mx-auto relative">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-1 sm:mb-2 text-[var(--color-primary)]">Municipalidad</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--color-dark)]">Necesidades Reportadas</h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[var(--color-neutral)]">Gestiona las necesidades de ayuda humanitaria reportadas.</p>
          </div>
          <Link
            to="/necesidades/reportar"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-bold text-sm transition-all hover:scale-[1.02] bg-[var(--color-primary)] shadow-[0_8px_24px_rgba(232,25,44,0.25)] shrink-0"
          >
            <Plus size={16} className="sm:hidden" />
            <Plus size={18} className="hidden sm:block" />
            Reportar necesidad
          </Link>
        </div>

        {error && (
          <div className="rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium mb-5 sm:mb-6 bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
            {error}
          </div>
        )}

        {necesidades.length === 0 ? (
          <div className="rounded-2xl sm:rounded-[2rem] p-8 sm:p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-xl sm:rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)]">
              <HeartHandshake size={28} className="sm:hidden text-[var(--color-primary)]" />
              <HeartHandshake size={36} className="hidden sm:block text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg sm:text-2xl font-black mb-2 text-[var(--color-dark)]">No hay necesidades reportadas</h3>
            <p className="text-xs sm:text-sm mb-5 sm:mb-6 text-[var(--color-neutral)]">Reporta recursos necesarios para coordinar ayuda rápidamente.</p>
            <Link
              to="/necesidades/reportar"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-white font-bold text-sm transition-all hover:scale-[1.02] bg-[var(--color-primary)] shadow-[0_8px_24px_rgba(232,25,44,0.25)]"
            >
              <Plus size={16} />
              Reportar primera necesidad
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-5">
            {necesidades.map(n => {
              const estado = estadoConfig(n.estado?.nombre)
              const EstadoIcon = estado.icon
              const tipo = TIPOS_RECURSO.find(t => t.id === n.tipoRecursoId)
              const RecursoIcon = tipo?.icono
              const porcentaje = Math.min((n.cantidadCubierta / n.cantidad) * 100, 100)

              return (
                <div
                  key={n.id}
                  className="rounded-2xl sm:rounded-[1.75rem] p-4 sm:p-6 transition-all hover:shadow-lg bg-[rgba(255,255,255,0.85)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[10px]"
                >
                  <div className="flex gap-3 sm:gap-4 items-start">
                    {/* Icono */}
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                      {RecursoIcon && (
                        <>
                          <RecursoIcon size={18} className="sm:hidden" />
                          <RecursoIcon size={24} className="hidden sm:block" />
                        </>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Nombre + badge */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-xl font-black text-[var(--color-dark)]">{tipo?.nombre || 'Recurso'}</h3>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg sm:rounded-xl flex items-center gap-1.5 shrink-0 ${estado.bg} ${estado.color}`}>
                          <EstadoIcon size={13} />
                          {estado.label}
                        </span>
                      </div>

                      {/* Metadatos */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm mb-3">
                        <span className="font-semibold text-[var(--color-dark)]">
                          {n.cantidad} <span className="font-normal text-[var(--color-neutral)]">{tipo?.unidad}</span>
                        </span>
                        {n.cantidadCubierta > 0 && (
                          <span className="flex items-center gap-1 text-[var(--color-accent)]">
                            <HeartHandshake size={13} />
                            {n.cantidadCubierta} cubierta
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[var(--color-neutral)]">
                          <MapPin size={13} />
                          {n.direccion}
                        </span>
                        <span className="flex items-center gap-1 text-[var(--color-neutral)]">
                          <Calendar size={13} />
                          {new Date(n.fechaReporte).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Barra de progreso */}
                      <div className="w-full h-1.5 sm:h-2 rounded-full bg-[rgba(124,132,131,0.12)] overflow-hidden mb-2 sm:mb-3">
                        <div
                          className="h-full rounded-full transition-all bg-[var(--color-primary)]"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>

                      {n.descripcion && (
                        <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-neutral)]">{n.descripcion}</p>
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

export default NecesidadesView