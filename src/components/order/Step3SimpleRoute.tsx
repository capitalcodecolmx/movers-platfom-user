// =====================================================
// PASO 3: RUTA DEL ENVÍO (VERSIÓN SIMPLE SIN MAPA)
// =====================================================

import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';

interface Step3SimpleRouteProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}


// Ciudades principales de México
const MEXICAN_CITIES = [
  'Reynosa', 'Ciudad de México', 'Monterrey', 'Guadalajara', 
  'Puebla', 'Veracruz', 'Tampico', 'Cancún', 'Tijuana',
  'Mérida', 'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí'
];

const Step3SimpleRoute: React.FC<Step3SimpleRouteProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  // Estados para campos separados de recogida
  const [pickupStreet, setPickupStreet] = useState('');
  const [pickupNumber, setPickupNumber] = useState('');
  const [pickupNeighborhood, setPickupNeighborhood] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState('');
  
  // Estados para campos separados de entrega
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryNumber, setDeliveryNumber] = useState('');
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  
  // Estados para validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Función para construir dirección completa
  const buildAddress = (street: string, number: string, neighborhood: string, city: string, state: string) => {
    const parts = [];
    if (street) parts.push(street);
    if (number) parts.push(number);
    if (neighborhood) parts.push(neighborhood);
    if (city) parts.push(city);
    if (state) parts.push(state);
    return parts.join(', ');
  };


  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    // Validar campos de recogida
    if (!pickupStreet.trim()) {
      newErrors.pickupStreet = 'Calle de recogida es requerida';
    }
    if (!pickupNumber.trim()) {
      newErrors.pickupNumber = 'Número de recogida es requerido';
    }
    if (!pickupCity.trim()) {
      newErrors.pickupCity = 'Ciudad de recogida es requerida';
    }
    if (!pickupState.trim()) {
      newErrors.pickupState = 'Estado de recogida es requerido';
    }

    // Validar campos de entrega
    if (!deliveryStreet.trim()) {
      newErrors.deliveryStreet = 'Calle de entrega es requerida';
    }
    if (!deliveryNumber.trim()) {
      newErrors.deliveryNumber = 'Número de entrega es requerido';
    }
    if (!deliveryCity.trim()) {
      newErrors.deliveryCity = 'Ciudad de entrega es requerida';
    }
    if (!deliveryState.trim()) {
      newErrors.deliveryState = 'Estado de entrega es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onUpdate({
        pickupAddress: {
          street: pickupStreet,
          number: pickupNumber,
          neighborhood: pickupNeighborhood,
          city: pickupCity,
          state: pickupState,
          full: buildAddress(pickupStreet, pickupNumber, pickupNeighborhood, pickupCity, pickupState)
        },
        deliveryAddress: {
          street: deliveryStreet,
          number: deliveryNumber,
          neighborhood: deliveryNeighborhood,
          city: deliveryCity,
          state: deliveryState,
          full: buildAddress(deliveryStreet, deliveryNumber, deliveryNeighborhood, deliveryCity, deliveryState)
        }
      });
      onNext();
    }
  };

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Orden</h1>
        <p className="text-gray-500 text-lg">
          Especifica las direcciones de recogida y entrega
        </p>
        
        {/* Indicador de progreso */}
        {pickupStreet && pickupNumber && pickupCity && pickupState && 
         deliveryStreet && deliveryNumber && deliveryCity && deliveryState && (
          <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center text-green-600">
              <span className="text-lg mr-2">✓</span>
              <span className="text-sm font-medium">¡Direcciones completas! Listo para continuar.</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full">
        {/* Formulario de direcciones */}
        <div className="w-full">
          <div className="space-y-8">
            {/* Dirección de recogida */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </span>
                Dirección de Recogida
              </h3>
              
              <div className="space-y-4">
                {/* Calle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle *
                  </label>
                  <input
                    type="text"
                    value={pickupStreet}
                    onChange={(e) => setPickupStreet(e.target.value)}
                    placeholder="Ej: Eugenio de La Croix"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pickupStreet && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupStreet}</p>
                  )}
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={pickupNumber}
                    onChange={(e) => setPickupNumber(e.target.value)}
                    placeholder="Ej: 1120"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pickupNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupNumber}</p>
                  )}
                </div>

                {/* Colonia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colonia
                  </label>
                  <input
                    type="text"
                    value={pickupNeighborhood}
                    onChange={(e) => setPickupNeighborhood(e.target.value)}
                    placeholder="Ej: Col. Del Valle"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <select
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Selecciona una ciudad</option>
                    {MEXICAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.pickupCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupCity}</p>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    value={pickupState}
                    onChange={(e) => setPickupState(e.target.value)}
                    placeholder="Ej: Tamaulipas"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pickupState && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupState}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dirección de entrega */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </span>
                Dirección de Entrega
              </h3>
              
              <div className="space-y-4">
                {/* Calle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle *
                  </label>
                  <input
                    type="text"
                    value={deliveryStreet}
                    onChange={(e) => setDeliveryStreet(e.target.value)}
                    placeholder="Ej: 5 de Febrero"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.deliveryStreet && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryStreet}</p>
                  )}
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={deliveryNumber}
                    onChange={(e) => setDeliveryNumber(e.target.value)}
                    placeholder="Ej: 456"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.deliveryNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryNumber}</p>
                  )}
                </div>

                {/* Colonia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colonia
                  </label>
                  <input
                    type="text"
                    value={deliveryNeighborhood}
                    onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                    placeholder="Ej: Col. Centro"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <select
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Selecciona una ciudad</option>
                    {MEXICAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.deliveryCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryCity}</p>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    placeholder="Ej: CDMX"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.deliveryState && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryState}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onPrev}
          className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={!pickupStreet || !pickupNumber || !pickupCity || !pickupState || 
                   !deliveryStreet || !deliveryNumber || !deliveryCity || !deliveryState}
          className={`flex items-center px-8 py-3 rounded-xl transition-colors font-semibold ${
            pickupStreet && pickupNumber && pickupCity && pickupState && 
            deliveryStreet && deliveryNumber && deliveryCity && deliveryState
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step3SimpleRoute;