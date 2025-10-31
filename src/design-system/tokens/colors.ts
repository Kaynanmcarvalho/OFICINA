import tokens from '../../../design-tokens.json';
import type { ColorPalettes, ColorScale } from './types';

export const colors: ColorPalettes = tokens.colors as ColorPalettes;

// Semantic color mappings for theme-aware usage
export const semanticColors = {
  light: {
    bgPrimary: colors.neutral[50],
    bgSecondary: colors.neutral[100],
    bgTertiary: colors.neutral[200],
    bgGlass: 'rgba(255, 255, 255, 0.8)',
    textPrimary: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textTertiary: colors.neutral[500],
    border: colors.neutral[200],
    borderSubtle: 'rgba(229, 229, 229, 0.5)',
  },
  dark: {
    bgPrimary: colors.neutral[900],
    bgSecondary: colors.neutral[800],
    bgTertiary: colors.neutral[700],
    bgGlass: 'rgba(23, 23, 23, 0.8)',
    textPrimary: colors.neutral[50],
    textSecondary: colors.neutral[400],
    textTertiary: colors.neutral[500],
    border: colors.neutral[700],
    borderSubtle: 'rgba(64, 64, 64, 0.5)',
  },
};

// Alpha variants for translucency effects
export const alphaColors = {
  primary: {
    10: 'rgba(59, 130, 246, 0.1)',
    20: 'rgba(59, 130, 246, 0.2)',
    30: 'rgba(59, 130, 246, 0.3)',
    50: 'rgba(59, 130, 246, 0.5)',
    80: 'rgba(59, 130, 246, 0.8)',
  },
  neutral: {
    10: 'rgba(115, 115, 115, 0.1)',
    20: 'rgba(115, 115, 115, 0.2)',
    30: 'rgba(115, 115, 115, 0.3)',
    50: 'rgba(115, 115, 115, 0.5)',
    80: 'rgba(115, 115, 115, 0.8)',
  },
  white: {
    10: 'rgba(255, 255, 255, 0.1)',
    20: 'rgba(255, 255, 255, 0.2)',
    30: 'rgba(255, 255, 255, 0.3)',
    50: 'rgba(255, 255, 255, 0.5)',
    80: 'rgba(255, 255, 255, 0.8)',
  },
  black: {
    10: 'rgba(0, 0, 0, 0.1)',
    20: 'rgba(0, 0, 0, 0.2)',
    30: 'rgba(0, 0, 0, 0.3)',
    50: 'rgba(0, 0, 0, 0.5)',
    80: 'rgba(0, 0, 0, 0.8)',
  },
};
