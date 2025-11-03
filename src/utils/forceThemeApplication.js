/**
 * Force Theme Application - Força a aplicação do tema
 * Utilitário para garantir que o tema seja aplicado corretamente
 */

/**
 * Força a aplicação do tema atual
 */
export const forceThemeApplication = () => {
  const isDark = document.documentElement.classList.contains('dark');
  const body = document.body;
  const root = document.documentElement;
  
  // Força a aplicação das variáveis CSS
  if (isDark) {
    root.style.setProperty('--apple-bg-primary', '#000000', 'important');
    root.style.setProperty('--apple-text-primary', '#f5f5f7', 'important');
    body.style.background = '#000000';
    body.style.color = '#f5f5f7';
  } else {
    root.style.setProperty('--apple-bg-primary', '#ffffff', 'important');
    root.style.setProperty('--apple-text-primary', '#1d1d1f', 'important');
    body.style.background = '#ffffff';
    body.style.color = '#1d1d1f';
  }
  
  // Força re-render dos elementos
  const allElements = document.querySelectorAll('*');
  allElements.forEach(el => {
    if (el.style.background && el.style.background.includes('var(--apple-bg-primary)')) {
      el.style.background = el.style.background;
    }
    if (el.style.color && el.style.color.includes('var(--apple-text-primary)')) {
      el.style.color = el.style.color;
    }
  });
};

/**
 * Observa mudanças no tema e força aplicação
 */
export const observeAndForceTheme = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        setTimeout(() => {
          forceThemeApplication();
        }, 50);
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Aplicação inicial
  forceThemeApplication();

  return () => observer.disconnect();
};