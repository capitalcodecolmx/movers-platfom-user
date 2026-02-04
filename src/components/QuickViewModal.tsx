import React, { useEffect, useRef } from 'react';
import { X, ShoppingCart, Heart, Activity } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Product } from '../data/mockData';
import GlassButton from './ui/GlassButton';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const addItem = useCartStore((state) => state.addItem);
    const { isInWishlist, toggleItem } = useWishlistStore();

    useGSAP(() => {
        if (isOpen) {
            gsap.fromTo(modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
            gsap.fromTo(contentRef.current,
                { y: 50, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.4, delay: 0.1, ease: 'back.out(1.2)' }
            );
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const isInWish = isInWishlist(product.id);

    // Mock benefits since they aren't in the schema yet
    const benefits = [
        "Purificado & Refrescante",
        "Libre de BPA",
        "Uso Diario",
        "Calidad Premium"
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                ref={modalRef}
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                ref={contentRef}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-gray-900 transition-colors backdrop-blur-sm"
                >
                    <X size={24} />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200/50" />
                    <img
                        src={product.image}
                        alt={product.name}
                        className="relative z-10 w-full h-auto max-h-[400px] object-contain drop-shadow-xl"
                    />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
                    <div className="mb-1">
                        <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider bg-cyan-50 px-2 py-1 rounded">
                            {product.marca}
                        </span>
                    </div>

                    <h2 id="modal-title" className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 mt-3">
                        {product.name}
                    </h2>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                        {product.submarca && (
                            <span className="text-sm text-gray-500 font-medium px-2 py-0.5 border border-gray-200 rounded-full">
                                {product.submarca}
                            </span>
                        )}
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-6">
                        {product.description || "Agua purificada de la más alta calidad para tu hogar u oficina. Disfruta de la frescura y pureza en cada gota."}
                    </p>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Beneficios</h3>
                        <ul className="space-y-2">
                            {benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center text-sm text-gray-600">
                                    <Activity size={16} className="text-cyan-500 mr-2" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-auto flex flex-col gap-4">
                        <div className="grid grid-cols-[1fr_auto] gap-3">
                            <GlassButton
                                label={
                                    <span className="flex items-center gap-2">
                                        <ShoppingCart size={20} />
                                        Agregar al Carrybag
                                    </span>
                                }
                                variant="dark-blue"
                                size="lg"
                                onClick={() => {
                                    addItem(product);
                                    onClose();
                                }}
                                className="w-full justify-center"
                            />

                            <button
                                onClick={() => toggleItem(product)}
                                className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-center ${isInWish
                                    ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                                    : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                                    }`}
                                title={isInWish ? "Remover de favoritos" : "Agregar a favoritos"}
                            >
                                <Heart size={24} fill={isInWish ? "currentColor" : "none"} />
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-sm text-gray-500 hover:text-gray-900 underline text-center"
                        >
                            Continuar comprando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
