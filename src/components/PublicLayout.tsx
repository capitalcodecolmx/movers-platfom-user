import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COMPANY_INFO, NAVIGATION } from '../data/mockData';
import { ShoppingCart, Menu, X, Phone, Mail } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import PageTransition from './PageTransition';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Top Bar */}
            <div className="bg-primary-900 text-white py-2 px-4 text-sm hidden md:block">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex space-x-6">
                        <span className="flex items-center gap-2">
                            <Phone size={14} /> {COMPANY_INFO.phone}
                        </span>
                        <span className="flex items-center gap-2">
                            <Mail size={14} /> {COMPANY_INFO.email}
                        </span>
                    </div>
                    <div className="flex space-x-4">
                        <a href={COMPANY_INFO.social.facebook} className="hover:text-cyan-300 transition-colors">Facebook</a>
                        <a href={COMPANY_INFO.social.instagram} className="hover:text-cyan-300 transition-colors">Instagram</a>
                    </div>
                </div>
            </div>

            {/* Header with Glassmorphism */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isMenuOpen ? 'bg-white' : 'bg-white/90 backdrop-blur-lg'
                } shadow-sm border-b border-white/20`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <img
                                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                                src={COMPANY_INFO.logo}
                                alt={COMPANY_INFO.name}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {NAVIGATION.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`text-base font-medium transition-all duration-200 relative ${location.pathname === item.href
                                            ? 'text-cyan-600'
                                            : 'text-gray-700 hover:text-cyan-600'
                                        }`}
                                >
                                    {item.name}
                                    {location.pathname === item.href && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-600 rounded-full"></span>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Cart & Mobile Menu Button */}
                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-cyan-600 transition-all duration-200 hover:scale-110">
                                <ShoppingCart size={24} />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="text-gray-600 hover:text-cyan-600 focus:outline-none transition-transform duration-200 hover:scale-110"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {NAVIGATION.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${location.pathname === item.href
                                            ? 'text-cyan-600 bg-cyan-50'
                                            : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>

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
