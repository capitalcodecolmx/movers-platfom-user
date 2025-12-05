// =====================================================
// PÁGINA DE CREACIÓN DE ÓRDENES - 3 PASOS
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useOrders } from '../hooks/useOrders';
import { useOrderStore } from '../store/useOrderStore';

// Componentes de los pasos
import Step1PackageDetails from '../components/order/Step1PackageDetails';
import Step2ProductSelection from '../components/order/Step2ProductSelection';
import Step3DeliveryDetails from '../components/order/Step3SimpleRoute'; // Keeping the import name but logic inside will change
import Step4PaymentSummary from '../components/order/Step4Contacts';

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // const { createOrder } = useOrders(); // logic moved to Step 4 or handled here if preferred via store data
  const { resetOrder } = useOrderStore(); // We might want to reset order on mount or unmount

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset order on validation mismatch or fresh start? 
  // For now let's keep persistence but maybe add a clear button or clear on success.

  const steps = [
    {
      number: 1,
      title: 'Tipo de servicio',
      description: 'Entrega a domicilio o recolección',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      number: 2,
      title: 'Productos',
      description: 'Selecciona tus productos',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      number: 3,
      title: 'Ubicación',
      description: 'Dirección de entrega o recolección',
      icon: MapPin,
      color: 'bg-blue-500',
    },
    {
      number: 4,
      title: 'Pago',
      description: 'Confirmación y pago',
      icon: CreditCard,
      color: 'bg-blue-500',
    },
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // The submit logic will likely be triggered from Step 4 using store data
  // But we can keep a handler here if Step 4 passes data back up, 
  // however Step 4 should probably handle the submission using useOrders hook itself 
  // OR call a prop function that uses the store.
  // We'll pass a dummy handler or remove it if Step 4 handles it.
  // For consistency with existing code, let's keep the submit handler here but it pulls from store.

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PackageDetails
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2ProductSelection
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <Step3DeliveryDetails
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <Step4PaymentSummary
            onPrev={prevStep}
            // Logic for submission is now inside Step 4 or passed here
            onSuccess={() => {
              resetOrder();
              navigate('/orders');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hacer Nuevo Pedido</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Sigue los pasos para solicitar tu envío
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
              <p className="text-sm text-gray-500">Paso {currentStep} de 4</p>
              <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de pasos */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Vista móvil - Progreso compacto */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${currentStep >= step.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                      }`}
                  >
                    {step.number}
                  </div>
                  <span className="mt-1 text-[11px] font-medium text-gray-600">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 h-1 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Vista desktop - Iconos con texto */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex items-center space-x-3 ${currentStep >= step.number ? 'opacity-100' : 'opacity-50'
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step.number
                    ? step.color
                    : 'bg-gray-200'
                    } text-white`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {renderStep()}
      </div>

    </div>
  );
};

export default CreateOrderPage;
