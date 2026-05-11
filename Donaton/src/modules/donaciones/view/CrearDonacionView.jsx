import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import {
  MapPin, Calendar, MessageSquare, ArrowLeft,
  HeartHandshake, Building2, ChevronDown, Check,
  Clock, MapPinned
} from 'lucide-react'
import { TIPOS_RECURSO } from '../../../utils/recursos'
import { useCrearDonacionViewModel } from '../viewmodel/CrearDonacionViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

const CrearDonacionView = () => {
  const navigate = useNavigate()
  const [regionSeleccionada, setRegionSeleccionada] = useState('')
  const [tipoOpen, setTipoOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [centroOpen, setCentroOpen] = useState(false)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const tipoRef = useRef(null)
  const regionRef = useRef(null)
  const centroRef = useRef(null)

  const { form, handleChange, handleSubmit, centros, loading, loadingData, error, success } = useCrearDonacionViewModel()

  const regiones = centros.length > 0 
    ? [...new Map(centros.map(c => [c.region.id, c.region])).values()]
    : []
  
  const centrosFiltrados = regionSeleccionada 
    ? centros.filter(c => c.region.id === parseInt(regionSeleccionada)) 
    : []
  
  const tipoSeleccionado = TIPOS_RECURSO.find(t => t.id === parseInt(form.tipoRecursoId))
  const regionSeleccionadaObj = regiones.find(r => r.id === parseInt(regionSeleccionada))
  const centroSeleccionado = centrosFiltrados.find(c => c.id === parseInt(form.centroAcopioId))

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tipoRef.current && !tipoRef.current.contains(e.target)) setTipoOpen(false)
      if (regionRef.current && !regionRef.current.contains(e.target)) setRegionOpen(false)
      if (centroRef.current && !centroRef.current.contains(e.target)) setCentroOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => { if (success) navigate('/donaciones') }, [success])

  if (loadingData) return <LoadingSpinner />

  const handleSelectTipo = (tipoId) => {
    handleChange({ target: { name: 'tipoRecursoId', value: String(tipoId) } })
    setTipoOpen(false)
  }

  const handleSelectRegion = (regionId) => {
    setRegionSeleccionada(String(regionId))
    handleChange({ target: { name: 'centroAcopioId', value: '' } })
    setRegionOpen(false)
  }

  const handleSelectCentro = (centroId) => {
    handleChange({ target: { name: 'centroAcopioId', value: String(centroId) } })
    setCentroOpen(false)
  }

  const handleFechaChange = (e) => {
    const { name, value } = e.target
    if (name === 'fecha') setFecha(value)
    if (name === 'hora') setHora(value)
    
    const newFecha = name === 'fecha' ? value : fecha
    const newHora = name === 'hora' ? value : hora
    if (newFecha && newHora) {
      handleChange({ target: { name: 'fechaCita', value: `${newFecha}T${newHora}` } })
    }
  }

  const fechaMinima = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen px-4 py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-3xl mx-auto relative">
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">Panel donante</p>
            <h1 className="text-4xl font-black text-[var(--color-dark)]">Nueva Donación</h1>
            <p className="mt-2 text-sm text-[var(--color-neutral)]">Coordina tu entrega con un centro de acopio cercano.</p>
          </div>

          <button
            onClick={() => navigate('/donaciones')}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white transition-all hover:scale-[1.02] border border-[rgba(124,132,131,0.15)] text-[var(--color-dark)]"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>

        <div className="rounded-[2rem] p-8 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[12px]">
          <form onSubmit={handleSubmit} className="space-y-10">

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                  {tipoSeleccionado?.icono && <tipoSeleccionado.icono size={22} />}
                </div>
                <div>
                  <h2 className="font-black text-xl text-[var(--color-dark)]">¿Qué vas a donar?</h2>
                  <p className="text-sm text-[var(--color-neutral)]">Selecciona el recurso y la cantidad.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative" ref={tipoRef}>
                  <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Tipo de recurso</label>
                  <button
                    type="button"
                    onClick={() => setTipoOpen(!tipoOpen)}
                    className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] outline-none pl-4 pr-4 text-sm font-medium bg-white transition-all flex items-center gap-3 text-[var(--color-dark)]"
                  >
                    {tipoSeleccionado?.icono && <tipoSeleccionado.icono size={20} className="text-[var(--color-primary)]" />}
                    <span className="flex-1 text-left">{tipoSeleccionado?.nombre || 'Seleccionar'}</span>
                    <ChevronDown size={18} className={`text-[var(--color-neutral)] transition-transform ${tipoOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {tipoOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                      {TIPOS_RECURSO.map((tipo) => {
                        const Icono = tipo.icono
                        const isSelected = parseInt(form.tipoRecursoId) === tipo.id
                        return (
                          <button
                            key={tipo.id}
                            type="button"
                            onClick={() => handleSelectTipo(tipo.id)}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-all ${isSelected ? 'bg-[rgba(232,25,44,0.06)] text-[var(--color-primary)]' : 'text-[var(--color-dark)] hover:bg-gray-50'}`}
                          >
                            {Icono && <Icono size={18} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />}
                            <span className="flex-1 text-left">{tipo.nombre}</span>
                            {isSelected && <Check size={16} className="text-[var(--color-primary)]" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">
                    Cantidad
                    {tipoSeleccionado && <span className="ml-1 text-[var(--color-neutral)]">({tipoSeleccionado.unidad})</span>}
                  </label>
                  <input
                    type="number" name="cantidad" value={form.cantidad} onChange={handleChange}
                    min="0.1" step="0.1" required placeholder="Ej: 10"
                    className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-4 text-sm outline-none bg-white text-[var(--color-dark)]"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(244,172,69,0.10)] text-[var(--color-accent)]">
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 className="font-black text-xl text-[var(--color-dark)]">Centro de acopio</h2>
                  <p className="text-sm text-[var(--color-neutral)]">Elige dónde entregarás tu donación.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative" ref={regionRef}>
                  <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Región</label>
                  <button
                    type="button"
                    onClick={() => setRegionOpen(!regionOpen)}
                    className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] outline-none pl-4 pr-4 text-sm font-medium bg-white transition-all flex items-center gap-3 text-[var(--color-dark)]"
                  >
                    <MapPinned size={20} className="text-[var(--color-accent)]" />
                    <span className="flex-1 text-left">{regionSeleccionadaObj?.nombre || 'Selecciona una región'}</span>
                    <ChevronDown size={18} className={`text-[var(--color-neutral)] transition-transform ${regionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {regionOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                      {regiones.map((region) => {
                        const isSelected = parseInt(regionSeleccionada) === region.id
                        return (
                          <button
                            key={region.id}
                            type="button"
                            onClick={() => handleSelectRegion(region.id)}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-all ${isSelected ? 'bg-[rgba(244,172,69,0.06)] text-[var(--color-accent)]' : 'text-[var(--color-dark)] hover:bg-gray-50'}`}
                          >
                            <MapPinned size={18} className={isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-neutral)]'} />
                            <span className="flex-1 text-left">{region.nombre}</span>
                            {isSelected && <Check size={16} className="text-[var(--color-accent)]" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="relative" ref={centroRef}>
                  <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Centro de acopio</label>
                  <button
                    type="button"
                    onClick={() => regionSeleccionada && setCentroOpen(!centroOpen)}
                    disabled={!regionSeleccionada}
                    className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] outline-none pl-4 pr-4 text-sm font-medium bg-white transition-all flex items-center gap-3 disabled:opacity-50 text-[var(--color-dark)]"
                  >
                    <MapPin size={20} className={regionSeleccionada ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />
                    <span className="flex-1 text-left">{centroSeleccionado?.nombre || (regionSeleccionada ? 'Selecciona un centro' : 'Primero elige una región')}</span>
                    <ChevronDown size={18} className={`text-[var(--color-neutral)] transition-transform ${centroOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {centroOpen && regionSeleccionada && (
                    <div className="absolute z-50 w-full mt-2 rounded-2xl bg-white overflow-hidden border border-[rgba(124,132,131,0.18)] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                      {centrosFiltrados.map((centro) => {
                        const isSelected = parseInt(form.centroAcopioId) === centro.id
                        return (
                          <button
                            key={centro.id}
                            type="button"
                            onClick={() => handleSelectCentro(centro.id)}
                            className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-all ${isSelected ? 'bg-[rgba(232,25,44,0.06)] text-[var(--color-primary)]' : 'text-[var(--color-dark)] hover:bg-gray-50'}`}
                          >
                            <MapPin size={18} className={isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-neutral)]'} />
                            <div className="flex-1 text-left">
                              <div>{centro.nombre}</div>
                              <div className="text-xs text-[var(--color-neutral)]">{centro.direccion}</div>
                            </div>
                            {isSelected && <Check size={16} className="text-[var(--color-primary)]" />}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)] text-[var(--color-neutral)]">
                  <Clock size={22} />
                </div>
                <div>
                  <h2 className="font-black text-xl text-[var(--color-dark)]">Detalles adicionales</h2>
                  <p className="text-sm text-[var(--color-neutral)]">Información opcional sobre tu entrega.</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Fecha</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral)] pointer-events-none" />
                      <input
                        type="date" name="fecha" value={fecha} onChange={handleFechaChange}
                        min={fechaMinima}
                        className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] pl-12 pr-4 text-sm outline-none bg-white text-[var(--color-dark)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Hora</label>
                    <div className="relative">
                      <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral)] pointer-events-none" />
                      <input
                        type="time" name="hora" value={hora} onChange={handleFechaChange}
                        className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] pl-12 pr-4 text-sm outline-none bg-white text-[var(--color-dark)]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">Observación</label>
                  <div className="relative">
                    <MessageSquare size={18} className="absolute left-4 top-4 text-[var(--color-neutral)]" />
                    <textarea
                      name="observacion" value={form.observacion} onChange={handleChange}
                      rows={4} placeholder="Ej: productos sellados, ropa infantil, etc."
                      className="w-full rounded-2xl border border-[rgba(124,132,131,0.18)] pl-12 pr-4 py-3 text-sm outline-none resize-none bg-white text-[var(--color-dark)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="button" onClick={() => navigate('/donaciones')}
                className="flex-1 h-14 rounded-2xl font-bold transition-all hover:scale-[1.01] border border-[rgba(124,132,131,0.15)] text-[var(--color-dark)] bg-white"
              >
                Cancelar
              </button>

              <button
                type="submit" disabled={loading}
                className="flex-1 h-14 rounded-2xl text-white font-bold transition-all hover:scale-[1.01] disabled:opacity-70 bg-[var(--color-primary)] shadow-[0_8px_24px_rgba(232,25,44,0.25)]"
              >
                {loading ? 'Registrando...' : 'Confirmar donación'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CrearDonacionView