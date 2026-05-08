import { Link } from 'react-router-dom'
import { useDonacionesViewModel } from '../viewmodel/DonacionesViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

const DonacionesView = () => {
  const { donaciones, loading, error, getTipoNombre } = useDonacionesViewModel()

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis Donaciones</h1>
          <Link to="/donaciones/crear" className="btn btn-primary">Nueva donación</Link>
        </div>

        {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

        {donaciones.length === 0 ? (
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center py-12">
              <p className="text-lg opacity-60">No tienes donaciones aún</p>
              <Link to="/donaciones/crear" className="btn btn-primary mt-4">Crear primera donación</Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {donaciones.map(d => (
              <div key={d.id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{getTipoNombre(d.tipoRecursoId)}</h3>
                      <p className="text-sm opacity-60">Cantidad: {d.cantidad}</p>
                      <p className="text-sm opacity-60">
                        Fecha registro: {new Date(d.fechaRegistro).toLocaleDateString('es-CL')}
                      </p>
                      {d.fechaCita && (
                        <p className="text-sm opacity-60">
                          Cita: {new Date(d.fechaCita).toLocaleString('es-CL')}
                        </p>
                      )}
                      {d.observacion && <p className="text-sm mt-1">{d.observacion}</p>}
                    </div>
                    <span className={`badge badge-lg ${
                      d.estado.nombre === 'pendiente' ? 'badge-warning' :
                      d.estado.nombre === 'agendada' ? 'badge-info' :
                      d.estado.nombre === 'completada' ? 'badge-success' :
                      'badge-ghost'
                    }`}>
                      {d.estado.nombre}
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

export default DonacionesView