// =====================================================
// PASO 3: DIRECCIONES Y MAPA
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowLeft, Check, Navigation, Clock, DollarSign, User, Phone, Mail } from 'lucide-react';

interface Step3AddressAndMapProps {
  data: any;
  onUpdate: (data: any) => void;
  onSubmit: () => void;
  onPrev: () => void;
}

const Step3AddressAndMap: React.FC<Step3AddressAndMapProps> = ({
  data,
  onUpdate,
  onSubmit,
  onPrev,
}) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupContact, setPickupContact] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [deliveryContact, setDeliveryContact] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [distance, setDistance] = useState(0);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Simular cálculo de distancia (en producción usarías una API real)
  useEffect(() => {
    if (pickupAddress && deliveryAddress) {
      // Simular distancia aleatoria entre 5-50km
      const simulatedDistance = Math.floor(Math.random() * 45) + 5;
      setDistance(simulatedDistance);
      
      // Calcular costo basado en el vehículo seleccionado
      if (data.selectedVehicle) {
        const basePrice = data.selectedVehicle.basePrice;
        const distancePrice = simulatedDistance * data.selectedVehicle.pricePerKm;
        let total = basePrice + distancePrice;
        
        // Aplicar cargos adicionales
        if (data.urgent) total *= 1.5;
        if (data.fragile) total += 10;
        if (data.insuranceRequired) total += 15;
        
        setEstimatedCost(Math.round(total));
      }
    }
  }, [pickupAddress, deliveryAddress, data.selectedVehicle, data.urgent, data.fragile, data.insuranceRequired]);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (!pickupAddress.trim()) {
      newErrors.pickupAddress = 'Dirección de recogida es requerida';
    }

    if (!deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Dirección de entrega es requerida';
    }

    if (!pickupContact.name.trim()) {
      newErrors.pickupContactName = 'Nombre de contacto de recogida es requerido';
    }

    if (!pickupContact.phone.trim()) {
      newErrors.pickupContactPhone = 'Teléfono de contacto de recogida es requerido';
    }

    if (!deliveryContact.name.trim()) {
      newErrors.deliveryContactName = 'Nombre de contacto de entrega es requerido';
    }

    if (!deliveryContact.phone.trim()) {
      newErrors.deliveryContactPhone = 'Teléfono de contacto de entrega es requerido';
    }

    if (!pickupDate) {
      newErrors.pickupDate = 'Fecha de recogida es requerida';
    }

    if (!pickupTime) {
      newErrors.pickupTime = 'Hora de recogida es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      // Actualizar datos con la información del formulario
      onUpdate({
        pickupAddress: {
          address: pickupAddress,
          coordinates: { lat: 19.4326, lng: -99.1332 }, // Coordenadas simuladas
        },
        deliveryAddress: {
          address: deliveryAddress,
          coordinates: { lat: 19.4326, lng: -99.1332 }, // Coordenadas simuladas
        },
        pickupContact,
        deliveryContact,
        pickupDate,
        pickupTime,
        deliveryDate: deliveryDate || pickupDate,
        deliveryTime: deliveryTime || pickupTime,
        distance,
        estimatedCost,
      });
      
      onSubmit();
    }
  };

  const getEstimatedDuration = () => {
    if (!distance) return '0 min';
    const baseTime = distance * 2; // 2 minutos por km
    return `${baseTime}-${baseTime + 15} min`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de direcciones */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Direcciones y Contactos
              </h2>
              <p className="text-gray-600">
                Proporciona las direcciones y contactos para tu envío
              </p>
            </div>

            {/* Dirección de recogida */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </span>
                Dirección de Recogida
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección completa *
                  </label>
                  <textarea
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Calle, número, colonia, ciudad, estado, CP..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  {errors.pickupAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Nombre del contacto *
                    </label>
                    <input
                      type="text"
                      value={pickupContact.name}
                      onChange={(e) => setPickupContact({ ...pickupContact, name: e.target.value })}
                      placeholder="Nombre completo"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.pickupContactName && (
                      <p className="text-red-500 text-sm mt-1">{errors.pickupContactName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={pickupContact.phone}
                      onChange={(e) => setPickupContact({ ...pickupContact, phone: e.target.value })}
                      placeholder="+52 55 1234 5678"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.pickupContactPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.pickupContactPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={pickupContact.email}
                    onChange={(e) => setPickupContact({ ...pickupContact, email: e.target.value })}
                    placeholder="contacto@ejemplo.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Dirección de entrega */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </span>
                Dirección de Entrega
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección completa *
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Calle, número, colonia, ciudad, estado, CP..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  {errors.deliveryAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Nombre del contacto *
                    </label>
                    <input
                      type="text"
                      value={deliveryContact.name}
                      onChange={(e) => setDeliveryContact({ ...deliveryContact, name: e.target.value })}
                      placeholder="Nombre completo"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.deliveryContactName && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryContactName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={deliveryContact.phone}
                      onChange={(e) => setDeliveryContact({ ...deliveryContact, phone: e.target.value })}
                      placeholder="+52 55 1234 5678"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.deliveryContactPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.deliveryContactPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={deliveryContact.email}
                    onChange={(e) => setDeliveryContact({ ...deliveryContact, email: e.target.value })}
                    placeholder="contacto@ejemplo.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Fechas y horarios */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </span>
                Fechas y Horarios
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de recogida *
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pickupDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de recogida *
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pickupTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de entrega (opcional)
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de entrega (opcional)
                  </label>
                  <input
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa y resumen */}
        <div className="space-y-6">
          {/* Mapa simulado */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Navigation className="w-5 h-5 mr-2" />
              Ruta del Envío
            </h3>
            
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Mapa interactivo</p>
                <p className="text-sm">Se mostrará la ruta entre las direcciones</p>
              </div>
            </div>

            {distance > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Distancia estimada</p>
                    <p className="text-2xl font-bold text-gray-900">{distance} km</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tiempo estimado</p>
                    <p className="text-lg font-semibold text-gray-900">{getEstimatedDuration()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resumen de la orden */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Resumen de tu Orden
            </h3>

            <div className="space-y-4">
              {/* Vehículo seleccionado */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{data.selectedVehicle?.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{data.selectedVehicle?.name}</p>
                    <p className="text-sm text-gray-600">Hasta {data.selectedVehicle?.capacity}kg</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Vehículo</p>
                  <p className="font-semibold text-gray-900">Seleccionado</p>
                </div>
              </div>

              {/* Detalles del paquete */}
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 mb-2">Paquete</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Tipo:</strong> {data.packageType}</p>
                  <p><strong>Peso:</strong> {data.weight} kg</p>
                  <p><strong>Dimensiones:</strong> {data.dimensions.height} × {data.dimensions.width} × {data.dimensions.length} cm (Alto × Ancho × Profundidad)</p>
                </div>
              </div>

              {/* Opciones especiales */}
              {(data.fragile || data.insuranceRequired || data.urgent) && (
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <p className="font-medium text-gray-900 mb-2">Opciones especiales</p>
                  <div className="flex flex-wrap gap-2">
                    {data.fragile && <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full">Frágil</span>}
                    {data.insuranceRequired && <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">Seguro</span>}
                    {data.urgent && <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">Urgente</span>}
                  </div>
                </div>
              )}

              {/* Costo final */}
              {estimatedCost > 0 && (
                <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Costo total estimado</p>
                      <p className="text-3xl font-bold text-green-600">${estimatedCost}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * El precio final puede variar según la distancia exacta
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Anterior</span>
        </button>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>Confirmar Orden</span>
        </button>
      </div>
    </div>
  );
};

export default Step3AddressAndMap;
