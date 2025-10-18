// =====================================================
// MODAL DE MENSAJES DE ÓRDENES
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, User, Clock, Paperclip, Upload, FileText, Image } from 'lucide-react';
import { useOrderMessages, type OrderMessage } from '../hooks/useOrderMessages';

interface OrderMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderTrackingCode: string;
}

const OrderMessagesModal: React.FC<OrderMessagesModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderTrackingCode
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    getRecipientInfo
  } = useOrderMessages(orderId);

  // Obtener información del destinatario
  useEffect(() => {
    if (isOpen && orderId) {
      getRecipientInfo(orderId).then(setRecipient);
    }
  }, [isOpen, orderId, getRecipientInfo]);

  // Scroll automático al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Limpiar duplicados de mensajes
  useEffect(() => {
    if (messages.length > 0) {
      const uniqueMessages = messages.filter((message, index, self) => 
        index === self.findIndex(m => m.id === message.id)
      );
      
      if (uniqueMessages.length !== messages.length) {
        console.log('🧹 Limpiando mensajes duplicados:', messages.length - uniqueMessages.length);
        // Los mensajes se actualizarán automáticamente por el hook
      }
    }
  }, [messages]);

  // Formatear tiempo relativo
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !recipient) return;

    setIsSending(true);
    try {
      await sendMessage(orderId, recipient.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  // Manejar Enter para enviar
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Manejar selección de archivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo (imágenes y PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
      } else {
        alert('Solo se permiten archivos de imagen (JPG, PNG, GIF) y PDF');
      }
    }
  };

  // Enviar archivo
  const handleSendFile = async () => {
    if (!selectedFile || !recipient) return;

    setIsUploading(true);
    try {
      // Crear mensaje con archivo adjunto
      const messageText = `📎 Comprobante de pago: ${selectedFile.name}`;
      await sendMessage(orderId, recipient.id, messageText, 'file', selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending file:', error);
      alert('Error al enviar el archivo');
    } finally {
      setIsUploading(false);
    }
  };

  // Obtener icono del tipo de archivo
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  // Renderizar archivo adjunto
  const renderAttachment = (attachment: any) => {
    if (!attachment) return null;

    const { file_name, file_url, file_type } = attachment;
    const isImage = file_type?.startsWith('image/');
    const isPdf = file_type === 'application/pdf';

    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          {getFileIcon(file_name)}
          <div className="flex-1 min-w-0">
            <a
              href={file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline truncate block"
            >
              {file_name}
            </a>
            <p className="text-xs text-gray-500">
              {isImage ? 'Imagen' : isPdf ? 'Documento PDF' : 'Archivo adjunto'}
            </p>
          </div>
        </div>
        
        {/* Vista previa para imágenes */}
        {isImage && (
          <div className="mt-2">
            <img
              src={file_url}
              alt={file_name}
              className="max-w-full h-32 object-cover rounded border cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(file_url, '_blank')}
            />
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Mensajes de la Orden
                </h2>
                <p className="text-sm text-gray-500">
                  Código: {orderTrackingCode}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Información del destinatario */}
            {recipient && (
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Conversando con: <span className="font-medium">{recipient.full_name}</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {recipient.role}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Error al cargar mensajes: {error}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay mensajes
                  </h3>
                  <p className="text-gray-500">
                    Aún no hay mensajes para esta orden. ¡Inicia la conversación!
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender?.role === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender?.role === 'admin'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.sender && message.sender.role !== 'admin' && (
                        <div className="text-xs font-medium mb-1 opacity-75">
                          {message.sender.full_name}
                        </div>
                      )}
                      <p className="text-sm">{message.message}</p>
                      
                      {/* Mostrar archivo adjunto si existe */}
                      {message.attachments && renderAttachment(message.attachments)}
                      
                      <div className={`text-xs mt-1 ${
                        message.sender?.role === 'admin' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTimeAgo(message.created_at)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              {/* Archivo seleccionado */}
              {selectedFile && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(selectedFile.name)}
                      <span className="text-sm font-medium text-blue-900">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-blue-600">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSendFile}
                        disabled={isUploading || !recipient}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <Upload className="w-3 h-3" />
                        )}
                        <span>Enviar</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    disabled={isSending || isUploading || !recipient}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Adjuntar comprobante de pago"
                    disabled={isSending || isUploading || !recipient}
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending || isUploading || !recipient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {!recipient && (
                <p className="text-xs text-gray-500 mt-2">
                  Cargando información del destinatario...
                </p>
              )}

              {/* Ayuda para comprobantes */}
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  💡 <strong>Tip:</strong> Puedes subir tu comprobante de pago usando el botón de adjuntar archivo. 
                  Se aceptan imágenes (JPG, PNG, GIF) y archivos PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderMessagesModal;


