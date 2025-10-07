-- =====================================================
-- ACTUALIZACIÓN DE TABLAS PARA FLUJO DE ÓRDENES
-- =====================================================

-- Agregar campos faltantes a la tabla orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS package_type VARCHAR(50); -- tipo de paquete
ALTER TABLE orders ADD COLUMN IF NOT EXISTS package_value DECIMAL(10,2); -- valor declarado
ALTER TABLE orders ADD COLUMN IF NOT EXISTS special_instructions TEXT; -- instrucciones especiales
ALTER TABLE orders ADD COLUMN IF NOT EXISTS insurance_required BOOLEAN DEFAULT false; -- seguro requerido
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fragile BOOLEAN DEFAULT false; -- frágil
ALTER TABLE orders ADD COLUMN IF NOT EXISTS urgent BOOLEAN DEFAULT false; -- urgente

-- Agregar campos de cálculo de distancia y tarifa
ALTER TABLE orders ADD COLUMN IF NOT EXISTS distance_km DECIMAL(8,2); -- distancia en km
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER; -- duración estimada
ALTER TABLE orders ADD COLUMN IF NOT EXISTS base_fare DECIMAL(8,2); -- tarifa base
ALTER TABLE orders ADD COLUMN IF NOT EXISTS distance_fare DECIMAL(8,2); -- tarifa por distancia
ALTER TABLE orders ADD COLUMN IF NOT EXISTS weight_fare DECIMAL(8,2); -- tarifa por peso
ALTER TABLE orders ADD COLUMN IF NOT EXISTS additional_charges DECIMAL(8,2) DEFAULT 0; -- cargos adicionales

-- Actualizar tabla pricing_config con más opciones
ALTER TABLE pricing_config ADD COLUMN IF NOT EXISTS price_per_km DECIMAL(8,2); -- precio por km
ALTER TABLE pricing_config ADD COLUMN IF NOT EXISTS price_per_minute DECIMAL(8,2); -- precio por minuto
ALTER TABLE pricing_config ADD COLUMN IF NOT EXISTS urgent_multiplier DECIMAL(3,2) DEFAULT 1.5; -- multiplicador urgente
ALTER TABLE pricing_config ADD COLUMN IF NOT EXISTS fragile_fee DECIMAL(8,2) DEFAULT 0; -- cargo por frágil
ALTER TABLE pricing_config ADD COLUMN IF NOT EXISTS insurance_fee DECIMAL(8,2) DEFAULT 0; -- cargo por seguro

-- Crear tabla para tipos de paquetes
CREATE TABLE IF NOT EXISTS package_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_weight_kg DECIMAL(8,2),
    max_weight_kg DECIMAL(8,2),
    base_volume_m3 DECIMAL(8,2),
    max_volume_m3 DECIMAL(8,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar tipos de paquetes comunes
INSERT INTO package_types (name, description, base_weight_kg, max_weight_kg, base_volume_m3, max_volume_m3) VALUES
('Documentos', 'Documentos importantes, cartas, certificados', 0.1, 2.0, 0.001, 0.01),
('Electrónicos', 'Dispositivos electrónicos, computadoras, celulares', 0.5, 10.0, 0.01, 0.1),
('Ropa', 'Prendas de vestir, textiles', 0.2, 5.0, 0.01, 0.05),
('Alimentos', 'Comida, bebidas, productos perecederos', 0.5, 15.0, 0.01, 0.1),
('Farmacéuticos', 'Medicamentos, productos de salud', 0.1, 3.0, 0.001, 0.02),
('Regalos', 'Objetos de regalo, juguetes', 0.3, 8.0, 0.01, 0.08),
('Herramientas', 'Herramientas, equipos de trabajo', 1.0, 25.0, 0.05, 0.2),
('Otros', 'Otros tipos de paquetes', 0.1, 50.0, 0.001, 1.0)
ON CONFLICT DO NOTHING;

-- Crear tabla para rangos de peso y vehículos sugeridos
CREATE TABLE IF NOT EXISTS weight_vehicle_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    min_weight_kg DECIMAL(8,2) NOT NULL,
    max_weight_kg DECIMAL(8,2) NOT NULL,
    suggested_vehicles TEXT[] NOT NULL, -- array de tipos de vehículos sugeridos
    priority_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar sugerencias de vehículos por peso
INSERT INTO weight_vehicle_suggestions (min_weight_kg, max_weight_kg, suggested_vehicles, priority_order) VALUES
(0, 2, ARRAY['bicicleta', 'moto'], 1),
(2, 10, ARRAY['moto', 'auto'], 1),
(10, 50, ARRAY['auto', 'van'], 1),
(50, 200, ARRAY['van', 'camion'], 1),
(200, 1000, ARRAY['camion'], 1)
ON CONFLICT DO NOTHING;

-- Crear tabla para configuración de tarifas por zona
CREATE TABLE IF NOT EXISTS zone_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name VARCHAR(100) NOT NULL,
    base_fare DECIMAL(8,2) NOT NULL,
    price_per_km DECIMAL(8,2) NOT NULL,
    minimum_fare DECIMAL(8,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración de zonas (ejemplo para México)
INSERT INTO zone_pricing (zone_name, base_fare, price_per_km, minimum_fare) VALUES
('Zona Centro', 25.00, 3.50, 30.00),
('Zona Norte', 30.00, 4.00, 35.00),
('Zona Sur', 28.00, 3.75, 32.00),
('Zona Este', 26.00, 3.60, 31.00),
('Zona Oeste', 27.00, 3.70, 33.00)
ON CONFLICT DO NOTHING;

-- Actualizar tabla vehicles con más información
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS image TEXT; -- URL de imagen del vehículo
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS description TEXT; -- descripción del vehículo
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS max_distance_km DECIMAL(8,2); -- distancia máxima
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS fuel_type VARCHAR(50); -- tipo de combustible
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true; -- disponibilidad

-- Insertar más vehículos de ejemplo
INSERT INTO vehicles (name, type, license_plate, capacity_kg, capacity_volume, description, max_distance_km, fuel_type) VALUES
('Bicicleta Express 1', 'bicicleta', 'BIKE-001', 5.00, 0.05, 'Bicicleta para envíos ligeros y rápidos', 10.00, 'Humano'),
('Bicicleta Express 2', 'bicicleta', 'BIKE-002', 5.00, 0.05, 'Bicicleta para envíos ligeros y rápidos', 10.00, 'Humano'),
('Moto Express 2', 'moto', 'MOTO-002', 50.00, 0.1, 'Motocicleta para envíos medianos', 50.00, 'Gasolina'),
('Auto Delivery 2', 'auto', 'AUTO-002', 200.00, 1.0, 'Automóvil para envíos medianos', 100.00, 'Gasolina'),
('Van Carga 2', 'van', 'VAN-002', 500.00, 3.0, 'Van para envíos grandes', 200.00, 'Diesel'),
('Camión Grande 2', 'camion', 'CAM-002', 1000.00, 8.0, 'Camión para envíos muy grandes', 500.00, 'Diesel')
ON CONFLICT (license_plate) DO NOTHING;

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_orders_package_type ON orders(package_type);
CREATE INDEX IF NOT EXISTS idx_orders_distance_km ON orders(distance_km);
CREATE INDEX IF NOT EXISTS idx_orders_urgent ON orders(urgent);
CREATE INDEX IF NOT EXISTS idx_vehicles_type_available ON vehicles(type, is_available);
CREATE INDEX IF NOT EXISTS idx_weight_suggestions_weight ON weight_vehicle_suggestions(min_weight_kg, max_weight_kg);

-- Comentarios en las nuevas columnas
COMMENT ON COLUMN orders.package_type IS 'Tipo de paquete: documentos, electrónicos, ropa, etc.';
COMMENT ON COLUMN orders.package_value IS 'Valor declarado del paquete para seguros';
COMMENT ON COLUMN orders.special_instructions IS 'Instrucciones especiales para el manejo del paquete';
COMMENT ON COLUMN orders.insurance_required IS 'Si el paquete requiere seguro';
COMMENT ON COLUMN orders.fragile IS 'Si el paquete es frágil';
COMMENT ON COLUMN orders.urgent IS 'Si el envío es urgente';
COMMENT ON COLUMN orders.distance_km IS 'Distancia calculada en kilómetros';
COMMENT ON COLUMN orders.estimated_duration_minutes IS 'Duración estimada en minutos';
COMMENT ON COLUMN orders.base_fare IS 'Tarifa base del envío';
COMMENT ON COLUMN orders.distance_fare IS 'Tarifa calculada por distancia';
COMMENT ON COLUMN orders.weight_fare IS 'Tarifa calculada por peso';
COMMENT ON COLUMN orders.additional_charges IS 'Cargos adicionales (urgente, frágil, seguro)';

