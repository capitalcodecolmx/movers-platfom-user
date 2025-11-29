import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Users, Heart, Zap, MessageCircle, Clock, Award, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
    {
        icon: Shield,
        title: 'Ética y Transparencia',
        description: 'Actuamos conforme a las normas éticas y sociales, respetando la confidencialidad y sin engañar.',
        color: 'text-blue-500'
    },
    {
        icon: Users,
        title: 'Trabajo en Unidad',
        description: 'Gestionamos con la habilidad de trabajar juntos con sinergia hacia una visión común.',
        color: 'text-cyan-500'
    },
    {
        icon: Heart,
        title: 'Orgullo de Pertenecer',
        description: 'Fomentamos un ambiente de compañerismo, respeto y tolerancia.',
        color: 'text-pink-500'
    },
    {
        icon: Zap,
        title: 'Carácter Firme',
        description: 'Cualidad que moldea nuestros pensamientos y acciones para el logro de resultados.',
        color: 'text-yellow-500'
    },
    {
        icon: MessageCircle,
        title: 'Comunicación Efectiva',
        description: 'Transmitimos mensajes de modo claro y entendible, evitando confusiones.',
        color: 'text-green-500'
    },
    {
        icon: Clock,
        title: 'Responsabilidad y Confianza',
        description: 'Cumplimos obligaciones a tiempo, generando confianza con compañeros y clientes.',
        color: 'text-indigo-500'
    },
    {
        icon: Award,
        title: 'Pasión por el Trabajo',
        description: 'Disfrutamos y realizamos nuestro trabajo con pasión y entrega.',
        color: 'text-red-500'
    },
    {
        icon: TrendingUp,
        title: 'Actitud Emprendedora',
        description: 'Buscamos incesantemente generar e implementar soluciones innovadoras.',
        color: 'text-purple-500'
    }
];

const MissionVisionValues: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>('.value-card');

        gsap.from(cards, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-cyan-600 font-bold tracking-wider uppercase text-sm">Nuestra Esencia</span>
                    <h2 className="text-4xl font-bold text-gray-900 mt-2">Nuestros Valores</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Los principios que guían cada una de nuestras acciones y decisiones.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {VALUES.map((value, index) => (
                        <div key={index} className="value-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 ${value.color}`}>
                                <value.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MissionVisionValues;
