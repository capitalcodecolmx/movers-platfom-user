-- =====================================================
-- MIGRACIÓN PARA MUVERS PLATFORM - APLICACIÓN DE ENVÍOS
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLA DE USUARIOS
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'repartidor')),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE PERFILES DE USUARIO (información adicional)
-- =====================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'México',
    company_name VARCHAR(255),
    tax_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE PEDIDOS/ENVÍOS
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code VARCHAR(10) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'assigned', 'picked_up', 
        'in_transit', 'delivered', 'cancelled', 'failed'
    )),
    
    -- Información del paquete
    package_data JSONB NOT NULL, -- peso, dimensiones, descripción, valor declarado
    
    -- Direcciones
    pickup_address JSONB NOT NULL, -- dirección completa de recogida
    delivery_address JSONB NOT NULL, -- dirección completa de entrega
    
    -- Información de contacto
    pickup_contact JSONB NOT NULL, -- nombre, teléfono, email
    delivery_contact JSONB NOT NULL, -- nombre, teléfono, email
    
    -- Fechas y horarios
    pickup_date DATE,
    pickup_time TIME,
    delivery_date DATE,
    delivery_time TIME,
    
    -- Costos y pagos
    estimated_cost DECIMAL(10,2),
    final_cost DECIMAL(10,2),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'paid', 'failed', 'refunded'
    )),
    payment_method TEXT,
    payment_reference TEXT,
    
    -- Información bancaria para pagos
    bank_info JSONB, -- datos bancarios del cliente
    
    -- Asignación
    assigned_repartidor_id UUID REFERENCES users(id),
    assigned_vehicle_id UUID,
    
    -- Fechas de seguimiento
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    picked_up_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Notas y comentarios
    admin_notes TEXT,
    customer_notes TEXT,
    
    -- Archivos adjuntos
    attachments JSONB -- URLs de fotos, documentos, etc.
);

-- =====================================================
-- TABLA DE VEHÍCULOS/UNIDADES
-- =====================================================
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('moto', 'auto', 'van', 'camion', 'bicicleta')),
    license_plate VARCHAR(20) UNIQUE,
    capacity_kg DECIMAL(8,2),
    capacity_volume DECIMAL(8,2), -- en metros cúbicos
    is_active BOOLEAN DEFAULT true,
    current_location JSONB, -- lat, lng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE NOTIFICACIONES
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'order_created', 'order_processed', 'order_assigned', 
        'order_picked_up', 'order_in_transit', 'order_delivered',
        'order_cancelled', 'payment_confirmed', 'payment_failed',
        'quote_ready', 'admin_message'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- datos adicionales específicos del tipo de notificación
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE MENSAJES/CANAL DE COMUNICACIÓN
-- =====================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    attachments JSONB, -- URLs de archivos adjuntos
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE SEGUIMIENTO DE PEDIDOS
-- =====================================================
CREATE TABLE order_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    location JSONB, -- lat, lng, address
    notes TEXT,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE COTIZACIONES (historial de precios)
