# Admin Dashboard

Dashboard de administración para gestionar el sistema completo.

## Estructura de Carpetas

```
admin/dashboard/
├── components/          # Componentes reutilizables
│   ├── AdminDashboardHeader.tsx
│   ├── AdminStatsCards.tsx
│   ├── AdminQuickActions.tsx
│   ├── AdminSystemInfo.tsx
│   └── AdminDashboardSkeleton.tsx
├── utils/               # Utilidades y configuraciones
│   ├── statCardsConfig.tsx
│   └── quickActionsConfig.tsx
├── types.ts             # Tipos TypeScript
├── AdminDashboardPage.tsx  # Componente principal
└── index.ts             # Barrel exports
```

## Estado (Zustand)

El estado se maneja con Zustand en `src/store/useAdminStore.ts`:

- **Stats**: Estadísticas del sistema (órdenes, usuarios, ingresos, etc.)
- **Loading**: Estado de carga
- **Error**: Manejo de errores
- **Cache**: Cache de 30 segundos para optimizar rendimiento

## Componentes

### AdminDashboardPage
Componente principal que orquesta todos los subcomponentes.

### AdminStatsCards
Muestra las tarjetas de estadísticas. Cada tarjeta es clickeable y navega a la sección correspondiente.

### AdminQuickActions
Botones de acciones rápidas para acceder a las diferentes secciones de administración.

### AdminSystemInfo
Muestra información importante del sistema (órdenes pendientes, rendimiento, etc.).

### AdminDashboardSkeleton
Componente de carga mientras se obtienen los datos.

## Uso

```tsx
import AdminDashboardPage from '@/pages/admin/dashboard';

// En las rutas
<Route path="/admin/dashboard" element={<AdminDashboardPage />} />
```

## Agregar Nuevas Estadísticas

1. Actualizar `AdminStats` interface en `useAdminStore.ts`
2. Agregar la lógica de cálculo en `fetchStats`
3. Agregar la tarjeta en `statCardsConfig.tsx`

## Agregar Nuevas Acciones Rápidas

1. Agregar la acción en `quickActionsConfig.tsx`
2. La navegación se maneja automáticamente

