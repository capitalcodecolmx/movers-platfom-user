// =====================================================
// COMPONENTE DE PRUEBA PARA FLUJO DE ÓRDENES
// =====================================================

import React, { useState } from 'react';
import { pricingService } from '../services/pricingService';
import { useOrders } from '../hooks/useOrders';

const TestOrderFlow: React.FC = () => {
  const { createOrder, isLoading } = useOrders();
  const [testResult, setTestResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const testAutomaticQuote = async () => {
    setIsRunning(true);
    setTestResult(null);

    try {
      console.log('🧪 Iniciando prueba de cotización automática...');

      // Datos de prueba: CDMX → Reynosa (debería ser automática)
      const testData = {
        // Datos del paquete
        packageType: 'documentos',
        packageDescription: 'Documentos importantes',
        weight: 1,
        dimensions: { length: 30, width: 20, height: 5 },
        packageValue: 1000,
        specialInstructions: 'Manejar con cuidado',
        insuranceRequired: false,
        fragile: false,
        urgent: false,

        // Vehículo seleccionado
        selectedVehicle: {
          id: '1.TON',
          name: '1.TON',
          type: 'camion',
          capacity: 1000
        },
        selectedVehicleType: {
          id: '1.TON',
          name: '1.TON',
          type: 'camion',
          capacity: 1000
        },
        vehicleType: '1.TON',

        // Direcciones
        pickupAddress: {
          street: 'Av. Insurgentes Sur',
          number: '123',
          neighborhood: 'Del Valle',
          city: 'Ciudad de México',
          state: 'Ciudad de México',
          postalCode: '03100',
          full: 'Av. Insurgentes Sur 123, Del Valle, Ciudad de México, Ciudad de México, 03100'
        },
        deliveryAddress: {
          street: 'Av. Hidalgo',
          number: '456',
          neighborhood: 'Centro',
          city: 'Reynosa',
          state: 'Tamaulipas',
          postalCode: '88600',
          full: 'Av. Hidalgo 456, Centro, Reynosa, Tamaulipas, 88600'
        },

        // Fechas
        pickupDate: '2024-01-20',
        pickupTime: '10:00',
        deliveryDate: '2024-01-21',
        deliveryTime: '15:00',

        // Contactos
        senderInfo: {
          name: 'Juan Pérez',
          phone: '+52 55 1234 5678',
          email: 'juan@ejemplo.com'
        },
        recipientInfo: {
          name: 'María García',
          phone: '+52 899 987 6543',
          email: 'maria@ejemplo.com'
        },

        // Prioridad
        priority: 'estandar',
        priorityData: {
          id: 'estandar',
          name: 'Estándar',
          description: 'Mejor equilibrio entre costo y rapidez.',
          priceMultiplier: 1.0
        }
      };

      console.log('📋 Datos de prueba:', testData);

      // Probar cotización automática
      console.log('💰 Probando cotización automática...');
      const pricingResult = await pricingService.calculatePrice(
        testData.pickupAddress.city,
        testData.pickupAddress.state,
        testData.deliveryAddress.city,
        testData.deliveryAddress.state,
        testData.vehicleType,
        testData.priority as 'economico' | 'estandar' | 'urgente'
      );

      console.log('📊 Resultado de cotización:', pricingResult);

      if (pricingResult.found) {
        // Agregar datos de cotización a los datos de prueba
        const orderDataWithPricing = {
          ...testData,
          isAutomaticQuote: true,
          estimatedCost: pricingResult.finalPrice,
          pricingResult: pricingResult,
          quoteStatus: 'auto_ready'
        };

        console.log('✅ Cotización automática exitosa, creando orden...');
        
        // Crear la orden
        const newOrder = await createOrder(orderDataWithPricing);
        
        console.log('🎉 Orden creada exitosamente:', newOrder);
        
        setTestResult({
          success: true,
          order: newOrder,
          pricingResult: pricingResult,
          message: `Orden creada con cotización automática. Estado: ${newOrder.status}, Costo: $${pricingResult.finalPrice}`
        });
      } else {
        console.log('❌ Cotización automática falló:', pricingResult.error);
        setTestResult({
          success: false,
          error: pricingResult.error,
          message: 'La cotización automática no funcionó como esperado'
        });
      }

    } catch (error: any) {
      console.error('❌ Error en prueba:', error);
      setTestResult({
        success: false,
        error: error.message,
        message: 'Error durante la prueba'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const testManualQuote = async () => {
    setIsRunning(true);
    setTestResult(null);

    try {
      console.log('🧪 Iniciando prueba de cotización manual...');

      // Datos de prueba: Reynosa → CDMX (debería ser manual)
      const testData = {
        // Datos del paquete
        packageType: 'documentos',
        packageDescription: 'Documentos importantes',
        weight: 1,
        dimensions: { length: 30, width: 20, height: 5 },
        packageValue: 1000,
        specialInstructions: 'Manejar con cuidado',
        insuranceRequired: false,
        fragile: false,
        urgent: false,

        // Vehículo seleccionado
        selectedVehicle: {
          id: '1.TON',
          name: '1.TON',
          type: 'camion',
          capacity: 1000
        },
        selectedVehicleType: {
          id: '1.TON',
          name: '1.TON',
          type: 'camion',
          capacity: 1000
        },
        vehicleType: '1.TON',

        // Direcciones (Reynosa → CDMX)
        pickupAddress: {
          street: 'Av. Hidalgo',
          number: '456',
          neighborhood: 'Centro',
          city: 'Reynosa',
          state: 'Tamaulipas',
          postalCode: '88600',
          full: 'Av. Hidalgo 456, Centro, Reynosa, Tamaulipas, 88600'
        },
        deliveryAddress: {
          street: 'Av. Insurgentes Sur',
          number: '123',
          neighborhood: 'Del Valle',
          city: 'Ciudad de México',
          state: 'Ciudad de México',
          postalCode: '03100',
          full: 'Av. Insurgentes Sur 123, Del Valle, Ciudad de México, Ciudad de México, 03100'
        },

        // Fechas
        pickupDate: '2024-01-20',
        pickupTime: '10:00',
        deliveryDate: '2024-01-21',
        deliveryTime: '15:00',

        // Contactos
        senderInfo: {
          name: 'Carlos López',
          phone: '+52 899 123 4567',
          email: 'carlos@ejemplo.com'
        },
        recipientInfo: {
          name: 'Ana Martínez',
          phone: '+52 55 9876 5432',
          email: 'ana@ejemplo.com'
        },

        // Prioridad
        priority: 'estandar',
        priorityData: {
          id: 'estandar',
          name: 'Estándar',
          description: 'Mejor equilibrio entre costo y rapidez.',
          priceMultiplier: 1.0
        }
      };

      console.log('📋 Datos de prueba (Manual):', testData);

      // Probar cotización automática (debería fallar)
      console.log('💰 Probando cotización automática (debería fallar)...');
      const pricingResult = await pricingService.calculatePrice(
        testData.pickupAddress.city,
        testData.pickupAddress.state,
        testData.deliveryAddress.city,
        testData.deliveryAddress.state,
        testData.vehicleType,
        testData.priority as 'economico' | 'estandar' | 'urgente'
      );

      console.log('📊 Resultado de cotización:', pricingResult);

      if (!pricingResult.found) {
        // Agregar datos de cotización manual
        const orderDataWithPricing = {
          ...testData,
          isAutomaticQuote: false,
          estimatedCost: null,
          pricingResult: pricingResult,
          quoteStatus: 'manual_pending'
        };

        console.log('✅ Cotización manual correcta, creando orden...');
        
        // Crear la orden
        const newOrder = await createOrder(orderDataWithPricing);
        
        console.log('🎉 Orden creada exitosamente:', newOrder);
        
        setTestResult({
          success: true,
          order: newOrder,
          pricingResult: pricingResult,
          message: `Orden creada con cotización manual. Estado: ${newOrder.status}`
        });
      } else {
        console.log('❌ La cotización debería haber fallado pero fue exitosa');
        setTestResult({
          success: false,
          error: 'La cotización debería haber fallado pero fue exitosa',
          message: 'Error en la lógica del tarifario'
        });
      }

    } catch (error: any) {
      console.error('❌ Error en prueba:', error);
      setTestResult({
        success: false,
        error: error.message,
        message: 'Error durante la prueba'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🧪 Prueba de Flujo de Órdenes
        </h2>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={testAutomaticQuote}
              disabled={isRunning || isLoading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Probando...' : 'Probar Cotización Automática'}
            </button>
            
            <button
              onClick={testManualQuote}
              disabled={isRunning || isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Probando...' : 'Probar Cotización Manual'}
            </button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg ${
              testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? '✅ Prueba Exitosa' : '❌ Prueba Fallida'}
              </h3>
              <p className={`mt-2 ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.message}
              </p>
              
              {testResult.order && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <h4 className="font-medium text-gray-800">Detalles de la Orden:</h4>
                  <p className="text-sm text-gray-600">
                    <strong>ID:</strong> {testResult.order.id}<br/>
                    <strong>Código:</strong> {testResult.order.tracking_code}<br/>
                    <strong>Estado:</strong> {testResult.order.status}<br/>
                    <strong>Pago:</strong> {testResult.order.payment_status}<br/>
                    <strong>Costo:</strong> ${testResult.order.estimated_cost || 'N/A'}
                  </p>
                </div>
              )}
              
              {testResult.pricingResult && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <h4 className="font-medium text-gray-800">Resultado de Cotización:</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Encontrada:</strong> {testResult.pricingResult.found ? 'Sí' : 'No'}<br/>
                    <strong>Precio Base:</strong> ${testResult.pricingResult.basePrice || 'N/A'}<br/>
                    <strong>Precio Final:</strong> ${testResult.pricingResult.finalPrice || 'N/A'}<br/>
                    <strong>Distancia:</strong> {testResult.pricingResult.distance || 'N/A'} km<br/>
                    <strong>Error:</strong> {testResult.pricingResult.error || 'Ninguno'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestOrderFlow;
