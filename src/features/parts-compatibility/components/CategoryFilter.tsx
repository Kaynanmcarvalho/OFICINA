/**
 * TORQ Parts Compatibility - Category Filter
 * Filtro por categoria de peças
 */

import React from 'react';
import type { PartCategory } from '../types';
import { PART_CATEGORY_LABELS, CATEGORY_COLORS } from '../types';

interface CategoryFilterProps {
  categories: { category: PartCategory; count: number }[];
  selected: PartCategory | null;
  onSelect: (category: PartCategory | null) => void;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Botão "Todas" */}
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
          selected === null
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        Todas
        <span className="ml-1 text-xs opacity-70">
          ({categories.reduce((sum, c) => sum + c.count, 0)})
        </span>
      </button>

      {/* Categorias */}
      {categories.map(({ category, count }) => {
        const colors = CATEGORY_COLORS[category];
        const isSelected = selected === category;

        return (
          <button
            key={category}
            onClick={() => onSelect(isSelected ? null : category)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
              isSelected
                ? `${colors.bg} ${colors.text} ring-2 ring-offset-2 ring-current`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {PART_CATEGORY_LABELS[category]}
            <span className="ml-1 text-xs opacity-70">({count})</span>
          </button>
        );
      })}
    </div>
  );
};
