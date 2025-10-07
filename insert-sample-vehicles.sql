-- =====================================================
-- INSERTAR VEHÍCULOS DE EJEMPLO EN LA BASE DE DATOS
-- =====================================================

-- Insertar vehículos de ejemplo con diferentes capacidades e imágenes
INSERT INTO vehicles (name, type, license_plate, capacity_kg, capacity_volume, is_active, image) VALUES
-- Bicicletas (para paquetes ligeros)
('Bicicleta Express 1', 'bicicleta', 'BIKE-001', 5.00, 0.05, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Bicicleta Express 2', 'bicicleta', 'BIKE-002', 5.00, 0.05, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Bicicleta Express 3', 'bicicleta', 'BIKE-003', 5.00, 0.05, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),

-- Motocicletas (para paquetes medianos)
('Moto Express 1', 'moto', 'MOTO-001', 50.00, 0.1, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Moto Express 2', 'moto', 'MOTO-002', 50.00, 0.1, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Moto Express 3', 'moto', 'MOTO-003', 50.00, 0.1, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),

-- Automóviles (para paquetes grandes)
('Auto Delivery 1', 'auto', 'AUTO-001', 200.00, 1.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Auto Delivery 2', 'auto', 'AUTO-002', 200.00, 1.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Auto Delivery 3', 'auto', 'AUTO-003', 200.00, 1.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),

-- Vans (para paquetes voluminosos)
('Van Carga 1', 'van', 'VAN-001', 500.00, 3.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Van Carga 2', 'van', 'VAN-002', 500.00, 3.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Van Carga 3', 'van', 'VAN-003', 500.00, 3.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),

-- Camiones (para paquetes muy grandes)
('Camión Grande 1', 'camion', 'CAM-001', 1000.00, 8.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Camión Grande 2', 'camion', 'CAM-002', 1000.00, 8.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Camión Grande 3', 'camion', 'CAM-003', 1000.00, 8.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),

-- Vehículos especiales con capacidades intermedias
('Moto Pesada 1', 'moto', 'MOTO-H1', 100.00, 0.2, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Auto Grande 1', 'auto', 'AUTO-H1', 300.00, 1.5, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),
('Van Pequeña 1', 'van', 'VAN-S1', 300.00, 2.0, true, 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=200&fit=crop&crop=center'),

-- Vehículos inactivos (para pruebas)
('Bicicleta Rota', 'bicicleta', 'BIKE-BROKEN', 5.00, 0.05, false, null),
('Moto en Mantenimiento', 'moto', 'MOTO-MAINT', 50.00, 0.1, false, null)

ON CONFLICT (license_plate) DO NOTHING;

-- Verificar que los vehículos se insertaron correctamente
SELECT 
    name,
    type,
    license_plate,
    capacity_kg,
    capacity_volume,
    is_active
FROM vehicles 
WHERE is_active = true
ORDER BY capacity_kg ASC;
