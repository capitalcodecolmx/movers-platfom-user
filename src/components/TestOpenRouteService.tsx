// =====================================================
// COMPONENTE DE PRUEBA PARA OPENROUTESERVICE
// =====================================================

import React, { useState } from 'react';
import { calculateRouteInfo, geocodeAddress } from '../config/openrouteservice';

const TestOpenRouteService: React.FC = () => {
  const [testAddress, setTestAddress] = useState('Calle Eugenio de La Croix 1120, Reynosa, Tamaulipas');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGeocoding = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const geocodeResult = await geocodeAddress(testAddress);
      setResult({ type: 'geocoding', data: geocodeResult });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testRoute = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Coordenadas de ejemplo: Reynosa a Matamoros
      const startCoords: [number, number] = [-98.3081, 26.0406]; // Reynosa
      const endCoords: [number, number] = [-97.8253, 25.8690];   // Matamoros
      
      const routeResult = await calculateRouteInfo(startCoords, endCoords);
      setResult({ type: 'route', data: routeResult });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧪 Prueba de OpenRouteService</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Dirección para geocodificar:
          </label>
          <input
            type="text"
            value={testAddress}
            onChange={(e) => setTestAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Escribe una dirección..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={testGeocoding}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Probando...' : 'Probar Geocodificación'}
          </button>
          
          <button
            onClick={testRoute}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Probando...' : 'Probar Ruta'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <strong>Resultado ({result.type}):</strong>
            <pre className="mt-2 text-xs overflow-auto max-h-60">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestOpenRouteService;

