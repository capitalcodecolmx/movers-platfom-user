import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const AboutHero: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(heroRef.current, {
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out'
        })
            .from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: 'power4.out'
            }, '-=1')
            .from(subtitleRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            }, '-=0.8');
    }, { scope: heroRef });

    return (
        <div ref={heroRef} className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-gray-900 text-white">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/about.avif"
                    alt="Nuestra Historia Background"
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-900"></div>

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
                    <img
                        src="/LOGO AGUA NUEVO 2.png"
                        alt=""
                        className="w-[80%] h-auto object-contain"
                    />
                </div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <h1 ref={titleRef} className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                    Nuestra <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Historia</span>
                </h1>
                <p ref={subtitleRef} className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                    Más de 30 años llevando pureza y confianza a los hogares de Reynosa.
                </p>
            </div>
        </div>
    );
};

export default AboutHero;
