import React from 'react';
import { Phone, Navigation, Clock } from 'lucide-react';

interface AguacentroLocation {
    name: string;
    address: string;
    phone: string;
}

interface LocationCardProps {
    location: AguacentroLocation;
    index: number;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
    return (
        <div className="group bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100 hover:border-cyan-200 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-cyan-50 rounded-bl-full -mr-12 sm:-mr-14 md:-mr-16 -mt-12 sm:-mt-14 md:-mt-16 transition-transform group-hover:scale-110"></div>

            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] sm:opacity-[0.04]">
                <img
                    src="/LOGO AGUA NUEVO 2.png"
                    alt=""
                    className="w-full max-w-[80%] sm:max-w-[70%] h-auto object-contain transform -rotate-12"
                />
            </div>

            <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 md:mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300 overflow-hidden p-1 sm:p-1.5">
                    <img 
                        src="/LOGO AGUA NUEVO 2.png" 
                        alt="Blanquita Logo" 
                        className="w-full h-full object-contain brightness-0 invert"
                    />
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-cyan-600 transition-colors">
                    {location.name}
                </h3>

                <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-5 md:mb-6 flex-grow">
                    <div className="flex items-start gap-2 sm:gap-3 text-gray-600">
                        <Navigation size={16} className="mt-0.5 sm:mt-1 text-cyan-500 flex-shrink-0" />
                        <p className="text-xs sm:text-sm leading-snug sm:leading-relaxed">{location.address}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                        <Phone size={16} className="text-cyan-500 flex-shrink-0" />
                        <a href={`tel:${location.phone.replace(/\D/g, '')}`} className="text-xs sm:text-sm font-medium hover:text-cyan-600 transition-colors">
                            {location.phone}
                        </a>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                        <Clock size={16} className="text-cyan-500 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">Lun - Sab: 8:00 AM - 8:00 PM</p>
                    </div>
                </div>

                <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-gray-50 hover:bg-cyan-50 text-gray-700 hover:text-cyan-700 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-bold transition-colors border border-gray-200 hover:border-cyan-200"
                >
                    Ver en Mapa
                </a>
            </div>
        </div>
    );
};

export default LocationCard;
