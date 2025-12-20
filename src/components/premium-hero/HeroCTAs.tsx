import GlassButton from '../ui/GlassButton';

interface HeroCTAsProps {
  themeColor: string;
}

const HeroCTAs: React.FC<HeroCTAsProps> = ({ themeColor }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 items-center">
      <GlassButton to="/products" label="ORDENAR AHORA" />
      <GlassButton to="/about" label="CONOCE MÁS" className="!bg-[#050b18]/50" />
    </div>
  );
};

export default HeroCTAs;

