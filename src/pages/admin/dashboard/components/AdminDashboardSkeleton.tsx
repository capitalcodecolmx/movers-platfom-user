// =====================================================
// SKELETON LOADING PARA ADMIN DASHBOARD
// =====================================================

import React from 'react';

const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards Skeleton */}
        <div className="mb-8">
          <div className="h-7 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl p-6 border border-gray-200 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mb-8">
          <div className="h-7 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-xl p-6 h-32 animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* System Info Skeleton */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;

