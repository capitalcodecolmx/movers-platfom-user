import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { COMPANY_HISTORY, COMPANY_INFO } from '../data/mockData';
import { Target, Eye, Award, History, Droplets } from 'lucide-react';
import headerBg from '../assets/images/headers/water-texture.png';

const AboutPage: React.FC = () => {
    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="relative bg-cyan-900 text-white overflow-hidden h-[45vh] min-h-[350px] flex items-center">
                <div className="absolute inset-0">
                    <img
                        src={headerBg}
                        alt="Background"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/80 to-blue-900/90"></div>

                    {/* Watermark */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5 pointer-events-none">
                        <img src={COMPANY_INFO.logo} alt="" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-sm font-bold tracking-wider mb-6 backdrop-blur-sm">
                        DESDE 1993
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">Historia</span>
                    </h1>
                    <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed">
                        Más de 30 años comprometidos con la pureza y calidad del agua que llega a tu hogar.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* History Section */}
                <div className="mb-24">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2">
                            <div className="relative">
                                <div className="absolute -left-4 -top-4 w-20 h-20 bg-cyan-100 rounded-full opacity-50 blur-xl"></div>
                                <div className="relative bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                                            <History size={24} />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900">Nuestros Inicios</h2>
                                    </div>
                                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                        {COMPANY_HISTORY.description}
                                    </p>
                                    <div className="inline-flex items-center gap-3 px-5 py-3 bg-cyan-50 text-cyan-700 rounded-xl font-bold">
                                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                                        Fundada en {COMPANY_HISTORY.founded}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 relative">
                            {/* Decorative elements representing timeline/growth */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 mt-8">
                                    <div className="bg-blue-50 p-6 rounded-2xl">
                                        <h3 className="font-bold text-blue-900 text-lg mb-2">1993</h3>
                                        <p className="text-sm text-blue-700">Inicio de operaciones en Reynosa</p>
                                    </div>
                                    <div className="bg-cyan-50 p-6 rounded-2xl">
                                        <h3 className="font-bold text-cyan-900 text-lg mb-2">2005</h3>
                                        <p className="text-sm text-cyan-700">Expansión de Aguacentros</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-indigo-50 p-6 rounded-2xl">
                                        <h3 className="font-bold text-indigo-900 text-lg mb-2">2015</h3>
                                        <p className="text-sm text-indigo-700">Nueva planta purificadora</p>
                                    </div>
                                    <div className="bg-emerald-50 p-6 rounded-2xl">
                                        <h3 className="font-bold text-emerald-900 text-lg mb-2">Hoy</h3>
                                        <p className="text-sm text-emerald-700">Líderes en la región</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    <div className="group bg-gradient-to-br from-blue-50 to-white p-10 rounded-3xl border border-blue-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <Target size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Misión</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {COMPANY_HISTORY.mission}
                        </p>
                    </div>

                    <div className="group bg-gradient-to-br from-cyan-50 to-white p-10 rounded-3xl border border-cyan-100 hover:shadow-xl transition-all duration-300">
                        <div className="w-16 h-16 bg-cyan-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                            <Eye size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Visión</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {COMPANY_HISTORY.vision}
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div>
                    <div className="text-center mb-16">
                        <span className="text-cyan-600 font-bold tracking-wider text-sm uppercase mb-2 block">Nuestra Esencia</span>
                        <h2 className="text-4xl font-extrabold text-gray-900">Nuestros Valores</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {COMPANY_HISTORY.values.map((value, index) => (
                            <div key={index} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-100 hover:-translate-y-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                                        <Award size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default AboutPage;
