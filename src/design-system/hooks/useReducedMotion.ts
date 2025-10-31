import { useState, useEffect } from 'react';

/**
 * Hook that respects user's motion preferences
 * Returns true if user prefers reduced motion
 * 
 * @returns boolean indicating if reduced motion is preferred
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * const shouldAnimate = !prefersReducedMotion;
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create event listener
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    // Add listener
    mediaQuery.addEventListener('change', listener);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
