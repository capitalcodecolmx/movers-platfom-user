-- =====================================================
-- SCRIPT PARA INSERTAR ÓRDENES DE PRUEBA
-- =====================================================

-- Primero, necesitamos obtener el ID del usuario actual
-- Reemplaza 'USER_EMAIL_HERE' con el email del usuario que creó las órdenes
-- O usa el ID directamente si lo conoces

-- Insertar órdenes de prueba
INSERT INTO orders (
  tracking_code,
  user_id,
  status,
  package_data,
  pickup_address,
  delivery_address,
  pickup_contact,
  delivery_contact,
  pickup_date,
  pickup_time,
  delivery_date,
  delivery_time,
  estimated_cost,
  assigned_vehicle_id,
  customer_notes
) VALUES 
-- Orden 1
(
  'MV-TEST001',
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  'pending',
  '{
    "type": "documentos",
    "description": "Documentos importantes",
    "weight": 0.5,
    "dimensions": {"length": 20, "width": 15, "height": 2},
    "value": 0,
    "special_instructions": "Manejar con cuidado",
    "insurance_required": false,
    "fragile": true,
    "urgent": false
  }',
  '{
    "street": "Eugenio de la Croix",
    "number": "1120",
    "neighborhood": "Jarachina Sur",
    "city": "Reynosa",
    "state": "Tamaulipas",
    "full": "Eugenio de la Croix 1120, Jarachina Sur, Reynosa, Tamaulipas"
  }',
  '{
    "street": "Francisco de Goya",
    "number": "651",
    "neighborhood": "Jarachina Sur",
    "city": "Reynosa",
    "state": "Tamaulipas",
    "full": "Francisco de Goya 651, Jarachina Sur, Reynosa, Tamaulipas"
  }',
  '{
    "name": "Juan Pérez",
    "phone": "+52 55 1234 5678",
    "email": "juan@example.com"
  }',
  '{
    "name": "María García",
    "phone": "+52 55 8765 4321",
    "email": "maria@example.com"
  }',
  '2024-01-20',
  '10:00:00',
  '2024-01-20',
  '16:00:00',
  50.00,
  (SELECT id FROM vehicles WHERE type = 'moto' LIMIT 1),
  'Orden de prueba 1'
),

-- Orden 2
(
  'MV-TEST002',
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  'in_transit',
  '{
    "type": "paquete",
    "description": "Productos electrónicos",
    "weight": 2.0,
    "dimensions": {"length": 30, "width": 25, "height": 10},
    "value": 500,
    "special_instructions": "No voltear",
    "insurance_required": true,
    "fragile": true,
    "urgent": false
  }',
  '{
    "street": "Av. Hidalgo",
    "number": "500",
    "neighborhood": "Centro",
    "city": "Reynosa",
    "state": "Tamaulipas",
    "full": "Av. Hidalgo 500, Centro, Reynosa, Tamaulipas"
  }',
  '{
    "street": "Blvd. Morelos",
    "number": "1200",
    "neighborhood": "Del Valle",
    "city": "Reynosa",
    "state": "Tamaulipas",
    "full": "Blvd. Morelos 1200, Del Valle, Reynosa, Tamaulipas"
  }',
  '{
    "name": "Carlos López",
    "phone": "+52 55 1111 2222",
    "email": "carlos@example.com"
  }',
  '{
    "name": "Ana Martínez",
    "phone": "+52 55 3333 4444",
    "email": "ana@example.com"
  }',
  '2024-01-19',
  '09:00:00',
  '2024-01-19',
  '15:00:00',
  75.00,
  (SELECT id FROM vehicles WHERE type = 'auto' LIMIT 1),
  'Orden de prueba 2'
),

-- Orden 3
(
  'MV-TEST003',
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1),
  'delivered',
  '{
    "type": "ropa",
    "description": "Ropa y accesorios",
    "weight": 1.5,
    "dimensions": {"length": 40, "width": 30, "height": 15},
    "value": 200,
    "special_instructions": "Lavar antes de usar",
    "insurance_required": false,
    "fragile": false,
    "urgent": false
  }',
  '{
    "street": "Calle 5 de Mayo",
    "number": "300",
    "neighborhood": "Zona Centro",
    "city": "Reynosa",
    "state": "Tamaulipas",
    "full": "Calle 5 de Mayo 300, Zona Centro, Reynosa, Tamaulipas"
  }',
  '{
    "street": "Av. Universidad",
    "number": "800",
    "neighborhood": "Universidad",
    "city": "Reynosa",
    "state": "Tamaulipas",
    "full": "Av. Universidad 800, Universidad, Reynosa, Tamaulipas"
  }',
  '{
    "name": "Roberto Silva",
    "phone": "+52 55 5555 6666",
    "email": "roberto@example.com"
  }',
  '{
    "name": "Laura Rodríguez",
    "phone": "+52 55 7777 8888",
    "email": "laura@example.com"
  }',
  '2024-01-18',
  '14:00:00',
  '2024-01-18',
  '18:00:00',
  60.00,
  (SELECT id FROM vehicles WHERE type = 'van' LIMIT 1),
  'Orden de prueba 3'
);

-- Verificar que las órdenes se insertaron correctamente
SELECT 
  tracking_code,
  status,
  package_data->>'description' as description,
  pickup_address->>'full' as pickup,
  delivery_address->>'full' as delivery,
  estimated_cost,
  created_at
FROM orders 
WHERE tracking_code LIKE 'MV-TEST%'
ORDER BY created_at DESC;
