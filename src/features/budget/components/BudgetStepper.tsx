/**
 * TORQ Budget Stepper
 * Navegação visual do fluxo de orçamento
 * Plano Z2 - Interativo
 */

import React from 'react';
import { stepperStyles } from '../styles/budget.styles';
import { getBrandAccent, colors } from '../styles/budget.tokens';
import { BUDGET_STEPS } from '../hooks/useBudgetFlow';

// ============================================================================
// ICONS
// ============================================================================
const StepIcons = {
  client: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  vehicle: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17h14v-5l-2-4H7l-2 4v5z" strokeLinejoin="round" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  ),
  items: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M9 3v2h6V3" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  summary: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ============================================================================
// COMPONENT
// ============================================================================
interface BudgetStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  isStepValid: (step: number) => boolean;
  brand?: string;
}

export const BudgetStepper: React.FC<BudgetStepperProps> = ({
  currentStep,
  onStepClick,
  isStepValid,
  brand,
}) => {
  const accent = getBrandAccent(brand);
  
  return (
    <div style={stepperStyles.container}>
      {BUDGET_STEPS.map((step, idx) => {
        const isActive = idx === currentStep;
        const isComplete = idx < currentStep;
        const isFinalStep = idx === BUDGET_STEPS.length - 1;
        const isClickable = idx <= currentStep || (idx === currentStep + 1 && isStepValid(currentStep));
        
        const Icon = StepIcons[step.id as keyof typeof StepIcons] || StepIcons.client;
        
        const stepStyle: React.CSSProperties = {
          ...stepperStyles.step,
          ...(isClickable ? {} : stepperStyles.stepDisabled),
        };
        
        const indicatorStyle: React.CSSProperties = {
          ...stepperStyles.indicator,
          ...(isActive ? stepperStyles.indicatorActive(accent.hex, accent.rgb) : {}),
          ...(isComplete ? stepperStyles.indicatorComplete : {}),
          ...(isFinalStep ? stepperStyles.indicatorFinal : {}),
        };
        
        const labelStyle: React.CSSProperties = {
          ...stepperStyles.label,
          ...(isActive ? stepperStyles.labelActive : {}),
          ...(isComplete ? { color: colors.state.success, fontWeight: 600 } : {}),
          ...(isFinalStep ? stepperStyles.labelFinal : {}),
        };
        
        return (
          <div
            key={step.id}
            style={stepStyle}
            onClick={() => isClickable && onStepClick(idx)}
            role="button"
            tabIndex={isClickable ? 0 : -1}
            aria-current={isActive ? 'step' : undefined}
          >
            {/* Connector Line */}
            {idx < BUDGET_STEPS.length - 1 && (
              <div
                style={{
                  ...stepperStyles.connector,
                  ...(isComplete ? stepperStyles.connectorComplete(accent.hex) : {}),
                }}
              />
            )}
            
            {/* Step Indicator */}
            <div style={indicatorStyle}>
              {isComplete ? <StepIcons.check /> : <Icon />}
            </div>
            
            {/* Step Label */}
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={labelStyle}>{step.label}</div>
              {!isActive && (
                <div style={{ 
                  ...stepperStyles.label, 
                  fontSize: '11px', 
                  opacity: 0.6, 
                  marginTop: '2px',
                  fontWeight: 400,
                }}>
                  {step.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetStepper;
