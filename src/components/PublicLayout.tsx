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
            <footer className="relative bg-gray-900 text-white pt-20 pb-10 overflow-hidden">
                {/* Watermark */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
                    <img
                        src={COMPANY_INFO.logo}
                        alt=""
                        className="w-full h-full object-contain object-right-top transform translate-x-1/4 -translate-y-1/4"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Brand Info */}
                        <div className="space-y-6">
                            <img className="h-12 w-auto brightness-0 invert opacity-90" src={COMPANY_INFO.logo} alt={COMPANY_INFO.name} />
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Comprometidos con la pureza y calidad para tu salud. Llevamos el agua más fresca directamente a tu hogar desde 1993.
                            </p>
                            <div className="flex space-x-4 pt-2">
                                <a
                                    href={COMPANY_INFO.social.facebook}
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-600 hover:text-white transition-all duration-300"
                                    aria-label="Facebook"
                                >
                                    <span className="iconify" data-icon="ri:facebook-fill" data-width="20"></span>
                                </a>
                                <a
                                    href={COMPANY_INFO.social.instagram}
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300"
                                    aria-label="Instagram"
                                >
                                    <span className="iconify" data-icon="ri:instagram-line" data-width="20"></span>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                                Enlaces Rápidos
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-cyan-500 rounded-full"></span>
                            </h3>
                            <ul className="space-y-4">
                                {NAVIGATION.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            to={item.href}
                                            className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                                Contacto
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-cyan-500 rounded-full"></span>
                            </h3>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors flex-shrink-0">
                                        <Phone size={16} />
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-medium text-white mb-1">Llámanos</p>
                                        <p>{COMPANY_INFO.phone}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors flex-shrink-0">
                                        <Mail size={16} />
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-medium text-white mb-1">Escríbenos</p>
                                        <p>{COMPANY_INFO.email}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors flex-shrink-0">
                                        <span className="text-lg">📍</span>
                                    </div>
                                    <div className="pt-1">
                                        <p className="font-medium text-white mb-1">Visítanos</p>
                                        <p>{COMPANY_INFO.address}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                                Boletín
                                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-cyan-500 rounded-full"></span>
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Suscríbete para recibir ofertas especiales y novedades.
                            </p>
                            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-900/20"
                                >
                                    Suscribirse
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                        <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-cyan-400 transition-colors">Privacidad</a>
                            <a href="#" className="hover:text-cyan-400 transition-colors">Términos</a>
                            <a href="#" className="hover:text-cyan-400 transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
