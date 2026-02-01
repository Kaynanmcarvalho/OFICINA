/**
 * TORQ Budget Styles
 * Estilos computados baseados nos tokens
 * 
 * Cada estilo pertence a um plano Z específico:
 * - Z0: Plano Base
 * - Z1: Plano Estrutural
 * - Z2: Plano Interativo
 */

import { colors, shadows, spacing, radius, typography, transitions, getBrandAccent } from './budget.tokens';

// ============================================================================
// Z0 - PLANO BASE (Shell/Overlay)
// ============================================================================
export const shellStyles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
  },
  
  container: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '960px',
    maxHeight: '90vh',
    // TEMA ADAPTATIVO: branco no light, preto no dark
    background: 'var(--bg-modal, #FFFFFF)',
    borderRadius: radius.xl,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  
  vignette: {
    position: 'absolute' as const,
    inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
    pointerEvents: 'none' as const,
    zIndex: 0,
  },
};

// ============================================================================
// Z1 - PLANO ESTRUTURAL (Header, Sections, Footer)
// ============================================================================
export const headerStyles = {
  container: {
    position: 'relative' as const,
    padding: `${spacing.lg} ${spacing.xl}`,
    paddingBottom: spacing.lg,
    minHeight: '140px',
    background: colors.base.secondary,
    borderBottom: `1px solid ${colors.border.default}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    zIndex: 2,
  },
  
  brandLine: (accentHex: string) => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, ${accentHex} 0%, transparent 60%)`,
    opacity: 0.6,
  }),
  
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
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
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  
  subtitle: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontSize: '13px',
    fontWeight: 500,
  },
  
  badge: (accentHex: string) => ({
    ...typography.caption,
    padding: `${spacing.xs} ${spacing.sm}`,
    background: accentHex,
    color: '#FFFFFF',
    borderRadius: radius.full,
    fontWeight: 600,
    fontSize: '11px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
    boxShadow: `0 2px 8px ${accentHex}40`,
  }),
  
  closeButton: {
    width: '40px',
    height: '40px',
    borderRadius: radius.full,
    background: colors.surface.soft,
    border: `1px solid ${colors.border.subtle}`,
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: transitions.fast,
  },
};

export const sectionStyles = {
  container: {
    background: colors.surface.soft,
    border: `1px solid ${colors.border.subtle}`,
    borderRadius: radius.md,
    boxShadow: shadows.section,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  
  header: {
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
    color: 'var(--text-secondary, #6B7280)',
    margin: 0,
  },
  
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.md,
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing.md,
  },
};

export const footerStyles = {
  container: {
    position: 'relative' as const,
    padding: `${spacing.md} ${spacing.xl}`,
    minHeight: '80px',
    background: colors.base.secondary,
    borderTop: `1px solid ${colors.border.default}`,
    boxShadow: '0 -1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  
  summary: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.lg,
  },
  
  totalLabel: {
    ...typography.caption,
    color: colors.text.muted,
    fontWeight: 500,
    opacity: 0.7,
  },
  
  totalValue: {
    ...typography.title,
    color: colors.text.primary,
    fontSize: '22px',
    fontWeight: 700,
  },
  
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
};

// ============================================================================
// Z2 - PLANO INTERATIVO (Inputs, Buttons, Stepper)
// ============================================================================
export const inputStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.sm,
  },
  
  label: {
    ...typography.label,
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  required: {
    color: colors.state.error,
  },
  
  field: {
    width: '100%',
    padding: `${spacing.md} ${spacing.md}`,
    background: colors.surface.soft,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    boxShadow: shadows.interactive,
    color: colors.text.primary,
    ...typography.body,
    outline: 'none',
    transition: transitions.fast,
  },
  
  fieldFocus: (accentRgb: string) => ({
    background: colors.surface.medium,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: `rgba(${accentRgb}, 0.3)`,
    boxShadow: shadows.focus(accentRgb),
  }),
  
  fieldError: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.state.error,
    boxShadow: `0 0 0 3px rgba(255, 69, 58, 0.15)`,
  },
  
  placeholder: {
    color: colors.text.disabled,
  },
  
  error: {
    ...typography.caption,
    color: colors.state.error,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  icon: {
    position: 'absolute' as const,
    left: spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.text.muted,
    pointerEvents: 'none' as const,
  },
};

