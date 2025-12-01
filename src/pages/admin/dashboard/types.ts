// =====================================================
// TYPES PARA ADMIN DASHBOARD
// =====================================================

import type { LucideIcon } from 'lucide-react';

export interface StatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  href?: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color: string;
}

