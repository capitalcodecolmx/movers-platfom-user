// =====================================================
// HOOK PARA OBTENER VEHÍCULOS DE SUPABASE
// =====================================================

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export interface Vehicle {
  id: string;
  name: string;
  type: 'moto' | 'auto' | 'van' | 'camion' | 'bicicleta';
  license_plate?: string;
  capacity_kg?: number;
  capacity_volume?: number;
  is_active?: boolean;
  current_location?: any;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('is_active', true)
        .order('capacity_kg', { ascending: true });

      if (error) throw error;

      setVehicles(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar vehículos');
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedVehicles = (weight: number) => {
    if (!weight || weight <= 0) return [];

    // Filtrar vehículos que puedan cargar el peso
    const suitableVehicles = vehicles.filter(vehicle => 
      vehicle.capacity_kg && vehicle.capacity_kg >= weight
    );

    // Ordenar por capacidad (más cercano al peso requerido primero)
    return suitableVehicles.sort((a, b) => {
      const aDiff = Math.abs((a.capacity_kg || 0) - weight);
      const bDiff = Math.abs((b.capacity_kg || 0) - weight);
      return aDiff - bDiff;
    });
  };

  const getVehicleIcon = (type: string, imageUrl?: string) => {
    // Si hay imagen, usar la imagen, sino usar emoji
    if (imageUrl) {
      return imageUrl;
    }
    
    const icons = {
      'bicicleta': '🚲',
      'moto': '🏍️',
      'auto': '🚗',
      'van': '🚐',
      'camion': '🚛'
    };
    return icons[type as keyof typeof icons] || '🚚';
  };

  const getVehicleTypeName = (type: string) => {
    const names = {
      'bicicleta': 'Bicicleta',
      'moto': 'Motocicleta',
      'auto': 'Automóvil',
      'van': 'Van',
      'camion': 'Camión'
    };
    return names[type as keyof typeof names] || type;
  };

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    getRecommendedVehicles,
    getVehicleIcon,
    getVehicleTypeName
  };
};
