import tokens from '../../../design-tokens.json';
import type { TypographyScale } from './types';

export const typography: TypographyScale = tokens.typography as TypographyScale;

// Typography hierarchy presets
export const typographyPresets = {
  h1: {
    fontSize: typography.fontSize['3xl'][0],
    lineHeight: typography.fontSize['3xl'][1].lineHeight,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSize['2xl'][0],
    lineHeight: typography.fontSize['2xl'][1].lineHeight,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize: typography.fontSize.xl[0],
    lineHeight: typography.fontSize.xl[1].lineHeight,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.normal,
  },
  h4: {
    fontSize: typography.fontSize.lg[0],
    lineHeight: typography.fontSize.lg[1].lineHeight,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },
  h5: {
    fontSize: typography.fontSize.base[0],
    lineHeight: typography.fontSize.base[1].lineHeight,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },
  h6: {
    fontSize: typography.fontSize.sm[0],
    lineHeight: typography.fontSize.sm[1].lineHeight,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodyLarge: {
    fontSize: typography.fontSize.lg[0],
    lineHeight: typography.fontSize.lg[1].lineHeight,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  body: {
    fontSize: typography.fontSize.base[0],
    lineHeight: typography.fontSize.base[1].lineHeight,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm[0],
    lineHeight: typography.fontSize.sm[1].lineHeight,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  caption: {
    fontSize: typography.fontSize.xs[0],
    lineHeight: typography.fontSize.xs[1].lineHeight,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },
  label: {
    fontSize: typography.fontSize.sm[0],
    lineHeight: typography.fontSize.sm[1].lineHeight,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },
};
