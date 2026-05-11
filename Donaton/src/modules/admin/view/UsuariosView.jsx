import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useUsuariosViewModel } from '../viewmodel/UsuariosViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

import {
  Users,
  UserPlus,
  Trash2,
  CheckCircle2,
  Building2,
  Warehouse,
  Shield,
  Heart,
  MapPin,
  ChevronDown,
  Check,
} from 'lucide-react'

const ROL_ICONS = {
  1: Heart,
  2: Building2,
  3: Warehouse,
  4: Shield,
}

const CustomSelect = ({
  label,
  options = [],
  value,
  onChange,
  name,
  renderOption,
  renderSelected,
}) => {
  const [open, setOpen] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState({})

  const ref = useRef(null)
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)

  const updatePosition = () => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()

    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 999999,
    })
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedButton =
        ref.current && ref.current.contains(e.target)

      const clickedDropdown =
        dropdownRef.current &&
        dropdownRef.current.contains(e.target)

      if (!clickedButton && !clickedDropdown) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [])

  const handleToggle = () => {
    if (!open) {
      updatePosition()
    }

    setOpen(prev => !prev)
  }

  const handleSelect = (option) => {
    onChange({
      target: {
        name,
        value: String(option.id),
      },
    })

    setOpen(false)
  }

  const selected = options.find(
    o => String(o.id) === String(value)
  )

  return (
    <div className="relative w-full" ref={ref}>
      {label && (
        <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">
          {label}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="
          w-full h-14 rounded-2xl
          border border-[rgba(124,132,131,0.18)]
          bg-white
          px-4
          flex items-center gap-3
          text-sm font-medium
          text-[var(--color-dark)]
          transition-all
          hover:border-[rgba(232,25,44,0.25)]
          focus:outline-none
          focus:ring-4
          focus:ring-[rgba(232,25,44,0.08)]
        "
      >
        <span className="flex-1 text-left truncate">
          {selected
            ? renderSelected(selected)
            : 'Seleccionar'}
        </span>

        <ChevronDown
          size={18}
          className={`
            text-[var(--color-neutral)]
            transition-transform duration-200
            ${open ? 'rotate-180' : ''}
          `}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="
              rounded-2xl
              bg-white
              border border-[rgba(124,132,131,0.18)]
              shadow-[0_20px_60px_rgba(0,0,0,0.16)]
              overflow-hidden
              max-h-72
              overflow-y-auto
              backdrop-blur-xl
            "
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400">
                Sin opciones
              </div>
            ) : (
              options.map((o) => {
                const isSelected =
                  String(o.id) === String(value)

                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => handleSelect(o)}
                    className={`
                      w-full
                      px-4 py-3
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
                    <span className="flex-1 text-left">
                      {renderOption(o)}
                    </span>

                    {isSelected && (
                      <Check
                        size={16}
                        className="text-[var(--color-primary)]"
                      />
                    )}
                  </button>
                )
              })
            )}
          </div>,
          document.body
        )}
    </div>
  )
}

const UsuariosView = () => {
  const {
    usuarios = [],
    comunasFiltradas = [],
    centrosFiltrados = [],
    regiones = [],

    form,
    handleChange,
    handleSubmit,
    handleEliminar,

    loading,
    loadingData,
    error,
    success,

    filtroRol,
    setFiltroRol,

    getRolNombre,
    getRolColor,
  } = useUsuariosViewModel()

  const [confirmDelete, setConfirmDelete] = useState(null)

  if (loadingData) return <LoadingSpinner />

  const ROLES = [
    { id: '1', nombre: 'Donante' },
    { id: '2', nombre: 'Municipalidad' },
    { id: '3', nombre: 'Operador' },
    { id: '4', nombre: 'Admin' },
  ]

  const FILTROS = [
    { id: 'todos', nombre: 'Todos' },
    { id: '1', nombre: 'Donantes' },
    { id: '2', nombre: 'Municipalidades' },
    { id: '3', nombre: 'Operadores' },
    { id: '4', nombre: 'Admins' },
  ]

  return (
    <div className="min-h-screen px-4 py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">
              Administración
            </p>

            <h1 className="text-4xl font-black text-[var(--color-dark)]">
              Gestión de Usuarios
            </h1>

            <p className="mt-2 text-sm text-[var(--color-neutral)]">
              Crea y administra los usuarios del sistema.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
            <Users size={24} />
          </div>
        </div>

        {/* FORM */}
        <div className="rounded-[2rem] p-8 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[10px]">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
              <UserPlus size={22} />
            </div>

            <div>
              <h2 className="font-black text-xl text-[var(--color-dark)]">
                Crear nuevo usuario
              </h2>

              <p className="text-sm text-[var(--color-neutral)]">
                Completa los datos según el rol asignado.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">
                  Nombre completo
                </label>

                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                  className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[var(--color-dark)]">
                  Contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full h-14 rounded-2xl border border-[rgba(124,132,131,0.18)] px-5 text-sm bg-white"
                />
              </div>

              <CustomSelect
                label="Rol"
                name="rolId"
                value={form.rolId}
                onChange={handleChange}
                options={ROLES}
                renderSelected={(o) => o.nombre}
                renderOption={(o) => o.nombre}
              />

              {form.rolId === '2' && (
                <>
                  <CustomSelect
                    label="Región"
                    name="regionId"
                    value={form.regionId}
                    onChange={handleChange}
                    options={regiones}
                    renderSelected={(o) => o.nombre}
                    renderOption={(o) => o.nombre}
                  />

                  <CustomSelect
                    label="Comuna"
                    name="comunaId"
                    value={form.comunaId}
                    onChange={handleChange}
                    options={comunasFiltradas}
                    renderSelected={(o) => o.nombre}
                    renderOption={(o) => o.nombre}
                  />
                </>
              )}

              {form.rolId === '3' && (
                <>
                  <CustomSelect
                    label="Región"
                    name="regionCentroId"
                    value={form.regionCentroId}
                    onChange={handleChange}
                    options={regiones}
                    renderSelected={(o) => o.nombre}
                    renderOption={(o) => o.nombre}
                  />

                  <CustomSelect
                    label="Centro de acopio"
                    name="centroAcopioId"
                    value={form.centroAcopioId}
                    onChange={handleChange}
                    options={centrosFiltrados}
                    renderSelected={(o) => o.nombre}
                    renderOption={(o) => o.nombre}
                  />
                </>
              )}
            </div>

            {error && (
              <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.15)] text-[#16A34A] flex items-center gap-2">
                <CheckCircle2 size={16} />
                Usuario creado correctamente
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-white font-bold text-sm bg-[var(--color-primary)]"
            >
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </form>
        </div>

        {/* LISTA */}
        <div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-[var(--color-dark)]">
              Usuarios registrados
            </h2>

            <div className="w-[220px]">
              <CustomSelect
                name="filtroRol"
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
                options={FILTROS}
                renderSelected={(o) => o.nombre}
                renderOption={(o) => o.nombre}
              />
            </div>
          </div>

          {usuarios.length === 0 ? (
            <div className="rounded-[2rem] p-12 text-center bg-white border">
              <h3 className="text-xl font-black mb-2">
                Sin usuarios
              </h3>

              <p className="text-sm text-gray-500">
                No hay usuarios en este filtro.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">

              {usuarios.map((u) => {
                const RolIconUser =
                  ROL_ICONS[u.rol?.id] || Heart

                return (
                  <div
                    key={u.id}
                    className="rounded-[1.75rem] p-5 bg-white border border-[rgba(124,132,131,0.12)] shadow-sm"
                  >
                    <div className="flex justify-between items-center">

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
                          <RolIconUser size={22} />
                        </div>

                        <div>
                          <p className="font-bold text-[var(--color-dark)]">
                            {u.nombre}
                          </p>

                          <p className="text-sm text-[var(--color-neutral)]">
                            {u.email}
                          </p>

                          {u.comunaId && (
                            <p className="text-xs text-[var(--color-neutral)] flex items-center gap-1 mt-1">
                              <MapPin size={10} />
                              Comuna ID: {u.comunaId}
                            </p>
                          )}

                          {u.centroAcopioId && (
                            <p className="text-xs text-[var(--color-neutral)] flex items-center gap-1 mt-1">
                              <Warehouse size={10} />
                              Centro ID: {u.centroAcopioId}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">

                        <span
                          className={`
                            text-xs font-bold px-3 py-1.5 rounded-xl border
                            ${getRolColor(u.rol?.id)}
                          `}
                        >
                          {getRolNombre(u.rol?.id)}
                        </span>

                        {confirmDelete === u.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                handleEliminar(u.id)
                                setConfirmDelete(null)
                              }}
                              className="h-9 px-3 rounded-xl text-xs font-bold bg-red-500 text-white"
                            >
                              Confirmar
                            </button>

                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="h-9 px-3 rounded-xl text-xs font-bold border"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(u.id)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]"
                          >
                            <Trash2 size={16} />
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
    </div>
  )
}

export default UsuariosView