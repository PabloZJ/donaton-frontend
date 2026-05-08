import { Link } from 'react-router-dom'
import { useNecesidadesViewModel } from '../viewmodel/NecesidadesViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

const NecesidadesView = () => {
  const { necesidades, loading, error, getTipoNombre } = useNecesidadesViewModel()

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis Necesidades</h1>
          <Link to="/necesidades/reportar" className="btn btn-primary">Reportar necesidad</Link>
        </div>

        {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

        {necesidades.length === 0 ? (
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center py-12">
              <p className="text-lg opacity-60">No has reportado necesidades aún</p>
              <Link to="/necesidades/reportar" className="btn btn-primary mt-4">Reportar primera necesidad</Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {necesidades.map(n => (
              <div key={n.id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{getTipoNombre(n.tipoRecursoId)}</h3>
                      <p className="text-sm opacity-60">Cantidad: {n.cantidad} {n.cantidadCubierta > 0 && `(Cubierta: ${n.cantidadCubierta})`}</p>
                      <p className="text-sm opacity-60">Dirección: {n.direccion}</p>
                      <p className="text-sm opacity-60">Fecha: {new Date(n.fechaReporte).toLocaleDateString('es-CL')}</p>
                      {n.descripcion && <p className="text-sm mt-1">{n.descripcion}</p>}
                    </div>
                    <span className={`badge badge-lg ${
                      n.estado.nombre === 'pendiente' ? 'badge-warning' :
                      n.estado.nombre === 'en proceso' ? 'badge-info' :
                      n.estado.nombre === 'cubierta' ? 'badge-success' :
                      'badge-ghost'
                    }`}>
                      {n.estado.nombre}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NecesidadesView