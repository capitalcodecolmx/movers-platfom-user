import React from 'react';

interface ModeToggleProps {
  isSignUp: boolean;
  onChange: (value: boolean) => void;
}

const tabs = [
  { label: 'Iniciar sesión', value: false },
  { label: 'Crear cuenta', value: true },
] as const;

const ModeToggle: React.FC<ModeToggleProps> = ({ isSignUp, onChange }) => (
  <div className="inline-flex rounded-2xl border border-white/20 p-1 backdrop-blur">
    {tabs.map((tab) => {
      const active = isSignUp === tab.value;
      return (
        <button
          key={tab.label}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
            active
              ? 'bg-white text-cyan-900 shadow-lg'
              : 'text-white/70 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default ModeToggle;
