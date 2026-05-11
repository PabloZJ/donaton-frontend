import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {LayoutDashboard, Package, Boxes, Truck, ClipboardList, Users, HeartHandshake, LogOut, Building2,} from 'lucide-react'
import logo from '../assets/logogod.png'

const COLORS = {
	primary: '#E8192C',
	primaryHover: '#C51525',
	dark: '#22181C',
}

const Navbar = () => {
	const { user, rol, logout, isAuthenticated } = useAuth()
	const location = useLocation()

	const navLinkClass = (path) => `
		flex items-center gap-2
		px-4 py-2 rounded-xl
		text-sm font-semibold
		transition-all duration-200
		${
			location.pathname === path
				? 'text-white shadow-md'
				: 'hover:bg-red-50'
		}
	`

	const navLinkStyle = (path) => ({
		backgroundColor:
			location.pathname === path
				? COLORS.primary
				: 'transparent',

		color:
			location.pathname === path
				? '#FFFFFF'
				: COLORS.dark,
	})

	return (
		<nav
			className="sticky top-0 z-50 backdrop-blur-xl border-b"
			style={{
				backgroundColor: 'rgba(255,255,255,0.88)',
				borderColor: 'rgba(124,132,131,0.12)',
			}}
		>
			<div className="max-w-7xl mx-auto px-4 lg:px-8">

				<div className="h-20 flex items-center">

					<Link
						to="/"
						className="
							flex items-center
							shrink-0
							mr-10
							transition-transform duration-200
							hover:scale-[1.02]
						"
					>
						<img
							src={logo}
							alt="Donaton"
							className="h-30 w-auto"
						/>
					</Link>

					<ul className="hidden lg:flex items-center gap-2 flex-1 justify-center px-10">

						<li>
							<Link
								to="/"
								className={navLinkClass('/')}
								style={navLinkStyle('/')}
							>
								<HeartHandshake size={17} />
								Inicio
							</Link>
						</li>

						{rol === 'donante' && (
							<>
								<li>
									<Link
										to="/donaciones"
										className={navLinkClass('/donaciones')}
										style={navLinkStyle('/donaciones')}
									>
										<Package size={17} />
										Mis donaciones
									</Link>
								</li>

								<li>
									<Link
										to="/donaciones/crear"
										className={navLinkClass('/donaciones/crear')}
										style={navLinkStyle('/donaciones/crear')}
									>
										<HeartHandshake size={17} />
										Donar ahora
									</Link>
								</li>
							</>
						)}

						{rol === 'municipalidad' && (
							<li>
								<Link
									to="/necesidades"
									className={navLinkClass('/necesidades')}
									style={navLinkStyle('/necesidades')}
								>
									<Building2 size={17} />
									Necesidades
								</Link>
							</li>
						)}

						{rol === 'operador' && (
							<>
								<li>
									<Link
										to="/inventario"
										className={navLinkClass('/inventario')}
										style={navLinkStyle('/inventario')}
									>
										<Boxes size={17} />
										Inventario
									</Link>
								</li>

								<li>
									<Link
										to="/donaciones-centro"
										className={navLinkClass('/donaciones-centro')}
										style={navLinkStyle('/donaciones-centro')}
									>
										<Package size={17} />
										Donaciones
									</Link>
								</li>

								<li>
									<Link
										to="/envios"
										className={navLinkClass('/envios')}
										style={navLinkStyle('/envios')}
									>
										<Truck size={17} />
										Envíos
									</Link>
								</li>

								<li>
									<Link
										to="/asignaciones"
										className={navLinkClass('/asignaciones')}
										style={navLinkStyle('/asignaciones')}
									>
										<ClipboardList size={17} />
										Asignaciones
									</Link>
								</li>
							</>
						)}

						{rol === 'admin' && (
							<>
								<li>
									<Link
										to="/dashboard"
										className={navLinkClass('/dashboard')}
										style={navLinkStyle('/dashboard')}
									>
										<LayoutDashboard size={17} />
										Dashboard
									</Link>
								</li>

								<li>
									<Link
										to="/usuarios"
										className={navLinkClass('/usuarios')}
										style={navLinkStyle('/usuarios')}
									>
										<Users size={17} />
										Usuarios
									</Link>
								</li>
							</>
						)}

					</ul>

					<div className="flex items-center gap-3 shrink-0">

						{isAuthenticated ? (
							<>
								<div
									className="
										hidden md:flex
										items-center gap-3
										px-4 py-2 rounded-2xl
									"
									style={{
										backgroundColor: 'rgba(255,255,255,0.65)',
									}}
								>

									<div
										className="
											w-10 h-10 rounded-xl
											flex items-center justify-center
											text-white font-bold text-sm
										"
										style={{
											backgroundColor: COLORS.primary,
										}}
									>
										{user?.email?.charAt(0).toUpperCase()}
									</div>

									<div className="leading-tight">
										<p
											className="text-sm font-semibold max-w-[180px] truncate"
											style={{ color: COLORS.dark }}
										>
											{user?.email}
										</p>

										<p
											className="text-xs uppercase tracking-wider font-bold"
											style={{ color: COLORS.primary }}
										>
											{rol}
										</p>
									</div>

								</div>

								<button
									onClick={logout}
									className="
										flex items-center gap-2
										px-4 py-2 rounded-xl
										text-sm font-semibold text-white
										transition-all duration-200
										hover:scale-[1.02]
									"
									style={{
										backgroundColor: COLORS.primary,
									}}
									onMouseOver={(e) =>
										(e.currentTarget.style.backgroundColor =
											COLORS.primaryHover)
									}
									onMouseOut={(e) =>
										(e.currentTarget.style.backgroundColor =
											COLORS.primary)
									}
								>
									<LogOut size={16} />
									Salir
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="
										px-5 py-2.5 rounded-xl
										text-sm font-semibold
										border
										transition-all duration-200
										hover:bg-red-50
									"
									style={{
										borderColor: 'rgba(232,25,44,0.15)',
										color: COLORS.primary,
									}}
								>
									Iniciar sesión
								</Link>

								<Link
									to="/register"
									className="
										px-5 py-2.5 rounded-xl
										text-sm font-semibold text-white
										shadow-lg
										transition-all duration-200
										hover:scale-[1.02]
									"
									style={{
										backgroundColor: COLORS.primary,
										boxShadow:
											'0 10px 25px rgba(232,25,44,0.20)',
									}}
								>
									Registrarse
								</Link>
							</>
						)}

					</div>

				</div>

			</div>
		</nav>
	)
}

export default Navbar