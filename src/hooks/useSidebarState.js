import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage sidebar state
 * Handles collapse/expand state, active item, hover state, and localStorage persistence
 */
export const useSidebarState = () => {
  // Initialize from localStorage or default to expanded on desktop
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default to collapsed on mobile, expanded on desktop
    return window.innerWidth < 1024;
  });

  const [activeItem, setActiveItem] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Persist collapse state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Toggle collapse state with transition flag
  const toggleCollapse = useCallback(() => {
    setIsTransitioning(true);
    setIsCollapsed(prev => !prev);
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match animation duration
  }, []);

  // Set active item
  const setActive = useCallback((itemPath) => {
    setActiveItem(itemPath);
  }, []);

  // Set hovered item
  const setHovered = useCallback((itemPath) => {
    setHoveredItem(itemPath);
  }, []);

  // Clear hovered item
  const clearHovered = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Auto-collapse on mobile
      if (window.innerWidth < 1024 && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);

  // Keyboard shortcut: Ctrl+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCollapse]);

  return {
    isCollapsed,
    activeItem,
    hoveredItem,
    isTransitioning,
    toggleCollapse,
    setActive,
    setHovered,
    clearHovered,
  };
};
