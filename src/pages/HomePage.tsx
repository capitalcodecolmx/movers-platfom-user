import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PublicLayout from '../components/PublicLayout';
import ProductCard from '../components/ProductCard';
import PromotionsSlider from '../components/PromotionsSlider';
import { PRODUCTS } from '../data/mockData';
import { ArrowRight, Droplets, ShieldCheck, Truck } from 'lucide-react';
import headerBg from '../assets/images/headers/water-texture.png';

const HomePage: React.FC = () => {
    const featuredProducts = PRODUCTS.slice(0, 3);
    const heroRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);

    // Hero animation
    useGSAP(() => {
        if (!heroRef.current) return;

        const tl = gsap.timeline();
        const h1 = heroRef.current.querySelector('h1');
        const p = heroRef.current.querySelector('p');
        const links = heroRef.current.querySelectorAll('a');

        if (h1) {
            tl.fromTo(
                h1,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }

        if (p) {
            tl.fromTo(
                p,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                '-=0.4'
            );
        }

        if (links.length > 0) {
            tl.fromTo(
                links,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, stagger: 0.2, ease: 'back.out(1.7)' },
                '-=0.3'
            );
        }
    }, { scope: heroRef });

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
        <PublicLayout>
            {/* Hero Section - Full Width */}
            <section ref={heroRef} className="relative bg-gray-900 text-white overflow-hidden">
                {/* Background Texture */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

                {/* Promotions Slider - Full Width Container */}
                <div className="w-full relative z-10">
                    <PromotionsSlider autoSlideInterval={5000} />
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            ¿Por qué elegirnos?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                            Nos comprometemos a entregar el agua más pura y saludable directamente a tu hogar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="feature-card group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Droplets size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Máxima Pureza</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Proceso de purificación avanzado libre de cloro y metales pesados para tu tranquilidad.
                            </p>
                        </div>

                        <div className="feature-card group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Calidad Garantizada</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Filtración de múltiples pasos y controles rigurosos para asegurar la mejor calidad.
                            </p>
                        </div>

                        <div className="feature-card group bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Servicio a Domicilio</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Llevamos nuestros productos hasta la puerta de tu casa o negocio con rapidez.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                Nuestros Productos
                            </h2>
                            <p className="text-xl text-gray-600 font-light">Las presentaciones favoritas de nuestros clientes.</p>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-700 transition-all hover:gap-3 px-6 py-3 bg-cyan-50 rounded-full hover:bg-cyan-100">
                            Ver todos <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>

                    <div className="mt-16 text-center md:hidden">
                        <Link to="/products" className="inline-flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-700 transition-colors px-6 py-3 bg-cyan-50 rounded-full">
                            Ver todos los productos <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={headerBg}
                        alt="Background"
                        className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-blue-900/80 to-black/90"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                        ¿Listo para hacer tu pedido?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Visita nuestros Aguacentros o haz tu pedido en línea hoy mismo.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-gray-900 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/50"
                    >
                        Comprar Ahora <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl"></div>
            </section>
        </PublicLayout>
    );
};

export default HomePage;
