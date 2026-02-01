import React from 'react';

interface IconLoaderProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconSizes = {
  sm: 20,
  md: 24,
  lg: 28,
};

const IconLoader: React.FC<IconLoaderProps> = ({ 
  name, 
  size = 'md', 
  className = '' 
}) => {
  const iconSize = iconSizes[size];
  
  // Dynamic icon mapping
  const getIcon = () => {
    switch (name) {
      case 'car':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
            {/* Sports car silhouette - low and sleek */}
            <path 
              d="M2 15.5C2 15.5 3.5 15 5 15H19C20.5 15 22 15.5 22 15.5V17C22 17.8 21.3 18.5 20.5 18.5H19.2" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Main body - sporty and aerodynamic */}
            <path 
              d="M2 15.5L3.8 12C4.2 11.2 5 10.5 6 10.5H18C19 10.5 19.8 11.2 20.2 12L22 15.5" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Sleek roofline - coupe style */}
            <path 
              d="M6 10.5C6.5 9 7.5 7.5 9 7H15C16.5 7.5 17.5 9 18 10.5" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Sporty windshield */}
            <path 
              d="M8.5 7.5L9.5 6.5C10 6 10.8 5.8 11.5 6H12.5C13.2 5.8 14 6 14.5 6.5L15.5 7.5" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round"
            />
            
            {/* Performance wheels - larger and sporty */}
            <circle cx="7.5" cy="17.5" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="16.5" cy="17.5" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            
            {/* Wheel rims */}
            <circle cx="7.5" cy="17.5" r="1" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
            <circle cx="16.5" cy="17.5" r="1" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6"/>
            
            {/* Aggressive front splitter */}
            <path 
              d="M2 15.5L3 14.5L4 15L5 14.8" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round"
            />
            
            {/* Rear spoiler hint */}
            <path 
              d="M19 14.8L20 15L21 14.5L22 15.5" 
              stroke="currentColor" 
              strokeWidth="1.2" 
              strokeLinecap="round"
            />
            
            {/* Sleek headlights */}
            <ellipse cx="4.5" cy="13.5" rx="0.8" ry="0.4" fill="currentColor" opacity="0.8"/>
            <ellipse cx="19.5" cy="13.5" rx="0.8" ry="0.4" fill="currentColor" opacity="0.8"/>
            
            {/* Side air intake */}
            <path 
              d="M10 12L11 11.5L12 12" 
              stroke="currentColor" 
              strokeWidth="0.8" 
              opacity="0.5"
            />
            
            {/* Chassis connection */}
            <path 
              d="M4.8 18.5H5.5M9.5 18.5H14.5M18.5 18.5H19.2" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
          </svg>

      case 'motorcycle':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
            {/* Front wheel */}
            <circle cx="5.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="5.5" cy="17.5" r="1" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
            
            {/* Rear wheel */}
            <circle cx="18.5" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="18.5" cy="17.5" r="1" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
            
            {/* Main frame */}
            <path 
              d="M8 17.5L10 12L12 8L14 12L16 17.5" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none"
            />
            
            {/* Handlebars */}
            <path 
              d="M9 8L12 8L15 8" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            
            {/* Seat */}
            <path 
              d="M11 12L13 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            
            {/* Front fork */}
            <path 
              d="M10 12L8 15L5.5 15" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Rear suspension */}
            <path 
              d="M14 12L16 15L18.5 15" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Headlight */}
            <circle cx="12" cy="6" r="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>

      case 'truck':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
            {/* Truck cab */}
            <path 
              d="M2 16V8C2 6.9 2.9 6 4 6H11C12.1 6 13 6.9 13 8V16" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            
            {/* Truck bed/cargo area */}
            <path 
              d="M13 16V11H17L20 14V16" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            
            {/* Cab windshield */}
            <path 
              d="M4 6L4 4C4 3.4 4.4 3 5 3H10C10.6 3 11 3.4 11 4V6" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            
            {/* Front wheel */}
            <circle cx="6.5" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="6.5" cy="18" r="0.8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
            
            {/* Rear wheel */}
            <circle cx="17.5" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="17.5" cy="18" r="0.8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
            
            {/* Connecting chassis */}
            <path 
              d="M2 16H4.5M8.5 16H15.5M19.5 16H22" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            
            {/* Headlight */}
            <circle cx="2.5" cy="12" r="0.5" fill="currentColor" opacity="0.7"/>
            
            {/* Grille details */}
            <path 
              d="M2 10L2 14" 
              stroke="currentColor" 
              strokeWidth="1" 
              opacity="0.6"
            />
          </svg>

      case 'van':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
            {/* Van main body - tall and boxy */}
            <path 
              d="M3 17V9C3 7.9 3.9 7 5 7H19C20.1 7 21 7.9 21 9V17" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            
            {/* Van roof */}
            <path 
              d="M5 7V5C5 4.4 5.4 4 6 4H18C18.6 4 19 4.4 19 5V7" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            
            {/* Front windshield */}
            <path 
              d="M5 7L6 5.5L18 5.5L19 7" 
              stroke="currentColor" 
              strokeWidth="1" 
              opacity="0.6"
            />
            
            {/* Side windows */}
            <rect 
              x="7" y="8.5" width="3" height="2.5" 
              stroke="currentColor" 
              strokeWidth="1" 
              fill="none" 
              opacity="0.5"
            />
            <rect 
              x="14" y="8.5" width="3" height="2.5" 
              stroke="currentColor" 
              strokeWidth="1" 
              fill="none" 
              opacity="0.5"
            />
            
            {/* Front wheels */}
            <circle cx="7" cy="19" r="1.8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="7" cy="19" r="0.7" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
            
            {/* Rear wheels */}
            <circle cx="17" cy="19" r="1.8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="17" cy="19" r="0.7" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5"/>
            
            {/* Chassis line */}
            <path 
              d="M3 17H5.2M8.8 17H15.2M18.8 17H21" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            
            {/* Door handle */}
            <circle cx="11" cy="12" r="0.3" fill="currentColor" opacity="0.7"/>
            
            {/* Headlight */}
            <circle cx="3.5" cy="11" r="0.5" fill="currentColor" opacity="0.7"/>
          </svg>

      case 'client':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" className={className}>
            {/* Head/Avatar circle with gradient effect */}
            <circle 
              cx="12" cy="8" r="3.5" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
            />
            
            {/* Inner head detail */}
            <circle 
              cx="12" cy="8" r="2" 
              stroke="currentColor" 
              strokeWidth="0.8" 
              fill="none" 
              opacity="0.4"
            />
            
            {/* Body/Shoulders */}
            <path 
              d="M5 20V18.5C5 16.6 6.6 15 8.5 15H15.5C17.4 15 19 16.6 19 18.5V20" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
            />
            
            {/* Shirt/Clothing detail */}
            <path 
              d="M8.5 15C9.5 16 10.5 16.5 12 16.5C13.5 16.5 14.5 16 15.5 15" 
              stroke="currentColor" 
              strokeWidth="1" 
              opacity="0.5"
            />
            
            {/* Subtle shoulder lines */}
            <path 
              d="M7 17.5L8.5 15M17 17.5L15.5 15" 
              stroke="currentColor" 
              strokeWidth="0.8" 
              opacity="0.3"
            />
          </svg>

      case 'search':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>

      case 'filter':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
          </svg>

      case 'more-vertical':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>

      case 'external-link':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15,3 21,3 21,9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>

      case 'edit':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>
          </svg>

      case 'trash':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="3,6 5,6 21,6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>

      case 'check':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20,6 9,17 4,12"/>
          </svg>

      case 'x-close':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>

      default:
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>

    }
  };

  return getIcon();
};

export default IconLoader;