// =====================================================
// COMPONENTE PARA VERIFICAR ÓRDENES EN LA BASE DE DATOS
// =====================================================

import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const CheckOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener todas las órdenes (sin filtro de usuario para debugging)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        setError(error.message);
        return;
      }

      console.log('All orders in database:', data);
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error in checkOrders:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (user) {
        // Obtener órdenes del usuario actual
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user orders:', error);
          setError(error.message);
          return;
        }

        console.log('User orders:', data);
        setOrders(data || []);
      }
    } catch (err: any) {
      console.error('Error checking user:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Verificación de Órdenes</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={checkOrders}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Ver Todas las Órdenes
          </button>
          
          <button
            onClick={checkUser}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Ver Mis Órdenes
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
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {orders.map((order) => (
                <div key={order.id} className="p-3 bg-gray-50 rounded text-xs">
                  <p><strong>Código:</strong> {order.tracking_code}</p>
                  <p><strong>Estado:</strong> {order.status}</p>
                  <p><strong>Usuario ID:</strong> {order.user_id}</p>
                  <p><strong>Descripción:</strong> {order.package_data?.description || 'N/A'}</p>
                  <p><strong>Creada:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  <p><strong>Recogida:</strong> {order.pickup_address?.full || 'N/A'}</p>
                  <p><strong>Entrega:</strong> {order.delivery_address?.full || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {orders.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <p>No se encontraron órdenes en la base de datos.</p>
            <p className="text-sm mt-2">Usa el botón "Crear Orden de Prueba" para agregar una orden.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOrders;
