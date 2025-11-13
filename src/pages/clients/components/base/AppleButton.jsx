/**
 * AppleButton Component
 * Botão premium estilo Apple com variantes e microinterações
 */

import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/theme-tokens.css';

const AppleButton = ({
  children,
  variant = 'primary',
  size = 'default',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) => {
  
  // Variant styles
  const variantStyles = {
    primary: {
      background: 'var(--apple-gradient-blue)',
      color: 'white',
      boxShadow: 'var(--apple-shadow-blue)',
      hoverShadow: 'var(--apple-shadow-blue-hover)',
    },
    secondary: {
      background: 'var(--apple-bg-tertiary)',
      color: 'var(--apple-text-primary)',
      border: '1px solid var(--apple-border-medium)',
      boxShadow: 'var(--apple-shadow-sm)',
      hoverShadow: 'var(--apple-shadow-md)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--apple-text-primary)',
      border: 'none',
      boxShadow: 'none',
      hoverShadow: 'none',
      hoverBg: 'var(--apple-overlay-medium)',
    },
    danger: {
      background: 'var(--apple-accent-red)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(255, 59, 48, 0.3)',
      hoverShadow: '0 6px 16px rgba(255, 59, 48, 0.4)',
    },
    success: {
      background: 'var(--apple-accent-green)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(52, 199, 89, 0.3)',
      hoverShadow: '0 6px 16px rgba(52, 199, 89, 0.4)',
    },
  };

  // Size styles
  const sizeStyles = {
    sm: {
      height: '36px',
      padding: '0 16px',
      fontSize: '14px',
      borderRadius: '10px',
    },
    default: {
      height: '48px',
      padding: '0 24px',
      fontSize: '16px',
      borderRadius: '12px',
    },
    lg: {
      height: '56px',
      padding: '0 32px',
      fontSize: '18px',
      borderRadius: '14px',
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  // Button style
  const buttonStyle = {
    ...currentSize,
    background: disabled ? 'var(--apple-bg-tertiary)' : currentVariant.background,
    color: disabled ? 'var(--apple-text-tertiary)' : currentVariant.color,
    border: currentVariant.border || 'none',
    boxShadow: disabled ? 'none' : currentVariant.boxShadow,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    transition: 'all 0.2s cubic-bezier(0.2, 0.9, 0.2, 1)',
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden',
  };

  // Hover animation
  const hoverAnimation = !disabled && !loading ? {
    y: -2,
    boxShadow: currentVariant.hoverShadow,
    background: variant === 'ghost' ? currentVariant.hoverBg : currentVariant.background,
  } : {};

  // Active animation
  const tapAnimation = !disabled && !loading ? {
    y: 0,
    scale: 0.98,
  } : {};

  // Loading spinner
  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        width: '16px',
        height: '16px',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
      }}
    />
  );

  return (
    <motion.button
      className={`apple-button ${className}`}
      style={buttonStyle}
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={18} strokeWidth={2.5} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={18} strokeWidth={2.5} />}
        </>
      )}
    </motion.button>
  );
};

export default AppleButton;
