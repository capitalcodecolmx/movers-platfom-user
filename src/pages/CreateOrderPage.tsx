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
      {/* Minimal Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Nueva Orden</h1>
                <p className="text-xs text-gray-500">Paso {currentStep} de {steps.length}</p>
              </div>
            </div>

            {/* Desktop Stepper - Minimal */}
            <div className="hidden md:flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${currentStep === step.number
                    ? 'bg-gray-900 text-white shadow-sm'
                    : currentStep > step.number
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-400'
                    }`}>
                    {currentStep > step.number ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border ${currentStep === step.number ? 'border-transparent bg-white/20' : 'border-gray-200'
                        }`}>
                        {step.number}
                      </span>
                    )}
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-[1px] ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-100'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="md:hidden absolute bottom-0 left-0 w-full h-[2px] bg-gray-100">
            <div
              className="h-full bg-gray-900 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep) / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {renderStep()}
      </div>

    </div>
  );
};

export default CreateOrderPage;
