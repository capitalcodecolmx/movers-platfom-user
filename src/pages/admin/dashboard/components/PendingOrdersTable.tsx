// =====================================================
// TABLA DE ÓRDENES PENDIENTES - DASHBOARD ADMIN
// =====================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Truck, Clock, MapPin, User } from 'lucide-react';
import type { OrderWithDetails } from '../../../../types/database';
import AssignOrderModal from '../../orders/components/AssignOrderModal';

interface PendingOrdersTableProps {
    orders: OrderWithDetails[];
    isLoading: boolean;
    onRefresh: () => void;
}

const PendingOrdersTable: React.FC<PendingOrdersTableProps> = ({
    orders,
    isLoading,
    onRefresh
}) => {
    const navigate = useNavigate();
    const [orderToAssign, setOrderToAssign] = useState<OrderWithDetails | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    // Filter only pending orders
    const pendingOrders = orders.filter(order =>
        ['pending', 'processing', 'quote_pending'].includes(order.status)
    );

    const handleAssignClick = (order: OrderWithDetails) => {
        setOrderToAssign(order);
        setIsAssignModalOpen(true);
    };

    const handleAssignClose = () => {
        setIsAssignModalOpen(false);
        setOrderToAssign(null);
        onRefresh();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pendiente
                    </span>
                );
            case 'processing':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Procesando
                    </span>
                );
            case 'quote_pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Cotización
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {status}
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Órdenes Pendientes</h3>
                </div>
                <div className="p-8 text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-500 mt-2">Cargando órdenes...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Órdenes Pendientes de Asignación
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {pendingOrders.length} órdenes requieren tu atención
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Ver todas →
                    </button>
                </div>

                {pendingOrders.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-gray-600 font-medium">¡Todo al día!</p>
                        <p className="text-gray-400 text-sm mt-1">No hay órdenes pendientes de asignación</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Pedido
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Destino
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingOrders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{order.tracking_code}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString('es-MX', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {(order.user as any)?.full_name || 'Cliente'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(order.user as any)?.email || ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                {order.delivery_address?.city || order.delivery_address?.street || 'Sin destino'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleAssignClick(order)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <Truck className="w-4 h-4 mr-1.5" />
                                                    Asignar
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {pendingOrders.length > 5 && (
                    <div className="p-4 border-t border-gray-100 text-center">
                        <button
                            onClick={() => navigate('/admin/orders?status=pending')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Ver {pendingOrders.length - 5} órdenes más →
                        </button>
                    </div>
                )}
            </div>

            {/* Assign Modal */}
            {orderToAssign && (
                <AssignOrderModal
                    isOpen={isAssignModalOpen}
                    onClose={handleAssignClose}
                    orderId={orderToAssign.id}
                    trackingCode={orderToAssign.tracking_code}
                />
            )}
        </>
    );
};

export default PendingOrdersTable;
