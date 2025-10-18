// =====================================================
// PÁGINA DE ÓRDENES CON TABLA Y DETALLES - ESTILO APPLE
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Eye, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Truck,
  Plus,
  Search,
  Filter,
  MoreVertical,
  X,
  CreditCard
} from 'lucide-react';
import { useOrders, type Order } from '../hooks/useOrders';
import OrderMessagesModal from '../components/OrderMessagesModal';
import PaymentModal from '../components/PaymentModal';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, isLoading, error } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [selectedOrderForMessages, setSelectedOrderForMessages] = useState<Order | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (openMenuId && !target.closest('[data-menu-container]')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'picked_up': return 'bg-indigo-100 text-indigo-800';
      case 'in_transit': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'assigned': return 'Asignado';
      case 'picked_up': return 'Recogido';
      case 'in_transit': return 'En tránsito';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Función para obtener el texto del tipo de servicio
  const getServiceTypeText = (serviceType: string) => {
    switch (serviceType) {
      case 'ftl': return 'Carga Completa';
      case 'ltl': return 'Carga Parcial';
      case 'last-mile': return 'Última Milla';
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

  const filteredOrders = orders.filter(order =>
    order.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.pickup_address?.full?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.delivery_address?.full?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.pickup_address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.delivery_address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getServiceTypeText(order.package_data?.service_type).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getVehicleTypeText(order.package_data?.vehicle_type).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getPriorityText(order.package_data?.priority).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal de mensajes
  const openMessagesModal = (order: Order) => {
    setSelectedOrderForMessages(order);
    setMessagesModalOpen(true);
  };

  // Cerrar modal de mensajes
  const closeMessagesModal = () => {
    setMessagesModalOpen(false);
    setSelectedOrderForMessages(null);
  };

  // Abrir modal de pago
  const openPaymentModal = (order: Order) => {
    setSelectedOrderForPayment(order);
    setPaymentModalOpen(true);
  };

  // Cerrar modal de pago
  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedOrderForPayment(null);
  };

  // Verificar si una orden puede ser pagada
  const canPayOrder = (order: Order) => {
    return (order.status === 'quote_ready' || order.status === 'payment_pending') && 
           order.estimated_cost && 
           order.estimated_cost > 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar órdenes</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Órdenes</h1>
              <p className="text-gray-600 mt-1">
                Gestiona y revisa todos tus envíos ({orders.length} órdenes)
              </p>
            </div>
            <button
              onClick={() => navigate('/orders/create')}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center sm:justify-start"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Orden
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-200px)]">
        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Buscar por código, servicio, vehículo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <button className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-gray-600" />
              <span className="hidden sm:inline text-sm">Filtros</span>
            </button>
          </div>
        </div>

        {/* Vista móvil - Cards mejoradas */}
        <div className="block lg:hidden space-y-4 flex-1 overflow-y-auto">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay órdenes</h3>
              <p className="text-gray-500 text-center mb-6">
                {searchTerm ? 'No se encontraron órdenes con ese criterio de búsqueda.' : 'Aún no tienes órdenes creadas.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/orders/create')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Crear primera orden
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              {/* Header de la card - Más limpio */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{order.tracking_code}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-500' :
                    order.status === 'in_transit' ? 'bg-blue-500' :
                    order.status === 'quote_ready' ? 'bg-orange-500' :
                    'bg-gray-400'
                  }`}></div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Información principal - Mejor jerarquía */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Servicio</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {getServiceTypeText(order.package_data?.service_type)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Vehículo</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {getVehicleTypeText(order.package_data?.vehicle_type)}
                  </div>
                </div>
              </div>

              {/* Prioridad y Costo - Más prominentes */}
              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.package_data?.priority)}`}>
                  {getPriorityText(order.package_data?.priority)}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {order.estimated_cost ? `$${order.estimated_cost.toFixed(2)}` : '--'}
                  </div>
                  {canPayOrder(order) && (
                    <div className="text-xs text-orange-600 font-medium">Pendiente de pago</div>
                  )}
                </div>
              </div>

              {/* Acciones - Mejoradas */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors font-medium"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    <span className="text-sm">Ver detalles</span>
                  </button>
                  <button
                    onClick={() => openMessagesModal(order)}
                    className="flex items-center px-4 py-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors font-medium"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span className="text-sm">Chat</span>
                  </button>
                </div>
                
                {canPayOrder(order) && (
                  <button
                    onClick={() => openPaymentModal(order)}
                    className="flex items-center px-6 py-3 bg-orange-600 text-white hover:bg-orange-700 rounded-xl transition-colors font-semibold shadow-sm"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span className="text-sm">Pagar</span>
                  </button>
                )}
                {order.status === 'pending' && (
                  <div className="relative" data-menu-container>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === order.id ? null : order.id);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenuId === order.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            if (confirm('¿Estás seguro de que quieres cancelar esta orden?')) {
                              console.log('Cancelar orden:', order.id);
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => {
                            setOpenMenuId(null);
                            if (confirm('¿Estás seguro de que quieres eliminar esta orden? Esta acción no se puede deshacer.')) {
                              console.log('Eliminar orden:', order.id);
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            ))
          )}
        </div>

        {/* Vista desktop - Tabla mejorada */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
          <div className="overflow-x-auto h-full overflow-y-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Orden</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Servicio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Costo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay órdenes</h3>
                        <p className="text-gray-500 mb-6">
                          {searchTerm ? 'No se encontraron órdenes con ese criterio de búsqueda.' : 'Aún no tienes órdenes creadas.'}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() => navigate('/orders/create')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                          >
                            Crear primera orden
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    {/* Columna Orden - Más compacta */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{order.tracking_code}</div>
                          <div className="text-xs text-gray-500">
                            {getVehicleTypeText(order.package_data?.vehicle_type)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Columna Servicio - Más limpia */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {getServiceTypeText(order.package_data?.service_type)}
                        </div>
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.package_data?.priority)}`}>
                          {getPriorityText(order.package_data?.priority)}
                        </div>
                      </div>
                    </td>
                    
                    {/* Columna Estado - Mejorada */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-500' :
                          order.status === 'in_transit' ? 'bg-blue-500' :
                          order.status === 'quote_ready' ? 'bg-orange-500' :
                          'bg-gray-400'
                        }`}></div>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </td>
                    
                    {/* Columna Costo - Más prominente */}
                    <td className="px-4 py-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {order.estimated_cost ? `$${order.estimated_cost.toFixed(2)}` : '--'}
                        </div>
                        {canPayOrder(order) && (
                          <div className="text-xs text-orange-600 font-medium">Pendiente de pago</div>
                        )}
                      </div>
                    </td>
                    
                    {/* Columna Fecha - Más compacta */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit'
                        })}
                      </div>
                    </td>
                    
                    {/* Columna Acciones - Simplificada */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group-hover:text-blue-500"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openMessagesModal(order)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors group-hover:text-green-500"
                          title="Mensajes"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {canPayOrder(order) && (
                          <button
                            onClick={() => openPaymentModal(order)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors group-hover:text-orange-500"
                            title="Pagar"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                        )}
                        <div className="relative" data-menu-container>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === order.id ? null : order.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group-hover:text-gray-500"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === order.id && order.status === 'pending' && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  if (confirm('¿Estás seguro de que quieres cancelar esta orden?')) {
                                    console.log('Cancelar orden:', order.id);
                                  }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  if (confirm('¿Estás seguro de que quieres eliminar esta orden? Esta acción no se puede deshacer.')) {
                                    console.log('Eliminar orden:', order.id);
                                  }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de detalles */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Detalles de la Orden
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código de seguimiento
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedOrder.tracking_code}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                </div>

                {/* Información del servicio */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Servicio
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {getServiceTypeText(selectedOrder.package_data?.service_type)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Vehículo
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {getVehicleTypeText(selectedOrder.package_data?.vehicle_type)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridad
                    </label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedOrder.package_data?.priority)}`}>
                      {getPriorityText(selectedOrder.package_data?.priority)}
                    </span>
                  </div>
                </div>

                {/* Ruta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ruta de envío
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-green-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Origen</p>
                        <p className="text-gray-600">
                          {selectedOrder.pickup_address?.full || 
                           `${selectedOrder.pickup_address?.street} ${selectedOrder.pickup_address?.number}, ${selectedOrder.pickup_address?.city}, ${selectedOrder.pickup_address?.state}` ||
                           'Dirección no disponible'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-red-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Destino</p>
                        <p className="text-gray-600">
                          {selectedOrder.delivery_address?.full || 
                           `${selectedOrder.delivery_address?.street} ${selectedOrder.delivery_address?.number}, ${selectedOrder.delivery_address?.city}, ${selectedOrder.delivery_address?.state}` ||
                           'Dirección no disponible'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del paquete */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del paquete
                  </label>
                  <p className="text-gray-900">{selectedOrder.package_data?.description || 'No disponible'}</p>
                </div>

                {/* Costo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo estimado
                  </label>
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedOrder.estimated_cost?.toFixed(2) || '0.00'}
                  </p>
                </div>

                {/* Fecha de creación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de creación
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedOrder.created_at).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    navigate(`/tracking/${selectedOrder.tracking_code}`);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Ver seguimiento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de mensajes */}
        {selectedOrderForMessages && (
          <OrderMessagesModal
            isOpen={messagesModalOpen}
            onClose={closeMessagesModal}
            orderId={selectedOrderForMessages.id}
            orderTrackingCode={selectedOrderForMessages.tracking_code}
          />
        )}

        {/* Modal de pago */}
        {selectedOrderForPayment && (
          <PaymentModal
            isOpen={paymentModalOpen}
            onClose={closePaymentModal}
            orderId={selectedOrderForPayment.id}
            trackingCode={selectedOrderForPayment.tracking_code}
            amount={selectedOrderForPayment.estimated_cost || selectedOrderForPayment.final_cost || 0}
            onPaymentSuccess={(paymentData) => {
              console.log('Payment successful:', paymentData);
              closePaymentModal();
              alert(`¡Pago procesado exitosamente!\n\nCódigo de seguimiento: ${selectedOrderForPayment.tracking_code}\nTu orden está siendo preparada.`);
              // Recargar la página para actualizar el estado
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
