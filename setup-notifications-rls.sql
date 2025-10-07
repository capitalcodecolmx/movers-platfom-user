-- =====================================================
-- CONFIGURACIÓN DE RLS PARA NOTIFICACIONES
-- =====================================================

-- Habilitar RLS en la tabla notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver sus propias notificaciones
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios solo puedan actualizar sus propias notificaciones (marcar como leídas)
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para que el sistema pueda insertar notificaciones (usado por triggers y funciones)
CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Política para que solo los admins puedan eliminar notificaciones
CREATE POLICY "Admins can delete notifications" ON public.notifications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- =====================================================
-- FUNCIÓN PARA CREAR NOTIFICACIONES AUTOMÁTICAS
-- =====================================================

-- Función para crear notificación cuando se crea una orden
CREATE OR REPLACE FUNCTION notify_order_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (
        user_id,
        order_id,
        type,
        title,
        message,
        data
    ) VALUES (
        NEW.user_id,
        NEW.id,
        'order_created',
        'Nueva orden creada',
        'Tu orden ' || NEW.tracking_code || ' ha sido creada exitosamente y está siendo procesada.',
        jsonb_build_object(
            'order_id', NEW.id,
            'tracking_code', NEW.tracking_code,
            'event_type', 'order_created'
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear notificación cuando se crea una orden
CREATE TRIGGER trigger_notify_order_created
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_order_created();

-- Función para crear notificación cuando se actualiza el estado de una orden
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
    notification_title TEXT;
    notification_message TEXT;
    notification_type TEXT;
BEGIN
    -- Solo crear notificación si el estado cambió
    IF OLD.status != NEW.status THEN
        -- Determinar el tipo de notificación y mensaje según el nuevo estado
        CASE NEW.status
            WHEN 'processing' THEN
                notification_type := 'order_processed';
                notification_title := 'Orden en procesamiento';
                notification_message := 'Tu orden ' || NEW.tracking_code || ' está siendo preparada para el envío.';
            WHEN 'assigned' THEN
                notification_type := 'order_assigned';
                notification_title := 'Repartidor asignado';
                notification_message := 'Hemos asignado un repartidor a tu orden ' || NEW.tracking_code || '.';
            WHEN 'picked_up' THEN
                notification_type := 'order_picked_up';
                notification_title := 'Paquete recogido';
                notification_message := 'Tu paquete ' || NEW.tracking_code || ' ha sido recogido y está en camino.';
            WHEN 'in_transit' THEN
                notification_type := 'order_in_transit';
                notification_title := 'Envío en tránsito';
                notification_message := 'Tu paquete ' || NEW.tracking_code || ' está en camino a su destino.';
            WHEN 'delivered' THEN
                notification_type := 'order_delivered';
                notification_title := 'Envío entregado';
                notification_message := '¡Tu paquete ' || NEW.tracking_code || ' ha sido entregado exitosamente!';
            WHEN 'cancelled' THEN
                notification_type := 'order_cancelled';
                notification_title := 'Orden cancelada';
                notification_message := 'Tu orden ' || NEW.tracking_code || ' ha sido cancelada.';
            ELSE
                -- No crear notificación para otros estados
                RETURN NEW;
        END CASE;

        INSERT INTO public.notifications (
            user_id,
            order_id,
            type,
            title,
            message,
            data
        ) VALUES (
            NEW.user_id,
            NEW.id,
            notification_type,
            notification_title,
            notification_message,
            jsonb_build_object(
                'order_id', NEW.id,
                'tracking_code', NEW.tracking_code,
                'status', NEW.status,
                'previous_status', OLD.status,
                'event_type', 'status_change'
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear notificación cuando se actualiza el estado de una orden
CREATE TRIGGER trigger_notify_order_status_change
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_order_status_change();

-- =====================================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- =====================================================

-- Índice para consultas por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
ON public.notifications(user_id, created_at DESC);

-- Índice para consultas por usuario y estado de lectura
CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
ON public.notifications(user_id, is_read);

-- Índice para consultas por orden
CREATE INDEX IF NOT EXISTS idx_notifications_order 
ON public.notifications(order_id);

-- Índice para consultas por tipo
CREATE INDEX IF NOT EXISTS idx_notifications_type 
ON public.notifications(type);

-- =====================================================
-- FUNCIÓN PARA LIMPIAR NOTIFICACIONES ANTIGUAS
-- =====================================================

-- Función para limpiar notificaciones leídas más antiguas de 30 días
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.notifications 
    WHERE is_read = true 
    AND created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE public.notifications IS 'Tabla para almacenar notificaciones del sistema';
COMMENT ON COLUMN public.notifications.user_id IS 'ID del usuario que recibe la notificación';
COMMENT ON COLUMN public.notifications.order_id IS 'ID de la orden relacionada (opcional)';
COMMENT ON COLUMN public.notifications.type IS 'Tipo de notificación: order_created, order_processed, etc.';
COMMENT ON COLUMN public.notifications.title IS 'Título de la notificación';
COMMENT ON COLUMN public.notifications.message IS 'Mensaje de la notificación';
COMMENT ON COLUMN public.notifications.data IS 'Datos adicionales en formato JSON';
COMMENT ON COLUMN public.notifications.is_read IS 'Indica si la notificación ha sido leída';
COMMENT ON FUNCTION notify_order_created() IS 'Crea una notificación cuando se crea una nueva orden';
COMMENT ON FUNCTION notify_order_status_change() IS 'Crea una notificación cuando cambia el estado de una orden';
COMMENT ON FUNCTION cleanup_old_notifications() IS 'Limpia notificaciones leídas más antiguas de 30 días';


