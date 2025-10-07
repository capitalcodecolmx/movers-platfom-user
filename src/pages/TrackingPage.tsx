// =====================================================
// PÁGINA DE SEGUIMIENTO DE ÓRDENES
// =====================================================

import React, { useState } from 'react';
import { Search, Package, AlertCircle, Loader2, Plus, Truck, CheckCircle, Calculator, CreditCard } from 'lucide-react';
import { useTracking } from '../hooks/useTracking';
import TrackingVisual from '../components/TrackingVisual';

const TrackingPage: React.FC = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const { trackingData, isLoading, error, searchByTrackingCode, clearTracking } = useTracking();


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchByTrackingCode(trackingCode);
  };

  const handleClear = () => {
    setTrackingCode('');
    clearTracking();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seguimiento de Envíos</h1>
            <p className="text-gray-600">
              Ingresa tu código de seguimiento para ver el estado de tu envío
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label htmlFor="trackingCode" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Seguimiento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="trackingCode"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  placeholder="Ej: 87D77BC8"
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading || !trackingCode.trim()}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Buscar Envío
                  </>
                )}
              </button>
              
              {trackingData && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Nueva Búsqueda
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Buscando tu envío...</h3>
            <p className="text-gray-600">
              Estamos verificando el estado de tu orden con código: <span className="font-mono font-semibold">{trackingCode}</span>
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">No se pudo encontrar el envío</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2">Sugerencias:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Verifica que el código de seguimiento esté correcto</li>
                <li>• Asegúrate de usar el código completo (ej: 87D77BC8)</li>
                <li>• El código es sensible a mayúsculas y minúsculas</li>
                <li>• Si el problema persiste, contacta a soporte</li>
              </ul>
            </div>
          </div>
        )}

        {/* Resultado del seguimiento */}
        {trackingData && !isLoading && (
          <TrackingVisual data={trackingData} />
        )}

        {/* Estado inicial - sin búsqueda */}
        {!trackingData && !isLoading && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Rastrea tu envío
            </h3>
            <p className="text-gray-600 mb-6">
              Ingresa tu código de seguimiento arriba para ver el estado actual de tu envío
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Plus className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Orden Creada</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Tu orden ha sido registrada y está siendo procesada
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Calculator className="w-5 h-5 text-orange-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Cotización</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Calculando el costo de tu envío
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <CreditCard className="w-5 h-5 text-purple-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Pago</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Confirmando el pago de tu envío
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Truck className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">En Camino</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Tu paquete está siendo transportado
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Entregado</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Tu paquete ha llegado a su destino
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
