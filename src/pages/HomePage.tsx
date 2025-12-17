import React from 'react';
import PublicLayout from '../components/PublicLayout';
import PremiumHeroSection from '../components/premium-hero/PremiumHeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import CTASection from '../components/sections/CTASection';

const HomePage: React.FC = () => {
    return (
        <PublicLayout>
            <PremiumHeroSection />
            <FeaturesSection />
            <FeaturedProducts />
            <CTASection />
        </PublicLayout>
    );
};

export default HomePage;
