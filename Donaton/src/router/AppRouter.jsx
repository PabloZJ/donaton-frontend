import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'

import Navbar from '../components/navbar'
import Footer from '../components/footer'

import LoginView from '../modules/auth/view/LoginView'
import RegisterView from '../modules/auth/view/RegisterView'
import HomeView from '../modules/home/view/HomeView'

import DonacionesView from '../modules/donaciones/view/DonacionesView'
import CrearDonacionView from '../modules/donaciones/view/CrearDonacionView'

import NecesidadesView from '../modules/necesidades/view/NecesidadesView'
import ReportarNecesidadView from '../modules/necesidades/view/ReportarNecesidadView'

import InventarioView from '../modules/logistica/view/InventarioView'
import EnviosView from '../modules/logistica/view/EnviosView'
import AsignacionesView from '../modules/logistica/view/AsignacionesView'
import DonacionesOperadorView from '../modules/logistica/view/DonacionesOperadorView'

import DashboardView from '../modules/admin/view/DashboardView'
import UsuariosView from '../modules/admin/view/UsuariosView'

const AppRouter = () => {
  return (
    <BrowserRouter>

      <div className="min-h-screen flex flex-col bg-white">

        <Navbar />

        <main className="flex-1">
          <Routes>

            <Route path="/" element={<HomeView />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginView />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterView />
                </PublicRoute>
              }
            />

            <Route
              path="/donaciones"
              element={
                <ProtectedRoute roles={['donante', 'admin']}>
                  <DonacionesView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/donaciones/crear"
              element={
                <ProtectedRoute roles={['donante', 'admin']}>
                  <CrearDonacionView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/necesidades"
              element={
                <ProtectedRoute roles={['municipalidad', 'admin']}>
                  <NecesidadesView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/necesidades/reportar"
              element={
                <ProtectedRoute roles={['municipalidad', 'admin']}>
                  <ReportarNecesidadView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inventario"
              element={
                <ProtectedRoute roles={['operador', 'admin']}>
                  <InventarioView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/envios"
              element={
                <ProtectedRoute roles={['operador', 'admin']}>
                  <EnviosView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/asignaciones"
              element={
                <ProtectedRoute roles={['operador', 'admin']}>
                  <AsignacionesView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/donaciones-centro"
              element={
                <ProtectedRoute roles={['operador', 'admin']}>
                  <DonacionesOperadorView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['admin']}>
                  <DashboardView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usuarios"
              element={
                <ProtectedRoute roles={['admin']}>
                  <UsuariosView />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </main>

        <Footer />

      </div>

    </BrowserRouter>
  )
}

export default AppRouter