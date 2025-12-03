// =====================================================
// PASO 2: SELECCIÓN DE PRODUCTOS
// =====================================================

import React, { useEffect } from 'react';
import {
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    MdCheckCircle,
} from 'react-icons/md';
import { useProductsStore } from '../../store/useProductsStore';
import { PRODUCTS } from '../../data/mockData'; // Fallback data

interface Step2ProductSelectionProps {
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onPrev: () => void;
}

const Step2ProductSelection: React.FC<Step2ProductSelectionProps> = ({
    data,
    onUpdate,
    onNext,
    onPrev,
}) => {
    const { products, isLoading, error, fetchProducts } = useProductsStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Use store products if available, otherwise fallback to mock data (for demo purposes if DB is empty)
    const displayProducts = products.length > 0 ? products : PRODUCTS;

    const handleProductSelect = (product: any) => {
        // Mapping product to a "virtual" vehicle type for pricing/display purposes in later steps
        const virtualVehicle = {
            id: product.id,
            name: product.name,
            icon: null, // We'll use the image
            image: product.image,
            description: product.description,
            capacity: product.presentacion || 'N/A',
            type: 'moto', // Default to moto for pricing calculation logic
            isRefrigerated: false,
            price: product.price // Store price for later use
        };

        onUpdate({
            selectedProduct: product,
            selectedVehicleType: virtualVehicle, // Maintain compatibility
            vehicleType: 'moto', // Default for pricing
            estimatedCost: product.price // Set initial cost to product price
        });
    };

    const handleNext = () => {
        if (data.selectedProduct) {
            onNext();
        }
    };

    if (isLoading && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Cargando productos...</p>
            </div>
        );
    }

    if (error && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar productos</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={() => fetchProducts()}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    Intentar nuevamente
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-6 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
                        2. Selección de Productos
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
                        Selecciona los productos que deseas ordenar
                    </p>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    {/* Información del servicio seleccionado */}
                    {data.serviceType && (
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="inline-flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                                <span>Servicio: {data.serviceType === 'delivery' ? 'Pedido a Domicilio' : 'Recoge Agua Centro'}</span>
                            </div>
                        </div>
                    )}

                    {/* Lista de productos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {displayProducts.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => handleProductSelect(product)}
                                className={`relative flex flex-col h-full p-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-left group border-2 ${data.selectedProduct?.id === product.id
                                        ? 'bg-gray-800 border-gray-800 shadow-lg scale-105'
                                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                                    }`}
                            >
                                {/* Imagen */}
                                <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
                                        }}
                                    />
                                </div>

                                {/* Contenido */}
                                <div className="flex-1 flex flex-col">
                                    {/* Marca/Categoría */}
                                    <div className="mb-2">
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm ${data.selectedProduct?.id === product.id
                                                ? 'bg-gray-700 text-gray-300'
                                                : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {product.marca || product.category}
                                        </span>
                                    </div>

                                    {/* Título */}
                                    <h3 className={`font-semibold text-base sm:text-lg mb-2 transition-colors duration-300 ${data.selectedProduct?.id === product.id ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {product.name}
                                    </h3>

                                    {/* Descripción */}
                                    <p className={`text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2 transition-colors duration-300 ${data.selectedProduct?.id === product.id ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {product.description}
                                    </p>

                                    {/* Precio y Detalles */}
                                    <div className="mt-auto flex items-end justify-between">
                                        <div>
                                            <p className={`text-xs mb-1 ${data.selectedProduct?.id === product.id ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                {product.presentacion} • {product.tamaño}
                                            </p>
                                            <div className={`text-lg font-bold ${data.selectedProduct?.id === product.id ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                ${product.price.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Indicador de selección */}
                                {data.selectedProduct?.id === product.id && (
                                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10">
                                        <MdCheckCircle className="w-4 h-4 text-gray-800" />
                                    </div>
                                )}

                            </button>
                        ))}
                    </div>

                    {/* Resumen del producto seleccionado */}
                    {data.selectedProduct && (
                        <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 max-w-3xl mx-auto mt-8">
                            <h3 className="font-medium text-blue-900 mb-2 sm:mb-3 text-sm sm:text-base">Producto seleccionado</h3>
                            <div className="flex items-start space-x-3 sm:space-x-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm p-2 border border-blue-100">
                                    <img
                                        src={data.selectedProduct.image}
                                        alt={data.selectedProduct.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-blue-900 text-sm sm:text-base">{data.selectedProduct.name}</p>
                                    <p className="text-blue-700 text-xs sm:text-sm mt-1">{data.selectedProduct.description}</p>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <p className="text-blue-800 font-bold text-lg">${data.selectedProduct.price.toFixed(2)}</p>
                                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                            {data.selectedProduct.presentacion}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Botones de navegación - Estilo Apple */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                    <button
                        onClick={onPrev}
                        className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium w-full sm:w-auto text-center sm:text-left"
                    >
                        ← Anterior
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!data.selectedProduct}
                        className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm w-full sm:w-auto"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step2ProductSelection;
