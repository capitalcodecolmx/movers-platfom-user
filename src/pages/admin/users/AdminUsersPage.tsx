// =====================================================
// ADMIN USERS PAGE - PLACEHOLDER
// =====================================================

import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit2, Trash2, RefreshCw, Shield, User, Truck as TruckIcon } from 'lucide-react';
import { supabase } from '../../../config/supabase';

interface UserData {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
    role: 'admin' | 'user' | 'repartidor';
    created_at: string;
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                    </span>
                );
            case 'repartidor':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <TruckIcon className="w-3 h-3 mr-1" />
                        Repartidor
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <User className="w-3 h-3 mr-1" />
                        Usuario
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Users className="w-6 h-6 text-purple-400" />
                                </div>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-medium rounded-full">
                                    Gestión de Usuarios
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-white">Usuarios</h1>
                            <p className="text-slate-400 mt-1">Administra los usuarios del sistema</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={fetchUsers}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </button>
                            <button className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Usuario
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
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Teléfono</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha Registro</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            <p className="text-gray-500 mt-2">Cargando usuarios...</p>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No hay usuarios registrados
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                                                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user.full_name || 'Sin nombre'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 text-gray-600">{user.phone || '-'}</td>
                                            <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {new Date(user.created_at).toLocaleDateString('es-MX')}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
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

export default AdminUsersPage;
