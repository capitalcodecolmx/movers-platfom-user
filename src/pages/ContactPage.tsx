import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { COMPANY_INFO } from '../data/mockData';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { Icon } from '@iconify/react';
import mexicoMap from '../assets/images/headers/mexico_map_silhouette.png';

const ContactPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Mensaje enviado correctamente (Simulación)');
    };

    return (
        <PublicLayout>
            <div className="relative min-h-screen bg-slate-50 overflow-hidden pt-20 pb-12 flex items-center">
                {/* Background Map & Watermark - Visible but unobtrusive */}
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            src={mexicoMap}
                            alt="Mexico Map"
                            className="absolute w-[95%] max-w-6xl h-auto object-contain opacity-[0.2] filter grayscale contrast-125"
                        />
                        <img
                            src="/LOGO AZUL MONITA COMPLETO.png"
                            alt="Watermark Logo"
                            className="absolute w-[40%] max-w-2xl h-auto object-contain opacity-[0.1] mix-blend-multiply"
                        />
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* Header - Compact & Professional */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                            CONTÁCTANOS
                        </h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full"></div>
                        <p className="text-slate-600 mt-4 max-w-2xl mx-auto font-medium text-sm uppercase tracking-wide">
                            Calidad mundial, <span className="text-cyan-700 font-bold">orgullosamente en México</span>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        {/* Left Side: Contact Info - Compact & High Contrast */}
                        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1 pt-2">
                            {/* Location */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:border-cyan-500 group-hover:text-cyan-600 transition-all duration-300 flex-shrink-0 shadow-sm group-hover:shadow-cyan-100">
                                    <MapPin size={22} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ubicación</h3>
                                    <p className="text-sm text-slate-900 font-bold leading-relaxed">
                                        {COMPANY_INFO.address}
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:border-cyan-500 group-hover:text-cyan-600 transition-all duration-300 flex-shrink-0 shadow-sm group-hover:shadow-cyan-100">
                                    <Mail size={22} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</h3>
                                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm text-slate-900 font-bold hover:text-cyan-600 transition-colors block">
                                        {COMPANY_INFO.email}
                                    </a>
                                </div>
                            </div>

                            {/* Call */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:border-cyan-500 group-hover:text-cyan-600 transition-all duration-300 flex-shrink-0 shadow-sm group-hover:shadow-cyan-100">
                                    <Phone size={22} strokeWidth={2} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Teléfono</h3>
                                    <a href={`tel:${COMPANY_INFO.phone}`} className="text-sm text-slate-900 font-bold hover:text-cyan-600 transition-colors block">
                                        {COMPANY_INFO.phone}
                                    </a>
                                </div>
                            </div>

                            {/* Whatsapp */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:border-cyan-500 group-hover:text-cyan-600 transition-all duration-300 flex-shrink-0 shadow-sm group-hover:shadow-cyan-100">
                                    <Icon icon="logos:whatsapp-icon" className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">WhatsApp</h3>
                                    <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-900 font-bold hover:text-cyan-600 transition-colors block">
                                        Enviar mensaje
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Contact Form - Compact & Professional */}
                        <div className="lg:col-span-7 order-1 lg:order-2 bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2 group-focus-within:text-cyan-600 transition-colors">Nombre</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full py-3 px-0 bg-transparent border-b-2 border-slate-300 focus:border-cyan-500 transition-all outline-none text-slate-900 font-bold placeholder-slate-400 text-sm"
                                            placeholder="TU NOMBRE"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2 group-focus-within:text-cyan-600 transition-colors">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full py-3 px-0 bg-transparent border-b-2 border-slate-300 focus:border-cyan-500 transition-all outline-none text-slate-900 font-bold placeholder-slate-400 text-sm"
                                            placeholder="TU@EMAIL.COM"
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2 group-focus-within:text-cyan-600 transition-colors">Asunto</label>
                                    <input
                                        type="text"
                                        className="w-full py-3 px-0 bg-transparent border-b-2 border-slate-300 focus:border-cyan-500 transition-all outline-none text-slate-900 font-bold placeholder-slate-400 text-sm"
                                        placeholder="¿CÓMO PODEMOS AYUDARTE?"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2 group-focus-within:text-cyan-600 transition-colors">Mensaje</label>
                                    <textarea
                                        rows={4}
                                        className="w-full py-3 px-0 bg-transparent border-b-2 border-slate-300 focus:border-cyan-500 transition-all outline-none resize-none text-slate-900 font-bold placeholder-slate-400 text-sm"
                                        placeholder="ESCRIBE TU MENSAJE..."
                                    ></textarea>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-10 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-extrabold tracking-widest uppercase transition-all transform hover:translate-y-[-1px] shadow-lg shadow-cyan-500/30 rounded-xl flex items-center gap-2"
                                    >
                                        <Send size={15} strokeWidth={2.5} /> Enviar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default ContactPage;
