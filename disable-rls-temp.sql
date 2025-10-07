-- =====================================================
-- DESHABILITAR RLS TEMPORALMENTE PARA DESARROLLO
-- =====================================================

-- Deshabilitar RLS en las tablas necesarias para el registro y login
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Verificar que RLS está deshabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'user_profiles');

-- Opcional: Habilitar RLS en otras tablas que sí queremos proteger
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

