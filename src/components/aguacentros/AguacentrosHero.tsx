import React from 'react';
import { COMPANY_INFO } from '../../data/mockData';
import headerBg from '../../assets/images/headers/delivery-texture.png';

const AguacentrosHero: React.FC = () => {
    return (
        <div className="relative bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 text-white overflow-hidden h-auto min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] py-12 sm:py-16 md:py-20 lg:py-24 flex items-center">
            <div className="absolute inset-0">
                <img
                    src={headerBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 sm:opacity-25 mix-blend-overlay"
                />
                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/95 via-blue-900/90 to-indigo-900/80"></div>

                {/* Watermark - Refined integration */}
                <div className="absolute -right-16 -bottom-16 sm:-right-24 sm:-bottom-24 md:-right-32 md:-bottom-32 w-64 h-64 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] opacity-[0.07] pointer-events-none mix-blend-screen">
                    <img src={COMPANY_INFO.logo} alt="" className="w-full h-full object-contain brightness-0 invert drop-shadow-2xl" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="max-w-4xl">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs sm:text-sm font-bold tracking-[0.2em] mb-4 sm:mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        SUCURSALES
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-[1.1] tracking-tight">
                        Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 filter drop-shadow-lg">Aguacentros</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300/90 max-w-2xl leading-relaxed font-light tracking-wide">
                        Encuentra tu punto de venta más cercano. <span className="text-white font-medium">Calidad, frescura y el mejor precio</span> siempre cerca de ti.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AguacentrosHero;
