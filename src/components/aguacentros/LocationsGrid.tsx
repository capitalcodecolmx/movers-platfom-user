import React from 'react';
import { LOCATIONS } from '../../data/mockData';
import LocationCard from './LocationCard';

const LocationsGrid: React.FC = () => {
    return (
        <div className="bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {LOCATIONS.map((location, index) => (
                        <LocationCard key={index} location={location} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationsGrid;
