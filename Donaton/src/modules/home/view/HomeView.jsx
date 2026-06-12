import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { getRolPath } from '../../../router/getRolPath'
import { HeartHandshake, PackageCheck, Building2, ArrowRight, Users, MapPinned, Boxes, ChevronDown } from 'lucide-react'
import fotodonacion from '../../../assets/fotodonacion.jpg' 

const COLORS = {
  primary: '#E8192C',
  dark: '#22181C',
  neutral: '#7C8483',
  accent: '#F4AC45',
}

const steps = [
  { icon: <HeartHandshake size={28} />, title: 'Dona', desc: 'Registra donaciones físicas u online y ayuda rápidamente a quienes más lo necesitan.' },
  { icon: <Building2 size={28} />, title: 'Acopiamos', desc: 'Los centros de acopio organizan y distribuyen recursos en tiempo real.' },
  { icon: <PackageCheck size={28} />, title: 'Ayudamos', desc: 'Las ayudas llegan a comunidades afectadas de manera eficiente y coordinada.' },
]

const stats = [
  { icon: <Users size={20} />, number: '+12K', label: 'Donaciones' },
  { icon: <MapPinned size={20} />, number: '18', label: 'Regiones' },
  { icon: <Boxes size={20} />, number: '45', label: 'Centros activos' },
]

const HomeView = () => {
  const { isAuthenticated, rol } = useAuth()

  return (
    <div className="bg-white overflow-hidden">

      <section className="relative h-screen min-h-[600px] flex flex-col justify-end">

        <img
          src={fotodonacion}
          alt="Ayuda humanitaria"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(22,10,12,0.95) 0%, rgba(22,10,12,0.55) 50%, rgba(22,10,12,0.15) 100%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 lg:pb-24 w-full">

          <div className="max-w-3xl">

            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.0] mb-6">
              Juntos podemos{' '}
              <span
                className="relative inline-block"
                style={{ color: COLORS.primary }}
              >
                cambiar realidades
              </span>
            </h1>

            <p className="text-lg text-white/70 max-w-xl leading-relaxed mb-10">
              Donaton conecta donantes, municipalidades y centros de acopio para coordinar ayuda frente a desastres en todo Chile.
            </p>

            {isAuthenticated ? (
              <Link
                to={getRolPath(rol)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:gap-4"
                style={{ backgroundColor: COLORS.primary, boxShadow: '0 0 40px rgba(232,25,44,0.4)' }}
              >
                Ir a mi panel <ArrowRight size={18} />
              </Link>
            ) : (
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:gap-4"
                  style={{ backgroundColor: COLORS.primary, boxShadow: '0 0 40px rgba(232,25,44,0.4)' }}
                >
                  Donar ahora <HeartHandshake size={18} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base text-white/90 transition-all hover:text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.07)' }}
                >
                  Iniciar sesión
                </Link>
              </div>
            )}

          </div>

          <div className="flex flex-wrap gap-8 mt-14 pt-10 border-t" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
            {stats.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(232,25,44,0.20)', color: '#ff6b7a' }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-none">{item.number}</p>
                  <p className="text-xs text-white/50 mt-0.5">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <ChevronDown size={24} />
        </div>

      </section>

      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end mb-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: COLORS.primary }}>
                Proceso
              </span>
              <h2 className="text-4xl lg:text-5xl font-black mt-3 leading-tight" style={{ color: COLORS.dark }}>
                Tu apoyo se transforma en ayuda real
              </h2>
            </div>
            <p className="text-lg leading-relaxed" style={{ color: COLORS.neutral }}>
              Coordinamos recursos, personas y centros de acopio para responder rápidamente ante emergencias y desastres en todo Chile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((item, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: i === 0 ? COLORS.primary : i === 1 ? COLORS.dark : '#F7F5F5' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: i === 2 ? 'rgba(232,25,44,0.08)' : 'rgba(255,255,255,0.12)',
                    color: i === 2 ? COLORS.primary : 'white',
                  }}
                >
                  {item.icon}
                </div>

                <div
                  className="text-5xl font-black mb-4 opacity-10 absolute top-6 right-8"
                  style={{ color: i === 2 ? COLORS.dark : 'white' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: i === 2 ? COLORS.dark : 'white' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: i === 2 ? COLORS.neutral : 'rgba(255,255,255,0.70)' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="px-6 pb-24">
        <div
          className="max-w-6xl mx-auto rounded-3xl p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{ backgroundColor: COLORS.dark }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: COLORS.primary }}>
              Donaton Chile
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">
              Tu ayuda puede llegar más lejos<br className="hidden lg:block" /> de lo que imaginas
            </h2>
          </div>

          {!isAuthenticated && (
            <div className="flex flex-wrap gap-4 flex-shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:gap-3"
                style={{ backgroundColor: COLORS.primary, boxShadow: '0 0 30px rgba(232,25,44,0.35)' }}
              >
                Comenzar ahora <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white/80 hover:text-white transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                Iniciar sesión
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <Link
              to={getRolPath(rol)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:gap-3"
              style={{ backgroundColor: COLORS.primary }}
            >
              Ir a mi panel <ArrowRight size={16} />
            </Link>
          )}

        </div>
      </section>

    </div>
  )
}

export default HomeView