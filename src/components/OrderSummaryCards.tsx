// =====================================================
// CARDS DE RESUMEN DE ÓRDENES PARA MÓVIL
// =====================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
import ScrollIndicator from './ScrollIndicator';

interface Order {
  id: string;
  tracking_code: string;
  status: string;
  created_at: string;
  pickup_address?: any;
  delivery_address?: any;
  estimated_cost?: number;
}

interface OrderSummaryCardsProps {
  orders: Order[];
  isLoading?: boolean;
}

const OrderSummaryCards: React.FC<OrderSummaryCardsProps> = ({ orders, isLoading = false }) => {
  const navigate = useNavigate();

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'delivered':
        return {
          icon: CheckCircle,
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          label: 'Entregado',
          description: 'Completado'
        };
      case 'in_transit':
        return {
          icon: Truck,
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-50',
          label: 'En Tránsito',
          description: 'Llegando pronto'
        };
      case 'processing':
      case 'assigned':
        return {
          icon: Package,
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          label: 'Procesando',
          description: 'En preparación'
        };
      case 'picked_up':
        return {
          icon: Truck,
          color: 'bg-purple-500',
          textColor: 'text-purple-700',
          bgColor: 'bg-purple-50',
          label: 'Recogido',
          description: 'En camino'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          label: 'Pendiente',
          description: 'En espera'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Ayer';
    if (diffDays === 0) return 'Hoy';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString();
  };

  const formatAddress = (address: any) => {
    if (!address) return 'Dirección no disponible';
    return address.full || `${address.street}, ${address.city}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Órdenes recientes</h2>
        <ScrollIndicator className="pb-2" showArrows={false}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-80 bg-gray-100 rounded-xl p-4 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          ))}
        </ScrollIndicator>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes órdenes</h3>
        <p className="text-gray-500 text-sm mb-4">Crea tu primera orden para comenzar</p>
        <button 
          onClick={() => navigate('/orders/create')}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          Crear Orden
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Órdenes recientes</h2>
        <button 
          onClick={() => navigate('/orders')}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          Ver todas
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
      
      <ScrollIndicator className="pb-2" showArrows={true}>
        {orders.slice(0, 5).map((order) => {
          const statusInfo = getStatusInfo(order.status);
          return (
            <div
              key={order.id}
              className="flex-shrink-0 w-80 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 mobile-card"
            >
              {/* Header con código de seguimiento y estado */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${statusInfo.color}`}>
                    <statusInfo.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">
                    #{order.tracking_code}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                  {statusInfo.label}
                </span>
              </div>

              {/* Ruta de envío */}
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">
                    {formatAddress(order.pickup_address)} → {formatAddress(order.delivery_address)}
                  </p>
                </div>
              </div>

              {/* Fecha y costo */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{formatDate(order.created_at)}</span>
                </div>
                {order.estimated_cost && (
                  <span className="text-sm font-medium text-gray-900">
                    ${order.estimated_cost.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Descripción del estado */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">{statusInfo.description}</p>
              </div>
            </div>
          );
        })}
      </ScrollIndicator>
    </div>
  );
};

export default OrderSummaryCards;
