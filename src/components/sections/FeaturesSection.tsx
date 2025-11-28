import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Droplets, ShieldCheck, Truck } from 'lucide-react';

const FeaturesSection: React.FC = () => {
    const featuresRef = useRef<HTMLDivElement>(null);

    // Features animation
    useGSAP(() => {
        if (!featuresRef.current) return;

        const featureCards = featuresRef.current.querySelectorAll('.feature-card');
        if (featureCards.length === 0) return;

        gsap.fromTo(
            featureCards,
            {
                opacity: 0,
                y: 60,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: 'top center+=100',
                    toggleActions: 'play none none none'
                }
            }
        );
    }, { scope: featuresRef });

    return (
        <section ref={featuresRef} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Compact */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        ¿Por qué elegirnos?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                        Nos comprometemos a entregar el agua más pura y saludable directamente a tu hogar.
                    </p>
                </div>

                {/* Feature Cards - Compact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    <div className="feature-card group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <Droplets size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Máxima Pureza</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Proceso de purificación avanzado libre de cloro y metales pesados para tu tranquilidad.
                        </p>
                    </div>

                    <div className="feature-card group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Calidad Garantizada</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Filtración de múltiples pasos y controles rigurosos para asegurar la mejor calidad.
                        </p>
                    </div>

                    <div className="feature-card group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                            <Truck size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Servicio a Domicilio</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Llevamos nuestros productos hasta la puerta de tu casa o negocio con rapidez.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
