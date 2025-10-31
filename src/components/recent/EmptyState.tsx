import React from 'react';
import IconLoader from './IconLoader';

interface EmptyStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onCreateNew?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  hasFilters = false,
  onClearFilters,
  onCreateNew,
}) => {
  const hasSearchOrFilters = Boolean(searchQuery) || hasFilters;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="mb-6 p-4 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50">
        <IconLoader 
          name={hasSearchOrFilters ? "search" : "external-link"} 
          size="lg" 
          className="text-gray-400 dark:text-gray-500 w-16 h-16"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {hasSearchOrFilters 
          ? "Nenhum resultado encontrado" 
          : "Nenhum registro encontrado"
        }
      </h3>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {hasSearchOrFilters 
          ? "Não encontramos registros que correspondam aos filtros aplicados. Tente ajustar os critérios de busca."
          : "Ainda não há registros para exibir. Comece criando um novo registro."
        }
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {hasSearchOrFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="
              px-4 py-2 
              bg-gray-100 dark:bg-gray-800 
              hover:bg-gray-200 dark:hover:bg-gray-700 
              text-gray-700 dark:text-gray-300 
              rounded-lg 
              font-medium 
              transition-colors 
              duration-200
              border border-gray-200 dark:border-gray-700
            "
          >
            Limpar filtros
          </button>
        )}

        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="
              px-4 py-2 
              bg-blue-600 hover:bg-blue-700 
              text-white 
              rounded-lg 
              font-medium 
              transition-colors 
              duration-200
              shadow-sm
            "
          >
            Criar novo registro
          </button>
        )}
      </div>

      {/* Additional help text */}
      {!hasSearchOrFilters && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          Os registros aparecerão aqui conforme forem criados
        </p>
      )}
    </div>
  );
};

export default EmptyState;