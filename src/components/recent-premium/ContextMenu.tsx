import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: string;
  danger?: boolean;
}

interface ContextMenuProps {
  items: MenuItem[];
  position?: { x: number; y: number };
  onClose: () => void;
  isOpen: boolean;
}

/**
 * ContextMenu - Menu contextual com glassmorphism
 * Design Apple premium com animações fluidas
 */
const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  position,
  onClose,
  isOpen,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="
            fixed z-50
            w-52
            p-2
            rounded-xl
            bg-white/95 dark:bg-neutral-800/95
            backdrop-blur-xl
            border border-neutral-200/50 dark:border-neutral-700/50
            shadow-elevation-3
          "
          style={position ? { top: position.y, left: position.x } : {}}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`
                w-full
                h-10
                px-3
                flex items-center gap-3
                rounded-lg
                text-sm text-left
                transition-colors duration-150
                ${
                  item.danger
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-500/10'
                    : 'text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
