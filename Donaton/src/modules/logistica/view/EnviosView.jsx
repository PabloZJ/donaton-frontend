import { useState, useEffect, useRef } from 'react'
import { useEnviosViewModel } from '../viewmodel/EnviosViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

import {
  Truck,
  MapPin,
  Calendar,
  Inbox,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ChevronDown,
  Check,
} from 'lucide-react'

const ESTADOS = {
  planificado: {
    style: 'bg-[rgba(244,172,69,0.12)] text-[#B87A00]',
    icon: Clock3,
  },
  'en camino': {
    style: 'bg-[rgba(59,130,246,0.10)] text-[#2563EB]',
    icon: Truck,
  },
  entregado: {
    style: 'bg-[rgba(34,197,94,0.10)] text-[#16A34A]',
    icon: PackageCheck,
  },
}

const EnviosView = () => {
  const {
    envios,
    comunas,
    form,
    handleChange,
    handleSubmit,
    loading,
    loadingData,
    error,
    success,
    getComunaNombre,
  } = useEnviosViewModel()

  const [comunaOpen, setComunaOpen] = useState(false)

  const comunaRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (comunaRef.current && !comunaRef.current.contains(e.target)) {
        setComunaOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (loadingData) return <LoadingSpinner />

  const comunaSeleccionada = comunas.find(
    c => c.id === parseInt(form.comunaId)
  )

  const handleSelectComuna = (comunaId) => {
    handleChange({
      target: {
        name: 'comunaId',
        value: String(comunaId),
      },
    })

    setComunaOpen(false)
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">

      <div className="fixed top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-5xl mx-auto relative flex flex-col gap-8">

        <div className="flex items-start justify-between gap-4">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">
              Logística
            </p>

            <h1 className="text-4xl font-black text-[var(--color-dark)]">
              Gestión de Envíos
            </h1>

            <p className="mt-2 text-sm text-[var(--color-neutral)]">
              Planifica y controla los envíos de ayuda humanitaria.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
            <Truck size={24} />
          </div>

        </div>

        <div className="rounded-[2rem] p-8 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[10px]">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
              <Truck size={22} />
            </div>

            <div>
              <h2 className="font-black text-xl text-[var(--color-dark)]">
                Nuevo Envío
              </h2>

              <p className="text-sm text-[var(--color-neutral)]">
                Todos los envíos nuevos quedan automáticamente planificados.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">
                  Destino
                </label>

                <input
                  type="text"
                  name="destino"
                  value={form.destino}
                  onChange={handleChange}
                  placeholder="Dirección del envío"
                  required
                  className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-5 text-sm outline-none bg-white text-[var(--color-dark)]"
                />

              </div>

              <div className="relative" ref={comunaRef}>

                <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">
                  Comuna
                </label>

                <button
                  type="button"
                  onClick={() => setComunaOpen(!comunaOpen)}
                  className="
                    w-full h-14 rounded-2xl
                    border border-[rgba(124,132,131,0.18)]
                    outline-none
                    pl-4 pr-4
                    text-sm font-medium
                    bg-white
                    transition-all
                    flex items-center gap-3
                    text-[var(--color-dark)]
                  "
                >

                  <MapPin size={18} className="text-[var(--color-primary)]" />

                  <span className="flex-1 text-left">
                    {comunaSeleccionada?.nombre || 'Seleccionar comuna'}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`
                      text-[var(--color-neutral)]
                      transition-transform
                      ${comunaOpen ? 'rotate-180' : ''}
                    `}
                  />

                </button>

                {comunaOpen && (
                  <div
                    className="
                      absolute z-50 w-full mt-2
                      rounded-2xl bg-white overflow-hidden
                      border border-[rgba(124,132,131,0.18)]
                      shadow-[0_10px_40px_rgba(0,0,0,0.12)]
                      max-h-72 overflow-y-auto
                    "
                  >

                    {comunas.map((c) => {
                      const isSelected = parseInt(form.comunaId) === c.id

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectComuna(c.id)}
                          className={`
                            w-full px-4 py-3
                            flex items-center gap-3
                            text-sm font-medium
                            transition-all
                            ${
                              isSelected
                                ? 'bg-[rgba(232,25,44,0.06)] text-[var(--color-primary)]'
                                : 'text-[var(--color-dark)] hover:bg-gray-50'
                            }
                          `}
                        >

                          <MapPin
                            size={16}
                            className={
                              isSelected
                                ? 'text-[var(--color-primary)]'
                                : 'text-[var(--color-neutral)]'
                            }
                          />

                          <span className="flex-1 text-left">
                            {c.nombre}
                          </span>

                          {isSelected && (
                            <Check
                              size={16}
                              className="text-[var(--color-primary)]"
                            />
                          )}

                        </button>
                      )
                    })}

                  </div>
                )}

              </div>

            </div>

            <div className="max-w-sm">

              <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">
                Fecha planificada
              </label>

              <input
                type="date"
                name="fechaPlanificada"
                value={form.fechaPlanificada}
                onChange={handleChange}
                required
                className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-5 text-sm outline-none bg-white text-[var(--color-dark)]"
              />

            </div>

            {error && (
              <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)] text-[#16A34A] flex items-center gap-2">
                <CheckCircle2 size={16} />
                Envío creado correctamente
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-white font-bold text-sm transition-all hover:scale-[1.01] disabled:opacity-50 bg-[var(--color-primary)] shadow-[0_10px_30px_rgba(232,25,44,0.20)]"
            >
              {loading ? 'Procesando...' : 'Crear envío'}
            </button>

          </form>

        </div>

        <div>

          <h2 className="text-2xl font-black mb-4 text-[var(--color-dark)]">
            Historial de Envíos
          </h2>

          {envios.length === 0 ? (
            <div className="rounded-[2rem] p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">

              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)]">
                <Inbox size={36} className="text-[var(--color-neutral)]" />
              </div>

              <h3 className="text-xl font-black mb-2 text-[var(--color-dark)]">
                No hay envíos
              </h3>

              <p className="text-sm text-[var(--color-neutral)]">
                Aún no existen envíos registrados.
              </p>

            </div>
          ) : (
            <div className="flex flex-col gap-4">

              {envios.map(e => {
                const estado = ESTADOS[e.estado?.nombre] || {}
                const Icono = estado.icon || Truck

                return (
                  <div
                    key={e.id}
                    className="rounded-[1.75rem] p-6 bg-[rgba(255,255,255,0.85)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[10px]"
                  >

                    <div className="flex justify-between items-start gap-4">

                      <div className="flex items-start gap-4">

                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                          <Truck size={20} />
                        </div>

                        <div>

                          <h3 className="font-black text-lg text-[var(--color-dark)]">
                            {e.destino}
                          </h3>

                          <div className="mt-2 flex flex-col gap-1 text-sm text-[var(--color-neutral)]">

                            <p className="flex items-center gap-2">
                              <MapPin size={14} />
                              {e.comuna?.nombre || getComunaNombre(e.comunaId)}
                            </p>

                            <p className="flex items-center gap-2">
                              <Calendar size={14} />
                              {new Date(e.fechaPlanificada).toLocaleDateString('es-CL')}
                            </p>

                            {e.fechaEntrega && (
                              <p className="flex items-center gap-2">
                                <CheckCircle2 size={14} />
                                Entregado el {new Date(e.fechaEntrega).toLocaleDateString('es-CL')}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                      <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${estado.style}`}>

                        <Icono size={14} />
                        {e.estado?.nombre}

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