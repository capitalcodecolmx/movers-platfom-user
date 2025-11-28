import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import PromotionsSlider from '../PromotionsSlider';

const HeroSection: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);

    // Hero animation
    useGSAP(() => {
        if (!heroRef.current) return;

        const tl = gsap.timeline();
        const h1 = heroRef.current.querySelector('h1');
        const p = heroRef.current.querySelector('p');
        const links = heroRef.current.querySelectorAll('a');

        if (h1) {
            tl.fromTo(
                h1,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }

        if (p) {
            tl.fromTo(
                p,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
                '-=0.4'
            );
        }

        if (links.length > 0) {
            tl.fromTo(
                links,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, stagger: 0.2, ease: 'back.out(1.7)' },
                '-=0.3'
            );
        }
    }, { scope: heroRef });

    return (
        <section ref={heroRef} className="relative bg-gray-900 text-white overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

            {/* Promotions Slider - Full Width Container */}
            <div className="w-full relative z-10">
                <PromotionsSlider autoSlideInterval={5000} />
            </div>
        </section>
    );
};

export default HeroSection;
