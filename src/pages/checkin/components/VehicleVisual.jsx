/**
 * VehicleVisual - Renderização visual do veículo
 * SVG dinâmico com cor baseada nos dados
 */

import { motion } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { detectVehicleType } from '../../../services/vehicleDataService';

const VehicleVisual = ({ vehicleData }) => {
  const { isDarkMode } = useThemeStore();
  
  if (!vehicleData) return null;

  const { marca, modelo, cor } = vehicleData;
  const vehicleType = detectVehicleType(marca, modelo);
  const vehicleColor = cor || (isDarkMode ? '#6B7280' : '#9CA3AF');

  // SVG do carro
  const CarSVG = () => (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      {/* Sombra */}
      <ellipse cx="200" cy="180" rx="150" ry="15" fill="#00000020" />
      
      {/* Corpo principal */}
      <path
        d="M80 120 L80 140 Q80 150 90 150 L110 150 Q120 150 120 140 L120 130 L280 130 L280 140 Q280 150 290 150 L310 150 Q320 150 320 140 L320 120 Q320 100 300 90 L280 90 L280 80 Q280 70 270 70 L130 70 Q120 70 120 80 L120 90 L100 90 Q80 100 80 120 Z"
        fill={vehicleColor}
        stroke={isDarkMode ? '#374151' : '#D1D5DB'}
        strokeWidth="2"
      />
      
      {/* Janelas */}
      <path
        d="M130 80 L130 90 L270 90 L270 80 Q270 75 265 75 L135 75 Q130 75 130 80 Z"
        fill={isDarkMode ? '#1F2937' : '#E5E7EB'}
        opacity="0.8"
      />
      
      {/* Rodas */}
      <circle cx="140" cy="150" r="20" fill="#374151" />
      <circle cx="140" cy="150" r="15" fill="#6B7280" />
      <circle cx="260" cy="150" r="20" fill="#374151" />
      <circle cx="260" cy="150" r="15" fill="#6B7280" />
      
      {/* Faróis */}
      <circle cx="90" cy="110" r="8" fill="#FEF3C7" opacity="0.8" />
      <circle cx="310" cy="110" r="8" fill="#FEF3C7" opacity="0.8" />
      
      {/* Logo da marca */}
      <text x="200" y="115" textAnchor="middle" className="text-xs font-bold" fill={isDarkMode ? '#F9FAFB' : '#1F2937'}>
        {marca}
      </text>
    </svg>

  // SVG da moto
  const MotorcycleSVG = () => (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      {/* Sombra */}
      <ellipse cx="200" cy="180" rx="120" ry="12" fill="#00000020" />
      
      {/* Rodas */}
      <circle cx="120" cy="150" r="25" fill="#374151" />
      <circle cx="120" cy="150" r="20" fill="#6B7280" />
      <circle cx="280" cy="150" r="25" fill="#374151" />
      <circle cx="280" cy="150" r="20" fill="#6B7280" />
      
      {/* Chassi */}
      <path
        d="M120 150 L160 130 L240 130 L280 150"
        stroke={vehicleColor}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Tanque */}
      <ellipse cx="200" cy="120" rx="40" ry="20" fill={vehicleColor} />
      
      {/* Guidão */}
      <path
        d="M180 100 Q200 90 220 100"
        stroke={vehicleColor}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Assento */}
      <ellipse cx="220" cy="115" rx="25" ry="8" fill={isDarkMode ? '#374151' : '#6B7280'} />
      
      {/* Farol */}
      <circle cx="180" cy="105" r="12" fill="#FEF3C7" opacity="0.8" />
      
      {/* Logo da marca */}
      <text x="200" y="125" textAnchor="middle" className="text-xs font-bold" fill={isDarkMode ? '#F9FAFB' : '#1F2937'}>
        {marca}
      </text>
    </svg>

  // SVG do caminhão
  const TruckSVG = () => (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      {/* Sombra */}
      <ellipse cx="200" cy="185" rx="180" ry="15" fill="#00000020" />
      
      {/* Cabine */}
      <rect x="60" y="80" width="80" height="70" rx="10" fill={vehicleColor} stroke={isDarkMode ? '#374151' : '#D1D5DB'} strokeWidth="2" />
      
      {/* Carroceria */}
      <rect x="140" y="90" width="200" height="60" rx="5" fill={vehicleColor} stroke={isDarkMode ? '#374151' : '#D1D5DB'} strokeWidth="2" />
      
      {/* Janelas da cabine */}
      <rect x="70" y="90" width="60" height="30" rx="5" fill={isDarkMode ? '#1F2937' : '#E5E7EB'} opacity="0.8" />
      
      {/* Rodas */}
      <circle cx="100" cy="170" r="22" fill="#374151" />
      <circle cx="100" cy="170" r="17" fill="#6B7280" />
      <circle cx="180" cy="170" r="22" fill="#374151" />
      <circle cx="180" cy="170" r="17" fill="#6B7280" />
      <circle cx="300" cy="170" r="22" fill="#374151" />
      <circle cx="300" cy="170" r="17" fill="#6B7280" />
      
      {/* Faróis */}
      <circle cx="50" cy="115" r="10" fill="#FEF3C7" opacity="0.8" />
      
      {/* Logo da marca */}
      <text x="100" y="110" textAnchor="middle" className="text-xs font-bold" fill={isDarkMode ? '#F9FAFB' : '#1F2937'}>
        {marca}
      </text>
    </svg>

  const getSVGComponent = () => {
    switch (vehicleType) {
      case 'moto':
        return <MotorcycleSVG />;
      case 'caminhao':
        return <TruckSVG />;
      default:
        return <CarSVG />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`
        relative w-full max-w-md mx-auto h-48
        rounded-2xl border-2 p-6
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        shadow-xl overflow-hidden
      `}
    >
      {/* Fundo com gradiente da cor do veículo */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at center, ${vehicleColor}40, transparent)`
        }}
      />
      
      {/* SVG do veículo */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {getSVGComponent()}
      </div>
      
      {/* Efeito de luz */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 100, opacity: [0, 0.5, 0] }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 skew-x-12"
      />
      
      {/* Tipo do veículo */}
      <div className="absolute bottom-2 right-2">
        <span className={`
          text-xs font-medium px-2 py-1 rounded-full
          ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}
        `}>
          {vehicleType === 'moto' ? 'Motocicleta' : vehicleType === 'caminhao' ? 'Caminhão' : 'Automóvel'}
        </span>
      </div>
    </motion.div>
  );
};

export default VehicleVisual;
