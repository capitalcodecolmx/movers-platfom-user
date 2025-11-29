import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import type { Product } from '../../data/mockData';

interface SearchResultsProps {
    results: Product[];
    query: string;
    isLoading: boolean;
    onClose: () => void;
    onSelectResult: (product: Product) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
    results,
    query,
    isLoading,
    onClose,
    onSelectResult,
}) => {
    if (isLoading) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Buscando...</span>
                </div>
            </div>
        );
    }

    if (!query.trim()) {
        return null;
    }

    if (results.length === 0) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-6 z-50">
                <div className="text-center py-4">
                    <Icon icon="ph:magnifying-glass" className="mx-auto text-gray-400 mb-3" width="48" height="48" />
                    <p className="text-gray-600 font-medium">No se encontraron productos</p>
                    <p className="text-gray-400 text-sm mt-1">Intenta con otra búsqueda</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
            <div className="p-2">
                <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                    {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
                </div>
                {results.map((product) => (
                    <Link
                        key={product.id}
                        to={`/products?id=${product.id}`}
                        onClick={() => {
                            onSelectResult(product);
                            onClose();
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150 group"
                    >
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-cyan-600 transition-colors">
                                {product.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{product.description}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-bold text-cyan-600">${product.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">{product.presentacion}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
                <Link
                    to="/products"
                    onClick={onClose}
                    className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center justify-center gap-1"
                >
                    Ver todos los productos
                    <Icon icon="ph:arrow-right" width="14" height="14" />
                </Link>
            </div>
        </div>
    );
};

export default SearchResults;