-- =====================================================
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    distance_km DECIMAL(8,2),
    weight_kg DECIMAL(8,2),
    volume_m3 DECIMAL(8,2),
    base_cost DECIMAL(10,2),
    additional_fees JSONB, -- comisiones, seguros, etc.
    total_cost DECIMAL(10,2),
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA DE CONFIGURACIÓN DE PRECIOS
-- =====================================================
CREATE TABLE pricing_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_type TEXT NOT NULL,
    base_price_per_km DECIMAL(8,2),
    price_per_kg DECIMAL(8,2),
    price_per_m3 DECIMAL(8,2),
    minimum_cost DECIMAL(8,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para usuarios
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Índices para pedidos
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_tracking_code ON orders(tracking_code);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_assigned_repartidor ON orders(assigned_repartidor_id);

-- Índices para notificaciones
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_order_id ON notifications(order_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Índices para mensajes
CREATE INDEX idx_messages_order_id ON messages(order_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = false;

-- Índices para seguimiento
CREATE INDEX idx_tracking_order_id ON order_tracking(order_id);
CREATE INDEX idx_tracking_created_at ON order_tracking(created_at);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para generar código de seguimiento único
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generar código de 8 caracteres alfanuméricos
        new_code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Verificar si ya existe
        SELECT EXISTS(SELECT 1 FROM orders WHERE tracking_code = new_code) INTO exists;
        
        -- Si no existe, salir del loop
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_config_updated_at BEFORE UPDATE ON pricing_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para generar código de seguimiento
CREATE OR REPLACE FUNCTION set_tracking_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tracking_code IS NULL OR NEW.tracking_code = '' THEN
        NEW.tracking_code := generate_tracking_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_tracking_code BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION set_tracking_code();

-- Función para crear notificaciones automáticas
CREATE OR REPLACE FUNCTION create_order_notification()
RETURNS TRIGGER AS $$
DECLARE
    notification_title TEXT;
    notification_message TEXT;
    notification_data JSONB;
BEGIN
    -- Determinar el tipo de notificación basado en el cambio de estado
    IF TG_OP = 'INSERT' THEN
        notification_title := 'Nuevo pedido creado';
        notification_message := 'Se ha creado un nuevo pedido con código: ' || NEW.tracking_code;
        notification_data := jsonb_build_object(
            'order_id', NEW.id,
            'tracking_code', NEW.tracking_code,
            'status', NEW.status
        );
        
        -- Notificar a todos los admins
        INSERT INTO notifications (user_id, order_id, type, title, message, data)
        SELECT id, NEW.id, 'order_created', notification_title, notification_message, notification_data
        FROM users WHERE role = 'admin' AND is_active = true;
        
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        -- Notificar cambio de estado
        CASE NEW.status
            WHEN 'processing' THEN
                notification_title := 'Pedido en procesamiento';
                notification_message := 'Tu pedido ' || NEW.tracking_code || ' está siendo procesado';
            WHEN 'assigned' THEN
                notification_title := 'Pedido asignado';
                notification_message := 'Tu pedido ' || NEW.tracking_code || ' ha sido asignado a un repartidor';
            WHEN 'picked_up' THEN
                notification_title := 'Pedido recogido';
                notification_message := 'Tu pedido ' || NEW.tracking_code || ' ha sido recogido';
            WHEN 'in_transit' THEN
                notification_title := 'Pedido en tránsito';
                notification_message := 'Tu pedido ' || NEW.tracking_code || ' está en camino';
            WHEN 'delivered' THEN
                notification_title := 'Pedido entregado';
                notification_message := 'Tu pedido ' || NEW.tracking_code || ' ha sido entregado';
            WHEN 'cancelled' THEN
                notification_title := 'Pedido cancelado';
                notification_message := 'Tu pedido ' || NEW.tracking_code || ' ha sido cancelado';
        END CASE;
        
        notification_data := jsonb_build_object(
            'order_id', NEW.id,
            'tracking_code', NEW.tracking_code,
            'old_status', OLD.status,
            'new_status', NEW.status
        );
        
        -- Notificar al usuario del pedido
        INSERT INTO notifications (user_id, order_id, type, title, message, data)
        VALUES (NEW.user_id, NEW.id, 'order_' || NEW.status, notification_title, notification_message, notification_data);
        
        -- Si se asigna un repartidor, notificar también al repartidor
        IF NEW.assigned_repartidor_id IS NOT NULL AND (OLD.assigned_repartidor_id IS NULL OR OLD.assigned_repartidor_id != NEW.assigned_repartidor_id) THEN
            INSERT INTO notifications (user_id, order_id, type, title, message, data)
            VALUES (NEW.assigned_repartidor_id, NEW.id, 'order_assigned', 
                   'Nuevo pedido asignado', 
                   'Se te ha asignado el pedido ' || NEW.tracking_code, 
                   notification_data);
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_notifications_trigger
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION create_order_notification();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar configuración de precios por defecto
INSERT INTO pricing_config (vehicle_type, base_price_per_km, price_per_kg, price_per_m3, minimum_cost) VALUES
('moto', 2.50, 0.50, 0.00, 15.00),
('auto', 3.00, 0.75, 0.00, 25.00),
('van', 4.00, 1.00, 0.00, 40.00),
('camion', 5.00, 1.50, 0.00, 60.00),
('bicicleta', 1.50, 0.25, 0.00, 10.00);

-- Insertar algunos vehículos de ejemplo
INSERT INTO vehicles (name, type, license_plate, capacity_kg, capacity_volume) VALUES
('Moto Express 1', 'moto', 'ABC-123', 50.00, 0.1),
('Auto Delivery 1', 'auto', 'DEF-456', 200.00, 1.0),
('Van Carga 1', 'van', 'GHI-789', 500.00, 3.0),
('Camión Grande 1', 'camion', 'JKL-012', 1000.00, 8.0);

-- =====================================================
-- POLÍTICAS RLS (Row Level Security) - OPCIONAL
-- =====================================================

-- Habilitar RLS en las tablas principales
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades específicas)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
);

-- =====================================================
-- COMENTARIOS EN TABLAS Y COLUMNAS
-- =====================================================

COMMENT ON TABLE users IS 'Usuarios del sistema con roles: user, admin, repartidor';
COMMENT ON TABLE orders IS 'Pedidos de envío con toda la información del paquete y direcciones';
COMMENT ON TABLE notifications IS 'Sistema de notificaciones en tiempo real';
COMMENT ON TABLE messages IS 'Canal de mensajería entre usuarios, admins y repartidores';
COMMENT ON TABLE vehicles IS 'Vehículos disponibles para asignar a pedidos';
COMMENT ON TABLE order_tracking IS 'Historial de seguimiento de cada pedido';
COMMENT ON TABLE quotes IS 'Historial de cotizaciones generadas';
COMMENT ON TABLE pricing_config IS 'Configuración de precios por tipo de vehículo';

COMMENT ON COLUMN orders.package_data IS 'JSON con: peso, dimensiones, descripción, valor declarado, fotos';
COMMENT ON COLUMN orders.pickup_address IS 'JSON con: calle, número, colonia, ciudad, estado, CP, coordenadas';
COMMENT ON COLUMN orders.delivery_address IS 'JSON con: calle, número, colonia, ciudad, estado, CP, coordenadas';
COMMENT ON COLUMN orders.pickup_contact IS 'JSON con: nombre, teléfono, email, horarios preferidos';
COMMENT ON COLUMN orders.delivery_contact IS 'JSON con: nombre, teléfono, email, horarios preferidos';
COMMENT ON COLUMN orders.bank_info IS 'JSON con: banco, cuenta, CLABE, nombre del titular';
COMMENT ON COLUMN orders.attachments IS 'JSON con URLs de fotos, documentos, comprobantes';
