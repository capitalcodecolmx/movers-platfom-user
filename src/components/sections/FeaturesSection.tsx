import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useMediaStore } from '../../store/useMediaStore';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { getVideo } = useMediaStore();
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    useEffect(() => {
        const loadVideo = async () => {
            const url = await getVideo('/bottles.mp4');
            setVideoSrc(url);
        };
        loadVideo();
    }, [getVideo]);

    useGSAP(() => {
        if (!sectionRef.current) return;

        const videoContainer = sectionRef.current.querySelector('.video-container');
        const overlayCard = sectionRef.current.querySelector('.overlay-card');
        const header = sectionRef.current.querySelector('.section-header');
        const features = sectionRef.current.querySelectorAll('.feature-item');

        // Initial setup
        gsap.set(videoContainer, { scale: 0.95, opacity: 0 });
        gsap.set(overlayCard, { y: 100, opacity: 0 });
        gsap.set(header, { x: -50, opacity: 0 });
        gsap.set(features, { y: 20, opacity: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                end: "bottom 80%",
            }
        });

        tl.to(videoContainer, { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out" })
            .to(header, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.8")
            .to(overlayCard, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
            .to(features, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=0.4");

    }, { scope: sectionRef });

    const features = [
        {
            icon: "ph:drop-bold",
            title: "Máxima Pureza",
            desc: "Proceso de purificación avanzado de 7 etapas."
        },
        {
            icon: "ph:seal-check-bold",
            title: "Calidad Garantizada",
            desc: "Certificaciones internacionales y controles diarios."
        },
        {
            icon: "ph:truck-bold",
            title: "Entrega Rápida",
            desc: "Frescura a tu puerta con el mejor servicio."
        },
        {
            icon: "ph:house-line-bold",
            title: "Servicio a Domicilio",
            desc: "Atención personalizada para hogares y empresas."
        }
    ];

    return (
        <section ref={sectionRef} className="relative py-20 lg:py-32 bg-white dark:bg-slate-950 overflow-hidden font-display">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                {/* Cinematic Frame Container */}
                <div className="video-container relative w-full h-[85vh] min-h-[600px] max-h-[900px] rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-slate-900 mx-auto transform-gpu">

                    {/* Video Background */}
                    <div className="absolute inset-0 w-full h-full">
                        {videoSrc && (
                            <video
                                src={videoSrc}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        )}
                        {/* Dramatic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
                    </div>

                    {/* Top Left Header "Tab" */}
                    <div className="section-header absolute top-8 left-8 lg:top-12 lg:left-12 max-w-lg z-20">
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-6 lg:p-10 rounded-3xl lg:rounded-[2rem] shadow-lg border border-white/20 dark:border-slate-700/50">
                            <span className="text-brand-cyan font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Nuestra Promesa</span>
                            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                Por qué <span className="text-brand-blue">elegirnos</span>
                            </h2>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                                Salud y frescura en tu hogar con un servicio premium inigualable.
                            </p>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-8 right-8 z-20 hidden lg:block">
                        <img src="/LOGO AGUA NUEVO 2.png" alt="Logo" className="w-20 h-20 object-contain brightness-0 invert opacity-80" />
                    </div>

                    {/* Bottom Right Features Card "Ticket" */}
                    <div className="overlay-card absolute bottom-0 right-0 w-full lg:w-auto lg:max-w-2xl z-20">
                        {/* Card Design resembling the "02" card in inspiration */}
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-t-[2.5rem] lg:rounded-tl-[3rem] lg:rounded-br-[3.5rem] p-8 lg:p-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative">

                            {/* Visual "cut" or decorative shape */}
                            <div className="absolute -top-12 right-0 w-24 h-12 bg-transparent hidden lg:block pointer-events-none">
                                <div className="w-full h-full bg-transparent rounded-br-[3rem] shadow-[20px_20px_0_0_rgba(255,255,255,0.5)] dark:shadow-[20px_20px_0_0_rgba(15,23,42,0.5)]"></div>
                            </div>
                            <div className="absolute bottom-0 -left-12 w-12 h-24 bg-transparent hidden lg:block pointer-events-none">
                                <div className="w-full h-full bg-transparent rounded-br-[3rem] shadow-[20px_20px_0_0_rgba(255,255,255,0.5)] dark:shadow-[20px_20px_0_0_rgba(15,23,42,0.5)]"></div>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="feature-item group flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-brand-blue group-hover:scale-110 transition-transform duration-300">
                                            <Icon icon={feature.icon} className="text-2xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1 group-hover:text-brand-blue transition-colors">{feature.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA inside the card */}
                            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="text-left">
                                    <p className="text-xs font-bold text-brand-cyan uppercase tracking-widest mb-1">Empieza hoy</p>
                                    <p className="text-slate-900 dark:text-white font-medium">La mejor hidratación para tu familia</p>
                                </div>
                                <Link to="/products" className="group flex items-center justify-center gap-3 bg-gradient-to-r from-brand-cyan to-brand-blue text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.15em] text-xs transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(14,165,233,0.6)] hover:shadow-[0_20px_40px_-5px_rgba(14,165,233,0.8)] active:scale-95 active:shadow-none">
                                    <span>Ver nuestros productos</span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;
