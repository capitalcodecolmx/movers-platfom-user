import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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
            <div ref={sliderRef} className="relative overflow-hidden rounded-2xl md:rounded-3xl">
                {/* Promotion Card */}
                <div className="promo-slide relative bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl overflow-hidden min-h-[200px] sm:min-h-[240px] md:min-h-[280px]">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-cyan-400/20 rounded-full blur-3xl -mr-16 sm:-mr-24 md:-mr-32 -mt-16 sm:-mt-24 md:-mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-blue-400/20 rounded-full blur-3xl -ml-12 sm:-ml-18 md:-ml-24 -mb-12 sm:-mb-18 md:-mb-24"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                        <div className="flex-1 w-full text-center lg:text-left">
                            {currentPromotion.discount && (
                                <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <Icon icon="solar:tag-bold" className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-4 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-extrabold shadow-xl transform hover:scale-105 transition-transform">
                                        {currentPromotion.discount}
                                    </span>
                                </div>
                            )}
                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 sm:mb-3 drop-shadow-2xl leading-tight">
                                {currentPromotion.title}
                            </h3>
                            <p className="text-cyan-50 text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {currentPromotion.description}
                            </p>
                        </div>
                        {currentPromotion.ctaText && currentPromotion.ctaLink && (
                            <Link
                                to={currentPromotion.ctaLink}
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-white text-cyan-700 font-bold rounded-full hover:bg-cyan-50 transition-all transform hover:scale-110 shadow-2xl hover:shadow-cyan-500/50 text-sm sm:text-base md:text-lg"
                            >
                                <span className="whitespace-nowrap">{currentPromotion.ctaText}</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            </Link>
                        )}
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

