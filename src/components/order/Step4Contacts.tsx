// =====================================================
// PASO 4: CONFIRMACIÓN Y PAGO
// =====================================================

import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, CreditCard, DollarSign, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency } from '../../utils/format';

interface Step4PaymentSummaryProps {
  onPrev: () => void;
  onSuccess: () => void;
}

const Step4PaymentSummary: React.FC<Step4PaymentSummaryProps> = ({
  onPrev,
  onSuccess,
}) => {
  const {
    orderItems,
    serviceType,
    pickupLocation,
    deliveryAddress,
    deliveryContact,
    pickupContact,
    setContactInfo,
    paymentMethod,
    setPaymentMethod,
    getTotalPrice,
  } = useOrderStore();

  const { createOrder } = useOrders();

  // Determine which contact info to use based on service type
  // Default to deliveryContact if serviceType is not set (should handle edge case)
  const currentContact = serviceType === 'pickup' ? pickupContact : deliveryContact;

  const [name, setName] = useState(currentContact?.name || '');
  const [phone, setPhone] = useState(currentContact?.phone || '');
  const [email, setEmail] = useState(currentContact?.email || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = getTotalPrice();
  const shippingCost = 0;
  const finalTotal = totalAmount + shippingCost;

  // Sync local state with store when component mounts or serviceType changes
  useEffect(() => {
    const contact = serviceType === 'pickup' ? pickupContact : deliveryContact;
    if (contact) {
      setName(contact.name || '');
      setPhone(contact.phone || '');
      setEmail(contact.email || '');
    }
  }, [serviceType, pickupContact, deliveryContact]);

  const handleContactChange = (field: 'name' | 'phone' | 'email', value: string) => {
    // Update local state
    if (field === 'name') setName(value);
    if (field === 'phone') setPhone(value);
    if (field === 'email') setEmail(value);

    // Update store immediately (or could do on blur/submit)
    // We need to pass the full object to setContactInfo
    const updatedInfo = {
      name: field === 'name' ? value : name,
      phone: field === 'phone' ? value : phone,
      email: field === 'email' ? value : email
    };

    // Safety check for service type
    const contactType = serviceType === 'pickup' ? 'pickup' : 'delivery';
    setContactInfo(contactType, updatedInfo);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError('Por favor completa la información de contacto.');
      return;
    }
    if (!paymentMethod) {
      setError('Por favor selecciona un método de pago.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Final update to store to be sure
      const contactType = serviceType === 'pickup' ? 'pickup' : 'delivery';
      const finalContactInfo = { name, phone, email };
      setContactInfo(contactType, finalContactInfo);

      const orderData = {
        serviceType,
        orderItems,
        pickupLocation: serviceType === 'pickup' ? pickupLocation : null,
        deliveryAddress: serviceType === 'delivery' ? deliveryAddress : null,
        estimatedCost: finalTotal,
        paymentMethod,
        // Send the specific contact info
        contactInfo: finalContactInfo,
        status: 'pending',
      };

      await createOrder(orderData);

      setIsSubmitting(false);
      onSuccess();

    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'Hubo un error al crear la orden. Inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-3">
            4. Confirmación y Pago
          </h2>
          <p className="text-gray-500 text-lg">
            Revisa los detalles y finaliza tu pedido
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Column: Contact & Payment */}
          <div className="space-y-8">

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-700" />
                Datos de Contacto ({serviceType === 'pickup' ? 'Recolección' : 'Entrega'})
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500"
                      placeholder="Tu teléfono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico (Opcional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500"
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-700" />
                Método de Pago
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'cash'
                      ? 'border-gray-800 bg-white shadow-md'
                      : 'border-white bg-white hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Efectivo</p>
                      <p className="text-sm text-gray-500">Paga al recibir o recoger</p>
                    </div>
                  </div>
                  {paymentMethod === 'cash' && <CheckCircle className="w-6 h-6 text-gray-800" />}
                </button>

                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'online'
                      ? 'border-gray-800 bg-white shadow-md'
                      : 'border-white bg-white hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Pago en Línea</p>
                      <p className="text-sm text-gray-500">Tarjeta de crédito / débito</p>
                    </div>
                  </div>
                  {paymentMethod === 'online' && <CheckCircle className="w-6 h-6 text-gray-800" />}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-6">
            <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-4">
                Resumen del Pedido
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Tipo de Servicio</span>
                  <span className="text-white capitalize font-medium">
                    {serviceType === 'delivery' ? 'Entrega a Domicilio' : 'Recolección'}
                  </span>
                </div>

                {serviceType === 'delivery' ? (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Destino</span>
                    <span className="text-white text-right max-w-[200px] truncate">
                      {/* Simplified address display */}
                      {typeof deliveryAddress === 'string' ? deliveryAddress.split(',')[0] : 'Dirección'}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Sucursal</span>
                    <span className="text-white text-right">
                      {pickupLocation?.name || 'Agua Centro'}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Productos</p>
                {orderItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-start text-sm">
                    <span className="text-gray-300">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-white font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Envío</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-white pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={onPrev}
                className="flex-1 py-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-[2] py-4 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-70 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando
                  </>
                ) : (
                  'Confirmar Pedido'
                )}
              </button>
            </div>

            <p className="text-xs text-center text-gray-400">
              Al confirmar, aceptas nuestros términos y condiciones de servicio.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Step4PaymentSummary;
