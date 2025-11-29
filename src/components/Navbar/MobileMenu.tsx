import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { NAVIGATION, COMPANY_INFO } from '../../data/mockData';
import { useCartStore } from '../../store/useCartStore';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre sus productos.');
        window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${message}`, '_blank');
        onClose();
    };

    const getIcon = (name: string) => {
        const icons: { [key: string]: string } = {
            'Inicio': 'ph:house-fill',
            'Productos': 'fa6-solid:bottle-water',
            'Aguacentros': 'ph:map-pin-fill',
            'Contacto': 'ph:envelope-fill',
            'Nuestra Empresa': 'ph:buildings-fill',
        };
        return icons[name] || 'ph:house-fill';
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <img
                        src={COMPANY_INFO.logo}
                        alt={COMPANY_INFO.name}
                        className="h-10 w-auto"
                    />
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                        aria-label="Cerrar menú"
                    >
                        <Icon icon="ph:x-bold" width="24" height="24" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="px-4 py-6 space-y-1">
                    {NAVIGATION.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${location.pathname === item.href
                                ? 'text-cyan-600 bg-cyan-50'
                                : 'text-gray-700 hover:text-cyan-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon icon={getIcon(item.name)} width="20" height="20" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Action Buttons */}
                <div className="px-4 py-4 space-y-3 border-t border-gray-200">
                    {/* WhatsApp Button */}
                    <button
                        onClick={handleWhatsAppClick}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all duration-200 shadow-md"
                    >
                        <Icon icon="ri:whatsapp-fill" width="18" height="18" />
                        <span>Contactar por WhatsApp</span>
                    </button>

                    {/* Login Button */}
                    <Link
                        to="/login"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
                    >
                        <Icon icon="ph:user-circle-fill" width="18" height="18" />
                        <span>Ingresar</span>
                    </Link>

                    {/* Cart Button */}
                    <Link
                        to="/cart"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-cyan-600 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-all duration-200 relative"
                    >
                        <Icon icon="ph:shopping-cart-fill" width="18" height="18" />
                        <span>Ver Carrito</span>
                        {cartCount > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full min-w-[24px]">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Contact Info */}
                <div className="px-4 py-4 mt-auto border-t border-gray-200 bg-gray-50">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Contacto
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                        <a
                            href={`tel:${COMPANY_INFO.phone}`}
                            className="flex items-center gap-2 hover:text-cyan-600 transition-colors"
                        >
                            <Icon icon="ph:phone-fill" width="16" height="16" className="text-cyan-600" />
                            {COMPANY_INFO.phone}
                        </a>
                        <a
                            href={`mailto:${COMPANY_INFO.email}`}
                            className="flex items-center gap-2 hover:text-cyan-600 transition-colors"
                        >
                            <Icon icon="ph:envelope-fill" width="16" height="16" className="text-cyan-600" />
                            {COMPANY_INFO.email}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
