import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, CheckCircle, AlertCircle, FileText, Handshake } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  trackingCode: string;
  amount: number;
  onPaymentSuccess?: (paymentData: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  trackingCode,
  amount,
  onPaymentSuccess
}) => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showTransferInfo, setShowTransferInfo] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  const paymentMethods = [
    {
      id: 'transfer',
      name: 'Transferencia Bancaria',
      description: 'BBVA, Santander, Banorte, etc.',
      icon: Building2,
      available: true
    },
    {
      id: 'contrapago',
      name: 'Contrapago',
      description: 'Pago contra entrega con contrato establecido',
      icon: Handshake,
      available: true
    }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    // Validación especial para transferencia
    if (selectedMethod === 'transfer' && !receiptUploaded) {
      alert('Por favor, sube tu comprobante de transferencia en el chat de la orden antes de continuar.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar el estado de pago en la base de datos
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_method: selectedMethod,
          payment_confirmed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Cambiar estado de la orden a "processing"
      await supabase
        .from('orders')
        .update({
          status: 'processing'
        })
        .eq('id', orderId);

      setPaymentSuccess(true);
      
      if (onPaymentSuccess) {
        onPaymentSuccess({
          method: selectedMethod,
          amount,
          orderId,
          trackingCode
        });
      }

      // Si es contrapago, redirigir a /orders después de confirmar
      if (selectedMethod === 'contrapago') {
        setTimeout(() => {
          navigate('/orders');
          onClose();
        }, 2000);
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMethodSelection = (methodId: string) => {
    setSelectedMethod(methodId);
    setShowTransferInfo(methodId === 'transfer');
    setReceiptUploaded(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Procesar Pago</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ¡Pago Exitoso!
              </h3>
              <p className="text-gray-600 mb-4">
                Tu pago ha sido procesado correctamente. Tu orden está siendo preparada.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600">Código de seguimiento:</p>
                <p className="text-lg font-mono font-semibold text-gray-900">{trackingCode}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Orden #{trackingCode}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${amount.toLocaleString('es-MX')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total a pagar</p>
                    <p className="text-sm text-gray-500">IVA incluido</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-gray-900">Método de pago</h3>
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelection(method.id)}
                    disabled={!method.available}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <method.icon className={`w-5 h-5 ${
                          selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Transfer Information */}
              {showTransferInfo && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <h4 className="font-medium text-green-800 mb-3">Información para Transferencia</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Banco:</span>
                      <span className="font-medium text-green-900">BBVA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Cuenta:</span>
                      <span className="font-mono font-medium text-green-900">0123456789</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">CLABE:</span>
                      <span className="font-mono font-medium text-green-900">012345678901234567</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Beneficiario:</span>
                      <span className="font-medium text-green-900">Mouvers Logistics S.A.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Referencia:</span>
                      <span className="font-mono font-medium text-green-900">{trackingCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Monto:</span>
                      <span className="font-medium text-green-900">${amount.toLocaleString('es-MX')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Pago Seguro</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Tus datos están protegidos con encriptación SSL. No almacenamos información de tarjetas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Validación para transferencia */}
                {selectedMethod === 'transfer' && !receiptUploaded && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                      <p className="text-sm text-red-800">
                        Debes subir tu comprobante de transferencia en el chat de la orden antes de continuar.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={!selectedMethod || isProcessing || (selectedMethod === 'transfer' && !receiptUploaded)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>
                        {selectedMethod === 'contrapago' ? 'Confirmando...' : 'Procesando...'}
                      </span>
                    </>
                  ) : (
                    <span>
                      {selectedMethod === 'contrapago' 
                        ? `Confirmar Contrapago - $${amount.toLocaleString('es-MX')}`
                        : `Procesar Pago - $${amount.toLocaleString('es-MX')}`
                      }
                    </span>
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
