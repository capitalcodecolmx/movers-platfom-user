// =====================================================
// PASO 2: SELECCIÓN DE PRODUCTOS Y CANTIDADES
// =====================================================

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, AlertCircle, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useProductsStore } from '../../store/useProductsStore';
import { PRODUCTS, type Product } from '../../data/mockData';

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
  const orderItems = data.orderItems || [];
  const [showValidationError, setShowValidationError] = useState(false);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const displayProducts = products.length > 0 ? products : PRODUCTS;

  const orderTotal = useMemo(
    () => orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
    [orderItems]
  );

  const updateItems = (items: any[]) => {
    onUpdate({
      orderItems: items,
      estimatedCost: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    });
  };

  const handleQuantityChange = (product: Product, newQuantity: number) => {
    const clonedItems = [...orderItems];
    const existingIndex = clonedItems.findIndex((item: any) => item.productId === product.id);

    if (newQuantity <= 0) {
      if (existingIndex >= 0) {
        clonedItems.splice(existingIndex, 1);
      }
    } else if (existingIndex >= 0) {
      clonedItems[existingIndex] = {
        ...clonedItems[existingIndex],
        quantity: newQuantity,
      };
    } else {
      clonedItems.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        presentacion: product.presentacion,
        tamaño: product.tamaño,
        quantity: newQuantity,
      });
    }

    updateItems(clonedItems);
    setShowValidationError(false);
  };

  const handleCardClick = (product: Product) => {
    const currentQty = orderItems.find((item: any) => item.productId === product.id)?.quantity || 0;
    handleQuantityChange(product, currentQty + 1);
  };

  const handleRemoveItem = (productId: string) => {
    const filtered = orderItems.filter((item: any) => item.productId !== productId);
    updateItems(filtered);
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
          {data.serviceType && (
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Servicio seleccionado:&nbsp;
                <span className="font-semibold text-gray-900">
                  {data.serviceType === 'delivery' ? 'Entrega a domicilio' : 'Recolección en Aguacentro'}
                </span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Listado de productos */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                {displayProducts.map((product) => {
                  const quantity = orderItems.find(
                    (item: any) => item.productId === product.id
                  )?.quantity || 0;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleCardClick(product)}
                      className={`relative flex flex-col h-full p-4 rounded-2xl text-left border-2 transition-all duration-300 ${
                        quantity > 0
                          ? 'bg-gray-900 border-gray-900 text-white shadow-xl scale-[1.01]'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-900'
                      }`}
                    >
                      <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-4">
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
                          className={`text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 ${
                            quantity > 0 ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {product.presentacion} • {product.tamaño}
                        </span>
                        <h3 className="font-semibold text-lg leading-snug mb-2">{product.name}</h3>
                        <p
                          className={`text-sm mb-4 line-clamp-2 ${
                            quantity > 0 ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {product.description}
                        </p>
                        <div className="mt-auto flex items-end justify-between">
                          <p className="text-2xl font-bold">
                            ${Number(product.price).toFixed(2)}
                          </p>
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
                      {orderItems.map((item: any) => (
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
                              onClick={() => handleRemoveItem(item.productId)}
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
                        <span>{data.serviceType === 'delivery' ? '$0.00' : 'N/A'}</span>
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
