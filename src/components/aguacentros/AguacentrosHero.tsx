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

                {/* Watermark - Centered */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] opacity-[0.07] pointer-events-none mix-blend-screen">
                    <img src={COMPANY_INFO.logo} alt="" className="w-full h-full object-contain brightness-0 invert drop-shadow-2xl" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight uppercase">
                        Aguacentros <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 filter drop-shadow-lg">Calidad y Precio</span> Cerca de Ti
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-200/90 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
                        Para que puedas tener siempre a mano y disfrutes junto a tu familia los beneficios de <span className="text-white font-medium">Agua Purificada Blanquita</span> a precios de fábrica, abrimos para ti nuestros Aguacentros.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AguacentrosHero;
