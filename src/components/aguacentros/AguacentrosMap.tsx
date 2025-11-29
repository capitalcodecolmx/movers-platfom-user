import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LOCATIONS } from '../../data/mockData';
import { COMPANY_INFO } from '../../data/mockData';

// Fix for default Leaflet icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Marker Component
const createCustomIcon = (colorClass: string) => {
    // Extract colors from Tailwind class (simplified for this example)
    // In a real app, we might map classes to hex codes or use a more robust method
    // For now, we'll use a generic color based on the class name or default to blue
    let color = '#06b6d4'; // cyan-500
    if (colorClass.includes('purple')) color = '#8b5cf6';
    if (colorClass.includes('orange')) color = '#f97316';
    if (colorClass.includes('green')) color = '#22c55e';
    if (colorClass.includes('red')) color = '#ef4444';
    if (colorClass.includes('pink')) color = '#ec4899';
    if (colorClass.includes('yellow')) color = '#eab308';

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                background-color: white;
                border: 3px solid ${color};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                position: relative;
            ">
                <div style="
                    transform: rotate(45deg);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <img src="/LOGO AGUA NUEVO 2.png" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40], // Tip of the pin
        popupAnchor: [0, -40]
    });
};

const MapController = () => {
    const map = useMap();

    useEffect(() => {
        if (LOCATIONS.length > 0) {
            const bounds = L.latLngBounds(LOCATIONS.map(loc => [loc.lat, loc.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map]);

    return null;
};

const AguacentrosMap: React.FC = () => {
    // Center on Reynosa by default
    const center = [26.08, -98.28] as [number, number];

    return (
        <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl border border-gray-200 z-0 relative bg-gray-100">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapController />
                {LOCATIONS.map((location, index) => (
                    <Marker
                        key={index}
                        position={[location.lat, location.lng]}
                        icon={createCustomIcon(location.color)}
                    >
                        <Popup className="custom-popup">
                            <div className="p-3 sm:p-4 min-w-[200px] sm:min-w-[250px]">
                                <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{location.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">{location.address}</p>
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs sm:text-sm text-cyan-600 font-semibold hover:text-cyan-700 hover:underline transition-colors"
                                >
                                    Ver en Google Maps
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default AguacentrosMap;
