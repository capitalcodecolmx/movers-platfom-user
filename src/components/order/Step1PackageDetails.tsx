// =====================================================
// PASO 1: ELIGE TU TIPO DE SERVICIO
// =====================================================

import React, { useState } from 'react';
import { MdCheckCircle, MdLocalShipping, MdLocationCity } from 'react-icons/md';
import { useOrderStore } from '../../store/useOrderStore'; // Import Store

interface Step1PackageDetailsProps {
  onNext: () => void;
}

const Step1PackageDetails: React.FC<Step1PackageDetailsProps> = ({
  onNext,
}) => {
  const { serviceType, setServiceType } = useOrderStore(); // Use Store

  const [serviceTypes] = useState([
    {
      id: 'delivery',
      name: 'Pedido a Domicilio',
      icon: MdLocalShipping,
      description: 'Recibimos tu pedido y lo llevamos hasta la puerta de tu casa.',
      example: 'Ideal para hogares y oficinas.'
    },
    {
      id: 'pickup',
      name: 'Recoge Agua Centro',
      icon: MdLocationCity,
      description: 'Realiza tu pedido y pasa a recogerlo en nuestro centro de distribución.',
      example: 'Ahorra tiempo y asegura tu pedido.'
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!serviceType) {
      newErrors.serviceType = 'Selecciona un tipo de servicio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const selectedServiceType = serviceTypes.find(type => type.id === serviceType);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
            1. Elige tu tipo de servicio
          </h2>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            Selecciona el tipo de servicio que mejor se adapte a tus necesidades de envío
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Tipos de servicio - Estilo Apple con React Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {serviceTypes.map((service) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => setServiceType(service.id as any)}
                  className={`relative p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl transition-all duration-300 text-left group border-2 ${serviceType === service.id
                    ? 'bg-gray-800 border-gray-800 shadow-lg scale-105'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  {/* Icono con gradiente */}
                  <div className={`mb-3 sm:mb-4 lg:mb-6 transition-all duration-300 ${serviceType === service.id
                    ? 'text-white'
                    : `text-gray-600 group-hover:scale-110`
                    }`}>
                    <IconComponent className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
                  </div>

                  {/* Título */}
                  <h3 className={`font-semibold text-base sm:text-lg mb-2 sm:mb-3 transition-colors duration-300 ${serviceType === service.id ? 'text-white' : 'text-gray-900'
                    }`}>
                    {service.name}
                  </h3>

                  {/* Descripción */}
                  <p className={`text-xs sm:text-sm mb-2 sm:mb-4 leading-relaxed transition-colors duration-300 ${serviceType === service.id ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {service.description}
                  </p>

                  {/* Ejemplo */}
                  <p className={`text-xs italic transition-colors duration-300 ${serviceType === service.id ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    {service.example}
                  </p>

                  {/* Indicador de selección */}
                  {serviceType === service.id && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <MdCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800" />
                    </div>
                  )}

                </button>
              );
            })}
          </div>

          {/* Error message */}
          {errors.serviceType && (
            <div className="text-center">
              <p className="text-red-500 text-sm">{errors.serviceType}</p>
            </div>
          )}

          {/* Resumen del servicio seleccionado */}
          {selectedServiceType && (
            <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base">Servicio seleccionado</h3>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                  <selectedServiceType.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-900 text-sm sm:text-base">{selectedServiceType.name}</p>
                  <p className="text-blue-700 text-xs sm:text-sm mt-1">{selectedServiceType.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón siguiente - Estilo Apple */}
        <div className="mt-6 sm:mt-8 flex justify-end">
          <button
            onClick={handleNext}
            className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm w-full sm:w-auto"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1PackageDetails;
