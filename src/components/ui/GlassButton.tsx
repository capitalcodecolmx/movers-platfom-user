import React from 'react';
import { Link } from 'react-router-dom';

interface GlassButtonProps {
    to?: string;
    onClick?: () => void;
    label: React.ReactNode;
    className?: string;
    variant?: 'dark-blue' | 'white' | 'blue' | 'green';
    size?: 'sm' | 'md' | 'lg';
    isSquare?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit';
}

const GlassButton: React.FC<GlassButtonProps> = ({
    to,
    onClick,
    label,
    className = "",
    variant = 'dark-blue',
    size = 'lg',
    isSquare = false,
    disabled = false,
    type = 'button'
}) => {
    const variants = {
        'dark-blue': {
            container: 'bg-[#050b18] border-white/20 shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)]',
            glow1: 'bg-brand-cyan/40',
            glow2: 'bg-brand-blue/30',
            text: 'text-white',
            shadow: 'hover:shadow-[0_0_40px_-5px_rgba(14,165,233,0.5)]',
            highlight: 'via-white/20'
        },
        'white': {
            container: 'bg-white/95 backdrop-blur-sm border-white shadow-[0_8px_20px_-5px_rgba(0,0,0,0.08)]',
            glow1: 'bg-cyan-400/25',
            glow2: 'bg-blue-400/15',
            text: 'text-slate-900',
            shadow: 'hover:shadow-[0_15px_35px_-10px_rgba(14,165,233,0.2)]',
            highlight: 'via-white'
        },
        'blue': {
            container: 'bg-brand-blue border-white/20 shadow-[0_5px_15px_-5px_rgba(0,56,179,0.3)]',
            glow1: 'bg-white/20',
            glow2: 'bg-brand-cyan/20',
            text: 'text-white',
            shadow: 'hover:shadow-[0_10px_30px_-5px_rgba(0,56,179,0.5)]',
            highlight: 'via-white/30'
        },
        'green': {
            container: 'bg-green-600 border-white/20 shadow-[0_5px_15px_-5px_rgba(22,163,74,0.3)]',
            glow1: 'bg-green-400/40',
            glow2: 'bg-emerald-300/30',
            text: 'text-white',
            shadow: 'hover:shadow-[0_10px_30px_-5px_rgba(22,163,74,0.5)]',
            highlight: 'via-white/30'
        }
    };

    const sizes = {
        sm: isSquare ? 'p-2' : 'px-4 py-2 text-[8px] tracking-[0.1em]',
        md: isSquare ? 'p-3' : 'px-6 py-3 text-[9px] tracking-[0.15em]',
        lg: isSquare ? 'p-4' : 'px-10 py-5 text-[10px] tracking-[0.2em]'
    };

    const styles = variants[variant];
    const sizeStyles = sizes[size];
    const baseClass = `relative group inline-flex items-center justify-center rounded-full border overflow-hidden transition-all duration-500 active:scale-95 ${styles.container} ${!disabled ? styles.shadow : 'opacity-60 cursor-not-allowed'} ${sizeStyles} ${isSquare ? 'aspect-square' : ''} ${className}`;

    const content = (
        <>
            {/* Internal Animated Liquid Core */}
            <div className={`absolute inset-0 opacity-40 ${!disabled ? 'group-hover:opacity-75' : ''} transition-opacity duration-1000 overflow-hidden`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-24 h-12' : 'w-40 h-24'} ${styles.glow1} blur-[25px] rounded-full animate-liquid-flow`}></div>
                <div className={`absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-16 h-8' : 'w-28 h-14'} ${styles.glow2} blur-[20px] rounded-full animate-liquid-flow-reverse`}></div>
            </div>

            {/* Refractive Highlight */}
            <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${styles.highlight} to-transparent`}></div>
            <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"></div>

            {/* Glass Edge Shine */}
            <div className={`absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent translate-x-[-100%] ${!disabled ? 'group-hover:translate-x-[100%]' : ''} transition-transform duration-1000 ease-in-out pointer-events-none`}></div>

            {/* Button Text */}
            <span className={`relative z-10 font-bold uppercase ${styles.text} ${variant !== 'white' ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}`}>
                {label}
            </span>
        </>
    );

    if (to && !disabled) {
        return (
            <Link to={to} className={baseClass}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={baseClass}
        >
            {content}
        </button>
    );
};

export default GlassButton;
