import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
    {
        title: 'Ética y Transparencia',
        description: 'Actuamos conforme a las normas éticas y sociales en las actividades relacionadas con el trabajo sin mentir ni engañar; no ocultando información relevante; respetando la confidencialidad de la información personal y de la organización.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000', // Meeting/Handshake
    },
    {
        title: 'Trabajo en Unidad',
        description: 'Gestionamos con la habilidad de trabajar juntos con sinergia hacia una visión, una meta u objetivo. Que nos permita lograr el éxito individual, colectivo y organizacional.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000', // Teamwork
    },
    {
        title: 'Orgullo de Pertenecer',
        description: 'Fomentamos y Generamos un ambiente de compañerismo, respeto y tolerancia, enfocando nuestros esfuerzos, logros y reconocimientos a la satisfacción de nuestros clientes y el bienestar de nuestros colaboradores.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1000', // Happy team
    },
    {
        title: 'Carácter Firme',
        description: 'Nos referimos a la cualidad o valor que moldean nuestros pensamientos, nuestras acciones, reacciones, decisiones y sentimientos para el logro de los resultados en el ámbito personal, laboral y profesional.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000', // Professional/Focus
    },
    {
        title: 'Comunicación Efectiva',
        description: 'Logramos una forma de comunicación, que quien transmite el mensaje lo haga de modo claro y entendible para su interlocutor/es, sin que genere confusión, dudas o interpretaciones erróneas.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000', // Communication
    },
    {
        title: 'Responsabilidad y Confianza',
        description: 'Logramos el cumplimiento de las obligaciones correctamente y a tiempo, teniendo el debido cuidado al tomar decisiones o al momento de realizar alguna tarea o función, generando confianza.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000', // Trust/Handshake
    },
    {
        title: 'Pasión por el Trabajo',
        description: 'Logramos día a día que nuestra fuerza laboral disfrute y realicen su trabajo con pasión y entrega, considerándolo como el motor que nos lleva a hacer y disfrutar las cosas que hacemos.',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000', // Passion/Energy
    },
    {
        title: 'Actitud Emprendedora e Innovación',
        description: 'Cultivamos la superación de retos y buscamos de manera incesante, generar e implementar soluciones tecnológicas y de negocio innovadoras que permitan la creación de objetivos estratégicos.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000', // Innovation/Tech
    },
    {
        title: 'Excelencia',
        description: 'Buscamos en lo que hacemos, comercializamos, o producimos que la excelencia sea una virtud, un talento o cualidad, que resulte extraordinariamente bueno y aceptable en todo lo que hacemos.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000', // Excellence/Building
    }
];

const MissionVisionValues: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const rows = gsap.utils.toArray<HTMLElement>('.value-row');

        rows.forEach((row, index) => {
            gsap.from(row, {
                scrollTrigger: {
                    trigger: row,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <span className="text-cyan-600 font-bold tracking-wider uppercase text-sm">Nuestra Esencia</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">Nuestros Valores</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
                        Los principios inquebrantables que guían cada paso de nuestra organización.
                    </p>
                </div>

                <div className="space-y-24">
                    {VALUES.map((value, index) => (
                        <div key={index} className={`value-row flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}>
                            {/* Text Content */}
                            <div className="w-full lg:w-1/2 relative">
                                {/* Watermark */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                                    <img
                                        src="/LOGO AGUA NUEVO 2.png"
                                        alt=""
                                        className="w-3/4 h-auto object-contain"
                                    />
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-3xl font-bold text-gray-900 mb-6 relative inline-block">
                                        {value.title}
                                        <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-cyan-500 rounded-full"></span>
                                    </h3>
                                    <p className="text-lg text-gray-600 leading-relaxed text-justify">
                                        {value.description}
                                    </p>
                                </div>
                            </div>

                            {/* Image */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                                    <div className="absolute inset-0 bg-cyan-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                    <img
                                        src={value.image}
                                        alt={value.title}
                                        className="w-full h-[300px] md:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-20">
                                        <img src="/LOGO AGUA NUEVO 2.png" alt="" className="w-1/2 h-auto object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MissionVisionValues;
