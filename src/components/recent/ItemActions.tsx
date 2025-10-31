import React, { useState } from 'react';
import IconLoader from './IconLoader';
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
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleButtonHover = (buttonType: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    });
    setHoveredButton(buttonType);
  };

  const buttonBaseClasses = `
    w-10 h-10 
    rounded-xl 
    flex 
    items-center 
    justify-center 
    transition-all 
    duration-200 
    ease-out
    border-2
    font-medium
    shadow-sm
    ${disabled 
      ? 'opacity-30 cursor-not-allowed border-transparent bg-gray-100 dark:bg-gray-800' 
      : 'hover:bg-blue-500 dark:hover:bg-blue-600 hover:border-blue-500 dark:hover:border-blue-600 hover:scale-110 active:scale-95 cursor-pointer border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:shadow-lg hover:shadow-blue-500/25'
    }
  `;

  const iconClasses = `
    transition-all 
    duration-200
    ${disabled 
      ? 'opacity-30 text-gray-400' 
      : 'opacity-90 hover:opacity-100 text-gray-700 dark:text-gray-200 hover:text-white dark:hover:text-white'
    }
  `;

  const handleMoreClick = (event: React.MouseEvent) => {
    if (disabled) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenuPosition({
      x: rect.right - 200, // Align menu to the right of button
      y: rect.bottom + 4,
    });
    setShowContextMenu(true);
    
    if (onMore) {
      onMore();
    }
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
      id: 'print',
      label: 'Imprimir',
      icon: 'printer',
      onClick: () => {
        console.log('Imprimir registro');
        // TODO: Implementar impressão
      },
    },
    {
      id: 'export',
      label: 'Exportar PDF',
      icon: 'download',
      onClick: () => {
        console.log('Exportar PDF');
        // TODO: Implementar exportação
      },
    },
    {
      id: 'share',
      label: 'Compartilhar',
      icon: 'share',
      onClick: () => {
        console.log('Compartilhar registro');
        // TODO: Implementar compartilhamento
      },
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
    <div className="flex items-center gap-2">
      {/* Open Button */}
      {onOpen && (
        <div className="relative">
          <button
            onClick={disabled ? undefined : onOpen}
            onMouseEnter={(e) => handleButtonHover('open', e)}
            onMouseLeave={() => setHoveredButton(null)}
            className={buttonBaseClasses}
            disabled={disabled}
            aria-label="Abrir registro"
          >
            <IconLoader 
              name="external-link" 
              size="sm" 
              className={iconClasses}
            />
          </button>
          
          {/* Tooltip - POSICIONAMENTO ABSOLUTO LIVRE */}
          {hoveredButton === 'open' && !disabled && (
            <div 
              className="fixed z-[9999] px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium rounded-lg whitespace-nowrap shadow-xl border border-gray-700 dark:border-gray-600 animate-fade-in pointer-events-none"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: 'translateX(-50%) translateY(-100%)',
              }}
            >
              Abrir Detalhes
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
            </div>
          )}
        </div>
      )}

      {/* Edit Button */}
      {onEdit && (
        <div className="relative">
          <button
            onClick={disabled ? undefined : onEdit}
            onMouseEnter={(e) => handleButtonHover('edit', e)}
            onMouseLeave={() => setHoveredButton(null)}
            className={buttonBaseClasses}
            disabled={disabled}
            aria-label="Editar registro"
          >
            <IconLoader 
              name="edit" 
              size="sm" 
              className={iconClasses}
            />
          </button>
          
          {/* Tooltip - POSICIONAMENTO ABSOLUTO LIVRE */}
          {hoveredButton === 'edit' && !disabled && (
            <div 
              className="fixed z-[9999] px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium rounded-lg whitespace-nowrap shadow-xl border border-gray-700 dark:border-gray-600 animate-fade-in pointer-events-none"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: 'translateX(-50%) translateY(-100%)',
              }}
            >
              Editar Registro
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
            </div>
          )}
        </div>
      )}

      {/* More Button */}
      {(onMore || contextMenuItems.length > 0) && (
        <div className="relative">
          <button
            onClick={handleMoreClick}
            onMouseEnter={(e) => handleButtonHover('more', e)}
            onMouseLeave={() => setHoveredButton(null)}
            className={buttonBaseClasses}
            disabled={disabled}
            aria-label="Mais opções"
          >
            <IconLoader 
              name="more-vertical" 
              size="sm" 
              className={iconClasses}
            />
          </button>
          
          {/* Tooltip - POSICIONAMENTO ABSOLUTO LIVRE */}
          {hoveredButton === 'more' && !disabled && !showContextMenu && (
            <div 
              className="fixed z-[9999] px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium rounded-lg whitespace-nowrap shadow-xl border border-gray-700 dark:border-gray-600 animate-fade-in pointer-events-none"
              style={{
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                transform: 'translateX(-50%) translateY(-100%)',
              }}
            >
              Mais Opções
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
            </div>
          )}
        </div>
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