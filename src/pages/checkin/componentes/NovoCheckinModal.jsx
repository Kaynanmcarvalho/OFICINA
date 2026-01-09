/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TORQ — NOVO CHECK-IN MODAL
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Design: Cópia exata do modal "Editar Orçamento" (BudgetShell)
 * Estilos: Inline styles usando budget.tokens.ts
 * 
 * ARQUITETURA:
 * - Overlay escuro com blur (85% opacidade)
 * - Modal container com fundo #08080A
 * - Header com logo da marca + stepper
 * - Content area scrollável
 * - Footer com navegação
 * 
 * Janeiro 2026
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Stores & Context
import { useClientStore } from '../../../store/clientStore';
import { useEmpresa } from '../../../contexts/EmpresaContext';

// Services
import { consultarPlaca, isValidPlate } from '../../../services/vehicleApiService';
import { createCheckin } from '../../../services/checkinService';
import { getBrandLogoUrl, getEffectiveBrand } from '../../../utils/vehicleBrandLogos';

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS (copiados de budget.tokens.ts)
// ═══════════════════════════════════════════════════════════════════════════
const colors = {
  base: {
    primary: '#08080A',
    secondary: '#0C0C0E',
    tertiary: '#101012',
    elevated: '#141416',
  },
  surface: {
    soft: 'rgba(255, 255, 255, 0.03)',
    medium: 'rgba(255, 255, 255, 0.05)',
    strong: 'rgba(255, 255, 255, 0.08)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.45)',
    disabled: 'rgba(255, 255, 255, 0.25)',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.04)',
    default: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.12)',
  },
  state: {
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
  },
};

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

const typography = {
  title: { fontSize: '20px', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.02em' },
  subtitle: { fontSize: '14px', fontWeight: 500, lineHeight: 1.4 },
  label: { fontSize: '13px', fontWeight: 500, lineHeight: 1.4, letterSpacing: '0.01em' },
  body: { fontSize: '15px', fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: '12px', fontWeight: 400, lineHeight: 1.4, letterSpacing: '0.01em' },
};

const getBrandAccent = (brand) => {
  const brandColors = {
    bmw: { hex: '#0066B1', rgb: '0, 102, 177' },
    mercedes: { hex: '#00ADEF', rgb: '0, 173, 239' },
    audi: { hex: '#BB0A30', rgb: '187, 10, 48' },
    porsche: { hex: '#D5001C', rgb: '213, 0, 28' },
    volkswagen: { hex: '#001E50', rgb: '0, 30, 80' },
    toyota: { hex: '#EB0A1E', rgb: '235, 10, 30' },
    honda: { hex: '#E40521', rgb: '228, 5, 33' },
    ford: { hex: '#003478', rgb: '0, 52, 120' },
    chevrolet: { hex: '#D4AF37', rgb: '212, 175, 55' },
    hyundai: { hex: '#002C5F', rgb: '0, 44, 95' },
    kia: { hex: '#05141F', rgb: '5, 20, 31' },
    nissan: { hex: '#C3002F', rgb: '195, 0, 47' },
    fiat: { hex: '#9A0F21', rgb: '154, 15, 33' },
    jeep: { hex: '#3D5C3D', rgb: '61, 92, 61' },
    renault: { hex: '#FFCC00', rgb: '255, 204, 0' },
    peugeot: { hex: '#003DA5', rgb: '0, 61, 165' },
    citroen: { hex: '#AC1926', rgb: '172, 25, 38' },
    ferrari: { hex: '#DC0000', rgb: '220, 0, 0' },
    lamborghini: { hex: '#DDB321', rgb: '221, 179, 33' },
    default: { hex: '#6B7280', rgb: '107, 114, 128' },
  };
  const key = brand?.toLowerCase().replace(/\s+/g, '') || 'default';
  return brandColors[key] || brandColors.default;
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES (copiados de budget.styles.ts)
// ═══════════════════════════════════════════════════════════════════════════
// Função para gerar estilos do shell com cores dinâmicas da marca
const getShellStyles = (accentHex, accentRgb, hasBrand = false) => {
  // Cores base que mudam com a marca
  const baseBackground = hasBrand 
    ? `linear-gradient(135deg, rgba(${accentRgb}, 0.15) 0%, #08080A 30%, #08080A 70%, rgba(${accentRgb}, 0.08) 100%)`
    : colors.base.primary;
  
  return {
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
      background: hasBrand 
        ? `radial-gradient(ellipse at center, rgba(${accentRgb}, 0.1) 0%, rgba(0, 0, 0, 0.9) 70%)`
        : 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      transition: 'background 0.6s ease',
    },
    container: {
      position: 'relative',
      width: '100%',
      maxWidth: '960px',
      maxHeight: '90vh',
      background: baseBackground,
      borderRadius: radius.xl,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      // Borda com cor da marca
      border: hasBrand ? `1px solid rgba(${accentRgb}, 0.3)` : `1px solid ${colors.border.subtle}`,
      boxShadow: hasBrand 
        ? `0 0 0 1px rgba(${accentRgb}, 0.2), 0 0 80px rgba(${accentRgb}, 0.25), 0 0 120px rgba(${accentRgb}, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.6)`
        : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.6s ease',
    },
    vignette: {
      position: 'absolute',
      inset: 0,
      background: hasBrand
        ? `radial-gradient(ellipse at top left, rgba(${accentRgb}, 0.2) 0%, transparent 40%), radial-gradient(ellipse at bottom right, rgba(${accentRgb}, 0.1) 0%, transparent 40%), radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)`
        : 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
      pointerEvents: 'none',
      zIndex: 0,
      transition: 'background 0.6s ease',
    },
    // Linha de brilho no topo com cor da marca
    topGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: hasBrand ? '2px' : '1px',
      background: hasBrand
        ? `linear-gradient(90deg, transparent 0%, ${accentHex} 30%, ${accentHex} 70%, transparent 100%)`
        : 'transparent',
      zIndex: 10,
      boxShadow: hasBrand ? `0 0 20px rgba(${accentRgb}, 0.5), 0 0 40px rgba(${accentRgb}, 0.3)` : 'none',
      transition: 'all 0.6s ease',
    },
    // Borda lateral esquerda com cor da marca
    sideBorder: {
      position: 'absolute',
      top: '10%',
      left: 0,
      bottom: '10%',
      width: hasBrand ? '3px' : '0px',
      background: hasBrand 
        ? `linear-gradient(180deg, transparent 0%, ${accentHex} 20%, ${accentHex} 80%, transparent 100%)`
        : 'transparent',
      zIndex: 10,
      boxShadow: hasBrand ? `0 0 15px rgba(${accentRgb}, 0.4)` : 'none',
      borderRadius: '0 2px 2px 0',
      transition: 'all 0.6s ease',
    },
  };
};

