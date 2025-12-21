import React, { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { COMPANY_INFO } from '../data/mockData';

// Realistic Water Caustics Canvas Effect
const WaterCaustics: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth * 0.5; // Lower res for performance
            canvas.height = canvas.offsetHeight * 0.5;
        };
        resize();
        window.addEventListener('resize', resize);

        const drawCaustics = () => {
            time += 0.008;
            const { width, height } = canvas;

            ctx.clearRect(0, 0, width, height);

            // Create caustic pattern
            const imageData = ctx.createImageData(width, height);
            const data = imageData.data;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = (y * width + x) * 4;

                    // Multiple overlapping sine waves for caustic effect
                    const scale = 0.02;
                    const wave1 = Math.sin(x * scale + time * 2) * Math.cos(y * scale * 0.8 + time * 1.5);
                    const wave2 = Math.sin((x + y) * scale * 0.7 + time * 1.2) * Math.cos((x - y) * scale * 0.5 + time);
                    const wave3 = Math.sin(x * scale * 1.3 - time) * Math.sin(y * scale * 1.1 + time * 0.8);

                    const combined = (wave1 + wave2 + wave3) / 3;
                    const brightness = Math.pow((combined + 1) / 2, 2) * 0.4;

                    // Cyan-blue color
                    data[i] = brightness * 80;      // R
                    data[i + 1] = brightness * 220; // G
                    data[i + 2] = brightness * 255; // B
                    data[i + 3] = brightness * 180; // A
                }
            }

            ctx.putImageData(imageData, 0, 0);
            animationId = requestAnimationFrame(drawCaustics);
        };

        drawCaustics();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
            style={{ imageRendering: 'auto', filter: 'blur(8px)' }}
        />
    );
};

// Realistic bubble with physics
const RealisticBubble: React.FC<{
    size: number;
    startX: number;
    delay: number;
    duration: number;
}> = ({ size, startX, delay, duration }) => {
    const wobbleAmount = size * 0.3;
    const uniqueId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

    return (
        <>
            <div
                className="absolute pointer-events-none"
                style={{
                    width: size,
                    height: size,
                    left: `${startX}%`,
                    bottom: '-30px',
                    animation: `rise-${uniqueId} ${duration}s ease-out ${delay}s infinite`,
                }}
            >
                {/* Bubble body */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: `
                            radial-gradient(ellipse 30% 30% at 30% 25%, rgba(255,255,255,0.8) 0%, transparent 50%),
                            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(34, 211, 238, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%),
                            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(34, 211, 238, 0.2) 60%, transparent 70%)
                        `,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: `
                            inset 0 -${size * 0.15}px ${size * 0.3}px rgba(34, 211, 238, 0.2),
                            0 0 ${size * 0.5}px rgba(34, 211, 238, 0.3),
                            0 0 ${size}px rgba(34, 211, 238, 0.1)
                        `,
                        animation: `wobble-${uniqueId} ${duration * 0.15}s ease-in-out ${delay}s infinite`,
                    }}
                >
                    {/* Highlight reflection */}
                    <div
                        className="absolute rounded-full bg-white/60"
                        style={{
                            width: size * 0.25,
                            height: size * 0.15,
                            top: size * 0.15,
                            left: size * 0.2,
                            filter: 'blur(1px)',
                            transform: 'rotate(-30deg)',
                        }}
                    />
                </div>
            </div>
            <style>{`
                @keyframes rise-${uniqueId} {
                    0% {
                        transform: translateY(0) translateX(0) scale(0.3);
                        opacity: 0;
                    }
                    5% {
                        opacity: 1;
                        transform: translateY(-5vh) translateX(${wobbleAmount}px) scale(1);
                    }
                    25% {
                        transform: translateY(-25vh) translateX(-${wobbleAmount}px) scale(1.05);
                    }
                    50% {
                        transform: translateY(-50vh) translateX(${wobbleAmount * 0.8}px) scale(1);
                    }
                    75% {
                        transform: translateY(-75vh) translateX(-${wobbleAmount * 0.5}px) scale(0.95);
                    }
                    95% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(${wobbleAmount * 0.3}px) scale(0.9);
                        opacity: 0;
                    }
                }
                @keyframes wobble-${uniqueId} {
                    0%, 100% { transform: scaleX(1) scaleY(1); }
                    25% { transform: scaleX(1.03) scaleY(0.97); }
                    75% { transform: scaleX(0.97) scaleY(1.03); }
                }
            `}</style>
        </>
    );
};

