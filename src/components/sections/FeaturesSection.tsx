import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const FeaturesSection: React.FC = () => {
    const featuresRef = useRef<HTMLDivElement>(null);

    // Features animation
    useGSAP(() => {
        if (!featuresRef.current) return;

        const featureItems = featuresRef.current.querySelectorAll('.feature-item');
        const centerImage = featuresRef.current.querySelector('.center-image');

        if (centerImage) {
            gsap.fromTo(
                centerImage,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: 'top center+=100',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        if (featureItems.length > 0) {
            gsap.fromTo(
                featureItems,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: 'top center+=100',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
    }, { scope: featuresRef });

    const features = [
        {
            icon: 'mdi:water-check',
            title: 'Máxima Pureza',
            description: 'Proceso de purificación avanzado libre de cloro y metales pesados para tu tranquilidad.',
            iconColor: 'text-cyan-600',
            bgColor: 'bg-cyan-50'
        },
        {
            icon: 'mdi:shield-check',
            title: 'Calidad Garantizada',
            description: 'Filtración de múltiples pasos y controles rigurosos para asegurar la mejor calidad.',
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            icon: 'mdi:truck-fast',
            title: 'Entrega Rápida',
            description: 'Llevamos nuestros productos hasta la puerta de tu casa o negocio con rapidez.',
            iconColor: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
        },
        {
            icon: 'mdi:home-heart',
            title: 'Servicio a Domicilio',
            description: 'Desde el mantenimiento de rutina hasta reparaciones complejas, lo manejamos todo.',
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    return (
        <section ref={featuresRef} className="py-12 md:py-16 lg:py-24 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 via-transparent to-blue-50/30 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        ¿Por qué elegirnos<span className="italic font-light">?</span>
                    </h2>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Desde el mantenimiento de rutina hasta las reparaciones importantes, te tenemos cubierto con un servicio confiable y amigable.
                    </p>
                </div>

                {/* Features Grid with Center Image */}
                <div className="relative">
                    {/* Desktop Layout: Grid with center image */}
                    <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Left Column */}
                        <div className="space-y-8">
                            {features.slice(0, 2).map((feature, index) => (
                                <div key={index} className="feature-item flex gap-4 items-start">
                                    <div className={`flex-shrink-0 w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                                        <Icon icon={feature.icon} className={feature.iconColor} width={24} height={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Center Image */}
                        <div className="center-image row-span-2 flex items-center justify-center">
                            <div className="relative w-full max-w-md aspect-square">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl blur-2xl"></div>
                                <img
                                    src="/LOGO AZUL MONITA COMPLETO.png"
                                    alt="Agua Purificada Blanquita"
                                    className="relative w-full h-full object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {features.slice(2, 4).map((feature, index) => (
                                <div key={index + 2} className="feature-item flex gap-4 items-start">
                                    <div className={`flex-shrink-0 w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                                        <Icon icon={feature.icon} className={feature.iconColor} width={24} height={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Layout: Stacked */}
                    <div className="md:hidden space-y-6">
                        {/* Center Image */}
                        <div className="center-image flex items-center justify-center mb-8">
                            <div className="relative w-64 h-64">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-2xl blur-2xl"></div>
                                <img
                                    src="/LOGO AZUL MONITA COMPLETO.png"
                                    alt="Agua Purificada Blanquita"
                                    className="relative w-full h-full object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* All Features */}
                        {features.map((feature, index) => (
                            <div key={index} className="feature-item flex gap-4 items-start">
                                <div className={`flex-shrink-0 w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                                    <Icon icon={feature.icon} className={feature.iconColor} width={24} height={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full hover:from-cyan-500 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Ver Productos
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
