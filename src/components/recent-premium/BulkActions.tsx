import React from 'react';
import { motion } from 'framer-motion';

interface BulkActionsProps {
  selectedCount: number;
  onMarkComplete: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

/**
 * BulkActions - Toolbar de ações em lote
 * Design Apple premium com animação slide-down
 */
const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onMarkComplete,
  onDelete,
  onCancel,
}) => {
  return (
    <motion.div
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -64, opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="toolbar"
      aria-label="Ações em lote"
      aria-live="polite"
      className="
        flex items-center justify-between
        h-16
        px-5
        rounded-2xl
        bg-accent-500/10 dark:bg-accent-500/20
        border border-accent-500/30
        backdrop-blur-sm
      "
    >
      <span className="text-sm font-medium text-accent-600 dark:text-accent-400">
        {selectedCount} {selectedCount === 1 ? 'item selecionado' : 'itens selecionados'}
      </span>

      <div className="flex gap-3">
        <button
          onClick={onMarkComplete}
          className="
            h-9
            px-4
            rounded-lg
            bg-accent-500
            text-white
            text-sm font-medium
            hover:bg-accent-600
            transition-colors
          "
        >
          Marcar como concluído
        </button>

        <button
          onClick={onDelete}
          className="
            h-9
            px-4
            rounded-lg
            bg-neutral-200 dark:bg-neutral-700
            text-neutral-900 dark:text-neutral-100
            text-sm font-medium
            hover:bg-neutral-300 dark:hover:bg-neutral-600
            transition-colors
          "
        >
          Excluir
        </button>

        <button
          onClick={onCancel}
          className="
            h-9
            px-4
            rounded-lg
            text-neutral-600 dark:text-neutral-400
            text-sm font-medium
            hover:bg-neutral-100 dark:hover:bg-neutral-800
            transition-colors
          "
        >
          Cancelar
        </button>
      </div>
    </motion.div>
  );
};

export default BulkActions;
