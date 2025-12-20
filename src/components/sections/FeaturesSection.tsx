import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection: React.FC = () => {
    const featuresRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!featuresRef.current) return;

        const featureItems = featuresRef.current.querySelectorAll('.feature-card');
        const centerImage = featuresRef.current.querySelector('.center-visual');
        const header = featuresRef.current.querySelector('.section-header');

        // Header animation
        gsap.fromTo(header,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                }
            }
        );

        // Center visual animation
        gsap.fromTo(centerImage,
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: centerImage,
                    start: "top 80%",
                }
            }
        );

        // Feature cards animation
        gsap.fromTo(featureItems,
            { opacity: 0, x: (i) => (i < 2 ? -50 : 50) },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 70%",
                }
            }
        );
    }, { scope: featuresRef });

    return (
        <section ref={featuresRef} className="relative py-24 lg:py-32 overflow-hidden bg-white dark:bg-slate-950 font-display transition-colors duration-300">
            {/* Ambient Background Decorations */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[32rem] h-[32rem] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[80px] opacity-60 pointer-events-none mix-blend-multiply dark:mix-blend-lighten"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[28rem] h-[28rem] bg-cyan-100 dark:bg-cyan-900/10 rounded-full blur-[80px] opacity-60 pointer-events-none mix-blend-multiply dark:mix-blend-lighten"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="section-header text-center max-w-3xl mx-auto mb-20 lg:mb-24">
                    <span className="text-brand-cyan font-semibold uppercase tracking-widest text-sm mb-3 block">Nuestra Promesa</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                        ¿Por qué <span className="text-brand-blue relative inline-block">elegirnos
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-brand-cyan opacity-60" fill="none" viewBox="0 0 200 9" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.00025 6.99997C2.00025 6.99997 43.5 1.99997 101.5 1.99997C159.5 1.99997 198 7.00003 198 7.00003" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
                            </svg>
                        </span>?
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light mx-auto max-w-2xl">
                        Desde la pureza absoluta hasta la entrega puntual, nos dedicamos a llevar salud y frescura a tu hogar con un servicio premium en el que puedes confiar plenamente.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-center">
                    {/* Left Features */}
                    <div className="space-y-16 lg:space-y-24 order-2 lg:order-1">
                        <div className="feature-card group flex flex-col lg:items-end items-center text-center lg:text-right">
                            <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-800 text-brand-cyan group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-brand-blue/30 transform group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-3xl font-light">water_drop</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-brand-blue transition-colors duration-300">Máxima Pureza</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base lg:max-w-xs">
                                Proceso de purificación avanzado de 7 etapas, libre de cloro y metales pesados para tu total tranquilidad.
                            </p>
                        </div>

                        <div className="feature-card group flex flex-col lg:items-end items-center text-center lg:text-right">
                            <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-800 text-brand-cyan group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-brand-blue/30 transform group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-3xl font-light">verified_user</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-brand-blue transition-colors duration-300">Calidad Garantizada</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base lg:max-w-xs">
                                Certificaciones de calidad internacional y controles diarios rigurosos en cada lote de producción.
                            </p>
                        </div>
                    </div>

                    {/* Center Visual */}
                    <div className="center-visual order-1 lg:order-2 flex justify-center items-center w-full px-4 sm:px-0">
                        <div className="relative w-full max-w-[360px] mx-auto group">
                            <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full transform scale-90 group-hover:scale-100 transition-transform duration-700"></div>
                            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-blue-900/20 border-4 border-white dark:border-slate-700 bg-white dark:bg-slate-800 aspect-[3/4]">
                                <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-80"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6fO_vLzFOVS0r7Lx08ycZLOeU78MUsIX-1Bb4izW0LkUPphqx6fNMbmiMLmfE4MRSSZ7qDcu-kvl2O2lVNrLfda8mKd0B3G5gVNtKcLuFDM0Dp07B2FqE20fxiFvkv76qlgquonAzL3NmKq5uzEjO2i5c1wFNKJ0D0i-_SEjLLhRh9Aoc2YSyhhmxOr5ECnLjZOxVZqnvMSK5EPKULUkQHcOam-POhUhx3y9BfWOKVkLi09SIqAH1T_jfUhY6r2Vc-c7GkHmalWw4"
                                    alt="Botella de agua purificada Blanquita"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                                <div className="absolute bottom-0 left-0 w-full p-8 z-30 text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                            <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="white" fillOpacity="0.1" stroke="none"></path>
                                                <path d="M12 18V6M12 6L7 11M12 6L17 11" strokeWidth="2"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="font-serif italic text-4xl font-bold text-white mb-2 drop-shadow-lg">Blanquita</h3>
                                    <p className="text-xs tracking-[0.4em] font-bold text-white/90 uppercase drop-shadow-md">Agua Purificada</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Features */}
                    <div className="space-y-16 lg:space-y-24 order-3 lg:order-3">
                        <div className="feature-card group flex flex-col lg:items-start items-center text-center lg:text-left">
                            <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-800 text-brand-cyan group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-brand-blue/30 transform group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-3xl font-light">local_shipping</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-brand-blue transition-colors duration-300">Entrega Rápida</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base lg:max-w-xs">
                                Sistema logístico optimizado para llevar frescura a tu puerta en menos de 24 horas.
                            </p>
                        </div>

                        <div className="feature-card group flex flex-col lg:items-start items-center text-center lg:text-left">
                            <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-800 text-brand-cyan group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-brand-blue/30 transform group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-3xl font-light">home_pin</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-brand-blue transition-colors duration-300">Servicio a Domicilio</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base lg:max-w-xs">
                                Atención personalizada para hogares y empresas, adaptándonos a tus horarios y necesidades.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Action */}
                <div className="mt-20 lg:mt-24 text-center">
                    <Link to="/products" className="group relative inline-flex items-center justify-center px-12 py-5 text-base font-bold text-white transition-all duration-300 bg-brand-blue rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-brand-blue/40 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-blue via-blue-600 to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[length:200%_auto] animate-gradient"></div>
                        <span className="relative flex items-center gap-3 uppercase tracking-wide">
                            Obtén tu cotización gratuita
                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                        </span>
                    </Link>
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Sin compromiso. Respuesta en menos de 1 hora.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
