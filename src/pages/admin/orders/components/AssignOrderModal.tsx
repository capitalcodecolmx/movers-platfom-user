import React, { useState, useEffect } from 'react';
import { X, Truck, User, Check } from 'lucide-react';
import { supabase } from '../../../../config/supabase';
import { useAdminStore } from '../../../../store/useAdminStore';

interface AssignOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    trackingCode: string;
}

interface Driver {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
}

interface Vehicle {
    id: string;
    name: string;
    type: string;
    license_plate: string;
}

const AssignOrderModal: React.FC<AssignOrderModalProps> = ({
    isOpen,
    onClose,
    orderId,
    trackingCode
}) => {
    const { assignOrder } = useAdminStore();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedDriver, setSelectedDriver] = useState<string>('');
    const [selectedVehicle, setSelectedVehicle] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchResources();
        }
    }, [isOpen]);

    const fetchResources = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch drivers (users with role 'repartidor')
            const { data: driversData, error: driversError } = await supabase
                .from('users')
                .select('id, full_name, email, phone')
                .eq('role', 'repartidor')
                .eq('is_active', true);

            if (driversError) throw driversError;

            // Fetch active vehicles
            const { data: vehiclesData, error: vehiclesError } = await supabase
                .from('vehicles')
                .select('id, name, type, license_plate')
                .eq('is_active', true);

            if (vehiclesError) throw vehiclesError;

            setDrivers(driversData || []);
            setVehicles(vehiclesData || []);
        } catch (err: any) {
            console.error('Error fetching resources:', err);
            setError('Error al cargar conductores y vehículos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDriver || !selectedVehicle) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await assignOrder(orderId, selectedDriver, selectedVehicle);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al asignar la orden');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">
                        Asignar Orden {trackingCode}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Driver Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Conductor
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={selectedDriver}
                                onChange={(e) => setSelectedDriver(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                required
                                disabled={isLoading}
                            >
                                <option value="">Seleccionar conductor</option>
                                {drivers.map((driver) => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {drivers.length === 0 && !isLoading && (
                            <p className="text-xs text-orange-500 mt-1">
                                No hay conductores disponibles. Crea usuarios con rol 'repartidor'.
                            </p>
                        )}
                    </div>

                    {/* Vehicle Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehículo
                        </label>
                        <div className="relative">
                            <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={selectedVehicle}
                                onChange={(e) => setSelectedVehicle(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                required
                                disabled={isLoading}
                            >
                                <option value="">Seleccionar vehículo</option>
                                {vehicles.map((vehicle) => (
                                    <option key={vehicle.id} value={vehicle.id}>
                                        {vehicle.name} ({vehicle.type}) - {vehicle.license_plate}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {vehicles.length === 0 && !isLoading && (
                            <p className="text-xs text-orange-500 mt-1">
                                No hay vehículos disponibles.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedDriver || !selectedVehicle}
                            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            ) : (
                                <Check className="w-4 h-4 mr-2" />
                            )}
                            Asignar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignOrderModal;
