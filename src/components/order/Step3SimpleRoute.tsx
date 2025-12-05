// =====================================================
// PASO 3: UBICACIÓN
// =====================================================

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Store } from 'lucide-react';
import { MdLocationOn, MdPlace, MdCheckCircle } from 'react-icons/md';
import CityAutocomplete from '../CityAutocomplete';
import { useOrderStore } from '../../store/useOrderStore';

interface Step3SimpleRouteProps {
  onNext: () => void;
  onPrev: () => void;
}

// Estados de México con abreviaciones
const MEXICAN_STATES = [
  { name: 'Aguascalientes', abbrev: 'AGS' },
  { name: 'Baja California', abbrev: 'BCN' },
  { name: 'Baja California Sur', abbrev: 'BCS' },
  { name: 'Campeche', abbrev: 'CAMP' },
  { name: 'Chiapas', abbrev: 'CHIS' },
  { name: 'Chihuahua', abbrev: 'CHIH' },
  { name: 'Ciudad de México', abbrev: 'CDMX' },
  { name: 'Coahuila', abbrev: 'COAH' },
  { name: 'Colima', abbrev: 'COL' },
  { name: 'Durango', abbrev: 'DGO' },
  { name: 'Guanajuato', abbrev: 'GTO' },
  { name: 'Guerrero', abbrev: 'GRO' },
  { name: 'Hidalgo', abbrev: 'HGO' },
  { name: 'Jalisco', abbrev: 'JAL' },
  { name: 'México', abbrev: 'MEX' },
  { name: 'Michoacán', abbrev: 'MICH' },
  { name: 'Morelos', abbrev: 'MOR' },
  { name: 'Nayarit', abbrev: 'NAY' },
  { name: 'Nuevo León', abbrev: 'NL' },
  { name: 'Oaxaca', abbrev: 'OAX' },
  { name: 'Puebla', abbrev: 'PUE' },
  { name: 'Querétaro', abbrev: 'QRO' },
  { name: 'Quintana Roo', abbrev: 'QROO' },
  { name: 'San Luis Potosí', abbrev: 'SLP' },
  { name: 'Sinaloa', abbrev: 'SIN' },
  { name: 'Sonora', abbrev: 'SON' },
  { name: 'Tabasco', abbrev: 'TAB' },
  { name: 'Tamaulipas', abbrev: 'TAMPS' },
  { name: 'Tlaxcala', abbrev: 'TLAX' },
  { name: 'Veracruz', abbrev: 'VER' },
  { name: 'Yucatán', abbrev: 'YUC' },
  { name: 'Zacatecas', abbrev: 'ZAC' }
];

const AGUA_CENTROS = [
  { id: 1, name: 'Agua Centro Matriz', address: 'Av. Principal 123, Centro, Monterrey, NL', distance: '2.5 km' },
  { id: 2, name: 'Agua Centro Norte', address: 'Carr. Laredo 450, Escobedo, NL', distance: '8.1 km' },
  { id: 3, name: 'Agua Centro Sur', address: 'Av. Garza Sada 3000, Monterrey, NL', distance: '5.3 km' },
];

