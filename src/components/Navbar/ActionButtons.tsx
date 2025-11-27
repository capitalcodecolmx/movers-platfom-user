import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useCartStore } from '../../store/useCartStore';
import { COMPANY_INFO } from '../../data/mockData';

const ActionButtons: React.FC = () => {
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent('¡Hola! Me gustaría obtener más información sobre sus productos.');
        window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${message}`, '_blank');
    };

    return (
        <div className="flex items-center gap-3">
            {/* WhatsApp Button */}
            <button
                onClick={handleWhatsAppClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                aria-label="Contactar por WhatsApp"
            >
                <Icon icon="ri:whatsapp-fill" width="18" height="18" />
                <span className="hidden lg:inline">Ayuda</span>
            </button>

            {/* Login Button */}
            <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200"
                aria-label="Iniciar sesión"
            >
                <Icon icon="ph:user-circle-fill" width="18" height="18" />
                <span className="hidden lg:inline">Ingresar</span>
            </Link>

            {/* Cart Button */}
            <Link
                to="/cart"
                className="relative p-2.5 text-gray-700 hover:text-cyan-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                aria-label="Ver carrito"
            >
                <Icon icon="ph:shopping-cart-fill" width="24" height="24" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse min-w-[20px]">
                        {cartCount}
                    </span>
                )}
            </Link>
        </div>
    );
};

export default ActionButtons;
