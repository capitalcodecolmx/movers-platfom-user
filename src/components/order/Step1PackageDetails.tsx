// =====================================================
// PASO 1: DETALLES DEL PAQUETE
// =====================================================

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Weight, 
  Ruler, 
  DollarSign, 
  AlertTriangle, 
  Shield, 
  Zap, 
  ArrowRight, 
  Check,
  FileText,
  Laptop,
  Shirt,
  Apple,
  Pill,
  Gift,
  Wrench,
  Box
} from 'lucide-react';

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
  const [packageTypes] = useState([
    { id: 'documentos', name: 'Documentos', icon: FileText, maxWeight: 2 },
    { id: 'electronicos', name: 'Electrónicos', icon: Laptop, maxWeight: 10 },
    { id: 'ropa', name: 'Ropa', icon: Shirt, maxWeight: 5 },
    { id: 'alimentos', name: 'Alimentos', icon: Apple, maxWeight: 15 },
    { id: 'farmaceuticos', name: 'Farmacéuticos', icon: Pill, maxWeight: 3 },
    { id: 'regalos', name: 'Regalos', icon: Gift, maxWeight: 8 },
    { id: 'herramientas', name: 'Herramientas', icon: Wrench, maxWeight: 25 },
    { id: 'otros', name: 'Otros', icon: Box, maxWeight: 50 },
  ]);

  const [packageSizes] = useState([
    {
      id: 'pequeno',
      name: 'Pequeño',
      description: 'Sobre, carta, documento',
      weight: 0.5,
      dimensions: { height: 2, width: 15, length: 20 },
      icon: FileText
    },
    {
      id: 'mediano',
      name: 'Mediano',
      description: 'Caja pequeña, libro, electrónico',
      weight: 2,
      dimensions: { height: 10, width: 20, length: 30 },
      icon: Package
    },
    {
      id: 'grande',
      name: 'Grande',
      description: 'Caja mediana, ropa, regalos',
      weight: 5,
      dimensions: { height: 20, width: 30, length: 40 },
      icon: Package
    },
    {
      id: 'extra-grande',
      name: 'Extra Grande',
      description: 'Caja grande, herramientas',
      weight: 15,
      dimensions: { height: 40, width: 50, length: 60 },
      icon: Package
    },
    {
      id: 'personalizado',
      name: 'Personalizado',
      description: 'Especifica tus propias medidas',
      weight: 0,
      dimensions: { height: 0, width: 0, length: 0 },
      icon: Ruler
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedSize, setSelectedSize] = useState<string>('');

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!data.packageType) {
      newErrors.packageType = 'Selecciona un tipo de paquete';
    }

    if (!data.packageDescription.trim()) {
      newErrors.packageDescription = 'Describe el contenido del paquete';
    }

    if (!selectedSize) {
      newErrors.size = 'Selecciona un tamaño de paquete';
    }

    if (selectedSize === 'personalizado') {
      if (data.weight <= 0) {
        newErrors.weight = 'El peso debe ser mayor a 0';
      }

      if (data.weight > 50) {
        newErrors.weight = 'El peso máximo es 50 kg';
      }

      if (data.dimensions.length <= 0 || data.dimensions.width <= 0 || data.dimensions.height <= 0) {
        newErrors.dimensions = 'Las dimensiones deben ser mayores a 0';
      }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const selectedPackageType = packageTypes.find(type => type.id === data.packageType);
  const selectedPackageSize = packageSizes.find(size => size.id === selectedSize);

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
    const size = packageSizes.find(s => s.id === sizeId);
    if (size && sizeId !== 'personalizado') {
      onUpdate({
        weight: size.weight,
        dimensions: size.dimensions
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            ¿Qué vas a enviar?
          </h2>
          <p className="text-gray-500 text-lg">
            Proporciona los detalles de tu paquete para calcular la mejor opción de envío
          </p>
        </div>

        <div className="space-y-6">
          {/* Tipo de paquete - Estilo Apple */}
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {packageTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => onUpdate({ packageType: type.id })}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                      data.packageType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        data.packageType === type.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          data.packageType === type.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{type.name}</h3>
                      <p className="text-xs text-gray-500">Hasta {type.maxWeight}kg</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.packageType && (
              <p className="text-red-500 text-sm mt-2 text-center">{errors.packageType}</p>
            )}
          </div>

          {/* Descripción del paquete - Minimalista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Descripción del contenido *
            </label>
            <textarea
              value={data.packageDescription}
              onChange={(e) => onUpdate({ packageDescription: e.target.value })}
              placeholder="Describe el contenido de tu paquete..."
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
              rows={2}
            />
            {errors.packageDescription && (
              <p className="text-red-500 text-sm mt-2">{errors.packageDescription}</p>
            )}
          </div>

          {/* Tamaño del paquete - Estilo Apple */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Tamaño del paquete *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packageSizes.map((size) => {
                const IconComponent = size.icon;
                return (
                  <button
                    key={size.id}
                    onClick={() => handleSizeSelect(size.id)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center ${
                      selectedSize === size.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        selectedSize === size.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          selectedSize === size.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{size.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{size.description}</p>
                      {size.id !== 'personalizado' && (
                        <div className="text-xs text-gray-400">
                          {size.weight}kg • {size.dimensions.height}×{size.dimensions.width}×{size.dimensions.length}cm
                        </div>
                      )}
                    </div>
                    {selectedSize === size.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.size && (
              <p className="text-red-500 text-sm mt-2 text-center">{errors.size}</p>
            )}
            {errors.weight && (
              <p className="text-red-500 text-sm mt-2 text-center">{errors.weight}</p>
            )}
            {errors.dimensions && (
              <p className="text-red-500 text-sm mt-2 text-center">{errors.dimensions}</p>
            )}
          </div>

          {/* Campos personalizados (solo si se selecciona personalizado) */}
          {selectedSize === 'personalizado' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-medium text-gray-900">Especifica las medidas</h3>
              
              {/* Peso personalizado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="w-4 h-4 inline mr-1" />
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  value={data.weight}
                  onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  max="50"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Dimensiones personalizadas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="w-4 h-4 inline mr-1" />
                  Dimensiones (cm) *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Alto</label>
                    <input
                      type="number"
                      value={data.dimensions.height}
                      onChange={(e) => onUpdate({
                        dimensions: { ...data.dimensions, height: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder="0"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Ancho</label>
                    <input
                      type="number"
                      value={data.dimensions.width}
                      onChange={(e) => onUpdate({
                        dimensions: { ...data.dimensions, width: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder="0"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Profundidad</label>
                    <input
                      type="number"
                      value={data.dimensions.length}
                      onChange={(e) => onUpdate({
                        dimensions: { ...data.dimensions, length: parseFloat(e.target.value) || 0 }
                      })}
                      placeholder="0"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Opciones especiales - Minimalista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Opciones especiales
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={data.fragile}
                  onChange={(e) => onUpdate({ fragile: e.target.checked })}
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-700">Frágil</span>
              </label>

              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={data.insuranceRequired}
                  onChange={(e) => onUpdate({ insuranceRequired: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Seguro</span>
              </label>

              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={data.urgent}
                  onChange={(e) => onUpdate({ urgent: e.target.checked })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-700">Urgente</span>
              </label>
            </div>
          </div>

          {/* Instrucciones especiales - Minimalista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Instrucciones especiales
            </label>
            <textarea
              value={data.specialInstructions}
              onChange={(e) => onUpdate({ specialInstructions: e.target.value })}
              placeholder="Instrucciones especiales para el manejo del paquete..."
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
              rows={2}
            />
          </div>

          {/* Resumen del paquete - Minimalista */}
          {selectedPackageType && selectedPackageSize && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-medium text-gray-900 mb-3">Resumen del paquete</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Tipo:</span>
                  <span className="font-medium">{selectedPackageType.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tamaño:</span>
                  <span className="font-medium">{selectedPackageSize.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Peso:</span>
                  <span className="font-medium">{data.weight} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dimensiones:</span>
                  <span className="font-medium">{data.dimensions.height}×{data.dimensions.width}×{data.dimensions.length}cm</span>
                </div>
                {(data.fragile || data.insuranceRequired || data.urgent) && (
                  <div className="flex items-center justify-between">
                    <span>Opciones:</span>
                    <span className="font-medium">
                      {[
                        data.fragile && 'Frágil',
                        data.insuranceRequired && 'Seguro',
                        data.urgent && 'Urgente'
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
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
