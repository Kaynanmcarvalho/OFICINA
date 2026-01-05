/**
 * TORQ Brand Modal Wrapper
 * Componente wrapper para aplicar identidade visual da marca em modais
 * Uso: Envolver modais existentes para herdar tema da marca do veículo
 * Janeiro 2026
 */

import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store';
import { getBrandModalTheme, getBrandModalStyles } from '../utils/brandModalTheme';
import '../styles/brand-modal.css';

/**
 * BrandModalWrapper - Aplica identidade visual da marca ao modal
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla visibilidade do modal
 * @param {Function} props.onClose - Callback para fechar o modal
 * @param {string} props.brand - Nome da marca do veículo (ex: "BMW", "Ferrari")
 * @param {React.ReactNode} props.children - Conteúdo do modal
 * @param {string} props.className - Classes CSS adicionais
 * @param {string} props.size - Tamanho do modal: 'sm' | 'md' | 'lg' | 'xl' | 'full'
 */
const BrandModalWrapper = ({
  isOpen,
  onClose,
  brand,
  children,
  className = '',
  size = 'lg'
}) => {
  const { theme: appTheme } = useThemeStore();
  const isDark = appTheme === 'dark';
  
  // Obter tema da marca
  const brandTheme = useMemo(() => getBrandModalTheme(brand), [brand]);
  const brandStyles = useMemo(() => getBrandModalStyles(brandTheme), [brandTheme]);
  
  // Tamanhos do modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  // Animações
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.96,
      y: 10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 10,
      transition: {
        duration: 0.2
      }
    }
  };

  // Fechar com ESC
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose?.();
  };

  // Fechar ao clicar no overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={`brand-modal ${isDark ? 'dark' : 'light'} brand-modal__overlay`}
          style={brandStyles}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className={`brand-modal__container ${sizeClasses[size]} ${className}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BrandModalWrapper;