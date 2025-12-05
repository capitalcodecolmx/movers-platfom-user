// =====================================================
// ADMIN SETTINGS PAGE - PLACEHOLDER
// =====================================================

import React from 'react';
import { Settings, Bell, Lock, Globe, Palette, Database, Save } from 'lucide-react';

const AdminSettingsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-gray-500/20 rounded-lg">
                                    <Settings className="w-6 h-6 text-gray-400" />
                                </div>
                                <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm font-medium rounded-full">
                                    Configuración
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-white">Configuración del Sistema</h1>
                            <p className="text-slate-400 mt-1">Ajusta las preferencias y configuraciones</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center">
                                <Globe className="w-5 h-5 text-gray-400 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Configuración General</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
                                <input
                                    type="text"
                                    defaultValue="Blanquita Agua Purificada"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de Contacto</label>
                                <input
                                    type="tel"
                                    defaultValue="+52 555 123 4567"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email de Soporte</label>
                                <input
                                    type="email"
                                    defaultValue="soporte@blanquita.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center">
                                <Bell className="w-5 h-5 text-gray-400 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Notificaciones por Email</p>
                                    <p className="text-sm text-gray-500">Recibir actualizaciones de órdenes</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Alertas de Stock Bajo</p>
                                    <p className="text-sm text-gray-500">Avisos cuando los productos estén bajos</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-cyan-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center">
                                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Seguridad</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <p className="font-medium text-gray-900">Cambiar Contraseña</p>
                                <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso</p>
                            </button>
                            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <p className="font-medium text-gray-900">Autenticación de Dos Factores</p>
                                <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors">
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
