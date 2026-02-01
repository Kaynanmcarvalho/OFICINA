import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../../utils/cn';

const GlassCard = ({ 
  children, 
  className, 
  hover = true, 
  animate = true,
  onClick,
  ...props 
}) => {
  const baseClasses = `
    relative backdrop-blur-xl bg-white/70 dark:bg-gray-900/70
    border border-white/20 dark:border-gray-700/30
    shadow-xl shadow-black/5 dark:shadow-black/20
    rounded-2xl overflow-hidden
  `;
  
  const hoverClasses = hover ? `
    hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/30
    hover:bg-white/80 dark:hover:bg-gray-900/80
    transition-all duration-300 ease-out
    ${onClick ? 'cursor-pointer' : ''}
  ` : '';

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(baseClasses, hoverClasses, className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
  );
}

return (
    <div className={cn(baseClasses, hoverClasses, className)} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;
