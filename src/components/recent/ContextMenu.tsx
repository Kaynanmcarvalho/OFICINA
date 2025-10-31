import React, { useEffect, useRef, useState } from 'react';
import IconLoader from './IconLoader';

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
  isVisible: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ 
  items, 
  position, 
  onClose, 
  isVisible 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;

      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev < items.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : items.length - 1
          );
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < items.length) {
            const item = items[focusedIndex];
            if (!item.disabled) {
              item.onClick();
              onClose();
            }
          }
          break;
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, focusedIndex, items, onClose]);

  // Auto-focus first item when menu opens
  useEffect(() => {
    if (isVisible) {
      setFocusedIndex(0);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-2xl py-2 backdrop-blur-sm"
      style={{
        left: Math.max(8, Math.min(position.x, window.innerWidth - 200)),
        top: Math.max(8, Math.min(position.y, window.innerHeight - 200)),
      }}
      role="menu"
      aria-label="Menu de contexto"
    >
      {items.map((item, index) => {
        // Separador
        if (item.label === '---') {
          return (
            <div 
              key={item.id} 
              className="my-1 border-t border-gray-200 dark:border-gray-600"
            />
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose();
              }
            }}
            onMouseEnter={() => setFocusedIndex(index)}
            className={`
              w-full 
              flex 
              items-center 
              gap-3 
              px-4 
              py-3 
              text-left 
              text-sm 
              font-medium
              transition-all 
              duration-200
              ${item.disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300'
              }
              ${focusedIndex === index 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                : ''
              }
              ${item.destructive 
                ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                : 'text-gray-700 dark:text-gray-200'
              }
            `}
            disabled={item.disabled}
            role="menuitem"
            aria-label={item.label}
          >
            {item.icon && (
              <IconLoader 
                name={item.icon} 
                size="sm" 
                className={`
                  ${item.destructive 
                    ? 'text-red-500 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              />
            )}
            <span className="flex-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;