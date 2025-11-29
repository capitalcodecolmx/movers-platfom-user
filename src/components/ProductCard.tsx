import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Product } from '../data/mockData';
import { useCartStore } from '../store/useCartStore';
import { Check, Plus } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
    const addItem = useCartStore((state) => state.addItem);
    const [isAdded, setIsAdded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Use product image directly from public folder
    const imageSrc = product.image;

    // Entrance animation
    useGSAP(() => {
        gsap.fromTo(
            cardRef.current,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.05, // Faster stagger
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top bottom-=50',
                    toggleActions: 'play none none none'
                }
            }
        );
    }, { scope: cardRef });

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if wrapped in Link
        addItem(product);
        setIsAdded(true);

        // Animate the button
        if (cardRef.current) {
            const btn = cardRef.current.querySelector('.add-btn');
            if (btn) {
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            }
        }

        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleMouseEnter = () => {
        if (imageRef.current && !imageError) {
            gsap.to(imageRef.current, {
                scale: 1.1,
                y: -8,
                duration: 0.4,
                ease: 'power2.out'
            });
        }
    };

    const handleMouseLeave = () => {
        if (imageRef.current && !imageError) {
            gsap.to(imageRef.current, {
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        }
    };

    return (
        <div
            ref={cardRef}
            className="group relative bg-white rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-100 flex flex-col h-full overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image Container - Improved sizing and responsive */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-xl group-hover:from-gray-100 group-hover:to-gray-200 transition-all duration-300">
                <div className="aspect-square flex items-center justify-center p-4 sm:p-6 md:p-8">
                    <img
                        ref={imageRef}
                        src={imageSrc}
                        alt={product.name}
                        onError={() => setImageError(true)}
                        className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-lg transition-transform duration-300"
                        loading="lazy"
                    />
                </div>

                {/* Loading placeholder */}
                {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-sm">Imagen no disponible</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 flex flex-col flex-1">
                {/* Category/Brand Tag */}
                <div className="mb-2">
                    <span className="text-[10px] sm:text-xs font-bold tracking-wider text-cyan-600 uppercase bg-cyan-50 px-2 py-1 rounded-sm">
                        {product.marca}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 leading-snug group-hover:text-cyan-700 transition-colors line-clamp-2 min-h-[2.5em]">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                </p>

                {/* Price and Action */}
                <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Precio</span>
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`add-btn flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-300 shadow-sm ${isAdded
                            ? 'bg-green-500 text-white shadow-green-200'
                            : 'bg-gray-900 text-white hover:bg-cyan-600 shadow-gray-200 hover:shadow-cyan-200 hover:scale-105'
                            }`}
                        aria-label="Agregar al carrito"
                    >
                        {isAdded ? (
                            <Check size={20} className="animate-bounce" />
                        ) : (
                            <Plus size={20} strokeWidth={2.5} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
