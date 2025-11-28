import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { COMPANY_INFO } from '../data/mockData';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import headerBg from '../assets/images/headers/contact-texture.png';

const ContactPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Mensaje enviado correctamente (Simulación)');
    };

    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="relative bg-blue-900 text-white overflow-hidden h-[50vh] min-h-[400px] flex items-center">
                <div className="absolute inset-0">
                    <img
                        src={headerBg}
                        alt="Background"
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-cyan-900/90"></div>

                    {/* Watermark */}
                    <div className="absolute -left-20 -top-20 w-[500px] h-[500px] opacity-5">
                        <img src={COMPANY_INFO.logo} alt="" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full flex flex-col justify-center pb-20">
                    <div className="max-w-3xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-bold tracking-wider mb-4 backdrop-blur-sm">
                            ATENCIÓN AL CLIENTE
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Estamos aquí para <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">escucharte</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                            ¿Tienes dudas o comentarios? Contáctanos por cualquiera de nuestros medios oficiales.
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section with Floating Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Main Contact Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MessageCircle className="text-cyan-500" />
                                Medios de Contacto
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 flex-shrink-0">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Llámanos</p>
                                        <p className="font-bold text-gray-900">{COMPANY_INFO.phone}</p>
                                        <p className="text-sm text-gray-600 mt-1">Matamoros: (868) 826-06-24</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 flex-shrink-0">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Escríbenos</p>
                                        <p className="font-bold text-gray-900 break-all">{COMPANY_INFO.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 flex-shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Visítanos</p>
                                        <p className="font-bold text-gray-900 text-sm">{COMPANY_INFO.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-cyan-400" size={24} />
                                <h3 className="text-xl font-bold">Horario de Atención</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                                    <span className="text-gray-300">Lunes - Viernes</span>
                                    <span className="font-bold">8:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                                    <span className="text-gray-300">Sábado</span>
                                    <span className="font-bold">8:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Domingo</span>
                                    <span className="font-bold text-cyan-400">Cerrado</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100 h-full">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Envíanos un Mensaje</h2>
                            <p className="text-gray-500 mb-8">Completa el formulario y nos pondremos en contacto contigo a la brevedad.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Nombre Completo</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Teléfono</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
                                            placeholder="(000) 000-0000"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none"
                                        placeholder="tu@correo.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Mensaje</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none resize-none"
                                        placeholder="¿En qué podemos ayudarte hoy?"
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:from-cyan-500 hover:to-blue-500 transition-all transform hover:scale-[1.02] shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2"
                                    >
                                        <Send size={20} /> Enviar Mensaje
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
