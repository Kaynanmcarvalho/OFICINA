/**
 * ToggleSwitch - Componente toggle switch elegante estilo Apple
 * Para ativar/desativar clientes com animações suaves
 */

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import '../../styles/toggle-switch-fix.css';

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
      translateX: 16, // 40px - 16px (thumb) - 8px (padding) = 16px
      iconSize: 10
    },
    md: {
      container: 'w-12 h-7',
      thumb: 'w-5 h-5',
      translateX: 20, // 48px - 20px (thumb) - 8px (padding) = 20px
      iconSize: 12
    },
    lg: {
      container: 'w-14 h-8',
      thumb: 'w-6 h-6',
      translateX: 24, // 56px - 24px (thumb) - 8px (padding) = 24px
      iconSize: 14
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
        transition-colors duration-150 ease-out toggle-optimized
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        background: enabled ? 
          'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
          'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      layout={false}
    >
      {/* Thumb (bolinha) */}
      <motion.div
        className={`
          ${sizeConfig.thumb}
          bg-white rounded-full shadow-lg
          absolute
        `}
        style={{
          top: '2px',
          left: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        animate={{
          x: enabled ? sizeConfig.translateX : 0
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.2
        }}
      >
        {/* Ícones opcionais */}
        {showIcons && (
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              opacity: 1
            }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            {enabled ? (
              <Check 
                size={sizeConfig.iconSize} 
                className="text-green-600" 
                strokeWidth={2.5}
                style={{ display: 'block' }}
              />
            ) : (
              <X 
                size={sizeConfig.iconSize} 
                className="text-red-600" 
                strokeWidth={2.5}
                style={{ display: 'block' }}
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