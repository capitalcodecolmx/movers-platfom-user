// =====================================================
// CHAT FLOTANTE DE WHATSAPP - ESTILO APPLE
// =====================================================

import React, { useState } from 'react';
import { FaWhatsapp, FaTimes, FaComment, FaBox, FaTruck, FaMoneyBillWave, FaQuestionCircle } from 'react-icons/fa';
import { WHATSAPP_CONFIG, openWhatsApp } from '../config/whatsapp';

const WhatsAppChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const defaultMessage = WHATSAPP_CONFIG.DEFAULT_MESSAGES.SUPPORT;

  const handleSendMessage = () => {
    const finalMessage = message.trim() || defaultMessage;
    openWhatsApp(finalMessage);
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
          aria-label="Abrir chat de WhatsApp"
        >
          {isOpen ? (
            <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <FaWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      {/* Panel de chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-2 sm:right-6 z-50 w-72 sm:w-80 max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaWhatsapp className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Soporte WhatsApp</h3>
              <p className="text-xs text-white/80">Estamos aquí para ayudarte</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Contenido */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center space-x-2">
                <FaQuestionCircle className="w-3 h-3 text-blue-500" />
                <span>¿Necesitas ayuda con tu envío?</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaBox className="w-3 h-3 text-green-500" />
                <span>Consulta el estado de tu pedido</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaTruck className="w-3 h-3 text-orange-500" />
                <span>Información sobre entregas</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaMoneyBillWave className="w-3 h-3 text-green-600" />
                <span>Dudas sobre pagos y cotizaciones</span>
              </div>
            </div>

            {/* Campo de mensaje personalizado */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mensaje personalizado (opcional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full p-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Footer con botón y info */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 space-y-2">
            {/* Botón de acción */}
            <button
              onClick={handleSendMessage}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>Enviar por WhatsApp</span>
            </button>

            {/* Info compacta */}
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>Tiempo de respuesta: <span className="font-medium">{WHATSAPP_CONFIG.CHAT_CONFIG.RESPONSE_TIME}</span></p>
              <p className="text-gray-400">{WHATSAPP_CONFIG.CHAT_CONFIG.BUSINESS_HOURS}</p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default WhatsAppChat;
