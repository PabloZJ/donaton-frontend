import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useCrearDonacionViewModel } from '../viewmodel/CrearDonacionViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

const CrearDonacionView = () => {
  const navigate = useNavigate()
  const {
    form, handleChange, handleSubmit,
    centros, estados, TIPOS_RECURSO,
    loading, loadingData, error, success,
  } = useCrearDonacionViewModel()

  useEffect(() => {
    if (success) navigate('/donaciones')
  }, [success])

  if (loadingData) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Nueva Donación</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Tipo de recurso</span></label>
                <select name="tipoRecursoId" value={form.tipoRecursoId} onChange={handleChange} className="select select-bordered w-full">
                  {TIPOS_RECURSO.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Cantidad</span></label>
                <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} className="input input-bordered" placeholder="Ej: 10.5" min="0.1" step="0.1" required />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Centro de acopio</span></label>
                <select name="centroAcopioId" value={form.centroAcopioId} onChange={handleChange} className="select select-bordered w-full">
                  {centros.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} — {c.direccion}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Estado</span></label>
                <select name="estadoId" value={form.estadoId} onChange={handleChange} className="select select-bordered w-full">
                  {estados.map(e => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Fecha de cita (opcional)</span></label>
                <input type="datetime-local" name="fechaCita" value={form.fechaCita} onChange={handleChange} className="input input-bordered" />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Observación (opcional)</span></label>
                <textarea name="observacion" value={form.observacion} onChange={handleChange} className="textarea textarea-bordered" placeholder="Agrega una nota..." />
              </div>

              {error && <div className="alert alert-error text-sm"><span>{error}</span></div>}

              <div className="flex gap-3">
                <button type="button" onClick={() => navigate('/donaciones')} className="btn btn-outline flex-1">
                  Cancelar
                </button>
                <button type="submit" className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? 'Guardando...' : 'Crear donación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrearDonacionView