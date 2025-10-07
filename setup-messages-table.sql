-- =====================================================
-- CONFIGURACIÓN DE TABLA DE MENSAJES
-- =====================================================

-- 1. Crear la tabla de mensajes si no existe
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  order_id uuid NULL,
  sender_id uuid NULL,
  recipient_id uuid NULL,
  message text NOT NULL,
  message_type text NULL DEFAULT 'text'::text,
  attachments jsonb NULL,
  is_read boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT messages_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT messages_message_type_check CHECK (
    message_type = ANY (
      ARRAY[
        'text'::text,
        'image'::text,
        'file'::text,
        'system'::text
      ]
    )
  )
) TABLESPACE pg_default;

-- 2. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON public.messages USING btree (order_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages USING btree (sender_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages USING btree (recipient_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages USING btree (recipient_id, is_read) TABLESPACE pg_default
WHERE (is_read = false);

-- 3. Habilitar RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas RLS

-- Política para que los usuarios puedan ver sus propios mensajes
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

-- Política para que los usuarios puedan insertar mensajes donde son remitente
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
  );

-- Política para que los usuarios puedan actualizar mensajes donde son destinatario
CREATE POLICY "Users can mark messages as read" ON public.messages
  FOR UPDATE USING (
    recipient_id = auth.uid()
  );

-- Política para que los admins puedan ver todos los mensajes
CREATE POLICY "Admins can view all messages" ON public.messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 5. Habilitar real-time para la tabla de mensajes
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 6. Crear función para obtener información del destinatario
CREATE OR REPLACE FUNCTION get_order_recipient(order_uuid uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  role text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.full_name,
    u.email,
    u.role
  FROM orders o
  LEFT JOIN users u ON (
    CASE 
      WHEN o.assigned_repartidor_id IS NOT NULL THEN u.id = o.assigned_repartidor_id
      ELSE u.role = 'admin'
    END
  )
  WHERE o.id = order_uuid
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Comentarios en la tabla
COMMENT ON TABLE public.messages IS 'Tabla para almacenar mensajes entre usuarios y admins/repartidores sobre órdenes específicas';
COMMENT ON COLUMN public.messages.order_id IS 'ID de la orden relacionada';
COMMENT ON COLUMN public.messages.sender_id IS 'ID del usuario que envía el mensaje';
COMMENT ON COLUMN public.messages.recipient_id IS 'ID del usuario que recibe el mensaje';
COMMENT ON COLUMN public.messages.message IS 'Contenido del mensaje';
COMMENT ON COLUMN public.messages.message_type IS 'Tipo de mensaje: text, image, file, system';
COMMENT ON COLUMN public.messages.attachments IS 'Archivos adjuntos en formato JSON';
COMMENT ON COLUMN public.messages.is_read IS 'Indica si el mensaje ha sido leído';

-- 8. Verificar que todo esté configurado correctamente
SELECT 
  'Tabla messages creada' as status,
  COUNT(*) as total_messages
FROM public.messages;

SELECT 
  'Políticas RLS configuradas' as status,
  COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'messages';

SELECT 
  'Real-time habilitado' as status,
  COUNT(*) as realtime_tables
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'messages';


