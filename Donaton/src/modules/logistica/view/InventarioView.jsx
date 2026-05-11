// InventarioView.jsx
import { useInventarioViewModel } from '../viewmodel/InventarioViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { Package, Warehouse, RefreshCw } from 'lucide-react'
import { TIPOS_RECURSO } from '../../../utils/recursos'

const InventarioView = () => {
  const { inventario, loading, error, centroAcopioId } = useInventarioViewModel()

  if (loading) return <LoadingSpinner />

  // Ordenar según el orden de TIPOS_RECURSO
  const inventarioOrdenado = [...inventario].sort((a, b) => {
    const indexA = TIPOS_RECURSO.findIndex(t => t.id === a.tipoRecursoId)
    const indexB = TIPOS_RECURSO.findIndex(t => t.id === b.tipoRecursoId)
    return indexA - indexB
  })

  return (
    <div className="min-h-screen px-4 py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">Logística</p>
            <h1 className="text-4xl font-black text-[var(--color-dark)]">Inventario de mi Centro</h1>
            <p className="mt-2 text-sm text-[var(--color-neutral)]">Stock disponible para distribución.</p>
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

        {centroAcopioId && inventarioOrdenado.length === 0 ? (
          <div className="rounded-[2rem] p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)]">
              <Package size={36} className="text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-black mb-2 text-[var(--color-dark)]">No hay stock registrado</h3>
            <p className="text-sm text-[var(--color-neutral)]">Tu centro aún no tiene inventario cargado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {inventarioOrdenado.map(item => {
              const tipo = TIPOS_RECURSO.find(t => t.id === item.tipoRecursoId)
              const RecursoIcon = tipo?.icono || Package

              return (
                <div
                  key={item.id}
                  className="rounded-[1.75rem] p-6 bg-[rgba(255,255,255,0.85)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[10px] transition-all hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                      <RecursoIcon size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-[var(--color-dark)]">{tipo?.nombre || 'Desconocido'}</h3>
                      <p className="text-3xl font-black text-[var(--color-primary)] mt-1">
                        {item.cantidadDisponible} <span className="text-sm font-normal text-[var(--color-neutral)]">{tipo?.unidad}</span>
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-[var(--color-neutral)] flex items-center gap-1">
                          <RefreshCw size={12} />
                          {new Date(item.actualizadoEn).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {item.cantidadReservada > 0 && (
                          <span className="text-xs text-[var(--color-accent)] font-medium">
                            {item.cantidadReservada} reservado
                          </span>
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
  )
}

export default InventarioView