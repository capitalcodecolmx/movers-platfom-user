import React, { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Product } from '../data/mockData';
import { useCartStore } from '../store/useCartStore';
import { useProductsStore } from '../store/useProductsStore';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
    const addItem = useCartStore((state) => state.addItem);
    const getCachedImage = useProductsStore((state) => state.getCachedImage);
    const [isAdded, setIsAdded] = React.useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
    // Use cached image if available, otherwise use original
    const imageSrc = useMemo(() => {
        const cached = getCachedImage(product.id);
        return cached || product.image;
    }, [product.id, product.image, getCachedImage]);

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
            className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 hover:border-cyan-200 flex flex-col h-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative pt-[100%] bg-gradient-to-br from-cyan-50 to-blue-50 overflow-hidden">
                <img
                    ref={imageRef}
                    src={imageSrc}
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-contain p-4 sm:p-6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1 min-h-0">
                <div className="mb-3 sm:mb-4 flex-1 min-h-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-cyan-600 transition-colors duration-200 line-clamp-2 leading-tight">
                        {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>

                <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-gray-100">
                    <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap overflow-hidden text-ellipsis">
                        ${product.price.toFixed(2)}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 flex-shrink-0 ${isAdded
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                                : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-cyan-500/50'
                            }`}
                    >
                        {isAdded ? (
                            <>
                                <Check size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 animate-bounce flex-shrink-0" />
                                <span className="hidden sm:inline text-xs">Agregado</span>
                                <span className="sm:hidden text-xs">✓</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="whitespace-nowrap text-xs sm:text-sm">Agregar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
