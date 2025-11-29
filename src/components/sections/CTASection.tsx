import React from 'react';
import { Link } from 'react-router-dom';
import bottleWater from '../../assets/images/products/botella-5l.png';

const CTASection: React.FC = () => {
    return (
        <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900">
            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px 200px'
                }}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-center">
                    {/* Left Column - Typography */}
                    <div className="lg:col-span-3 space-y-4 md:space-y-5 relative text-center lg:text-left">
                        {/* Top Label */}
                        <div className="inline-block">
                            <span className="text-[10px] md:text-xs tracking-[0.25em] text-cyan-200 font-semibold uppercase">
                                AGUACENTROS
                            </span>
                            <div className="h-px bg-cyan-300 mt-1.5"></div>
                        </div>

                        {/* Main Headline - More compact sizing */}
                        <h2 className="relative">
                            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[0.9] mb-1">
                                El Gran
                            </span>
                            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[0.9] italic font-serif">
                                Cambio
                            </span>
                        </h2>

                        {/* Subtitle Box - Simplified */}
                        <div className="inline-block border border-white/80 px-4 py-2.5 max-w-md">
                            <p className="text-xs md:text-sm text-white/95 font-light leading-relaxed">
                                Calidad y servicio excepcional para tu hogar y negocio
                            </p>
                        </div>

                        {/* CTA Button - Centered */}
                        <div className="pt-4">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center px-10 py-4 text-base md:text-lg font-semibold text-cyan-900 bg-white rounded-full hover:bg-cyan-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-white/20"
                            >
                                Descubre Más
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Bottle Water Image */}
                    <div className="lg:col-span-2 hidden lg:flex items-center justify-center">
                        <img 
                            src={bottleWater} 
                            alt="Botella de agua" 
                            className="w-64 h-auto max-h-96 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
