/**
 * Hook customizado para gerenciar tema claro/escuro
 * Detecta preferência do sistema e permite alternância manual
 * Persiste preferência do usuário no LocalStorage
 */

import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'theme-preference';

/**
 * Hook para gerenciar tema da aplicação
 * @returns {Object} Estado do tema e funções de controle
 */
export function useTheme() {
  // Detectar preferência inicial
  const getInitialTheme = () => {
    // Verificar LocalStorage primeiro
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      return stored;
    }

    // Detectar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Aplicar tema ao documento
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      body.style.background = 'var(--apple-bg-primary, #000000)';
      body.style.color = 'var(--apple-text-primary, #f5f5f7)';
    } else {
      root.classList.remove('dark');
      body.style.background = 'var(--apple-bg-primary, #ffffff)';
      body.style.color = 'var(--apple-text-primary, #1d1d1f)';
    }

    // Salvar preferência
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      }
  }, [theme]);

  // Observar mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Só atualizar se não houver preferência salva
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Adicionar listener (compatibilidade com navegadores antigos)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Função para alternar tema
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Função para definir tema explicitamente
  const setThemeMode = (mode) => {
    if (mode === 'dark' || mode === 'light') {
      setTheme(mode);
    }
  };

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme: setThemeMode
  };
}
