// =====================================================
// PASO 4: CONFIRMACIÓN Y PAGO
// =====================================================

import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, CreditCard, DollarSign, CheckCircle, AlertCircle, Loader2, MapPin } from 'lucide-react';
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

  // Determine which contact info to use
  const currentContact = serviceType === 'pickup' ? pickupContact : deliveryContact;

  const [name, setName] = useState(currentContact?.name || '');
  const [phone, setPhone] = useState(currentContact?.phone || '');
  const [email, setEmail] = useState(currentContact?.email || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = getTotalPrice();
  const shippingCost = 0;
  const finalTotal = totalAmount + shippingCost;

  useEffect(() => {
    const contact = serviceType === 'pickup' ? pickupContact : deliveryContact;
    if (contact) {
      setName(contact.name || '');
      setPhone(contact.phone || '');
      setEmail(contact.email || '');
    }
  }, [serviceType, pickupContact, deliveryContact]);

  const handleContactChange = (field: 'name' | 'phone' | 'email', value: string) => {
    if (field === 'name') setName(value);
    if (field === 'phone') setPhone(value);
    if (field === 'email') setEmail(value);

    const updatedInfo = {
      name: field === 'name' ? value : name,
      phone: field === 'phone' ? value : phone,
      email: field === 'email' ? value : email
    };

    const contactType = serviceType === 'pickup' ? 'pickup' : 'delivery';
    setContactInfo(contactType, updatedInfo);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError('Completa tu información de contacto.');
      return;
    }
    if (!paymentMethod) {
      setError('Selecciona un método de pago.');
      return;
    }

    setIsSubmitting(true);

    try {
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
        contactInfo: finalContactInfo,
        status: 'pending',
      };

      await createOrder(orderData);
      setIsSubmitting(false);
      onSuccess();

    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'Error al crear la orden.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Confirmación y Pago
          </h2>
          <p className="text-gray-500 text-lg">
            Revisa tus datos y finaliza el pedido
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-10">

            {/* Contact Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <User className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Datos de Contacto
                </h3>
              </div>

              <div className="space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Nombre</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                      className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Teléfono</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                      placeholder="Tu número celular"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Correo (Opcional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full p-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Payment Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <CreditCard className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Método de Pago
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`group relative p-5 rounded-2xl border text-left transition-all duration-300 ${paymentMethod === 'cash'
                    ? 'border-gray-900 bg-gray-900 text-white ring-4 ring-gray-100'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-900'}`} />
                    {paymentMethod === 'cash' && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                  <p className={`font-bold text-lg mb-1 ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-900'}`}>
                    Efectivo
                  </p>
                  <p className={`text-sm ${paymentMethod === 'cash' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Paga al recibir
                  </p>
                </button>

                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`group relative p-5 rounded-2xl border text-left transition-all duration-300 ${paymentMethod === 'online'
                    ? 'border-gray-900 bg-gray-900 text-white ring-4 ring-gray-100'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <CreditCard className={`w-6 h-6 ${paymentMethod === 'online' ? 'text-white' : 'text-gray-900'}`} />
                    {paymentMethod === 'online' && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                  <p className={`font-bold text-lg mb-1 ${paymentMethod === 'online' ? 'text-white' : 'text-gray-900'}`}>
                    Pago Online
                  </p>
                  <p className={`text-sm ${paymentMethod === 'online' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tarjeta o transferencia
                  </p>
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Resumen de Orden
              </h3>

              <div className="space-y-4 mb-8">
                {/* Location Info */}
                <div className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5">
                    {serviceType === 'delivery' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <MapPin className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {serviceType === 'delivery' ? 'Entrega a Domicilio' : 'Recolección en sucursal'}
                    </p>
                    <p className="text-gray-500 mt-0.5 line-clamp-2">
                      {serviceType === 'delivery'
                        ? (typeof deliveryAddress === 'string' ? deliveryAddress : 'Dirección pendiente')
                        : (pickupLocation?.name || 'Sucursal')
                      }
                    </p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Items List */}
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.productId} className="flex justify-between items-start text-sm">
                      <div className="flex gap-2">
                        <span className="font-bold text-gray-900">{item.quantity}x</span>
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">{shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold tracking-tight text-gray-900">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-6 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm font-medium animate-pulse">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </span>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </button>
                <button
                  onClick={onPrev}
                  className="w-full py-3 text-gray-500 hover:text-gray-900 font-medium transition-colors text-sm"
                >
                  Volver a editar
                </button>
              </div>

              <p className="mt-6 text-xs text-center text-gray-400 max-w-[200px] mx-auto">
                Al confirmar, aceptas nuestros términos y condiciones.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Step4PaymentSummary;
