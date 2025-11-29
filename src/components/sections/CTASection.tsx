import React from 'react';
import { Link } from 'react-router-dom';

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

                    {/* Right Column - Removed Photo Element for Minimal Look */}
                    <div className="lg:col-span-2 hidden lg:flex items-center justify-center opacity-40 mix-blend-overlay">
                        {/* Optional: Abstract geometric shape or pattern could go here if needed, 
                             but keeping it empty for now to match the minimal request */}
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-64 h-64 text-white fill-current animate-pulse-slow">
                            <path d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.3,-41.2C83.5,-26.8,87.7,-11.7,85.8,2.8C83.9,17.3,75.9,31.2,66.3,43.3C56.7,55.4,45.5,65.7,32.6,72.3C19.7,78.9,5.1,81.8,-8.7,79.8C-22.5,77.8,-35.5,70.9,-47.3,62.1C-59.1,53.3,-69.7,42.6,-76.5,29.8C-83.3,17,-86.3,2.1,-83.4,-11.3C-80.5,-24.7,-71.7,-36.6,-60.8,-45.5C-49.9,-54.4,-36.9,-60.3,-24.2,-67.6C-11.5,-74.9,-1.9,-83.6,10.6,-81.8C23.1,-80,32.5,-67.7,45.7,-76.3Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden md:block absolute top-6 right-6 text-white/20 text-xs tracking-wider font-mono">
                EST. 2024
            </div>
        </section>
    );
};

export default CTASection;
