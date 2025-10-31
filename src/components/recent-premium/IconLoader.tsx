import React from 'react';

interface IconLoaderProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-5 h-5', // 20px
  md: 'w-6 h-6', // 24px
  lg: 'w-7 h-7', // 28px
};

/**
 * IconLoader - Carrega ícones SVG dinamicamente
 * Usa currentColor para herdar cor do contexto
 */
const IconLoader: React.FC<IconLoaderProps> = ({ 
  name, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClass = sizeMap[size];
  
  // Mapeamento de ícones
  const icons: Record<string, JSX.Element> = {
    car: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <path d="M5 13l1.5-4.5C7 7 8 6 9.5 6h5c1.5 0 2.5 1 3 2.5L19 13M5 13h14M5 13v5c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2v-1M19 13v5c0 1.1-.9 2-2 2h-1c-1.1 0-2-.9-2-2v-1M7 13h10M8 16h.01M16 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    motorcycle: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <circle cx="6" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="18" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M8 19h8M12 5v4M10 9h4l2 4M14 13l4 6M10 13l-4 6M12 9l2-4h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    truck: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 16a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM18.5 16a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    van: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <path d="M3 6h15v10H3zM18 10h3l2 2v4h-5v-6zM7 16a2 2 0 100 4 2 2 0 000-4zM17 16a2 2 0 100 4 2 2 0 000-4zM3 6l2-3h10l2 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    client: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    filter: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'more-vertical': (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
      </svg>
    ),
    'external-link': (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'x-close': (
      <svg viewBox="0 0 24 24" fill="none" className={`${sizeClass} ${className}`}>
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return icons[name] || null;
};

export default IconLoader;
