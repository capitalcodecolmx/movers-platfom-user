// =====================================================
// PÁGINA DE LOGIN - ESTILO APPLE (MODULAR)
// =====================================================

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ZodError } from 'zod';
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { COMPANY_INFO } from '../../data/mockData';
import BrandHeader from './components/BrandHeader';
import StatusBanner from './components/StatusBanner';
import FormField from './components/FormField';
import { loginSchema, signUpSchema, type FormErrors } from './validations';

const LoginPage: React.FC = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { signIn, signUp, isLoading, error, clearError } = useAuth();

  const currentSchema = useMemo(() => (isSignUp ? signUpSchema : loginSchema), [isSignUp]);

  const handleChange = (field: keyof typeof formState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();
    setSuccessMessage(null);

    try {
      currentSchema.parse(formState);
      if (isSignUp) {
        await signUp(formState.email, formState.password, formState.fullName, formState.phone);
        setSuccessMessage('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
      } else {
        await signIn(formState.email, formState.password);
      }
      setFormErrors({});
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        const fieldErrors = validationError.flatten()
          .fieldErrors as Partial<Record<keyof FormErrors, string[]>>;
        const nextErrors: FormErrors = {};

        (Object.keys(fieldErrors) as (keyof FormErrors)[]).forEach((key) => {
          const errors = fieldErrors[key];
          if (errors?.length) {
            nextErrors[key] = errors[0];
          }
        });
        setFormErrors(nextErrors);
        return;
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        background: 'linear-gradient(135deg, #00AEEF 0%, #0055A4 100%)',
      }}
    >
      {/* Overlay oscuro con branding */}
      <div className="absolute inset-0 bg-black bg-opacity-50">
        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <img
            src={COMPANY_INFO.logo}
            alt=""
            className="w-[120%] max-w-none opacity-[0.05] transform -rotate-12 scale-150"
          />
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="flex justify-center">
          <BrandHeader
            logo={COMPANY_INFO.logo}
            brandName={COMPANY_INFO.name}
            tagline="Portal de Clientes"
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
            <p className="text-gray-600">
              {isSignUp
                ? 'Regístrate como cliente para comenzar a enviar paquetes'
                : 'Accede a tu cuenta para gestionar tus envíos'}
            </p>
          </div>

          {error && <StatusBanner tone="error" message={error} />}
          {successMessage && !error && <StatusBanner tone="success" message={successMessage} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <FormField
                label="Nombre completo"
                type="text"
                value={formState.fullName}
                onChange={handleChange('fullName')}
                placeholder="Tu nombre completo"
                error={formErrors.fullName}
              />
            )}

            <FormField
              label="Correo electrónico"
              type="email"
              value={formState.email}
              onChange={handleChange('email')}
              placeholder="tu@email.com"
              icon={Mail}
              error={formErrors.email}
            />

            {isSignUp && (
              <FormField
                label="Teléfono (opcional)"
                type="tel"
                value={formState.phone}
                onChange={handleChange('phone')}
                placeholder="+52 55 1234 5678"
                error={formErrors.phone}
              />
            )}

            <FormField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={formState.password}
              onChange={handleChange('password')}
              placeholder="Tu contraseña"
              icon={Lock}
              error={formErrors.password}
              trailingContent={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            {!isSignUp && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp((prev) => !prev);
                  clearError();
                  setFormErrors({});
                  setSuccessMessage(null);
                }}
                className="ml-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {isSignUp ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-white/60">
          <p>
            © {new Date().getFullYear()} {COMPANY_INFO.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
