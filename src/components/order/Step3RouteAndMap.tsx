// =====================================================
// PASO 3: RUTA DEL ENVÍO CON MAPA
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowLeft, ArrowRight, Navigation, Clock, Route } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { calculateRouteInfo, formatDuration, formatDistance } from '../../config/openrouteservice';
import { parseAddress, generateSearchSuggestions } from '../../utils/addressParser';

interface Step3RouteAndMapProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Componente para actualizar el mapa cuando cambian las coordenadas
const MapUpdater: React.FC<{ pickupCoords: [number, number] | null; deliveryCoords: [number, number] | null }> = ({ 
  pickupCoords, 
  deliveryCoords 
}) => {
  const map = useMap();

  useEffect(() => {
    if (pickupCoords && deliveryCoords) {
      const bounds = L.latLngBounds([pickupCoords, deliveryCoords]);
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (pickupCoords) {
      map.setView(pickupCoords, 13);
    }
  }, [pickupCoords, deliveryCoords, map]);

  return null;
};

const Step3RouteAndMap: React.FC<Step3RouteAndMapProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<[number, number] | null>(null);
  
  // Estados para campos separados de recogida
  const [pickupStreet, setPickupStreet] = useState('');
  const [pickupNumber, setPickupNumber] = useState('');
  const [pickupNeighborhood, setPickupNeighborhood] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState('');
  
  // Estados para campos separados de entrega
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryNumber, setDeliveryNumber] = useState('');
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [routeCoordinates, setRouteCoordinates] = useState<number[][]>([]);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estados para autocompletado
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState<any[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDeliverySuggestions, setShowDeliverySuggestions] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [parsedPickupAddress, setParsedPickupAddress] = useState<any>(null);
  const [parsedDeliveryAddress, setParsedDeliveryAddress] = useState<any>(null);

  // Función para construir dirección completa de recogida
  const buildPickupAddress = () => {
    const parts = [];
    if (pickupStreet) parts.push(pickupStreet);
    if (pickupNumber) parts.push(pickupNumber);
    if (pickupNeighborhood) parts.push(pickupNeighborhood);
    if (pickupCity) parts.push(pickupCity);
    if (pickupState) parts.push(pickupState);
    return parts.join(', ');
  };

  // Función para construir dirección completa de entrega
  const buildDeliveryAddress = () => {
    const parts = [];
    if (deliveryStreet) parts.push(deliveryStreet);
    if (deliveryNumber) parts.push(deliveryNumber);
    if (deliveryNeighborhood) parts.push(deliveryNeighborhood);
    if (deliveryCity) parts.push(deliveryCity);
    if (deliveryState) parts.push(deliveryState);
    return parts.join(', ');
  };

  // Función para buscar coordenadas cuando se complete una dirección
  const searchCoordinates = async (address: string, isPickup: boolean) => {
    if (!address.trim() || address.length < 10) {
      console.log('Address too short for search:', address);
      return; // Mínimo 10 caracteres para búsqueda
    }
    
    console.log(`Searching coordinates for ${isPickup ? 'pickup' : 'delivery'} address:`, address);
    
    try {
      const coords = await geocodeAddress(address);
      console.log('Geocoding result:', coords);
      
      if (coords) {
        if (isPickup) {
          console.log('Setting pickup coordinates:', coords);
          setPickupCoords(coords);
          setPickupAddress(address);
        } else {
          console.log('Setting delivery coordinates:', coords);
          setDeliveryCoords(coords);
          setDeliveryAddress(address);
        }
        
        // Si ambas direcciones están completas, calcular ruta
        if (isPickup && deliveryCoords) {
          console.log('Calculating route from pickup to delivery');
          await calculateRealRoute(coords, deliveryCoords);
        } else if (!isPickup && pickupCoords) {
          console.log('Calculating route from delivery to pickup');
          await calculateRealRoute(pickupCoords, coords);
        }
      } else {
        console.log('No coordinates found for address:', address);
        
        // Intentar con coordenadas de fallback
        const fallbackCoords = getFallbackCoordinates(address);
        if (fallbackCoords) {
          console.log('Using fallback coordinates:', fallbackCoords);
          if (isPickup) {
            setPickupCoords(fallbackCoords);
            setPickupAddress(address);
          } else {
            setDeliveryCoords(fallbackCoords);
            setDeliveryAddress(address);
          }
          
          // Si ambas direcciones están completas, calcular ruta
          if (isPickup && deliveryCoords) {
            console.log('Calculating route from pickup to delivery (fallback)');
            await calculateRealRoute(fallbackCoords, deliveryCoords);
          } else if (!isPickup && pickupCoords) {
            console.log('Calculating route from delivery to pickup (fallback)');
            await calculateRealRoute(pickupCoords, fallbackCoords);
          }
        }
      }
    } catch (error) {
      console.error('Error buscando coordenadas:', error);
    }
  };

  // Configurar iconos de Leaflet
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.address-input-container')) {
        setShowPickupSuggestions(false);
        setShowDeliverySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Detectar errores de carga del mapa
  useEffect(() => {
    const handleMapError = () => {
      setMapError(true);
    };

    // Agregar listener para errores de imagen (tiles del mapa)
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      mapContainer.addEventListener('error', handleMapError);
    }

    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener('error', handleMapError);
      }
    };
  }, []);

  // Buscar coordenadas cuando se complete la dirección de recogida
  useEffect(() => {
    const address = buildPickupAddress();
    console.log('Pickup address built:', address);
    console.log('Pickup fields:', { pickupStreet, pickupNumber, pickupNeighborhood, pickupCity, pickupState });
    
    if (address && pickupStreet && pickupCity && pickupState) {
      console.log('Searching coordinates for pickup address:', address);
      searchCoordinates(address, true);
    }
  }, [pickupStreet, pickupNumber, pickupNeighborhood, pickupCity, pickupState]);

  // Buscar coordenadas cuando se complete la dirección de entrega
  useEffect(() => {
    const address = buildDeliveryAddress();
    console.log('Delivery address built:', address);
    console.log('Delivery fields:', { deliveryStreet, deliveryNumber, deliveryNeighborhood, deliveryCity, deliveryState });
    
    if (address && deliveryStreet && deliveryCity && deliveryState) {
      console.log('Searching coordinates for delivery address:', address);
      searchCoordinates(address, false);
    }
  }, [deliveryStreet, deliveryNumber, deliveryNeighborhood, deliveryCity, deliveryState]);

  // Función para buscar sugerencias de direcciones con Nominatim
  const searchAddressSuggestions = async (query: string): Promise<any[]> => {
    if (!query.trim() || query.length < 3) return [];

    try {
      // Primero parsear la dirección para obtener componentes
      const parsed = parseAddress(query);
      
      // Generar diferentes variaciones de búsqueda
      const searchQueries = generateSearchSuggestions(parsed);
      
      // Buscar con cada variación
      const allResults = [];
      
      for (const searchQuery of searchQueries.slice(0, 2)) { // Limitar a 2 búsquedas
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=3&countrycodes=mx&addressdetails=1&extratags=1`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(nominatimUrl));
        const data = await response.json();
        
        allResults.push(...data.map((item: any) => ({
          display_name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          address: item.address,
          place_id: item.place_id,
          house_number: item.address?.house_number || item.address?.house_name || '',
          road: item.address?.road || item.address?.street || '',
          suburb: item.address?.suburb || item.address?.neighbourhood || '',
          city: item.address?.city || item.address?.town || '',
          state: item.address?.state || '',
          postcode: item.address?.postcode || '',
          parsed_address: parsed, // Incluir la dirección parseada
          search_query: searchQuery
        })));
      }
      
      // Remover duplicados por place_id
      const uniqueResults = allResults.filter((item, index, arr) => 
        arr.findIndex(other => other.place_id === item.place_id) === index
      );
      
      return uniqueResults.slice(0, 5); // Limitar a 5 resultados
    } catch (error) {
      console.error('Error searching address suggestions:', error);
      return [];
    }
  };

  // Función para geocodificar direcciones con Nominatim (usando proxy para evitar CORS)
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    if (!address.trim()) return null;

    try {
      // Usar un proxy público para evitar CORS
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=mx&addressdetails=1`;
      
      console.log('Geocoding URL:', nominatimUrl);
      
      const response = await fetch(proxyUrl + encodeURIComponent(nominatimUrl));
      const data = await response.json();
      
      console.log('Geocoding response:', data);
      
      if (data && data.length > 0) {
        const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        console.log('Found coordinates:', coords);
        return coords;
      }
      
      console.log('No coordinates found in response');
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      
      // Fallback: intentar con una búsqueda más simple
      try {
        const simpleAddress = address.split(',')[0] + ', México'; // Solo calle y país
        console.log('Trying fallback with simple address:', simpleAddress);
        
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(simpleAddress)}&limit=1&countrycodes=mx`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(nominatimUrl));
        const data = await response.json();
        
        if (data && data.length > 0) {
          const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          console.log('Fallback coordinates found:', coords);
          return coords;
        }
      } catch (fallbackError) {
        console.error('Fallback geocoding also failed:', fallbackError);
      }
      
      return null;
    }
  };

  // Función de fallback con coordenadas conocidas para Reynosa
  const getFallbackCoordinates = (address: string): [number, number] | null => {
    const lowerAddress = address.toLowerCase();
    
    // Coordenadas aproximadas de Reynosa, Tamaulipas
    if (lowerAddress.includes('reynosa')) {
      // Centro de Reynosa
      if (lowerAddress.includes('eugenio') || lowerAddress.includes('croix')) {
        return [26.0713, -98.2975]; // Zona centro de Reynosa
      }
      if (lowerAddress.includes('francisco') || lowerAddress.includes('goya')) {
        return [26.0750, -98.3000]; // Zona cercana en Reynosa
      }
      return [26.0713, -98.2975]; // Centro de Reynosa por defecto
    }
    
    return null;
  };

  // Función para calcular ruta real con OpenRouteService
  const calculateRealRoute = async (startCoords: [number, number], endCoords: [number, number]) => {
    try {
      setIsLoading(true);
      const routeInfo = await calculateRouteInfo(startCoords, endCoords);
      
      setDistance(routeInfo.distance);
      setDuration(routeInfo.duration);
      setRouteCoordinates(routeInfo.route);
      
      // Calcular costo basado en la distancia real
      if (data.selectedVehicle) {
        const cost = calculateCost(routeInfo.distance, data.selectedVehicle);
        setEstimatedCost(cost);
      }
      
      return routeInfo;
    } catch (error) {
      console.error('Error calculando ruta:', error);
      // Fallback a cálculo manual si OpenRouteService falla
      const manualDistance = calculateManualDistance(startCoords, endCoords);
      setDistance(manualDistance);
      setDuration(manualDistance * 2); // Estimación: 2 min por km
      setRouteCoordinates([startCoords, endCoords]);
      
      if (data.selectedVehicle) {
        const cost = calculateCost(manualDistance, data.selectedVehicle);
        setEstimatedCost(cost);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función de fallback para cálculo manual de distancia
  const calculateManualDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Función para calcular costo basado en distancia y vehículo
  const calculateCost = (distance: number, vehicle: any): number => {
    if (!vehicle) return 0;

    const basePrices = {
      'bicicleta': 15,
      'moto': 25,
      'auto': 35,
      'van': 50,
      'camion': 80
    };

    const pricePerKm = {
      'bicicleta': 2.5,
      'moto': 3.5,
      'auto': 4.0,
      'van': 5.0,
      'camion': 6.0
    };

    const basePrice = basePrices[vehicle.type as keyof typeof basePrices] || 35;
    const distancePrice = distance * (pricePerKm[vehicle.type as keyof typeof pricePerKm] || 4.0);
    let total = basePrice + distancePrice;

    // Aplicar cargos adicionales
    if (data.urgent) total *= 1.5;
    if (data.fragile) total += 10;
    if (data.insuranceRequired) total += 15;

    return Math.round(total);
  };

  // Manejar cambio de dirección de recogida
  const handlePickupAddressChange = async (address: string) => {
    setPickupAddress(address);
    setShowPickupSuggestions(false);
    
    // Parsear la dirección inmediatamente
    const parsed = parseAddress(address);
    setParsedPickupAddress(parsed);
    
    if (address.length >= 3) {
      const suggestions = await searchAddressSuggestions(address);
      setPickupSuggestions(suggestions);
      setShowPickupSuggestions(suggestions.length > 0);
    } else {
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
    }
  };

  // Manejar cambio de dirección de entrega
  const handleDeliveryAddressChange = async (address: string) => {
    setDeliveryAddress(address);
    setShowDeliverySuggestions(false);
    
    // Parsear la dirección inmediatamente
    const parsed = parseAddress(address);
    setParsedDeliveryAddress(parsed);
    
    if (address.length >= 3) {
      const suggestions = await searchAddressSuggestions(address);
      setDeliverySuggestions(suggestions);
      setShowDeliverySuggestions(suggestions.length > 0);
    } else {
      setDeliverySuggestions([]);
      setShowDeliverySuggestions(false);
    }
  };

  // Manejar selección de sugerencia de recogida
  const handlePickupSuggestionSelect = async (suggestion: any) => {
    setPickupAddress(suggestion.display_name);
    setPickupCoords([suggestion.lat, suggestion.lon]);
    setShowPickupSuggestions(false);
    setPickupSuggestions([]);
    
    if (deliveryCoords) {
      await calculateRealRoute([suggestion.lon, suggestion.lat], deliveryCoords);
    }
  };

  // Manejar selección de sugerencia de entrega
  const handleDeliverySuggestionSelect = async (suggestion: any) => {
    setDeliveryAddress(suggestion.display_name);
    setDeliveryCoords([suggestion.lat, suggestion.lon]);
    setShowDeliverySuggestions(false);
    setDeliverySuggestions([]);
    
    if (pickupCoords) {
      await calculateRealRoute(pickupCoords, [suggestion.lon, suggestion.lat]);
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    // Validar campos de recogida
    if (!pickupStreet.trim()) {
      newErrors.pickupStreet = 'Calle de recogida es requerida';
    }
    if (!pickupNumber.trim()) {
      newErrors.pickupNumber = 'Número de recogida es requerido';
    }
    if (!pickupCity.trim()) {
      newErrors.pickupCity = 'Ciudad de recogida es requerida';
    }
    if (!pickupState.trim()) {
      newErrors.pickupState = 'Estado de recogida es requerido';
    }

    // Validar campos de entrega
    if (!deliveryStreet.trim()) {
      newErrors.deliveryStreet = 'Calle de entrega es requerida';
    }
    if (!deliveryNumber.trim()) {
      newErrors.deliveryNumber = 'Número de entrega es requerido';
    }
    if (!deliveryCity.trim()) {
      newErrors.deliveryCity = 'Ciudad de entrega es requerida';
    }
    if (!deliveryState.trim()) {
      newErrors.deliveryState = 'Estado de entrega es requerido';
    }

    // Validar coordenadas
    if (!pickupCoords) {
      newErrors.pickupCoords = 'No se pudo encontrar la ubicación de recogida';
    }

    if (!deliveryCoords) {
      newErrors.deliveryCoords = 'No se pudo encontrar la ubicación de entrega';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onUpdate({
        pickupAddress: {
          address: pickupAddress,
          coordinates: pickupCoords,
        },
        deliveryAddress: {
          address: deliveryAddress,
          coordinates: deliveryCoords,
        },
        distance,
        estimatedCost,
      });
      onNext();
    }
  };

  const getEstimatedDuration = () => {
    if (duration > 0) {
      return formatDuration(duration);
    } else if (distance > 0) {
      const baseTime = distance * 2; // 2 minutos por km como fallback
      return `${Math.round(baseTime)}-${Math.round(baseTime + 15)} min`;
    }
    return '0 min';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de direcciones */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                Ruta del Envío
              </h2>
              <p className="text-gray-500 text-lg">
                Especifica las direcciones de recogida y entrega
              </p>
            </div>

            {/* Dirección de recogida */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </span>
                Dirección de Recogida
              </h3>
              
              <div className="space-y-4">
                {/* Calle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle *
                  </label>
                  <input
                    type="text"
                    value={pickupStreet}
                    onChange={(e) => setPickupStreet(e.target.value)}
                    placeholder="Ej: Eugenio de La Croix"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pickupStreet && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupStreet}</p>
                  )}
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={pickupNumber}
                    onChange={(e) => setPickupNumber(e.target.value)}
                    placeholder="Ej: 1120"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pickupNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupNumber}</p>
                  )}
                </div>

                {/* Colonia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colonia
                  </label>
                  <input
                    type="text"
                    value={pickupNeighborhood}
                    onChange={(e) => setPickupNeighborhood(e.target.value)}
                    placeholder="Ej: Col. Del Valle"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    placeholder="Ej: Reynosa"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pickupCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupCity}</p>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    value={pickupState}
                    onChange={(e) => setPickupState(e.target.value)}
                    placeholder="Ej: Tamaulipas"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.pickupState && (
                    <p className="text-red-500 text-sm mt-1">{errors.pickupState}</p>
                  )}
                </div>

                {/* Dirección construida */}
                {buildPickupAddress() && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium mb-1">Dirección completa:</div>
                    <div className="text-sm text-gray-700 font-medium">
                      {buildPickupAddress()}
                    </div>
                    {pickupCoords ? (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ Ubicación encontrada en el mapa
                      </div>
                    ) : (
                      <div className="mt-2">
                        <button
                          onClick={() => searchCoordinates(buildPickupAddress(), true)}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Buscar en el mapa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Dirección de entrega */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </span>
                Dirección de Entrega
              </h3>
              
              <div className="space-y-4">
                {/* Calle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calle *
                  </label>
                  <input
                    type="text"
                    value={deliveryStreet}
                    onChange={(e) => setDeliveryStreet(e.target.value)}
                    placeholder="Ej: 5 de Febrero"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.deliveryStreet && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryStreet}</p>
                  )}
                </div>

                {/* Número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={deliveryNumber}
                    onChange={(e) => setDeliveryNumber(e.target.value)}
                    placeholder="Ej: 456"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.deliveryNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryNumber}</p>
                  )}
                </div>

                {/* Colonia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colonia
                  </label>
                  <input
                    type="text"
                    value={deliveryNeighborhood}
                    onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                    placeholder="Ej: Col. Centro"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="Ej: Cuauhtémoc"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.deliveryCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryCity}</p>
                  )}
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    placeholder="Ej: CDMX"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {errors.deliveryState && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryState}</p>
                  )}
                </div>

                {/* Dirección construida */}
                {buildDeliveryAddress() && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-green-600 font-medium mb-1">Dirección completa:</div>
                    <div className="text-sm text-gray-700 font-medium">
                      {buildDeliveryAddress()}
                    </div>
                    {deliveryCoords ? (
                      <div className="text-xs text-green-600 mt-1">
                        ✓ Ubicación encontrada en el mapa
                      </div>
                    ) : (
                      <div className="mt-2">
                        <button
                          onClick={() => searchCoordinates(buildDeliveryAddress(), false)}
                          className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Buscar en el mapa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Debug info - temporal */}
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-xs text-yellow-600 font-medium mb-2">Debug Info:</div>
              <div className="text-xs text-gray-700 space-y-1">
                <div>Pickup Coords: {pickupCoords ? `${pickupCoords[0]}, ${pickupCoords[1]}` : 'No encontradas'}</div>
                <div>Delivery Coords: {deliveryCoords ? `${deliveryCoords[0]}, ${deliveryCoords[1]}` : 'No encontradas'}</div>
                <div>Pickup Address: {buildPickupAddress() || 'No construida'}</div>
                <div>Delivery Address: {buildDeliveryAddress() || 'No construida'}</div>
                <div>Distance: {distance} km</div>
                <div>Route Coordinates: {routeCoordinates.length} puntos</div>
              </div>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => {
                    console.log('Current state:', {
                      pickupCoords,
                      deliveryCoords,
                      pickupAddress: buildPickupAddress(),
                      deliveryAddress: buildDeliveryAddress(),
                      distance,
                      routeCoordinates
                    });
                  }}
                  className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                >
                  Log State
                </button>
                <button
                  onClick={() => {
                    if (buildPickupAddress()) {
                      searchCoordinates(buildPickupAddress(), true);
                    }
                    if (buildDeliveryAddress()) {
                      searchCoordinates(buildDeliveryAddress(), false);
                    }
                  }}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Force Search
                </button>
                <button
                  onClick={() => {
                    if (buildPickupAddress()) {
                      const fallbackCoords = getFallbackCoordinates(buildPickupAddress());
                      if (fallbackCoords) {
                        setPickupCoords(fallbackCoords);
                        setPickupAddress(buildPickupAddress());
                        console.log('Set pickup fallback coordinates:', fallbackCoords);
                      }
                    }
                    if (buildDeliveryAddress()) {
                      const fallbackCoords = getFallbackCoordinates(buildDeliveryAddress());
                      if (fallbackCoords) {
                        setDeliveryCoords(fallbackCoords);
                        setDeliveryAddress(buildDeliveryAddress());
                        console.log('Set delivery fallback coordinates:', fallbackCoords);
                      }
                    }
                  }}
                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  Use Fallback
                </button>
              </div>
            </div>

            {/* Información de la ruta */}
            {(distance > 0 || isLoading) && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Route className="w-5 h-5 mr-2" />
                  Información de la Ruta
                  {isLoading && (
                    <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Distancia</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isLoading ? 'Calculando...' : formatDistance(distance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tiempo estimado</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {isLoading ? 'Calculando...' : getEstimatedDuration()}
                    </p>
                  </div>
                </div>
                {estimatedCost > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Costo estimado</span>
                      <span className="text-2xl font-bold text-green-600">${estimatedCost}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mapa */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Navigation className="w-5 h-5 mr-2" />
              Mapa de la Ruta
            </h3>
            
            <div className="h-96 rounded-2xl overflow-hidden relative bg-gray-100">
              {!mapError ? (
                <MapContainer
                  center={[19.4326, -99.1332]} // Ciudad de México
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-2xl"
                  zoomControl={true}
                  scrollWheelZoom={true}
                  doubleClickZoom={true}
                  dragging={true}
                  whenReady={() => setMapError(false)}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    maxZoom={19}
                    minZoom={1}
                    tileSize={256}
                    zoomOffset={0}
                    errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                  />
                  
                  <MapUpdater pickupCoords={pickupCoords} deliveryCoords={deliveryCoords} />
                  
                  {pickupCoords && (
                    <Marker position={pickupCoords}>
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-semibold text-blue-600">Recogida</h3>
                          <p className="text-sm text-gray-600">{pickupAddress}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {deliveryCoords && (
                    <Marker position={deliveryCoords}>
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-semibold text-green-600">Entrega</h3>
                          <p className="text-sm text-gray-600">{deliveryAddress}</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  
                  {routeCoordinates.length > 0 && (
                    <Polyline
                      positions={routeCoordinates.map(coord => [coord[1], coord[0]])} // Convertir [lng, lat] a [lat, lng]
                      color="#3b82f6"
                      weight={4}
                      opacity={0.8}
                    />
                  )}
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100 rounded-2xl">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Mapa no disponible</p>
                    <button 
                      onClick={() => setMapError(false)}
                      className="mt-2 text-blue-600 text-xs hover:underline"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Leyenda del mapa */}
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span>Recogida</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span>Entrega</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-1 bg-blue-500 rounded mr-2"></div>
                <span>Ruta</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
        >
          ← Anterior
        </button>

        <button
          onClick={handleNext}
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Step3RouteAndMap;
