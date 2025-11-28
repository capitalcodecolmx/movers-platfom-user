import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import headerBg from '../../assets/images/headers/water-texture.png';

const CTASection: React.FC = () => {
    return (
        <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src={headerBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-blue-900/80 to-black/90"></div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-5 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                    ¿Listo para hacer tu pedido?
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Visita nuestros Aguacentros o haz tu pedido en línea hoy mismo.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-900 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/50"
                >
                    Comprar Ahora <ArrowRight className="ml-2" size={18} />
                </Link>
            </div>

            {/* Decorative Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500 opacity-10 rounded-full blur-3xl"></div>
        </section>
    );
};

export default CTASection;
