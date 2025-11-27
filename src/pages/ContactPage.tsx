import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { COMPANY_INFO } from '../data/mockData';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Mensaje enviado correctamente (Simulación)');
    };

    return (
        <PublicLayout>
            <div className="bg-cyan-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
                    <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                        Estamos disponibles para atenderte por teléfono, correo o redes sociales.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 flex-shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Horario de Atención</h3>
                                    <p className="text-gray-600">Lunes a Sábado: 8:00 a.m. - 6:00 p.m.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 flex-shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Teléfonos</h3>
                                    <p className="text-gray-600">Reynosa: {COMPANY_INFO.phone}</p>
                                    <p className="text-gray-600">Matamoros: (868) 826-06-24</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 flex-shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Correo Electrónico</h3>
                                    <p className="text-gray-600">{COMPANY_INFO.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 flex-shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Ubicación</h3>
                                    <p className="text-gray-600">{COMPANY_INFO.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                        placeholder="Tu teléfono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                    placeholder="¿En qué podemos ayudarte?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold hover:bg-cyan-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                <Send size={20} /> Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default ContactPage;
