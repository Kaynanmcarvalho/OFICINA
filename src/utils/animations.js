/**
 * Animation utilities and configurations for Apple-level UI
 * Using Framer Motion for smooth, natural animations
 */

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Motion configuration
export const motionConfig = {
  reducedMotion: 'user',
  layoutTransition: {
    type: 'spring',
    stiffness: 300,
    damping: 30
  }
};

// Get animation duration based on user preference
export const getAnimationDuration = (duration) => {
  return prefersReducedMotion() ? 0 : duration;
};

// Easing functions
export const easings = {
  smooth: [0.4, 0, 0.2, 1], // cubic-bezier for smooth transitions
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springBounce: { type: 'spring', stiffness: 400, damping: 25 },
  springSoft: { type: 'spring', stiffness: 200, damping: 20 }
};

// Duration tokens
export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5
};

// Sidebar animations
export const sidebarAnimations = {
  expanded: {
    width: 256,
    transition: {
      duration: durations.slow,
      ease: easings.smooth
    }
  },
  collapsed: {
    width: 80,
    transition: {
      duration: durations.slow,
      ease: easings.smooth
    }
  }
};

// Text animations for sidebar
export const textVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.normal,
      delay: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: durations.fast
    }
  }
};

// Item animations
export const itemAnimations = {
  hover: {
    y: -1,
    transition: { duration: durations.fast }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Search field animations
export const searchVariants = {
  default: {
    width: 320,
    scale: 1,
    transition: easings.spring
  },
  focused: {
    width: 400,
    scale: 1.02,
    transition: easings.spring
  }
};

// Dropdown animations
export const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: easings.springBounce
  }
};

// Theme icon animations
export const themeIconVariants = {
  light: {
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: durations.normal }
  },
  dark: {
    rotate: 180,
    scale: 1,
    opacity: 1,
    transition: { duration: durations.normal }
  }
};

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.normal }
  }
};

// Scale in animation
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easings.springBounce
  }
};

// Slide animations
export const slideIn = {
  left: {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: durations.normal }
    }
  },
  right: {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: durations.normal }
    }
  },
  up: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: durations.normal }
    }
  },
  down: {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: durations.normal }
    }
  }
};

// Breathing pulse animation
export const breathingPulse = {
  scale: [1, 1.02, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

// Badge bounce animation
export const badgeBounce = {
  scale: [1, 1.2, 1],
  transition: {
    duration: 0.6,
    ease: easings.smooth
  }
};

// Mobile sidebar overlay
export const overlayVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: durations.fast }
  },
  visible: {
    opacity: 1,
    transition: { duration: durations.fast }
  }
};

// Mobile sidebar slide
export const mobileSidebarVariants = {
  hidden: {
    x: -256,
    transition: {
      duration: durations.normal,
      ease: easings.smooth
    }
  },
  visible: {
    x: 0,
    transition: {
      duration: durations.normal,
      ease: easings.smooth
    }
  }
};

// Tooltip animation
export const tooltipVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    x: -10
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: durations.fast,
      ease: easings.smooth
    }
  }
};
