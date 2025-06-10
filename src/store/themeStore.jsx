import { create } from 'zustand';

export const themeStore = (set, get) => ({
  // Theme state
  theme: 'auto', // 'light', 'dark', 'auto'
  isDarkMode: false,
  language: 'pt-BR',

  // Theme actions
  setTheme: (theme) => {
    set({ theme });
    
    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set({ isDarkMode: prefersDark });
      
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (theme === 'dark') {
      set({ isDarkMode: true });
      root.classList.add('dark');
    } else {
      set({ isDarkMode: false });
      root.classList.remove('dark');
    }
  },

  toggleTheme: () => {
    const { theme } = get();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  setLanguage: (language) => {
    set({ language });
    
    // Update i18n language
    if (window.i18n) {
      window.i18n.changeLanguage(language);
    }
    
    // Update document language
    document.documentElement.lang = language;
  },

  // Initialize theme from system preferences
  initializeTheme: () => {
    const { theme } = get();
    
    // Set up system theme change listener
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e) => {
      const { theme } = get();
      if (theme === 'auto') {
        set({ isDarkMode: e.matches });
        const root = document.documentElement;
        
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleThemeChange);
    
    // Apply initial theme
    get().setTheme(theme);
    
    // Return cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  },

  // Get available themes
  getAvailableThemes: () => [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' },
  ],

  // Get available languages
  getAvailableLanguages: () => [
    { value: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { value: 'en-US', label: 'English', flag: '🇺🇸' },
    { value: 'es-ES', label: 'Español', flag: '🇪🇸' },
  ],
});

// Create the useThemeStore hook
export const useThemeStore = create(themeStore);