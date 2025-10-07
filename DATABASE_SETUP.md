# Configuración de Base de Datos - Muvers Platform

## 📋 Descripción

Este documento describe la estructura de base de datos para la aplicación de cotización de envíos **Muvers Platform**. La base de datos está diseñada para funcionar con **Supabase** y incluye todas las funcionalidades necesarias para el sistema de envíos.

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

1. **`users`** - Usuarios del sistema (clientes, admins, repartidores)
2. **`user_profiles`** - Información adicional de usuarios
3. **`orders`** - Pedidos de envío con toda la información
4. **`vehicles`** - Vehículos disponibles para asignar
5. **`notifications`** - Sistema de notificaciones en tiempo real
6. **`messages`** - Canal de mensajería entre usuarios
7. **`order_tracking`** - Historial de seguimiento de pedidos
8. **`quotes`** - Historial de cotizaciones
9. **`pricing_config`** - Configuración de precios por tipo de vehículo

### Características Principales

- ✅ **Códigos de seguimiento únicos** generados automáticamente
- ✅ **Notificaciones en tiempo real** con triggers automáticos
- ✅ **Sistema de roles** flexible (user, admin, repartidor)
- ✅ **Datos JSONB** para información flexible (direcciones, paquetes, etc.)
- ✅ **Row Level Security (RLS)** para seguridad de datos
- ✅ **Triggers automáticos** para actualización de timestamps
- ✅ **Índices optimizados** para consultas rápidas

## 🚀 Instalación en Supabase

### Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

### Paso 2: Ejecutar la Migración

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido completo del archivo `supabase-migration.sql`
3. Ejecuta la migración
4. Verifica que todas las tablas se crearon correctamente

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en tu proyecto con:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

### Paso 4: Configurar Almacenamiento

En Supabase, ve a **Storage** y crea los siguientes buckets:

- `package-photos` (público)
- `documents` (público)
- `avatars` (público)
- `attachments` (público)

## 📊 Flujo de Datos

### 1. Creación de Pedido
```
Usuario → Llena formulario → Crea order → Trigger genera tracking_code → Notifica a admins
```

### 2. Procesamiento por Admin
```
Admin → Ve notificación → Asigna repartidor/vehículo → Cambia status → Notifica a usuario
```

### 3. Seguimiento en Tiempo Real
```
Repartidor → Actualiza ubicación → order_tracking → Notifica a usuario
```

## 🔧 Funcionalidades Implementadas

### Sistema de Notificaciones
- **Triggers automáticos** que crean notificaciones cuando:
  - Se crea un nuevo pedido
  - Cambia el estado de un pedido
  - Se asigna un repartidor
  - Se confirma un pago

### Códigos de Seguimiento
- **Generación automática** de códigos únicos de 8 caracteres
- **Formato**: Letras y números (ej: A1B2C3D4)
- **Función**: `generate_tracking_code()`

### Datos Flexibles con JSONB
- **`package_data`**: Peso, dimensiones, descripción, fotos
- **`pickup_address`** / **`delivery_address`**: Direcciones completas con coordenadas
- **`pickup_contact`** / **`delivery_contact`**: Información de contacto
- **`bank_info`**: Datos bancarios para pagos
- **`attachments`**: URLs de archivos adjuntos

### Estados de Pedidos
```
pending → processing → assigned → picked_up → in_transit → delivered
                ↓
            cancelled (solo admin puede cancelar si está en proceso)
```

## 🛡️ Seguridad

### Row Level Security (RLS)
- Los usuarios solo pueden ver sus propios pedidos
- Los admins pueden ver todos los pedidos
- Los mensajes solo son visibles para remitente y destinatario
- Las notificaciones solo son visibles para el usuario correspondiente

### Políticas Implementadas
```sql
-- Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Usuarios pueden ver sus propios pedidos
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Admins pueden ver todos los pedidos
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
```

## 📱 Integración con Frontend

### Servicios Disponibles
- **`AuthService`**: Autenticación de usuarios
- **`RealtimeService`**: Notificaciones en tiempo real
- **`StorageService`**: Subida de archivos

### Ejemplo de Uso
```typescript
import { supabase, realtimeService } from './config/supabase';

// Suscribirse a notificaciones
realtimeService.subscribeToNotifications(userId, (payload) => {
  console.log('Nueva notificación:', payload);
});

// Crear un pedido
const { data, error } = await supabase
  .from('orders')
  .insert(newOrder);
```

## 🔍 Consultas Útiles

### Obtener pedidos de un usuario
```sql
SELECT * FROM orders 
WHERE user_id = 'user-uuid' 
ORDER BY created_at DESC;
```

### Obtener notificaciones no leídas
```sql
SELECT * FROM notifications 
WHERE user_id = 'user-uuid' 
AND is_read = false 
ORDER BY created_at DESC;
```

### Obtener historial de seguimiento
```sql
SELECT * FROM order_tracking 
WHERE order_id = 'order-uuid' 
ORDER BY created_at ASC;
```

## 📈 Optimizaciones

### Índices Creados
- `idx_users_email` - Búsqueda por email
- `idx_orders_user_id` - Pedidos por usuario
- `idx_orders_status` - Filtrado por estado
- `idx_orders_tracking_code` - Búsqueda por código
- `idx_notifications_unread` - Notificaciones no leídas

### Triggers de Performance
- Actualización automática de `updated_at`
- Generación automática de códigos de seguimiento
- Notificaciones automáticas en cambios de estado

## 🚨 Consideraciones Importantes

1. **Backup**: Configura backups automáticos en Supabase
2. **Monitoreo**: Usa el dashboard de Supabase para monitorear performance
3. **Escalabilidad**: Los índices están optimizados para consultas frecuentes
4. **Seguridad**: Revisa y ajusta las políticas RLS según necesidades
5. **Testing**: Prueba todas las funcionalidades antes de producción

## 📞 Soporte

Para dudas sobre la implementación:
- Revisa los comentarios en el archivo SQL
- Consulta la documentación de Supabase
- Verifica los tipos TypeScript en `src/types/database.ts`

---

**¡La base de datos está lista para usar! 🎉**



