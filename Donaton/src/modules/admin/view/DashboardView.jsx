import { useDashboardViewModel } from '../viewmodel/DashboardViewModel'
import LoadingSpinner from '../../../components/LoadingSpinner'

import {
  LayoutDashboard,
  HeartHandshake,
  ClipboardList,
  Users,
  Package,
  CircleDollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Shield,
  Warehouse,
} from 'lucide-react'

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="rounded-[1.75rem] p-5 sm:p-6 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-[10px]">
    <div className="flex items-start justify-between">
      <div className="min-w-0 pr-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-neutral)] leading-tight">
          {title}
        </p>
        <h3 className="mt-2 sm:mt-3 text-3xl sm:text-4xl font-black text-[var(--color-dark)]">
          {value}
        </h3>
      </div>
      <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} className="sm:hidden" />
        <Icon size={24} className="hidden sm:block" />
      </div>
    </div>
  </div>
)

const SectionTitle = ({ title }) => (
  <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-[var(--color-neutral)]">
    {title}
  </p>
)

const DashboardView = () => {
  const {
    loading,
    error,
    totalDonaciones,
    totalNecesidades,
    totalUsuarios,
    donacionesPorEstado,
    necesidadesPorEstado,
    inventarioPorTipo,
    usuariosPorRol,
  } = useDashboardViewModel()

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 sm:py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">

      <div className="fixed top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-6xl mx-auto relative flex flex-col gap-8 sm:gap-10">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">
              Administración
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--color-dark)]">
              Dashboard General
            </h1>
            <p className="mt-2 text-sm text-[var(--color-neutral)]">
              Resumen global del estado operativo de Donaton.
            </p>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)] shrink-0">
            <LayoutDashboard size={22} />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
            {error}
          </div>
        )}

        {/* Resumen General */}
        <div>
          <SectionTitle title="Resumen General" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <StatCard title="Donaciones" value={totalDonaciones} icon={HeartHandshake} color="bg-[rgba(59,130,246,0.10)] text-[#2563EB]" />
            <StatCard title="Necesidades" value={totalNecesidades} icon={ClipboardList} color="bg-[rgba(244,172,69,0.12)] text-[#B87A00]" />
            <StatCard title="Usuarios" value={totalUsuarios} icon={Users} color="bg-[rgba(168,85,247,0.10)] text-[#9333EA]" />
          </div>
        </div>

        {/* Donaciones por Estado */}
        <div>
          <SectionTitle title="Donaciones por Estado" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
            <StatCard title="Pendientes" value={donacionesPorEstado('pendiente')} icon={Clock3} color="bg-[rgba(244,172,69,0.12)] text-[#B87A00]" />
            <StatCard title="Agendadas" value={donacionesPorEstado('agendada')} icon={Package} color="bg-[rgba(59,130,246,0.10)] text-[#2563EB]" />
            <StatCard title="Recibidas" value={donacionesPorEstado('recibida')} icon={CheckCircle2} color="bg-[rgba(34,197,94,0.10)] text-[#16A34A]" />
            <StatCard title="Canceladas" value={donacionesPorEstado('cancelada')} icon={AlertTriangle} color="bg-[rgba(232,25,44,0.10)] text-[var(--color-primary)]" />
          </div>
        </div>

        {/* Necesidades por Estado */}
        <div>
          <SectionTitle title="Necesidades por Estado" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
            <StatCard title="Pendientes" value={necesidadesPorEstado('pendiente')} icon={Clock3} color="bg-[rgba(244,172,69,0.12)] text-[#B87A00]" />
            <StatCard title="Parcialmente cubiertas" value={necesidadesPorEstado('parcialmente cubierta')} icon={CircleDollarSign} color="bg-[rgba(59,130,246,0.10)] text-[#2563EB]" />
            <StatCard title="Cubiertas" value={necesidadesPorEstado('cubierta')} icon={CheckCircle2} color="bg-[rgba(34,197,94,0.10)] text-[#16A34A]" />
            <StatCard title="Canceladas" value={necesidadesPorEstado('cancelada')} icon={AlertTriangle} color="bg-[rgba(232,25,44,0.10)] text-[var(--color-primary)]" />
          </div>
        </div>

        {/* Usuarios por Rol */}
        <div>
          <SectionTitle title="Usuarios por Rol" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
            <StatCard title="Donantes" value={usuariosPorRol(1)} icon={HeartHandshake} color="bg-[rgba(34,197,94,0.10)] text-[#16A34A]" />
            <StatCard title="Municipalidades" value={usuariosPorRol(2)} icon={ClipboardList} color="bg-[rgba(59,130,246,0.10)] text-[#2563EB]" />
            <StatCard title="Operadores" value={usuariosPorRol(3)} icon={Warehouse} color="bg-[rgba(244,172,69,0.12)] text-[#B87A00]" />
            <StatCard title="Admins" value={usuariosPorRol(4)} icon={Shield} color="bg-[rgba(168,85,247,0.10)] text-[#9333EA]" />
          </div>
        </div>

        {/* Inventario */}
        <div>
          <SectionTitle title="Inventario por Tipo de Recurso" />
          {inventarioPorTipo.length === 0 ? (
            <div className="rounded-[2rem] p-10 sm:p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)]">
                <Warehouse size={28} className="sm:hidden text-[var(--color-neutral)]" />
                <Warehouse size={36} className="hidden sm:block text-[var(--color-neutral)]" />
              </div>
              <h3 className="text-lg sm:text-xl font-black mb-2 text-[var(--color-dark)]">Sin stock registrado</h3>
              <p className="text-sm text-[var(--color-neutral)]">Aún no existen recursos almacenados en inventario.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {inventarioPorTipo.map(t => (
                <div
                  key={t.nombre}
                  className="rounded-[1.5rem] p-4 sm:p-5 bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_4px_16px_rgba(0,0,0,0.05)] backdrop-blur-[10px]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[var(--color-dark)]">{t.nombre}</p>
                      <p className="text-xs mt-1 text-[var(--color-neutral)]">Recursos disponibles</p>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-[var(--color-primary)]">{t.total}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default DashboardView