/**
 * TORQ Budget Footer
 * Footer com resumo e ações
 * Plano Z1 - Estrutural + Z2 - CTA flutuante
 */

import React, { useState } from 'react';
import { footerStyles, buttonStyles } from '../styles/budget.styles';
import { getBrandAccent } from '../styles/budget.tokens';

// ============================================================================
// ICONS
// ============================================================================
const ChevronLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LoaderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <circle cx="12" cy="12" r="10" opacity="0.2" />
    <path d="M12 2a10 10 0 019.17 6" strokeLinecap="round" />
  </svg>
);

// ============================================================================
// COMPONENT
// ============================================================================
interface BudgetFooterProps {
  currentStep: number;
  totalSteps: number;
  total: number;
  subtotal?: number;
  discount?: number;
  canProceed: boolean;
  isLoading?: boolean;
  brand?: string;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const BudgetFooter: React.FC<BudgetFooterProps> = ({
  currentStep,
  totalSteps,
  total,
  subtotal,
  discount,
  canProceed,
  isLoading = false,
  brand,
  onPrev,
  onNext,
  onSubmit,
}) => {
  const accent = getBrandAccent(brand);
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;
  
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isSecondaryHovered, setIsSecondaryHovered] = useState(false);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const primaryStyle: React.CSSProperties = {
    ...buttonStyles.primary(accent.hex, accent.rgb),
    ...(isPrimaryHovered && !isLoading ? buttonStyles.primaryHover(accent.rgb) : {}),
    opacity: canProceed && !isLoading ? 1 : 0.5,
    cursor: canProceed && !isLoading ? 'pointer' : 'not-allowed',
  };
  
  const secondaryStyle: React.CSSProperties = {
    ...buttonStyles.secondary,
    ...(isSecondaryHovered ? buttonStyles.secondaryHover : {}),
  };
  
  return (
    <footer style={footerStyles.container}>
      {/* Summary */}
      <div style={footerStyles.summary}>
        {subtotal !== undefined && discount !== undefined && discount > 0 && (
          <>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={footerStyles.totalLabel}>Subtotal</span>
              <span style={{ ...footerStyles.totalLabel, color: 'rgba(255,255,255,0.7)' }}>
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={footerStyles.totalLabel}>Desconto</span>
              <span style={{ ...footerStyles.totalLabel, color: '#30D158' }}>
                -{formatCurrency(discount)}
              </span>
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={footerStyles.totalLabel}>Total</span>
          <span style={footerStyles.totalValue}>{formatCurrency(total)}</span>
        </div>
      </div>
      
      {/* Actions */}
      <div style={footerStyles.actions}>
        {!isFirstStep && (
          <button
            onClick={onPrev}
            style={secondaryStyle}
            onMouseEnter={() => setIsSecondaryHovered(true)}
            onMouseLeave={() => setIsSecondaryHovered(false)}
            disabled={isLoading}
          >
            <ChevronLeftIcon />
            Voltar
          </button>
        )}
        
        <button
          onClick={isLastStep ? onSubmit : onNext}
          style={primaryStyle}
          onMouseEnter={() => setIsPrimaryHovered(true)}
          onMouseLeave={() => setIsPrimaryHovered(false)}
          disabled={!canProceed || isLoading}
        >
          {isLoading ? (
            <>
              <LoaderIcon />
              Salvando...
            </>
          ) : isLastStep ? (
            <>
              <CheckIcon />
              Salvar Orçamento
            </>
          ) : (
            <>
              Continuar
              <ChevronRightIcon />
            </>
          )}
        </button>
      </div>
    </footer>
  );
};

export default BudgetFooter;
