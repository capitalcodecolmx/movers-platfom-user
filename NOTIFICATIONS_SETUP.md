# Sistema de Notificaciones - Muvers Platform

## Descripción
Sistema completo de notificaciones en tiempo real que se integra automáticamente con las órdenes y permite a los usuarios recibir, ver y gestionar notificaciones.

## Características

### ✅ Funcionalidades Implementadas
- **Notificaciones automáticas** al crear órdenes
- **Notificaciones de cambio de estado** de órdenes
- **Dropdown de notificaciones** en tiempo real
- **Página completa de notificaciones** con filtros
- **Marcado como leído** individual y masivo
- **Contador de notificaciones no leídas**
- **Navegación directa** a detalles de órdenes
- **Políticas de seguridad RLS** configuradas
- **Triggers automáticos** en base de datos

### 🔧 Componentes Creados
1. **`useNotifications`** - Hook para manejar notificaciones
2. **`NotificationService`** - Servicio para operaciones CRUD
3. **`NotificationsDropdown`** - Componente dropdown en header
4. **`NotificationsPage`** - Página completa de notificaciones
5. **Integración en `useOrders`** - Notificaciones automáticas
6. **Integración en `Layout`** - Dropdown en navegación

## Configuración

### 1. Base de Datos
Ejecuta el script SQL en tu base de datos de Supabase:

```sql
-- Ejecutar setup-notifications-rls.sql
\i setup-notifications-rls.sql
```

Este script configura:
- ✅ Políticas RLS (Row Level Security)
- ✅ Triggers automáticos para órdenes
- ✅ Índices para optimización
- ✅ Funciones de limpieza

### 2. Verificación de Tablas
Asegúrate de que las siguientes tablas existan en tu base de datos:

```sql
-- Verificar estructura de notifications
\d public.notifications

-- Verificar triggers
SELECT * FROM pg_trigger WHERE tgname LIKE '%notify%';
```

### 3. Configuración de Supabase
En tu proyecto de Supabase:

1. **Realtime**: Habilitar para la tabla `notifications`
2. **RLS**: Las políticas se configuran automáticamente
3. **Auth**: Usuarios deben estar autenticados

## Uso

### Notificaciones Automáticas
Las notificaciones se crean automáticamente cuando:

```typescript
// Al crear una orden
const order = await createOrder(orderData);
// ✅ Se crea automáticamente: "Nueva orden creada"

// Al cambiar estado
await updateOrderStatus(orderId, 'processing');
// ✅ Se crea automáticamente: "Orden en procesamiento"
```

### Tipos de Notificaciones
- `order_created` - Orden creada
- `order_processed` - En procesamiento
- `order_assigned` - Repartidor asignado
- `order_picked_up` - Paquete recogido
- `order_in_transit` - En tránsito
- `order_delivered` - Entregada
- `order_cancelled` - Cancelada
- `payment_confirmed` - Pago confirmado
- `payment_failed` - Error en pago
- `quote_ready` - Cotización lista
- `admin_message` - Mensaje de administrador

### Uso en Componentes

```typescript
import { useNotifications } from '../hooks/useNotifications';

const MyComponent = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  return (
    <div>
      <p>Notificaciones no leídas: {unreadCount}</p>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          <button onClick={() => markAsRead(notification.id)}>
            Marcar como leída
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Rutas Disponibles

- **`/notifications`** - Página completa de notificaciones
- **Dropdown en header** - Notificaciones recientes
- **Navegación automática** - Click en notificación → detalles de orden

## Características de UI

### Dropdown de Notificaciones
- ✅ Contador de no leídas
- ✅ Iconos por tipo de notificación
- ✅ Tiempo relativo ("Hace 5 minutos")
- ✅ Click para navegar a detalles
- ✅ Marcar como leída automáticamente

### Página de Notificaciones
- ✅ Lista completa de notificaciones
- ✅ Filtros (Todas / No leídas)
- ✅ Marcar todas como leídas
- ✅ Navegación a detalles de órdenes
- ✅ Información adicional en cards

## Seguridad

### Políticas RLS
- ✅ Usuarios solo ven sus notificaciones
- ✅ Solo pueden marcar las propias como leídas
- ✅ Solo admins pueden eliminar notificaciones
- ✅ Sistema puede crear notificaciones

### Validaciones
- ✅ Autenticación requerida
- ✅ Validación de tipos de notificación
- ✅ Sanitización de datos
- ✅ Manejo de errores

## Optimización

### Índices de Base de Datos
- ✅ `user_id + created_at` - Consultas por usuario
- ✅ `user_id + is_read` - Filtros de no leídas
- ✅ `order_id` - Búsquedas por orden
- ✅ `type` - Filtros por tipo

### Performance
- ✅ Límite de 50 notificaciones por consulta
- ✅ Paginación en página completa
- ✅ Limpieza automática de notificaciones antiguas
- ✅ Realtime solo para usuario actual

## Monitoreo

### Logs
```typescript
// Los errores se registran en consola
console.error('Error creating notification:', error);

// Éxito también se registra
console.log('Notification created for order:', trackingCode);
```

### Métricas Recomendadas
- Número de notificaciones por tipo
- Tiempo promedio de lectura
- Tasa de clics en notificaciones
- Errores de creación de notificaciones

## Mantenimiento

### Limpieza Automática
```sql
-- Ejecutar manualmente para limpiar notificaciones antiguas
SELECT cleanup_old_notifications();
```

### Backup
Las notificaciones se incluyen automáticamente en backups de la base de datos.

## Troubleshooting

### Problemas Comunes

1. **No se crean notificaciones**
   - Verificar que los triggers estén instalados
   - Revisar logs de Supabase
   - Verificar políticas RLS

2. **No se ven notificaciones**
   - Verificar autenticación del usuario
   - Revisar políticas RLS
   - Verificar que el usuario tenga notificaciones

3. **Errores de permisos**
   - Verificar que las políticas RLS estén activas
   - Revisar roles de usuario en Supabase
   - Verificar configuración de Auth

### Logs Útiles
```typescript
// En el navegador (F12 → Console)
// Buscar estos mensajes:
"Notification created for order:"
"Error creating notification:"
"Status change notification created for order:"
```

## Próximas Mejoras

### Funcionalidades Futuras
- [ ] Notificaciones push (PWA)
- [ ] Configuración de preferencias
- [ ] Notificaciones por email
- [ ] Templates personalizables
- [ ] Notificaciones programadas
- [ ] Análisis de engagement

### Optimizaciones
- [ ] Cache de notificaciones
- [ ] Lazy loading
- [ ] Infinite scroll
- [ ] Compresión de datos
- [ ] CDN para assets

---

## Soporte

Para problemas o preguntas sobre el sistema de notificaciones:
1. Revisar logs de consola
2. Verificar configuración de Supabase
3. Ejecutar scripts de diagnóstico
4. Contactar al equipo de desarrollo

**¡El sistema está listo para usar! 🚀**


