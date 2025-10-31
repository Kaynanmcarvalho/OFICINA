import React from 'react';

interface VehicleIconProps {
  type: 'car' | 'motorcycle' | 'truck' | 'van' | 'client';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const VehicleIcons: React.FC<VehicleIconProps> = ({ type, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const iconSize = sizeClasses[size];

  const icons = {
    car: (
      <svg className={`${iconSize} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        {/* Carro Esportivo */}
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.85 7H17.14L18.22 10H5.78L6.85 7ZM19 17H5V12H19V17Z"/>
        <circle cx="7.5" cy="14.5" r="1.5"/>
        <circle cx="16.5" cy="14.5" r="1.5"/>
        {/* Detalhes esportivos */}
        <path d="M8 8H16V9H8V8Z" opacity="0.7"/>
        <path d="M6 11H18V11.5H6V11Z" opacity="0.5"/>
      </svg>
    ),
    motorcycle: (
      <svg className={`${iconSize} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        {/* MOTO REALÍSTICA - Claramente uma MOTOCICLETA */}
        
        {/* Roda traseira - GRANDE e robusta */}
        <circle cx="5" cy="17" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="5" cy="17" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
        <circle cx="5" cy="17" r="1.5" fill="currentColor" opacity="0.8"/>
        <circle cx="5" cy="17" r="0.8" fill="currentColor"/>
        
        {/* Roda dianteira - GRANDE e robusta */}
        <circle cx="19" cy="17" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="19" cy="17" r="2.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
        <circle cx="19" cy="17" r="1.5" fill="currentColor" opacity="0.8"/>
        <circle cx="19" cy="17" r="0.8" fill="currentColor"/>
        
        {/* CHASSI PRINCIPAL - Formato típico de MOTO */}
        <path d="M9 17L12 9L15 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 17L15 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        
        {/* TANQUE DE COMBUSTÍVEL - Grande e característico */}
        <ellipse cx="12" cy="9" rx="3.5" ry="2.5" fill="currentColor" opacity="0.9"/>
        <ellipse cx="12" cy="8.5" rx="3" ry="2" fill="currentColor" opacity="0.6"/>
        <ellipse cx="12" cy="8" rx="2.5" ry="1.5" fill="currentColor" opacity="0.3"/>
        
        {/* GUIDÃO - Largo e característico de MOTO */}
        <path d="M7 5L17 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="6.5" cy="5" r="1" fill="currentColor"/>
        <circle cx="17.5" cy="5" r="1" fill="currentColor"/>
        
        {/* FAROL - Grande e proeminente */}
        <circle cx="12" cy="3.5" r="1.8" fill="currentColor"/>
        <circle cx="12" cy="3.5" r="1.2" fill="currentColor" opacity="0.7"/>
        <circle cx="12" cy="3.5" r="0.6" fill="currentColor" opacity="0.9"/>
        
        {/* ASSENTO - Formato típico de MOTO */}
        <ellipse cx="12" cy="12" rx="2.5" ry="1.2" fill="currentColor" opacity="0.8"/>
        <ellipse cx="12" cy="11.5" rx="2" ry="0.8" fill="currentColor" opacity="0.5"/>
        
        {/* ESCAPAMENTO - Muito visível e robusto */}
        <path d="M15 14L21 16" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <ellipse cx="21.5" cy="16.2" rx="1.2" ry="0.6" fill="currentColor"/>
        <ellipse cx="21.5" cy="16.2" rx="0.8" ry="0.4" fill="currentColor" opacity="0.7"/>
        
        {/* MOTOR - Bloco visível */}
        <rect x="10" y="13" width="4" height="2.5" rx="0.5" fill="currentColor" opacity="0.7"/>
        <rect x="10.5" y="13.5" width="3" height="1.5" rx="0.3" fill="currentColor" opacity="0.5"/>
        
        {/* SUSPENSÃO DIANTEIRA - Garfo */}
        <path d="M12 6L12 13" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
        <path d="M11.5 6L11.5 13" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
        <path d="M12.5 6L12.5 13" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
        
        {/* SUSPENSÃO TRASEIRA */}
        <path d="M13 12L16 15" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
        
        {/* PEDAIS/APOIOS */}
        <circle cx="10" cy="15" r="0.5" fill="currentColor" opacity="0.8"/>
        <circle cx="14" cy="15" r="0.5" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    truck: (
      <svg className={`${iconSize} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        {/* Caminhão Moderno */}
        <path d="M20 8H17V4C17 3.45 16.55 3 16 3H3C2.45 3 2 3.45 2 4V17H3C3 18.66 4.34 20 6 20S9 18.66 9 20H15C15 18.66 16.34 20 18 20S21 18.66 21 20H22V12C22 9.79 20.21 8 20 8ZM6 18.5C5.17 18.5 4.5 17.83 4.5 17S5.17 15.5 6 15.5 7.5 16.17 7.5 17 6.83 18.5 6 18.5ZM18 18.5C17.17 18.5 16.5 17.83 16.5 17S17.17 15.5 18 15.5 19.5 16.17 19.5 17 18.83 18.5 18 18.5Z"/>
        <path d="M17 9H20L19 10V13H17V9Z"/>
        {/* Detalhes modernos */}
        <path d="M4 5H15V7H4V5Z" opacity="0.7"/>
        <path d="M4 8H15V10H4V8Z" opacity="0.5"/>
        <path d="M4 11H15V13H4V11Z" opacity="0.3"/>
      </svg>
    ),
    van: (
      <svg className={`${iconSize} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        {/* Van Moderna */}
        <path d="M19 7H18V6C18 4.9 17.1 4 16 4H4C2.9 4 2 4.9 2 6V17H3C3 18.1 3.9 19 5 19S7 18.1 7 19H17C17 18.1 17.9 19 19 19S21 18.1 21 19H22V13C22 9.69 19.31 7 19 7ZM5 17.5C4.45 17.5 4 17.05 4 16.5S4.45 15.5 5 15.5 6 15.95 6 16.5 5.55 17.5 5 17.5ZM19 17.5C18.45 17.5 18 17.05 18 16.5S18.45 15.5 19 15.5 20 15.95 20 16.5 19.55 17.5 19 17.5Z"/>
        <path d="M4 6H16V8H4V6Z"/>
        <path d="M4 9H16V11H4V9Z"/>
        <path d="M4 12H16V14H4V12Z"/>
        {/* Janelas */}
        <path d="M18 8H20V12H18V8Z" opacity="0.6"/>
      </svg>
    ),
    client: (
      <svg className={`${iconSize} ${className}`} viewBox="0 0 24 24" fill="currentColor">
        {/* Cliente Premium */}
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
        {/* Detalhes premium */}
        <circle cx="12" cy="8" r="2" opacity="0.7"/>
        <path d="M12 14C10.67 14 8 14.67 8 16V18H16V16C16 14.67 13.33 14 12 14Z" opacity="0.5"/>
      </svg>
    )
  };

  return icons[type] || icons.car;
};

export default VehicleIcons;