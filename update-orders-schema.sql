-- =====================================================
-- ACTUALIZACIÓN DEL ESQUEMA DE ÓRDENES
-- Hacer más flexible la tabla orders para campos opcionales
-- =====================================================

-- Hacer pickup_contact y delivery_contact opcionales (NULL permitido)
ALTER TABLE public.orders 
ALTER COLUMN pickup_contact DROP NOT NULL;

ALTER TABLE public.orders 
ALTER COLUMN delivery_contact DROP NOT NULL;

-- Hacer pickup_address y delivery_address opcionales también
ALTER TABLE public.orders 
ALTER COLUMN pickup_address DROP NOT NULL;

ALTER TABLE public.orders 
ALTER COLUMN delivery_address DROP NOT NULL;

-- Hacer package_data opcional
ALTER TABLE public.orders 
ALTER COLUMN package_data DROP NOT NULL;

-- Agregar comentarios para documentar los cambios
COMMENT ON COLUMN public.orders.pickup_contact IS 'Información de contacto del remitente (opcional)';
COMMENT ON COLUMN public.orders.delivery_contact IS 'Información de contacto del destinatario (opcional)';
COMMENT ON COLUMN public.orders.pickup_address IS 'Dirección de recogida (opcional)';
COMMENT ON COLUMN public.orders.delivery_address IS 'Dirección de entrega (opcional)';
COMMENT ON COLUMN public.orders.package_data IS 'Datos del paquete (opcional)';

-- Verificar que los cambios se aplicaron correctamente
SELECT 
    column_name, 
    is_nullable, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
AND column_name IN ('pickup_contact', 'delivery_contact', 'pickup_address', 'delivery_address', 'package_data')
ORDER BY column_name;
