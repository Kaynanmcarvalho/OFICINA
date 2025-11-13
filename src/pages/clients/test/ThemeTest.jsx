/**
 * ThemeTest Component
 * Componente de teste para validar tokens de cor e hook useAppleTheme
 */

import React from 'react';
import useAppleTheme from '../hooks/useAppleTheme';
import '../styles/theme-tokens.css';

const ThemeTest = () => {
  const { isDark, isLight, isTransitioning, theme } = useAppleTheme();

  return (
    <div className="min-h-screen p-8 transition-colors duration-300"
         style={{ 
           background: 'var(--apple-bg-primary)',
           color: 'var(--apple-text-primary)'
         }}>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Theme System Test</h1>
        <p style={{ color: 'var(--apple-text-secondary)' }}>
          Current theme: <strong>{theme}</strong> 
          {isTransitioning && ' (transitioning...)'}
        </p>
      </div>

      {/* Color Tokens Test */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Backgrounds */}
        <div className="apple-glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Backgrounds</h3>
          <div className="space-y-2">
            <div className="h-12 rounded-lg" style={{ background: 'var(--apple-bg-primary)' }}>
              <span className="text-xs px-2">Primary</span>
            </div>
            <div className="h-12 rounded-lg" style={{ background: 'var(--apple-bg-secondary)' }}>
              <span className="text-xs px-2">Secondary</span>
            </div>
            <div className="h-12 rounded-lg" style={{ background: 'var(--apple-bg-tertiary)' }}>
              <span className="text-xs px-2">Tertiary</span>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="apple-glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Text Colors</h3>
          <div className="space-y-2">
            <p style={{ color: 'var(--apple-text-primary)' }}>Primary Text</p>
            <p style={{ color: 'var(--apple-text-secondary)' }}>Secondary Text</p>
            <p style={{ color: 'var(--apple-text-tertiary)' }}>Tertiary Text</p>
            <p style={{ color: 'var(--apple-text-quaternary)' }}>Quaternary Text</p>
          </div>
        </div>

        {/* Accents */}
        <div className="apple-glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Accent Colors</h3>
          <div className="space-y-2">
            <div className="h-10 rounded-lg flex items-center px-4 text-white" 
                 style={{ background: 'var(--apple-accent-blue)' }}>
              Blue Accent
            </div>
            <div className="h-10 rounded-lg flex items-center px-4 text-white" 
                 style={{ background: 'var(--apple-accent-green)' }}>
              Green Accent
            </div>
            <div className="h-10 rounded-lg flex items-center px-4 text-white" 
                 style={{ background: 'var(--apple-accent-red)' }}>
              Red Accent
            </div>
            <div className="h-10 rounded-lg flex items-center px-4 text-white" 
                 style={{ background: 'var(--apple-accent-amber)' }}>
              Amber Accent
            </div>
          </div>
        </div>

        {/* Shadows */}
        <div className="apple-glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Shadows</h3>
          <div className="space-y-4">
            <div className="h-16 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center"
                 style={{ boxShadow: 'var(--apple-shadow-sm)' }}>
              Small
            </div>
            <div className="h-16 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center"
                 style={{ boxShadow: 'var(--apple-shadow-md)' }}>
              Medium
            </div>
            <div className="h-16 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center"
                 style={{ boxShadow: 'var(--apple-shadow-lg)' }}>
              Large
            </div>
          </div>
        </div>

        {/* Gradients */}
        <div className="apple-glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Gradients</h3>
          <div className="space-y-4">
            <div className="h-16 rounded-lg flex items-center justify-center text-white"
                 style={{ background: 'var(--apple-gradient-blue)' }}>
              Blue Gradient
            </div>
            <div className="h-16 rounded-lg flex items-center justify-center"
                 style={{ background: 'var(--apple-gradient-subtle)' }}>
              Subtle Gradient
            </div>
          </div>
        </div>

        {/* Utility Classes */}
        <div className="apple-glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Utility Classes</h3>
          <div className="space-y-4">
            <button className="w-full h-12 rounded-lg apple-transition apple-hover-lift"
                    style={{ 
                      background: 'var(--apple-accent-blue)',
                      color: 'white'
                    }}>
              Hover Lift
            </button>
            <button className="w-full h-12 rounded-lg apple-transition apple-hover-scale"
                    style={{ 
                      background: 'var(--apple-accent-green)',
                      color: 'white'
                    }}>
              Hover Scale
            </button>
          </div>
        </div>
      </div>

      {/* Glassmorphism Test */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Glassmorphism Effect</h2>
        <div className="relative h-64 rounded-2xl overflow-hidden"
             style={{ 
               background: isDark 
                 ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                 : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
             }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="apple-glass-card p-8 rounded-2xl max-w-md">
              <h3 className="text-xl font-bold mb-2">Glass Card</h3>
              <p style={{ color: 'var(--apple-text-secondary)' }}>
                This card demonstrates the glassmorphism effect with backdrop blur.
                It should be translucent and show the gradient background behind it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Theme State Info */}
      <div className="apple-glass-card p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-4">Theme State</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>isDark</p>
            <p className="text-lg font-semibold">{isDark ? 'true' : 'false'}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>isLight</p>
            <p className="text-lg font-semibold">{isLight ? 'true' : 'false'}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>isTransitioning</p>
            <p className="text-lg font-semibold">{isTransitioning ? 'true' : 'false'}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--apple-text-secondary)' }}>theme</p>
            <p className="text-lg font-semibold">{theme}</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 rounded-2xl" 
           style={{ 
             background: 'var(--apple-bg-tertiary)',
             border: '1px solid var(--apple-border-light)'
           }}>
        <h3 className="text-lg font-semibold mb-2">Test Instructions</h3>
        <p style={{ color: 'var(--apple-text-secondary)' }}>
          Toggle the theme using the navbar theme button and observe:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1" 
            style={{ color: 'var(--apple-text-secondary)' }}>
          <li>All colors should transition smoothly (300ms)</li>
          <li>Glassmorphism cards should remain translucent</li>
          <li>Text should maintain proper contrast</li>
          <li>Shadows should adapt to the theme</li>
          <li>Theme state should update in real-time</li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeTest;
