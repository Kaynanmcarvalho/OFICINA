/**
 * TORQ Vehicle Health - Score Ring
 * Anel visual de score de saúde
 */

import React from 'react';
import type { HealthStatus } from '../types';
import { HEALTH_STATUS_COLORS } from '../types';

interface HealthScoreRingProps {
  score: number;
  status: HealthStatus;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const HealthScoreRing: React.FC<HealthScoreRingProps> = ({
  score,
  status,
  size = 120,
  strokeWidth = 10,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const colors = HEALTH_STATUS_COLORS[status];

  // Cor do gradiente baseada no status
  const getGradientColors = () => {
    switch (status) {
      case 'excellent':
        return ['#22c55e', '#16a34a'];
      case 'good':
        return ['#3b82f6', '#2563eb'];
      case 'fair':
        return ['#eab308', '#ca8a04'];
      case 'poor':
        return ['#f97316', '#ea580c'];
      case 'critical':
        return ['#ef4444', '#dc2626'];
    }
  };

  const [color1, color2] = getGradientColors();
  const gradientId = `health-gradient-${status}`;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${colors.text}`}>
          {score}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          pontos
        </span>
      </div>
    </div>
  );
};
