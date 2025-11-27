import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { COMPANY_INFO } from '../../data/mockData';
import SearchBar from './SearchBar';
import ActionButtons from './ActionButtons';

interface NavbarMainProps {
    onMenuToggle: () => void;
}

const NavbarMain: React.FC<NavbarMainProps> = ({ onMenuToggle }) => {
    return (
        <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex-shrink-0 flex items-center group"
                    >
                        <img
                            className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                            src={COMPANY_INFO.logo}
                            alt={COMPANY_INFO.name}
                        />
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:block flex-1 max-w-xl mx-8">
                        <SearchBar />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <ActionButtons />

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={onMenuToggle}
                            className="md:hidden p-2.5 text-gray-700 hover:text-cyan-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                            aria-label="Abrir menú"
                        >
                            <Icon icon="ph:list-bold" width="24" height="24" />
                        </button>
                    </div>
                </div>

                {/* Search Bar - Mobile (below main bar) */}
                <div className="md:hidden pb-4">
                    <SearchBar />
                </div>
            </div>
        </div>
    );
};

export default NavbarMain;
