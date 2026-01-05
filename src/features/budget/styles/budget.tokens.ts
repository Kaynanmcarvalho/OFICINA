/**
 * TORQ Budget Design Tokens
 * Sistema de design premium automotivo
 * 
 * PRINCÍPIO: "Tudo deve parecer um produto premium automotivo, não um formulário."
 * 
 * Z-AXIS (3 planos visuais):
 * - Z0: Plano Base (fundo)
 * - Z1: Plano Estrutural (seções)
 * - Z2: Plano Interativo (inputs, botões)
 */

// ============================================================================
// CORES BASE
// ============================================================================
export const colors = {
  // Fundos
  base: {
    primary: '#08080A',
    secondary: '#0C0C0E',
    tertiary: '#101012',
    elevated: '#141416',
  },
  
  // Superfícies
  surface: {
    soft: 'rgba(255, 255, 255, 0.03)',
    medium: 'rgba(255, 255, 255, 0.05)',
    strong: 'rgba(255, 255, 255, 0.08)',
  },
  
  // Texto
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.45)',
    disabled: 'rgba(255, 255, 255, 0.25)',
  },
  
  // Bordas
  border: {
    subtle: 'rgba(255, 255, 255, 0.04)',
    default: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.12)',
  },
  
  // Estados
  state: {
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
  },
} as const;

// ============================================================================
// SOMBRAS (Z-AXIS)
// ============================================================================
export const shadows = {
  // Z0 - Plano Base
  base: 'none',
  
  // Z1 - Plano Estrutural (seções)
  section: `
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.04)
  `,
  
  // Z2 - Plano Interativo (inputs, botões)
  interactive: `
    inset 0 2px 4px rgba(0, 0, 0, 0.25),
    inset 0 1px 2px rgba(0, 0, 0, 0.15)
  `,
  
  // CTA flutuante
  cta: (accentRgb: string) => `
    0 4px 16px rgba(${accentRgb}, 0.35),
    0 2px 6px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `,
  
  // Focus glow
  focus: (accentRgb: string) => `
    0 0 0 3px rgba(${accentRgb}, 0.15),
    0 0 20px rgba(${accentRgb}, 0.1)
  `,
  
  // Dropdown elevado
  dropdown: `
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 4px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05)
  `,
} as const;

// ============================================================================
// ESPAÇAMENTO (8px grid)
// ============================================================================
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  section: '40px',
} as const;

// ============================================================================
// RADIUS
// ============================================================================
export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
} as const;

// ============================================================================
// TIPOGRAFIA
// ============================================================================
export const typography = {
  // Títulos
  title: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
  },
  
  // Subtítulos
  subtitle: {
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0',
  },
  
  // Labels
  label: {
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  
  // Body
  body: {
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
  
  // Caption
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },
  
  // Mono (placas)
  mono: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '0.15em',
  },
} as const;

// ============================================================================
// TRANSIÇÕES
// ============================================================================
export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

// ============================================================================
// BRAND ACCENT (dinâmico)
// ============================================================================
export const getBrandAccent = (brand?: string) => {
  const brandColors: Record<string, { hex: string; rgb: string }> = {
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
    maserati: { hex: '#0C2340', rgb: '12, 35, 64' },
    default: { hex: '#6B7280', rgb: '107, 114, 128' },
  };
  
  const key = brand?.toLowerCase().replace(/\s+/g, '') || 'default';
  return brandColors[key] || brandColors.default;
};

export type BudgetTokens = {
  colors: typeof colors;
  shadows: typeof shadows;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  transitions: typeof transitions;
};
