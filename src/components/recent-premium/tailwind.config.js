const tokens = require('./design-tokens.json');

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neutral: tokens.colors.neutral,
        accent: tokens.colors.accent,
        success: {
          DEFAULT: tokens.colors.success.light,
          dark: tokens.colors.success.dark,
        },
        warning: {
          DEFAULT: tokens.colors.warning.light,
          dark: tokens.colors.warning.dark,
        },
        error: {
          DEFAULT: tokens.colors.error.light,
          dark: tokens.colors.error.dark,
        },
        types: tokens.colors.types,
      },
      fontFamily: {
        sans: tokens.typography.fontFamily.sans,
        mono: tokens.typography.fontFamily.mono,
      },
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,
      letterSpacing: tokens.typography.letterSpacing,
      spacing: tokens.spacing,
      borderRadius: {
        ...tokens.radius,
        '2xl': tokens.radius['2xl'],
        '3xl': tokens.radius['3xl'],
      },
      boxShadow: {
        'elevation-1': tokens.shadows.light['1'],
        'elevation-2': tokens.shadows.light['2'],
        'elevation-3': tokens.shadows.light['3'],
        'elevation-4': tokens.shadows.light['4'],
        'elevation-1-dark': tokens.shadows.dark['1'],
        'elevation-2-dark': tokens.shadows.dark['2'],
        'elevation-3-dark': tokens.shadows.dark['3'],
        'elevation-4-dark': tokens.shadows.dark['4'],
        'glass': tokens.shadows.glass,
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      transitionDuration: tokens.animation.duration,
      transitionTimingFunction: {
        'apple': tokens.animation.easing.apple,
      },
      screens: tokens.breakpoints,
    },
  },
  plugins: [],
};
