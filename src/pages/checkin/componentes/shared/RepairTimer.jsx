/**
 * RepairTimer Component
 * Cronômetro visual mostrando tempo decorrido desde o check-in
 * Design Apple-level com código de cores por duração
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

const RepairTimer = ({ startDate, className = '' }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Calcular tempo decorrido inicial
    const calculateElapsed = () => {
      const start = new Date(startDate);
      const now = new Date();
      return now - start;
    };

    setElapsed(calculateElapsed());

    // Atualizar a cada minuto
    const interval = setInterval(() => {
      setElapsed(calculateElapsed());
    }, 60000); // 60 segundos

    return () => clearInterval(interval);
  }, [startDate]);

  // Formatar duração
  const formatDuration = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return {
        text: `${days}d ${hours % 24}h`,
        full: `${days} ${days === 1 ? 'dia' : 'dias'} e ${hours % 24} ${hours % 24 === 1 ? 'hora' : 'horas'}`
      };
    }
    if (hours > 0) {
      return {
        text: `${hours}h ${minutes}m`,
        full: `${hours} ${hours === 1 ? 'hora' : 'horas'} e ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
      };
    }
    return {
      text: `${minutes}m`,
      full: `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
    };
  };

  // Determinar cor baseado na duração
  const getColorConfig = () => {
    const hours = elapsed / 3600000;
    
    if (hours > 48) {
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        icon: AlertCircle,
        pulse: true,
      };
    }
    if (hours > 24) {
      return {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        icon: Clock,
        pulse: false,
      };
    }
    return {
      bg: 'bg-gray-50 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-700',
      icon: Clock,
      pulse: false,
    };
  };

  const config = getColorConfig();
  const duration = formatDuration(elapsed);
  const TimerIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${config.bg} ${config.border} ${className}`}
      title={duration.full}
    >
      <motion.div
        animate={config.pulse ? {
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <TimerIcon className={`w-3.5 h-3.5 ${config.text}`} />
      </motion.div>
      <span className={`text-xs font-semibold ${config.text}`}>
        {duration.text}
      </span>
    </motion.div>
  );
};

export default RepairTimer;
