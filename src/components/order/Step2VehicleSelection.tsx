// =====================================================
// PASO 2: TIPO DE UNIDAD
// =====================================================

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Clock, 
  Weight, 
  MapPin, 
  Loader2
} from 'lucide-react';
import { 
  MdCheckCircle,
  MdAcUnit
} from 'react-icons/md';
import { useVehicles } from '../../hooks/useVehicles';

interface Step2VehicleSelectionProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const Step2VehicleSelection: React.FC<Step2VehicleSelectionProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const { 
    vehicles, 
    loading, 
    error, 
    getRecommendedVehicles, 
    getVehicleIcon, 
    getVehicleTypeName 
  } = useVehicles();

  const [vehicleTypes] = useState([
    {
      id: 'motocicleta',
      name: 'Motocicleta',
      image: '/moto.jpeg',
      description: 'Paquetes pequeños o entregas rápidas',
      capacity: 'Hasta 5kg',
      features: ['Rápido', 'Económico', 'Tráfico urbano']
    },
    {
      id: 'small-van',
      name: 'Small Van 1 ton',
      image: '/van.jpeg',
      description: 'Cajas, alimentos, refacciones, productos ligeros',
      capacity: 'Hasta 1000kg',
      features: ['Versátil', 'Climatizado', 'Múltiples paradas']
    },
    {
      id: 'large-van',
      name: 'Large Van 1.5 ton',
      image: '/larguevan.jpeg',
      description: 'Mayor capacidad o más volumen',
      capacity: 'Hasta 1500kg',
      features: ['Gran capacidad', 'Seguro', 'Larga distancia']
    },
    {
      id: 'truck',
      name: 'Camión 3.5 ton',
      image: '/camion.jpeg',
      description: 'Mercancía paletizada o más pesada',
      capacity: 'Hasta 3500kg',
      features: ['Máxima capacidad', 'Profesional', 'Pallets']
    },
    {
      id: 'refrigerado',
      name: 'Refrigerado',
      icon: MdAcUnit,
      description: 'Productos que requieren temperatura controlada',
      capacity: 'Hasta 1500kg',
      features: ['Temperatura controlada', 'Alimentos', 'Farmacéuticos'],
      isRefrigerated: true
    }
  ]);

  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);

  useEffect(() => {
    // Filtrar vehículos basado en el tipo de servicio seleccionado
    if (data.serviceType) {
      let recommendedTypes = [];

      switch (data.serviceType) {
        case 'ftl':
          recommendedTypes = ['truck', 'large-van'];
          break;
        case 'ltl':
          recommendedTypes = ['large-van', 'small-van', 'truck'];
          break;
        case 'last-mile':
          recommendedTypes = ['motocicleta', 'small-van'];
          break;
        default:
          recommendedTypes = vehicleTypes.map(v => v.id);
      }

      // Siempre incluir la opción refrigerada
      recommendedTypes.push('refrigerado');

      const filtered = vehicleTypes.filter(v => recommendedTypes.includes(v.id));
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicleTypes);
    }
  }, [data.serviceType, vehicleTypes]);

  const calculateEstimatedCost = (vehicle: any) => {
    // Precios base por tipo de vehículo
    const basePrices = {
      'bicicleta': 15,
      'moto': 25,
      'auto': 35,
      'van': 50,
      'camion': 80
    };

    const pricePerKm = {
      'bicicleta': 2.5,
      'moto': 3.5,
      'auto': 4.0,
      'van': 5.0,
      'camion': 6.0
    };

    const basePrice = basePrices[vehicle.type as keyof typeof basePrices] || 35;
    const estimatedDistance = 10; // Estimación inicial, se calculará en el paso 3
    const distancePrice = estimatedDistance * (pricePerKm[vehicle.type as keyof typeof pricePerKm] || 4.0);
    
    let total = basePrice + distancePrice;
    
    // Aplicar cargos adicionales
    if (data.urgent) total *= 1.5;
    if (data.fragile) total += 10;
    if (data.insuranceRequired) total += 15;
    
    return Math.round(total);
  };

  const getEstimatedTime = (vehicle: any) => {
    const times = {
      'bicicleta': '15-30 min',
      'moto': '20-45 min',
      'auto': '30-60 min',
      'van': '45-90 min',
      'camion': '60-120 min'
    };
    return times[vehicle.type as keyof typeof times] || '30-60 min';
  };

  const getVehicleFeatures = (vehicle: any) => {
    const features = {
      'bicicleta': ['Rápido', 'Ecológico', 'Tráfico urbano'],
      'moto': ['Rápido', 'Flexible', 'Manejo de tráfico'],
      'auto': ['Protegido', 'Espacioso', 'Climatizado'],
      'van': ['Gran capacidad', 'Seguro', 'Múltiples paradas'],
      'camion': ['Máxima capacidad', 'Larga distancia', 'Profesional']
    };
    return features[vehicle.type as keyof typeof features] || ['Estándar'];
  };

  const handleVehicleSelect = (vehicleType: any) => {
    onUpdate({
      selectedVehicleType: vehicleType,
      vehicleType: vehicleType.id,
    });
  };

  const handleNext = () => {
    if (data.selectedVehicleType) {
      onNext();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            2. Tipo de unidad
          </h2>
          <p className="text-gray-500 text-lg">
            Selecciona la unidad más adecuada según tu carga
          </p>
        </div>

        <div className="space-y-8">
          {/* Información del servicio seleccionado */}
          {data.serviceType && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
                <span>Servicio: {data.serviceType === 'ftl' ? 'Carga Completa' : data.serviceType === 'ltl' ? 'Carga Parcial' : 'Última Milla'}</span>
              </div>
            </div>
          )}

          {/* Nota sobre refrigerado */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-200">
            <div className="flex items-center justify-center space-x-2 text-cyan-700">
              <span className="text-lg">❄️</span>
              <span className="text-sm font-medium">La opción Refrigerado está disponible para todos los tipos de servicio</span>
            </div>
          </div>

          {/* Lista de tipos de vehículos - Estilo Apple con imágenes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicleType) => (
              <button
                key={vehicleType.id}
                onClick={() => handleVehicleSelect(vehicleType)}
                className={`relative p-8 rounded-2xl transition-all duration-300 text-left group border-2 ${
                  data.selectedVehicleType?.id === vehicleType.id
                    ? 'bg-gray-800 border-gray-800 shadow-lg scale-105'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${vehicleType.isRefrigerated ? 'ring-2 ring-gray-300' : ''}`}
              >
                {/* Badge Refrigerado */}
                {vehicleType.isRefrigerated && (
                  <div className="absolute -top-2 left-4">
                    <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                      Refrigerado
                    </span>
                  </div>
                )}

                {/* Imagen del vehículo o Icono para refrigerado */}
                <div className="mb-6 transition-all duration-300 group-hover:scale-105">
                  {vehicleType.isRefrigerated ? (
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-[10px] shadow-lg flex items-center justify-center">
                      <vehicleType.icon className="w-16 h-16 text-gray-600" />
                    </div>
                  ) : (
                    <img
                      src={vehicleType.image}
                      alt={vehicleType.name}
                      className="w-24 h-24 object-cover rounded-[10px] shadow-lg"
                    />
                  )}
                </div>
                
                {/* Título */}
                <h3 className={`font-semibold text-lg mb-3 transition-colors duration-300 ${
                  data.selectedVehicleType?.id === vehicleType.id ? 'text-white' : 'text-gray-900'
                }`}>
                  {vehicleType.name}
                </h3>
                
                {/* Descripción */}
                <p className={`text-sm mb-4 leading-relaxed transition-colors duration-300 ${
                  data.selectedVehicleType?.id === vehicleType.id ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {vehicleType.description}
                </p>
                
                {/* Capacidad */}
                <div className={`text-sm mb-4 font-medium transition-colors duration-300 ${
                  data.selectedVehicleType?.id === vehicleType.id ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {vehicleType.capacity}
                </div>

                {/* Características */}
                <div className="flex flex-wrap gap-2">
                  {vehicleType.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs rounded-full transition-colors duration-300 ${
                        data.selectedVehicleType?.id === vehicleType.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Indicador de selección */}
                {data.selectedVehicleType?.id === vehicleType.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <MdCheckCircle className="w-4 h-4 text-gray-800" />
                  </div>
                )}

              </button>
            ))}
          </div>

          {/* Resumen del vehículo seleccionado */}
          {data.selectedVehicleType && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Unidad seleccionada</h3>
              <div className="flex items-start space-x-4">
                {data.selectedVehicleType.isRefrigerated ? (
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-[10px] shadow-md flex items-center justify-center">
                    <data.selectedVehicleType.icon className="w-8 h-8 text-gray-600" />
                  </div>
                ) : (
                  <img
                    src={data.selectedVehicleType.image}
                    alt={data.selectedVehicleType.name}
                    className="w-16 h-16 object-cover rounded-[10px] shadow-md"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{data.selectedVehicleType.name}</p>
                  <p className="text-gray-700 text-sm mt-1">{data.selectedVehicleType.description}</p>
                  <p className="text-gray-600 text-xs mt-2">{data.selectedVehicleType.capacity}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de navegación - Estilo Apple */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={onPrev}
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
          >
            ← Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!data.selectedVehicleType}
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2VehicleSelection;
