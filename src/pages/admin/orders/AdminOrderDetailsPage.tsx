import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  User,
  Truck,
  Package,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import type { OrderStatus } from '../../../types/database';
import AssignOrderModal from './components/AssignOrderModal';

const AdminOrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOrder, isLoading, error, fetchOrder, updateOrderStatus } = useAdminStore();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id, fetchOrder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar el pedido</h2>
        <p className="text-gray-600 mb-6">{error || 'Pedido no encontrado'}</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!id) return;
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(id, newStatus);
      await fetchOrder(id); // Refresh data
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  const formatAddress = (address: any) => {
    if (!address) return '';
    return `${address.street} ${address.number}, ${address.neighborhood}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/orders')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  Pedido {currentOrder.tracking_code}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentOrder.status)}`}>
                    {getStatusText(currentOrder.status)}
                  </span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Creado el {new Date(currentOrder.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {currentOrder.status === 'pending' || currentOrder.status === 'processing' ? (
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Asignar Repartidor
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Ruta de Envío
              </h2>
              <div className="relative pl-8 border-l-2 border-gray-100 space-y-8">
                {/* Pickup */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-blue-100 bg-blue-600"></div>
                  <h3 className="font-medium text-gray-900">Dirección de Recogida</h3>
                  <p className="text-gray-600 mt-1">{formatAddress(currentOrder.pickup_address)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentOrder.pickup_address.city}, {currentOrder.pickup_address.state}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1.5 text-gray-400" />
                      {currentOrder.pickup_contact.name}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1.5 text-gray-400" />
                      {currentOrder.pickup_contact.phone}
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-green-100 bg-green-600"></div>
                  <h3 className="font-medium text-gray-900">Dirección de Entrega</h3>
                  <p className="text-gray-600 mt-1">{formatAddress(currentOrder.delivery_address)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentOrder.delivery_address.city}, {currentOrder.delivery_address.state}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1.5 text-gray-400" />
                      {currentOrder.delivery_contact.name}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1.5 text-gray-400" />
                      {currentOrder.delivery_contact.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Detalles del Paquete
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Descripción</p>
                  <p className="text-gray-900 font-medium">{currentOrder.package_data.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Valor Declarado</p>
                  <p className="text-gray-900 font-medium">
                    ${currentOrder.package_data.declaredValue?.toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Peso</p>
                    <p className="text-gray-900">{currentOrder.package_data.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dimensiones</p>
                    <p className="text-gray-900">
                      {currentOrder.package_data.dimensions?.length}x
                      {currentOrder.package_data.dimensions?.width}x
                      {currentOrder.package_data.dimensions?.height} cm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado del Pedido</h2>
              <div className="space-y-3">
                {[
                  { value: 'pending', label: 'Pendiente' },
                  { value: 'processing', label: 'Procesando' },
                  { value: 'assigned', label: 'Asignado' },
                  { value: 'picked_up', label: 'Recogido' },
                  { value: 'in_transit', label: 'En Tránsito' },
                  { value: 'delivered', label: 'Entregado' },
                  { value: 'cancelled', label: 'Cancelado' }
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(status.value as OrderStatus)}
                    disabled={isUpdatingStatus}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${currentOrder.status === status.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    <span className="font-medium">{status.label}</span>
                    {currentOrder.status === status.value && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignment Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-blue-600" />
                Información de Asignación
              </h2>
              {currentOrder.assigned_repartidor ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Conductor Asignado</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {(currentOrder as any).assigned_repartidor.full_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(currentOrder as any).assigned_repartidor.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  {currentOrder.vehicle && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Vehículo</p>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">
                          {currentOrder.vehicle.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentOrder.vehicle.license_plate}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Truck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Sin conductor asignado</p>
                  <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Asignar ahora
                  </button>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Cliente
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {(currentOrder.user as any)?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {(currentOrder.user as any)?.full_name || 'Usuario desconocido'}
                    </p>
                    <p className="text-sm text-gray-500">Cliente registrado</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {(currentOrder.user as any)?.email}
                  </div>
                  {(currentOrder.user as any)?.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {(currentOrder.user as any)?.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {currentOrder && (
        <AssignOrderModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            fetchOrder(currentOrder.id); // Refresh after assignment
          }}
          orderId={currentOrder.id}
          trackingCode={currentOrder.tracking_code}
        />
      )}
    </div>
  );
};

export default AdminOrderDetailsPage;
