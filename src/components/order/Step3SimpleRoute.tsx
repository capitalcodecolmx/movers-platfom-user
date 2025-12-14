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
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            {serviceType === 'delivery' ? 'Dirección de Entrega' : 'Recolección'}
          </h2>
          <p className="text-gray-500 text-lg">
            {serviceType === 'delivery'
              ? 'Indica dónde quieres recibir tu pedido'
              : 'Selecciona el Agua Centro donde recogerás tu pedido'}
          </p>
        </div>

        <div className="space-y-8 max-w-3xl mx-auto">

          {serviceType === 'delivery' && (
            /* Formulario de Dirección de Entrega */
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center mb-6 text-gray-900">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm border border-gray-100">
                  <MdPlace className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold">Datos de envío</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Calle */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Calle *</label>
                  <input
                    type="text"
                    value={deliveryStreet}
                    onChange={(e) => setDeliveryStreet(e.target.value)}
                    placeholder="Ej: Blvd. Díaz Ordaz"
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-100 focus:border-gray-300 transition-all outline-none"
                  />
                  {errors.deliveryStreet && <p className="text-red-500 text-sm mt-1 ml-1">{errors.deliveryStreet}</p>}
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Número *</label>
                  <input
                    type="text"
                    value={deliveryNumber}
                    onChange={(e) => setDeliveryNumber(e.target.value)}
                    placeholder="Ej: 4500"
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-100 focus:border-gray-300 transition-all outline-none"
                  />
                  {errors.deliveryNumber && <p className="text-red-500 text-sm mt-1 ml-1">{errors.deliveryNumber}</p>}
                </div>

                {/* Colonia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Colonia</label>
                  <input
                    type="text"
                    value={deliveryNeighborhood}
                    onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                    placeholder="Ej: Valle Oriente"
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-100 focus:border-gray-300 transition-all outline-none"
                  />
                </div>

                {/* Ciudad - Assuming CityAutocomplete accepts similar styling classes or we wrap it */}
                <div>
                  <div className="relative">
                    <CityAutocomplete
                      value={deliveryCity}
                      onChange={setDeliveryCity}
                      state={deliveryState}
                      placeholder="Ej: San Pedro"
                      label="Ciudad"
                      required={true}
                    // Note: CityAutocomplete might need internal style updates if it doesn't accept className or uses hardcoded styles
                    />
                  </div>
                  {errors.deliveryCity && <p className="text-red-500 text-sm mt-1 ml-1">{errors.deliveryCity}</p>}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Estado *</label>
                  <div className="relative">
                    <select
                      value={deliveryState}
                      onChange={(e) => setDeliveryState(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-100 focus:border-gray-300 transition-all outline-none appearance-none"
                    >
                      <option value="">Selecciona un estado</option>
                      {MEXICAN_STATES.map(state => (
                        <option key={state.abbrev} value={state.name}>{state.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  {errors.deliveryState && <p className="text-red-500 text-sm mt-1 ml-1">{errors.deliveryState}</p>}
                </div>

                {/* Código Postal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">Código Postal</label>
                  <input
                    type="text"
                    value={deliveryPostalCode}
                    onChange={(e) => setDeliveryPostalCode(e.target.value)}
                    placeholder="Ej: 66200"
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-gray-100 focus:border-gray-300 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {serviceType === 'pickup' && (
            /* Selección de Agua Centro */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AGUA_CENTROS.map((center) => (
                <button
                  key={center.id}
                  onClick={() => handleSelectLocation(center)}
                  className={`group relative p-6 border rounded-2xl text-left transition-all duration-300 ${pickupLocation?.id === center.id
                      ? 'border-black bg-gray-50 ring-1 ring-black'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className={`p-3 rounded-xl ${pickupLocation?.id === center.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}`}>
                      <Store className="w-5 h-5" />
                    </div>
                    {pickupLocation?.id === center.id && (
                      <MdCheckCircle className="w-6 h-6 text-black" />
                    )}
                  </div>

                  <h4 className="font-bold text-gray-900 text-lg mb-1">{center.name}</h4>
                  <p className="text-sm text-gray-500">{center.address}</p>

                  <div className="mt-4 inline-flex items-center text-xs font-medium text-gray-500 bg-white border border-gray-100 px-2 py-1 rounded-lg">
                    <Navigation className="w-3 h-3 mr-1" />
                    {center.distance}
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Botones de navegación - Clean */}
        <div className="mt-10 flex justify-between items-center max-w-3xl mx-auto border-t border-gray-100 pt-6">
          <button
            onClick={onPrev}
            className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium px-4 py-2"
          >
            ← Volver
          </button>

          <button
            onClick={handleNext}
            className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-black transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm"
          >
            Continuar para Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3SimpleRoute;