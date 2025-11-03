/**
 * GlassmorphismCard Component
 * Card com efeito de vidro translúcido estilo Apple
 */

import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/theme-tokens.css';

const GlassmorphismCard = ({ 
  children, 
  className = '',
  padding = 'default',
  rounded = 'default',
  shadow = 'default',
  hover = false,
  animated = true,
  onClick,
  style = {},
  ...props 
}) => {
  
  // Padding variants
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  // Border radius variants
  const roundedClasses = {
    none: '',
    sm: 'rounded-lg',
    default: 'rounded-2xl',
    lg: 'rounded-3xl',
    full: 'rounded-full',
  };

  // Shadow variants (usando CSS variables)
  const shadowStyles = {
    none: {},
    sm: { boxShadow: 'var(--apple-shadow-sm)' },
    default: { boxShadow: 'var(--apple-shadow-md)' },
    lg: { boxShadow: 'var(--apple-shadow-lg)' },
    xl: { boxShadow: 'var(--apple-shadow-xl)' },
  };

  // Hover variants para Framer Motion - REMOVIDO PARA EVITAR BLUR
  const hoverVariants = {};

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.8
      }
    }
  };

  const combinedClassName = `
    apple-glass-card
    ${paddingClasses[padding]}
    ${roundedClasses[rounded]}
    ${hover ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  const combinedStyle = {
    ...shadowStyles[shadow],
    ...style
  };

  // Se animated, usar motion.div, senão usar div normal
  if (animated) {
    return (
      <motion.div
        className={combinedClassName}
        style={combinedStyle}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={hoverVariants}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={combinedClassName}
      style={combinedStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassmorphismCard;
