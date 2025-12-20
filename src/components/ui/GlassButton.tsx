import React from 'react';
import { Link } from 'react-router-dom';

interface GlassButtonProps {
    to: string;
    label: string;
    className?: string;
    variant?: 'primary' | 'secondary';
}

const GlassButton: React.FC<GlassButtonProps> = ({
    to,
    label,
    className = "",
    variant = 'primary'
}) => {
    return (
        <Link
            to={to}
            className={`relative group inline-flex items-center justify-center px-10 py-5 rounded-full bg-[#050b18] border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_-5px_rgba(14,165,233,0.5)] active:scale-95 ${className}`}
        >
            {/* Internal Liquid Glow */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 bg-brand-cyan/40 blur-[40px] rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-20 h-10 bg-brand-blue/30 blur-[30px] rounded-full"></div>
            </div>

            {/* Refractive Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>

            {/* Glass Edge Shine */}
            <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

            {/* Button Text */}
            <span className="relative z-10 text-white font-bold uppercase tracking-[0.2em] text-[10px] drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {label}
            </span>
        </Link>
    );
};

export default GlassButton;
