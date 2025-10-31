const tokens = require('./design-tokens-premium.json');

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neutral: tokens.colors.neutral,
        accent: tokens.colors.accent,
        glass: {
          light: tokens.colors.glass.light,
          dark: tokens.colors.glass.dark,
        },
        'type-car': tokens.colors.types.car,
        'type-motorcycle': tokens.colors.types.motorcycle,
        'type-truck': tokens.colors.types.truck,
        'type-van': tokens.colors.types.van,
        'type-client': tokens.colors.types.client,
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
        'premium': tokens.radius['2xl'],
        'premium-lg': tokens.radius['3xl'],
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
        '2xl': '24px',
      },
      transitionDuration: {
        fast: tokens.animation.duration.fast,
        base: tokens.animation.duration.base,
        slow: tokens.animation.duration.slow,
        slower: tokens.animation.duration.slower,
      },
      transitionTimingFunction: {
        apple: tokens.animation.easing.apple,
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