const Step3SimpleRoute: React.FC<Step3SimpleRouteProps> = ({
  onNext,
  onPrev,
}) => {
  const {
    serviceType,
    setPickupLocation,
    setDeliveryAddress,
    pickupLocation,
    deliveryAddress: storedDeliveryAddress // Assuming string in store for now, but we handle components here locally
  } = useOrderStore();

  // Estados para campos de entrega (Domicilio)
  // Decompose stored address if needed or just keep local state and update store on Next
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryNumber, setDeliveryNumber] = useState('');
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [deliveryPostalCode, setDeliveryPostalCode] = useState('');

  // Estados para validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize fields if store has data (optional, skipping for simplicity unless persistent)

  // Función para construir dirección completa
  const buildAddress = (street: string, number: string, neighborhood: string, city: string, state: string, postalCode?: string) => {
    const parts = [];
    if (street) parts.push(street);
    if (number) parts.push(number);
    if (neighborhood) parts.push(neighborhood);
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (postalCode) parts.push(postalCode);
    return parts.join(', ');
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (serviceType === 'delivery') {
      if (!deliveryStreet.trim()) newErrors.deliveryStreet = 'Calle es requerida';
      if (!deliveryNumber.trim()) newErrors.deliveryNumber = 'Número es requerido';
      if (!deliveryCity.trim()) newErrors.deliveryCity = 'Ciudad es requerida';
      if (!deliveryState.trim()) newErrors.deliveryState = 'Estado es requerido';
    } else if (serviceType === 'pickup') {
      if (!pickupLocation) {
        newErrors.pickupLocation = 'Debes seleccionar un Agua Centro';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (serviceType === 'delivery') {
        const fullAddress = buildAddress(
          deliveryStreet,
          deliveryNumber,
          deliveryNeighborhood,
          deliveryCity,
          deliveryState,
          deliveryPostalCode
        );
        setDeliveryAddress(fullAddress);
      }
      // If pickup, pickupLocation is already set via handleSelectLocation
      onNext();
    }
  };

  const handleSelectLocation = (location: any) => {
    setPickupLocation(location);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
            {serviceType === 'delivery' ? '3. Dirección de Entrega' : '3. Recolección en Agua Centro'}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            {serviceType === 'delivery'
              ? 'Indica dónde quieres recibir tu pedido'
              : 'Selecciona el Agua Centro donde recogerás tu pedido'}
          </p>
        </div>

        <div className="space-y-8">

          {serviceType === 'delivery' && (
            /* Formulario de Dirección de Entrega */
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-sm">
                  <MdPlace className="w-7 h-7 text-white" />
                </div>
                <span className="text-gray-900">
                  Datos de envío
                </span>
              </h3>

              <div className="space-y-4">
                <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 italic">
                  Ejemplo: Blvd. Díaz Ordaz 4500, San Pedro Garza García, N.L.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Calle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calle *</label>
                    <input
                      type="text"
                      value={deliveryStreet}
                      onChange={(e) => setDeliveryStreet(e.target.value)}
                      placeholder="Ej: Blvd. Díaz Ordaz"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    {errors.deliveryStreet && <p className="text-red-500 text-sm mt-1">{errors.deliveryStreet}</p>}
                  </div>

                  {/* Número */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
                    <input
                      type="text"
                      value={deliveryNumber}
                      onChange={(e) => setDeliveryNumber(e.target.value)}
                      placeholder="Ej: 4500"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    {errors.deliveryNumber && <p className="text-red-500 text-sm mt-1">{errors.deliveryNumber}</p>}
                  </div>

                  {/* Colonia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Colonia</label>
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
                    <CityAutocomplete
                      value={deliveryCity}
                      onChange={setDeliveryCity}
                      state={deliveryState}
                      placeholder="Ej: San Pedro, Reynosa"
                      label="Ciudad"
                      required={true}
                    />
                    {errors.deliveryCity && <p className="text-red-500 text-sm mt-1">{errors.deliveryCity}</p>}
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                    <select
                      value={deliveryState}
                      onChange={(e) => setDeliveryState(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Selecciona un estado</option>
                      {MEXICAN_STATES.map(state => (
                        <option key={state.abbrev} value={state.name}>{state.name}</option>
                      ))}
                    </select>
                    {errors.deliveryState && <p className="text-red-500 text-sm mt-1">{errors.deliveryState}</p>}
                  </div>

                  {/* Código Postal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                    <input
                      type="text"
                      value={deliveryPostalCode}
                      onChange={(e) => setDeliveryPostalCode(e.target.value)}
                      placeholder="Ej: 66200"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {serviceType === 'pickup' && (
            /* Selección de Agua Centro */
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-800 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-sm">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <span className="text-gray-900">
                  Elige tu sucursal
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AGUA_CENTROS.map((center) => (
                  <button
                    key={center.id}
                    onClick={() => handleSelectLocation(center)}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${pickupLocation?.id === center.id
                        ? 'border-gray-800 bg-white shadow-md'
                        : 'border-white bg-white hover:border-gray-200'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{center.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{center.address}</p>
                      </div>
                      {pickupLocation?.id === center.id && (
                        <MdCheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.pickupLocation && <p className="text-red-500 text-sm mt-4 text-center">{errors.pickupLocation}</p>}
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
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3SimpleRoute;