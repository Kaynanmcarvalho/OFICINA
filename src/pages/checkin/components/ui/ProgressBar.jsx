import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../../utils/cn';

const ProgressBar = ({ 
  progress = 0, 
  className = '',
  showLabel = false,
  gradient = 'from-orange-500 to-blue-500'
}) => {
  return (
    <div className={cn('relative w-full', className)}>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-6 right-0 text-xs font-semibold text-gray-600 dark:text-gray-400"
        >
          {Math.round(progress)}%
        </motion.span>
      )}
    </div>
  );
};

export default ProgressBar;
