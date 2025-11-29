import React from 'react';
import AboutHero from '../components/about/AboutHero';
import HistoryTimeline from '../components/about/HistoryTimeline';
import MissionVisionValues from '../components/about/MissionVisionValues';
import FleetSlider from '../components/about/FleetSlider';
import PageTransition from '../components/PageTransition';
import PublicLayout from '../components/PublicLayout';
import SEO from '../components/SEO';

const AboutPage: React.FC = () => {
    return (
        <PublicLayout>
            <SEO
                title="Nuestra Historia"
                description="Conoce la historia de Agua Blanquita, más de 30 años llevando pureza y confianza a los hogares de Reynosa. Descubre nuestra misión, visión y valores."
                keywords="Agua Blanquita, historia, Reynosa, agua purificada, misión, visión, valores, flota, distribución"
                url="https://www.aguablanquita.com/about"
            />
            <PageTransition>
                <div className="min-h-screen bg-white">
                    <AboutHero />
                    <HistoryTimeline />
                    <MissionVisionValues />
                    <FleetSlider />
                </div>
            </PageTransition>
        </PublicLayout>
    );
};

export default AboutPage;
