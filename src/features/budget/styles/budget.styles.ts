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
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(8px)',
  },
  
  container: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '960px',
    maxHeight: '90vh',
    background: colors.base.primary,
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
    padding: `${spacing.sm} ${spacing.xl}`,
    background: colors.base.secondary,
    borderBottom: `1px solid ${colors.border.subtle}`,
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
  
  badge: (accentHex: string) => ({
    ...typography.caption,
    padding: `${spacing.xs} ${spacing.sm}`,
    background: `${accentHex}20`,
    color: '#FFFFFF',
    borderRadius: radius.full,
    fontWeight: 500,
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
    background: `linear-gradient(to bottom, ${colors.surface.medium} 0%, ${colors.surface.soft} 100%)`,
    border: `1px solid ${colors.border.subtle}`,
    borderRadius: radius.lg,
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
    color: colors.text.muted,
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
    flexDirection: 'column' as const,
    gap: spacing.xs,
  },
  
  totalLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  
  totalValue: {
    ...typography.title,
    color: colors.text.primary,
    fontSize: '20px',
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
    padding: `${spacing.md} ${spacing.xl}`,
    background: accentHex,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: radius.md,
    boxShadow: shadows.cta(accentRgb),
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
    transform: 'translateY(-2px)',
    boxShadow: `
      0 6px 24px rgba(${accentRgb}, 0.45),
      0 4px 12px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.25)
    `,
  }),
  
  // Botão secundário
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
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative' as const,
  },
  
  step: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    position: 'relative' as const,
    cursor: 'pointer',
    transition: transitions.fast,
  },
  
  stepDisabled: {
    cursor: 'not-allowed',
    opacity: 0.4,
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
    transition: transitions.fast,
    boxShadow: shadows.interactive,
  },
  
  indicatorActive: (accentHex: string, accentRgb: string) => ({
    background: accentHex,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    color: '#FFFFFF',
    boxShadow: `
      0 4px 12px rgba(${accentRgb}, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
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
    textAlign: 'center' as const,
    transition: transitions.fast,
  },
  
  labelActive: {
    color: colors.text.primary,
    fontWeight: 500,
  },
  
  connector: {
    position: 'absolute' as const,
    top: '20px',
    left: '60%',
    width: '80%',
    height: '2px',
    background: colors.border.subtle,
    zIndex: -1,
  },
  
  connectorComplete: (accentHex: string) => ({
    background: accentHex,
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
    background: `linear-gradient(180deg, ${colors.base.tertiary} 0%, ${colors.base.primary} 100%)`,
    position: 'relative' as const,
  },
  
  innerVignette: {
    position: 'absolute' as const,
    inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)',
    pointerEvents: 'none' as const,
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
