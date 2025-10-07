-- =====================================================
-- VERIFICACIÓN SIMPLE DE NOTIFICACIONES
-- =====================================================

-- 1. Verificar que la tabla notifications existe
SELECT 
    'Tabla notifications existe' as verificación,
    table_name,
    table_schema
FROM information_schema.tables 
WHERE table_name = 'notifications' 
AND table_schema = 'public';

-- 2. Verificar columnas de la tabla notifications
SELECT 
    'Columnas de notifications' as verificación,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar índices existentes
SELECT 
    'Índices de notifications' as verificación,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- 4. Verificar políticas RLS
SELECT 
    'Políticas RLS' as verificación,
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- 5. Verificar que RLS está habilitado
SELECT 
    'RLS habilitado' as verificación,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- 6. Verificar triggers
SELECT 
    'Triggers' as verificación,
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'notifications' 
AND event_object_schema = 'public';

-- 7. Verificar funciones de notificaciones
SELECT 
    'Funciones de notificaciones' as verificación,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%notify%';

-- 8. Verificar configuración de publicación realtime
SELECT 
    'Configuración realtime' as verificación,
    pubname,
    puballtables
FROM pg_publication 
WHERE pubname = 'supabase_realtime';

-- 9. Verificar que notifications está en la publicación
SELECT 
    'Tabla en publicación realtime' as verificación,
    tablename
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'notifications';

-- 10. Contar notificaciones existentes
SELECT 
    'Conteo de notificaciones' as verificación,
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN is_read = false THEN 1 END) as unread_notifications
FROM public.notifications;

-- =====================================================
-- COMANDOS PARA CONFIGURAR SI ES NECESARIO
-- =====================================================

-- Si la tabla no está en la publicación realtime:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Si RLS no está habilitado:
-- ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Si necesitas las políticas RLS básicas:
-- CREATE POLICY "Users can view their own notifications" ON public.notifications
--     FOR SELECT USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "Users can update their own notifications" ON public.notifications
--     FOR UPDATE USING (auth.uid() = user_id);
-- 
-- CREATE POLICY "System can insert notifications" ON public.notifications
--     FOR INSERT WITH CHECK (true);

-- =====================================================
-- PRUEBA SIMPLE DE INSERCIÓN
-- =====================================================

-- Para probar que las notificaciones funcionan (reemplaza 'your-user-id' con un ID real):
-- INSERT INTO public.notifications (user_id, type, title, message, data)
-- VALUES (
--     'your-user-id'::uuid, 
--     'admin_message', 
--     'Prueba de notificación', 
--     'Esta es una notificación de prueba', 
--     '{"test": true}'::jsonb
-- );

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que todo está configurado correctamente
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications' AND table_schema = 'public') 
        THEN '✅ Tabla notifications existe'
        ELSE '❌ Tabla notifications NO existe'
    END as estado_tabla,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notifications' AND rowsecurity = true) 
        THEN '✅ RLS habilitado'
        ELSE '❌ RLS NO habilitado'
    END as estado_rls,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_publication_tables WHERE tablename = 'notifications' AND pubname = 'supabase_realtime') 
        THEN '✅ Realtime configurado'
        ELSE '❌ Realtime NO configurado'
    END as estado_realtime;


