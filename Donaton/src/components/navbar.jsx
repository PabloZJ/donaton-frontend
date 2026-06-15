import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
LayoutDashboard, Package, Boxes, Truck, ClipboardList,
Users, HeartHandshake, LogOut, Building2, Menu, X,
} from 'lucide-react'
import logo from '../assets/logogod.png'

const COLORS = {
primary: '#E8192C',
primaryHover: '#C51525',
dark: '#22181C',
}

const Navbar = () => {
const { user, rol, logout, isAuthenticated } = useAuth()
const location = useLocation()
const [mobileOpen, setMobileOpen] = useState(false)

const isActive = (path) => location.pathname === path

const navLinkClass = (path) =>
	`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
	isActive(path) ? 'text-white shadow-md' : 'hover:bg-red-50'
	}`

const navLinkStyle = (path) => ({
	backgroundColor: isActive(path) ? COLORS.primary : 'transparent',
	color: isActive(path) ? '#FFFFFF' : COLORS.dark,
})

// Links según rol
const roleLinks = () => {
	if (rol === 'donante') return [
	{ to: '/donaciones', icon: Package, label: 'Mis donaciones' },
	{ to: '/donaciones/crear', icon: HeartHandshake, label: 'Donar ahora' },
	]
	if (rol === 'municipalidad') return [
	{ to: '/necesidades', icon: Building2, label: 'Necesidades' },
	]
	if (rol === 'operador') return [
	{ to: '/inventario', icon: Boxes, label: 'Inventario' },
	{ to: '/donaciones-centro', icon: Package, label: 'Donaciones' },
	{ to: '/envios', icon: Truck, label: 'Envíos' },
	{ to: '/asignaciones', icon: ClipboardList, label: 'Asignaciones' },
	]
	if (rol === 'admin') return [
	{ to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
	{ to: '/usuarios', icon: Users, label: 'Usuarios' },
	]
	return []
}

const allLinks = [{ to: '/', icon: HeartHandshake, label: 'Inicio' }, ...roleLinks()]

return (
	<nav
	className="sticky top-0 z-50 backdrop-blur-xl border-b"
	style={{ backgroundColor: 'rgba(255,255,255,0.88)', borderColor: 'rgba(124,132,131,0.12)' }}
	>
	<div className="max-w-7xl mx-auto px-4 lg:px-8">
		<div className="h-16 sm:h-20 flex items-center">

		{/* Logo */}
		<Link
			to="/"
			className="flex items-center shrink-0 mr-6 lg:mr-10 transition-transform duration-200 hover:scale-[1.02]"
		>
			<img src={logo} alt="Donaton" style={{ height: '102px' }} className="w-auto" />
		</Link>

		{/* Nav desktop */}
		<ul className="hidden lg:flex items-center gap-2 flex-1 justify-center px-6">
			{allLinks.map(({ to, icon: Icon, label }) => (
			<li key={to}>
				<Link to={to} className={navLinkClass(to)} style={navLinkStyle(to)}>
				<Icon size={17} />
				{label}
				</Link>
			</li>
			))}
		</ul>

		{/* Acciones desktop */}
		<div className="hidden lg:flex items-center gap-3 shrink-0">
			{isAuthenticated ? (
			<>
				<div
				className="flex items-center gap-3 px-4 py-2 rounded-2xl"
				style={{ backgroundColor: 'rgba(255,255,255,0.65)' }}
				>
				<div
					className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
					style={{ backgroundColor: COLORS.primary }}
				>
					{user?.email?.charAt(0).toUpperCase()}
				</div>
				<div className="leading-tight">
					<p className="text-sm font-semibold max-w-[180px] truncate" style={{ color: COLORS.dark }}>
					{user?.email}
					</p>
					<p className="text-xs uppercase tracking-wider font-bold" style={{ color: COLORS.primary }}>
					{rol}
					</p>
				</div>
				</div>

				<button
				onClick={logout}
				className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
				style={{ backgroundColor: COLORS.primary }}
				onMouseOver={(e) => (e.currentTarget.style.backgroundColor = COLORS.primaryHover)}
				onMouseOut={(e) => (e.currentTarget.style.backgroundColor = COLORS.primary)}
				>
				<LogOut size={16} />
				Salir
				</button>
			</>
			) : (
			<>
				<Link
				to="/login"
				className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:bg-red-50"
				style={{ borderColor: 'rgba(232,25,44,0.15)', color: COLORS.primary }}
				>
				Iniciar sesión
				</Link>
				<Link
				to="/register"
				className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
				style={{ backgroundColor: COLORS.primary, boxShadow: '0 10px 25px rgba(232,25,44,0.20)' }}
				>
				Registrarse
				</Link>
			</>
			)}
		</div>

		{/* Botón hamburger (móvil/tablet) */}
		<div className="flex lg:hidden items-center gap-2 ml-auto">
			{isAuthenticated && (
			<div
				className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
				style={{ backgroundColor: COLORS.primary }}
			>
				{user?.email?.charAt(0).toUpperCase()}
			</div>
			)}
			<button
			onClick={() => setMobileOpen(!mobileOpen)}
			className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-red-50"
			style={{ color: COLORS.dark }}
			aria-label="Menú"
			>
			{mobileOpen ? <X size={22} /> : <Menu size={22} />}
			</button>
		</div>

		</div>
	</div>

	{/* Menú móvil desplegable */}
	{mobileOpen && (
		<div
		className="lg:hidden border-t px-4 pt-3 pb-5 flex flex-col gap-1"
		style={{ backgroundColor: 'rgba(255,255,255,0.97)', borderColor: 'rgba(124,132,131,0.12)' }}
		>
		{/* Links de navegación */}
		{allLinks.map(({ to, icon: Icon, label }) => (
			<Link
			key={to}
			to={to}
			onClick={() => setMobileOpen(false)}
			className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
			style={{
				backgroundColor: isActive(to) ? COLORS.primary : 'transparent',
				color: isActive(to) ? '#fff' : COLORS.dark,
			}}
			>
			<Icon size={17} />
			{label}
			</Link>
		))}

		{/* Separador */}
		<div className="my-2 border-t" style={{ borderColor: 'rgba(124,132,131,0.12)' }} />

		{isAuthenticated ? (
			<>
			{/* Info usuario */}
				<p className="text-sm font-semibold truncate" style={{ color: COLORS.dark }}>{user?.email}</p>
				<p className="text-xs uppercase tracking-wider font-bold mt-0.5" style={{ color: COLORS.primary }}>{rol}</p>
			<button
				onClick={() => { logout(); setMobileOpen(false) }}
				className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all mt-1"
				style={{ backgroundColor: COLORS.primary }}
			>
				<LogOut size={17} />
				Cerrar sesión
			</button>
			</>
		) : (
			<>
			<Link
				to="/login"
				onClick={() => setMobileOpen(false)}
				className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold border transition-all"
				style={{ borderColor: 'rgba(232,25,44,0.15)', color: COLORS.primary }}
			>
				Iniciar sesión
			</Link>
			<Link
				to="/register"
				onClick={() => setMobileOpen(false)}
				className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white mt-1 transition-all"
				style={{ backgroundColor: COLORS.primary }}
			>
				Registrarse
			</Link>
			</>
		)}
		</div>
	)}
	</nav>
)
}

export default Navbar