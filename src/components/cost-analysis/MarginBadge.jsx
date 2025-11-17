/**
 * Margin Badge Component
 * Badge visual para exibir margem de lucro
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MarginBadge = ({ margin, size = 'md', showIcon = true, showLabel = true }) => {
  const getMarginStatus = (margin) => {
    if (margin >= 35) return 'excellent';
    if (margin >= 20) return 'good';
    if (margin >= 10) return 'low';
    return 'critical';
  };

  const getMarginStyles = (status) => {
    const styles = {
      excellent: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-200 dark:border-green-800',
        icon: TrendingUp
      },
      good: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        icon: TrendingUp
      },
      low: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-800',
        icon: Minus
      },
      critical: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-800',
        icon: TrendingDown
      }
    };
    return styles[status];
  };

  const getSizeStyles = (size) => {
    const sizes = {
      sm: {
        padding: 'px-2 py-0.5',
        text: 'text-xs',
        icon: 'w-3 h-3'
      },
      md: {
        padding: 'px-2.5 py-1',
        text: 'text-sm',
        icon: 'w-4 h-4'
      },
      lg: {
        padding: 'px-3 py-1.5',
        text: 'text-base',
        icon: 'w-5 h-5'
      }
    };
    return sizes[size];
  };

  const status = getMarginStatus(margin);
  const styles = getMarginStyles(status);
  const sizeStyles = getSizeStyles(size);
  const Icon = styles.icon;

  return (
    <div 
      className={`
        inline-flex items-center space-x-1 rounded-full border
        ${styles.bg} ${styles.text} ${styles.border}
        ${sizeStyles.padding} ${sizeStyles.text}
        font-medium transition-all duration-200
      `}
      title={`Margem de lucro: ${margin.toFixed(2)}%`}
    >
      {showIcon && <Icon className={sizeStyles.icon} />}
      <span>
        {showLabel && 'Margem: '}
        {margin.toFixed(1)}%
      </span>
    </div>
  );
};

export default MarginBadge;
