// =====================================================
// ADMIN VEHICLES PAGE - PLACEHOLDER
// =====================================================

import React, { useEffect, useState } from 'react';
import { Truck, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../../../config/supabase';

interface Vehicle {
    id: string;
    name: string;
    type: string;
    license_plate: string | null;
    capacity_kg: number | null;
    is_active: boolean;
    created_at: string;
}

const AdminVehiclesPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVehicles(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <Truck className="w-6 h-6 text-indigo-400" />
                                </div>
                                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm font-medium rounded-full">
                                    Gestión de Vehículos
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-white">Vehículos</h1>
                            <p className="text-slate-400 mt-1">Administra la flota de vehículos</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={fetchVehicles}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </button>
                            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Vehículo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Placa</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Capacidad</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            <p className="text-gray-500 mt-2">Cargando vehículos...</p>
                                        </td>
                                    </tr>
                                ) : vehicles.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No hay vehículos registrados
                                        </td>
                                    </tr>
                                ) : (
                                    vehicles.map((vehicle) => (
                                        <tr key={vehicle.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{vehicle.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{vehicle.type}</td>
                                            <td className="px-6 py-4 text-gray-600">{vehicle.license_plate || '-'}</td>
                                            <td className="px-6 py-4 text-gray-600">{vehicle.capacity_kg ? `${vehicle.capacity_kg} kg` : '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicle.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {vehicle.is_active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVehiclesPage;
