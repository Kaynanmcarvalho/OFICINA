/**
 * ToggleSwitch - Componente toggle switch elegante estilo Apple
 * Para ativar/desativar clientes com animações suaves
 */

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const ToggleSwitch = ({ 
  enabled = false, 
  onChange, 
  size = 'md',
  disabled = false,
  showIcons = true,
  className = '',
  enabledColor = 'bg-green-500',
  disabledColor = 'bg-red-500'
}) => {
  
  // Tamanhos disponíveis
  const sizes = {
    sm: {
      container: 'w-10 h-6',
      thumb: 'w-4 h-4',
      translate: 'translate-x-4'
    },
    md: {
      container: 'w-12 h-7',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      container: 'w-14 h-8',
      thumb: 'w-6 h-6',
      translate: 'translate-x-6'
    }
  };

  const sizeConfig = sizes[size];

  return (
    <motion.button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`
        ${sizeConfig.container}
        relative inline-flex items-center rounded-full
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        background: enabled ? 
          'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
          'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      initial={false}
    >
      {/* Thumb (bolinha) */}
      <motion.div
        className={`
          ${sizeConfig.thumb}
          bg-white rounded-full shadow-lg
          flex items-center justify-center
          absolute top-0.5 left-0.5
        `}
        animate={{
          x: enabled ? 
            (size === 'sm' ? 16 : size === 'md' ? 20 : 24) : 
            0
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30
        }}
        style={{
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Ícones opcionais */}
        {showIcons && (
          <motion.div
            key={enabled ? 'check' : 'x'} // Key para forçar re-render
            initial={{ scale: 0, rotate: enabled ? -90 : 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: enabled ? 90 : -90 }}
            transition={{ 
              duration: 0.2,
              type: "spring",
              stiffness: 500
            }}
          >
            {enabled ? (
              <Check 
                size={size === 'sm' ? 8 : size === 'md' ? 10 : 12} 
                className="text-green-600" 
                strokeWidth={3}
              />
            ) : (
              <X 
                size={size === 'sm' ? 8 : size === 'md' ? 10 : 12} 
                className="text-red-600" 
                strokeWidth={3}
              />
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Efeito de brilho */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)'
        }}
      />
    </motion.button>
  );
};

export default ToggleSwitch;