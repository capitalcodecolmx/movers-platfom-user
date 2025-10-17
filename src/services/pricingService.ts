import { 
  tarifarioData, 
  VEHICLE_TYPE_MAPPING,
  MEXICAN_STATES,
  normalizeCityName,
  normalizeStateName,
  findTarifarioEntry,
  calculatePrice as jsCalculatePrice,
  getAllCities as jsGetAllCities
} from '../data/tarifario';

interface PricingResult {
  found: boolean;
  basePrice?: number | null;
  finalPrice?: number | null;
  vehicleType?: string;
  distance?: number | null;
  priority?: 'economico' | 'estandar' | 'urgente';
  error?: string;
  destination?: string;
  state?: string;
  entry?: any;
}

class PricingService {
  private isLoaded = true; // Ya no necesitamos cargar CSV, los datos están en JS

  constructor() {
    console.log('🚀 PricingService inicializado con datos JS optimizados');
    console.log('📊 Entradas disponibles:', tarifarioData.length);
  }

  public async calculatePrice(
    pickupCity: string,
    pickupState: string,
    deliveryCity: string,
    deliveryState: string,
    vehicleType: string,
    priority: 'economico' | 'estandar' | 'urgente' = 'estandar'
  ): Promise<PricingResult> {
    
    console.log('💰 Calculando precio:', {
      pickupCity,
      pickupState,
      deliveryCity,
      deliveryState,
      vehicleType,
      priority
    });

    // Usar la función optimizada del archivo JS
    const result = jsCalculatePrice(
      pickupCity,
      pickupState,
      deliveryCity,
      deliveryState,
      vehicleType,
      priority
    );

    console.log('✅ Resultado del cálculo:', result);
    return result as PricingResult;
  }

  // Verificar si una ruta está disponible para cotización automática
  public async isRouteAvailable(
    pickupCity: string,
    pickupState: string,
    deliveryCity: string,
    deliveryState: string
  ): Promise<boolean> {
    const result = await this.calculatePrice(
      pickupCity,
      pickupState,
      deliveryCity,
      deliveryState,
      '1.TON', // Tipo de vehículo por defecto para verificar
      'estandar'
    );
    
    return result.found;
  }

  // Obtener todas las ciudades disponibles para un estado
  public getCitiesByState(state: string): string[] {
    const normalizedState = normalizeStateName(state);
    return tarifarioData
      .filter(entry => entry.estado === normalizedState)
      .map(entry => entry.destino)
      .sort();
  }

  // Obtener todos los estados disponibles
  public getAvailableStates(): string[] {
    return Array.from(new Set(tarifarioData.map(entry => entry.estado)))
      .sort();
  }

  // Obtener todas las ciudades disponibles
  public getAllCities(): Array<{ name: string; state: string; normalizedName: string }> {
    return jsGetAllCities();
  }

  // Función para debug - obtener información detallada de una ruta
  public getRouteInfo(city: string, state: string) {
    const entry = findTarifarioEntry(city, state);
    
    if (!entry) {
      return {
        found: false,
        message: `No se encontró información para ${city}, ${state}`
      };
    }

    return {
      found: true,
      destino: entry.destino,
      estado: entry.estado,
      km: entry.km,
      precioBase1Ton: entry['1.TON'],
      precioEconomico: Math.round(entry['1.TON'] * 0.85 * 100) / 100,
      precioUrgente: Math.round(entry['1.TON'] * 1.15 * 100) / 100,
      vehiculos: {
        '1.TON': entry['1.TON'],
        '1.5 TON': entry['1.5 TON'],
        '3.5 TON': entry['3.5 TON'],
        '5.5 TON': entry['5.5 TON'],
        'RABON (30 M3)': entry['RABON (30 M3)'],
        'TORTON (50 M3)': entry['TORTON (50 M3)'],
        'MUDANZA (80 M3)': entry['MUDANZA (80 M3)'],
        'TRAILER 48" PIES (98 M3)': entry['TRAILER 48" PIES (98 M3)'],
        'TRAILER 53" PIES (110 M3)': entry['TRAILER 53" PIES (110 M3)']
      }
    };
  }
}

export const pricingService = new PricingService();
export default pricingService;
