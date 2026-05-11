// HomeView.jsx

import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { getRolPath } from '../../../router/getRolPath'

import {
  HeartHandshake,
  PackageCheck,
  Building2,
  ArrowRight,
  Users,
  MapPinned,
  Boxes
} from 'lucide-react'

const COLORS = {
  primary: '#E8192C',
  dark: '#22181C',
  neutral: '#7C8483',
  accent: '#F4AC45',
}

const steps = [
  {
    icon: <HeartHandshake size={30} />,
    title: 'Dona',
    desc: 'Registra donaciones físicas u online y ayuda rápidamente a quienes más lo necesitan.',
  },
  {
    icon: <Building2 size={30} />,
    title: 'Acopiamos',
    desc: 'Los centros de acopio organizan y distribuyen recursos en tiempo real.',
  },
  {
    icon: <PackageCheck size={30} />,
    title: 'Ayudamos',
    desc: 'Las ayudas llegan a comunidades afectadas de manera eficiente y coordinada.',
  },
]

const stats = [
  {
    icon: <Users size={22} />,
    number: '+12K',
    label: 'Donaciones',
  },
  {
    icon: <MapPinned size={22} />,
    number: '18',
    label: 'Regiones',
  },
  {
    icon: <Boxes size={22} />,
    number: '45',
    label: 'Centros activos',
  },
]

