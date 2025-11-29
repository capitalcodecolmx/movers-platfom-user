import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
    return (
        <section className="relative py-6 sm:py-8 md:py-10 lg:py-12 overflow-hidden bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <img
                    src="/LOGO AGUA NUEVO 2.png"
                    alt=""
                    className="w-[120%] max-w-none opacity-[0.03] transform -rotate-12 scale-150 blur-sm"
                />
            </div>

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '200px 200px'
                }}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-6 lg:gap-8 items-center">
                    {/* Left Column - Typography */}
                    <div className="md:col-span-1 lg:col-span-3 space-y-2 sm:space-y-3 md:space-y-3 relative text-center md:text-left">
                        {/* Top Label */}
                        <div className="inline-block mb-1 sm:mb-0">
                            <span className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] text-cyan-200 font-semibold uppercase">
                                AGUACENTROS
                            </span>
                            <div className="h-px bg-cyan-300 mt-0.5 sm:mt-1"></div>
                        </div>

                        {/* Main Headline - More compact sizing */}
                        <h2 className="relative mb-1 sm:mb-0">
                            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[0.95] mb-0.5">
                                El Gran
                            </span>
                            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[0.95] italic font-serif">
                                Cambio
                            </span>
                        </h2>

                        {/* Subtitle Box - Simplified */}
                        <div className="inline-block border border-white/80 px-2.5 sm:px-3 py-1 sm:py-1.5 max-w-full sm:max-w-md">
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-white/95 font-light leading-snug">
                                Calidad y servicio excepcional para tu hogar y negocio
                            </p>
                        </div>

                        {/* CTA Button - Centered */}
                        <div className="pt-1.5 sm:pt-2">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm md:text-base font-semibold text-cyan-900 bg-white rounded-full hover:bg-cyan-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-white/20"
                            >
                                Descubre Más
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Bottle Water Image */}
                    <div className="md:col-span-1 lg:col-span-2 flex items-center justify-center mt-4 md:mt-0">
                        <div className="relative">
                            <img
                                src="/BLANQUITA_WATER_STILL_5L.png"
                                alt="Botella de agua"
                                className="w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[240px] 2xl:max-w-[280px] h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300 filter brightness-110"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
