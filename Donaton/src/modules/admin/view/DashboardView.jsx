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
  <div
    className="
      rounded-[1.75rem]
      p-6
      bg-[rgba(255,255,255,0.82)]
      border border-[rgba(124,132,131,0.12)]
      shadow-[0_8px_32px_rgba(0,0,0,0.06)]
      backdrop-blur-[10px]
    "
  >
    <div className="flex items-start justify-between">

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-neutral)]">
          {title}
        </p>

        <h3 className="mt-3 text-4xl font-black text-[var(--color-dark)]">
          {value}
        </h3>
      </div>

      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>

    </div>
  </div>
)

const SectionTitle = ({ title }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-[var(--color-neutral)]">
      {title}
    </p>
  </div>
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
    <div className="min-h-screen px-4 py-12 bg-[linear-gradient(to_bottom_right,rgba(232,25,44,0.04),#FFFFFF)]">

      <div className="fixed top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-[rgba(232,25,44,0.06)]" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-[rgba(244,172,69,0.06)]" />

      <div className="max-w-6xl mx-auto relative flex flex-col gap-10">

        <div className="flex items-start justify-between gap-4">

          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-2 text-[var(--color-primary)]">
              Administración
            </p>

            <h1 className="text-4xl font-black text-[var(--color-dark)]">
              Dashboard General
            </h1>

            <p className="mt-2 text-sm text-[var(--color-neutral)]">
              Resumen global del estado operativo de Donaton.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(232,25,44,0.08)] text-[var(--color-primary)]">
            <LayoutDashboard size={24} />
          </div>

        </div>

        {error && (
          <div className="rounded-2xl px-4 py-3 text-sm font-medium bg-[rgba(232,25,44,0.08)] border border-[rgba(232,25,44,0.15)] text-[var(--color-primary)]">
            {error}
          </div>
        )}

        <div>

          <SectionTitle title="Resumen General" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <StatCard
              title="Donaciones"
              value={totalDonaciones}
              icon={HeartHandshake}
              color="bg-[rgba(59,130,246,0.10)] text-[#2563EB]"
            />

            <StatCard
              title="Necesidades"
              value={totalNecesidades}
              icon={ClipboardList}
              color="bg-[rgba(244,172,69,0.12)] text-[#B87A00]"
            />

            <StatCard
              title="Usuarios"
              value={totalUsuarios}
              icon={Users}
              color="bg-[rgba(168,85,247,0.10)] text-[#9333EA]"
            />

          </div>

        </div>

        <div>

          <SectionTitle title="Donaciones por Estado" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <StatCard
              title="Pendientes"
              value={donacionesPorEstado('pendiente')}
              icon={Clock3}
              color="bg-[rgba(244,172,69,0.12)] text-[#B87A00]"
            />

            <StatCard
              title="Agendadas"
              value={donacionesPorEstado('agendada')}
              icon={Package}
              color="bg-[rgba(59,130,246,0.10)] text-[#2563EB]"
            />

            <StatCard
              title="Recibidas"
              value={donacionesPorEstado('recibida')}
              icon={CheckCircle2}
              color="bg-[rgba(34,197,94,0.10)] text-[#16A34A]"
            />

            <StatCard
              title="Canceladas"
              value={donacionesPorEstado('cancelada')}
              icon={AlertTriangle}
              color="bg-[rgba(232,25,44,0.10)] text-[var(--color-primary)]"
            />

          </div>

        </div>

        <div>

          <SectionTitle title="Necesidades por Estado" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <StatCard
              title="Pendientes"
              value={necesidadesPorEstado('pendiente')}
              icon={Clock3}
              color="bg-[rgba(244,172,69,0.12)] text-[#B87A00]"
            />

            <StatCard
              title="Parcialmente cubiertas"
              value={necesidadesPorEstado('parcialmente cubierta')}
              icon={CircleDollarSign}
              color="bg-[rgba(59,130,246,0.10)] text-[#2563EB]"
            />

            <StatCard
              title="Cubiertas"
              value={necesidadesPorEstado('cubierta')}
              icon={CheckCircle2}
              color="bg-[rgba(34,197,94,0.10)] text-[#16A34A]"
            />

            <StatCard
              title="Canceladas"
              value={necesidadesPorEstado('cancelada')}
              icon={AlertTriangle}
              color="bg-[rgba(232,25,44,0.10)] text-[var(--color-primary)]"
            />

          </div>

        </div>

        <div>

          <SectionTitle title="Usuarios por Rol" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <StatCard
              title="Donantes"
              value={usuariosPorRol(1)}
              icon={HeartHandshake}
              color="bg-[rgba(34,197,94,0.10)] text-[#16A34A]"
            />

            <StatCard
              title="Municipalidades"
              value={usuariosPorRol(2)}
              icon={ClipboardList}
              color="bg-[rgba(59,130,246,0.10)] text-[#2563EB]"
            />

            <StatCard
              title="Operadores"
              value={usuariosPorRol(3)}
              icon={Warehouse}
              color="bg-[rgba(244,172,69,0.12)] text-[#B87A00]"
            />

            <StatCard
              title="Admins"
              value={usuariosPorRol(4)}
              icon={Shield}
              color="bg-[rgba(168,85,247,0.10)] text-[#9333EA]"
            />

          </div>

        </div>

        <div>

          <SectionTitle title="Inventario por Tipo de Recurso" />

          {inventarioPorTipo.length === 0 ? (
            <div className="rounded-[2rem] p-12 text-center bg-[rgba(255,255,255,0.82)] border border-[rgba(124,132,131,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">

              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-[rgba(124,132,131,0.08)]">
                <Warehouse size={36} className="text-[var(--color-neutral)]" />
              </div>

              <h3 className="text-xl font-black mb-2 text-[var(--color-dark)]">
                Sin stock registrado
              </h3>

              <p className="text-sm text-[var(--color-neutral)]">
                Aún no existen recursos almacenados en inventario.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {inventarioPorTipo.map(t => (
                <div
                  key={t.nombre}
                  className="
                    rounded-[1.5rem]
                    p-5
                    bg-[rgba(255,255,255,0.82)]
                    border border-[rgba(124,132,131,0.12)]
                    shadow-[0_4px_16px_rgba(0,0,0,0.05)]
                    backdrop-blur-[10px]
                  "
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-bold text-[var(--color-dark)]">
                        {t.nombre}
                      </p>

                      <p className="text-xs mt-1 text-[var(--color-neutral)]">
                        Recursos disponibles
                      </p>
                    </div>

                    <p className="text-3xl font-black text-[var(--color-primary)]">
                      {t.total}
                    </p>

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