// Estilos estáticos (fallback)
const shellStyles = getShellStyles('#6B7280', '107, 114, 128', false);

// Função para gerar estilos do header com cores dinâmicas
const getHeaderStyles = (accentHex, accentRgb, hasBrand = false) => ({
  container: {
    position: 'relative',
    padding: `${spacing.sm} ${spacing.xl}`,
    background: hasBrand 
      ? `linear-gradient(135deg, rgba(${accentRgb}, 0.12) 0%, ${colors.base.secondary} 50%, rgba(${accentRgb}, 0.05) 100%)`
      : colors.base.secondary,
    borderBottom: hasBrand 
      ? `1px solid rgba(${accentRgb}, 0.3)`
      : `1px solid ${colors.border.subtle}`,
    zIndex: 2,
    transition: 'all 0.5s ease',
  },
  brandLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: hasBrand ? '3px' : '2px',
    background: hasBrand 
      ? `linear-gradient(90deg, ${accentHex} 0%, rgba(${accentRgb}, 0.5) 50%, transparent 80%)`
      : `linear-gradient(90deg, ${accentHex} 0%, transparent 60%)`,
    opacity: hasBrand ? 1 : 0.6,
    boxShadow: hasBrand ? `0 0 10px rgba(${accentRgb}, 0.5)` : 'none',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  brandInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    margin: 0,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.text.muted,
    marginTop: spacing.xs,
  },
  badge: {
    ...typography.caption,
    padding: `${spacing.xs} ${spacing.sm}`,
    background: hasBrand ? `rgba(${accentRgb}, 0.3)` : `${accentHex}20`,
    color: '#FFFFFF',
    borderRadius: radius.full,
    fontWeight: 500,
    border: hasBrand ? `1px solid rgba(${accentRgb}, 0.5)` : 'none',
  },
  closeButton: {
    width: '40px',
    height: '40px',
    borderRadius: radius.full,
    background: hasBrand ? `rgba(${accentRgb}, 0.15)` : colors.surface.soft,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: hasBrand ? `rgba(${accentRgb}, 0.3)` : colors.border.subtle,
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: '150ms ease',
  },
});

// Estilos estáticos do header (fallback)
const headerStyles = getHeaderStyles('#6B7280', '107, 114, 128', false);

// Função para gerar estilos do content com cores dinâmicas
const getContentStyles = (accentRgb, hasBrand = false) => ({
  container: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: spacing.xl,
    background: hasBrand
      ? `linear-gradient(180deg, rgba(${accentRgb}, 0.05) 0%, ${colors.base.primary} 30%, ${colors.base.primary} 100%)`
      : `linear-gradient(180deg, ${colors.base.tertiary} 0%, ${colors.base.primary} 100%)`,
    position: 'relative',
    transition: 'background 0.5s ease',
  },
  innerVignette: {
    position: 'absolute',
    inset: 0,
    background: hasBrand
      ? `radial-gradient(ellipse at top, rgba(${accentRgb}, 0.08) 0%, transparent 40%), radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)`
      : 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)',
    pointerEvents: 'none',
    transition: 'background 0.5s ease',
  },
});

const contentStyles = getContentStyles('107, 114, 128', false);

const footerStyles = {
  container: {
    position: 'relative',
    padding: `${spacing.sm} ${spacing.xl}`,
    background: colors.base.secondary,
    borderTop: `1px solid ${colors.border.subtle}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  summary: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
};

const stepperStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    position: 'relative',
    cursor: 'pointer',
    transition: '150ms ease',
  },
  indicator: {
    width: '40px',
    height: '40px',
    borderRadius: radius.md,
    background: colors.surface.soft,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.subtle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.text.muted,
    transition: '150ms ease',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(0, 0, 0, 0.15)',
  },
  indicatorActive: (accentHex, accentRgb) => ({
    background: accentHex,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    color: '#FFFFFF',
    boxShadow: `0 4px 12px rgba(${accentRgb}, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
  }),
  indicatorComplete: {
    background: `${colors.state.success}20`,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.state.success,
    color: colors.state.success,
  },
  label: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    transition: '150ms ease',
  },
  connector: {
    position: 'absolute',
    top: '20px',
    left: '60%',
    width: '80%',
    height: '2px',
    background: colors.border.subtle,
    zIndex: -1,
  },
};

const sectionStyles = {
  container: {
    background: `linear-gradient(to bottom, ${colors.surface.medium} 0%, ${colors.surface.soft} 100%)`,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.subtle,
    borderRadius: radius.lg,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.subtitle,
    color: colors.text.primary,
    fontWeight: 600,
    margin: 0,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.caption,
    color: colors.text.muted,
    margin: 0,
  },
};

const inputStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  field: {
    width: '100%',
    padding: `${spacing.md} ${spacing.md}`,
    background: colors.surface.soft,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(0, 0, 0, 0.15)',
    color: colors.text.primary,
    ...typography.body,
    outline: 'none',
    transition: '150ms ease',
  },
};

