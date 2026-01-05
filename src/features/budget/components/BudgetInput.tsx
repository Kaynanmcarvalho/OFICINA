/**
 * TORQ Budget Input
 * Input premium com estados visuais claros
 * Plano Z2 - Interativo
 */

import React, { useState, forwardRef } from 'react';
import { inputStyles } from '../styles/budget.styles';
import { getBrandAccent } from '../styles/budget.tokens';

interface BudgetInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  brand?: string;
}

export const BudgetInput = forwardRef<HTMLInputElement, BudgetInputProps>(({
  label,
  error,
  required,
  icon,
  brand,
  className,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const accent = getBrandAccent(brand);
  
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const fieldStyle: React.CSSProperties = {
    ...inputStyles.field,
    ...(isFocused && !error ? inputStyles.fieldFocus(accent.rgb) : {}),
    ...(error ? inputStyles.fieldError : {}),
    ...(icon ? { paddingLeft: '48px' } : {}),
  };
  
  return (
    <div style={inputStyles.wrapper}>
      {label && (
        <label style={inputStyles.label}>
          {label}
          {required && <span style={inputStyles.required}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={inputStyles.icon}>
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          style={fieldStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </div>
      
      {error && (
        <span style={inputStyles.error}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
});

BudgetInput.displayName = 'BudgetInput';

// ============================================================================
// TEXTAREA VARIANT
// ============================================================================
interface BudgetTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  label?: string;
  error?: string;
  required?: boolean;
  brand?: string;
}

export const BudgetTextarea = forwardRef<HTMLTextAreaElement, BudgetTextareaProps>(({
  label,
  error,
  required,
  brand,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const accent = getBrandAccent(brand);
  
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  const fieldStyle: React.CSSProperties = {
    ...inputStyles.field,
    minHeight: '100px',
    resize: 'vertical' as const,
    ...(isFocused && !error ? inputStyles.fieldFocus(accent.rgb) : {}),
    ...(error ? inputStyles.fieldError : {}),
  };
  
  return (
    <div style={inputStyles.wrapper}>
      {label && (
        <label style={inputStyles.label}>
          {label}
          {required && <span style={inputStyles.required}>*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        style={fieldStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      {error && (
        <span style={inputStyles.error}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
});

BudgetTextarea.displayName = 'BudgetTextarea';

export default BudgetInput;
