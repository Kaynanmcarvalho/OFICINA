/**
 * Guide Card Component
 * Card compacto para exibir guia técnico
 */

import React from 'react';
import { Clock, Eye, Heart, Book } from 'lucide-react';

const GuideCard = ({ guide, onClick }) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      facil: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      medio: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      dificil: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    };
    return colors[difficulty] || colors.medio;
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
    return labels[difficulty] || 'Médio';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
          {getDifficultyLabel(guide.difficulty)}
        </div>
        <Book className="w-5 h-5 text-gray-400" />
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {guide.title}
      </h3>

      {guide.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {guide.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {guide.duration}min
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {guide.views || 0}
          </div>
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            {guide.likes || 0}
          </div>
        </div>
      </div>

      {guide.tags && guide.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {guide.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {guide.tags.length > 3 && (
            <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
              +{guide.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default GuideCard;
