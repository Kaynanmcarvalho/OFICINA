import React from 'react';

// Icon registry mapping
const iconRegistry: Record<string, string> = {
  car: '/src/icons/recent/icon-car.svg',
  motorcycle: '/src/icons/recent/icon-motorcycle.svg',
  truck: '/src/icons/recent/icon-truck.svg',
  van: '/src/icons/recent/icon-van.svg',
  client: '/src/icons/recent/icon-client.svg',
  search: '/src/icons/recent/icon-search.svg',
  filter: '/src/icons/recent/icon-filter.svg',
  'more-vertical': '/src/icons/recent/icon-more-vertical.svg',
  'external-link': '/src/icons/recent/icon-external-link.svg',
  edit: '/src/icons/recent/icon-edit.svg',
  trash: '/src/icons/recent/icon-trash.svg',
  check: '/src/icons/recent/icon-check.svg',
  'x-close': '/src/icons/recent/icon-x-close.svg',
  'alert-circle': '/src/icons/recent/icon-alert-circle.svg',
  copy: '/src/icons/recent/icon-copy.svg',
};

export interface IconLoaderProps {
  /** Name of the icon to load */
  name: keyof typeof iconRegistry;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

/**
 * IconLoader - Dynamically loads and renders SVG icons
 * 
 * @example
 * <IconLoader name="car" size="md" />
 * <IconLoader name="search" size="sm" className="text-accent-500" />
 */
const IconLoader: React.FC<IconLoaderProps> = ({
  name,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5', // 20px
    md: 'w-6 h-6', // 24px
    lg: 'w-7 h-7', // 28px
  };

  const iconPath = iconRegistry[name];

  if (!iconPath) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  return (
    <span
      className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
      role="img"
      aria-label={ariaLabel || name}
    >
      <img
        src={iconPath}
        alt=""
        className="w-full h-full"
        style={{ color: 'currentColor' }}
      />
    </span>
  );
};

export default IconLoader;
