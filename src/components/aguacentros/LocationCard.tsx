import React from 'react';
import { MapPin, Phone, Navigation, Clock } from 'lucide-react';

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
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:border-cyan-200 flex flex-col h-full relative overflow-hidden">
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
    );
};

export default LocationCard;
