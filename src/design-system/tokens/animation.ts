import tokens from '../../../design-tokens.json';
import type { AnimationConfig } from './types';

export const animation: AnimationConfig = tokens.animation as AnimationConfig;

// Animation presets for common interactions
export const animationPresets = {
  // Hover effects
  hover: {
    lift: {
      y: -4,
      transition: {
        duration: 0.2,
        ease: [0.2, 0.9, 0.2, 1],
      },
    },
    scale: {
      scale: 1.02,
      transition: {
        duration: 0.15,
      },
    },
  },
  
  // Press effects
  press: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
  
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      duration: 0.3,
      ease: [0.2, 0.9, 0.2, 1],
    },
  },
  
  // Modal animations
  modal: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      duration: 0.2,
      ease: [0.2, 0.9, 0.2, 1],
    },
  },
  
  // Notification animations
  notification: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: {
      duration: 0.3,
      ease: [0.2, 0.9, 0.2, 1],
    },
  },
  
  // Drawer animations
  drawer: {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' },
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
    transition: {
      duration: 0.3,
      ease: [0.2, 0.9, 0.2, 1],
    },
  },
  
  // Fade animations
  fade: {
    in: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2 },
    },
    out: {
      initial: { opacity: 1 },
      animate: { opacity: 0 },
      transition: { duration: 0.2 },
    },
  },
};

// Skeleton shimmer animation
export const shimmerAnimation = {
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
  duration: '2s',
  timing: 'linear',
  iteration: 'infinite',
};
