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
  X
} from 'lucide-react';
import { useOrders, type Order } from '../hooks/useOrders';
import OrderMessagesModal from '../components/OrderMessagesModal';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, isLoading, error } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);
  const [selectedOrderForMessages, setSelectedOrderForMessages] = useState<Order | null>(null);

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

  const filteredOrders = orders.filter(order =>
    order.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.pickup_address?.full?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.delivery_address?.full?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Órdenes</h1>
              <p className="text-gray-600 mt-1">
                Gestiona y revisa todos tus envíos ({orders.length} órdenes)
              </p>
            </div>
            <button
              onClick={() => navigate('/orders/create')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Orden
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-200px)]">
        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por código, origen o destino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Filter className="w-5 h-5 mr-2 text-gray-600" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
        </div>

        {/* Tabla de órdenes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
          <div className="overflow-x-auto h-full overflow-y-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Código</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Costo</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="font-medium text-gray-900">{order.tracking_code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.estimated_cost ? `$${order.estimated_cost.toFixed(2)}` : 'No calculado'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openMessagesModal(order)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mensajes"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
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
                          {openMenuId === order.id && order.status === 'pending' && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                              <button
                                onClick={() => {
                                  setOpenMenuId(null);
                                  if (confirm('¿Estás seguro de que quieres cancelar esta orden?')) {
                                    // Aquí iría la lógica para cancelar la orden
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
                                    // Aquí iría la lógica para eliminar la orden
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
                ))}
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
                        <p className="text-gray-600">{selectedOrder.pickup_address}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-red-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Destino</p>
                        <p className="text-gray-600">{selectedOrder.delivery_address}</p>
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
      </div>
    </div>
  );
};

export default OrdersPage;
