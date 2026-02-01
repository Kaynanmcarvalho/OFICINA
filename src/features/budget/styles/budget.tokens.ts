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
// CORES BASE - Tema Adaptativo
// ============================================================================
export const colors = {
  // Fundos
  base: {
    primary: 'var(--bg-modal, #FFFFFF)',
    secondary: 'var(--bg-modal-header, #F9FAFB)',
    tertiary: 'var(--bg-modal-content, #FFFFFF)',
    elevated: 'var(--bg-modal, #FFFFFF)',
  },
  
  // Superfícies
  surface: {
    soft: 'var(--bg-section, #FFFFFF)',
    medium: 'var(--bg-input, #FFFFFF)',
    strong: 'var(--bg-section, #FFFFFF)',
  },
  
  // Texto
  text: {
    primary: 'var(--text-primary, #111827)',
    secondary: 'var(--text-secondary, #6B7280)',
    muted: 'var(--text-muted, #9CA3AF)',
    disabled: 'var(--text-disabled, #D1D5DB)',
  },
  
  // Bordas
  border: {
    subtle: 'var(--border-subtle, #D1D5DB)',
    default: 'var(--border-default, #9CA3AF)',
    strong: 'var(--border-strong, #6B7280)',
  },
  
  // Estados (fixos)
  state: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

// ============================================================================
// SOMBRAS - Funcionais e Leves
// ============================================================================
export const shadows = {
  // Sem sombra
  base: 'none',
  
  // Separação leve
  section: 'var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))',
  
  // Input normal
  interactive: 'none',
  
  // Botão primário
  cta: (accentRgb: string) => `0 1px 3px rgba(${accentRgb}, 0.3)`,
  
  // Focus ring
  focus: (accentRgb: string) => `0 0 0 3px rgba(${accentRgb}, 0.1)`,
  
  // Dropdown
  dropdown: 'var(--shadow-md, 0 1px 3px rgba(0, 0, 0, 0.1))',
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
    // Marcas Premium Alemãs
    bmw: { hex: '#0066B1', rgb: '0, 102, 177' },
    mercedes: { hex: '#00ADEF', rgb: '0, 173, 239' },
    'mercedes-benz': { hex: '#00ADEF', rgb: '0, 173, 239' },
    audi: { hex: '#BB0A30', rgb: '187, 10, 48' },
    porsche: { hex: '#D5001C', rgb: '213, 0, 28' },
    volkswagen: { hex: '#001E50', rgb: '0, 30, 80' },
    vw: { hex: '#001E50', rgb: '0, 30, 80' },
    
    // Marcas Japonesas
    toyota: { hex: '#EB0A1E', rgb: '235, 10, 30' },
    honda: { hex: '#E40521', rgb: '228, 5, 33' },
    nissan: { hex: '#C3002F', rgb: '195, 0, 47' },
    mazda: { hex: '#C8102E', rgb: '200, 16, 46' },
    mitsubishi: { hex: '#E60012', rgb: '230, 0, 18' },
    suzuki: { hex: '#0066B2', rgb: '0, 102, 178' },
    subaru: { hex: '#003DA5', rgb: '0, 61, 165' },
    yamaha: { hex: '#E60012', rgb: '230, 0, 18' }, // Vermelho Yamaha Racing (vibrante para UI)
    kawasaki: { hex: '#00A651', rgb: '0, 166, 81' },
    
    // Marcas Americanas
    ford: { hex: '#003478', rgb: '0, 52, 120' },
    chevrolet: { hex: '#D4AF37', rgb: '212, 175, 55' },
    jeep: { hex: '#3D5C3D', rgb: '61, 92, 61' },
    dodge: { hex: '#C8102E', rgb: '200, 16, 46' },
    ram: { hex: '#C8102E', rgb: '200, 16, 46' },
    
    // Marcas Coreanas
    hyundai: { hex: '#002C5F', rgb: '0, 44, 95' },
    kia: { hex: '#05141F', rgb: '5, 20, 31' },
    
    // Marcas Europeias
    fiat: { hex: '#9A0F21', rgb: '154, 15, 33' },
    renault: { hex: '#FFCC00', rgb: '255, 204, 0' },
    peugeot: { hex: '#003DA5', rgb: '0, 61, 165' },
    citroen: { hex: '#AC1926', rgb: '172, 25, 38' },
    volvo: { hex: '#003057', rgb: '0, 48, 87' },
    'land-rover': { hex: '#005A2B', rgb: '0, 90, 43' },
    'landrover': { hex: '#005A2B', rgb: '0, 90, 43' },
    mini: { hex: '#000000', rgb: '0, 0, 0' },
    
    // Marcas Chinesas
    jac: { hex: '#6B7280', rgb: '107, 114, 128' }, // Cinza neutro para UI (logo já é cinza)
    'jacmotors': { hex: '#6B7280', rgb: '107, 114, 128' },
    chery: { hex: '#003DA5', rgb: '0, 61, 165' },
    byd: { hex: '#0066B2', rgb: '0, 102, 178' },
    
    // Marcas Italianas Premium
    ferrari: { hex: '#DC0000', rgb: '220, 0, 0' },
    lamborghini: { hex: '#DDB321', rgb: '221, 179, 33' },
    maserati: { hex: '#0C2340', rgb: '12, 35, 64' },
    
    // Default
    default: { hex: '#6B7280', rgb: '107, 114, 128' },
  };
  
  const key = brand?.toLowerCase().trim().replace(/\s+/g, '').replace(/-/g, '') || 'default';
  const result = brandColors[key] || brandColors.default;
  
  return result;
};

export type BudgetTokens = {
  colors: typeof colors;
  shadows: typeof shadows;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  transitions: typeof transitions;
};
