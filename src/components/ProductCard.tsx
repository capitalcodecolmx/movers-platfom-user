import React from 'react';
import type { Product } from '../data/mockData';
import { useCartStore } from '../store/useCartStore';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdded, setIsAdded] = React.useState(false);

    const handleAddToCart = () => {
        addItem(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
            <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-cyan-600">
                        ${product.price.toFixed(2)}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${isAdded
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-900 text-white hover:bg-cyan-600'
                            }`}
                    >
                        {isAdded ? (
                            <>
                                <Check size={18} /> Agregado
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={18} /> Agregar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
