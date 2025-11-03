/**
 * Theme Utilities - Utilitários para gerenciamento de tema
 * Garante aplicação correta do tema em tempo real
 */

/**
 * Aplica o tema ao documento
 * @param {boolean} isDark - Se o tema é escuro
 */
export const applyTheme = (isDark) => {
  const root = document.documentElement;
  const body = document.body;
  
  if (isDark) {
    root.classList.add('dark');
    body.style.background = 'var(--apple-bg-primary, #000000)';
    body.style.color = 'var(--apple-text-primary, #f5f5f7)';
  } else {
    root.classList.remove('dark');
    body.style.background = 'var(--apple-bg-primary, #ffffff)';
    body.style.color = 'var(--apple-text-primary, #1d1d1f)';
  }
};

/**
 * Observa mudanças no tema e aplica automaticamente
 * @param {function} callback - Callback para mudanças de tema
 */
export const observeThemeChanges = (callback) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains('dark');
        applyTheme(isDark);
        if (callback) callback(isDark);
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  return () => observer.disconnect();
};

/**
 * Força a aplicação do tema atual
 */
export const forceThemeApplication = () => {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark);
};