import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
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
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-bold text-gray-900 text-sm tracking-wide uppercase group-hover:text-cyan-700 transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition-colors" />
        )}
      </button>
      {isOpen && (
        <div className="pb-6 space-y-3 animate-fade-in">
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
    submarca: true,
    sabor: true,
    presentacion: true,
    tamaño: false,
    tipoAgua: false,
    tipoProducto: false,
    precio: true
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

  const CheckboxOption = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
    <label className="flex items-center space-x-3 cursor-pointer group select-none">
      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${checked
          ? 'bg-cyan-600 border-cyan-600 text-white'
          : 'bg-white border-gray-300 group-hover:border-cyan-400'
        }`}>
        {checked && <X className="w-3.5 h-3.5" />}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span className={`text-sm transition-colors ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
        {label}
      </span>
    </label>
  );

  return (
    <div className="w-full">
      <div className="pb-4 mb-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-900">
          <Filter className="w-5 h-5" />
          <h2 className="text-lg font-bold">Filtros</h2>
        </div>
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      <div className="space-y-1">
        {/* Marca */}
        <FilterSection
          title="Marca"
          isOpen={openSections.marca}
          onToggle={() => toggleSection('marca')}
        >
          {FILTER_OPTIONS.marcas.map((marca) => (
            <CheckboxOption
              key={marca}
              label={marca}
              checked={filters.marca.includes(marca)}
              onChange={() => handleCheckboxChange('marca', marca)}
            />
          ))}
        </FilterSection>

        {/* Submarca */}
        <FilterSection
          title="Submarca"
          isOpen={openSections.submarca}
          onToggle={() => toggleSection('submarca')}
        >
          {FILTER_OPTIONS.submarcas.map((submarca) => (
            <CheckboxOption
              key={submarca}
              label={submarca}
              checked={filters.submarca.includes(submarca)}
              onChange={() => handleCheckboxChange('submarca', submarca)}
            />
          ))}
        </FilterSection>

        {/* Sabor */}
        <FilterSection
          title="Sabor"
          isOpen={openSections.sabor}
          onToggle={() => toggleSection('sabor')}
        >
          {FILTER_OPTIONS.sabores.map((sabor) => (
            <CheckboxOption
              key={sabor}
              label={sabor}
              checked={filters.sabor.includes(sabor)}
              onChange={() => handleCheckboxChange('sabor', sabor)}
            />
          ))}
        </FilterSection>

        {/* Presentación */}
        <FilterSection
          title="Presentación"
          isOpen={openSections.presentacion}
          onToggle={() => toggleSection('presentacion')}
        >
          {FILTER_OPTIONS.presentaciones.map((presentacion) => (
            <CheckboxOption
              key={presentacion}
              label={presentacion}
              checked={filters.presentacion.includes(presentacion)}
              onChange={() => handleCheckboxChange('presentacion', presentacion)}
            />
          ))}
        </FilterSection>

        {/* Tamaño */}
        <FilterSection
          title="Tamaño"
          isOpen={openSections.tamaño}
          onToggle={() => toggleSection('tamaño')}
        >
          {FILTER_OPTIONS.tamaños.map((tamaño) => (
            <CheckboxOption
              key={tamaño}
              label={tamaño}
              checked={filters.tamaño.includes(tamaño)}
              onChange={() => handleCheckboxChange('tamaño', tamaño)}
            />
          ))}
        </FilterSection>

        {/* Tipo de agua */}
        <FilterSection
          title="Tipo de agua"
          isOpen={openSections.tipoAgua}
          onToggle={() => toggleSection('tipoAgua')}
        >
          {FILTER_OPTIONS.tiposAgua.map((tipoAgua) => (
            <CheckboxOption
              key={tipoAgua}
              label={tipoAgua}
              checked={filters.tipoAgua.includes(tipoAgua)}
              onChange={() => handleCheckboxChange('tipoAgua', tipoAgua)}
            />
          ))}
        </FilterSection>

        {/* Tipo de producto */}
        <FilterSection
          title="Tipo de producto"
          isOpen={openSections.tipoProducto}
          onToggle={() => toggleSection('tipoProducto')}
        >
          {FILTER_OPTIONS.tiposProducto.map((tipoProducto) => (
            <CheckboxOption
              key={tipoProducto}
              label={tipoProducto}
              checked={filters.tipoProducto.includes(tipoProducto)}
              onChange={() => handleCheckboxChange('tipoProducto', tipoProducto)}
            />
          ))}
        </FilterSection>

        {/* Precio */}
        <FilterSection
          title="Precio"
          isOpen={openSections.precio}
          onToggle={() => toggleSection('precio')}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                  className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-gray-50 focus:bg-white"
                  placeholder="Min"
                />
              </div>
              <span className="text-gray-400">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                  className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-gray-50 focus:bg-white"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default ProductFilters;

