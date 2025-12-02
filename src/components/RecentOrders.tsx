// =====================================================
// COMPONENTE DE ÓRDENES RECIENTES - ESTILO APPLE
// =====================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, CheckCircle, AlertCircle, Truck, Clock } from 'lucide-react';

interface RecentOrdersProps {
  orders: any[];
  isLoading?: boolean;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders, isLoading = false }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'in_transit':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'picked_up':
        return <Package className="w-4 h-4 text-indigo-600" />;
      case 'assigned':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-emerald-600 bg-emerald-50';
      case 'in_transit': return 'text-blue-600 bg-blue-50';
      case 'picked_up': return 'text-indigo-600 bg-indigo-50';
      case 'assigned': return 'text-purple-600 bg-purple-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatAddress = (address: any) => {
    if (!address) return 'No especificada';
    if (typeof address === 'string') return address;
    return address.full || `${address.street || ''} ${address.number || ''}`.trim() || 'No especificada';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-cyan-100">
        <div className="p-6 border-b border-cyan-100">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Órdenes recientes</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gradient-to-r from-cyan-100 to-blue-100 rounded w-24"></div>
                      <div className="h-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-cyan-100 to-blue-100 rounded w-16"></div>
                    <div className="h-3 bg-gradient-to-r from-cyan-100 to-blue-100 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-cyan-100">
        <div className="p-6 border-b border-cyan-100">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Órdenes recientes</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes órdenes aún</h3>
            <p className="text-gray-600 mb-6">Crea tu primera orden para comenzar a enviar paquetes</p>
            <button
              onClick={() => navigate('/orders/create')}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Crear primera orden
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-cyan-100">
      <div className="p-6 border-b border-cyan-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Órdenes recientes</h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors text-sm"
          >
            Ver todas
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 rounded-xl hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 cursor-pointer group border border-cyan-100/50 hover:border-cyan-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow border border-cyan-100">
                  {getStatusIcon(order.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    #{order.tracking_code}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3 text-cyan-600 flex-shrink-0" />
                    <span className="truncate">
                      {formatAddress(order.pickup_address)} → {formatAddress(order.delivery_address)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <p className="text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mt-1">
                  ${(order.final_cost || order.estimated_cost || 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
