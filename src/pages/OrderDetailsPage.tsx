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

  // Función para obtener el texto del tipo de servicio
  const getServiceTypeText = (serviceType: string) => {
    switch (serviceType) {
      case 'ftl': return 'Carga Completa (FTL)';
      case 'ltl': return 'Carga Parcial (LTL)';
      case 'last-mile': return 'Última Milla / Entregas Urbanas';
      default: return serviceType || 'No especificado';
    }
  };

  // Función para obtener el texto del tipo de vehículo
  const getVehicleTypeText = (vehicleType: string) => {
    switch (vehicleType) {
      case 'motocicleta': return 'Motocicleta';
      case 'small-van': return 'Small Van 1 ton';
      case 'large-van': return 'Large Van 1.5 ton';
      case 'truck': return 'Camión 3.5 ton';
      case 'refrigerado': return 'Refrigerado';
      default: return vehicleType || 'No especificado';
    }
  };

  // Función para obtener el texto de la prioridad
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'economico': return 'Económico';
      case 'estandar': return 'Estándar';
      case 'urgente': return 'Urgente';
      default: return priority || 'No especificado';
    }
  };

  // Función para obtener el color de la prioridad
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'economico': return 'bg-green-100 text-green-800';
      case 'estandar': return 'bg-blue-100 text-blue-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
            {/* Información del servicio */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Información del Servicio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Servicio</label>
                  <p className="text-gray-900 font-medium">
                    {getServiceTypeText(order.package_data?.service_type)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vehículo Asignado</label>
                  <p className="text-gray-900 font-medium">
                    {getVehicleTypeText(order.package_data?.vehicle_type)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Prioridad</label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.package_data?.priority)}`}>
                    {getPriorityText(order.package_data?.priority)}
                  </span>
                </div>
              </div>
            </div>

            {/* Detalles del vehículo */}
            {order.package_data?.vehicle_data && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Detalles del Vehículo
                </h2>
                <div className="flex items-start space-x-4">
                  {order.package_data.vehicle_data.image && (
                    <img
                      src={order.package_data.vehicle_data.image}
                      alt={order.package_data.vehicle_data.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-sm"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {order.package_data.vehicle_data.name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {order.package_data.vehicle_data.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="font-medium">Capacidad:</span>
                      <span className="ml-2">{order.package_data.vehicle_data.capacity}</span>
                    </div>
                    {order.package_data.vehicle_data.features && (
                      <div className="flex flex-wrap gap-2">
                        {order.package_data.vehicle_data.features.map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Detalles de prioridad */}
            {order.package_data?.priority_data && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Detalles de Prioridad
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {order.package_data.priority_data.name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {order.package_data.priority_data.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium">Tiempo estimado:</span>
                      <span className="ml-2">{order.package_data.priority_data.timeFrame}</span>
                    </div>
                  </div>
                  <div>
                    {order.package_data.priority_data.features && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-2 block">Características</label>
                        <div className="flex flex-wrap gap-2">
                          {order.package_data.priority_data.features.map((feature: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}


            {/* Direcciones */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Direcciones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    Recogida
                  </h3>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-gray-900 font-medium">
                      {order.pickup_address?.full || 
                       `${order.pickup_address?.street || ''} ${order.pickup_address?.number || ''}, ${order.pickup_address?.neighborhood || ''}`.trim() ||
                       'No especificada'}
                    </p>
                    {order.pickup_address?.city && order.pickup_address?.state && (
                      <p className="text-gray-600 text-sm mt-1">
                        {order.pickup_address.city}, {order.pickup_address.state}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                    </div>
                    Entrega
                  </h3>
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-gray-900 font-medium">
                      {order.delivery_address?.full || 
                       `${order.delivery_address?.street || ''} ${order.delivery_address?.number || ''}, ${order.delivery_address?.neighborhood || ''}`.trim() ||
                       'No especificada'}
                    </p>
                    {order.delivery_address?.city && order.delivery_address?.state && (
                      <p className="text-gray-600 text-sm mt-1">
                        {order.delivery_address.city}, {order.delivery_address.state}
                      </p>
                    )}
                  </div>
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
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    Remitente
                  </h3>
                  <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                    <p className="text-gray-900 font-medium">
                      {order.pickup_contact?.name || 'No especificado'}
                    </p>
                    {order.pickup_contact?.phone && (
                      <p className="text-gray-600 text-sm flex items-center">
                        <Phone className="w-3 h-3 mr-2" />
                        {order.pickup_contact.phone}
                      </p>
                    )}
                    {order.pickup_contact?.email && (
                      <p className="text-gray-600 text-sm flex items-center">
                        <Mail className="w-3 h-3 mr-2" />
                        {order.pickup_contact.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    Destinatario
                  </h3>
                  <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                    <p className="text-gray-900 font-medium">
                      {order.delivery_contact?.name || 'No especificado'}
                    </p>
                    {order.delivery_contact?.phone && (
                      <p className="text-gray-600 text-sm flex items-center">
                        <Phone className="w-3 h-3 mr-2" />
                        {order.delivery_contact.phone}
                      </p>
                    )}
                    {order.delivery_contact?.email && (
                      <p className="text-gray-600 text-sm flex items-center">
                        <Mail className="w-3 h-3 mr-2" />
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

            {/* Resumen del servicio */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Resumen del Servicio</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Servicio</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getServiceTypeText(order.package_data?.service_type)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Vehículo</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getVehicleTypeText(order.package_data?.vehicle_type)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Prioridad</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.package_data?.priority)}`}>
                    {getPriorityText(order.package_data?.priority)}
                  </span>
                </div>
                {order.package_data?.priority_data?.timeFrame && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Tiempo estimado</span>
                    <span className="text-sm font-medium text-gray-900">
                      {order.package_data.priority_data.timeFrame}
                    </span>
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
                  <p className="text-gray-900 font-mono text-sm">{order.tracking_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Creada el</label>
                  <p className="text-gray-900 text-sm">
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
