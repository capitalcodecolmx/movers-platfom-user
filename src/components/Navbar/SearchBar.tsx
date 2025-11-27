import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface SearchBarProps {
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    return (
        <form
            onSubmit={handleSearch}
            className={`flex items-center bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
        >
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            />
            <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 transition-all duration-200 flex items-center gap-2"
                aria-label="Buscar"
            >
                <Icon icon="ph:magnifying-glass-bold" width="18" height="18" />
            </button>
        </form>
    );
};

export default SearchBar;
