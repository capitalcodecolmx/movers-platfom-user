import React from 'react';
import { Link } from 'react-router-dom';

interface HeroCTAsProps {
  themeColor: string;
}

const HeroCTAs: React.FC<HeroCTAsProps> = ({ themeColor }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
      <Link
        to="/products"
        className="px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full border-2 border-white/40 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl text-center"
      >
        ORDENAR AHORA
      </Link>
      <Link
        to="/about"
        className="px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-white font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
        style={{ color: '#0f172a' }}
      >
        CONOCE MÁS
      </Link>
    </div>
  );
};

export default HeroCTAs;

