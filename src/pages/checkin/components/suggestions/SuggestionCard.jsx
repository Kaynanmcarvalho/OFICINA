import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '../../utils/dateHelpers';

const SuggestionCard = ({ suggestion, onAccept, onIgnore }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          color: 'red',
          label: 'Alta',
          icon: AlertCircle,
          gradient: 'from-red-500 to-red-600',
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-200 dark:border-red-800'
        };
      case 'medium':
        return {
          color: 'orange',
          label: 'Média',
          icon: Clock,
          gradient: 'from-orange-500 to-orange-600',
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-200 dark:border-orange-800'
        };
      case 'low':
        return {
          color: 'blue',
          label: 'Baixa',
          icon: CheckCircle,
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800'
        };
      default:
        return {
          color: 'gray',
          label: 'Normal',
          icon: CheckCircle,
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-800'
        };
    }
  };

  const config = getPriorityConfig(suggestion.priority);
  const PriorityIcon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-xl border ${config.border} bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {/* Priority Badge */}
            <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${config.bg} ${config.text}`}>
              <PriorityIcon className="w-3 h-3" />
              {config.label}
            </span>
            
            {suggestion.recommended && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                Recomendado
              </span>
            )}
          </div>

          {/* Service Name */}
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {suggestion.service}
          </h4>

          {/* Reason */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {suggestion.reason}
          </p>

          {/* Last Date */}
          {suggestion.lastDate && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Última vez: {formatDate(suggestion.lastDate)}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAccept}
            className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient} text-white hover:shadow-lg transition-all`}
            title="Adicionar ao orçamento"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onIgnore}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Ignorar sugestão"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
