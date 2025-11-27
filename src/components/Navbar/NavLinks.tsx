import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION } from '../../data/mockData';

const NavLinks: React.FC = () => {
    const location = useLocation();

    return (
        <div className="hidden md:block bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-center space-x-8 h-12">
                    {NAVIGATION.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`relative text-sm font-medium transition-all duration-200 py-3 ${location.pathname === item.href
                                    ? 'text-cyan-600'
                                    : 'text-gray-700 hover:text-cyan-600'
                                }`}
                        >
                            {item.name}
                            {location.pathname === item.href && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-600 rounded-full"></span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default NavLinks;
