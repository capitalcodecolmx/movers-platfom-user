import React from 'react';
import PublicLayout from '../components/PublicLayout';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import CTASection from '../components/sections/CTASection';

const HomePage: React.FC = () => {
    return (
        <PublicLayout>
            <HeroSection />
            <FeaturesSection />
            <FeaturedProducts />
            <CTASection />
        </PublicLayout>
    );
};

export default HomePage;
