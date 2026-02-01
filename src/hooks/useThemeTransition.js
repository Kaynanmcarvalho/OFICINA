import { useState, useEffect, useCallback } from 'react';
import { useThemeStore } from '../store/index.jsx';

/**
 * Custom hook for smooth theme transitions
 * Handles theme changes with proper timing and detects system preferences
 */
export const useThemeTransition = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionDuration = 500; // ms

  // Detect system color scheme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if user hasn't set a preference
      const userPreference = localStorage.getItem('theme-preference');
      if (!userPreference) {
        // This will be handled by the theme store
        }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle theme toggle with transition
  const handleToggleTheme = useCallback(() => {
    setIsTransitioning(true);
    toggleTheme();
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDuration);
  }, [toggleTheme, transitionDuration]);

  // Apply theme class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    isTransitioning,
    transitionDuration,
    toggleTheme: handleToggleTheme,
  };
};
