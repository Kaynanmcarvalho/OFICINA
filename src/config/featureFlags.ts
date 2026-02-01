/**
 * Feature Flags for Premium Design System Migration
 * 
 * These flags control the gradual rollout of new design system components.
 * Toggle flags to enable/disable premium components.
 */

export const featureFlags = {
  // Core Navigation
  USE_PREMIUM_NAVBAR: import.meta.env.VITE_USE_PREMIUM_NAVBAR === 'true' || false,
  USE_PREMIUM_SIDEBAR: import.meta.env.VITE_USE_PREMIUM_SIDEBAR === 'true' || false,
  
  // Dashboard Components
  USE_PREMIUM_CARDS: import.meta.env.VITE_USE_PREMIUM_CARDS === 'true' || false,
  USE_PREMIUM_ALERT_CENTER: import.meta.env.VITE_USE_PREMIUM_ALERT_CENTER === 'true' || false,
  
  // Data Components
  USE_PREMIUM_FORMS: import.meta.env.VITE_USE_PREMIUM_FORMS === 'true' || false,
  USE_PREMIUM_TABLE: import.meta.env.VITE_USE_PREMIUM_TABLE === 'true' || false,
  
  // Overlays
  USE_PREMIUM_MODALS: import.meta.env.VITE_USE_PREMIUM_MODALS === 'true' || false,
  
  // Theme System
  USE_PREMIUM_THEME: import.meta.env.VITE_USE_PREMIUM_THEME === 'true' || true, // Default enabled
};

/**
 * Check if a specific feature is enabled
 */
export const isFeatureEnabled = (feature: keyof typeof featureFlags): boolean => {
  return featureFlags[feature];
};

/**
 * Get all enabled features
 */
export const getEnabledFeatures = (): string[] => {
  return Object.entries(featureFlags)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature);
};

/**
 * Log feature flag status (useful for debugging)
 */
export const logFeatureFlags = () => {
  console.group('🚩 Feature Flags Status');
  Object.entries(featureFlags).forEach(([feature, enabled]) => {
    });
  console.groupEnd();
};

// Log on load in development
if (import.meta.env.DEV) {
  logFeatureFlags();
}
