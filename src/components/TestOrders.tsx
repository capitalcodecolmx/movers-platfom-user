// =====================================================
// COMPONENTE DE PRUEBA PARA ÓRDENES
// =====================================================

import React from 'react';
import { useOrders, type Order } from '../hooks/useOrders';

const TestOrders: React.FC = () => {
  const { orders, isLoading, error, createOrder, fetchOrders } = useOrders();

  const createTestOrder = async () => {
    try {
      const testOrderData = {
        packageType: 'documentos',
        packageDescription: 'Prueba de orden',
        weight: 1.0,
        dimensions: { length: 20, width: 15, height: 5 },
        packageValue: 0,
        specialInstructions: 'Orden de prueba',
        insuranceRequired: false,
        fragile: false,
        urgent: false,
        selectedVehicle: { id: 'test-vehicle', name: 'Moto Test', type: 'moto' },
        pickupAddress: {
          street: 'Calle Test',
          number: '123',
          neighborhood: 'Colonia Test',
          city: 'Reynosa',
          state: 'Tamaulipas',
          full: 'Calle Test 123, Colonia Test, Reynosa, Tamaulipas'
        },
        deliveryAddress: {
          street: 'Avenida Test',
          number: '456',
          neighborhood: 'Colonia Destino',
          city: 'Reynosa',
          state: 'Tamaulipas',
          full: 'Avenida Test 456, Colonia Destino, Reynosa, Tamaulipas'
        },
        senderInfo: {
          name: 'Remitente Test',
          phone: '+52 55 1234 5678',
          email: 'remitente@test.com'
        },
        recipientInfo: {
          name: 'Destinatario Test',
          phone: '+52 55 8765 4321',
          email: 'destinatario@test.com'
        },
        pickupDate: '2024-01-20',
        pickupTime: '10:00',
        deliveryDate: '2024-01-20',
        deliveryTime: '16:00',
        estimatedCost: 50.00
      };

      await createOrder(testOrderData);
      alert('Orden de prueba creada exitosamente');
    } catch (error: any) {
      alert(`Error al crear orden de prueba: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Prueba de Órdenes</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={createTestOrder}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Crear Orden de Prueba
          </button>
          
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Recargar Órdenes
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p><strong>Estado:</strong> {isLoading ? 'Cargando...' : 'Listo'}</p>
          <p><strong>Órdenes encontradas:</strong> {orders.length}</p>
          {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
        </div>

        {orders.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Órdenes en la base de datos:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {orders.map((order) => (
                <div key={order.id} className="p-2 bg-gray-50 rounded text-xs">
                  <p><strong>Código:</strong> {order.tracking_code}</p>
                  <p><strong>Estado:</strong> {order.status}</p>
                  <p><strong>Creada:</strong> {new Date(order.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestOrders;
