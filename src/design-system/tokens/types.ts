// TypeScript type definitions for design tokens

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ColorPalettes {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}

export interface FontFamily {
  sans: string[];
  mono: string[];
}

export interface FontSize {
  xs: [string, { lineHeight: string }];
  sm: [string, { lineHeight: string }];
  base: [string, { lineHeight: string }];
  lg: [string, { lineHeight: string }];
  xl: [string, { lineHeight: string }];
  '2xl': [string, { lineHeight: string }];
  '3xl': [string, { lineHeight: string }];
  '4xl': [string, { lineHeight: string }];
  '5xl': [string, { lineHeight: string }];
  '6xl': [string, { lineHeight: string }];
}

export interface FontWeight {
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
}

export interface LetterSpacing {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
}

export interface TypographyScale {
  fontFamily: FontFamily;
  fontSize: FontSize;
  fontWeight: FontWeight;
  letterSpacing: LetterSpacing;
}

export interface SpacingScale {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
}

export interface RadiusScale {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ElevationScale {
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  glass: string;
}

export interface AnimationDuration {
  fast: string;
  base: string;
  slow: string;
  slower: string;
}

export interface AnimationEasing {
  default: string;
  in: string;
  out: string;
  inOut: string;
  apple: string;
}

export interface AnimationConfig {
  duration: AnimationDuration;
  easing: AnimationEasing;
}

export interface BreakpointConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface DesignTokens {
  colors: ColorPalettes;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: RadiusScale;
  elevation: ElevationScale;
  animation: AnimationConfig;
  breakpoints: BreakpointConfig;
}

// Theme configuration types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryHue?: number;
  accentColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  density?: 'compact' | 'comfortable' | 'spacious';
  reducedMotion?: boolean;
}

// Component prop types
export type ComponentVariant = 'default' | 'glass' | 'highlight';
export type ComponentSize = 'sm' | 'md' | 'lg';
