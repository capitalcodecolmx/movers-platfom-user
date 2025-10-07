-- =====================================================
-- ACTUALIZACIÓN DE ESTADOS DE ÓRDENES - PROCESO DE PAGO
-- =====================================================

-- 1. Actualizar constraint de status en orders
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status = ANY (ARRAY[
  'pending'::text,           -- Pendiente (recién creada)
  'quote_pending'::text,     -- Cotización pendiente
  'quote_ready'::text,       -- Cotización lista
  'payment_pending'::text,   -- Pago pendiente
  'payment_confirmed'::text, -- Pago confirmado
  'processing'::text,        -- Procesando
  'assigned'::text,          -- Asignado a repartidor
  'picked_up'::text,         -- Recogido
  'in_transit'::text,        -- En tránsito
  'delivered'::text,         -- Entregado
  'cancelled'::text,         -- Cancelado
  'failed'::text             -- Fallido
]));

-- 2. Actualizar constraint de type en notifications
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type = ANY (ARRAY[
  'order_created'::text,
  'quote_pending'::text,
  'quote_ready'::text,
  'payment_pending'::text,
  'payment_confirmed'::text,
  'payment_failed'::text,
  'order_processed'::text,
  'order_assigned'::text,
  'order_picked_up'::text,
  'order_in_transit'::text,
  'order_delivered'::text,
  'order_cancelled'::text,
  'admin_message'::text
]));

-- 3. Agregar columna para solicitud de pago
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_requested_at timestamp with time zone;

-- 4. Agregar columna para confirmación de pago
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_confirmed_at timestamp with time zone;

-- 5. Crear función para generar solicitud de pago
CREATE OR REPLACE FUNCTION request_payment_for_order(order_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.orders 
  SET 
    status = 'payment_pending',
    payment_requested_at = now(),
    updated_at = now()
  WHERE id = order_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Crear función para confirmar pago
CREATE OR REPLACE FUNCTION confirm_payment_for_order(order_uuid uuid, payment_method_param text, payment_reference_param text)
RETURNS void AS $$
BEGIN
  UPDATE public.orders 
  SET 
    status = 'payment_confirmed',
    payment_status = 'paid',
    payment_method = payment_method_param,
    payment_reference = payment_reference_param,
    payment_confirmed_at = now(),
    updated_at = now()
  WHERE id = order_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Comentarios en las columnas
COMMENT ON COLUMN public.orders.payment_requested_at IS 'Timestamp cuando se solicitó el pago';
COMMENT ON COLUMN public.orders.payment_confirmed_at IS 'Timestamp cuando se confirmó el pago';

-- 8. Verificar cambios
SELECT 
  'Estados de órdenes actualizados' as status,
  COUNT(*) as total_orders
FROM public.orders;

SELECT 
  'Tipos de notificaciones actualizados' as status,
  COUNT(*) as total_notifications
FROM public.notifications;

