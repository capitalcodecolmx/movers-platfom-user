import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Eye,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
    MoreVertical,
    MapPin,
    Calendar
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import type { OrderWithDetails } from '../../../types/database';
import AssignOrderModal from './components/AssignOrderModal';

const AdminOrdersPage: React.FC = () => {
    const navigate = useNavigate();
    const { orders, isLoading, error, fetchOrders } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [orderToAssign, setOrderToAssign] = useState<OrderWithDetails | null>(null);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'assigned': return 'bg-purple-100 text-purple-800';
            case 'picked_up': return 'bg-indigo-100 text-indigo-800';
            case 'in_transit': return 'bg-orange-100 text-orange-800';
            case 'delivered': return 'bg-green-100 text-green-800';
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
            case 'in_transit': return 'En Tránsito';
            case 'delivered': return 'Entregado';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user as any)?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user as any)?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleAssignClick = (order: OrderWithDetails) => {
        setOrderToAssign(order);
        setIsAssignModalOpen(true);
    };

    if (isLoading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
                        <p className="text-gray-600 mt-1">Administra y asigna los envíos de la plataforma</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => fetchOrders()}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar por código, cliente o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            <Filter className="text-gray-400 w-5 h-5" />
                            {['all', 'pending', 'assigned', 'in_transit', 'delivered'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {status === 'all' ? 'Todos' : getStatusText(status)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pedido</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Asignación</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No se encontraron pedidos
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">{order.tracking_code}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {order.package_data?.description || 'Sin descripción'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {(order.user as any)?.full_name || 'Usuario desconocido'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {(order.user as any)?.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.assigned_repartidor_id ? (
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <Truck className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span>{(order as any).assigned_repartidor?.full_name || 'Repartidor'}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Sin asignar</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {order.status === 'pending' || order.status === 'processing' ? (
                                                        <button
                                                            onClick={() => handleAssignClick(order)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Asignar Repartidor"
                                                        >
                                                            <Truck className="w-4 h-4" />
                                                        </button>
                                                    ) : null}
                                                    <button
                                                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                        title="Ver Detalles"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Assign Modal */}
            {orderToAssign && (
                <AssignOrderModal
                    isOpen={isAssignModalOpen}
                    onClose={() => {
                        setIsAssignModalOpen(false);
                        setOrderToAssign(null);
                    }}
                    orderId={orderToAssign.id}
                    trackingCode={orderToAssign.tracking_code}
                />
            )}
        </div>
    );
};

export default AdminOrdersPage;
