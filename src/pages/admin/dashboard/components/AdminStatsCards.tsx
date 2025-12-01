// =====================================================
// COMPONENTE DE TARJETAS DE ESTADÍSTICAS
// =====================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { StatCard } from '../types';

interface AdminStatsCardsProps {
  stats: StatCard[];
}

const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const StatIcon = stat.icon;
        
        return (
          <div
            key={index}
            onClick={() => stat.href && navigate(stat.href)}
            className={`${stat.bgColor} rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 ${
              stat.href ? 'hover:scale-105' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-white">
                <StatIcon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;

