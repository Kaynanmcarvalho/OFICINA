import tokens from '../../../design-tokens.json';
import type { SpacingScale } from './types';

export const spacing: SpacingScale = tokens.spacing as SpacingScale;

// Container padding presets for responsive design
export const containerPadding = {
  mobile: spacing[4],    // 1rem
  tablet: spacing[6],    // 1.5rem
  desktop: spacing[8],   // 2rem
};

// Component spacing presets
export const componentSpacing = {
  compact: spacing[2],      // 0.5rem
  comfortable: spacing[4],  // 1rem
  spacious: spacing[6],     // 1.5rem
};

// Section spacing presets
export const sectionSpacing = {
  small: spacing[8],   // 2rem
  medium: spacing[12], // 3rem
  large: spacing[16],  // 4rem
};
