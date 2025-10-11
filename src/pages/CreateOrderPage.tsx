// =====================================================
// PÁGINA DE CREACIÓN DE ÓRDENES - 3 PASOS
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Package, Truck, MapPin, Users } from 'lucide-react';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useOrders } from '../hooks/useOrders';

// Componentes de los pasos
import Step1PackageDetails from '../components/order/Step1PackageDetails';
import Step2VehicleSelection from '../components/order/Step2VehicleSelection';
import Step3SimpleRoute from '../components/order/Step3SimpleRoute';
import Step4Contacts from '../components/order/Step4Contacts';

interface OrderData {
  // Paso 1: Detalles del paquete
  packageType: string;
  packageDescription: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  packageValue: number;
  specialInstructions: string;
  insuranceRequired: boolean;
  fragile: boolean;
  urgent: boolean;

  // Paso 2: Vehículo seleccionado
  selectedVehicle: any;
  vehicleType: string;

  // Paso 3: Direcciones y mapa
  pickupAddress: any;
  deliveryAddress: any;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  distance: number;
  estimatedCost: number;
  route: any;
  
  // Paso 4: Contactos y prioridad
  senderInfo: any;
  recipientInfo: any;
  priority: string;
  priorityData: any;
}

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createOrder, isLoading: isCreatingOrder } = useOrders();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    packageType: '',
    packageDescription: '',
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    packageValue: 0,
    specialInstructions: '',
    insuranceRequired: false,
    fragile: false,
    urgent: false,
    selectedVehicle: null,
    vehicleType: '',
    pickupAddress: null,
    deliveryAddress: null,
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    distance: 0,
    estimatedCost: 0,
    route: null,
    senderInfo: null,
    recipientInfo: null,
    priority: '',
    priorityData: null,
  });

  const steps = [
    {
      number: 1,
      title: 'Tipo de Servicio',
      description: 'Elige tu tipo de servicio',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      number: 2,
      title: 'Tipo de Unidad',
      description: 'Selecciona la unidad adecuada',
      icon: Truck,
      color: 'bg-blue-500',
    },
    {
      number: 3,
      title: 'Origen y Destino',
      description: 'Especifica las direcciones',
      icon: MapPin,
      color: 'bg-blue-500',
    },
    {
      number: 4,
      title: 'Prioridad de Envío',
      description: 'Selecciona la prioridad',
      icon: Users,
      color: 'bg-blue-500',
    },
  ];

  const updateOrderData = (data: Partial<OrderData>) => {
    console.log('CreateOrderPage - Updating data:', data);
    setOrderData(prev => {
      const newData = { ...prev, ...data };
      console.log('CreateOrderPage - New orderData:', newData);
      return newData;
    });
  };

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

  const handleSubmit = async (step4Data?: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Si tenemos datos del Step4, combinarlos con orderData
      const finalOrderData = step4Data ? { ...orderData, ...step4Data } : orderData;
      
      console.log('Creando orden:', finalOrderData);
      console.log('Step4 data received:', step4Data);
      
      // Crear la orden en la base de datos
      const newOrder = await createOrder(finalOrderData);
      
      console.log('Orden creada exitosamente:', newOrder);
      
      // Mostrar mensaje de éxito y redirigir
      alert(`¡Orden creada exitosamente! Código de seguimiento: ${newOrder.tracking_code}`);
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Error al crear la orden: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PackageDetails
            data={orderData}
            onUpdate={updateOrderData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2VehicleSelection
            data={orderData}
            onUpdate={updateOrderData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <Step3SimpleRoute
            data={orderData}
            onUpdate={updateOrderData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <Step4Contacts
            data={orderData}
            onUpdate={updateOrderData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Crear Nueva Orden</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Sigue los pasos para solicitar tu envío
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
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
          {/* Vista móvil - Solo iconos */}
          <div className="flex items-center justify-between sm:hidden">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col items-center ${
                  currentStep >= step.number ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? step.color
                      : 'bg-gray-200'
                  } text-white`}
                >
                  <step.icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  {step.number}
                </span>
                {index < steps.length - 1 && (
                  <div className="absolute w-full h-0.5 bg-gray-200 top-4 left-1/2 transform translate-x-4" />
                )}
              </div>
            ))}
          </div>

          {/* Vista desktop - Iconos con texto */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex items-center space-x-3 ${
                  currentStep >= step.number ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
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
