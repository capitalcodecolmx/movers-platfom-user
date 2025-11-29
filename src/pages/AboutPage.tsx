import React from 'react';
import AboutHero from '../components/about/AboutHero';
import HistoryTimeline from '../components/about/HistoryTimeline';
import MissionVisionValues from '../components/about/MissionVisionValues';
import FleetSlider from '../components/about/FleetSlider';
import PageTransition from '../components/PageTransition';
import PublicLayout from '../components/PublicLayout';

const AboutPage: React.FC = () => {
    return (
        <PublicLayout>
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
