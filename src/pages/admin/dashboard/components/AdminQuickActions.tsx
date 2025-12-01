// =====================================================
// COMPONENTE DE ACCIONES RÁPIDAS
// =====================================================

import React from 'react';
import type { QuickAction } from '../types';

interface AdminQuickActionsProps {
  actions: QuickAction[];
}

const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({ actions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action, index) => {
        const ActionIcon = action.icon;
        
        return (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white rounded-xl p-6 text-left hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1`}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                <ActionIcon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
            <p className="text-white/80 text-sm">{action.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default AdminQuickActions;

