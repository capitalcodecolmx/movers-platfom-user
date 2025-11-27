import React from 'react';
import Navbar from './Navbar';
import PageTransition from './PageTransition';
import { COMPANY_INFO, NAVIGATION } from '../data/mockData';
import { Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white pt-12 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Brand Info */}
                        <div>
                            <img className="h-10 w-auto mb-4 brightness-0 invert" src={COMPANY_INFO.logo} alt={COMPANY_INFO.name} />
                            <p className="text-gray-400 mb-4">
                                Comprometidos con la pureza y calidad para tu salud.
                            </p>
                            <div className="flex space-x-4">
                                <a href={COMPANY_INFO.social.facebook} className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">Facebook</a>
                                <a href={COMPANY_INFO.social.instagram} className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">Instagram</a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Enlaces Rápidos</h3>
                            <ul className="space-y-2">
                                {NAVIGATION.map((item) => (
                                    <li key={item.name}>
                                        <Link to={item.href} className="text-gray-400 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-cyan-400">Contacto</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1"><Phone size={16} /></span>
                                    <span>{COMPANY_INFO.phone}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1"><Mail size={16} /></span>
                                    <span>{COMPANY_INFO.email}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1">📍</span>
                                    <span>{COMPANY_INFO.address}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
