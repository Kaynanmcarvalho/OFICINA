/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CSS Variables for shadcn/ui compatibility
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Apple Premium Dark Mode Colors - macOS Sonoma / VisionOS inspired
        dark: {
          // Backgrounds - Preto profundo com tonalidade azul metálica
          bg: '#0C0D11',           // Background principal
          surface: '#14161D',      // Superfícies elevadas
          card: '#181A20',         // Cards e containers
          elevated: '#1C1E26',     // Elementos ainda mais elevados
          
          // Borders & Dividers - Microcontraste sutil
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(255, 255, 255, 0.12)',
          divider: 'rgba(255, 255, 255, 0.06)',
          
          // Text - Branco acetinado e cinzas elegantes
          text: '#E8E8EA',         // Texto primário
          muted: '#A7A8AE',        // Texto secundário
          subtle: '#6E6F76',       // Texto terciário
          
          // Accents - Cores Apple
          accent: '#0A84FF',       // Azul Apple
          'accent-alt': '#64D2FF', // Ciano VisionOS
          purple: '#8B5CF6',       // Lilás Pro
          titanium: '#8E8E93',     // Titanium gray
          
          // Glass effects
          glass: 'rgba(0, 0, 0, 0.3)',
          'glass-border': 'rgba(255, 255, 255, 0.1)',
          
          // Hover states
          hover: 'rgba(255, 255, 255, 0.05)',
          'hover-strong': 'rgba(255, 255, 255, 0.08)',
          
          // Legacy support (mantém compatibilidade)
          50: '#18181b',
          100: '#27272a',
          200: '#3f3f46',
          300: '#52525b',
          400: '#71717a',
          500: '#a1a1aa',
          600: '#d4d4d8',
          700: '#e4e4e7',
          800: '#f4f4f5',
          900: '#fafafa',
        },
        // TORO System Colors - Especificações do sistema
        'surface-dark': '#0b0b0d',
        'card-dark': '#141417',
        'sidebar-dark': '#0f0f12',
        'divider-dark': 'rgba(255,255,255,0.08)',
        'surface-muted': 'rgba(255,255,255,0.55)',
        'surface-foreground': '#ffffff',
        'primary-600': '#2563eb',
        'accent-amber': '#f59e0b',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -5px, 0)' },
          '70%': { transform: 'translate3d(0, -3px, 0)' },
          '90%': { transform: 'translate3d(0, -1px, 0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
        },
      },
      boxShadow: {
        // Apple-style shadows - profundidade e suavidade
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        
        // Premium dark shadows
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'apple-md': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'apple-xl': '0 12px 48px rgba(0, 0, 0, 0.6)',
        
        // Glow effects
        'glow-blue': '0 0 20px rgba(10, 132, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 20px rgba(100, 210, 255, 0.3)',
        
        // Inner shadows para profundidade
        'inner-subtle': 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
        'inner-glow': 'inset 0 1px 1px rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}