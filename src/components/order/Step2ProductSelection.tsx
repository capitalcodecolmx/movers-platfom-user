// =====================================================
// PASO 2: SELECCIÓN DE PRODUCTOS Y CANTIDADES
// =====================================================

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, AlertCircle, Minus, Plus, ShoppingCart, Trash2, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { useProductsStore } from '../../store/useProductsStore';
import { useOrderStore, type OrderItem } from '../../store/useOrderStore'; // Import Order Store
import { PRODUCTS, type Product } from '../../data/mockData';

interface Step2ProductSelectionProps {
  onNext: () => void;
  onPrev: () => void;
}

const ITEMS_PER_PAGE = 6;

const Step2ProductSelection: React.FC<Step2ProductSelectionProps> = ({
  onNext,
  onPrev,
}) => {
  const { products, isLoading, error, fetchProducts } = useProductsStore();
  const {
    orderItems,
    addItem,
    updateItemQuantity,
    removeItem,
    getTotalPrice,
    serviceType
  } = useOrderStore(); // Use Order Store

  const [showValidationError, setShowValidationError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [presentationFilter, setPresentationFilter] = useState<'all' | string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, presentationFilter, viewMode]);

  const displayProducts = products.length > 0 ? products : PRODUCTS;
  const orderTotal = getTotalPrice();

  const uniquePresentations = useMemo(() => {
    const set = new Set<string>();
    displayProducts.forEach((product) => {
      if (product.presentacion) {
        set.add(product.presentacion);
      }
    });
    return Array.from(set);
  }, [displayProducts]);

  const filteredProducts = displayProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.presentacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tamaño?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPresentation =
      presentationFilter === 'all' || product.presentacion === presentationFilter;

    return matchesSearch && matchesPresentation;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const paginationInfo = useMemo(() => {
    if (filteredProducts.length === 0) {
      return { start: 0, end: 0 };
    }
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length);
    return { start, end };
  }, [filteredProducts.length, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleQuantityChange = (product: Product, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(product.id);
    } else {
      // Check if exists to update or add
      const existing = orderItems.find(i => i.productId === product.id);
      if (existing) {
        updateItemQuantity(product.id, newQuantity);
      } else {
        addItem({
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          presentacion: product.presentacion,
          tamaño: product.tamaño,
          quantity: newQuantity,
        });
      }
    }
    setShowValidationError(false);
  };

  const handleCardClick = (product: Product) => {
    const currentQty = orderItems.find((item) => item.productId === product.id)?.quantity || 0;
    handleQuantityChange(product, currentQty + 1);
  };

  const handleNext = () => {
    if (orderItems.length === 0) {
      setShowValidationError(true);
      return;
    }
    onNext();
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
            2. Productos y cantidades
          </h2>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            Agrega los productos de Blanquita que necesitas y arma tu pedido
          </p>
        </div>

        <div className="space-y-8">
          {serviceType && (
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Servicio seleccionado:&nbsp;
                <span className="font-semibold text-gray-900">
                  {serviceType === 'delivery' ? 'Entrega a domicilio' : 'Recolección en Aguacentro'}
                </span>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, presentación o tamaño"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={presentationFilter}
                  onChange={(e) => setPresentationFilter(e.target.value as any)}
                  className="w-full sm:w-56 pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                >
                  <option value="all">Todas las presentaciones</option>
                  {uniquePresentations.map((presentation) => (
                    <option key={presentation} value={presentation}>
                      {presentation}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1 self-start">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium transition ${viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium transition ${viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                  }`}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Listado de productos */}
            <div className="lg:col-span-2 space-y-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
                  <p className="text-gray-900 font-semibold mb-2">No encontramos productos</p>
                  <p className="text-gray-500 text-sm">
                    Ajusta tu búsqueda o quita los filtros para ver todo el catálogo.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => {
                    const quantity = orderItems.find(
                      (item) => item.productId === product.id
                    )?.quantity || 0;

                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleCardClick(product)}
                        className={`relative flex flex-col h-full p-4 rounded-2xl text-left border-2 transition-all duration-300 ${quantity > 0
                            ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-[1.01]'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-900'
                          }`}
                      >
                        <div className="relative aspect-[4/5] mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Sin+imagen';
                            }}
                          />
                        </div>

                        <div className="flex-1 flex flex-col">
                          <span
                            className={`text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 ${quantity > 0 ? 'text-gray-300' : 'text-gray-500'
                              }`}
                          >
                            {product.presentacion} • {product.tamaño}
                          </span>
                          <h3 className="font-semibold text-lg leading-snug mb-2">{product.name}</h3>
                          <p
                            className={`text-sm mb-4 line-clamp-2 ${quantity > 0 ? 'text-gray-300' : 'text-gray-500'
                              }`}
                          >
                            {product.description}
                          </p>
                          <div className="mt-auto flex items-end justify-between">
                            <p className="text-2xl font-bold">
                              ${Number(product.price).toFixed(2)}
                            </p>
                            {quantity > 0 && (
                              <div className="flex items-center space-x-3 bg-white/10 rounded-full px-3 py-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(product, Math.max(0, quantity - 1));
                                  }}
                                  className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition text-white"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-6 text-center font-semibold">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(product, quantity + 1);
                                  }}
                                  className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition text-white"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {quantity > 0 && (
                          <span className="absolute -top-3 -right-3 bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow">
                            {quantity} en pedido
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedProducts.map((product) => {
                    const quantity = orderItems.find(
                      (item) => item.productId === product.id
                    )?.quantity || 0;

                    return (
                      <div
                        key={product.id}
                        className="flex flex-col sm:flex-row items-start gap-4 p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition"
                      >
                        <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden p-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-contain w-full h-full"
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                              {product.presentacion}
                            </span>
                            <span className="text-xs text-gray-400">• {product.tamaño}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-stretch gap-2 w-full sm:w-48">
                          <p className="text-xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</p>
                          <div className="flex items-center justify-between bg-gray-100 rounded-full px-3 py-1.5">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product, Math.max(0, quantity - 1))}
                              className="p-1 rounded-full hover:bg-white transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-semibold text-gray-900">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(product, quantity + 1)}
                              className="p-1 rounded-full hover:bg-white transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(product, quantity + 1)}
                            className="w-full rounded-full bg-black text-white py-2 text-sm font-semibold hover:bg-gray-800 transition"
                          >
                            Agregar rápido
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredProducts.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-100 rounded-2xl p-3">
                  <p className="text-sm text-gray-500">
                    Mostrando {paginationInfo.start} – {paginationInfo.end} de {filteredProducts.length} productos
                  </p>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm rounded-full border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        Anterior
                      </button>
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const page = index + 1;
                        const isActive = page === currentPage;
                        return (
                          <button
                            type="button"
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-9 h-9 rounded-full text-sm font-medium transition ${
                              isActive
                                ? 'bg-black text-white'
                                : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm rounded-full border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resumen del pedido */}
            <div className="space-y-6">
              <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-full bg-white/10">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Resumen</p>
                    <p className="text-lg font-semibold">Tu pedido</p>
                  </div>
                </div>

                {orderItems.length === 0 ? (
                  <p className="text-sm text-gray-300">
                    Selecciona al menos un producto para continuar.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <ul className="divide-y divide-white/10">
                      {orderItems.map((item) => (
                        <li key={item.productId} className="py-3 flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-xs text-gray-400">
                              {item.quantity} x ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition"
                              aria-label={`Eliminar ${item.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <span>Subtotal</span>
                        <span>${orderTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <span>Entrega</span>
                        <span>{serviceType === 'delivery' ? '$0.00' : 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold mt-3">
                        <span>Total</span>
                        <span>${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {showValidationError && (
                <p className="text-sm text-red-500">
                  Selecciona al menos un producto para continuar.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={onPrev}
                  className="w-full sm:w-auto text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Anterior
                </button>
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={orderItems.length === 0}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2ProductSelection;
