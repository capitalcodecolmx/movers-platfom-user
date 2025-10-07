-- =====================================================
-- CONFIGURACIÓN SIMPLE DE RLS PARA NOTIFICACIONES
-- =====================================================

-- Habilitar RLS en la tabla notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay (para evitar conflictos)
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON public.notifications;

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

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS trigger_notify_order_created ON public.orders;

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

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS trigger_notify_order_status_change ON public.orders;

-- Trigger para crear notificación cuando se actualiza el estado de una orden
CREATE TRIGGER trigger_notify_order_status_change
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_order_status_change();

-- =====================================================
-- CONFIGURAR REALTIME
-- =====================================================

-- Agregar la tabla notifications a la publicación realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que todo está configurado
SELECT 
    'Configuración completada' as estado,
    'RLS habilitado: ' || rowsecurity as rls_status,
    'Realtime configurado' as realtime_status
FROM pg_tables 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- Mostrar políticas creadas
SELECT 
    'Políticas RLS creadas' as info,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- Mostrar triggers creados
SELECT 
    'Triggers creados' as info,
    trigger_name,
    event_manipulation
FROM information_schema.triggers 
WHERE event_object_table = 'notifications' 
AND event_object_schema = 'public';


