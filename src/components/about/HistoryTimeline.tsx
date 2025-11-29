import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HistoryTimeline: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const items = gsap.utils.toArray<HTMLElement>('.timeline-item');

        items.forEach((item, index) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out',
                delay: index * 0.2
            });
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 timeline-item">
                    <span className="text-cyan-600 font-bold tracking-wider uppercase text-sm">Nuestros Inicios</span>
                    <h2 className="text-4xl font-bold text-gray-900 mt-2">Una Historia de Pureza</h2>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 hidden md:block"></div>

                    {/* 1993 - Founding */}
                    <div className="relative z-10 mb-20 timeline-item">
                        <div className="flex flex-col md:flex-row items-center justify-between w-full">
                            <div className="md:w-5/12 order-1 md:order-1 text-right pr-8">
                                <h3 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">1993</h3>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">El Comienzo</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    Nuestra compañía fue fundada en el mes de octubre de 1993 con la firme idea de proporcionar y garantizar el abasto a cada hogar y establecimiento de trabajo, el agua purificada tan necesaria en la vida diaria.
                                </p>
                            </div>
                            <div className="md:w-2/12 order-2 md:order-2 flex justify-center my-4 md:my-0">
                                <div className="w-8 h-8 bg-cyan-500 rounded-full border-4 border-white shadow-lg"></div>
                            </div>
                            <div className="md:w-5/12 order-3 md:order-3 pl-8">
                                <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
                                    <img
                                        src="/assets/images/about/fleet/fleet-1.avif" // Using fleet image as placeholder for history if needed
                                        alt="Fundación 1993"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mission */}
                    <div className="relative z-10 mb-20 timeline-item">
                        <div className="flex flex-col md:flex-row items-center justify-between w-full">
                            <div className="md:w-5/12 order-3 md:order-1 pl-8 md:pl-0 md:pr-8 md:text-right">
                                <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
                                    <img
                                        src="/assets/images/about/fleet/fleet-2.avif"
                                        alt="Misión"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                            <div className="md:w-2/12 order-2 md:order-2 flex justify-center my-4 md:my-0">
                                <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                            </div>
                            <div className="md:w-5/12 order-1 md:order-3 pl-8 text-left">
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    APB nació para proporcionar a todas las familias un producto de la más alta calidad, agua confiable y efectivamente purificada, utilizando los procesos y equipos de purificación más modernos y seguros.
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    Trabajamos para ser la mejor opción en relación con la calidad, comercialización y distribución, logrando de esta manera ser una empresa generadora de desarrollo social y laboral.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="relative z-10 timeline-item">
                        <div className="flex flex-col md:flex-row items-center justify-between w-full">
                            <div className="md:w-5/12 order-1 md:order-1 text-right pr-8">
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
                                <ul className="text-gray-600 leading-relaxed space-y-2">
                                    <li className="flex items-center justify-end gap-2">
                                        Mantenernos como la opción preferida por los consumidores.
                                        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                                    </li>
                                    <li className="flex items-center justify-end gap-2">
                                        Llegar cada día a más hogares y establecimientos.
                                        <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                                    </li>
                                </ul>
                            </div>
                            <div className="md:w-2/12 order-2 md:order-2 flex justify-center my-4 md:my-0">
                                <div className="w-8 h-8 bg-indigo-600 rounded-full border-4 border-white shadow-lg"></div>
                            </div>
                            <div className="md:w-5/12 order-3 md:order-3 pl-8">
                                <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
                                    <img
                                        src="/assets/images/about/fleet/fleet-3.avif"
                                        alt="Visión"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HistoryTimeline;
