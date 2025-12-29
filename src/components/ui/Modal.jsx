import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useThemeStore } from '../../store/index.jsx';

const Modal = ({ isOpen, onClose, title, children, size = 'md', subtitle = null }) => {
  const { isDarkMode } = useThemeStore();

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    '3xl': 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto ${isDarkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`}
        onClick={handleBackdropClick}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={`
            w-full ${sizeClasses[size]} my-8 max-h-[90vh] flex flex-col
            rounded-2xl shadow-2xl transform transition-all
            ${isDarkMode 
              ? 'bg-[#1C1E26] border border-white/[0.08]' 
              : 'bg-white border border-gray-200/80'
            }
          `}
        >
          {/* Header */}
          <div className={`
            flex items-center justify-between px-6 py-4 border-b flex-shrink-0
            ${isDarkMode ? 'border-white/[0.08]' : 'border-gray-200'}
          `}>
            <div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h2>
              {subtitle && (
                <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {subtitle}
                </p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className={`
                p-2 rounded-xl transition-colors
                ${isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-white/[0.1]' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto flex-1">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
