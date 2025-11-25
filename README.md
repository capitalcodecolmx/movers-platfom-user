# 🚀 Mouvers Platform - Documentación Completa

## 📋 Descripción General
Mouvers Platform es una aplicación de cotización y gestión de envíos diseñada para funcionar con **Supabase**. Incluye funcionalidades completas para la gestión de órdenes, notificaciones en tiempo real, mensajería y cotización automática.

---

## ✅ Funcionalidades Implementadas (Versión 1.0)

### 🔐 Sistema de Autenticación
- Login y registro con Supabase Auth
- Protección de rutas y gestión de sesiones
- Diseño minimalista estilo Apple

### 📦 Gestión de Órdenes
- Creación, seguimiento y gestión de órdenes
- Tabla responsive con filtros y búsqueda
- Estados: Pendiente, En tránsito, Entregado, Cancelado

### 💬 Sistema de Mensajes
- Chat en tiempo real entre usuarios y administradores
- Modal integrado en la tabla de órdenes
- Notificaciones de nuevos mensajes

### 🔔 Sistema de Notificaciones
- Notificaciones automáticas al crear/actualizar órdenes
- Dropdown en tiempo real y página dedicada
- Filtros y marcado como leído

### 💰 Sistema de Cotización Automática
- Cotización basada en tarifario (CSV)
- Cálculo automático por distancia y tipo de vehículo
- Modificadores de precio (Urgente, Económico)
- Cotización manual para rutas no disponibles

---

## 🗄️ Configuración de Base de Datos

### Tablas Principales
1. **`users`**: Usuarios del sistema (clientes, admins, repartidores)
2. **`orders`**: Pedidos de envío
3. **`messages`**: Mensajería entre usuarios
4. **`notifications`**: Sistema de notificaciones
5. **`vehicles`**: Vehículos disponibles
6. **`pricing_config`**: Configuración de precios

### Seguridad (RLS)
- **Usuarios**: Solo ven sus propios datos
- **Admins**: Acceso total
- **Políticas**: Configuradas para SELECT, INSERT, UPDATE

### Instalación en Supabase
1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar scripts de migración (ubicados en `migrations/`)
3. Configurar variables de entorno

---

## 🔔 Configuración de Notificaciones

### Características
- **Triggers automáticos**: Al crear orden, cambiar estado, asignar repartidor
- **Realtime**: Actualización instantánea en UI
- **Optimización**: Índices para consultas rápidas

### Solución de Problemas Comunes
- **Error "column is_updatable does not exist"**: Usar script de verificación compatible
- **No se ven notificaciones**: Verificar autenticación y políticas RLS

---

## 💬 Sistema de Mensajes

### Características
- **Modal de Chat**: Integrado en la tabla de órdenes
- **Tiempo Real**: Suscripción a cambios en tabla `messages`
- **Seguridad**: RLS asegura privacidad de conversaciones

### Uso
- Click en icono de mensaje en tabla de órdenes
- Enviar mensaje (Enter o botón)
- Ver historial de conversación

---

## 💰 Sistema de Cotización

### Flujo Automático
1. Usuario ingresa origen/destino
2. Sistema busca en tarifario 2025
3. Si existe ruta: Muestra precio y permite pago
4. Si no existe: Crea orden pendiente de cotización manual

### Tarifario
- Archivo: `public/tarifario.csv`
- Vehículos: Desde 1 Ton hasta Trailer 53"

---

## 🚀 Guía de Despliegue (Vercel)

### Variables de Entorno
Configurar en Vercel:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
VITE_OPENROUTESERVICE_API_KEY=tu-api-key
```

### Comandos
```bash
# Instalar
npm install

# Desarrollo
npm run dev

# Producción
npm run build
```

### Configuración Vercel
- `vercel.json` configurado para SPA (Rewrites)
- Verificar "Site URL" en Supabase Auth settings

---

## 📞 Soporte
- **Email**: actinver7@gmail.com
- **WhatsApp**: Integrado en la aplicación

---
*Documentación unificada automáticamente el 25/11/2025*
