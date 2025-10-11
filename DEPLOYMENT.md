# Guía de Despliegue en Vercel

## Configuración de Variables de Entorno en Vercel

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Settings → Environment Variables**
3. **Agrega las siguientes variables:**

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
VITE_OPENROUTESERVICE_API_KEY=tu-api-key-aqui
```

## Configuración de Vercel (vercel.json)

El archivo `vercel.json` ya está configurado con:
- **Rewrites**: Para manejar el routing de SPA
- **Headers**: Para seguridad

## Configuración de Supabase

### 1. Configurar Autenticación
- Ve a **Authentication → Settings**
- Configura **Site URL**: `https://tu-dominio.vercel.app`
- Configura **Redirect URLs**: `https://tu-dominio.vercel.app/**`

### 2. Configurar Row Level Security (RLS)
```sql
-- Habilitar RLS en las tablas
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas para orders
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
FOR UPDATE USING (auth.uid() = user_id);
```

## Problemas Comunes y Soluciones

### 1. Error 404 al recargar página
**Solución**: El archivo `vercel.json` ya está configurado para manejar esto.

### 2. Sesión se pierde al recargar
**Solución**: 
- Verificar que `persistSession: true` esté en la configuración de Supabase
- Verificar que las variables de entorno estén configuradas correctamente
- Verificar que el dominio esté en las URLs permitidas en Supabase

### 3. CORS Errors
**Solución**: Configurar correctamente las URLs en Supabase Auth settings.

## Comandos de Despliegue

```bash
# Instalar dependencias
npm install

# Construir para producción
npm run build

# Desplegar en Vercel
vercel --prod
```

## Verificación Post-Despliegue

1. ✅ **Autenticación**: Probar login/logout
2. ✅ **Persistencia**: Recargar página y verificar que la sesión persiste
3. ✅ **Routing**: Navegar a rutas directamente y verificar que no den 404
4. ✅ **Funcionalidad**: Probar crear órdenes, ver dashboard, etc.

## Troubleshooting

### Logs en Vercel
```bash
# Ver logs en tiempo real
vercel logs tu-proyecto

# Ver logs específicos
vercel logs tu-proyecto --follow
```

### Debug en el navegador
- Abrir DevTools → Console
- Verificar que no hay errores de autenticación
- Verificar que las variables de entorno estén cargadas

### Verificar Supabase
- Ir a Supabase Dashboard → Authentication → Users
- Verificar que los usuarios se están creando correctamente
- Verificar logs en Authentication → Logs
