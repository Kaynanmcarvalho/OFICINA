/**
 * ValidationMessage - Mensagem de validação de erro
 */

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useThemeStore } from '../../../../../store/themeStore';

const ValidationMessage = ({ message }) => {
  const { isDarkMode } = useThemeStore();

  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        flex items-center gap-2 mt-2 text-sm
        ${isDarkMode ? 'text-red-400' : 'text-red-600'}
      `}
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
    </motion.div>
  );
};

export default ValidationMessage;
