import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Product } from '../data/mockData';
import { useCartStore } from '../store/useCartStore';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdded, setIsAdded] = React.useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Entrance animation
    useGSAP(() => {
        gsap.fromTo(
            cardRef.current,
            {
                opacity: 0,
                y: 50,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none none'
                }
            }
        );
    }, { scope: cardRef });

    const handleAddToCart = () => {
        addItem(product);
        setIsAdded(true);

        // Animate the button
        if (cardRef.current) {
            gsap.to(cardRef.current.querySelector('button'), {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        }

        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleMouseEnter = () => {
        gsap.to(imageRef.current, {
            scale: 1.15,
            rotation: 5,
            duration: 0.4,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = () => {
        gsap.to(imageRef.current, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.out'
        });
    };

    return (
        <div
            ref={cardRef}
            className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 hover:border-cyan-200"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative pt-[100%] bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
                <img
                    ref={imageRef}
                    src={product.image}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-contain p-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-cyan-600 transition-colors duration-200">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${isAdded
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                                : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/50'
                            }`}
                    >
                        {isAdded ? (
                            <>
                                <Check size={18} className="animate-bounce" /> Agregado
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
