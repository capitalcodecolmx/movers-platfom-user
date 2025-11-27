import React from 'react';
import { useProductsStore } from '../store/useProductsStore';

const ProductSort: React.FC = () => {
  const { sortField, sortDirection, setSort } = useProductsStore();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    switch (value) {
      case 'price-asc':
        setSort('price', 'asc');
        break;
      case 'price-desc':
        setSort('price', 'desc');
        break;
      case 'name-asc':
        setSort('name', 'asc');
        break;
      case 'name-desc':
        setSort('name', 'desc');
        break;
      default:
        setSort('name', 'asc');
    }
  };

  const getCurrentValue = () => {
    if (sortField === 'price' && sortDirection === 'asc') return 'price-asc';
    if (sortField === 'price' && sortDirection === 'desc') return 'price-desc';
    if (sortField === 'name' && sortDirection === 'asc') return 'name-asc';
    if (sortField === 'name' && sortDirection === 'desc') return 'name-desc';
    return 'name-asc';
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
      <label htmlFor="sort-select" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={getCurrentValue()}
        onChange={handleSortChange}
        className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-colors cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          paddingRight: '2rem'
        }}
      >
        <option value="price-asc">Precio: Menor a Mayor</option>
        <option value="price-desc">Precio: Mayor a Menor</option>
        <option value="name-asc">Nombre: A-Z</option>
        <option value="name-desc">Nombre: Z-A</option>
      </select>
    </div>
  );
};

export default ProductSort;

