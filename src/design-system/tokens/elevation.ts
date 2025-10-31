import tokens from '../../../design-tokens.json';
import type { ElevationScale } from './types';

export const elevation: ElevationScale = tokens.elevation as ElevationScale;

// Shadow levels with semantic names
export const shadowLevels = {
  flat: 'none',                    // Level 0: No shadow
  subtle: elevation.xs,            // Level 1: Subtle lift (inputs)
  card: elevation.sm,              // Level 2: Cards at rest
  cardHover: elevation.base,       // Level 3: Cards on hover
  dropdown: elevation.md,          // Level 4: Dropdowns, popovers
  modal: elevation.lg,             // Level 5: Modals, drawers
  overlay: elevation.xl,           // Level 6: Overlays, notifications
  glass: elevation.glass,          // Glass effect shadow
};

// Glass effect configurations
export const glassEffects = {
  light: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },
  dark: {
    background: 'rgba(23, 23, 23, 0.8)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
  },
  premium: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
    },
    dark: {
      background: 'rgba(23, 23, 23, 0.7)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
    },
  },
};