const buttonStyles = {
  primary: (accentHex, accentRgb) => ({
    padding: `${spacing.md} ${spacing.xl}`,
    background: accentHex,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: radius.md,
    boxShadow: `0 4px 16px rgba(${accentRgb}, 0.35), 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    ...typography.body,
    fontWeight: 600,
    cursor: 'pointer',
    transition: '150ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  }),
  secondary: {
    padding: `${spacing.md} ${spacing.lg}`,
    background: colors.surface.soft,
    color: colors.text.secondary,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.default,
    borderRadius: radius.md,
    ...typography.body,
    fontWeight: 500,
    cursor: 'pointer',
    transition: '150ms ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════
const Icons = {
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" />
    </svg>
  ),
  Car: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 17h14v-5l-2-4H7l-2 4v5z" strokeLinejoin="round" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  ),
  Wrench: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
    </svg>
  ),
  Camera: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  Loader: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <path d="M12 2a10 10 0 019.17 6" strokeLinecap="round" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Fuel: ({ level = 50 }) => {
    const h = (14 * level) / 100;
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
        <rect x="4" y="6" width="12" height="14" rx="2" />
        {level > 0 && <rect x="6" y={6 + (14 - h)} width="8" height={h} rx="1" fill="currentColor" opacity="0.4" />}
        <path d="M16 10h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" strokeLinecap="round" />
      </svg>
    );
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ═══════════════════════════════════════════════════════════════════════════
const STEPS = [
  { id: 'client', label: 'Cliente', description: 'Dados do cliente', icon: Icons.User },
  { id: 'vehicle', label: 'Veículo', description: 'Placa e dados', icon: Icons.Car },
  { id: 'service', label: 'Serviço', description: 'O que fazer', icon: Icons.Wrench },
  { id: 'photos', label: 'Fotos', description: 'Registro visual', icon: Icons.Camera },
];

const FUEL_LEVELS = [
  { value: 'empty', label: 'Vazio', percent: 0 },
  { value: '1/4', label: '1/4', percent: 25 },
  { value: '1/2', label: '1/2', percent: 50 },
  { value: '3/4', label: '3/4', percent: 75 },
  { value: 'full', label: 'Cheio', percent: 100 },
];

const CONDITIONS = [
  { id: 'good', label: 'Bom estado', positive: true },
  { id: 'scratches', label: 'Arranhões' },
  { id: 'dents', label: 'Amassados' },
  { id: 'broken', label: 'Peças quebradas' },
  { id: 'missing', label: 'Itens faltando' },
  { id: 'dirty', label: 'Sujo' },
];

const SERVICES = [
  'Troca de Óleo', 'Alinhamento', 'Balanceamento', 'Freios',
  'Suspensão', 'Motor', 'Elétrica', 'Ar Condicionado',
  'Revisão Completa', 'Diagnóstico', 'Embreagem', 'Câmbio',
];

const PRIORITIES = [
  { value: 'low', label: 'Baixa', color: '#64748b' },
  { value: 'normal', label: 'Normal', color: '#3b82f6' },
  { value: 'high', label: 'Alta', color: '#f97316' },
  { value: 'urgent', label: 'Urgente', color: '#ef4444' },
];

const COLORED_LOGO_BRANDS = [
  'bmw', 'fiat', 'ferrari', 'lamborghini', 'land rover', 'land-rover', 
  'chevrolet', 'ford', 'renault', 'mini', 'dodge', 'ram', 'volvo', 
  'porsche', 'chery', 'jac', 'jac motors', 'byd', 'yamaha'
];

// ═══════════════════════════════════════════════════════════════════════════
// ANIMAÇÕES
// ═══════════════════════════════════════════════════════════════════════════
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 35, stiffness: 400 } },
  exit: { opacity: 0, scale: 0.96, y: 20, transition: { duration: 0.15 } },
};

const contentVariants = {
  enter: (direction) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: (direction) => ({ x: direction < 0 ? 40 : -40, opacity: 0, transition: { duration: 0.15 } }),
};

// ═══════════════════════════════════════════════════════════════════════════
// SCROLLBAR CSS
// ═══════════════════════════════════════════════════════════════════════════
const scrollbarCSS = `
  .checkin-modal-content::-webkit-scrollbar { width: 6px; }
  .checkin-modal-content::-webkit-scrollbar-track { background: transparent; }
  .checkin-modal-content::-webkit-scrollbar-thumb { background: ${colors.border.default}; border-radius: 3px; }
  .checkin-modal-content::-webkit-scrollbar-thumb:hover { background: ${colors.border.strong}; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;


// ═══════════════════════════════════════════════════════════════════════════
// STEPPER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const CheckinStepper = ({ currentStep, onStepClick, isStepValid, brand }) => {
  const accent = getBrandAccent(brand);
  
  return (
    <div style={stepperStyles.container}>
      {STEPS.map((step, idx) => {
        const isActive = idx === currentStep;
        const isComplete = idx < currentStep;
        const isClickable = idx <= currentStep || (idx === currentStep + 1 && isStepValid(currentStep));
        const Icon = step.icon;
        
        const indicatorStyle = {
          ...stepperStyles.indicator,
          ...(isActive ? stepperStyles.indicatorActive(accent.hex, accent.rgb) : {}),
          ...(isComplete ? stepperStyles.indicatorComplete : {}),
        };
        
        const labelStyle = {
          ...stepperStyles.label,
          ...(isActive ? { color: colors.text.primary, fontWeight: 500 } : {}),
          ...(isComplete ? { color: colors.state.success } : {}),
        };
        
        return (
          <div
            key={step.id}
            style={{ ...stepperStyles.step, opacity: isClickable ? 1 : 0.4, cursor: isClickable ? 'pointer' : 'not-allowed' }}
            onClick={() => isClickable && onStepClick(idx)}
          >
            {idx < STEPS.length - 1 && (
              <div style={{ ...stepperStyles.connector, ...(isComplete ? { background: accent.hex } : {}) }} />
            )}
            <div style={indicatorStyle}>
              {isComplete ? <Icons.Check /> : <Icon />}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={labelStyle}>{step.label}</div>
              <div style={{ ...stepperStyles.label, fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>{step.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const CheckinHeader = ({ plate, brand, model, year, currentStep, onStepClick, isStepValid, onClose }) => {
  const accent = getBrandAccent(brand);
  const effectiveBrand = getEffectiveBrand(brand || '', model || '');
  const logoUrl = getBrandLogoUrl(effectiveBrand, model || '');
  const shouldApplyFilter = !COLORED_LOGO_BRANDS.includes(effectiveBrand?.toLowerCase() || '');
  const hasBrand = !!effectiveBrand && effectiveBrand.toLowerCase() !== 'default';
  
  // Estilos dinâmicos do header
  const dynamicHeaderStyles = getHeaderStyles(accent.hex, accent.rgb, hasBrand);
  
  return (
    <header style={dynamicHeaderStyles.container}>
      <div style={dynamicHeaderStyles.brandLine} />
      
      <div style={dynamicHeaderStyles.titleRow}>
        <div style={dynamicHeaderStyles.brandInfo}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={effectiveBrand || 'Marca'}
              style={{
                height: '40px',
                width: 'auto',
                maxWidth: '120px',
                objectFit: 'contain',
                filter: shouldApplyFilter ? 'brightness(0) invert(1)' : 'none',
              }}
            />
          ) : (
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              TORQ
            </div>
          )}
          
          <div style={{ 
            width: '1px', 
            height: '36px', 
            background: hasBrand ? `rgba(${accent.rgb}, 0.4)` : 'rgba(255, 255, 255, 0.12)', 
            margin: '0 8px',
            transition: 'background 0.5s ease',
          }} />
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {plate ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 14px',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)',
                  borderRadius: '6px',
                  border: '2px solid #1a1a1a',
                  boxShadow: hasBrand 
                    ? `0 2px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(${accent.rgb}, 0.3)`
                    : '0 2px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'box-shadow 0.5s ease',
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
                <h1 style={dynamicHeaderStyles.title}>Novo Check-in</h1>
              )}
              <span style={dynamicHeaderStyles.badge}>Novo</span>
            </div>
            <p style={dynamicHeaderStyles.subtitle}>
              {model ? `${brand || ''} ${model}${year ? ` • ${year}` : ''}`.trim() : 'Sistema de check-in TORQ'}
            </p>
          </div>
        </div>
        
        <button onClick={onClose} style={dynamicHeaderStyles.closeButton} aria-label="Fechar">
          <Icons.Close />
        </button>
      </div>
      
      <CheckinStepper currentStep={currentStep} onStepClick={onStepClick} isStepValid={isStepValid} brand={brand} />
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const CheckinFooter = ({ currentStep, canProceed, isLoading, brand, onPrev, onNext, onSubmit }) => {
  const accent = getBrandAccent(brand);
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;
  
  const primaryStyle = {
    ...buttonStyles.primary(accent.hex, accent.rgb),
    opacity: canProceed && !isLoading ? 1 : 0.5,
    cursor: canProceed && !isLoading ? 'pointer' : 'not-allowed',
  };
  
  return (
    <footer style={footerStyles.container}>
      <div style={footerStyles.summary}>
        <span style={{ ...typography.caption, color: colors.text.muted }}>
          Passo {currentStep + 1} de {STEPS.length}
        </span>
        <span style={{ ...typography.subtitle, color: colors.text.primary }}>
          {STEPS[currentStep].label}
        </span>
      </div>
      
      <div style={footerStyles.actions}>
        {!isFirstStep && (
          <button onClick={onPrev} style={buttonStyles.secondary} disabled={isLoading}>
            <Icons.ChevronLeft /> Voltar
          </button>
        )}
        
        <button
          onClick={isLastStep ? onSubmit : onNext}
          style={primaryStyle}
          disabled={!canProceed || isLoading}
        >
          {isLoading ? (
            <><Icons.Loader /> Salvando...</>
          ) : isLastStep ? (
            <><Icons.Check /> Finalizar Check-in</>
          ) : (
            <>Continuar <Icons.ChevronRight /></>
          )}
        </button>
      </div>
    </footer>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: CLIENTE
// ═══════════════════════════════════════════════════════════════════════════
const StepCliente = ({ form, updateForm, clients, accent, isLoadingClients }) => {
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const filteredClients = useMemo(() => {
    if (!search || search.length < 2) return [];
    if (!clients || clients.length === 0) return [];
    
    const term = search.toLowerCase().trim();
    
    // Busca mais abrangente
    return clients.filter(c => {
      const name = (c.name || '').toLowerCase();
      const phone = (c.phone || '').replace(/\D/g, ''); // Remove non-digits
      const searchPhone = term.replace(/\D/g, '');
      const email = (c.email || '').toLowerCase();
      const cpf = (c.cpf || '').replace(/\D/g, '');
      const cnpj = (c.cnpj || '').replace(/\D/g, '');
      
      return name.includes(term) || 
             (searchPhone && phone.includes(searchPhone)) ||
             email.includes(term) ||
             (cpf && cpf.includes(term.replace(/\D/g, ''))) ||
             (cnpj && cnpj.includes(term.replace(/\D/g, '')));
    }).slice(0, 8); // Mostrar até 8 resultados
  }, [search, clients]);
  
  const selectClient = (client) => {
    updateForm('clientId', client.id || client.firestoreId);
    updateForm('clientName', client.name || '');
    updateForm('clientPhone', client.phone || '');
    updateForm('clientEmail', client.email || '');
    setSearch('');
    setIsFocused(false);
  };
  
  const showDropdown = isFocused && search.length >= 2;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <div style={sectionStyles.container}>
        <h3 style={sectionStyles.title}>Buscar Cliente</h3>
        <p style={sectionStyles.description}>
          Busque um cliente existente ou preencha os dados manualmente
          {clients.length > 0 && (
            <span style={{ marginLeft: spacing.sm, color: colors.state.success }}>
              • {clients.length} cliente(s) disponível(is)
            </span>
          )}
        </p>
        
        <div style={{ position: 'relative', marginTop: spacing.md }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: spacing.md, top: '50%', transform: 'translateY(-50%)', color: colors.text.muted }}>
              {isLoadingClients ? <Icons.Loader /> : <Icons.Search />}
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder={isLoadingClients ? "Carregando clientes..." : "Digite nome, telefone, email ou CPF/CNPJ..."}
              disabled={isLoadingClients}
              style={{ 
                ...inputStyles.field, 
                paddingLeft: '48px',
                opacity: isLoadingClients ? 0.7 : 1,
              }}
            />
          </div>
          
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: spacing.sm,
              background: colors.base.elevated,
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: colors.border.default,
              borderRadius: radius.lg,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              zIndex: 50,
              maxHeight: '320px',
              overflowY: 'auto',
            }}>
              {filteredClients.length > 0 ? (
                filteredClients.map((client, index) => (
                  <button
                    key={client.id || client.firestoreId || index}
                    onClick={() => selectClient(client)}
                    style={{
                      width: '100%',
                      padding: `${spacing.md} ${spacing.lg}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.md,
                      background: 'transparent',
                      border: 'none',
                      borderBottomWidth: '1px',
                      borderBottomStyle: 'solid',
                      borderBottomColor: colors.border.subtle,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: '150ms ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = colors.surface.soft}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: radius.full,
                      background: `${accent.hex}30`,
                      color: accent.hex,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '16px',
                      flexShrink: 0,
                    }}>
                      {client.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...typography.body, color: colors.text.primary, fontWeight: 500 }}>
                        {client.name || 'Sem nome'}
                      </div>
                      <div style={{ ...typography.caption, color: colors.text.muted, display: 'flex', gap: spacing.md }}>
                        {client.phone && <span>{client.phone}</span>}
                        {client.email && <span>{client.email}</span>}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div style={{ 
                  padding: spacing.lg, 
                  textAlign: 'center',
                  color: colors.text.muted,
                  ...typography.body,
                }}>
                  Nenhum cliente encontrado para "{search}"
                </div>
              )}
            </div>
          )}
        </div>
        
        {form.clientId && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            marginTop: spacing.md,
            padding: spacing.sm,
            background: `${colors.state.success}15`,
            borderRadius: radius.sm,
            color: colors.state.success,
            ...typography.caption,
          }}>
            <Icons.Check /> Cliente selecionado: {form.clientName}
          </div>
        )}
      </div>
      
      <div style={sectionStyles.container}>
        <h3 style={sectionStyles.title}>Dados do Cliente</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginTop: spacing.md }}>
          <div style={{ ...inputStyles.wrapper, gridColumn: 'span 2' }}>
            <label style={inputStyles.label}>Nome Completo <span style={{ color: colors.state.error }}>*</span></label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => updateForm('clientName', e.target.value)}
              placeholder="Nome do cliente"
              style={inputStyles.field}
            />
          </div>
          <div style={inputStyles.wrapper}>
            <label style={inputStyles.label}>Telefone</label>
            <input
              type="tel"
              value={form.clientPhone}
              onChange={(e) => updateForm('clientPhone', e.target.value)}
              placeholder="(00) 00000-0000"
              style={inputStyles.field}
            />
          </div>
          <div style={inputStyles.wrapper}>
            <label style={inputStyles.label}>Email</label>
            <input
              type="email"
              value={form.clientEmail}
              onChange={(e) => updateForm('clientEmail', e.target.value)}
              placeholder="email@exemplo.com"
              style={inputStyles.field}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: VEÍCULO
// ═══════════════════════════════════════════════════════════════════════════
const StepVeiculo = ({ form, updateForm, onSearchPlate, searchingPlate, vehicleFound, accent }) => {
  // Compute section style with conditional border
  const sectionWithBorder = {
    ...sectionStyles.container,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: vehicleFound ? colors.state.success : colors.border.subtle,
    boxShadow: vehicleFound 
      ? `0 0 0 1px ${colors.state.success}40, ${sectionStyles.container.boxShadow}` 
      : sectionStyles.container.boxShadow,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <div style={sectionWithBorder}>
        <h3 style={sectionStyles.title}>Consulta de Placa</h3>
        <p style={sectionStyles.description}>Digite a placa para buscar os dados do veículo automaticamente</p>
        
        <div style={{ display: 'flex', gap: spacing.md, marginTop: spacing.md }}>
          <input
            type="text"
            value={form.plate}
            onChange={(e) => updateForm('plate', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            placeholder="ABC1D23"
            maxLength={7}
            style={{
              ...inputStyles.field,
              flex: 1,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '18px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          />
          <button
            onClick={onSearchPlate}
            disabled={form.plate.length < 7 || searchingPlate}
            style={{
              ...buttonStyles.primary(accent.hex, accent.rgb),
              minWidth: '120px',
              opacity: form.plate.length < 7 || searchingPlate ? 0.5 : 1,
            }}
          >
            {searchingPlate ? <Icons.Loader /> : <Icons.Search />}
            Buscar
          </button>
        </div>
        
        {vehicleFound && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            marginTop: spacing.md,
            padding: spacing.sm,
            background: `${colors.state.success}15`,
            borderRadius: radius.sm,
            color: colors.state.success,
            ...typography.caption,
          }}>
            <Icons.Check /> Veículo encontrado na base de dados
          </div>
        )}
      </div>
      
      <div style={sectionStyles.container}>
        <h3 style={sectionStyles.title}>Dados do Veículo</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md, marginTop: spacing.md }}>
          <div style={{ ...inputStyles.wrapper, gridColumn: 'span 2' }}>
            <label style={inputStyles.label}>Marca</label>
            <input type="text" value={form.brand} onChange={(e) => updateForm('brand', e.target.value)} placeholder="Ex: Toyota" style={inputStyles.field} />
          </div>
          <div style={{ ...inputStyles.wrapper, gridColumn: 'span 2' }}>
            <label style={inputStyles.label}>Modelo</label>
            <input type="text" value={form.model} onChange={(e) => updateForm('model', e.target.value)} placeholder="Ex: Corolla" style={inputStyles.field} />
          </div>
          <div style={inputStyles.wrapper}>
            <label style={inputStyles.label}>Ano</label>
            <input type="text" value={form.year} onChange={(e) => updateForm('year', e.target.value)} placeholder="2024" maxLength={4} style={inputStyles.field} />
          </div>
          <div style={inputStyles.wrapper}>
            <label style={inputStyles.label}>Cor</label>
            <input type="text" value={form.color} onChange={(e) => updateForm('color', e.target.value)} placeholder="Prata" style={inputStyles.field} />
          </div>
          <div style={{ ...inputStyles.wrapper, gridColumn: 'span 2' }}>
            <label style={inputStyles.label}>Quilometragem</label>
            <input type="text" value={form.km} onChange={(e) => updateForm('km', e.target.value.replace(/\D/g, ''))} placeholder="Ex: 45000" style={inputStyles.field} />
          </div>
        </div>
      </div>
      
      <div style={sectionStyles.container}>
        <h3 style={sectionStyles.title}>Nível de Combustível</h3>
        
        <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.md }}>
          {FUEL_LEVELS.map((level) => {
            const isSelected = form.fuel === level.value;
            return (
              <button
                key={level.value}
                onClick={() => updateForm('fuel', level.value)}
                style={{
                  flex: 1,
                  padding: spacing.md,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing.xs,
                  background: isSelected ? accent.hex : colors.surface.soft,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isSelected ? accent.hex : colors.border.subtle,
                  borderRadius: radius.md,
                  color: isSelected ? '#FFFFFF' : colors.text.secondary,
                  cursor: 'pointer',
                  transition: '150ms ease',
                  boxShadow: isSelected ? `0 4px 12px rgba(${accent.rgb}, 0.3)` : 'none',
                }}
              >
                <Icons.Fuel level={level.percent} />
                <span style={{ fontSize: '12px', fontWeight: isSelected ? 600 : 500 }}>{level.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: SERVIÇO
// ═══════════════════════════════════════════════════════════════════════════
const StepServico = ({ form, toggleService, toggleCondition, updateForm, accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
    <div style={sectionStyles.container}>
      <h3 style={sectionStyles.title}>Serviços Solicitados <span style={{ color: colors.state.error }}>*</span></h3>
      <p style={sectionStyles.description}>Selecione os serviços que serão realizados</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.sm, marginTop: spacing.md }}>
        {SERVICES.map((service) => {
          const isSelected = form.services.includes(service);
          return (
            <button
              key={service}
              onClick={() => toggleService(service)}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                background: isSelected ? accent.hex : colors.surface.soft,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected ? accent.hex : colors.border.subtle,
                borderRadius: radius.md,
                color: isSelected ? '#FFFFFF' : colors.text.secondary,
                cursor: 'pointer',
                transition: '150ms ease',
                ...typography.caption,
                fontWeight: isSelected ? 600 : 500,
                boxShadow: isSelected ? `0 2px 8px rgba(${accent.rgb}, 0.3)` : 'none',
              }}
            >
              {isSelected && <Icons.Check />}
              {service}
            </button>
          );
        })}
      </div>
      
      {form.services.length === 0 && (
        <p style={{ ...typography.caption, color: colors.state.warning, marginTop: spacing.sm }}>
          Selecione pelo menos um serviço
        </p>
      )}
    </div>
    
    <div style={sectionStyles.container}>
      <h3 style={sectionStyles.title}>Condições do Veículo</h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md }}>
        {CONDITIONS.map((condition) => {
          const isSelected = form.conditions.includes(condition.id);
          const conditionColor = condition.positive ? colors.state.success : colors.state.warning;
          return (
            <button
              key={condition.id}
              onClick={() => toggleCondition(condition.id)}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                background: isSelected ? conditionColor : colors.surface.soft,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected ? conditionColor : colors.border.subtle,
                borderRadius: radius.md,
                color: isSelected ? '#FFFFFF' : colors.text.secondary,
                cursor: 'pointer',
                transition: '150ms ease',
                ...typography.caption,
                fontWeight: isSelected ? 600 : 500,
                boxShadow: isSelected ? `0 2px 8px ${conditionColor}40` : 'none',
              }}
            >
              {condition.label}
            </button>
          );
        })}
      </div>
    </div>
    
    <div style={sectionStyles.container}>
      <h3 style={sectionStyles.title}>Prioridade</h3>
      
      <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.md }}>
        {PRIORITIES.map((priority) => {
          const isSelected = form.priority === priority.value;
          return (
            <button
              key={priority.value}
              onClick={() => updateForm('priority', priority.value)}
              style={{
                flex: 1,
                padding: spacing.md,
                background: isSelected ? priority.color : colors.surface.soft,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isSelected ? priority.color : colors.border.subtle,
                borderRadius: radius.md,
                color: isSelected ? '#FFFFFF' : colors.text.secondary,
                cursor: 'pointer',
                transition: '150ms ease',
                ...typography.body,
                fontWeight: isSelected ? 600 : 500,
                boxShadow: isSelected ? `0 4px 12px ${priority.color}40` : 'none',
              }}
            >
              {priority.label}
            </button>
          );
        })}
      </div>
    </div>
    
    <div style={sectionStyles.container}>
      <h3 style={sectionStyles.title}>Observações</h3>
      
      <textarea
        value={form.notes}
        onChange={(e) => updateForm('notes', e.target.value)}
        placeholder="Observações adicionais sobre o veículo ou serviço..."
        rows={3}
        style={{
          ...inputStyles.field,
          marginTop: spacing.md,
          resize: 'vertical',
          minHeight: '80px',
        }}
      />
    </div>
  </div>
);


// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: FOTOS
// ═══════════════════════════════════════════════════════════════════════════
const StepFotos = ({ form, updateForm, accent }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map(file => ({ file, name: file.name, preview: URL.createObjectURL(file) }));
    updateForm('photos', [...form.photos, ...newPhotos]);
  };

  const removePhoto = (index) => {
    const photo = form.photos[index];
    if (photo.preview) URL.revokeObjectURL(photo.preview);
    updateForm('photos', form.photos.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
      <div style={sectionStyles.container}>
        <h3 style={sectionStyles.title}>Fotos do Veículo</h3>
        <p style={sectionStyles.description}>Registre o estado atual do veículo</p>
        
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
          marginTop: spacing.md,
          background: colors.surface.soft,
          borderWidth: '2px',
          borderStyle: 'dashed',
          borderColor: colors.border.default,
          borderRadius: radius.lg,
          cursor: 'pointer',
          transition: '150ms ease',
        }}>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
          <div style={{ color: accent.hex, marginBottom: spacing.sm }}><Icons.Camera /></div>
          <p style={{ ...typography.body, color: colors.text.primary, margin: 0 }}>Clique para adicionar fotos</p>
          <span style={{ ...typography.caption, color: colors.text.muted }}>ou arraste e solte aqui</span>
        </label>
        
        {form.photos.length > 0 && (
          <div style={{ marginTop: spacing.lg }}>
            <label style={inputStyles.label}>Fotos Adicionadas ({form.photos.length})</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.sm, marginTop: spacing.sm }}>
              {form.photos.map((photo, index) => (
                <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: radius.md, overflow: 'hidden' }}>
                  <img src={photo.preview} alt={`Foto ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => removePhoto(index)}
                    style={{
                      position: 'absolute',
                      top: spacing.xs,
                      right: spacing.xs,
                      width: '24px',
                      height: '24px',
                      borderRadius: radius.full,
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icons.Close />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div style={sectionStyles.container}>
        <h3 style={sectionStyles.title}>Resumo do Check-in</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginTop: spacing.md }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${spacing.sm} 0`, borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: colors.border.subtle }}>
            <span style={{ ...typography.body, color: colors.text.muted }}>Cliente</span>
            <span style={{ ...typography.body, color: colors.text.primary, fontWeight: 500 }}>{form.clientName || '-'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${spacing.sm} 0`, borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: colors.border.subtle }}>
            <span style={{ ...typography.body, color: colors.text.muted }}>Veículo</span>
            <span style={{ ...typography.body, color: colors.text.primary, fontWeight: 500 }}>
              {form.plate ? `${form.plate} - ${form.brand} ${form.model}` : '-'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${spacing.sm} 0`, borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: colors.border.subtle }}>
            <span style={{ ...typography.body, color: colors.text.muted }}>Serviços</span>
            <span style={{ ...typography.body, color: colors.text.primary, fontWeight: 500 }}>{form.services.length} selecionado(s)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${spacing.sm} 0` }}>
            <span style={{ ...typography.body, color: colors.text.muted }}>Fotos</span>
            <span style={{ ...typography.body, color: colors.text.primary, fontWeight: 500 }}>{form.photos.length} foto(s)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
const NovoCheckinModal = ({ isOpen, onClose, onSuccess }) => {
  const empresaContext = useEmpresa();
  const empresaId = empresaContext?.empresaId || null;
  const { clients, fetchClients, isLoading: clientsLoading } = useClientStore();
  
  // Form state
  const [form, setForm] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    plate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    km: '',
    fuel: '1/2',
    services: [],
    conditions: [],
    priority: 'normal',
    notes: '',
    photos: [],
  });
  
  // UI state
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [searchingPlate, setSearchingPlate] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Derived state
  const effectiveBrand = getEffectiveBrand(form.brand, form.model);
  const accent = getBrandAccent(effectiveBrand);
  
  // Fetch clients on mount - fetchClients uses sessionStorage empresaId internally
  useEffect(() => {
    if (isOpen) {
      console.log('[NovoCheckinModal] Modal opened, fetching clients...');
      console.log('[NovoCheckinModal] empresaId from context:', empresaId);
      console.log('[NovoCheckinModal] empresaId from sessionStorage:', sessionStorage.getItem('empresaId'));
      
      fetchClients().then((result) => {
        if (result?.success) {
          console.log('[NovoCheckinModal] Clients loaded successfully:', result.data?.length || 0);
        } else {
          console.warn('[NovoCheckinModal] Failed to load clients:', result?.error);
        }
      }).catch((err) => {
        console.error('[NovoCheckinModal] Error fetching clients:', err);
      });
    }
  }, [isOpen, fetchClients, empresaId]);
  
  // Log clients when they change
  useEffect(() => {
    console.log('[NovoCheckinModal] Clients state updated:', clients.length);
    if (clients.length > 0) {
      console.log('[NovoCheckinModal] Sample clients:', clients.slice(0, 3).map(c => ({ name: c.name, id: c.id })));
    }
  }, [clients]);
  
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Form helpers
  const updateForm = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const toggleService = useCallback((service) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  }, []);
  
  const toggleCondition = useCallback((condition) => {
    setForm(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  }, []);
  
  // Plate search
  const handleSearchPlate = useCallback(async () => {
    if (!isValidPlate(form.plate)) {
      toast.error('Placa inválida');
      return;
    }
    
    setSearchingPlate(true);
    try {
      console.log('[NovoCheckinModal] 🔍 Consultando placa:', form.plate);
      const result = await consultarPlaca(form.plate);
      console.log('[NovoCheckinModal] 📦 Resultado da consulta:', result);
      
      if (result && result.success && result.data) {
        const vehicleData = result.data;
        console.log('[NovoCheckinModal] ✅ Dados do veículo:', vehicleData);
        
        // Atualiza o formulário com os dados do veículo
        // A API retorna: { brand, model, year, color, ... }
        setForm(prev => ({
          ...prev,
          brand: vehicleData.brand || vehicleData.marca || prev.brand,
          model: vehicleData.model || vehicleData.modelo || prev.model,
          year: (vehicleData.year || vehicleData.ano)?.toString() || prev.year,
          color: vehicleData.color || vehicleData.cor || prev.color,
        }));
        setVehicleFound(true);
        toast.success(`Veículo encontrado: ${vehicleData.brand || vehicleData.marca} ${vehicleData.model || vehicleData.modelo}`);
      } else if (result && !result.success) {
        console.warn('[NovoCheckinModal] ⚠️ Consulta sem sucesso:', result.error);
        toast.error(result.error || 'Veículo não encontrado');
        setVehicleFound(false);
      } else {
        console.warn('[NovoCheckinModal] ⚠️ Resultado inesperado:', result);
        toast.error('Não foi possível consultar a placa');
        setVehicleFound(false);
      }
    } catch (error) {
      console.error('[NovoCheckinModal] ❌ Erro ao consultar placa:', error);
      toast.error('Erro ao consultar placa: ' + (error.message || 'Tente novamente'));
      setVehicleFound(false);
    } finally {
      setSearchingPlate(false);
    }
  }, [form.plate]);
  
  // Step validation
  const isStepValid = useCallback((step) => {
    switch (step) {
      case 0: return !!form.clientName.trim();
      case 1: return !!form.plate.trim();
      case 2: return form.services.length > 0;
      case 3: return true;
      default: return false;
    }
  }, [form]);
  
  const canProceed = isStepValid(currentStep);
  
  // Navigation
  const goToStep = useCallback((step) => {
    if (step < currentStep || (step === currentStep + 1 && isStepValid(currentStep))) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    }
  }, [currentStep, isStepValid]);
  
  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1 && canProceed) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, canProceed]);
  
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  // Submit
  const handleSubmit = useCallback(async () => {
    if (!canProceed) return;
    
    setIsLoading(true);
    try {
      const checkinData = {
        empresaId,
        clientId: form.clientId || null,
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        clientEmail: form.clientEmail,
        vehiclePlate: form.plate,
        vehicleBrand: form.brand,
        vehicleModel: form.model,
        vehicleYear: form.year,
        vehicleColor: form.color,
        vehicleKm: form.km,
        fuelLevel: form.fuel,
        services: form.services,
        conditions: form.conditions,
        priority: form.priority,
        notes: form.notes,
        photos: form.photos.map(p => p.file),
        status: 'waiting',
        createdAt: new Date(),
      };
      
      await createCheckin(checkinData);
      toast.success('Check-in realizado com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao criar check-in:', error);
      toast.error('Erro ao realizar check-in');
    } finally {
      setIsLoading(false);
    }
  }, [form, empresaId, canProceed, onSuccess, onClose]);
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepCliente form={form} updateForm={updateForm} clients={clients} accent={accent} isLoadingClients={clientsLoading} />;
      case 1:
        return <StepVeiculo form={form} updateForm={updateForm} onSearchPlate={handleSearchPlate} searchingPlate={searchingPlate} vehicleFound={vehicleFound} accent={accent} />;
      case 2:
        return <StepServico form={form} toggleService={toggleService} toggleCondition={toggleCondition} updateForm={updateForm} accent={accent} />;
      case 3:
        return <StepFotos form={form} updateForm={updateForm} accent={accent} />;
      default:
        return null;
    }
  };
  
  if (!isOpen) return null;
  
  // Verifica se tem uma marca identificada
  const hasBrand = !!effectiveBrand && effectiveBrand.toLowerCase() !== 'default';
  
  // Gera estilos dinâmicos baseados na marca
  const dynamicShellStyles = getShellStyles(accent.hex, accent.rgb, hasBrand);
  
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="checkin-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={dynamicShellStyles.overlay}
        onClick={onClose}
      >
        <style>{scrollbarCSS}</style>
        
        {/* Brand glow effect no fundo */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '600px',
            background: hasBrand 
              ? `radial-gradient(ellipse, rgba(${accent.rgb}, 0.2) 0%, transparent 60%)`
              : 'transparent',
            pointerEvents: 'none',
            transition: 'background 0.6s ease',
          }}
        />
        
        <motion.div
          key="checkin-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={dynamicShellStyles.container}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Linha de brilho no topo */}
          <div style={dynamicShellStyles.topGlow} />
          
          {/* Borda lateral esquerda */}
          <div style={dynamicShellStyles.sideBorder} />
          
          <div style={dynamicShellStyles.vignette} />
          
          <CheckinHeader
            plate={form.plate}
            brand={effectiveBrand}
            model={form.model}
            year={form.year}
            currentStep={currentStep}
            onStepClick={goToStep}
            isStepValid={isStepValid}
            onClose={onClose}
          />
          
          {/* Content area com estilos dinâmicos */}
          {(() => {
            const dynamicContentStyles = getContentStyles(accent.rgb, hasBrand);
            return (
              <div className="checkin-modal-content" style={dynamicContentStyles.container}>
                <div style={dynamicContentStyles.innerVignette} />
                
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={contentVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })()}
          
          <CheckinFooter
            currentStep={currentStep}
            canProceed={canProceed}
            isLoading={isLoading}
            brand={effectiveBrand}
            onPrev={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default NovoCheckinModal;
