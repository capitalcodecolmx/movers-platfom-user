import React from 'react';
import PublicLayout from '../components/PublicLayout';
import AguacentrosHero from '../components/aguacentros/AguacentrosHero';
import LocationsGrid from '../components/aguacentros/LocationsGrid';

const AguacentrosPage: React.FC = () => {
    return (
        <PublicLayout>
            <AguacentrosHero />
            <LocationsGrid />
        </PublicLayout>
    );
};

export default AguacentrosPage;
