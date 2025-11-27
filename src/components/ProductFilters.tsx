import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useProductsStore } from '../store/useProductsStore';
import { FILTER_OPTIONS, PRODUCTS } from '../data/mockData';

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 sm:py-3 px-3 sm:px-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-sm sm:text-base">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

const ProductFilters: React.FC = () => {
  const { filters, setFilters, clearFilters } = useProductsStore();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    marca: true,
    submarca: false,
    sabor: false,
    presentacion: false,
    tamaño: false,
    tipoAgua: false,
    tipoProducto: false,
    precio: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (filterKey: keyof typeof filters, value: string) => {
    const currentValues = filters[filterKey] as string[];
    if (Array.isArray(currentValues)) {
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setFilters({ [filterKey]: newValues });
    }
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    setFilters({ priceRange: newRange });
  };

  // Get unique values from products for dynamic filters
  const getUniqueValues = (key: keyof typeof PRODUCTS[0]): string[] => {
    const values = new Set<string>();
    PRODUCTS.forEach(product => {
      const value = product[key];
      if (value && typeof value === 'string') {
        values.add(value);
      }
    });
    return Array.from(values).sort();
  };

  const hasActiveFilters = () => {
    return (
      filters.marca.length > 0 ||
      filters.submarca.length > 0 ||
      filters.sabor.length > 0 ||
      filters.presentacion.length > 0 ||
      filters.tamaño.length > 0 ||
      filters.tipoAgua.length > 0 ||
      filters.tipoProducto.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 1000
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filtros</h2>
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium px-2 py-1"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Marca */}
        <FilterSection
          title="Marca"
          isOpen={openSections.marca}
          onToggle={() => toggleSection('marca')}
        >
          {FILTER_OPTIONS.marcas.map((marca) => (
            <label key={marca} className="flex items-center space-x-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={filters.marca.includes(marca)}
                onChange={() => handleCheckboxChange('marca', marca)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-700">{marca}</span>
            </label>
          ))}
        </FilterSection>

        {/* Submarca */}
        <FilterSection
          title="Submarca"
          isOpen={openSections.submarca}
          onToggle={() => toggleSection('submarca')}
        >
          {FILTER_OPTIONS.submarcas.map((submarca) => (
            <label key={submarca} className="flex items-center space-x-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={filters.submarca.includes(submarca)}
                onChange={() => handleCheckboxChange('submarca', submarca)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-700">{submarca}</span>
            </label>
          ))}
        </FilterSection>

        {/* Sabor */}
        <FilterSection
          title="Sabor"
          isOpen={openSections.sabor}
          onToggle={() => toggleSection('sabor')}
        >
          {FILTER_OPTIONS.sabores.map((sabor) => (
            <label key={sabor} className="flex items-center space-x-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={filters.sabor.includes(sabor)}
                onChange={() => handleCheckboxChange('sabor', sabor)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">{sabor}</span>
            </label>
          ))}
        </FilterSection>

        {/* Presentación */}
        <FilterSection
          title="Presentación"
          isOpen={openSections.presentacion}
          onToggle={() => toggleSection('presentacion')}
        >
          {FILTER_OPTIONS.presentaciones.map((presentacion) => (
            <label key={presentacion} className="flex items-center space-x-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={filters.presentacion.includes(presentacion)}
                onChange={() => handleCheckboxChange('presentacion', presentacion)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">{presentacion}</span>
            </label>
          ))}
        </FilterSection>

        {/* Tamaño */}
        <FilterSection
          title="Tamaño"
          isOpen={openSections.tamaño}
          onToggle={() => toggleSection('tamaño')}
        >
          {FILTER_OPTIONS.tamaños.map((tamaño) => (
            <label key={tamaño} className="flex items-center space-x-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={filters.tamaño.includes(tamaño)}
                onChange={() => handleCheckboxChange('tamaño', tamaño)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">{tamaño}</span>
            </label>
          ))}
        </FilterSection>

        {/* Tipo de agua */}
        <FilterSection
          title="Tipo de agua"
          isOpen={openSections.tipoAgua}
          onToggle={() => toggleSection('tipoAgua')}
        >
          {FILTER_OPTIONS.tiposAgua.map((tipoAgua) => (
            <label key={tipoAgua} className="flex items-center space-x-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={filters.tipoAgua.includes(tipoAgua)}
                onChange={() => handleCheckboxChange('tipoAgua', tipoAgua)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">{tipoAgua}</span>
            </label>
          ))}
        </FilterSection>

        {/* Tipo de producto */}
        <FilterSection
          title="Tipo de producto"
          isOpen={openSections.tipoProducto}
          onToggle={() => toggleSection('tipoProducto')}
        >
          {FILTER_OPTIONS.tiposProducto.map((tipoProducto) => (
            <label key={tipoProducto} className="flex items-center space-x-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={filters.tipoProducto.includes(tipoProducto)}
                onChange={() => handleCheckboxChange('tipoProducto', tipoProducto)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 flex-shrink-0"
              />
              <span className="text-sm text-gray-700">{tipoProducto}</span>
            </label>
          ))}
        </FilterSection>

        {/* Precio */}
        <FilterSection
          title="Precio"
          isOpen={openSections.precio}
          onToggle={() => toggleSection('precio')}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="1000"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Mínimo"
              />
              <span className="text-gray-500 text-sm">-</span>
              <input
                type="number"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-orange-500 focus:border-orange-500"
                placeholder="Máximo"
              />
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default ProductFilters;

