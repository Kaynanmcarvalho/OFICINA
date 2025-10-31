import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { ThemeConfig } from '../tokens/types';

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'design-system-theme';

const defaultTheme: ThemeConfig = {
  mode: 'system',
  primaryHue: 217,
  borderRadius: 'lg',
  density: 'comfortable',
  reducedMotion: false,
};

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): ThemeConfig {
  if (typeof window === 'undefined') return defaultTheme;
  
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return { ...defaultTheme, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
  }
  
  return defaultTheme;
}

function saveTheme(theme: ThemeConfig) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeConfig>(getStoredTheme);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light');

  // Resolve theme mode (system, light, or dark)
  useEffect(() => {
    const mode = theme.mode === 'system' ? getSystemTheme() : theme.mode;
    setResolvedMode(mode);

    // Apply theme class to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);

    // Apply custom primary hue if set
    if (theme.primaryHue !== undefined) {
      root.style.setProperty('--primary-hue', theme.primaryHue.toString());
    }

    // Apply reduced motion preference
    if (theme.reducedMotion) {
      root.style.setProperty('--duration-fast', '0ms');
      root.style.setProperty('--duration-base', '0ms');
      root.style.setProperty('--duration-slow', '0ms');
      root.style.setProperty('--duration-slower', '0ms');
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme.mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      setResolvedMode(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme.mode]);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      setThemeState(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    // Set initial value
    if (mediaQuery.matches && !theme.reducedMotion) {
      setThemeState(prev => ({ ...prev, reducedMotion: true }));
    }

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    const updated = { ...theme, ...newTheme };
    setThemeState(updated);
    saveTheme(updated);
  };

  const toggleTheme = () => {
    const newMode = resolvedMode === 'light' ? 'dark' : 'light';
    setTheme({ mode: newMode });
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDark: resolvedMode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
