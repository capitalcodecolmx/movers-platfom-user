import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { COMPANY_INFO } from '../data/mockData';
import waterTexture from '../assets/images/headers/water-texture.png';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-slate-950 text-white pt-12 pb-12 overflow-hidden font-sans">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Subtle Water Texture Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
                    style={{
                        backgroundImage: `url(${waterTexture})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>

                {/* Radial Gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black opacity-90"></div>
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
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-light">
                            Elevando el estándar de pureza. Agua premium procesada con tecnología de vanguardia para tu bienestar y el de tu familia.
                        </p>

                        {/* Social Icons - Minimalist & Real */}
                        <div className="flex gap-4">
                            <a href={COMPANY_INFO.social.facebook} className="group p-2 rounded-full border border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300" aria-label="Facebook">
                                <Icon icon="logos:facebook" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100" />
                            </a>
                            <a href={COMPANY_INFO.social.instagram} className="group p-2 rounded-full border border-slate-800 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300" aria-label="Instagram">
                                <Icon icon="skill-icons:instagram" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100" />
                            </a>
                            <a href="#" className="group p-2 rounded-full border border-slate-800 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all duration-300" aria-label="Twitter">
                                <Icon icon="prime:twitter" className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-all duration-300" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation - Clean Columns */}
                    <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-2">
                        <div>
                            <h4 className="text-white font-medium mb-6 text-sm tracking-wider uppercase opacity-80">Compañía</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-light">
                                <li><Link to="/about" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>Nosotros</Link></li>
                                <li><Link to="/careers" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>Carreras</Link></li>
                                <li><Link to="/blog" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>Noticias</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-6 text-sm tracking-wider uppercase opacity-80">Servicios</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-light">
                                <li><Link to="/products" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>Productos</Link></li>
                                <li><Link to="/delivery" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>Delivery</Link></li>
                                <li><Link to="/business" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"><span className="w-1 h-1 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>Empresas</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-6 text-sm tracking-wider uppercase opacity-80">Contacto</h4>
                            <ul className="space-y-4 text-sm text-slate-400 font-light">
                                <li className="flex items-start gap-3">
                                    <Icon icon="solar:phone-calling-linear" className="w-5 h-5 text-cyan-500 mt-0.5" />
                                    <span>{COMPANY_INFO.phone}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Icon icon="solar:letter-linear" className="w-5 h-5 text-cyan-500 mt-0.5" />
                                    <span>{COMPANY_INFO.email}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Icon icon="solar:map-point-linear" className="w-5 h-5 text-cyan-500 mt-0.5" />
                                    <span>{COMPANY_INFO.address}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Minimalist Bar */}
                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-600 text-xs font-light">
                        &copy; {currentYear} {COMPANY_INFO.name}. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-8 text-xs text-slate-600 font-light">
                        <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacidad</Link>
                        <Link to="/terms" className="hover:text-slate-400 transition-colors">Términos</Link>
                        <Link to="/cookies" className="hover:text-slate-400 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
