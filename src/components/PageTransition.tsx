import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(
            container.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    }, { scope: container });

    return (
        <div ref={container} className={`w-full ${className}`}>
            {children}
        </div>
    );
};

export default PageTransition;