export const buttonStyles = {
  // Botão primário (CTA)
  primary: (accentHex: string, accentRgb: string) => ({
    height: '44px',
    padding: `0 ${spacing.xl}`,
    background: accentHex,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: radius.sm,
    boxShadow: `0 2px 8px rgba(${accentRgb}, 0.3)`,
    ...typography.body,
    fontWeight: 600,
    cursor: 'pointer',
    transition: transitions.fast,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  }),
  
  primaryHover: (accentRgb: string) => ({
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 16px rgba(${accentRgb}, 0.4)`,
  }),
  
  // Botão secundário
  secondary: {
    height: '44px',
    padding: `0 ${spacing.xl}`,
    background: colors.surface.soft,
    color: colors.text.secondary,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.default,
    borderRadius: radius.sm,
    ...typography.body,
    fontWeight: 600,
    cursor: 'pointer',
    transition: transitions.fast,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  
  secondaryHover: {
    background: colors.surface.medium,
    color: colors.text.primary,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.strong,
  },
  
  // Botão ghost
  ghost: {
    padding: spacing.sm,
    background: 'transparent',
    color: colors.text.muted,
    border: 'none',
    borderRadius: radius.sm,
    cursor: 'pointer',
    transition: transitions.fast,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  ghostHover: {
    background: colors.surface.soft,
    color: colors.text.primary,
  },
};

export const stepperStyles = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative' as const,
    paddingTop: spacing.lg,
    gap: spacing.xs,
  },
  
  step: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    position: 'relative' as const,
    cursor: 'pointer',
    transition: transitions.fast,
    padding: spacing.sm,
  },
  
  stepDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  
  indicator: {
    width: '48px',
    height: '48px',
    borderRadius: radius.md,
    background: colors.surface.soft,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors.border.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.text.secondary,
    transition: transitions.fast,
    boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))',
  },
  
  indicatorActive: (accentHex: string, accentRgb: string) => ({
    width: '52px',
    height: '52px',
    background: accentHex,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: accentHex,
    color: '#FFFFFF',
    boxShadow: `0 2px 12px rgba(${accentRgb}, 0.25)`,
    transform: 'scale(1.0)',
  }),
  
  indicatorComplete: {
    background: colors.surface.medium,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: colors.state.success,
    color: colors.state.success,
    boxShadow: 'none',
  },
  
  indicatorFinal: {
    borderWidth: '2.5px',
    fontWeight: 700,
  },
  
  label: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center' as const,
    transition: transitions.fast,
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  
  labelActive: {
    color: colors.text.primary,
    fontWeight: 600,
    fontSize: '13px',
  },
  
  labelFinal: {
    fontWeight: 700,
  },
  
  connector: {
    position: 'absolute' as const,
    top: '24px',
    left: '60%',
    width: '80%',
    height: '2px',
    background: colors.border.default,
    opacity: 0.15,
    zIndex: -1,
  },
  
  connectorComplete: (accentHex: string) => ({
    height: '2px',
    background: accentHex,
    opacity: 0.4,
  }),
};

// ============================================================================
// CONTENT AREA
// ============================================================================
export const contentStyles = {
  container: {
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    padding: spacing.xl,
    background: colors.base.tertiary,
    position: 'relative' as const,
  },
};

// ============================================================================
// DROPDOWN
// ============================================================================
export const dropdownStyles = {
  container: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    marginTop: spacing.sm,
    background: colors.base.elevated,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radius.lg,
    boxShadow: shadows.dropdown,
    overflow: 'hidden',
    zIndex: 50,
  },
  
  item: {
    padding: `${spacing.md} ${spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    cursor: 'pointer',
    transition: transitions.fast,
    borderBottom: `1px solid ${colors.border.subtle}`,
  },
  
  itemHover: {
    background: colors.surface.soft,
  },
  
  itemText: {
    ...typography.body,
    color: colors.text.primary,
  },
  
  itemSubtext: {
    ...typography.caption,
    color: colors.text.muted,
  },
};

// ============================================================================
// ITEM LIST (produtos/serviços)
// ============================================================================
export const itemListStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.sm,
  },
  
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    background: colors.surface.soft,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.subtle,
    borderRadius: radius.md,
    transition: transitions.fast,
  },
  
  itemHover: {
    background: colors.surface.medium,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.border.default,
  },
  
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  
  itemName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: 500,
  },
  
  itemMeta: {
    ...typography.caption,
    color: colors.text.muted,
  },
  
  itemPrice: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: 600,
  },
  
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    background: colors.base.secondary,
    borderRadius: radius.sm,
    padding: spacing.xs,
  },
  
  quantityButton: {
    width: '28px',
    height: '28px',
    borderRadius: radius.sm,
    background: 'transparent',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: transitions.fast,
  },
  
  quantityValue: {
    ...typography.body,
    color: colors.text.primary,
    minWidth: '24px',
    textAlign: 'center' as const,
  },
};

// ============================================================================
// SCROLLBAR
// ============================================================================
export const scrollbarStyles = `
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${colors.border.default};
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.border.strong};
  }
`;
