import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReportarNecesidadViewModel } from '../viewmodel/ReportarNecesidadViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

const ReportarNecesidadView = () => {
  const navigate = useNavigate()
  const {
    form, handleChange, handleSubmit,
    estados, comunas, TIPOS_RECURSO,
    loading, loadingData, error, success,
  } = useReportarNecesidadViewModel()

  useEffect(() => {
    if (success) navigate('/necesidades')
  }, [success])

  if (loadingData) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Reportar Necesidad</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Tipo de recurso</span></label>
                <select name="tipoRecursoId" value={form.tipoRecursoId} onChange={handleChange} className="select select-bordered w-full">
                  {TIPOS_RECURSO.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Cantidad</span></label>
                <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} className="input input-bordered" placeholder="Ej: 50" min="0.1" step="0.1" required />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Dirección</span></label>
                <input type="text" name="direccion" value={form.direccion} onChange={handleChange} className="input input-bordered" placeholder="Ej: Av. Principal 123" required />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Comuna</span></label>
                <select name="comunaId" value={form.comunaId} onChange={handleChange} className="select select-bordered w-full">
                  {comunas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Estado</span></label>
                <select name="estadoId" value={form.estadoId} onChange={handleChange} className="select select-bordered w-full">
                  {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Descripción (opcional)</span></label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="textarea textarea-bordered" placeholder="Describe la necesidad..." />
              </div>

              {error && <div className="alert alert-error text-sm"><span>{error}</span></div>}

              <div className="flex gap-3">
                <button type="button" onClick={() => navigate('/necesidades')} className="btn btn-outline flex-1">Cancelar</button>
                <button type="submit" className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`} disabled={loading}>
                  {loading ? 'Guardando...' : 'Reportar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportarNecesidadView