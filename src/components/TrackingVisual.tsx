// =====================================================
// COMPONENTE VISUAL DE SEGUIMIENTO - ESTILO APPLE
// =====================================================

import React from 'react';
import { CheckCircle, Clock, MapPin, Package, Truck, Home, Calculator, CreditCard, FileText } from 'lucide-react';
import type { TrackingData } from '../hooks/useTracking';

interface TrackingVisualProps {
  data: TrackingData;
}

const TrackingVisual: React.FC<TrackingVisualProps> = ({ data }) => {
  const getStepIcon = (step: any, index: number) => {
    if (step.completed) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    if (step.current) {
      return <Clock className="w-6 h-6 text-blue-500" />;
    }
    return <Clock className="w-6 h-6 text-gray-300" />;
  };

  const getStepIconByStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="w-5 h-5" />;
      case 'quote_pending':
        return <Calculator className="w-5 h-5" />;
      case 'quote_ready':
        return <FileText className="w-5 h-5" />;
      case 'payment_pending':
        return <CreditCard className="w-5 h-5" />;
      case 'payment_confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'processing':
        return <Package className="w-5 h-5" />;
      case 'assigned':
        return <Truck className="w-5 h-5" />;
      case 'picked_up':
        return <Truck className="w-5 h-5" />;
      case 'in_transit':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <Home className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Header con información de la orden */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Código: {data.order.tracking_code}
            </h2>
            <p className="text-gray-600">
              Estado actual: <span className="font-semibold text-blue-600">
                {data.steps[data.currentStep]?.title || 'Desconocido'}
              </span>
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progreso</div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(data.progress)}%
            </div>
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${data.progress}%` }}
          />
        </div>
      </div>

      {/* Timeline de pasos */}
      <div className="space-y-6">
        {data.steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Línea conectora */}
            {index < data.steps.length - 1 && (
              <div
                className={`absolute left-6 top-12 w-0.5 h-16 ${
                  step.completed ? 'bg-green-200' : 'bg-gray-200'
                }`}
              />
            )}

            <div className="flex items-start space-x-4">
              {/* Icono del paso */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  step.completed
                    ? 'bg-green-100 border-2 border-green-500'
                    : step.current
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {getStepIcon(step, index)}
              </div>

              {/* Contenido del paso */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <div
                    className={`p-1 rounded-lg ${
                      step.completed
                        ? 'bg-green-100'
                        : step.current
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {getStepIconByStatus(step.status)}
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      step.completed
                        ? 'text-green-800'
                        : step.current
                        ? 'text-blue-800'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </h3>
                </div>
                
                <p
                  className={`text-sm ${
                    step.completed
                      ? 'text-green-600'
                      : step.current
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.description}
                </p>

                {/* Timestamp */}
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(step.timestamp)}
                </p>

                {/* Ubicación si está disponible */}
                {step.location && (
                  <div className="flex items-center space-x-1 mt-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{step.location.address}</span>
                  </div>
                )}

                {/* Notas si están disponibles */}
                {step.notes && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{step.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Información adicional de la orden */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Información del Paquete</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Tipo:</span> {data.order.package_data?.type || 'No especificado'}</p>
              <p><span className="font-medium">Peso:</span> {data.order.package_data?.weight || 0} kg</p>
              <p><span className="font-medium">Descripción:</span> {data.order.package_data?.description || 'No especificada'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Direcciones</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Origen:</span> {data.order.pickup_address?.full || 'No especificada'}</p>
              <p><span className="font-medium">Destino:</span> {data.order.delivery_address?.full || 'No especificada'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingVisual;
