import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { LOCATIONS } from '../data/mockData';
import { MapPin, Phone } from 'lucide-react';

const AguacentrosPage: React.FC = () => {
    return (
        <PublicLayout>
            <div className="bg-cyan-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Aguacentros</h1>
                    <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                        Calidad y precio cerca de ti. Encuentra tu sucursal más cercana.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {LOCATIONS.map((location, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 mb-4">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{location.name}</h3>
                            <p className="text-gray-600 mb-4 text-sm min-h-[40px]">{location.address}</p>
                            <div className="flex items-center gap-2 text-cyan-600 font-medium">
                                <Phone size={16} />
                                <a href={`tel:${location.phone.replace(/\D/g, '')}`} className="hover:underline">
                                    {location.phone}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
};

export default AguacentrosPage;
