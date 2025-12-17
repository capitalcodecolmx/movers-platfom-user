import React from 'react';
import { COMPANY_INFO } from '../../data/mockData';

interface LoadingOverlayProps {
  progress: number;
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ progress, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gray-950 flex items-center justify-center">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMS0xLjc5LTQtNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8">
          <img
            src={COMPANY_INFO.logo}
            alt={COMPANY_INFO.name}
            className="w-32 h-32 mx-auto object-contain opacity-90"
          />
        </div>

        {/* Loading Bar */}
        <div className="w-64 sm:w-80 md:w-96 mx-auto">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Percentage */}
        <div className="mt-4">
          <span className="text-sm text-gray-400 font-mono">
            Cargando {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

