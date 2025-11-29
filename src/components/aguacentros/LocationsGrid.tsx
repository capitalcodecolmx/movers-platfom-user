import React from 'react';
import { LOCATIONS } from '../../data/mockData';
import LocationCard from './LocationCard';
import AguacentrosMap from './AguacentrosMap';

const LocationsGrid: React.FC = () => {
    return (
        <div className="bg-gray-50 py-8 sm:py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
                {/* Intro Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Para mayor comodidad encontrarás uno cerca de ti para que puedas adquirir todos los productos de la familia Blanquita; desde los tradicionales garrafones y botellas de Agua Purificada Blanquita en sus diferentes presentaciones y bolsas de Hielo Blanquita.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Tenemos sucursales en diversos puntos de la ciudad de Reynosa para que todas las promociones estén siempre al alcance de todos. Visita nuestras ubicaciones:
                        </p>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                        <img
                            src="/agua centro.avif"
                            alt="Aguacentro Blanquita"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 text-white font-bold text-xl">
                            Tu Aguacentro más cercano
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mb-12 sm:mb-16">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                            Ubicación de Sucursales
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                            Encuentra todas nuestras sucursales en el mapa interactivo
                        </p>
                    </div>
                    <div className="relative">
                        <AguacentrosMap />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                    {LOCATIONS.map((location, index) => (
                        <LocationCard key={index} location={location} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationsGrid;
