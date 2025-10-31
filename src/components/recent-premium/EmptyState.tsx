import React from 'react';
import IconLoader from './IconLoader';

interface EmptyStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onCreateNew?: () => void;
}

/**
 * EmptyState - Estado vazio com CTA
 * Design Apple premium com ícone e mensagem
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  hasFilters,
  onClearFilters,
  onCreateNew,
}) => {
  const getMessage = () => {
    if (searchQuery) {
      return {
        title: 'Nenhum resultado encontrado',
        description: `Não encontramos registros para "${searchQuery}"`,
      };
    }
    if (hasFilters) {
      return {
        title: 'Nenhum resultado para os filtros aplicados',
        description: 'Tente ajustar os filtros para ver mais resultados',
      };
    }
    return {
      title: 'Nenhum registro encontrado',
      description: 'Comece criando seu primeiro registro',
    };
  };

  const { title, description } = getMessage();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 mb-4 text-neutral-300 dark:text-neutral-600">
        <IconLoader name="search" size="lg" className="w-16 h-16" />
      </div>

      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
        {title}
      </h3>

      <p className="text-md text-neutral-500 dark:text-neutral-400 text-center max-w-sm mb-6">
        {description}
      </p>

      <div className="flex gap-3">
        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="
              px-4 py-2
              rounded-lg
              bg-neutral-100 dark:bg-neutral-800
              text-neutral-900 dark:text-neutral-100
              text-sm font-medium
              hover:bg-neutral-200 dark:hover:bg-neutral-700
              transition-colors
            "
          >
            Limpar filtros
          </button>
        )}

        {onCreateNew && !searchQuery && (
          <button
            onClick={onCreateNew}
            className="
              px-4 py-2
              rounded-lg
              bg-accent-500
              text-white
              text-sm font-medium
              hover:bg-accent-600
              transition-colors
            "
          >
            Criar novo registro
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