const HomeView = () => {
  const { isAuthenticated, rol } = useAuth()

  return (
    <div className="bg-white overflow-hidden">

      <section
        className="relative"
        style={{
          background:
            'linear-gradient(to bottom right, rgba(232,25,44,0.05), rgba(244,172,69,0.06), #FFFFFF)',
        }}
      >

        <div
          className="absolute top-[-120px] left-[-80px] w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(232,25,44,0.10)' }}
        />

        <div
          className="absolute bottom-[-120px] right-[-80px] w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(244,172,69,0.10)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{
                backgroundColor: 'rgba(232,25,44,0.08)',
                color: COLORS.primary,
              }}
            >
              <HeartHandshake size={16} />
              Tu ayuda puede salvar vidas
            </div>

            <h1
              className="text-5xl lg:text-7xl font-black leading-[1.05] mb-6"
              style={{ color: COLORS.dark }}
            >
              Juntos podemos{' '}
              <span style={{ color: COLORS.primary }}>
                cambiar realidades
              </span>
            </h1>

            <p
              className="text-lg leading-relaxed max-w-xl mb-10"
              style={{ color: COLORS.neutral }}
            >
              Donaton conecta donantes, municipalidades y centros de acopio
              para coordinar ayuda humanitaria de manera rápida y eficiente
              frente a desastres y emergencias en todo Chile.
            </p>

            {isAuthenticated ? (
              <Link
                to={getRolPath(rol)}
                className="
                  inline-flex items-center gap-2
                  px-8 py-4 rounded-2xl
                  text-white font-bold text-lg
                  transition-all duration-200
                  hover:-translate-y-1
                "
                style={{
                  backgroundColor: COLORS.primary,
                  boxShadow: '0 14px 30px rgba(232,25,44,0.25)',
                }}
              >
                Ir a mi panel
                <ArrowRight size={20} />
              </Link>
            ) : (
              <div className="flex flex-wrap gap-4">

                <Link
                  to="/register"
                  className="
                    inline-flex items-center gap-2
                    px-8 py-4 rounded-2xl
                    text-white font-bold text-lg
                    transition-all duration-200
                    hover:-translate-y-1
                  "
                  style={{
                    backgroundColor: COLORS.primary,
                    boxShadow: '0 14px 30px rgba(232,25,44,0.25)',
                  }}
                >
                  Donar ahora
                  <HeartHandshake size={20} />
                </Link>

                <Link
                  to="/login"
                  className="
                    inline-flex items-center gap-2
                    px-8 py-4 rounded-2xl
                    border
                    bg-white/80 backdrop-blur-sm
                    font-bold text-lg
                    transition-all duration-200
                    hover:bg-white
                    hover:-translate-y-1
                  "
                  style={{
                    borderColor: 'rgba(232,25,44,0.12)',
                    color: COLORS.primary,
                  }}
                >
                  Iniciar sesión
                </Link>

              </div>
            )}

            <div className="flex flex-wrap gap-8 mt-14">

              {stats.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4"
                >

                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(232,25,44,0.08)',
                      color: COLORS.primary,
                    }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p
                      className="text-2xl font-black"
                      style={{ color: COLORS.dark }}
                    >
                      {item.number}
                    </p>

                    <p
                      className="text-sm"
                      style={{ color: COLORS.neutral }}
                    >
                      {item.label}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>

          <div className="relative hidden lg:block">

            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop"
                alt="Ayuda humanitaria"
                className="w-full h-[650px] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            </div>

            <div
              className="
                absolute bottom-8 -left-10
                bg-white/90 backdrop-blur-md
                rounded-3xl
                p-5
                shadow-2xl
                border
              "
              style={{
                borderColor: 'rgba(255,255,255,0.4)',
              }}
            >

              <div className="flex items-center gap-4">

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <PackageCheck size={26} />
                </div>

                <div>

                  <p
                    className="font-bold"
                    style={{ color: COLORS.dark }}
                  >
                    Donaciones activas
                  </p>

                  <p
                    className="text-sm"
                    style={{ color: COLORS.neutral }}
                  >
                    Coordinadas en tiempo real
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      <section
        className="py-24 px-4"
        style={{
          backgroundColor: 'rgba(124,132,131,0.05)',
        }}
      >

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <span
              className="text-sm font-bold uppercase tracking-[0.2em]"
              style={{ color: COLORS.primary }}
            >
              ¿Cómo funciona?
            </span>

            <h2
              className="text-4xl lg:text-5xl font-black mt-4"
              style={{ color: COLORS.dark }}
            >
              Tu apoyo se transforma en ayuda real
            </h2>

            <p
              className="mt-4 max-w-2xl mx-auto leading-relaxed"
              style={{ color: COLORS.neutral }}
            >
              Coordinamos recursos, personas y centros de acopio para responder
              rápidamente ante emergencias y desastres.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {steps.map((item, i) => (
              <div
                key={i}
                className="
                  group
                  bg-white
                  p-8 rounded-3xl
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:shadow-2xl
                "
                style={{
                  border: '1px solid rgba(124,132,131,0.10)',
                }}
              >

                <div
                  className="
                    w-16 h-16 rounded-2xl
                    flex items-center justify-center
                    mb-6
                    transition-all duration-300
                  "
                  style={{
                    backgroundColor: 'rgba(232,25,44,0.08)',
                    color: COLORS.primary,
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: COLORS.dark }}
                >
                  {item.title}
                </h3>

                <p
                  className="leading-relaxed"
                  style={{ color: COLORS.neutral }}
                >
                  {item.desc}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      <section
        className="relative overflow-hidden py-24 px-4"
        style={{
          background:
            'linear-gradient(to bottom right, rgba(232,25,44,0.07), rgba(244,172,69,0.08))',
        }}
      >

        <div
          className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(232,25,44,0.08)' }}
        />

        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(244,172,69,0.08)' }}
        />

        <div className="relative max-w-4xl mx-auto text-center">

          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{
              backgroundColor: 'rgba(232,25,44,0.08)',
              color: COLORS.primary,
            }}
          >
            Donaton Chile
          </span>

          <h2
            className="text-4xl lg:text-5xl font-black leading-tight mb-6"
            style={{ color: COLORS.dark }}
          >
            Tu ayuda puede llegar más lejos de lo que imaginas
          </h2>

          <p
            className="text-lg leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: COLORS.neutral }}
          >
            Únete a una red solidaria preparada para actuar rápidamente
            frente a emergencias y desastres en todo Chile.
          </p>

          {!isAuthenticated && (
            <div className="flex flex-wrap justify-center gap-4">

              <Link
                to="/register"
                className="
                  inline-flex items-center gap-2
                  px-8 py-4 rounded-2xl
                  text-white font-bold text-lg
                  transition-all duration-200
                  hover:-translate-y-1
                "
                style={{
                  backgroundColor: COLORS.primary,
                  boxShadow: '0 14px 30px rgba(232,25,44,0.25)',
                }}
              >
                Comenzar ahora
              </Link>

              <Link
                to="/login"
                className="
                  inline-flex items-center gap-2
                  px-8 py-4 rounded-2xl
                  border
                  bg-white/70 backdrop-blur-sm
                  font-bold text-lg
                  transition-all duration-200
                  hover:bg-white
                  hover:-translate-y-1
                "
                style={{
                  borderColor: 'rgba(232,25,44,0.12)',
                  color: COLORS.primary,
                }}
              >
                Iniciar sesión
              </Link>

            </div>
          )}

        </div>
      </section>

    </div>
  )
}

export default HomeView