import React, { useState } from 'react';
import IconLoader from './IconLoader';

interface ItemActionsProps {
  onOpen?: () => void;
  onEdit?: () => void;
  onMore?: () => void;
  disabled?: boolean;
}

/**
 * ItemActions - Botões de ação rápida
 * Design Apple premium com hover states
 */
const ItemActions: React.FC<ItemActionsProps> = ({
  onOpen,
  onEdit,
  onMore,
  disabled = false,
}) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const buttonClass = `
    w-9 h-9
    rounded-lg
    flex items-center justify-center
    text-neutral-600 dark:text-neutral-400
    hover:bg-neutral-100 dark:hover:bg-neutral-800
    hover:text-neutral-900 dark:hover:text-neutral-100
    transition-all duration-150
    hover:scale-110
    active:scale-95
    disabled:opacity-30 disabled:cursor-not-allowed
    relative
  `;

  return (
    <div className="flex items-center gap-2">
      {onOpen && (
        <button
          onClick={onOpen}
          disabled={disabled}
          className={buttonClass}
          onMouseEnter={() => setShowTooltip('open')}
          onMouseLeave={() => setShowTooltip(null)}
          aria-label="Abrir"
        >
          <IconLoader name="external-link" size="sm" />
          {showTooltip === 'open' && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded whitespace-nowrap">
              Abrir
            </span>
          )}
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          disabled={disabled}
          className={buttonClass}
          onMouseEnter={() => setShowTooltip('edit')}
          onMouseLeave={() => setShowTooltip(null)}
          aria-label="Editar"
        >
          <IconLoader name="edit" size="sm" />
          {showTooltip === 'edit' && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded whitespace-nowrap">
              Editar
            </span>
          )}
        </button>
      )}

      {onMore && (
        <button
          onClick={onMore}
          disabled={disabled}
          className={buttonClass}
          onMouseEnter={() => setShowTooltip('more')}
          onMouseLeave={() => setShowTooltip(null)}
          aria-label="Mais opções"
        >
          <IconLoader name="more-vertical" size="sm" />
          {showTooltip === 'more' && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded whitespace-nowrap">
              Mais
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default ItemActions;
