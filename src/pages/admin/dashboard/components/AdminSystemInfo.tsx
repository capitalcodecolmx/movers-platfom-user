// =====================================================
// COMPONENTE DE INFORMACIÓN DEL SISTEMA
// =====================================================

import React from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';

interface AdminSystemInfoProps {
  pendingOrders: number;
  deliveredOrders: number;
}

const AdminSystemInfo: React.FC<AdminSystemInfoProps> = ({
  pendingOrders,
  deliveredOrders,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Información del Sistema
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="font-medium text-gray-900">
              Órdenes Requieren Atención
            </p>
            <p className="text-sm text-gray-600">
              {pendingOrders} órdenes pendientes de revisión
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <div>
            <p className="font-medium text-gray-900">Rendimiento del Mes</p>
            <p className="text-sm text-gray-600">
              {deliveredOrders} entregas completadas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemInfo;

