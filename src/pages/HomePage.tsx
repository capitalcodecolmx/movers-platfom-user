import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';
import { ArrowRight, Droplets, ShieldCheck, Truck } from 'lucide-react';

const HomePage: React.FC = () => {
    const featuredProducts = PRODUCTS.slice(0, 3);

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Pureza y Calidad <br />
                            <span className="text-cyan-200">Para Tu Familia</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-cyan-50">
                            Agua Purificada Blanquita ofrece la mejor hidratación con los más altos estándares de calidad.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-cyan-700 bg-white rounded-full hover:bg-cyan-50 transition-all transform hover:scale-105 shadow-lg"
                            >
                                Ver Productos
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white border-2 border-white rounded-full hover:bg-white/10 transition-all"
                            >
                                Contáctanos
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-300 opacity-20 rounded-full blur-3xl"></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Nos comprometemos a entregar el agua más pura y saludable directamente a tu hogar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center p-6 rounded-2xl bg-cyan-50 hover:bg-cyan-100 transition-colors">
                            <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Droplets size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Máxima Pureza</h3>
                            <p className="text-gray-600">
                                Proceso de purificación avanzado libre de cloro y metales pesados.
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Calidad Garantizada</h3>
                            <p className="text-gray-600">
                                Filtración de múltiples pasos para asegurar la mejor calidad de agua.
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition-colors">
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Servicio a Domicilio</h3>
                            <p className="text-gray-600">
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
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestros Productos</h2>
                            <p className="text-xl text-gray-600">Las presentaciones favoritas de nuestros clientes.</p>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center gap-2 text-cyan-600 font-bold hover:text-cyan-700 transition-colors">
                            Ver todos <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
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
            <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para hacer tu pedido?</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Visita nuestros Aguacentros o haz tu pedido en línea hoy mismo.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-gray-900 bg-cyan-400 rounded-full hover:bg-cyan-300 transition-all transform hover:scale-105 shadow-lg"
                    >
                        Comprar Ahora
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
};

export default HomePage;
