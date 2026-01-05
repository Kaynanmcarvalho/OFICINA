/**
 * TORQ Budget Section
 * Container de seção com título e descrição
 * Plano Z1 - Estrutural
 */

import React from 'react';
import { sectionStyles } from '../styles/budget.styles';

interface BudgetSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  grid?: boolean;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  title,
  description,
  children,
  icon,
  grid = false,
}) => {
  return (
    <div style={sectionStyles.container}>
      <div style={sectionStyles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {icon && (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
              {icon}
            </div>
          )}
          <div>
            <h3 style={sectionStyles.title}>{title}</h3>
            {description && <p style={sectionStyles.description}>{description}</p>}
          </div>
        </div>
      </div>
      
      <div style={grid ? sectionStyles.grid : sectionStyles.content}>
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// SECTION CARD (sub-seção)
// ============================================================================
interface SectionCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  children,
  onClick,
  hoverable = false,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const style: React.CSSProperties = {
    padding: '16px',
    background: isHovered && hoverable
      ? 'rgba(255, 255, 255, 0.06)'
      : 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    transition: 'all 150ms ease',
    cursor: onClick ? 'pointer' : 'default',
  };
  
  return (
    <div
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default BudgetSection;
