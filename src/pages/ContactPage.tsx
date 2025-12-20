import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { COMPANY_INFO } from '../data/mockData';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import GlassButton from '../components/ui/GlassButton';
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
                {/* Background Map - More visible but contained */}
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                    <img
                        src={mexicoMap}
                        alt="Mexico Map"
                        className="w-[90%] max-w-4xl h-auto object-contain opacity-15"
                    />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    {/* Header - Compact */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                            CONTÁCTANOS
                        </h1>
                        <div className="w-16 h-1 bg-cyan-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Side: Contact Info - Compact & Professional */}
                        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm">
                            {/* Location */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 flex-shrink-0 mt-1">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Ubicación</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {COMPANY_INFO.address}
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 flex-shrink-0 mt-1">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Email</h3>
                                    <p className="text-sm text-slate-600 font-medium">
                                        {COMPANY_INFO.email}
                                    </p>
                                    <p className="text-xs text-slate-400">orders@mouvers.com</p>
                                </div>
                            </div>

                            {/* Call */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 flex-shrink-0 mt-1">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Llámanos</h3>
                                    <p className="text-sm text-slate-600 font-medium">
                                        {COMPANY_INFO.phone}
                                    </p>
                                </div>
                            </div>

                            {/* Whatsapp */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 flex-shrink-0 mt-1">
                                    <Icon icon="logos:whatsapp-icon" className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Whatsapp</h3>
                                    <p className="text-sm text-slate-600 font-medium">
                                        Envíanos un mensaje directo
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Contact Form - Clean & Compact */}
                        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100 order-1 lg:order-2 relative z-20">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Nombre</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all outline-none text-sm"
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all outline-none text-sm"
                                            placeholder="tu@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Asunto</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all outline-none text-sm"
                                        placeholder="¿Cómo podemos ayudarte?"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Mensaje</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all outline-none resize-none text-sm"
                                        placeholder="Escribe tu mensaje aquí..."
                                    ></textarea>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <GlassButton
                                        type="submit"
                                        label={<span className="flex items-center gap-2"><Send size={16} /> Enviar Mensaje</span>}
                                        variant="blue"
                                        size="lg"
                                    />
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
