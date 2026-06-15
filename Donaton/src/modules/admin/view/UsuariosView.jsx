import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useUsuariosViewModel } from "../viewmodel/UsuariosViewModel";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { validators, validateForm } from "../../../utils/validations";

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
  AlertCircle,
} from "lucide-react";

const ROL_ICONS = {
  1: Heart,
  2: Building2,
  3: Warehouse,
  4: Shield,
};

const CustomSelect = ({
  label,
  options = [],
  value,
  onChange,
  name,
  renderOption,
  renderSelected,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 999999,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedButton = ref.current && ref.current.contains(e.target);
      const clickedDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
      if (!clickedButton && !clickedDropdown) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, []);

  const handleToggle = () => {
    if (!open) updatePosition();
    setOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    onChange({ target: { name, value: String(option.id) } });
    setOpen(false);
  };

  const selected = options.find((o) => String(o.id) === String(value));

  return (
    <div className="relative w-full" ref={ref}>
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${error ? "text-red-600" : "text-[var(--color-dark)]"}`}>
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`w-full h-14 rounded-2xl border bg-white px-4 flex items-center gap-3 text-sm font-medium text-[var(--color-dark)] transition-all outline-none ${
          error ? "border-red-400" : "border-[rgba(124,132,131,0.18)]"
        }`}
      >
        <span className="flex-1 text-left truncate">
          {selected ? renderSelected(selected) : <span className="text-[var(--color-neutral)]">Seleccionar</span>}
        </span>
        <ChevronDown size={18} className={`text-[var(--color-neutral)] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {error && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <AlertCircle size={13} className="text-red-600 shrink-0" />
          <span className="text-xs font-medium text-red-600">{error}</span>
        </div>
      )}

      {open && createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="rounded-2xl bg-white border border-[rgba(124,132,131,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.16)] overflow-hidden max-h-72 overflow-y-auto"
        >
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">Sin opciones</div>
          ) : (
            options.map((o) => {
              const isSelected = String(o.id) === String(value);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => handleSelect(o)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-sm font-medium transition-all ${
                    isSelected ? "bg-[rgba(232,25,44,0.06)] text-[var(--color-primary)]" : "text-[var(--color-dark)] hover:bg-gray-50"
                  }`}
                >
                  <span className="flex-1 text-left">{renderOption(o)}</span>
                  {isSelected && <Check size={16} className="text-[var(--color-primary)]" />}
                </button>
              );
            })
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

const FieldError = ({ msg }) =>
  msg ? (
    <div className="flex items-center gap-1.5 mt-1.5">
      <AlertCircle size={13} className="text-red-600 shrink-0" />
      <span className="text-xs font-medium text-red-600">{msg}</span>
    </div>
  ) : null;

const inputClass = (error) =>
  `w-full h-14 rounded-2xl border px-5 text-sm bg-white outline-none transition-all ${
    error ? "border-red-400" : "border-[rgba(124,132,131,0.18)]"
  }`;

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
  } = useUsuariosViewModel();

  const [formErrors, setFormErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (loadingData) return <LoadingSpinner />;

  const ROLES = [
    { id: "1", nombre: "Donante" },
    { id: "2", nombre: "Municipalidad" },
    { id: "3", nombre: "Operador" },
    { id: "4", nombre: "Admin" },
  ];

  const FILTROS = [
    { id: "todos", nombre: "Todos" },
    { id: "1", nombre: "Donantes" },
    { id: "2", nombre: "Municipalidades" },
    { id: "3", nombre: "Operadores" },
    { id: "4", nombre: "Admins" },
  ];

  const buildSchema = () => {
    const schema = {
      nombre: (v) => validators.required(v, "El nombre"),
      email: (v) => validators.email(v),
      password: (v) => validators.password(v),
      rolId: (v) => validators.select(v, "un rol"),
    };

    if (form.rolId === "2") {
      schema.regionId = (v) => validators.select(v, "una región");
      schema.comunaId = (v) => validators.select(v, "una comuna");
    }

    if (form.rolId === "3") {
      schema.regionCentroId = (v) => validators.select(v, "una región");
      schema.centroAcopioId = (v) => validators.select(v, "un centro de acopio");
    }

    return schema;
  };

  const handleChangeWithClear = (e) => {
    const { name } = e.target;
    handleChange(e);
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmitWithValidation = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateForm(form, buildSchema());
    setFormErrors(errors);
    if (!isValid) return;
    handleSubmit(e);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 sm:py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">
              Administración
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--color-dark)]">
              Gestión de Usuarios
            </h1>
            <p className="mt-2 text-sm text-[var(--color-neutral)]">
              Crea y administra los usuarios del sistema.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)] shrink-0">
            <Users size={24} />
          </div>
        </div>

        {/* Formulario */}
        <div className="rounded-[2rem] p-6 sm:p-8 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[10px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)] shrink-0">
              <UserPlus size={22} />
            </div>
            <div>
              <h2 className="font-black text-xl text-[var(--color-dark)]">Crear nuevo usuario</h2>
              <p className="text-sm text-[var(--color-neutral)]">Completa los datos según el rol asignado.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitWithValidation} className="space-y-8" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Nombre */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${formErrors.nombre ? "text-red-600" : "text-[var(--color-dark)]"}`}>
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChangeWithClear}
                  placeholder="Nombre completo"
                  className={inputClass(formErrors.nombre)}
                />
                <FieldError msg={formErrors.nombre} />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${formErrors.email ? "text-red-600" : "text-[var(--color-dark)]"}`}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChangeWithClear}
                  placeholder="correo@ejemplo.com"
                  className={inputClass(formErrors.email)}
                />
                <FieldError msg={formErrors.email} />
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${formErrors.password ? "text-red-600" : "text-[var(--color-dark)]"}`}>
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChangeWithClear}
                  placeholder="Mínimo 6 caracteres"
                  className={inputClass(formErrors.password)}
                />
                <FieldError msg={formErrors.password} />
              </div>

              {/* Rol */}
              <CustomSelect
                label="Rol"
                name="rolId"
                value={form.rolId}
                onChange={handleChangeWithClear}
                options={ROLES}
                renderSelected={(o) => o.nombre}
                renderOption={(o) => o.nombre}
                error={formErrors.rolId}
              />

              {/* Municipalidad: región + comuna */}
              {form.rolId === "2" && (
                <>
                  <CustomSelect
                    label="Región"
                    name="regionId"
                    value={form.regionId}
                    onChange={handleChangeWithClear}
                    options={regiones}
                    renderSelected={(o) => o.nombre}
                    renderOption={(o) => o.nombre}
                    error={formErrors.regionId}
                  />
                  <CustomSelect
                    label="Comuna"
                    name="comunaId"
                    value={form.comunaId}
                    onChange={handleChangeWithClear}
                    options={comunasFiltradas}
                    renderSelected={(o) => o.nombre}
                    renderOption={(o) => o.nombre}
                    error={formErrors.comunaId}
                  />
                </>
              )}

              {/* Operador: región + centro */}
              {form.rolId === "3" && (
                <>
                  <CustomSelect
                    label="Región"
                    name="regionCentroId"
                    value={form.regionCentroId}
                    onChange={handleChangeWithClear}
                    options={regiones}
                    renderSelected={(o) => o.nombre}
                    renderOption={(o) => o.nombre}
                    error={formErrors.regionCentroId}
                  />
                  <CustomSelect
                    label="Centro de acopio"
                    name="centroAcopioId"
                    value={form.centroAcopioId}
                    onChange={handleChangeWithClear}
                    options={centrosFiltrados}
                    renderSelected={(o) => o.nombre}
                    renderOption={(o) => o.nombre}
                    error={formErrors.centroAcopioId}
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
              className="w-full h-14 rounded-2xl text-white font-bold text-sm bg-[var(--color-primary)] transition-all hover:scale-[1.01] disabled:opacity-70 shadow-[0_10px_30px_rgba(232,25,44,0.20)]"
            >
              {loading ? "Creando..." : "Crear usuario"}
            </button>
          </form>
        </div>

        {/* Lista usuarios */}
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-2xl font-black text-[var(--color-dark)]">Usuarios registrados</h2>
            <div className="w-full sm:w-[220px]">
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
              <h3 className="text-xl font-black mb-2">Sin usuarios</h3>
              <p className="text-sm text-gray-500">No hay usuarios en este filtro.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {usuarios.map((u) => {
                const RolIconUser = ROL_ICONS[u.rol?.id] || Heart;
                return (
                  <div
                    key={u.id}
                    className="rounded-[1.75rem] p-4 sm:p-5 bg-white border border-[rgba(124,132,131,0.12)] shadow-sm"
                  >
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)] shrink-0">
                          <RolIconUser size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[var(--color-dark)] truncate">{u.nombre}</p>
                          <p className="text-sm text-[var(--color-neutral)] truncate">{u.email}</p>
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

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span className={`hidden sm:inline text-xs font-bold px-3 py-1.5 rounded-xl border ${getRolColor(u.rol?.id)}`}>
                          {getRolNombre(u.rol?.id)}
                        </span>

                        {confirmDelete === u.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => { handleEliminar(u.id); setConfirmDelete(null); }}
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
                            className="w-9 h-9 rounded-xl flex items-center justify-center border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)] hover:bg-[rgba(232,25,44,0.05)] transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsuariosView;