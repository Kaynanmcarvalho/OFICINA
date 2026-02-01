/**
 * TORQ Budget Header
 * Header premium com LOGO da marca do veículo
 * Plano Z1 - Estrutural
 * 
 * SEMPRE exibe a logo da marca, nunca ícone genérico
 */

import React from 'react';
import { headerStyles } from '../styles/budget.styles';
import { getBrandAccent, colors } from '../styles/budget.tokens';
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
  // Use dark theme logo (colored) for better visibility
  const logoUrl = getBrandLogoUrl(effectiveBrand, model || '', true);
  
  // ============================================================================
  // DARK MODE LOGO MEMORY SYSTEM
  // Sistema de memória para logos de marcas no tema escuro
  // ============================================================================
  
  // Marcas que devem ter filtro BRANCO no dark mode (logos escuras/azuis)
  const darkModeWhiteFilterBrands = [
    'ford',                        // Ford - logo azul → branca
    'hyundai',                     // Hyundai - logo azul → branca
    'subaru',                      // Subaru - logo azul → branca
    'mazda',                       // Mazda - logo preta → branca
    'mitsubishi',                  // Mitsubishi - logo vermelha → branca
    'suzuki',                      // Suzuki - logo azul → branca
    'nissan',                      // Nissan - logo preta → branca
    'honda',                       // Honda - logo preta → branca
    'toyota',                      // Toyota - logo preta → branca
  ];
  
  // Marcas que já têm cores e NÃO devem ter filtro (mantém cores originais)
  const darkModeColoredBrands = [
    'bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'land-rover', 
    'chevrolet', 'renault', 'mini', 'dodge', 'ram', 'volvo', 
    'porsche', 'chery', 'jac', 'jac motors', 'audi', 'yamaha',
    'mercedes', 'mercedes-benz', 'kia', 'peugeot', 'citroen', 'jeep',
    'volkswagen', 'vw' // VW mantém cores originais
  ];
  
  // Detectar se está no dark mode
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  // Decidir se aplica filtro branco
  const shouldApplyWhiteFilter = isDarkMode && 
    darkModeWhiteFilterBrands.includes(effectiveBrand?.toLowerCase() || '');
  
  // Decidir se mantém cores (não aplica filtro)
  const shouldKeepColors = darkModeColoredBrands.includes(effectiveBrand?.toLowerCase() || '');
  
  // Special sizing for certain brands
  const brandLower = effectiveBrand?.toLowerCase() || '';
  const isJac = brandLower === 'jac' || brandLower === 'jac motors';
  const isDodge = brandLower === 'dodge';
  const isVW = brandLower === 'volkswagen' || brandLower === 'vw';
  const isYamaha = brandLower === 'yamaha';
  const isFiat = brandLower === 'fiat';
  const isSmallLogo = ['byd', 'kawasaki'].includes(brandLower);
  
  // Calculate logo dimensions
  const getLogoStyle = () => {
    if (isVW) {
      // VW logo aumentada em 100%
      return { height: '72px', maxWidth: '200px' }; // 36px * 2 = 72px
    }
    if (isJac) {
      return { height: '100px', maxWidth: '300px' }; // Aumentado em 100%: 50px * 2 = 100px
    }
    if (isYamaha) {
      return { height: '51px', maxWidth: '128px' }; // Diminuído em 20%: 64px * 0.8 = 51px
    }
    if (isFiat) {
      return { height: '80px', maxWidth: '240px' }; // Aumentado em 100%: 40px * 2 = 80px
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
                filter: shouldApplyWhiteFilter 
                  ? 'brightness(0) invert(1)' 
                  : shouldKeepColors 
                    ? 'none' 
                    : 'brightness(0) invert(1)',
                opacity: 1, // Opacidade 100% para garantir visibilidade
              }}
              onError={(e) => {
                console.error('Erro ao carregar logo:', effectiveBrand);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            // Fallback: Nome da marca em texto se não tiver logo
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              opacity: 0.9,
            }}>
              {(effectiveBrand || brand || 'TORQ').toUpperCase()}
            </div>
          )}
          
          {/* Separator */}
          <div style={{
            width: '1px',
            height: '32px',
            background: 'rgba(255, 255, 255, 0.08)',
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
                  padding: '5px 12px',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)',
                  borderRadius: '6px',
                  border: '2px solid #1a1a1a',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
                }}>
                  <span style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
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
              {model ? (
                <span style={{ color: colors.text.primary, fontWeight: 600 }}>
                  {brand || ''} {model}{year ? ` • ${year}` : ''}
                </span>
              ) : (
                subtitle
              )}
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
