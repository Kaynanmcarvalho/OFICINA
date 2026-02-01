import { useEffect, useCallback } from 'react';

type KeyboardShortcutHandler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
}

/**
 * Hook for global keyboard shortcuts
 * 
 * @param key - The key to listen for (e.g., 'k', 'Enter', 'Escape')
 * @param handler - Function to call when shortcut is triggered
 * @param options - Modifier keys (ctrl, shift, alt, meta)
 * 
 * @example
 * // Cmd/Ctrl + K for search
 * useKeyboardShortcut('k', () => openSearch(), { meta: true, ctrl: true });
 * 
 * // Escape to close modal
 * useKeyboardShortcut('Escape', () => closeModal());
 */
export function useKeyboardShortcut(
  key: string,
  handler: KeyboardShortcutHandler,
  options: ShortcutOptions = {}
) {
  const { ctrl = false, shift = false, alt = false, meta = false } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if the key matches
      if (event.key.toLowerCase() !== key.toLowerCase()) {
        return;
      }

      // Check modifier keys
      const ctrlPressed = ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftPressed = shift ? event.shiftKey : !event.shiftKey;
      const altPressed = alt ? event.altKey : !event.altKey;
      const metaPressed = meta ? event.metaKey || event.ctrlKey : !event.metaKey && !event.ctrlKey;

      if (ctrlPressed && shiftPressed && altPressed && metaPressed) {
        event.preventDefault();
        handler(event);
      }
    },
    [key, handler, ctrl, shift, alt, meta]

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
