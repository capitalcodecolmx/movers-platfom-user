import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BrandHeaderProps {
  logo: string;
  brandName: string;
  tagline: string;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ logo, brandName, tagline }) => (
  <div className="text-center mb-8">
    <img
      src={logo}
      alt={brandName}
      className="h-20 sm:h-24 mx-auto mb-4 brightness-0 invert drop-shadow-lg"
    />
    <p className="text-cyan-200/80 font-medium text-sm">{tagline}</p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mt-4 transition-colors"
    >
      <ArrowRight className="w-4 h-4 rotate-180" /> Volver al inicio
    </Link>
  </div>
);

export default BrandHeader;
