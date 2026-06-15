import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { getRolPath } from '../../../router/getRolPath'
import { HeartHandshake, ArrowRight, ChevronDown } from 'lucide-react'
import fotodonacion from '../../../assets/fotodonacion.jpg'

const COLORS = {
  primary: '#E8192C',
  dark: '#22181C',
  neutral: '#7C8483',
  accent: '#F4AC45',
}

// Copy reescrito para sonar humano
const steps = [
  {
    tag: 'Tú',
    title: 'Registras lo que puedes dar',
    desc: 'Agua, ropa, alimentos, medicamentos. Lo que sea. Nosotros nos encargamos de que llegue a donde más falta hace.',
  },
  {
    tag: 'Nosotros',
    title: 'Lo organizamos en tu nombre',
    desc: 'Cada centro de acopio sabe exactamente qué tiene, qué necesita y cuándo enviar. Sin llamadas, sin confusión.',
  },
  {
    tag: 'La comunidad',
    title: 'Recibe ayuda cuando la necesita',
    desc: 'Las municipalidades reportan necesidades reales. Tu donación va directo ahí, no a una bodega olvidada.',
  },
]

const HomeView = () => {
  const { isAuthenticated, rol } = useAuth()

  return (
    <div className="bg-white overflow-hidden">

      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-end">
        <img
          src={fotodonacion}
          alt="Ayuda humanitaria"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(22,10,12,0.95) 0%, rgba(22,10,12,0.55) 50%, rgba(22,10,12,0.15) 100%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20 lg:pb-24 w-full">
          <div className="max-w-3xl">

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] mb-4 sm:mb-6">
              Cuando Chile necesita ayuda,{' '}
              <span style={{ color: COLORS.primary }}>tú puedes estar ahí.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/70 max-w-xl leading-relaxed mb-8 sm:mb-10">
              Donaton conecta a quienes quieren ayudar con quienes más lo necesitan — sin intermediarios confusos, sin trámites largos.
            </p>

            {isAuthenticated ? (
              <Link
                to={getRolPath(rol)}
                className="inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-base transition-all hover:gap-4"
                style={{ backgroundColor: COLORS.primary, boxShadow: '0 0 40px rgba(232,25,44,0.4)' }}
              >
                Ir a mi panel <ArrowRight size={18} />
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-base transition-all hover:gap-4"
                  style={{ backgroundColor: COLORS.primary, boxShadow: '0 0 40px rgba(232,25,44,0.4)' }}
                >
                  Quiero donar <HeartHandshake size={18} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base text-white/90 transition-all hover:text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.07)' }}
                >
                  Ya tengo cuenta
                </Link>
              </div>
            )}

            {/* Stats — texto plano, sin iconos en cajitas */}
            <div
              className="flex flex-wrap gap-6 sm:gap-10 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.10)' }}
            >
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white leading-none">+12.000</p>
                <p className="text-xs text-white/50 mt-1">donaciones coordinadas</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white leading-none">18</p>
                <p className="text-xs text-white/50 mt-1">regiones del país</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white leading-none">45</p>
                <p className="text-xs text-white/50 mt-1">centros de acopio activos</p>
              </div>
            </div>

          </div>
        </div>

        <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <ChevronDown size={22} />
        </div>
      </section>

      {/* CÓMO FUNCIONA — layout editorial, sin 01/02/03 decorativos */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-14 sm:mb-20">
            <span className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: COLORS.primary }}>
              Cómo funciona
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-3 leading-tight max-w-xl" style={{ color: COLORS.dark }}>
              Donar no debería ser complicado.
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed max-w-lg" style={{ color: COLORS.neutral }}>
              Tres actores, un mismo objetivo: que la ayuda llegue a tiempo y al lugar correcto.
            </p>
          </div>

          {/* Lista de pasos — horizontal en desktop, vertical en móvil */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: 'rgba(124,132,131,0.15)' }}>
            {steps.map((item, i) => (
              <div
                key={i}
                className="py-8 sm:py-0 sm:px-8 first:sm:pl-0 last:sm:pr-0"
                style={{ borderColor: 'rgba(124,132,131,0.15)' }}
              >
                <span
                  className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: i === 0 ? 'rgba(232,25,44,0.08)' : i === 1 ? 'rgba(244,172,69,0.10)' : 'rgba(34,197,94,0.08)', color: i === 0 ? COLORS.primary : i === 1 ? '#B87A00' : '#16A34A' }}
                >
                  {item.tag}
                </span>
                <h3 className="text-lg sm:text-xl font-black mt-2 mb-3 leading-snug" style={{ color: COLORS.dark }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.neutral }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA FINAL — simple, sin repetir el pitch */}
      <section className="px-4 sm:px-6 pb-20 sm:pb-24">
        <div
          className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl px-8 sm:px-14 py-12 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8"
          style={{ backgroundColor: COLORS.dark }}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              ¿Listo para ayudar?
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Toma menos de dos minutos registrarte.
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:gap-3"
                style={{ backgroundColor: COLORS.primary, boxShadow: '0 0 30px rgba(232,25,44,0.35)' }}
              >
                Crear cuenta <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-sm text-white/70 hover:text-white transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Iniciar sesión
              </Link>
            </div>
          ) : (
            <Link
              to={getRolPath(rol)}
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:gap-3 shrink-0"
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