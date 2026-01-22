/**
 * TORQ - Hook de Atalhos de Teclado
 * Gerencia atalhos globais e contextuais
 */

import { useEffect, useCallback } from 'react';

/**
 * Hook para atalhos de teclado
 * @param {Object} shortcuts - Mapa de atalhos { 'ctrl+n': callback, 'esc': callback }
 * @param {boolean} enabled - Se os atalhos estão ativos (padrão: true)
 */
export const useKeyboardShortcuts = (shortcuts = {}, enabled = true) => {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Construir string do atalho
    const keys = [];
    if (event.ctrlKey || event.metaKey) keys.push('ctrl');
    if (event.altKey) keys.push('alt');
    if (event.shiftKey) keys.push('shift');
    keys.push(event.key.toLowerCase());
    
    const shortcut = keys.join('+');
    
    // Executar callback se existir
    if (shortcuts[shortcut]) {
      event.preventDefault();
      shortcuts[shortcut](event);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};

/**
 * Atalhos padrão do sistema
 */
export const SHORTCUTS = {
  // Navegação
  NEW_CHECKIN: 'ctrl+n',
  SEARCH: 'ctrl+f',
  CLOSE: 'esc',
  
  // Formulário
  NEXT: 'enter',
  PREVIOUS: 'shift+enter',
  SAVE: 'ctrl+s',
  
  // Ações
  SUBMIT: 'ctrl+enter',
  CANCEL: 'esc',
  
  // Navegação entre campos
  TAB: 'tab',
  SHIFT_TAB: 'shift+tab',
};

/**
 * Hook para atalhos de formulário
 * @param {Function} onNext - Callback para avançar
 * @param {Function} onPrevious - Callback para voltar
 * @param {Function} onSubmit - Callback para submeter
 * @param {Function} onCancel - Callback para cancelar
 * @param {boolean} canSubmit - Se pode submeter
 */
export const useFormShortcuts = ({
  onNext,
  onPrevious,
  onSubmit,
  onCancel,
  canSubmit = true,
  enabled = true
}) => {
  const shortcuts = {
    'enter': (e) => {
      // Não interceptar Enter em textarea
      if (e.target.tagName === 'TEXTAREA') return;
      if (onNext) onNext();
    },
    'shift+enter': () => {
      if (onPrevious) onPrevious();
    },
    'ctrl+enter': () => {
      if (canSubmit && onSubmit) onSubmit();
    },
    'esc': () => {
      if (onCancel) onCancel();
    },
    'ctrl+s': (e) => {
      if (canSubmit && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
    }
  };

  useKeyboardShortcuts(shortcuts, enabled);
};

/**
 * Hook para atalhos de modal
 * @param {Function} onClose - Callback para fechar
 * @param {boolean} isOpen - Se o modal está aberto
 */
export const useModalShortcuts = (onClose, isOpen = true) => {
  const shortcuts = {
    'esc': () => {
      if (onClose) onClose();
    }
  };

  useKeyboardShortcuts(shortcuts, isOpen);
};

/**
 * Hook para atalhos de navegação
 * @param {Function} onSearch - Callback para busca
 * @param {Function} onNew - Callback para novo item
 */
export const useNavigationShortcuts = ({ onSearch, onNew }) => {
  const shortcuts = {
    'ctrl+f': (e) => {
      if (onSearch) {
        e.preventDefault();
        onSearch();
      }
    },
    'ctrl+n': (e) => {
      if (onNew) {
        e.preventDefault();
        onNew();
      }
    }
  };

  useKeyboardShortcuts(shortcuts, true);
};

export default useKeyboardShortcuts;
