/**
 * Hook unificado para gerenciar tema
 * Usa o themeStore como fonte única de verdade
 */

import { useEffect } from 'react';
import { useThemeStore } from '../store/index.jsx';

export function useUnifiedTheme() {
  const { theme, isDarkMode, setTheme, toggleTheme } = useThemeStore();

  // Garantir que o tema seja aplicado na inicialização
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (isDarkMode) {
      root.classList.add('dark');
      body.style.background = 'var(--apple-bg-primary, #000000)';
      body.style.color = 'var(--apple-text-primary, #f5f5f7)';
    } else {
      root.classList.remove('dark');
      body.style.background = 'var(--apple-bg-primary, #ffffff)';
      body.style.color = 'var(--apple-text-primary, #1d1d1f)';
    }
  }, [isDarkMode]);

  return {
    theme,
    isDark: isDarkMode,
    isDarkMode,
    toggleTheme,
    setTheme
  };
}
