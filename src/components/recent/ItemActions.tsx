/**
 * ItemActions - BOTÕES DE AÇÃO PREMIUM
 * Botões individuais, visíveis e elegantes - SEM menu dropdown
 */

import React from 'react';
import { ExternalLink, Edit3, CheckCircle, FileText, Trash2 } from 'lucide-react';

interface ItemActionsProps {
  onOpen?: () => void;
  onEdit?: () => void;
  onCreateBudget?: () => void;
  onComplete?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  hasBudget?: boolean;
}

const ItemActions: React.FC<ItemActionsProps> = ({ 
  onOpen, 
  onEdit, 
  onCreateBudget,
  onComplete,
  onDelete,
  disabled = false,
  hasBudget = false
}) => {
  const handleButtonClick = (callback?: () => void) => (event: React.MouseEvent) => {
    if (disabled) return;
    event.stopPropagation();
    callback?.();
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      {/* Botão Abrir - Azul */}
      {onOpen && (
        <button
          onClick={handleButtonClick(onOpen)}
          disabled={disabled}
          className={`
            group relative
            w-9 h-9 
            rounded-lg 
            flex items-center justify-center 
            transition-all duration-200
            ${disabled 
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 hover:scale-110 active:scale-95'
            }
            shadow-md hover:shadow-lg
          `}
          aria-label="Abrir registro"
          title="Abrir Detalhes"
        >
          <ExternalLink 
            size={16} 
            className={disabled ? 'text-gray-400' : 'text-white'}
            strokeWidth={2.5}
          />
        </button>
      )}

      {/* Botão Editar - Verde */}
      {onEdit && (
        <button
          onClick={handleButtonClick(onEdit)}
          disabled={disabled}
          className={`
            group relative
            w-9 h-9 
            rounded-lg 
            flex items-center justify-center 
            transition-all duration-200
            ${disabled 
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
              : 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 hover:scale-110 active:scale-95'
            }
            shadow-md hover:shadow-lg
          `}
          aria-label="Editar registro"
          title="Editar Registro"
        >
          <Edit3 
            size={16} 
            className={disabled ? 'text-gray-400' : 'text-white'}
            strokeWidth={2.5}
          />
        </button>
      )}

      {/* Botão Criar Orçamento - Roxo */}
      {onCreateBudget && (
        <button
          onClick={handleButtonClick(onCreateBudget)}
          disabled={disabled}
          className={`
            group relative
            w-9 h-9 
            rounded-lg 
            flex items-center justify-center 
            transition-all duration-200
            ${disabled 
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
              : 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 hover:scale-110 active:scale-95'
            }
            shadow-md hover:shadow-lg
          `}
          aria-label="Criar orçamento"
          title="Criar Orçamento"
        >
          <FileText 
            size={16} 
            className={disabled ? 'text-gray-400' : 'text-white'}
            strokeWidth={2.5}
          />
        </button>
      )}

      {/* Botão Concluir - Laranja (só disponível se tiver orçamento) */}
      {onComplete && (
        <button
          onClick={handleButtonClick(onComplete)}
          disabled={disabled || !hasBudget}
          className={`
            group relative
            w-9 h-9 
            rounded-lg 
            flex items-center justify-center 
            transition-all duration-200
            ${disabled || !hasBudget
              ? 'opacity-40 cursor-not-allowed bg-gray-300 dark:bg-gray-700' 
              : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 hover:scale-110 active:scale-95'
            }
            shadow-md hover:shadow-lg
          `}
          aria-label={hasBudget ? "Marcar como concluído" : "Crie um orçamento primeiro"}
          title={hasBudget ? "Marcar como Concluído" : "Crie um orçamento primeiro"}
        >
          <CheckCircle 
            size={16} 
            className={disabled || !hasBudget ? 'text-gray-400' : 'text-white'}
            strokeWidth={2.5}
          />
        </button>
      )}

      {/* Botão Excluir - Vermelho */}
      {onDelete && (
        <button
          onClick={handleButtonClick(onDelete)}
          disabled={disabled}
          className={`
            group relative
            w-9 h-9 
            rounded-lg 
            flex items-center justify-center 
            transition-all duration-200
            ${disabled 
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800' 
              : 'bg-red-500 hover:bg-red-600 active:bg-red-700 hover:scale-110 active:scale-95'
            }
            shadow-md hover:shadow-lg
          `}
          aria-label="Excluir registro"
          title="Excluir Registro"
        >
          <Trash2 
            size={16} 
            className={disabled ? 'text-gray-400' : 'text-white'}
            strokeWidth={2.5}
          />
        </button>
      )}
    </div>
  );
};

export default ItemActions;