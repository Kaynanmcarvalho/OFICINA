/**
 * ItemActions - BOTÕES DE AÇÃO REFEITOS DO ZERO
 * Botões simples, limpos e funcionais
 */

import React, { useState } from 'react';
import { ExternalLink, Edit3, MoreVertical } from 'lucide-react';
import ContextMenu from './ContextMenu';

interface ItemActionsProps {
  onOpen?: () => void;
  onEdit?: () => void;
  onMore?: () => void;
  onDuplicate?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
}

const ItemActions: React.FC<ItemActionsProps> = ({ 
  onOpen, 
  onEdit, 
  onMore,
  onDuplicate,
  onComplete,
  onDelete,
  disabled = false 
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const handleMoreClick = (event: React.MouseEvent) => {
    if (disabled) return;
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenuPosition({
      x: rect.right - 200,
      y: rect.bottom + 4,
    });
    setShowContextMenu(true);
    
    if (onMore) {
      onMore();
    }
  };

  const handleButtonClick = (callback?: () => void) => (event: React.MouseEvent) => {
    if (disabled) return;
    event.stopPropagation();
    callback?.();
  };

  const contextMenuItems = [
    {
      id: 'view-details',
      label: 'Ver Detalhes',
      icon: 'eye',
      onClick: () => onOpen?.(),
    },
    {
      id: 'duplicate',
      label: 'Duplicar Registro',
      icon: 'copy',
      onClick: () => onDuplicate?.(),
    },
    {
      id: 'complete',
      label: 'Marcar como Concluído',
      icon: 'check-circle',
      onClick: () => onComplete?.(),
    },
    {
      id: 'separator-1',
      label: '---',
      icon: '',
      onClick: () => {},
      disabled: true,
    },
    {
      id: 'delete',
      label: 'Excluir Registro',
      icon: 'trash-2',
      onClick: () => onDelete?.(),
      destructive: true,
    },
  ];

  return (
    <div className="flex items-center gap-2 min-w-[136px] justify-end">
      {/* Botão Abrir */}
      {onOpen && (
        <button
          onClick={handleButtonClick(onOpen)}
          disabled={disabled}
          className={`
            group relative
            w-10 h-10 
            rounded-xl 
            flex items-center justify-center 
            transition-all duration-200
            ${disabled 
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 hover:scale-105 active:scale-95'
            }
            shadow-md hover:shadow-lg
          `}
          aria-label="Abrir registro"
          title="Abrir Detalhes"
        >
          <ExternalLink 
            size={18} 
            className={disabled ? 'text-gray-400' : 'text-white'}
            strokeWidth={2.5}
          />
        </button>
      )}

      {/* Botão Editar */}
      {onEdit && (
        <button
          onClick={handleButtonClick(onEdit)}
          disabled={disabled}
          className={`
            group relative
            w-10 h-10 
            rounded-xl 
            flex items-center justify-center 
            transition-all duration-200
            ${disabled 
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
              : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 hover:scale-105 active:scale-95'
            }
            shadow-md hover:shadow-lg
          `}
          aria-label="Editar registro"
          title="Editar Registro"
        >
          <Edit3 
            size={18} 
            className={disabled ? 'text-gray-400' : 'text-white'}
            strokeWidth={2.5}
          />
        </button>
      )}

      {/* Botão Mais Opções */}
      {(onMore || contextMenuItems.length > 0) && (
        <button
          onClick={handleMoreClick}
          disabled={disabled}
          className={`
            group relative
            w-10 h-10 
            rounded-xl 
            flex items-center justify-center 
            transition-all duration-200
            ${disabled 
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
              : 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 hover:scale-105 active:scale-95'
            }
            shadow-md hover:shadow-lg
          `}
          aria-label="Mais opções"
          title="Mais Opções"
        >
          <MoreVertical 
            size={18} 
            className={disabled ? 'text-gray-400' : 'text-white'}
            strokeWidth={2.5}
          />
        </button>
      )}

      {/* Context Menu */}
      <ContextMenu
        items={contextMenuItems}
        position={contextMenuPosition}
        isVisible={showContextMenu}
        onClose={() => setShowContextMenu(false)}
      />
    </div>
  );
};

export default ItemActions;