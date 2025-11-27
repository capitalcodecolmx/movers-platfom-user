import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
    // This will recompute whenever filters, sortField, or sortDirection change
    const filteredAndSortedProducts = React.useMemo(() => {
        return getFilteredAndSortedProducts();
    }, [filters, sortField, sortDirection, getFilteredAndSortedProducts]);

    useEffect(() => {
        // Initialize image cache on mount
        initializeImageCache();
    }, []);

    return (
        <PublicLayout>
            {/* Green Shipping Banner */}
            <div className="bg-[#00A859] text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center sm:justify-between text-xs sm:text-sm">
                        <div className="flex items-center space-x-2">
                            <span>🚚</span>
                            <span className="font-medium text-center sm:text-left">ENVÍO GRATIS sin mínimo de compra</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
                    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
                        <Link to="/" className="hover:text-orange-600 transition-colors whitespace-nowrap">
                            Inicio
                        </Link>
                        <span>/</span>
                        <Link to="/products" className="hover:text-orange-600 transition-colors whitespace-nowrap">
                            Categorías
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium whitespace-nowrap">Productos</span>
                    </nav>
                </div>
            </div>

            {/* Main Promotional Banner */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 py-6 sm:py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="text-2xl sm:text-3xl md:text-4xl">🏠</div>
                            <div>
                                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                                    AGUA BLANQUITA. EN TU CASA llegamos.
                                </h2>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-orange-600">
                                CONOCE TODOS NUESTROS PRODUCTOS Y PROMOCIONES
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">TOMA AGUA</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
                    {/* Filter Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <span className="font-medium text-gray-900">Filtros</span>
                                {mobileFiltersOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden lg:block">
                            <ProductFilters />
                        </div>

                        {/* Mobile Filters */}
                        {mobileFiltersOpen && (
                            <div 
                                className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
                                onClick={() => setMobileFiltersOpen(false)}
                            >
                                <div 
                                    className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto shadow-xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                                        <h2 className="text-lg font-semibold">Filtros</h2>
                                        <button
                                            onClick={() => setMobileFiltersOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            aria-label="Cerrar filtros"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <ProductFilters />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 min-w-0">
                        {/* Page Title and Sort Control */}
                        <div className="mb-4 sm:mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">
                                        Productos de agua a domicilio con envío gratis | Agua Blanquita, origen 100% natural
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-600">Conoce los productos Agua Blanquita</p>
                                </div>
                                <div className="flex-shrink-0 w-full sm:w-auto">
                                    <ProductSort />
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                                {filteredAndSortedProducts.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12">
                                <p className="text-gray-500 text-base sm:text-lg px-4">No se encontraron productos con los filtros seleccionados.</p>
                                <button
                                    onClick={() => useProductsStore.getState().clearFilters()}
                                    className="mt-4 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium text-sm sm:text-base"
                                >
                                    Limpiar filtros
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
