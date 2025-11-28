import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { COMPANY_INFO } from '../data/mockData';

// Import promotional images
import promo1 from '../assets/images/promotions/promo1.png';
import promo2 from '../assets/images/promotions/promo2.png';
import promo3 from '../assets/images/promotions/promo3.png';

interface Promotion {
    id: string;
    title: string;
    description: string;
    discount?: string;
    ctaText?: string;
    ctaLink?: string;
    image: string;
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
        ctaLink: '/products',
        image: promo1
    },
    {
        id: '2',
        title: 'Envío Rápido y Seguro',
        description: 'Llevamos el agua hasta la puerta de tu hogar',
        discount: 'EXPRESS',
        ctaText: 'Ver Productos',
        ctaLink: '/products',
        image: promo2
    },
    {
        id: '3',
        title: 'Calidad Premium',
        description: 'La pureza que tu familia merece',
        discount: 'PREMIUM',
        ctaText: 'Descubrir',
        ctaLink: '/products',
        image: promo3
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
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

        // Animate current slide in
        gsap.fromTo(
            slides[currentIndex],
            {
                opacity: 0,
                scale: 1.05
            },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out'
            }
        );

        // Animate content elements
        const currentSlide = slides[currentIndex];
        const contentElements = currentSlide.querySelectorAll('.animate-content');

        gsap.fromTo(
            contentElements,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.2
            }
        );

        // Hide other slides
        slides.forEach((slide, index) => {
            if (index !== currentIndex) {
                gsap.set(slide, { opacity: 0 });
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

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Updated aspect ratio for a wider, more compact look */}
            <div ref={sliderRef} className="relative overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[32/9] min-h-[300px] md:min-h-[380px]">
                {promotions.map((promotion, index) => (
                    <div
                        key={promotion.id}
                        className={`promo-slide absolute inset-0 w-full h-full ${index === currentIndex ? 'z-10' : 'z-0'}`}
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
                            style={{ backgroundImage: `url(${promotion.image})` }}
                        />

                        {/* Gradient Overlay for Text Readability - Darker for better contrast */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>

                        {/* Logo Watermark Pattern */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: `url(${COMPANY_INFO.logo})`, backgroundSize: '100px', backgroundRepeat: 'repeat' }}>
                        </div>

                        {/* Content - Adjusted padding and max-width */}
                        <div className="relative z-20 h-full flex flex-col justify-center px-8 sm:px-12 md:px-20 lg:px-32 max-w-4xl">
                            {/* Discount Badge */}
                            {promotion.discount && (
                                <div className="animate-content mb-3">
                                    <div className="inline-flex items-center gap-2 bg-cyan-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold text-xs sm:text-sm shadow-lg border border-cyan-400/50">
                                        <Icon icon="solar:tag-bold" className="w-4 h-4" />
                                        <span>{promotion.discount}</span>
                                    </div>
                                </div>
                            )}

                            {/* Title - Slightly smaller to fit compact height */}
                            <h3 className="animate-content text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg leading-tight">
                                {promotion.title}
                            </h3>

                            {/* Description */}
                            <p className="animate-content text-gray-200 text-base sm:text-lg md:text-xl font-medium mb-6 max-w-lg drop-shadow-md leading-relaxed">
                                {promotion.description}
                            </p>

                            {/* CTA Button */}
                            {promotion.ctaText && promotion.ctaLink && (
                                <div className="animate-content">
                                    <Link
                                        to={promotion.ctaLink}
                                        className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-cyan-50 transition-all transform hover:scale-105 shadow-xl hover:shadow-cyan-500/20 text-sm sm:text-base"
                                    >
                                        <span>{promotion.ctaText}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Large Branding Watermark (Bottom Right) */}
                        <div className="absolute bottom-6 right-6 z-10 opacity-10 hidden lg:block">
                            <img
                                src={COMPANY_INFO.logo}
                                alt="Watermark"
                                className="h-32 w-auto brightness-0 invert"
                            />
                        </div>
                    </div>
                ))}

                {/* Navigation Arrows - Adjusted position */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all hover:scale-110 z-30 border border-white/10 group"
                    aria-label="Anterior"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 md:p-3 rounded-full transition-all hover:scale-110 z-30 border border-white/10 group"
                    aria-label="Siguiente"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    {promotions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full h-1.5 shadow-lg ${index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-white/40 w-2 hover:bg-white/60'
                                }`}
                            aria-label={`Ir a slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PromotionsSlider;


