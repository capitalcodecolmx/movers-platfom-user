import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { COMPANY_INFO } from '../data/mockData';

interface Promotion {
    id: string;
    title: string;
    description: string;
    discount?: string;
    ctaText?: string;
    ctaLink?: string;
}

interface PromotionsSliderProps {
    promotions?: Promotion[];
    autoSlideInterval?: number;
    className?: string;
}

const defaultPromotions: Promotion[] = [
    {
        id: '1',
        title: '¡Oferta Especial!',
        description: '20% de descuento en tu primer pedido',
        discount: '20% OFF',
        ctaText: 'Aprovechar Oferta',
        ctaLink: '/products'
    },
    {
        id: '2',
        title: 'Envío Gratis',
        description: 'En compras mayores a $50',
        discount: 'GRATIS',
        ctaText: 'Ver Productos',
        ctaLink: '/products'
    },
    {
        id: '3',
        title: 'Pack Familiar',
        description: 'Ahorra hasta $15 en packs familiares',
        discount: 'AHORRA',
        ctaText: 'Descubrir',
        ctaLink: '/products'
    }
];

const PromotionsSlider: React.FC<PromotionsSliderProps> = ({
    promotions = defaultPromotions,
    autoSlideInterval = 5000,
    className = ''
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-slide functionality
    useEffect(() => {
        if (isPaused) return;

        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promotions.length);
        }, autoSlideInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPaused, autoSlideInterval, promotions.length]);

    // Animation on slide change
    useGSAP(() => {
        if (!sliderRef.current) return;

        const slides = sliderRef.current.querySelectorAll('.promo-slide');
        if (slides.length === 0) return;

        gsap.fromTo(
            slides[currentIndex],
            {
                opacity: 0,
                x: 50,
                scale: 0.95
            },
            {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power3.out'
            }
        );

        // Hide other slides
        slides.forEach((slide, index) => {
            if (index !== currentIndex) {
                gsap.to(slide, {
                    opacity: 0,
                    x: -50,
                    scale: 0.95,
                    duration: 0.4,
                    ease: 'power2.in'
                });
            }
        });
    }, { scope: sliderRef, dependencies: [currentIndex] });

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const goToPrevious = () => {
        goToSlide((currentIndex - 1 + promotions.length) % promotions.length);
    };

    const goToNext = () => {
        goToSlide((currentIndex + 1) % promotions.length);
    };

    const currentPromotion = promotions[currentIndex];

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div ref={sliderRef} className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
                {/* Promotion Poster */}
                <div className="promo-slide relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl overflow-hidden min-h-[180px] sm:min-h-[200px] md:min-h-[240px] lg:min-h-[280px]">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-white/10 rounded-full blur-3xl -mr-12 sm:-mr-16 md:-mr-20 lg:-mr-24 -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-yellow-400/20 rounded-full blur-3xl -ml-10 sm:-ml-14 md:-ml-18 -mb-10 sm:-mb-14 md:-mb-18"></div>
                    
                    {/* Logo Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <img 
                            src={COMPANY_INFO.logo} 
                            alt={COMPANY_INFO.name}
                            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain"
                        />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center h-full min-h-[180px] sm:min-h-[200px] md:min-h-[240px] lg:min-h-[280px] py-2">
                        {/* Discount Badge */}
                        {currentPromotion.discount && (
                            <div className="mb-2 sm:mb-3 md:mb-4">
                                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 border-2 border-white/30 shadow-xl">
                                    <Icon icon="solar:tag-bold" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-300 animate-pulse" />
                                    <span className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold drop-shadow-lg">
                                        {currentPromotion.discount}
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        {/* Title */}
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 sm:mb-3 drop-shadow-2xl leading-tight px-4">
                            {currentPromotion.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-white/95 text-sm sm:text-base md:text-lg lg:text-xl font-semibold leading-snug max-w-2xl mx-auto mb-3 sm:mb-4 md:mb-5 px-4 drop-shadow-lg">
                            {currentPromotion.description}
                        </p>
                        
                        {/* CTA Button */}
                        {currentPromotion.ctaText && currentPromotion.ctaLink && (
                            <Link
                                to={currentPromotion.ctaLink}
                                className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-white text-orange-600 font-extrabold rounded-full hover:bg-orange-50 transition-all transform hover:scale-110 shadow-2xl hover:shadow-white/50 text-xs sm:text-sm md:text-base border-2 border-white/50"
                            >
                                <span className="whitespace-nowrap">{currentPromotion.ctaText}</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </Link>
                        )}
                    </div>

                    {/* Branding Badge - Bottom Right */}
                    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 z-20">
                        <div className="bg-white/20 backdrop-blur-md rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 border border-white/30 shadow-lg">
                            <img 
                                src={COMPANY_INFO.logo} 
                                alt={COMPANY_INFO.name}
                                className="h-5 sm:h-6 md:h-7 w-auto brightness-0 invert"
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 sm:left-6 md:left-8 lg:left-10 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-md text-white p-2.5 sm:p-3 md:p-3.5 rounded-full transition-all duration-300 hover:scale-110 sm:hover:scale-125 hover:shadow-xl z-20 border border-white/30"
                    aria-label="Promoción anterior"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-4 sm:right-6 md:right-8 lg:right-10 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-md text-white p-2.5 sm:p-3 md:p-3.5 rounded-full transition-all duration-300 hover:scale-110 sm:hover:scale-125 hover:shadow-xl z-20 border border-white/30"
                    aria-label="Siguiente promoción"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
                {promotions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                            index === currentIndex
                                ? 'bg-white w-8 h-2 sm:w-10 sm:h-3 shadow-lg shadow-white/50'
                                : 'bg-white/50 w-2 h-2 sm:w-3 sm:h-3 hover:bg-white/70 hover:w-3 sm:hover:w-4'
                        }`}
                        aria-label={`Ir a promoción ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default PromotionsSlider;

