# 🔐 Guía para Crear Usuarios Administradores

Esta guía te mostrará cómo crear usuarios administradores directamente en Supabase. Los usuarios normales se registran a través de la aplicación, pero los administradores deben crearse manualmente por seguridad.

---

## 📋 Requisitos Previos

- Acceso al Dashboard de Supabase
- Proyecto: `dthrctnmrerpxtzvjoab`
- URL: `https://dthrctnmrerpxtzvjoab.supabase.co`

---

## 🚀 Método 1: Crear Admin desde Supabase Dashboard (Recomendado)

### Paso 1: Acceder al Dashboard de Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: **Movers Platform**

### Paso 2: Ir a Authentication

1. En el menú lateral, haz clic en **Authentication**
2. Selecciona **Users** en el submenú

### Paso 3: Crear Nuevo Usuario

1. Haz clic en el botón **"Add user"** o **"Invite user"**
2. Completa el formulario:
   - **Email**: `admin@tudominio.com` (o el email que desees)
   - **Password**: Crea una contraseña segura
   - **Auto Confirm User**: ✅ Marca esta casilla (importante)

### Paso 4: Configurar Metadata del Usuario

1. Después de crear el usuario, haz clic en el usuario recién creado
2. Ve a la sección **"User Metadata"** o **"Raw User Meta Data"**
3. Haz clic en **"Edit"** o el icono de edición
4. Agrega los siguientes campos JSON:

```json
{
  "full_name": "Nombre del Administrador",
  "phone": "+52 55 1234 5678",
  "role": "admin"
}
```

5. Guarda los cambios

### Paso 5: Verificar que el Trigger Funcionó

1. Ve a **Table Editor** en el menú lateral
2. Selecciona la tabla **`users`** (en el schema `public`)
3. Verifica que existe un registro con:
   - `email`: El email que usaste
   - `role`: `admin`
   - `full_name`: El nombre que configuraste

✅ **¡Listo!** El usuario admin está creado y puede iniciar sesión.

---

## 🛠️ Método 2: Crear Admin usando SQL (Alternativo)

Si prefieres usar SQL directamente:

### Paso 1: Ir a SQL Editor

1. En el Dashboard de Supabase, ve a **SQL Editor**
2. Haz clic en **"New query"**

### Paso 2: Ejecutar el Script

Copia y pega este script, reemplazando los valores:

```sql
-- Crear usuario en auth.users (esto lo hace Supabase automáticamente)
-- Primero necesitas crear el usuario desde el Dashboard de Authentication
-- Luego ejecuta esto para actualizar el rol:

-- Reemplaza 'admin@tudominio.com' con el email del admin
UPDATE public.users
SET role = 'admin'
WHERE email = 'admin@tudominio.com';

-- También actualiza el metadata en auth.users
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@tudominio.com';
```

### Paso 3: Verificar

```sql
-- Verificar que el admin fue creado correctamente
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.is_active
FROM public.users u
WHERE u.role = 'admin';
```

---

## 🔄 Método 3: Usar la Función update_user_role (Si ya existe un usuario)

Si ya tienes un usuario registrado y quieres convertirlo en admin:

### Paso 1: Obtener el User ID

1. Ve a **Table Editor** → **users**
2. Encuentra el usuario que quieres convertir
3. Copia su `id` (UUID)

### Paso 2: Ejecutar en SQL Editor

```sql
-- Reemplaza 'USER_ID_AQUI' con el UUID del usuario
SELECT public.update_user_role(
  'USER_ID_AQUI'::uuid,
  'admin'
);
```

**Nota**: Solo puedes ejecutar esto si ya eres admin. Si es el primer admin, usa el Método 1 o 2.

---

## ✅ Verificación Final

### Verificar que el Admin Puede Iniciar Sesión

1. Ve a tu aplicación: `http://localhost:5173/login` (o tu URL de producción)
2. Inicia sesión con:
   - **Email**: El email del admin
   - **Password**: La contraseña que configuraste
3. Deberías poder acceder al dashboard

### Verificar Permisos de Admin

El admin debería tener acceso a:
- ✅ Ver todas las órdenes (no solo las suyas)
- ✅ Actualizar cualquier orden
- ✅ Ver todos los usuarios
- ✅ Gestionar vehículos
- ✅ Gestionar configuración de precios

---

## 🔒 Seguridad

### Buenas Prácticas

1. **Contraseñas Fuertes**: Usa contraseñas complejas para admins
2. **2FA**: Habilita autenticación de dos factores en Supabase
3. **Roles Mínimos**: Solo crea admins cuando sea necesario
4. **Auditoría**: Revisa regularmente quién tiene rol de admin

### Cambiar Rol de Admin a User

Si necesitas quitar permisos de admin:

```sql
SELECT public.update_user_role(
  'USER_ID_AQUI'::uuid,
  'user'
);
```

---

## 🆘 Solución de Problemas

### Problema: El trigger no creó el registro en public.users

**Solución**: Ejecuta manualmente:

```sql
-- Reemplaza con los datos del usuario
INSERT INTO public.users (
  id,
  email,
  full_name,
  phone,
  role,
  is_active
)
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'phone',
  COALESCE(raw_user_meta_data->>'role', 'user'),
  true
FROM auth.users
WHERE email = 'admin@tudominio.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
```

### Problema: No puedo iniciar sesión

**Verificaciones**:
1. ¿El usuario está confirmado? (Auto Confirm User debe estar marcado)
2. ¿El email está correcto?
3. ¿La contraseña es correcta?
4. ¿Existe el registro en `public.users`?

### Problema: El rol no se actualiza

**Solución**: Ejecuta ambos updates:

```sql
-- Actualizar en public.users
UPDATE public.users SET role = 'admin' WHERE email = 'admin@tudominio.com';

-- Actualizar en auth.users metadata
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'admin@tudominio.com';
```

---

## 📝 Notas Importantes

1. **El trigger automático** (`on_auth_user_created`) crea el registro en `public.users` cuando se crea un usuario en `auth.users`
2. **El rol por defecto** es `'user'` - solo los admins deben tener `'admin'`
3. **Los repartidores** también se crean manualmente con rol `'repartidor'`
4. **La aplicación** solo permite registro de usuarios normales (`'user'`)

---

## 🎯 Resumen Rápido

1. Ve a Supabase Dashboard → Authentication → Users
2. Crea nuevo usuario con email y contraseña
3. Marca "Auto Confirm User"
4. Agrega metadata: `{"full_name": "...", "role": "admin"}`
5. Verifica en Table Editor que el registro existe en `public.users` con `role = 'admin'`
6. Inicia sesión en la aplicación

---

**¿Necesitas ayuda?** Revisa los logs en Supabase Dashboard → Logs → API o consulta la documentación de Supabase.

