import { useState, useEffect } from 'react';
import pricingService from '../services/pricingService';
import { normalizeCityName } from '../data/tarifario';

interface City {
  name: string;
  state: string;
  normalizedName: string;
}

export const useCityAutocomplete = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setIsLoading(true);
      
      // Usar los datos del archivo JS en lugar del CSV
      const citiesData = pricingService.getAllCities();
      
      // Convertir a formato City y eliminar duplicados
      const citiesMap = new Map<string, City>();
      
      citiesData.forEach(cityData => {
        const key = `${cityData.normalizedName}_${cityData.state}`;
        
        if (!citiesMap.has(key)) {
          citiesMap.set(key, {
            name: cityData.name,
            state: cityData.state,
            normalizedName: cityData.normalizedName
          });
        }
      });

      // Agregar CDMX como opción de ciudad (tanto como origen como destino)
      const cdmxKey = 'ciudad de mexico_cdmx';
      if (!citiesMap.has(cdmxKey)) {
        citiesMap.set(cdmxKey, {
          name: 'Ciudad de México',
          state: 'Ciudad de México',
          normalizedName: 'ciudad de mexico'
        });
      }

      // Agregar variantes de CDMX para mejor búsqueda
      const cdmxVariants = [
        { name: 'CDMX', state: 'Ciudad de México', normalizedName: 'cdmx' },
        { name: 'México D.F.', state: 'Ciudad de México', normalizedName: 'mexico df' },
        { name: 'Distrito Federal', state: 'Ciudad de México', normalizedName: 'distrito federal' }
      ];

      cdmxVariants.forEach(variant => {
        const key = `${variant.normalizedName}_${variant.state}`;
        if (!citiesMap.has(key)) {
          citiesMap.set(key, variant);
        }
      });
      
      setCities(Array.from(citiesMap.values()));
      setIsLoading(false);
      
      console.log('🏙️ Ciudades cargadas desde JS:', citiesMap.size);
    } catch (error) {
      console.error('Error loading cities:', error);
      setIsLoading(false);
    }
  };


  const searchCities = (query: string, state?: string): City[] => {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = normalizeCityName(query);
    
    return cities
      .filter(city => {
        const matchesQuery = city.normalizedName.includes(normalizedQuery);
        const matchesState = !state || city.state.toUpperCase() === state.toUpperCase();
        return matchesQuery && matchesState;
      })
      .slice(0, 10); // Limitar a 10 resultados
  };

  const getCitiesByState = (state: string): City[] => {
    if (!state) return [];
    
    return cities
      .filter(city => city.state.toUpperCase() === state.toUpperCase())
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return {
    cities,
    isLoading,
    searchCities,
    getCitiesByState
  };
};

