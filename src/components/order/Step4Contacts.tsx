// =====================================================
// PASO 4: CONTACTOS - QUIEN ENTREGA Y QUIEN RECIBE
// =====================================================

import React, { useState } from 'react';
import { User, Phone, Mail, Calendar, Clock, ArrowLeft, Check } from 'lucide-react';

interface Step4ContactsProps {
  data: any;
  onUpdate: (data: any) => void;
  onSubmit: () => void;
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
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onUpdate({
        senderInfo,
        recipientInfo,
        pickupDate,
        pickupTime,
        // No enviamos deliveryDate ni deliveryTime - los asigna el equipo
      });
      onSubmit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            Contactos
          </h2>
          <p className="text-gray-500 text-lg">
            Información de quien entrega y quien recibe
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información del remitente */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </span>
                Quien Entrega
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={senderInfo.name}
                    onChange={(e) => setSenderInfo({ ...senderInfo, name: e.target.value })}
                    placeholder="Nombre completo del remitente"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.senderName && (
                    <p className="text-red-500 text-sm mt-1">{errors.senderName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={senderInfo.phone}
                    onChange={(e) => setSenderInfo({ ...senderInfo, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.senderPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.senderPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={senderInfo.email}
                    onChange={(e) => setSenderInfo({ ...senderInfo, email: e.target.value })}
                    placeholder="remitente@ejemplo.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información del destinatario */}
          <div className="space-y-6">
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </span>
                Quien Recibe
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={recipientInfo.name}
                    onChange={(e) => setRecipientInfo({ ...recipientInfo, name: e.target.value })}
                    placeholder="Nombre completo del destinatario"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={recipientInfo.phone}
                    onChange={(e) => setRecipientInfo({ ...recipientInfo, phone: e.target.value })}
                    placeholder="+52 55 1234 5678"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.recipientPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.recipientPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={recipientInfo.email}
                    onChange={(e) => setRecipientInfo({ ...recipientInfo, email: e.target.value })}
                    placeholder="destinatario@ejemplo.com"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fechas y horarios */}
        <div className="mt-8">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </span>
              Fechas y Horarios
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Recogida
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha *
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
                      Hora *
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
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Entrega
                </h4>
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <p className="text-gray-600 text-sm">
                    La fecha y hora de entrega será asignada por nuestro equipo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen final */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Resumen de tu Orden
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Paquete</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Tipo:</strong> {data.packageType || 'No especificado'}</p>
                <p><strong>Peso:</strong> {data.weight || 0} kg</p>
                <p><strong>Dimensiones:</strong> {data.dimensions?.height || 0}×{data.dimensions?.width || 0}×{data.dimensions?.length || 0}cm</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Envío</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Vehículo:</strong> {data.selectedVehicle?.name || 'No seleccionado'}</p>
                <p><strong>Recogida:</strong> {data.pickupAddress?.full || 'No especificada'}</p>
                <p><strong>Entrega:</strong> {data.deliveryAddress?.full || 'No especificada'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
        >
          ← Anterior
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-full font-medium transition-colors text-sm flex items-center space-x-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
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
  );
};

export default Step4Contacts;

