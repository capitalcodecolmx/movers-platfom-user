// =====================================================
// PÁGINA DE DETALLES DE ORDEN
// =====================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, User, Phone, Mail, Calendar, Clock, CheckCircle, AlertCircle, Clock as ClockIcon } from 'lucide-react';
import { useOrders, type Order } from '../hooks/useOrders';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrder, isLoading } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      const orderData = await getOrder(id!);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'picked_up': return 'bg-orange-100 text-orange-800';
      case 'in_transit': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'assigned': return 'Asignado';
      case 'picked_up': return 'Recogido';
      case 'in_transit': return 'En Tránsito';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      case 'failed': return 'Fallido';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la orden...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Orden no encontrada</h2>
          <p className="text-gray-600 mb-4">La orden que buscas no existe o no tienes permisos para verla.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/orders')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Detalles de la Orden</h1>
                <p className="text-gray-600 mt-1">
                  Código de seguimiento: <span className="font-mono font-semibold">{order.tracking_code}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2">{getStatusText(order.status)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalles del paquete */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Detalles del Paquete
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-gray-900">{order.package_data?.type || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Peso</label>
                  <p className="text-gray-900">{order.package_data?.weight || 0} kg</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dimensiones</label>
                  <p className="text-gray-900">
                    {order.package_data?.dimensions?.height || 0} × {order.package_data?.dimensions?.width || 0} × {order.package_data?.dimensions?.length || 0} cm
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Descripción</label>
                  <p className="text-gray-900">{order.package_data?.description || 'No especificada'}</p>
                </div>
                {order.package_data?.special_instructions && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Instrucciones especiales</label>
                    <p className="text-gray-900">{order.package_data.special_instructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Direcciones */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Direcciones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recogida</h3>
                  <p className="text-gray-600 text-sm">
                    {order.pickup_address?.full || 'No especificada'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Entrega</h3>
                  <p className="text-gray-600 text-sm">
                    {order.delivery_address?.full || 'No especificada'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contactos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contactos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Remitente</h3>
                  <div className="space-y-1">
                    <p className="text-gray-900">{order.pickup_contact?.name || 'No especificado'}</p>
                    {order.pickup_contact?.phone && (
                      <p className="text-gray-600 text-sm flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {order.pickup_contact.phone}
                      </p>
                    )}
                    {order.pickup_contact?.email && (
                      <p className="text-gray-600 text-sm flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {order.pickup_contact.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Destinatario</h3>
                  <div className="space-y-1">
                    <p className="text-gray-900">{order.delivery_contact?.name || 'No especificado'}</p>
                    {order.delivery_contact?.phone && (
                      <p className="text-gray-600 text-sm flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {order.delivery_contact.phone}
                      </p>
                    )}
                    {order.delivery_contact?.email && (
                      <p className="text-gray-600 text-sm flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {order.delivery_contact.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Fechas y horarios */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Fechas y Horarios
              </h3>
              <div className="space-y-3">
                {order.pickup_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Recogida</label>
                    <p className="text-gray-900">
                      {new Date(order.pickup_date).toLocaleDateString('es-ES')}
                      {order.pickup_time && ` a las ${order.pickup_time}`}
                    </p>
                  </div>
                )}
                {order.delivery_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Entrega</label>
                    <p className="text-gray-900">
                      {new Date(order.delivery_date).toLocaleDateString('es-ES')}
                      {order.delivery_time && ` a las ${order.delivery_time}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Información de la orden */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Información de la Orden</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Código de seguimiento</label>
                  <p className="text-gray-900 font-mono">{order.tracking_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Creada el</label>
                  <p className="text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {order.estimated_cost && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Costo estimado</label>
                    <p className="text-gray-900 font-semibold">${order.estimated_cost}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