// Container for all bubbles
const RealisticBubbles: React.FC = () => {
    const bubbles = useMemo(() =>
        Array.from({ length: 15 }, (_, i) => ({
            id: i,
            size: Math.random() * 12 + 8,
            startX: Math.random() * 100,
            delay: Math.random() * 12,
            duration: Math.random() * 8 + 12,
        })),
        []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {bubbles.map((bubble) => (
                <RealisticBubble
                    key={bubble.id}
                    size={bubble.size}
                    startX={bubble.startX}
                    delay={bubble.delay}
                    duration={bubble.duration}
                />
            ))}
        </div>
    );
};

// Realistic multi-layered water waves
const RealisticWaterWaves: React.FC = () => (
    <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
        {/* Deep water layer */}
        <svg
            className="absolute w-[300%] h-full -left-[50%]"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            style={{ animation: 'deepWave 25s linear infinite' }}
        >
            <defs>
                <linearGradient id="deepWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(6, 78, 112, 0.6)" />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            </defs>
            <path
                fill="url(#deepWaveGrad)"
                d="M0,80 Q180,40 360,80 T720,80 T1080,80 T1440,80 L1440,0 L0,0 Z"
            />
        </svg>

        {/* Mid water layer with more detail */}
        <svg
            className="absolute w-[250%] h-full -left-[25%]"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            style={{ animation: 'midWave 18s linear infinite', opacity: 0.7 }}
        >
            <defs>
                <linearGradient id="midWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(14, 116, 144, 0.5)" />
                    <stop offset="60%" stopColor="rgba(34, 211, 238, 0.1)" />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            </defs>
            <path
                fill="url(#midWaveGrad)"
                d="M0,60 C120,100 240,20 360,60 S600,100 720,60 S960,20 1080,60 S1320,100 1440,60 L1440,0 L0,0 Z"
            />
        </svg>

        {/* Surface wave layer - most visible */}
        <svg
            className="absolute w-[200%] h-full"
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            style={{ animation: 'surfaceWave 12s ease-in-out infinite' }}
        >
            <defs>
                <linearGradient id="surfaceWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(34, 211, 238, 0.4)" />
                    <stop offset="30%" stopColor="rgba(59, 130, 246, 0.2)" />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <filter id="waveTurbulence">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </defs>
            <path
                fill="url(#surfaceWaveGrad)"
                d="M0,50 C90,80 180,20 270,50 S450,80 540,50 S720,20 810,50 S990,80 1080,50 S1260,20 1350,50 S1440,50 1440,50 L1440,0 L0,0 Z"
                style={{ filter: 'url(#waveTurbulence)' }}
            />
        </svg>

        {/* Foam/highlight layer */}
        <svg
            className="absolute w-[200%] h-24"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{ animation: 'foamWave 8s ease-in-out infinite', opacity: 0.5 }}
        >
            <defs>
                <linearGradient id="foamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
                    <stop offset="50%" stopColor="rgba(224, 242, 254, 0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            </defs>
            <path
                fill="url(#foamGrad)"
                d="M0,40 Q60,20 120,40 T240,40 T360,40 T480,40 T600,40 T720,40 T840,40 T960,40 T1080,40 T1200,40 T1320,40 T1440,40 L1440,0 L0,0 Z"
            />
        </svg>

        {/* Water surface reflection line */}
        <div
            className="absolute top-[35%] left-0 right-0 h-[2px] pointer-events-none"
            style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)',
                filter: 'blur(1px)',
                animation: 'shimmerLine 4s ease-in-out infinite',
            }}
        />

        <style>{`
            @keyframes deepWave {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.33%); }
            }
            @keyframes midWave {
                0% { transform: translateX(0); }
                100% { transform: translateX(-40%); }
            }
            @keyframes surfaceWave {
                0%, 100% { transform: translateX(0) translateY(0); }
                25% { transform: translateX(-10%) translateY(2px); }
                50% { transform: translateX(-25%) translateY(0); }
                75% { transform: translateX(-15%) translateY(-2px); }
            }
            @keyframes foamWave {
                0%, 100% { transform: translateX(0) scaleY(1); }
                50% { transform: translateX(-25%) scaleY(1.1); }
            }
            @keyframes shimmerLine {
                0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
                50% { opacity: 0.7; transform: scaleX(1); }
            }
        `}</style>
    </div>
);

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Add subtle parallax effect on mouse move
        const handleMouseMove = (e: MouseEvent) => {
            if (!footerRef.current) return;
            const rect = footerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            footerRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
            footerRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
        };

        const footer = footerRef.current;
        footer?.addEventListener('mousemove', handleMouseMove);
        return () => footer?.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const navLinkClass = "relative hover:text-cyan-200 transition-all duration-300 flex items-center gap-2 group";
    const bulletClass = "w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-cyan-400/50";

    return (
        <footer
            ref={footerRef}
            className="relative text-white pt-16 pb-12 overflow-hidden font-sans"
            style={{
                background: `
                    radial-gradient(ellipse at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 211, 238, 0.08) 0%, transparent 50%),
                    linear-gradient(135deg, #0c4a6e 0%, #1e3a5f 25%, #164e63 50%, #0e3a4d 75%, #0c4a6e 100%)
                `,
            }}
        >
            {/* Animated gradient overlay */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(34, 211, 238, 0.05) 50%, transparent 70%)',
                    animation: 'shimmer 8s ease-in-out infinite',
                }}
            />

            {/* Realistic water caustics effect */}
            <WaterCaustics />

            {/* Water waves at top */}
            <RealisticWaterWaves />

            {/* Floating bubbles effect */}
            <RealisticBubbles />

            {/* Decorative glow orbs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-10 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">

                    {/* Brand Section */}
                    <div className="md:col-span-5 lg:col-span-4 space-y-8">
                        <Link to="/" className="block w-fit group">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src={COMPANY_INFO.logo}
                                    alt={COMPANY_INFO.name}
                                    className="relative h-16 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                                />
                            </div>
                        </Link>
                        <p className="text-cyan-100/70 text-sm leading-relaxed max-w-sm font-light tracking-wide">
                            Elevando el estándar de pureza. Agua premium procesada con tecnología de vanguardia para tu bienestar y el de tu familia.
                        </p>

                        {/* Social Icons - Enhanced */}
                        <div className="flex gap-4">
                            {[
                                { href: COMPANY_INFO.social.facebook, icon: 'logos:facebook', label: 'Facebook' },
                                { href: COMPANY_INFO.social.instagram, icon: 'skill-icons:instagram', label: 'Instagram' },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative p-3 rounded-xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 backdrop-blur-md bg-white/5 hover:bg-white/10 hover:scale-110 hover:-translate-y-1"
                                    aria-label={social.label}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                                    <div className="absolute -inset-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500" />
                                    <Icon
                                        icon={social.icon}
                                        className="relative w-6 h-6 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2">
                        <div>
                            <h4 className="text-white font-semibold mb-6 text-sm tracking-[0.2em] uppercase flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent rounded-full" />
                                Compañía
                            </h4>
                            <ul className="space-y-4 text-sm text-cyan-100/60 font-light">
                                <li><Link to="/about" className={navLinkClass}><span className={bulletClass} />Nosotros</Link></li>
                                <li><Link to="/contact" className={navLinkClass}><span className={bulletClass} />Contacto</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 text-sm tracking-[0.2em] uppercase flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent rounded-full" />
                                Servicios
                            </h4>
                            <ul className="space-y-4 text-sm text-cyan-100/60 font-light">
                                <li><Link to="/products" className={navLinkClass}><span className={bulletClass} />Productos</Link></li>
                                <li><Link to="/aguacentros" className={navLinkClass}><span className={bulletClass} />Aguacentros</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6 text-sm tracking-[0.2em] uppercase flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent rounded-full" />
                                Contacto
                            </h4>
                            <ul className="space-y-5 text-sm text-cyan-100/60 font-light">
                                {[
                                    { icon: 'solar:phone-calling-bold-duotone', content: COMPANY_INFO.phone, href: `tel:${COMPANY_INFO.phone}` },
                                    { icon: 'solar:letter-bold-duotone', content: COMPANY_INFO.email, href: `mailto:${COMPANY_INFO.email}` },
                                    { icon: 'solar:map-point-bold-duotone', content: COMPANY_INFO.address },
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 group">
                                        <div className="relative p-2 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300">
                                            <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <Icon
                                                icon={item.icon}
                                                className="relative w-5 h-5 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                                            />
                                        </div>
                                        {item.href ? (
                                            <a href={item.href} className="hover:text-cyan-200 transition-colors duration-300 mt-1.5">{item.content}</a>
                                        ) : (
                                            <span className="group-hover:text-cyan-100/80 transition-colors duration-300 mt-1.5">{item.content}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-cyan-200/50 text-xs font-light tracking-wide">
                            &copy; {currentYear} {COMPANY_INFO.name}. Todos los derechos reservados.
                        </p>
                        <div className="flex gap-8 text-xs text-cyan-200/50 font-light tracking-wide">
                            <Link to="/contact" className="hover:text-cyan-300 transition-colors duration-300 relative group">
                                Contacto
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300" />
                            </Link>
                            <Link to="/about" className="hover:text-cyan-300 transition-colors duration-300 relative group">
                                Nosotros
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global animations */}
            <style>{`
                @keyframes shimmer {
                    0%, 100% { transform: translateX(-100%) rotate(45deg); }
                    50% { transform: translateX(100%) rotate(45deg); }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
