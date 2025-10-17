// =====================================================
// PASO 4: PRIORIDAD DE ENVÍO
// =====================================================

import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, Zap, ArrowLeft, Check, User, Phone, Mail, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
  MdAccessTime,
  MdAttachMoney,
  MdFlashOn,
  MdCheckCircle,
  MdPerson,
  MdPhone,
  MdEmail,
  MdEvent,
  MdWarning,
  MdInfo
} from 'react-icons/md';
import { pricingService } from '../../services/pricingService';

interface Step4ContactsProps {
  data: any;
  onUpdate: (data: any) => void;
  onSubmit: (step4Data?: any) => void;
  onPrev: () => void;
  isSubmitting?: boolean;
}

const Step4Contacts: React.FC<Step4ContactsProps> = ({
  data,
  onUpdate,
  onSubmit,
  onPrev,
  isSubmitting = false,
}) => {
  const [priorityTypes] = useState([
    {
      id: 'economico',
      name: 'Económico',
      description: 'Tarifas más bajas; la recolección puede ajustarse según disponibilidad.',
      icon: MdAccessTime,
      priceMultiplier: 0.85 // -15%
    },
    {
      id: 'estandar',
      name: 'Estándar',
      description: 'Mejor equilibrio entre costo y rapidez.',
      icon: MdAttachMoney,
      priceMultiplier: 1.0, // Precio base
      recommended: true
    },
    {
      id: 'urgente',
      name: 'Urgente',
      description: 'Para entregas el mismo día o con prioridad en asignación de unidad.',
      icon: MdFlashOn,
      priceMultiplier: 1.15 // +15%
    }
  ]);

  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [senderInfo, setSenderInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [recipientInfo, setRecipientInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estados para cotización automática
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const [pricingResult, setPricingResult] = useState<any>(null);
  const [isRouteAvailable, setIsRouteAvailable] = useState<boolean | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);

  // Función para calcular precio automático
  const calculateAutomaticPrice = async (priority: string) => {
    console.log('🚀 calculateAutomaticPrice llamado con:', {
      priority,
      pickupAddress: data.pickupAddress,
      deliveryAddress: data.deliveryAddress,
      selectedVehicleType: data.selectedVehicleType
    });

    if (!data.pickupAddress || !data.deliveryAddress || !data.selectedVehicleType) {
      console.log('❌ Datos incompletos:', {
        pickupAddress: !!data.pickupAddress,
        deliveryAddress: !!data.deliveryAddress,
        selectedVehicleType: !!data.selectedVehicleType
      });
      return;
    }

    setIsCalculatingPrice(true);
    
    try {
      console.log('💰 Llamando a pricingService.calculatePrice con:', {
        pickupCity: data.pickupAddress.city,
        pickupState: data.pickupAddress.state,
        deliveryCity: data.deliveryAddress.city,
        deliveryState: data.deliveryAddress.state,
        vehicleType: data.selectedVehicleType.name,
        priority
      });

      const result = await pricingService.calculatePrice(
        data.pickupAddress.city,
        data.pickupAddress.state,
        data.deliveryAddress.city,
        data.deliveryAddress.state,
        data.selectedVehicleType.name,
        priority as 'economico' | 'estandar' | 'urgente'
      );

      console.log('📊 Resultado del cálculo:', result);

      setPricingResult(result);
      setIsRouteAvailable(result.found);
      
      if (result.found && result.finalPrice !== undefined) {
        console.log('✅ Precio calculado exitosamente:', result.finalPrice);
        setEstimatedCost(result.finalPrice);
      } else {
        console.log('⚠️ No se pudo calcular precio:', result.error || 'Sin error específico');
        setEstimatedCost(null);
      }
    } catch (error) {
      console.error('❌ Error calculating price:', error);
      setPricingResult(null);
      setIsRouteAvailable(false);
      setEstimatedCost(null);
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  // Verificar disponibilidad de ruta cuando se cargan los datos
  useEffect(() => {
    const checkRouteAvailability = async () => {
      if (data.pickupAddress && data.deliveryAddress) {
        const available = await pricingService.isRouteAvailable(
          data.pickupAddress.city,
          data.pickupAddress.state,
          data.deliveryAddress.city,
          data.deliveryAddress.state
        );
        setIsRouteAvailable(available);
      }
    };

    checkRouteAvailability();
  }, [data.pickupAddress, data.deliveryAddress]);

  const validateStep = () => {
    console.log('Step4 - validateStep called');
    console.log('Step4 - Validation data:', {
      selectedPriority,
      senderInfo,
      recipientInfo,
      pickupDate,
      pickupTime
    });
    
    const newErrors: Record<string, string> = {};

    if (!selectedPriority) {
      newErrors.priority = 'Selecciona una prioridad de envío';
    }

    if (!senderInfo.name.trim()) {
      newErrors.senderName = 'Nombre del remitente es requerido';
    }

    if (!senderInfo.phone.trim()) {
      newErrors.senderPhone = 'Teléfono del remitente es requerido';
    }

    if (!recipientInfo.name.trim()) {
      newErrors.recipientName = 'Nombre del destinatario es requerido';
    }

    if (!recipientInfo.phone.trim()) {
      newErrors.recipientPhone = 'Teléfono del destinatario es requerido';
    }

    if (!pickupDate) {
      newErrors.pickupDate = 'Fecha de recogida es requerida';
    }

    if (!pickupTime) {
      newErrors.pickupTime = 'Hora de recogida es requerida';
    }

    console.log('Step4 - Validation errors:', newErrors);
    console.log('Step4 - Validation passed:', Object.keys(newErrors).length === 0);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrioritySelect = (priorityId: string) => {
    setSelectedPriority(priorityId);
    // Calcular precio automático cuando se selecciona prioridad
    if (isRouteAvailable) {
      calculateAutomaticPrice(priorityId);
    }
  };

  const handleSubmit = () => {
    console.log('Step4 - handleSubmit called');
    console.log('Step4 - selectedPriority:', selectedPriority);
    console.log('Step4 - senderInfo:', senderInfo);
    console.log('Step4 - recipientInfo:', recipientInfo);
    console.log('Step4 - pickupDate:', pickupDate);
    console.log('Step4 - pickupTime:', pickupTime);
    
    if (validateStep()) {
      const updateData = {
        priority: selectedPriority,
        priorityData: priorityTypes.find(p => p.id === selectedPriority),
        senderInfo,
        recipientInfo,
        pickupDate,
        pickupTime,
        // Información de cotización
        isAutomaticQuote: isRouteAvailable,
        estimatedCost: estimatedCost,
        pricingResult: pricingResult,
        quoteStatus: isRouteAvailable ? 'auto_ready' : 'manual_pending'
      };
      
      console.log('Step4 - Sending data:', updateData);
      
      // Actualizar los datos primero
      onUpdate(updateData);
      
      // Esperar un momento para que se complete la actualización del estado
      // y luego llamar onSubmit con los datos completos
      setTimeout(() => {
        onSubmit(updateData);
      }, 100);
    } else {
      console.log('Step4 - Validation failed');
    }
  };

  const selectedPriorityData = priorityTypes.find(p => p.id === selectedPriority);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            4. Prioridad de envío
          </h2>
          <p className="text-gray-500 text-lg">
            Selecciona la prioridad que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="space-y-8">
          {/* Información del servicio, vehículo y direcciones seleccionadas */}
          {data.serviceType && data.selectedVehicleType && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
                <span>Servicio: {data.serviceType === 'ftl' ? 'Carga Completa' : data.serviceType === 'ltl' ? 'Carga Parcial' : 'Última Milla'}</span>
                <span>•</span>
                <span>Unidad: {data.selectedVehicleType.name}</span>
                <span>•</span>
                <span>Ruta: {data.pickupAddress?.city} → {data.deliveryAddress?.city}</span>
              </div>
            </div>
          )}

          {/* Estado de cotización automática */}
          {isRouteAvailable !== null && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cotización Automática</h3>
                <div className="flex items-center space-x-2">
                  {isRouteAvailable ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Disponible</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-amber-600 font-medium">Cotización Manual</span>
                    </>
                  )}
                </div>
              </div>
              
              {isRouteAvailable ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Esta ruta está disponible para cotización automática. El precio se calculará según el tarifario oficial.
                  </p>
                  {isCalculatingPrice && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      <span>Calculando precio...</span>
                    </div>
                  )}
                  {estimatedCost && selectedPriority && (
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Precio estimado ({priorityTypes.find(p => p.id === selectedPriority)?.name}):</p>
                          <p className="text-2xl font-bold text-gray-900">${estimatedCost.toLocaleString('es-MX')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Distancia: {pricingResult?.distance} km</p>
                          <p className="text-xs text-gray-500">Vehículo: {pricingResult?.vehicleType}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Esta ruta no está disponible en el tarifario automático. Un administrador revisará tu solicitud y te proporcionará una cotización personalizada.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <MdWarning className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Cotización Manual Requerida</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Te contactaremos en las próximas 24 horas con el precio final y detalles del envío.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tipos de prioridad - Estilo Apple con gradientes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {priorityTypes.map((priority) => (
              <button
                key={priority.id}
                onClick={() => handlePrioritySelect(priority.id)}
                className={`relative p-8 rounded-2xl transition-all duration-300 text-left group border-2 ${
                  selectedPriority === priority.id
                    ? 'bg-gray-800 border-gray-800 shadow-lg scale-105'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${priority.recommended ? 'ring-2 ring-gray-300' : ''}`}
              >
                {/* Badge recomendado */}
                {priority.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-800 text-white text-xs px-4 py-2 rounded-full font-medium shadow-lg">
                      Recomendado
                    </span>
                  </div>
                )}

                {/* Icono */}
                <div className={`mb-6 transition-all duration-300 ${
                  selectedPriority === priority.id 
                    ? 'text-white'
                    : 'text-gray-500 group-hover:text-gray-700 group-hover:scale-110'
                }`}>
                  <priority.icon className="w-12 h-12" />
                </div>

                
                {/* Título */}
                <h3 className={`font-semibold text-lg mb-3 transition-colors duration-300 ${
                  selectedPriority === priority.id ? 'text-white' : 'text-gray-900'
                }`}>
                  {priority.name}
                </h3>
                
                {/* Descripción */}
                <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                  selectedPriority === priority.id ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {priority.description}
                </p>

                {/* Indicador de selección */}
                {selectedPriority === priority.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <MdCheckCircle className="w-4 h-4 text-gray-800" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Error message */}
          {errors.priority && (
            <div className="text-center">
              <p className="text-red-500 text-sm">{errors.priority}</p>
            </div>
          )}

          {/* Resumen de la prioridad seleccionada */}
          {selectedPriorityData && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Prioridad seleccionada</h3>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                  <selectedPriorityData.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedPriorityData.name}</p>
                  <p className="text-gray-700 text-sm mt-1">{selectedPriorityData.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario de contactos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información del remitente */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <MdPerson className="w-6 h-6 text-white" />
                </div>
                Quien Entrega
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={senderInfo.name}
                    onChange={(e) => setSenderInfo({ ...senderInfo, name: e.target.value })}
                    placeholder="Nombre completo del remitente"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                  {errors.senderName && (
                    <p className="text-red-500 text-sm mt-1">{errors.senderName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={senderInfo.phone}
                    onChange={(e) => setSenderInfo({ ...senderInfo, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                  {errors.senderPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.senderPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={senderInfo.email}
                    onChange={(e) => setSenderInfo({ ...senderInfo, email: e.target.value })}
                    placeholder="remitente@ejemplo.com"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Información del destinatario */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <MdPerson className="w-6 h-6 text-white" />
                </div>
                Quien Recibe
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={recipientInfo.name}
                    onChange={(e) => setRecipientInfo({ ...recipientInfo, name: e.target.value })}
                    placeholder="Nombre completo del destinatario"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={recipientInfo.phone}
                    onChange={(e) => setRecipientInfo({ ...recipientInfo, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                  {errors.recipientPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={recipientInfo.email}
                    onChange={(e) => setRecipientInfo({ ...recipientInfo, email: e.target.value })}
                    placeholder="destinatario@ejemplo.com"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fechas y horarios */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <MdEvent className="w-6 h-6 text-white" />
              </div>
              Fecha y hora de recogida
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                {errors.pickupDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora *
                </label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                {errors.pickupTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>
                )}
              </div>
            </div>
          </div>
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
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedPriority}
            className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creando...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Crear Orden</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4Contacts;

