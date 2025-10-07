# Sistema de Mensajes de Órdenes

## Descripción General

El sistema de mensajes permite la comunicación entre usuarios y administradores/repartidores sobre órdenes específicas. Los mensajes se muestran en un modal cuando se hace clic en el botón de mensajes en la tabla de órdenes.

## Características Principales

### ✅ **Modal de Mensajes**
- Se abre al hacer clic en el botón de mensajes en la tabla de órdenes
- Muestra todos los mensajes de la orden específica
- Interfaz tipo chat con burbujas de mensajes
- Scroll automático al final de la conversación

### ✅ **Estado Vacío**
- Cuando no hay mensajes, muestra un mensaje informativo
- Icono de mensaje y texto explicativo
- Interfaz limpia y profesional

### ✅ **Envío de Mensajes**
- Campo de texto para escribir nuevos mensajes
- Botón de envío con icono
- Soporte para Enter para enviar
- Validación de mensajes vacíos

### ✅ **Información del Destinatario**
- Muestra con quién está conversando
- Identifica el rol del destinatario
- Carga automática de información

### ✅ **Tiempo Real**
- Actualizaciones automáticas de nuevos mensajes
- Sincronización en tiempo real
- No requiere recargar la página

## Estructura de Archivos

```
src/
├── hooks/
│   └── useOrderMessages.ts          # Hook para manejar mensajes
├── components/
│   └── OrderMessagesModal.tsx       # Modal de mensajes
└── pages/
    └── OrdersPage.tsx               # Integración del modal
```

## Configuración de Base de Datos

### Tabla `messages`

```sql
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  attachments jsonb,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
```

### Políticas RLS

- **Usuarios**: Pueden ver y enviar mensajes donde participan
- **Admins**: Pueden ver todos los mensajes
- **Seguridad**: Solo se pueden actualizar mensajes propios

## Funcionalidades del Hook `useOrderMessages`

### Métodos Principales

```typescript
const {
  messages,           // Lista de mensajes
  isLoading,         // Estado de carga
  error,             // Errores
  fetchOrderMessages, // Obtener mensajes de una orden
  sendMessage,       // Enviar nuevo mensaje
  markAsRead,        // Marcar como leído
  getRecipientInfo   // Obtener info del destinatario
} = useOrderMessages(orderId);
```

### Características del Hook

- **Carga automática**: Obtiene mensajes cuando cambia el `orderId`
- **Tiempo real**: Escucha cambios en la tabla de mensajes
- **Gestión de estado**: Maneja loading, errores y datos
- **Optimización**: Actualiza solo los mensajes afectados

## Funcionalidades del Modal

### Interfaz de Usuario

- **Header**: Título, código de orden y botón cerrar
- **Información del destinatario**: Nombre y rol
- **Área de mensajes**: Lista con scroll automático
- **Input de mensaje**: Campo de texto con botón enviar

### Estados del Modal

1. **Cargando**: Spinner mientras se cargan los mensajes
2. **Error**: Mensaje de error si falla la carga
3. **Vacío**: Mensaje informativo cuando no hay mensajes
4. **Con mensajes**: Lista de mensajes con burbujas

### Diseño de Mensajes

- **Mensajes del admin**: Burbujas azules a la derecha
- **Mensajes del usuario**: Burbujas grises a la izquierda
- **Timestamp**: Tiempo relativo (ej: "Hace 5 minutos")
- **Información del remitente**: Nombre en mensajes no-admin

## Integración en OrdersPage

### Botón de Mensajes

```typescript
<button
  onClick={() => openMessagesModal(order)}
  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
  title="Mensajes"
>
  <MessageSquare className="w-4 h-4" />
</button>
```

### Estado del Modal

```typescript
const [messagesModalOpen, setMessagesModalOpen] = useState(false);
const [selectedOrderForMessages, setSelectedOrderForMessages] = useState<Order | null>(null);
```

## Flujo de Usuario

### 1. **Abrir Modal**
- Usuario hace clic en botón de mensajes
- Se abre el modal con la orden específica
- Se cargan los mensajes existentes

### 2. **Ver Mensajes**
- Si hay mensajes: se muestran en formato chat
- Si no hay mensajes: se muestra estado vacío
- Scroll automático al final

### 3. **Enviar Mensaje**
- Usuario escribe en el campo de texto
- Presiona Enter o hace clic en enviar
- Mensaje se envía y aparece en tiempo real

### 4. **Cerrar Modal**
- Usuario hace clic en X o fuera del modal
- Se cierra el modal y se limpia el estado

## Configuración de Real-time

### Canal de Suscripción

```typescript
const channel = supabase
  .channel(`order_messages_${orderId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `order_id=eq.${orderId}`
  }, (payload) => {
    // Agregar nuevo mensaje
  })
  .subscribe();
```

### Eventos Escuchados

- **INSERT**: Nuevos mensajes
- **UPDATE**: Mensajes actualizados (marcados como leídos)

## Seguridad

### Políticas RLS

- **SELECT**: Solo mensajes donde el usuario es remitente o destinatario
- **INSERT**: Solo mensajes donde el usuario es remitente
- **UPDATE**: Solo mensajes donde el usuario es destinatario
- **Admin**: Acceso completo a todos los mensajes

### Validaciones

- **Mensajes vacíos**: No se pueden enviar
- **Orden válida**: Debe existir la orden
- **Usuario autenticado**: Requerido para todas las operaciones
- **Destinatario válido**: Debe existir el destinatario

## Instalación y Configuración

### 1. Ejecutar Script SQL

```bash
# Ejecutar en Supabase SQL Editor
psql -f setup-messages-table.sql
```

### 2. Verificar Configuración

- Tabla `messages` creada
- Índices configurados
- Políticas RLS habilitadas
- Real-time habilitado

### 3. Probar Funcionalidad

- Abrir modal de mensajes
- Enviar mensaje de prueba
- Verificar tiempo real

## Troubleshooting

### Problemas Comunes

1. **Modal no se abre**
   - Verificar que `OrderMessagesModal` esté importado
   - Revisar que `openMessagesModal` esté conectado al botón

2. **Mensajes no cargan**
   - Verificar políticas RLS
   - Revisar que la orden existe
   - Comprobar permisos del usuario

3. **Real-time no funciona**
   - Verificar que real-time esté habilitado
   - Revisar canal de suscripción
   - Comprobar filtros de eventos

### Logs de Debug

```typescript
// En el hook useOrderMessages
console.log('Fetching messages for order:', orderId);
console.log('Messages loaded:', messages);
console.log('Real-time channel:', channel);
```

## Próximas Mejoras

### Funcionalidades Adicionales

- **Archivos adjuntos**: Soporte para imágenes y documentos
- **Notificaciones push**: Alertas de nuevos mensajes
- **Mensajes del sistema**: Notificaciones automáticas
- **Búsqueda**: Buscar en mensajes anteriores
- **Emojis**: Soporte para emojis en mensajes

### Optimizaciones

- **Paginación**: Cargar mensajes por lotes
- **Cache**: Almacenar mensajes en cache local
- **Compresión**: Optimizar tamaño de mensajes
- **Offline**: Soporte para modo offline

---

## Resumen

El sistema de mensajes está completamente implementado y funcional. Permite:

✅ **Comunicación en tiempo real** entre usuarios y admins/repartidores  
✅ **Modal integrado** en la tabla de órdenes  
✅ **Estado vacío** cuando no hay mensajes  
✅ **Interfaz profesional** tipo chat  
✅ **Seguridad completa** con RLS  
✅ **Tiempo real** con Supabase  

**¡Listo para usar!** 🚀


