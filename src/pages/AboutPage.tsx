import React from 'react';
import PublicLayout from '../components/PublicLayout';
import { COMPANY_HISTORY } from '../data/mockData';
import { Target, Eye, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <PublicLayout>
            <div className="bg-cyan-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestra Historia</h1>
                    <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                        Desde 1993 comprometidos con la pureza y calidad para tu familia.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* History */}
                <div className="mb-20">
                    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestros Inicios</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            {COMPANY_HISTORY.description}
                        </p>
                        <div className="flex items-center gap-4 text-cyan-600 font-bold text-xl">
                            <span className="px-4 py-2 bg-cyan-50 rounded-lg">Fundada en {COMPANY_HISTORY.founded}</span>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-blue-50 rounded-2xl p-8">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                            <Target size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Misión</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {COMPANY_HISTORY.mission}
                        </p>
                    </div>

                    <div className="bg-cyan-50 rounded-2xl p-8">
                        <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-6">
                            <Eye size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Visión</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {COMPANY_HISTORY.vision}
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Nuestros Valores</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {COMPANY_HISTORY.values.map((value, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <Award className="text-cyan-500" size={24} />
                                    <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                                </div>
                                <p className="text-gray-600">
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
