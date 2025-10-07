// =====================================================
// COMPONENTE DE DEBUG PARA ÓRDENES
// =====================================================

import React from 'react';
import { useOrders } from '../hooks/useOrders';

const OrdersDebug: React.FC = () => {
  const { orders, isLoading, error, fetchOrders } = useOrders();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Debug de Órdenes</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Estado:</strong> {isLoading ? 'Cargando...' : 'Listo'}</p>
            <p><strong>Órdenes:</strong> {orders.length}</p>
            <p><strong>Error:</strong> {error || 'Ninguno'}</p>
          </div>
          <div>
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              Recargar Órdenes
            </button>
          </div>
        </div>

        {orders.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Órdenes encontradas:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {orders.map((order, index) => (
                <div key={order.id} className="p-2 bg-gray-50 rounded text-xs">
                  <p><strong>#{index + 1}</strong> {order.tracking_code} - {order.status}</p>
                  <p className="text-gray-600">
                    {order.package_data?.description || 'Sin descripción'} | 
                    {order.estimated_cost ? ` $${order.estimated_cost}` : ' Sin costo'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {orders.length === 0 && !isLoading && !error && (
          <div className="text-center py-4 text-gray-500">
            <p>No hay órdenes disponibles</p>
            <p className="text-sm">Usa "Crear Orden de Prueba" para agregar una orden</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm"><strong>Error:</strong> {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersDebug;
