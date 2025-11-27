import React, { useState } from 'react';
import NavbarTop from './NavbarTop';
import NavbarMain from './NavbarMain';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleMenuClose = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50">
            {/* Top Bar - Contact Info */}
            <NavbarTop />

            {/* Main Navigation Bar */}
            <NavbarMain onMenuToggle={handleMenuToggle} />

            {/* Desktop Navigation Links */}
            <NavLinks />

            {/* Mobile Menu */}
            <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMenuClose} />
        </header>
    );
};

export default Navbar;
