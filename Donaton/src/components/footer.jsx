import { Link } from 'react-router-dom'
import { Mail, Clock3, HeartHandshake } from 'lucide-react'
import logo from '../assets/logogod.png'

const COLORS = {
	primary: '#E8192C',
	dark: '#22181C',
	neutral: '#7C8483',
	accent: '#F4AC45',
}

const Footer = () => {
	return (
		<footer
			className="relative overflow-hidden"
			style={{
				backgroundColor: COLORS.dark,
			}}
		>
			<div
				className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl"
				style={{
					backgroundColor: 'rgba(232,25,44,0.06)',
				}}
			/>

			<div
				className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl"
				style={{
					backgroundColor: 'rgba(244,172,69,0.05)',
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 py-20">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

					<div>
						<div className="mb-6">
							<img
								src={logo}
								alt="Donaton"
								className="h-20 w-auto brightness-0 invert"
							/>
						</div>

						<p
							className="text-sm leading-relaxed max-w-sm"
							style={{ color: COLORS.neutral }}
						>
							Plataforma inteligente para coordinar ayuda humanitaria,
							donaciones y centros de acopio en situaciones de emergencia
							en todo Chile.
						</p>

						<div
							className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full text-sm font-medium"
							style={{
								backgroundColor: 'rgba(232,25,44,0.08)',
								color: '#ffffff',
								border: '1px solid rgba(232,25,44,0.15)',
							}}
						>
							<HeartHandshake size={16} />
							Ayudando comunidades
						</div>
					</div>

					<div>
						<h4 className="text-white font-bold uppercase tracking-[0.15em] text-sm mb-5">
							Navegación
						</h4>

						<ul className="space-y-4 text-sm">
							{[
								{ label: 'Inicio', path: '/' },
								{ label: 'Iniciar sesión', path: '/login' },
								{ label: 'Registrarse', path: '/register' },
							].map((item, i) => (
								<li key={i}>
									<Link
										to={item.path}
										className="
											transition-all duration-200
											hover:translate-x-1
											inline-block
										"
										style={{ color: COLORS.neutral }}
										onMouseEnter={(e) => {
											e.target.style.color = COLORS.accent
										}}
										onMouseLeave={(e) => {
											e.target.style.color = COLORS.neutral
										}}
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-white font-bold uppercase tracking-[0.15em] text-sm mb-5">
							Contacto
						</h4>

						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div
									className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
									style={{
										backgroundColor: 'rgba(232,25,44,0.08)',
										color: COLORS.primary,
									}}
								>
									<Mail size={16} />
								</div>

								<p
									className="text-sm"
									style={{ color: COLORS.neutral }}
								>
									contacto@donaton.cl
								</p>
							</div>

							<div className="flex items-center gap-3">
								<div
									className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
									style={{
										backgroundColor: 'rgba(244,172,69,0.08)',
										color: COLORS.accent,
									}}
								>
									<Clock3 size={16} />
								</div>

								<p
									className="text-sm"
									style={{ color: COLORS.neutral }}
								>
									Lun - Vie · 9:00 a 18:00
								</p>
							</div>
						</div>
					</div>

				</div>
			</div>

			<div
				className="relative py-6 text-center text-xs"
				style={{
					borderTop: '1px solid rgba(124,132,131,0.12)',
					color: COLORS.neutral,
					backgroundColor: 'rgba(255,255,255,0.01)',
				}}
			>
				© 2026{' '}
				<span className="text-white font-semibold">
					Donaton
				</span>
				{' '}— Todos los derechos reservados
			</div>
		</footer>
	)
}

export default Footer