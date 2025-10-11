// =====================================================
// PASO 3: ORIGEN Y DESTINO
// =====================================================

import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { 
  MdLocationOn, 
  MdLocalShipping,
  MdCheckCircle,
  MdPlace
} from 'react-icons/md';

interface Step3SimpleRouteProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}


// Estados de México
const MEXICAN_STATES = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'México',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas'
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            3. Origen y destino
          </h2>
          <p className="text-gray-500 text-lg">
            Especifica las direcciones de recogida y entrega
          </p>
        </div>

        <div className="space-y-8">
          {/* Información del servicio y vehículo seleccionado */}
          {data.serviceType && data.selectedVehicleType && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
                <span>Servicio: {data.serviceType === 'ftl' ? 'Carga Completa' : data.serviceType === 'ltl' ? 'Carga Parcial' : 'Última Milla'}</span>
                <span>•</span>
                <span>Unidad: {data.selectedVehicleType.name}</span>
              </div>
            </div>
          )}

          {/* Dirección de recogida */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                <MdLocationOn className="w-7 h-7 text-white" />
              </div>
              <span className="text-gray-900">
                Recolección
              </span>
            </h3>
              
            <div className="space-y-4">
              {/* Ejemplo de dirección */}
              <div className="text-sm text-gray-500 mb-4 italic">
                Ejemplo: Av. Revolución 1203, Monterrey, N.L.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Calle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle *
                  </label>
                  <input
                    type="text"
                    value={pickupStreet}
                    onChange={(e) => setPickupStreet(e.target.value)}
                    placeholder="Ej: Av. Revolución"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                    placeholder="Ej: 1203"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                    placeholder="Ej: Col. Centro"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    placeholder="Ej: Monterrey"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                  {errors.pickupCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupCity}</p>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    value={pickupState}
                    onChange={(e) => setPickupState(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Selecciona un estado</option>
                    {MEXICAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.pickupState && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupState}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dirección de entrega */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                <MdLocalShipping className="w-7 h-7 text-white" />
              </div>
              <span className="text-gray-900">
                Entrega
              </span>
            </h3>
              
            <div className="space-y-4">
              {/* Ejemplo de dirección */}
              <div className="text-sm text-gray-500 mb-4 italic">
                Ejemplo: Blvd. Díaz Ordaz 4500, San Pedro Garza García, N.L.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Calle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle *
                  </label>
                  <input
                    type="text"
                    value={deliveryStreet}
                    onChange={(e) => setDeliveryStreet(e.target.value)}
                    placeholder="Ej: Blvd. Díaz Ordaz"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                    placeholder="Ej: 4500"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                    placeholder="Ej: Valle Oriente"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="Ej: San Pedro Garza García"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                  {errors.deliveryCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryCity}</p>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Selecciona un estado</option>
                    {MEXICAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.deliveryState && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryState}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de progreso */}
          {pickupStreet && pickupNumber && pickupCity && pickupState && 
           deliveryStreet && deliveryNumber && deliveryCity && deliveryState && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center text-gray-700">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4 shadow-sm">
                  <MdCheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">¡Direcciones completas!</p>
                  <p className="text-sm text-gray-600">Listo para continuar al siguiente paso</p>
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
            disabled={!pickupStreet || !pickupNumber || !pickupCity || !pickupState || 
                     !deliveryStreet || !deliveryNumber || !deliveryCity || !deliveryState}
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3SimpleRoute;