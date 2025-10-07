-- =====================================================
-- PRUEBA SIMPLE DE NOTIFICACIONES
-- =====================================================

-- IMPORTANTE: Reemplaza 'your-user-id-here' con un ID de usuario real de tu base de datos

-- 1. Crear una notificación de prueba
INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data
) VALUES (
    'your-user-id-here'::uuid,  -- CAMBIAR POR UN ID REAL
    'admin_message',
    'Notificación de prueba',
    'Esta es una notificación de prueba creada directamente en la base de datos.',
    '{"test": true, "timestamp": "' || NOW()::text || '"}'::jsonb
);

-- 2. Verificar que la notificación se creó
SELECT 
    'Notificación creada' as resultado,
    id,
    title,
    message,
    is_read,
    created_at
FROM public.notifications 
WHERE title = 'Notificación de prueba'
ORDER BY created_at DESC 
LIMIT 1;

-- 3. Marcar la notificación como leída
UPDATE public.notifications 
SET is_read = true 
WHERE title = 'Notificación de prueba' 
AND is_read = false;

-- 4. Verificar que se marcó como leída
SELECT 
    'Notificación marcada como leída' as resultado,
    id,
    title,
    is_read,
    updated_at
FROM public.notifications 
WHERE title = 'Notificación de prueba'
ORDER BY created_at DESC 
LIMIT 1;

-- 5. Crear una notificación asociada a una orden (si tienes órdenes)
-- NOTA: Esto solo funcionará si tienes órdenes en tu base de datos
INSERT INTO public.notifications (
    user_id,
    order_id,
    type,
    title,
    message,
    data
) VALUES (
    'your-user-id-here'::uuid,  -- CAMBIAR POR UN ID REAL
    (SELECT id FROM public.orders LIMIT 1), -- Usar la primera orden si existe
    'order_created',
    'Orden de prueba',
    'Esta es una notificación asociada a una orden.',
    '{"test_order": true}'::jsonb
);

-- 6. Verificar notificaciones por usuario
SELECT 
    'Notificaciones del usuario' as resultado,
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN is_read = false THEN 1 END) as unread_notifications
FROM public.notifications 
WHERE user_id = 'your-user-id-here'::uuid;  -- CAMBIAR POR UN ID REAL

-- 7. Ver todas las notificaciones del usuario
SELECT 
    'Lista de notificaciones' as resultado,
    id,
    type,
    title,
    is_read,
    created_at
FROM public.notifications 
WHERE user_id = 'your-user-id-here'::uuid  -- CAMBIAR POR UN ID REAL
ORDER BY created_at DESC;

-- =====================================================
-- PRUEBA DE REALTIME (MANUAL)
-- =====================================================

-- Para probar realtime, ejecuta este INSERT en una sesión
-- y verifica en la aplicación que aparece automáticamente:

/*
INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message
) VALUES (
    'your-user-id-here'::uuid,  -- CAMBIAR POR UN ID REAL
    'admin_message',
    'Prueba de Realtime',
    'Esta notificación debería aparecer automáticamente en la aplicación.'
);
*/

-- =====================================================
-- LIMPIEZA (OPCIONAL)
-- =====================================================

-- Si quieres limpiar las notificaciones de prueba:
/*
DELETE FROM public.notifications 
WHERE title IN ('Notificación de prueba', 'Orden de prueba', 'Prueba de Realtime');
*/


