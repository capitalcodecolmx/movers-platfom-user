import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PublicLayout from '../components/PublicLayout';
import ProductCard from '../components/ProductCard';
import PromotionsSlider from '../components/PromotionsSlider';
import { PRODUCTS } from '../data/mockData';
import { ArrowRight, Droplets, ShieldCheck, Truck } from 'lucide-react';

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
            {/* Hero Section */}
            <section ref={heroRef} className="relative bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative z-10">
                    {/* Promotions Slider - Full Width */}
                    <div className="w-full">
                        <PromotionsSlider autoSlideInterval={5000} />
                    </div>
                </div>

                {/* Abstract Shapes with Animation */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-300 opacity-20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                            ¿Por qué elegirnos?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Nos comprometemos a entregar el agua más pura y saludable directamente a tu hogar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="feature-card text-center p-8 rounded-3xl bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl">
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Droplets size={36} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Máxima Pureza</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Proceso de purificación avanzado libre de cloro y metales pesados.
                            </p>
                        </div>

                        <div className="feature-card text-center p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <ShieldCheck size={36} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Calidad Garantizada</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Filtración de múltiples pasos para asegurar la mejor calidad de agua.
                            </p>
                        </div>

                        <div className="feature-card text-center p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Truck size={36} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Servicio a Domicilio</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Llevamos nuestros productos hasta la puerta de tu casa o negocio.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                                Nuestros Productos
                            </h2>
                            <p className="text-xl text-gray-600">Las presentaciones favoritas de nuestros clientes.</p>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-700 transition-all hover:gap-3">
                            Ver todos <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/products" className="inline-flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-700 transition-colors">
                            Ver todos los productos <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
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
