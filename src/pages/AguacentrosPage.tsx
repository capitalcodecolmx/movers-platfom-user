import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { LOCATIONS, COMPANY_INFO } from '../data/mockData';
import { MapPin, Phone, Navigation, Clock } from 'lucide-react';
import headerBg from '../assets/images/headers/delivery-texture.png';

const AguacentrosPage: React.FC = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
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

            {/* Locations Grid */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {LOCATIONS.map((location, index) => (
                            <div key={index} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-cyan-200 flex flex-col h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <MapPin size={28} />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                                        {location.name}
                                    </h3>

                                    <div className="space-y-4 mb-6 flex-grow">
                                        <div className="flex items-start gap-3 text-gray-600">
                                            <Navigation size={18} className="mt-1 text-cyan-500 flex-shrink-0" />
                                            <p className="text-sm leading-relaxed">{location.address}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Phone size={18} className="text-cyan-500 flex-shrink-0" />
                                            <a href={`tel:${location.phone.replace(/\D/g, '')}`} className="text-sm font-medium hover:text-cyan-600 transition-colors">
                                                {location.phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Clock size={18} className="text-cyan-500 flex-shrink-0" />
                                            <p className="text-sm">Lun - Sab: 8:00 AM - 8:00 PM</p>
                                        </div>
                                    </div>

                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-cyan-50 text-gray-700 hover:text-cyan-700 rounded-xl font-bold transition-colors border border-gray-200 hover:border-cyan-200"
                                    >
                                        Ver en Mapa
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default AguacentrosPage;
