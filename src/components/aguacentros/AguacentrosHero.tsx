import React from 'react';
import { COMPANY_INFO } from '../../data/mockData';
import headerBg from '../../assets/images/headers/delivery-texture.png';

const AguacentrosHero: React.FC = () => {
    return (
        <div className="relative bg-cyan-900 text-white overflow-hidden h-[40vh] min-h-[300px] flex items-center">
            <div className="absolute inset-0">
                <img
                    src={headerBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/90 to-blue-900/80"></div>

                {/* Watermark */}
                <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10">
                    <img src={COMPANY_INFO.logo} alt="" className="w-full h-full object-contain brightness-0 invert" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="max-w-3xl">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-sm font-bold tracking-wider mb-4 backdrop-blur-sm">
                        SUCURSALES
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Aguacentros</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                        Encuentra tu punto de venta más cercano. Calidad, frescura y el mejor precio siempre cerca de ti.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AguacentrosHero;
