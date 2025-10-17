// Script de prueba para verificar la lógica de precios
import { calculatePrice, findTarifarioEntry } from '../data/tarifario.js';

console.log('🧪 Iniciando pruebas de precios...');

// Test 1: Reynosa → Reynosa
console.log('\n📍 Test 1: Reynosa → Reynosa');
const result1 = calculatePrice(
  'Reynosa',
  'Tamaulipas',
  'Reynosa', 
  'Tamaulipas',
  'Small Van 1 ton',
  'estandar'
);

console.log('Resultado:', result1);
console.log('Precio esperado: $2,373.77');
console.log('Precio obtenido:', result1.finalPrice);

// Test 2: Buscar entrada directamente
console.log('\n🔍 Test 2: Buscar entrada Reynosa directamente');
const entry = findTarifarioEntry('Reynosa', 'Tamaulipas');
console.log('Entrada encontrada:', entry);

if (entry) {
  console.log('Precio 1.TON:', entry.precios['1.TON']);
  console.log('Precio 1.5 TON:', entry.precios['1.5 TON']);
}

// Test 3: Diferentes prioridades
console.log('\n💰 Test 3: Diferentes prioridades para Reynosa');
const economico = calculatePrice('Reynosa', 'Tamaulipas', 'Reynosa', 'Tamaulipas', 'Small Van 1 ton', 'economico');
const estandar = calculatePrice('Reynosa', 'Tamaulipas', 'Reynosa', 'Tamaulipas', 'Small Van 1 ton', 'estandar');
const urgente = calculatePrice('Reynosa', 'Tamaulipas', 'Reynosa', 'Tamaulipas', 'Small Van 1 ton', 'urgente');

console.log('Económico (-15%):', economico.finalPrice);
console.log('Estándar (0%):', estandar.finalPrice);
console.log('Urgente (+15%):', urgente.finalPrice);

console.log('\n✅ Pruebas completadas');
