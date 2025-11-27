import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/SupabaseAuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import CreateOrderPage from './pages/CreateOrderPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import TrackingPage from './pages/TrackingPage'
import NotificationsPage from './pages/NotificationsPage'
import TestOrderFlow from './components/TestOrderFlow'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import AguacentrosPage from './pages/AguacentrosPage'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.css'

gsap.registerPlugin(ScrollTrigger);

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente principal de la aplicación
const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/aguacentros" element={<AguacentrosPage />} />

        {/* Ruta de login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout>
                <OrdersPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateOrderPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <OrderDetailsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <Layout>
                <TrackingPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/test-orders"
          element={
            <ProtectedRoute>
              <Layout>
                <TestOrderFlow />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
};

// Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)