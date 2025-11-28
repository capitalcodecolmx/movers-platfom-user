import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* New Modular Navbar */}
            <Navbar />

            {/* Main Content with Page Transition */}
            <main className="flex-grow">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default PublicLayout;
