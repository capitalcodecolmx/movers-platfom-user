// =====================================================
// CONFIGURACIÓN DE OPENROUTESERVICE
// =====================================================

const OPENROUTESERVICE_API_KEY = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;
const OPENROUTESERVICE_BASE_URL = 'https://api.openrouteservice.org/v2';

// Verificar que la API key esté configurada
if (!OPENROUTESERVICE_API_KEY) {
  console.warn('⚠️ VITE_OPENROUTESERVICE_API_KEY no está configurada en las variables de entorno');
}

export interface RouteResponse {
  features: Array<{
    properties: {
      summary: {
        distance: number; // en metros
        duration: number; // en segundos
      };
    };
    geometry: {
      coordinates: number[][];
    };
  }>;
}

export interface GeocodeResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number]; // [lng, lat]
    };
    properties: {
      label: string;
      name: string;
      housenumber?: string;
      street?: string;
      locality?: string;
      county?: string;
      region?: string;
      country?: string;
      postcode?: string;
    };
  }>;
}

// Función para obtener rutas entre dos puntos
export const getRoute = async (
  startCoords: [number, number], // [lng, lat]
  endCoords: [number, number]    // [lng, lat]
): Promise<RouteResponse> => {
  if (!OPENROUTESERVICE_API_KEY) {
    throw new Error('OpenRouteService API key no está configurada');
  }

  const response = await fetch(`${OPENROUTESERVICE_BASE_URL}/directions/driving-car`, {
    method: 'POST',
    headers: {
      'Authorization': OPENROUTESERVICE_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coordinates: [startCoords, endCoords],
      format: 'geojson',
      options: {
        avoid_features: ['highways'], // Evitar autopistas para rutas urbanas
        profile_params: {
          restrictions: {
            avoid_features: ['highways']
          }
        }
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Error en OpenRouteService: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Función para geocodificar direcciones
export const geocodeAddress = async (address: string): Promise<GeocodeResponse> => {
  if (!OPENROUTESERVICE_API_KEY) {
    throw new Error('OpenRouteService API key no está configurada');
  }

  const response = await fetch(
    `${OPENROUTESERVICE_BASE_URL}/geocode/search?api_key=${OPENROUTESERVICE_API_KEY}&text=${encodeURIComponent(address)}&boundary.country=MEX&size=5`
  );

  if (!response.ok) {
    throw new Error(`Error en geocodificación: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Función para calcular distancia y duración entre dos puntos
export const calculateRouteInfo = async (
  startCoords: [number, number],
  endCoords: [number, number]
): Promise<{ distance: number; duration: number; route: number[][] }> => {
  try {
    const routeData = await getRoute(startCoords, endCoords);
    
    if (routeData.features.length === 0) {
      throw new Error('No se pudo calcular la ruta');
    }

    const feature = routeData.features[0];
    const summary = feature.properties.summary;
    
    return {
      distance: summary.distance / 1000, // Convertir metros a kilómetros
      duration: summary.duration / 60,   // Convertir segundos a minutos
      route: feature.geometry.coordinates
    };
  } catch (error) {
    console.error('Error calculando ruta:', error);
    throw error;
  }
};

// Función para formatear duración en formato legible
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}min`;
  }
};

// Función para formatear distancia
export const formatDistance = (kilometers: number): string => {
  if (kilometers < 1) {
    return `${Math.round(kilometers * 1000)} m`;
  } else {
    return `${kilometers.toFixed(1)} km`;
  }
};

export default {
  getRoute,
  geocodeAddress,
  calculateRouteInfo,
  formatDuration,
  formatDistance,
};

