# Sistema de Cotización Automática - Mouvers Platform

## Resumen

Se ha implementado un sistema de cotización automática basado en el tarifario oficial 2025 que permite:

1. **Cotización Automática**: Para rutas disponibles en el tarifario
2. **Cotización Manual**: Para rutas no disponibles (requiere intervención del administrador)
3. **Proceso de Pago Integrado**: Pago inmediato para cotizaciones automáticas
4. **Flujo de Estados Actualizado**: Estados específicos para cada tipo de cotización

## Componentes Implementados

### 1. Servicio de Cotización (`src/services/pricingService.ts`)

- **Funcionalidades**:
  - Carga automática del tarifario CSV
  - Búsqueda de rutas por ciudad y estado
  - Cálculo de precios según tipo de vehículo y prioridad
  - Aplicación de modificadores de precio (+15% urgente, -15% económico)

- **Métodos principales**:
  - `calculatePrice()`: Calcula precio automático
  - `isRouteAvailable()`: Verifica disponibilidad de ruta
  - `getCitiesByState()`: Obtiene ciudades por estado

### 2. Campos de Dirección Actualizados (`src/components/order/Step3SimpleRoute.tsx`)

- **Nuevos campos agregados**:
  - Código postal para pickup
  - Código postal para delivery
  - Normalización de direcciones

### 3. Cotización en Paso 4 (`src/components/order/Step4Contacts.tsx`)

- **Funcionalidades**:
  - Verificación automática de disponibilidad de ruta
  - Cálculo de precio en tiempo real
  - Indicadores visuales de estado
  - Manejo de cotización manual vs automática

### 4. Modal de Pago (`src/components/PaymentModal.tsx`)

- **Características**:
  - Múltiples métodos de pago (tarjeta, transferencia, SPEI)
  - Procesamiento simulado de pagos
  - Actualización automática de estados
  - Confirmación de pago exitoso

### 5. Flujo de Estados Actualizado (`src/hooks/useOrders.ts`)

- **Estados implementados**:
  - `quote_pending`: Esperando cotización manual
  - `quote_ready`: Cotización lista, pendiente de pago
  - `payment_pending`: Esperando pago
  - `payment_confirmed`: Pago confirmado
  - `processing`: En procesamiento

## Flujo de Trabajo

### Cotización Automática (Ruta Disponible)

1. Usuario completa formulario de orden
2. Sistema verifica disponibilidad en tarifario
3. Si está disponible:
   - Muestra precio automático
   - Aplica modificadores según prioridad
   - Crea orden con estado `quote_ready`
   - Muestra modal de pago
   - Procesa pago
   - Cambia estado a `processing`

### Cotización Manual (Ruta No Disponible)

1. Usuario completa formulario de orden
2. Sistema verifica disponibilidad en tarifario
3. Si NO está disponible:
   - Muestra mensaje de cotización manual
   - Crea orden con estado `quote_pending`
   - Administrador revisa y cotiza manualmente
   - Usuario recibe notificación con precio
   - Usuario procede con pago

## Modificadores de Precio

- **Económico**: -15% del precio base
- **Estándar**: Precio base (sin modificador)
- **Urgente**: +15% del precio base

## Configuración del Tarifario

El archivo `public/tarifario.csv` contiene:

- **Columnas**: ID, Destino, Estado, KM, y precios por tipo de vehículo
- **Vehículos**: 1.TON, 1.5 TON, 3.5 TON, 5.5 TON, RABON (30 M3), TORTON (50 M3), MUDANZA (80 M3), TRAILER 48" PIES (98 M3), TRAILER 53" PIES (110 M3)
- **Estados**: 32 estados de México con abreviaciones

## Mapeo de Vehículos

```typescript
const VEHICLE_TYPE_MAPPING = {
  'Small Van 1 ton': '1.TON',
  'Van 1.5 ton': '1.5 TON',
  'Truck 3.5 ton': '3.5 TON',
  'Truck 5.5 ton': '5.5 TON',
  'Rabon 30m3': 'RABON (30 M3)',
  'Torton 50m3': 'TORTON (50 M3)',
  'Mudanza 80m3': 'MUDANZA (80 M3)',
  'Trailer 48ft': 'TRAILER 48" PIES (98 M3)',
  'Trailer 53ft': 'TRAILER 53" PIES (110 M3)'
};
```

## Estados de Órdenes

### Automáticas
1. `quote_ready` → Usuario ve precio y puede pagar
2. `payment_pending` → Esperando pago
3. `payment_confirmed` → Pago confirmado
4. `processing` → En procesamiento

### Manuales
1. `quote_pending` → Esperando cotización del admin
2. `quote_ready` → Admin envió cotización
3. `payment_pending` → Esperando pago
4. `payment_confirmed` → Pago confirmado
5. `processing` → En procesamiento

## Notificaciones

El sistema envía notificaciones automáticas para:
- Orden creada
- Cotización lista
- Pago pendiente
- Pago confirmado
- Cambios de estado

## Consideraciones Técnicas

1. **Rendimiento**: El tarifario se carga una vez al inicializar el servicio
2. **Escalabilidad**: Fácil agregar nuevas rutas al CSV
3. **Mantenimiento**: Actualización del tarifario sin cambios de código
4. **Fallback**: Cotización manual como respaldo para rutas no disponibles

## Próximos Pasos

1. Integración con pasarelas de pago reales
2. Sistema de notificaciones por email/SMS
3. Dashboard de administración para cotizaciones manuales
4. Reportes de ventas y análisis de rutas
5. Optimización de rutas y precios dinámicos
