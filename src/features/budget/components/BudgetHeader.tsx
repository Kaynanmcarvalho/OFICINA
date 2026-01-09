/**
 * TORQ Budget Header
 * Header premium com LOGO da marca do veículo
 * Plano Z1 - Estrutural
 * 
 * SEMPRE exibe a logo da marca, nunca ícone genérico
 */

import React from 'react';
import { headerStyles } from '../styles/budget.styles';
import { getBrandAccent } from '../styles/budget.tokens';
import { BudgetStepper } from './BudgetStepper';

// ============================================================================
// ICONS
// ============================================================================
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

// ============================================================================
// BRAND LOGOS - Import from vehicleBrandLogos utility
// ============================================================================
// @ts-ignore - JS module
import { getBrandLogoUrl, getEffectiveBrand } from '../../../utils/vehicleBrandLogos';

// ============================================================================
// COMPONENT
// ============================================================================
interface BudgetHeaderProps {
  title: string;
  subtitle?: string;
  plate?: string;
  brand?: string;
  model?: string;
  year?: string;
  isEditMode?: boolean;
  currentStep: number;
  onStepClick: (step: number) => void;
  isStepValid: (step: number) => boolean;
  onClose: () => void;
}

export const BudgetHeader: React.FC<BudgetHeaderProps> = ({
  title,
  subtitle,
  plate,
  brand,
  model,
  year,
  isEditMode = false,
  currentStep,
  onStepClick,
  isStepValid,
  onClose,
}) => {
  const accent = getBrandAccent(brand);
  
  // Get effective brand and logo URL
  const effectiveBrand = getEffectiveBrand(brand || '', model || '');
  // Use light theme logo (white) for dark modal background
  const logoUrl = getBrandLogoUrl(effectiveBrand, model || '', false);
  
  // Brands that should NOT have filter applied (already have colors)
  const coloredLogoBrands = [
    'bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'land-rover', 
    'chevrolet', 'ford', 'renault', 'mini', 'dodge', 'ram', 'volvo', 
    'porsche', 'chery', 'jac', 'jac motors'
  ];
  const shouldApplyFilter = !coloredLogoBrands.includes(effectiveBrand?.toLowerCase() || '');
  
  // Special sizing for certain brands
  const brandLower = effectiveBrand?.toLowerCase() || '';
  const isJac = brandLower === 'jac' || brandLower === 'jac motors';
  const isDodge = brandLower === 'dodge';
  const isSmallLogo = ['byd', 'yamaha', 'kawasaki'].includes(brandLower);
  
  // Calculate logo dimensions
  const getLogoStyle = () => {
    if (isJac) {
      return { height: '50px', maxWidth: '150px' };
    }
    if (isDodge) {
      return { height: '48px', maxWidth: '140px' };
    }
    if (isSmallLogo) {
      return { height: '32px', maxWidth: '80px' };
    }
    return { height: '40px', maxWidth: '120px' };
  };
  
  const logoStyle = getLogoStyle();
  
  return (
    <header style={headerStyles.container}>
      {/* Brand accent line */}
      <div style={headerStyles.brandLine(accent.hex)} />
      
      {/* Title Row */}
      <div style={headerStyles.titleRow}>
        <div style={headerStyles.brandInfo}>
          {/* SEMPRE Logo da marca */}
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={effectiveBrand || 'Marca'}
              style={{
                height: logoStyle.height,
                width: 'auto',
                maxWidth: logoStyle.maxWidth,
                objectFit: 'contain',
                filter: shouldApplyFilter ? 'brightness(0) invert(1)' : 'none',
              }}
            />
          ) : (
            // Fallback: Nome da marca em texto se não tiver logo
            <div style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
            }}>
              {(effectiveBrand || brand || 'TORQ').toUpperCase()}
            </div>
          )}
          
          {/* Separator */}
          <div style={{
            width: '1px',
            height: '36px',
            background: 'rgba(255, 255, 255, 0.12)',
            marginLeft: '8px',
            marginRight: '8px',
          }} />
          
          {/* Title Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Placa em destaque */}
              {plate ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 14px',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)',
                  borderRadius: '6px',
                  border: '2px solid #1a1a1a',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}>
                  <span style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#1a1a1a',
                    textTransform: 'uppercase',
                  }}>
                    {plate}
                  </span>
                </div>
              ) : (
                <h1 style={headerStyles.title}>{title}</h1>
              )}
              
              <span style={headerStyles.badge(accent.hex)}>
                {isEditMode ? 'Editando' : 'Novo'}
              </span>
            </div>
            <p style={headerStyles.subtitle}>
              {model ? `${brand || ''} ${model}${year ? ` • ${year}` : ''}`.trim() : subtitle}
            </p>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={headerStyles.closeButton}
          aria-label="Fechar"
        >
          <CloseIcon />
        </button>
      </div>
      
      {/* Stepper */}
      <BudgetStepper
        currentStep={currentStep}
        onStepClick={onStepClick}
        isStepValid={isStepValid}
        brand={brand}
      />
    </header>
  );
};

export default BudgetHeader;
