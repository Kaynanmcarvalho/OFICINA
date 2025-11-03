/**
 * Design Tokens - Clients Page Apple Redesign
 * Sistema de design inspirado em Apple com glassmorphism
 */

export const colors = {
  light: {
    // Backgrounds
    bgPrimary: '#ffffff',
    bgSecondary: 'rgba(255, 255, 255, 0.8)',
    bgTertiary: '#f5f5f7',
    
    // Text
    textPrimary: '#1d1d1f',
    textSecondary: '#6e6e73',
    textTertiary: '#86868b',
    
    // Borders
    borderLight: 'rgba(0, 0, 0, 0.06)',
    borderMedium: 'rgba(0, 0, 0, 0.12)',
    
    // Accents
    accentBlue: '#007aff',
    accentBlueHover: '#0051d5',
    
    // Shadows
    shadowSm: '0 2px 8px rgba(0, 0, 0, 0.08)',
    shadowMd: '0 4px 16px rgba(0, 0, 0, 0.12)',
    shadowLg: '0 8px 32px rgba(0, 0, 0, 0.16)',
  },
  
  dark: {
    // Backgrounds
    bgPrimary: '#000000',
    bgSecondary: 'rgba(28, 28, 30, 0.8)',
    bgTertiary: '#1c1c1e',
    
    // Text
    textPrimary: '#f5f5f7',
    textSecondary: '#98989d',
    textTertiary: '#636366',
    
    // Borders
    borderLight: 'rgba(255, 255, 255, 0.06)',
    borderMedium: 'rgba(255, 255, 255, 0.12)',
    
    // Accents
    accentBlue: '#0a84ff',
    accentBlueHover: '#409cff',
    
    // Shadows
    shadowSm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    shadowMd: '0 4px 16px rgba(0, 0, 0, 0.4)',
    shadowLg: '0 8px 32px rgba(0, 0, 0, 0.5)',
  },
};

export const typography = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  
  scale: {
    pageTitle: {
      size: '48px',
      weight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    sectionTitle: {
      size: '32px',
      weight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    cardTitle: {
      size: '20px',
      weight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    bodyLarge: {
      size: '17px',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    body: {
      size: '15px',
      weight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    caption: {
      size: '13px',
      weight: 400,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    label: {
      size: '12px',
      weight: 500,
      lineHeight: 1.3,
      letterSpacing: '0.05em',
    },
  },
};

export const animations = {
  easing: {
    apple: [0.2, 0.9, 0.2, 1],
    smooth: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
};

export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
  },
  dark: {
    background: 'rgba(28, 28, 30, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
};
