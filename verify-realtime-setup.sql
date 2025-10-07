-- =====================================================
-- VERIFICACIÓN DE CONFIGURACIÓN REALTIME PARA NOTIFICACIONES
-- =====================================================

-- 1. Verificar que la tabla notifications existe
SELECT 
    table_name,
    table_schema,
    is_insertable_into
FROM information_schema.tables 
WHERE table_name = 'notifications' 
AND table_schema = 'public';

-- 2. Verificar que las columnas necesarias existen
SELECT 
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
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- 4. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- 5. Verificar que RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- 6. Verificar triggers existentes
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'notifications' 
AND event_object_schema = 'public';

-- 7. Verificar funciones relacionadas con notificaciones
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%notify%';

-- 8. Verificar configuración de publicación para realtime
SELECT 
    pubname,
    puballtables,
    pubinsert,
    pubupdate,
    pubdelete,
    pubtruncate
FROM pg_publication 
WHERE pubname = 'supabase_realtime';

-- 9. Verificar que la tabla está en la publicación
SELECT 
    schemaname,
    tablename
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'notifications';

-- 10. Verificar estadísticas de la tabla
SELECT 
    schemaname,
    tablename,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables 
WHERE relname = 'notifications';

-- =====================================================
-- COMANDOS PARA HABILITAR REALTIME (SI ES NECESARIO)
-- =====================================================

-- Si la tabla no está en la publicación, ejecutar:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Si RLS no está habilitado, ejecutar:
-- ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Para verificar que realtime funciona, ejecutar en otra sesión:
-- INSERT INTO public.notifications (user_id, type, title, message) 
-- VALUES ('your-user-id', 'order_created', 'Test', 'Test notification');

-- =====================================================
-- VERIFICACIÓN DE PERMISOS DE USUARIO
-- =====================================================

-- Verificar permisos del usuario actual
SELECT 
    grantee,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'notifications' 
AND table_schema = 'public'
AND grantee = current_user;

-- Verificar roles del usuario
SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin,
    rolreplication,
    rolconnlimit,
    rolpassword,
    rolvaliduntil
FROM pg_roles 
WHERE rolname = current_user;
