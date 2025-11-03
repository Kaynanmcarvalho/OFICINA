/**
 * AppleInput Component
 * Input field premium estilo Apple sem bordas visíveis
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/theme-tokens.css';

const AppleInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = true,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const containerStyle = {
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: error ? 'var(--apple-accent-red)' : 'var(--apple-text-secondary)',
    marginBottom: '8px',
    transition: 'color 0.2s ease',
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const inputStyle = {
    width: '100%',
    height: '48px',
    padding: Icon ? (iconPosition === 'left' ? '12px 16px 12px 44px' : '12px 44px 12px 16px') : '12px 16px',
    fontSize: '16px',
    fontWeight: 400,
    color: 'var(--apple-text-primary)',
    background: 'transparent',
    border: 'none',
    borderBottom: `2px solid ${
      error ? 'var(--apple-accent-red)' : 
      isFocused ? 'var(--apple-accent-blue)' : 
      'var(--apple-border-medium)'
    }`,
    outline: 'none',
    transition: 'border-color 0.3s cubic-bezier(0.2, 0.9, 0.2, 1)',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 0.5 : 1,
  };

  const iconStyle = {
    position: 'absolute',
    [iconPosition]: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: error ? 'var(--apple-accent-red)' : 
           isFocused ? 'var(--apple-accent-blue)' : 
           'var(--apple-text-tertiary)',
    transition: 'color 0.3s ease',
    pointerEvents: 'none',
  };

  const errorStyle = {
    fontSize: '13px',
    color: 'var(--apple-accent-red)',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label style={labelStyle}>{label}</label>}
      
      <div style={inputWrapperStyle}>
        {Icon && iconPosition === 'left' && (
          <div style={iconStyle}>
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          style={inputStyle}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div style={iconStyle}>
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={errorStyle}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 4V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="8" cy="12" r="0.5" fill="currentColor"/>
            </svg>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppleInput;
