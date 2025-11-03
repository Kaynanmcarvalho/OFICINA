/**
 * StatusCard Component
 * Card premium para exibir métricas de status da oficina
 * Design Apple-level com glassmorphism e animações fluidas
 */

import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatusCard = ({ 
  title, 
  count, 
  icon: Icon, // eslint-disable-line no-unused-vars
  color = 'blue',
  trend = 0,
  delay = 0 
}) => {
  // Configuração de cores por tipo
  const colorConfig = {
    amber: {
      gradient: 'from-amber-500 to-amber-600',
      bg: 'from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20',
      glow: 'rgba(245, 158, 11, 0.3)',
      text: 'text-amber-600 dark:text-amber-400',
      icon: 'text-amber-500',
    },
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20',
      glow: 'rgba(59, 130, 246, 0.3)',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-500',
    },
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-900/20',
      glow: 'rgba(16, 185, 129, 0.3)',
      text: 'text-emerald-600 dark:text-emerald-400',
      icon: 'text-emerald-500',
    },
    gray: {
      gradient: 'from-gray-500 to-gray-600',
      bg: 'from-gray-50/50 to-gray-100/30 dark:from-gray-800/30 dark:to-gray-700/20',
      glow: 'rgba(107, 114, 128, 0.3)',
      text: 'text-gray-600 dark:text-gray-400',
      icon: 'text-gray-500',
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  // Ícone de tendência
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : 'text-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.2, 0.9, 0.2, 1] 
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      {/* Glow effect externo */}
      <div 
        className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${config.glow}, transparent 70%)`
        }}
      />

      {/* Card principal - BORDAS REALÇADAS 50% NO MODO CLARO */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border-[3px] border-gray-600 dark:border-gray-700/30 shadow-[0_6px_18px_rgba(0,0,0,0.12)] dark:shadow-2xl transition-all duration-300 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] dark:group-hover:shadow-3xl">
        
        {/* Gradiente de fundo sutil */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-50`} />
        
        {/* Reflexo de vidro no topo */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
        
        {/* Conteúdo */}
        <div className="relative p-6 space-y-4">
          
          {/* Header com ícone */}
          <div className="flex items-start justify-between">
            {/* Ícone com gradiente */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {/* Glow do ícone */}
              <div 
                className="absolute inset-0 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"
                style={{ background: config.glow }}
              />
              
              {/* Container do ícone */}
              <div className={`relative p-3 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>

            {/* Badge de tendência */}
            {trend !== 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 ${trendColor}`}
              >
                <TrendIcon className="w-3 h-3" />
                <span className="text-xs font-semibold">
                  {Math.abs(trend)}%
                </span>
              </motion.div>
            )}
          </div>

          {/* Contador principal */}
          <div className="space-y-1">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: delay + 0.1,
                ease: [0.2, 0.9, 0.2, 1] 
              }}
            >
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {count}
              </h3>
            </motion.div>
            
            <p className="text-sm font-bold text-gray-700 dark:text-gray-400">
              {title}
            </p>
          </div>
        </div>

        {/* Borda inferior com gradiente */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent" />
      </div>
    </motion.div>
  );
};

export default StatusCard;
