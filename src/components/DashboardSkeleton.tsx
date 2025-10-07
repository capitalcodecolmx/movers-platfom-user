// =====================================================
// SKELETON DE CARGA PARA DASHBOARD
// =====================================================

import React from 'react';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton - Solo fondo gris */}
      <div className="relative h-[500px] bg-gray-100">
        <div className="absolute inset-0 bg-gray-200/20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Acciones principales skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded-lg w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="flex items-center mb-4">
                  <div className="p-4 rounded-2xl bg-gray-100 w-16 h-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded-lg w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-48"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Órdenes recientes skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-32"></div>
                      <div className="h-3 bg-gray-200 rounded-lg w-16"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
                    <div className="h-3 bg-gray-200 rounded-lg w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
