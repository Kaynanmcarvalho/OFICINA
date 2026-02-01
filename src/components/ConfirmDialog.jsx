/**
 * Componente de Diálogo de Confirmação Elegante
 * Substitui os confirm() e alert() nativos do navegador
 * Suporta tema claro/escuro e animações suaves
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning', // 'warning', 'danger', 'success', 'info'
  showCancel = true
}) {
  
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Configurações por tipo
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconBg: 'from-yellow-500 to-orange-500',
      iconColor: 'text-white',
      headerBg: 'from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:to-orange-900/10',
      borderColor: 'border-yellow-100 dark:border-yellow-800/50',
      confirmBg: 'from-yellow-500 via-orange-600 to-amber-600 hover:from-yellow-600 hover:via-orange-700 hover:to-amber-700',
      confirmShadow: 'shadow-yellow-500/30 hover:shadow-yellow-500/40'
    },
    danger: {
      icon: XCircle,
      iconBg: 'from-red-500 to-red-600',
      iconColor: 'text-white',
      headerBg: 'from-red-50 via-rose-50 to-pink-50 dark:from-red-900/20 dark:to-rose-900/10',
      borderColor: 'border-red-100 dark:border-red-800/50',
      confirmBg: 'from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700',
      confirmShadow: 'shadow-red-500/30 hover:shadow-red-500/40'
    },
    success: {
      icon: CheckCircle,
      iconBg: 'from-green-500 to-emerald-600',
      iconColor: 'text-white',
      headerBg: 'from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:to-emerald-900/10',
      borderColor: 'border-green-100 dark:border-green-800/50',
      confirmBg: 'from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700',
      confirmShadow: 'shadow-green-500/30 hover:shadow-green-500/40'
    },
    info: {
      icon: Info,
      iconBg: 'from-blue-500 to-indigo-600',
      iconColor: 'text-white',
      headerBg: 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:to-indigo-900/10',
      borderColor: 'border-blue-100 dark:border-blue-800/50',
      confirmBg: 'from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700',
      confirmShadow: 'shadow-blue-500/30 hover:shadow-blue-500/40'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop */}
        <div
          onClick={handleCancel}
          className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md xl:max-w-lg bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700/50"
        >
          {/* Header */}
          <div className={`p-6 bg-gradient-to-br ${config.headerBg} border-b ${config.borderColor}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.iconBg} flex items-center justify-center shadow-lg ${config.confirmShadow}`}>
                <Icon className={`w-7 h-7 ${config.iconColor}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
              {showCancel && (
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 group"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
            {showCancel && (
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-sm transition-all duration-200 border-2 border-gray-300 dark:border-gray-700 shadow-md hover:shadow-lg"
              >
                {cancelText}
              </motion.button>
            )}
            <motion.button
              type="button"
              onClick={handleConfirm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`${showCancel ? 'flex-1' : 'w-full'} px-4 py-3 bg-gradient-to-r ${config.confirmBg} text-white rounded-2xl font-semibold text-sm transition-all duration-200 shadow-lg ${config.confirmShadow}`}
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
