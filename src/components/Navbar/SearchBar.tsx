import React, { useEffect, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useSearchStore } from '../../store/useSearchStore';
import { debounce } from '../../utils/searchUtils';
import SearchResults from './SearchResults';

interface SearchBarProps {
    className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        query,
        results,
        isOpen,
        isLoading,
        setQuery,
        performSearch,
        clearSearch,
        setIsOpen,
        addToRecentSearches,
    } = useSearchStore();

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((searchQuery: string) => {
            performSearch(searchQuery);
        }, 300),
        [performSearch]
    );

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim()) {
            debouncedSearch(value);
        } else {
            clearSearch();
        }
    };

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            addToRecentSearches(query);
            performSearch(query);
        }
    };

    // Handle clear button
    const handleClear = () => {
        clearSearch();
        inputRef.current?.focus();
    };

    // Handle click outside to close results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <form
                onSubmit={handleSubmit}
                className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-cyan-500 transition-all duration-200"
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    placeholder="Buscar productos..."
                    className="flex-1 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                    aria-label="Buscar productos"
                />

                {/* Clear button */}
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Limpiar búsqueda"
                    >
                        <Icon icon="ph:x-circle-fill" width="18" height="18" />
                    </button>
                )}

                {/* Search button */}
                <button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-2.5 transition-all duration-200 flex items-center gap-2"
                    aria-label="Buscar"
                >
                    {isLoading ? (
                        <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Icon icon="ph:magnifying-glass-bold" width="18" height="18" />
                    )}
                </button>
            </form>

            {/* Search Results Dropdown */}
            {isOpen && (
                <SearchResults
                    results={results}
                    query={query}
                    isLoading={isLoading}
                    onClose={() => setIsOpen(false)}
                    onSelectResult={(product) => {
                        addToRecentSearches(query);
                        console.log('Selected product:', product);
                    }}
                />
            )}
        </div>
    );
};

export default SearchBar;
