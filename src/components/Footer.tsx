import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { COMPANY_INFO } from '../data/mockData';
import waterTexture from '../assets/images/headers/water-texture.png';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gradient-to-br from-cyan-900 via-blue-900 to-cyan-950 text-white pt-12 pb-12 overflow-hidden font-sans">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Subtle Water Texture Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
                    style={{
                        backgroundImage: `url(${waterTexture})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>

                {/* Gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/95 via-blue-900/95 to-cyan-950/95"></div>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">

                    {/* Brand Section - Minimalist */}
                    <div className="md:col-span-5 lg:col-span-4 space-y-8">
                        <Link to="/" className="block w-fit">
                            <img
                                src={COMPANY_INFO.logo}
                                alt={COMPANY_INFO.name}
                                className="h-16 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity duration-300"
                            />
                        </Link>
                        <p className="text-cyan-100/80 text-sm leading-relaxed max-w-sm font-light">
                            Elevando el estándar de pureza. Agua premium procesada con tecnología de vanguardia para tu bienestar y el de tu familia.
                        </p>

                        {/* Social Icons - Minimalist & Real with Neon Water Effect */}
                        <div className="flex gap-4">
                            <a href={COMPANY_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="group relative p-2 rounded-full border border-cyan-700/50 hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm" aria-label="Facebook">
                                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm group-hover:bg-cyan-400/30 transition-all"></div>
                                <Icon icon="logos:facebook" className="relative w-6 h-6 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-90 group-hover:opacity-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                            </a>
                            <a href={COMPANY_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative p-2 rounded-full border border-cyan-700/50 hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm" aria-label="Instagram">
                                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm group-hover:bg-cyan-400/30 transition-all"></div>
                                <Icon icon="skill-icons:instagram" className="relative w-6 h-6 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-90 group-hover:opacity-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation - Clean Columns */}
                    <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2">
                        <div>
                            <h4 className="text-white font-medium mb-6 text-sm tracking-wider uppercase">Compañía</h4>
                            <ul className="space-y-4 text-sm text-cyan-100/70 font-light">
                                <li><Link to="/about" className="hover:text-cyan-300 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm shadow-cyan-400/50"></span>Nosotros</Link></li>
                                <li><Link to="/contact" className="hover:text-cyan-300 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm shadow-cyan-400/50"></span>Contacto</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-6 text-sm tracking-wider uppercase">Servicios</h4>
                            <ul className="space-y-4 text-sm text-cyan-100/70 font-light">
                                <li><Link to="/products" className="hover:text-cyan-300 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm shadow-cyan-400/50"></span>Productos</Link></li>
                                <li><Link to="/aguacentros" className="hover:text-cyan-300 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm shadow-cyan-400/50"></span>Aguacentros</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-6 text-sm tracking-wider uppercase">Contacto</h4>
                            <ul className="space-y-4 text-sm text-cyan-100/70 font-light">
                                <li className="flex items-start gap-3 group">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-sm group-hover:bg-cyan-400/30 transition-all"></div>
                                        <Icon icon="solar:phone-calling-linear" className="relative w-6 h-6 text-cyan-300 mt-0.5 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:text-cyan-200 group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all" />
                                    </div>
                                    <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-cyan-300 transition-colors">{COMPANY_INFO.phone}</a>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-sm group-hover:bg-cyan-400/30 transition-all"></div>
                                        <Icon icon="solar:letter-linear" className="relative w-6 h-6 text-cyan-300 mt-0.5 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:text-cyan-200 group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all" />
                                    </div>
                                    <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-cyan-300 transition-colors break-all">{COMPANY_INFO.email}</a>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-sm group-hover:bg-cyan-400/30 transition-all"></div>
                                        <Icon icon="solar:map-point-linear" className="relative w-6 h-6 text-cyan-300 mt-0.5 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover:text-cyan-200 group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all" />
                                    </div>
                                    <span className="hover:text-cyan-100 transition-colors">{COMPANY_INFO.address}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Minimalist Bar */}
                <div className="border-t border-cyan-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-cyan-200/60 text-xs font-light">
                        &copy; {currentYear} {COMPANY_INFO.name}. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-8 text-xs text-cyan-200/60 font-light">
                        <Link to="/contact" className="hover:text-cyan-300 transition-colors">Contacto</Link>
                        <Link to="/about" className="hover:text-cyan-300 transition-colors">Nosotros</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
