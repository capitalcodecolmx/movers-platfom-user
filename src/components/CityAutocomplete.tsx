import React, { useState, useEffect, useRef } from 'react';
import { useCityAutocomplete } from '../hooks/useCityAutocomplete';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  state?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  state,
  placeholder = 'Ingresa la ciudad',
  label = 'Ciudad',
  required = false,
  className = ''
}) => {
  const { searchCities, isLoading } = useCityAutocomplete();
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ name: string; state: string }>>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && value.length >= 2) {
      const results = searchCities(value, state);
      setSuggestions(results);
      // Solo mostrar dropdown si hay sugerencias y el input está enfocado
      setShowDropdown(results.length > 0 && document.activeElement === inputRef.current);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  }, [value, state]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelectCity = (cityName: string) => {
    onChange(cityName);
    // Usar setTimeout para asegurar que el cambio se procese antes de cerrar
    setTimeout(() => {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectCity(suggestions[selectedIndex].name);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value && value.length >= 2 && suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          autoComplete="off"
        />
        
        {isLoading && value.length >= 2 && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((city, index) => (
            <div
              key={`${city.name}_${city.state}_${index}`}
              onClick={() => handleSelectCity(city.name)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-blue-50 text-gray-700'
              }`}
            >
              <div className="font-medium">{city.name}</div>
              <div className={`text-sm ${
                index === selectedIndex ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {city.state}
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && suggestions.length === 0 && value.length >= 2 && !isLoading && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
        >
          <div className="px-4 py-3 text-gray-500 text-sm">
            No se encontraron ciudades. La cotización será manual.
          </div>
        </div>
      )}

      {/* Ayuda contextual */}
      <p className="mt-1 text-xs text-gray-500">
        Escribe al menos 2 letras para ver sugerencias
      </p>
    </div>
  );
};

export default CityAutocomplete;

