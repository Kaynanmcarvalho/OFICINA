/**
 * TORQ Budget Stepper
 * Navegação visual do fluxo de orçamento
 * Plano Z2 - Interativo
 */

import React from 'react';
import { stepperStyles } from '../styles/budget.styles';
import { getBrandAccent } from '../styles/budget.tokens';
import { BUDGET_STEPS } from '../hooks/useBudgetFlow';

// ============================================================================
// ICONS
// ============================================================================
const StepIcons = {
  client: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  vehicle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 17h14v-5l-2-4H7l-2 4v5z" strokeLinejoin="round" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  ),
  items: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M9 3v2h6V3" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  summary: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4v16l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5V4l-2 1.5L16 4l-2 1.5L12 4l-2 1.5L8 4 6 5.5 4 4z" strokeLinejoin="round" />
      <path d="M8 9h8M8 13h5" strokeLinecap="round" />
    </svg>
  ),
  check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
        };
        
        const labelStyle: React.CSSProperties = {
          ...stepperStyles.label,
          ...(isActive ? stepperStyles.labelActive : {}),
          ...(isComplete ? { color: '#30D158' } : {}),
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
            <div style={{ textAlign: 'center' }}>
              <div style={labelStyle}>{step.label}</div>
              <div style={{ ...stepperStyles.label, fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetStepper;
