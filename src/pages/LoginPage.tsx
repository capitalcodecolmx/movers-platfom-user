// =====================================================
// PÁGINA DE LOGIN - ESTILO APPLE
// =====================================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const { signIn, signUp, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isSignUp) {
        await signUp(email, password, fullName, phone);
        // No redirigir automáticamente, mostrar mensaje de confirmación
        // El usuario debe confirmar su email primero
      } else {
        await signIn(email, password);
        // Después del login exitoso, redirigir al dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      // El error se maneja en el store
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        background: 'linear-gradient(135deg, #00AEEF 0%, #0055A4 100%)',
      }}
    >
      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/src/assets/images/branding/logo.png"
            alt="Agua Purificada Blanquita"
            className="h-16 mx-auto mb-4 brightness-0 invert"
          />
          <p className="text-cyan-100 font-medium">Portal de Clientes</p>
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mt-4 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Volver al inicio
          </Link>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
            <p className="text-gray-600">
              {isSignUp
                ? 'Regístrate para comenzar a enviar paquetes'
                : 'Accede a tu cuenta para gestionar tus envíos'
              }
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {isSignUp && !error && !isLoading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-600 text-sm">
                ¡Registro exitoso! Revisa tu email para confirmar tu cuenta.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="+52 55 1234 5678"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  clearError();
                }}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {isSignUp ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Muvers Platform. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


