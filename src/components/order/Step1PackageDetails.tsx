// =====================================================
// PASO 1: ELIGE TU TIPO DE SERVICIO
// =====================================================

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Check
} from 'lucide-react';
import { 
  MdCheckCircle,
  MdLocalShipping,
  MdInventory,
  MdLocationCity
} from 'react-icons/md';

interface Step1PackageDetailsProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const Step1PackageDetails: React.FC<Step1PackageDetailsProps> = ({
  data,
  onUpdate,
  onNext,
}) => {
  const [serviceTypes] = useState([
    {
      id: 'ftl',
      name: 'Carga Completa (FTL)',
      icon: MdLocalShipping,
      description: 'Ideal para envíos que llenan una unidad completa (camión o camioneta).',
      example: 'Ejemplo: distribución de productos por pallets o grandes volúmenes.'
    },
    {
      id: 'ltl',
      name: 'Carga Parcial (LTL)',
      icon: MdInventory,
      description: 'Perfecto para envíos menores a una unidad completa (menos de 12 pallets o cajas sueltas).',
      example: 'Ejemplo: pedidos fraccionados o entregas a varios puntos.'
    },
    {
      id: 'last-mile',
      name: 'Última Milla / Entregas Urbanas',
      icon: MdLocationCity,
      description: 'Ideal para e-commerce, restaurantes, farmacias o tiendas de conveniencia.',
      example: 'Servicio con motocicleta, small van o unidad ligera.'
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!data.serviceType) {
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

  const selectedServiceType = serviceTypes.find(type => type.id === data.serviceType);

  const handleServiceSelect = (serviceId: string) => {
    onUpdate({ serviceType: serviceId });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            1. Elige tu tipo de servicio
          </h2>
          <p className="text-gray-500 text-lg">
            Selecciona el tipo de servicio que mejor se adapte a tus necesidades de envío
          </p>
        </div>

        <div className="space-y-8">
          {/* Tipos de servicio - Estilo Apple con React Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceTypes.map((service) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`relative p-8 rounded-2xl transition-all duration-300 text-left group border-2 ${
                    data.serviceType === service.id
                      ? 'bg-gray-800 border-gray-800 shadow-lg scale-105'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Icono con gradiente */}
                  <div className={`mb-6 transition-all duration-300 ${
                    data.serviceType === service.id 
                      ? 'text-white' 
                      : `text-gray-600 group-hover:scale-110`
                  }`}>
                    <IconComponent className="w-20 h-20" />
                  </div>
                  
                  {/* Título */}
                  <h3 className={`font-semibold text-lg mb-3 transition-colors duration-300 ${
                    data.serviceType === service.id ? 'text-white' : 'text-gray-900'
                  }`}>
                    {service.name}
                  </h3>
                  
                  {/* Descripción */}
                  <p className={`text-sm mb-4 leading-relaxed transition-colors duration-300 ${
                    data.serviceType === service.id ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {service.description}
                  </p>
                  
                  {/* Ejemplo */}
                  <p className={`text-xs italic transition-colors duration-300 ${
                    data.serviceType === service.id ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {service.example}
                  </p>

                  {/* Indicador de selección */}
                  {data.serviceType === service.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <MdCheckCircle className="w-4 h-4 text-gray-800" />
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
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-3">Servicio seleccionado</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <selectedServiceType.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">{selectedServiceType.name}</p>
                  <p className="text-blue-700 text-sm mt-1">{selectedServiceType.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón siguiente - Estilo Apple */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step1PackageDetails;
