import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

const FLEET_IMAGES = [
    '/assets/images/about/fleet/fleet-1.avif',
    '/assets/images/about/fleet/fleet-2.avif',
    '/assets/images/about/fleet/fleet-3.avif',
    '/assets/images/about/fleet/fleet-4.avif',
];

const FleetSlider: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(containerRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-cyan-600 font-bold tracking-wider uppercase text-sm">Nuestra Flota</span>
                    <h2 className="text-4xl font-bold text-gray-900 mt-2">Llevando Calidad a Todo Reynosa</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Contamos con una moderna flota de distribución para asegurar que el agua más pura llegue a tu hogar o negocio.
                    </p>
                </div>

                <div className="relative">
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                        }}
                        pagination={true}
                        modules={[EffectCoverflow, Pagination, Autoplay]}
                        className="mySwiper w-full py-12"
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                    >
                        {FLEET_IMAGES.map((img, index) => (
                            <SwiperSlide key={index} className="w-[300px] sm:w-[400px] md:w-[500px]">
                                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative">
                                    <img src={img} alt={`Flota Blanquita ${index + 1}`} className="w-full h-auto object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                        <img src="/LOGO AGUA NUEVO 2.png" alt="" className="w-1/2 h-auto object-contain" />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default FleetSlider;
