import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useThemeTransition } from '../../../hooks/useThemeTransition';
import { themeIconVariants } from '../../../utils/animations';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useThemeTransition();

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-xl hover:bg-gray-500/10 transition-colors relative overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
    >
      <AnimatePresence mode="wait">
        {isDarkMode ? (
          <motion.div
            key="light"
            variants={themeIconVariants}
            initial="dark"
            animate="light"
            exit="dark"
          >
            <MdLightMode className="w-5 h-5 text-gray-300" />
          </motion.div>
        ) : (
          <motion.div
            key="dark"
            variants={themeIconVariants}
            initial="light"
            animate="dark"
            exit="light"
          >
            <MdDarkMode className="w-5 h-5 text-gray-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
