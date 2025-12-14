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
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            ¿Cómo deseas recibir tu pedido?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Podemos llevarlo hasta tu puerta o puedes recogerlo en una de nuestras sucursales.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {serviceTypes.map((service) => {
              const IconComponent = service.icon;
              const isSelected = serviceType === service.id;

              return (
                <button
                  key={service.id}
                  onClick={() => setServiceType(service.id as any)}
                  className={`group relative p-8 rounded-3xl text-left transition-all duration-300 ${isSelected
                    ? 'bg-gray-900 text-white shadow-xl scale-[1.02] ring-0'
                    : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-lg'
                    }`}
                >
                  {/* Icono */}
                  <div className={`mb-6 p-4 rounded-2xl w-fit transition-all duration-300 ${isSelected
                    ? 'bg-white/10 text-white'
                    : 'bg-gray-100 text-gray-900 group-hover:scale-110'
                    }`}>
                    <IconComponent className="w-8 h-8" />
                  </div>

                  {/* Título y Texto */}
                  <div className="space-y-2">
                    <h3 className={`text-xl font-bold tracking-tight ${isSelected ? 'text-white' : 'text-gray-900'
                      }`}>
                      {service.name}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                      {service.description}
                    </p>
                  </div>

                  {/* Check Indicator */}
                  <div className={`absolute top-6 right-6 transition-all duration-300 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}>
                    <div className="bg-white rounded-full p-1">
                      <MdCheckCircle className="w-6 h-6 text-black" />
                    </div>
                  </div>
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
