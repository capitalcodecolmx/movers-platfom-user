// =====================================================
// CHECKOUT PAGE - ECOMMERCE ORDER CREATION
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Phone, Calendar, Clock } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useOrders } from '../hooks/useOrders';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotal, clearCart } = useCartStore();
  const { createEcommerceOrder } = useOrders();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Delivery address fields
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryNumber, setDeliveryNumber] = useState('');
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [deliveryPostalCode, setDeliveryPostalCode] = useState('');

  // Contact information
  const [contactName, setContactName] = useState(user?.user_metadata?.full_name || '');
  const [contactPhone, setContactPhone] = useState(user?.user_metadata?.phone || '');

  // Delivery date and time
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const subtotal = getTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!deliveryStreet.trim()) {
      newErrors.deliveryStreet = 'Calle es requerida';
    }
    if (!deliveryNumber.trim()) {
      newErrors.deliveryNumber = 'Número es requerido';
    }
    if (!deliveryCity.trim()) {
      newErrors.deliveryCity = 'Ciudad es requerida';
    }
    if (!deliveryState.trim()) {
      newErrors.deliveryState = 'Estado es requerido';
    }
    if (!contactName.trim()) {
      newErrors.contactName = 'Nombre de contacto es requerido';
    }
    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'Teléfono de contacto es requerido';
    }
    if (!deliveryDate) {
      newErrors.deliveryDate = 'Fecha de entrega es requerida';
    }
    if (!deliveryTime) {
      newErrors.deliveryTime = 'Hora de entrega es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildFullAddress = () => {
    const parts = [
      deliveryStreet,
      deliveryNumber,
      deliveryNeighborhood,
      deliveryCity,
      deliveryState,
      deliveryPostalCode
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const deliveryAddress = {
        street: deliveryStreet,
        number: deliveryNumber,
        neighborhood: deliveryNeighborhood,
        city: deliveryCity,
        state: deliveryState,
        postalCode: deliveryPostalCode,
        full: buildFullAddress()
      };

      const deliveryContact = {
        name: contactName,
        phone: contactPhone
      };

      // Create ecommerce order with order_items
      const newOrder = await createEcommerceOrder({
        items,
        deliveryAddress,
        deliveryContact,
        deliveryDate,
        deliveryTime,
        total
      });

      // Clear cart
      clearCart();

      // Redirect to orders page
      navigate('/orders', { 
        state: { 
          message: `¡Orden creada exitosamente! Código de seguimiento: ${newOrder.tracking_code}` 
        } 
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Error al crear la orden: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <MapPin size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8">Agrega productos al carrito para continuar.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-700 transition-colors"
          >
            Ver Productos
          </button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver al carrito
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-8 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Dirección de Entrega</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calle *
                    </label>
                    <input
                      type="text"
                      value={deliveryStreet}
                      onChange={(e) => setDeliveryStreet(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.deliveryStreet ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Calle"
                    />
                    {errors.deliveryStreet && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryStreet}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={deliveryNumber}
                      onChange={(e) => setDeliveryNumber(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.deliveryNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Número"
                    />
                    {errors.deliveryNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Colonia
                    </label>
                    <input
                      type="text"
                      value={deliveryNeighborhood}
                      onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Colonia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.deliveryCity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ciudad"
                    />
                    {errors.deliveryCity && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryCity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <input
                      type="text"
                      value={deliveryState}
                      onChange={(e) => setDeliveryState(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.deliveryState ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Estado"
                    />
                    {errors.deliveryState && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryState}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      value={deliveryPostalCode}
                      onChange={(e) => setDeliveryPostalCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Código Postal"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <User className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Información de Contacto</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.contactName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nombre completo"
                    />
                    {errors.contactName && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Teléfono"
                    />
                    {errors.contactPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Date & Time */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Fecha y Hora de Entrega</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Entrega *
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.deliveryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.deliveryDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Entrega *
                    </label>
                    <input
                      type="time"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.deliveryTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.deliveryTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryTime}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        <p className="text-sm font-semibold text-cyan-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>

                <p className="mt-4 text-xs text-center text-gray-400">
                  Transacciones seguras y encriptadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CheckoutPage;





