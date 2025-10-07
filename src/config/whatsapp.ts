// =====================================================
// CONFIGURACIÓN DE WHATSAPP
// =====================================================

export const WHATSAPP_CONFIG = {
  // Número de WhatsApp en formato internacional (sin +)
  // Ejemplo: '5255123456789' para México
  PHONE_NUMBER: '5255123456789',
  
  // Mensajes predeterminados
  DEFAULT_MESSAGES: {
    SUPPORT: 'Hola! Necesito ayuda con mi envío en Muvers Platform.',
    TRACKING: 'Hola! Quiero consultar el estado de mi pedido.',
    QUOTE: 'Hola! Necesito una cotización para un envío.',
    PAYMENT: 'Hola! Tengo una duda sobre el pago de mi envío.',
  },
  
  // Configuración del chat
  CHAT_CONFIG: {
    RESPONSE_TIME: '5-10 minutos',
    BUSINESS_HOURS: 'Lunes a Viernes 9:00 - 18:00',
    TIMEZONE: 'GMT-6 (México)'
  }
};

// Función para generar URL de WhatsApp
export const generateWhatsAppUrl = (message: string, phoneNumber?: string): string => {
  const number = phoneNumber || WHATSAPP_CONFIG.PHONE_NUMBER;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encodedMessage}`;
};

// Función para abrir WhatsApp
export const openWhatsApp = (message: string, phoneNumber?: string): void => {
  const url = generateWhatsAppUrl(message, phoneNumber);
  window.open(url, '_blank');
};

