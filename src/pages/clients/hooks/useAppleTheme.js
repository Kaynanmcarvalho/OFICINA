/**
 * useAppleTheme Hook
 * Integra com o tema existente do navbar e adiciona transições suaves
 */

import { useState, useEffect } from 'react';

export const useAppleTheme = () => {
  const [isDark, setIsDark] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Verificar tema inicial
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const hasDarkClass = htmlElement.classList.contains('dark');
      setIsDark(hasDarkClass);
    };

    // Verificar tema inicial
    checkTheme();

    // Observer para mudanças na classe 'dark' do documento
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const htmlElement = document.documentElement;
          const hasDarkClass = htmlElement.classList.contains('dark');
          
          if (hasDarkClass !== isDark) {
            // Iniciar transição
            setIsTransitioning(true);
            setIsDark(hasDarkClass);
            
            // Finalizar transição após 300ms
            setTimeout(() => {
              setIsTransitioning(false);
            }, 300);
          }
        }
      });
    });

    // Observar mudanças no elemento HTML
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup
    return () => observer.disconnect();
  }, [isDark]);

  // Função para alternar tema manualmente (se necessário)
  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark');
  };

  // Retornar estado e utilitários
  return {
    isDark,
    isLight: !isDark,
    isTransitioning,
    toggleTheme,
    theme: isDark ? 'dark' : 'light',
  };
};

export default useAppleTheme;
