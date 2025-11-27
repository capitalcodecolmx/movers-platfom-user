import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Filter, ChevronRight } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import ProductSort from '../components/ProductSort';
import { useProductsStore, initializeImageCache } from '../store/useProductsStore';

const ProductsPage: React.FC = () => {
    // Subscribe to all state that affects filtering/sorting to ensure reactivity
    const filters = useProductsStore((state) => state.filters);
    const sortField = useProductsStore((state) => state.sortField);
    const sortDirection = useProductsStore((state) => state.sortDirection);
    const getFilteredAndSortedProducts = useProductsStore((state) => state.getFilteredAndSortedProducts);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Compute filtered and sorted products reactively
    const filteredAndSortedProducts = React.useMemo(() => {
        return getFilteredAndSortedProducts();
    }, [filters, sortField, sortDirection, getFilteredAndSortedProducts]);

    useEffect(() => {
        // Initialize image cache on mount
        initializeImageCache();
    }, []);

    return (
        <PublicLayout>
            {/* Top Notification Bar */}
            <div className="bg-gray-900 text-white py-2.5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center text-xs sm:text-sm font-medium tracking-wide">
                        <span>🚚 ENVÍO GRATIS sin mínimo de compra</span>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs & Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                        <Link to="/" className="hover:text-cyan-600 transition-colors">Inicio</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gray-900 font-medium">Productos</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Catálogo de Productos
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
                                Descubre nuestra selección de agua purificada de la más alta calidad, directamente a tu hogar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar (Desktop) */}
                    <div className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <ProductFilters />
                        </div>
                    </div>

                    {/* Mobile Filter Toggle & Sort */}
                    <div className="lg:hidden flex items-center justify-between mb-6 gap-4">
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                        </button>
                        <div className="flex-1">
                            <ProductSort />
                        </div>
                    </div>

                    {/* Mobile Filters Drawer */}
                    {mobileFiltersOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
                            <div className="absolute inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
                                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                                    <button
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
                                    <ProductFilters />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                                    <button
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        Ver Resultados
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="flex-1 min-w-0">
                        {/* Desktop Sort */}
                        <div className="hidden lg:flex justify-end mb-6">
                            <ProductSort />
                        </div>

                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredAndSortedProducts.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Filter className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No se encontraron productos</h3>
                                <p className="text-gray-500 text-center max-w-md mb-6">
                                    Intenta ajustar los filtros o buscar con otros términos.
                                </p>
                                <button
                                    onClick={() => useProductsStore.getState().clearFilters()}
                                    className="px-6 py-2.5 bg-cyan-600 text-white rounded-full font-medium hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-200"
                                >
                                    Limpiar todos los filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default ProductsPage;
