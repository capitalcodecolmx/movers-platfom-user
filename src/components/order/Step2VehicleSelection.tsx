// =====================================================
// PASO 2: SELECCIÓN DE VEHÍCULOS
// =====================================================

import React, { useState, useEffect } from 'react';
import { Truck, ArrowLeft, ArrowRight, Check, Clock, Weight, MapPin, Loader2 } from 'lucide-react';
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

  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);

  useEffect(() => {
    if (data.weight && data.weight > 0) {
      const recommended = getRecommendedVehicles(data.weight);
      setFilteredVehicles(recommended);
    } else {
      setFilteredVehicles([]);
    }
  }, [data.weight, vehicles]);

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

  const handleVehicleSelect = (vehicle: any) => {
    onUpdate({
      selectedVehicle: vehicle,
      vehicleType: vehicle.type,
    });
  };

  const handleNext = () => {
    if (data.selectedVehicle) {
      onNext();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Vehículo Recomendado
          </h2>
          <p className="text-gray-500 text-lg">
            Para {data.weight}kg
          </p>
        </div>

        {/* Información del paquete - Minimalista */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
            <span>{data.weight}kg</span>
            <span>•</span>
            <span>{data.packageType}</span>
            {data.fragile && (
              <>
                <span>•</span>
                <span className="text-yellow-600">Frágil</span>
              </>
            )}
            {data.urgent && (
              <>
                <span>•</span>
                <span className="text-red-600">Urgente</span>
              </>
            )}
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando vehículos disponibles...</span>
          </div>
        )}

        {/* Error al cargar vehículos */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Sin vehículos disponibles */}
        {!loading && !error && filteredVehicles.length === 0 && data.weight > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">No hay vehículos disponibles</h3>
            <p className="text-yellow-700 text-sm">
              No encontramos vehículos que puedan transportar {data.weight}kg. 
              Por favor, contacta con soporte para opciones especiales.
            </p>
          </div>
        )}

        {/* Lista de vehículos - Estilo Apple */}
        {!loading && filteredVehicles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className={`relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 border shadow-sm hover:shadow-md ${
                  data.selectedVehicle?.id === vehicle.id
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleVehicleSelect(vehicle)}
              >
                {/* Imagen del vehículo */}
                <div className="text-center mb-4">
                  {vehicle.image ? (
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-20 h-20 mx-auto object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto bg-blue-100 rounded-xl flex items-center justify-center text-3xl text-blue-600">
                      {getVehicleIcon(vehicle.type)}
                    </div>
                  )}
                </div>

                {/* Información del vehículo */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {vehicle.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {getVehicleTypeName(vehicle.type)}
                  </p>
                  
                  {/* Capacidad */}
                  <div className="text-sm text-gray-600 mb-4">
                    Hasta {vehicle.capacity_kg}kg
                  </div>

                  {/* Precio */}
                  <div className="text-lg font-semibold text-gray-600 mb-2">
                    Precio por km
                  </div>
                  <div className="text-xs text-gray-500">
                    Se calculará con la distancia
                  </div>
                </div>

                {/* Indicador de selección */}
                {data.selectedVehicle?.id === vehicle.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Información adicional - Minimalista */}
        <div className="text-center text-sm text-gray-500 mb-8">
          El precio final se calculará con la distancia exacta
        </div>

        {/* Botones de navegación - Estilo Apple */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrev}
            className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
          >
            ← Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!data.selectedVehicle}
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
