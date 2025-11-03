/**
 * ProductivityIndicator Component
 * Indicador de produtividade diária com progress bar animado
 * Design Apple-level com feedback visual motivacional
 */

import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Target, TrendingUp, Zap } from 'lucide-react';

const ProductivityIndicator = ({ completed = 0, target = 10 }) => {
  // Calcular progresso
  const progress = Math.min((completed / target) * 100, 100);
  const remaining = Math.max(target - completed, 0);
  
  // Status e mensagem motivacional
  const getStatus = () => {
    if (progress >= 100) return {
      label: 'Meta atingida! 🎉',
      color: 'emerald',
      icon: Zap,
      message: 'Excelente trabalho hoje!'
    };
    if (progress >= 80) return {
      label: 'Quase lá!',
      color: 'blue',
      icon: TrendingUp,
      message: `Faltam apenas ${remaining} ${remaining === 1 ? 'veículo' : 'veículos'}`
    };
    if (progress >= 50) return {
      label: 'Bom ritmo',
      color: 'amber',
      icon: Target,
      message: 'Continue assim!'
    };
    return {
      label: 'Vamos lá!',
      color: 'gray',
      icon: Target,
      message: `${remaining} ${remaining === 1 ? 'veículo' : 'veículos'} para a meta`
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  // Configuração de cores
  const colorConfig = {
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'shadow-emerald-500/30',
    },
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-600 dark:text-blue-400',
      glow: 'shadow-blue-500/30',
    },
    amber: {
      gradient: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/30',
    },
    gray: {
      gradient: 'from-gray-500 to-gray-600',
      bg: 'bg-gray-500/10 dark:bg-gray-500/20',
      text: 'text-gray-600 dark:text-gray-400',
      glow: 'shadow-gray-500/30',
    },
  };

  const config = colorConfig[status.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.9, 0.2, 1] }}
      className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border-[3px] border-gray-600 dark:border-gray-700/30 shadow-[0_6px_18px_rgba(0,0,0,0.12)] dark:shadow-2xl"
    >
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/30 dark:to-transparent" />
      
      {/* Reflexo de vidro */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
      
      {/* Conteúdo */}
      <div className="relative p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={progress >= 100 ? {
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 0.6,
                ease: "easeInOut"
              }}
              className={`p-2.5 rounded-xl ${config.bg}`}
            >
              <StatusIcon className={`w-5 h-5 ${config.text}`} />
            </motion.div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Produtividade Diária
              </h3>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-400">
                {status.message}
              </p>
            </div>
          </div>

          {/* Badge de status */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`px-3 py-1.5 rounded-full ${config.bg} ${config.text} text-sm font-semibold`}
          >
            {status.label}
          </motion.div>
        </div>

        {/* Contador e Meta */}
        <div className="flex items-end justify-between">
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-baseline gap-2"
            >
              <span className="text-5xl font-bold text-gray-900 dark:text-white">
                {completed}
              </span>
              <span className="text-2xl text-gray-400 dark:text-gray-600">
                / {target}
              </span>
            </motion.div>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-400 mt-1">
              veículos concluídos
            </p>
          </div>

          {/* Percentual */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-right"
          >
            <div className={`text-3xl font-bold ${config.text}`}>
              {Math.round(progress)}%
            </div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-500">
              da meta
            </p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          {/* Track */}
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            {/* Progress com animação */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 1,
                delay: 0.4,
                ease: [0.2, 0.9, 0.2, 1]
              }}
              className={`h-full bg-gradient-to-r ${config.gradient} relative overflow-hidden`}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>

          {/* Marcadores de meta */}
          <div className="absolute -top-1 left-0 right-0 flex justify-between px-1">
            {[25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className={`w-0.5 h-5 rounded-full transition-colors ${
                  progress >= mark 
                    ? 'bg-gray-400 dark:bg-gray-600' 
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                style={{ marginLeft: mark === 25 ? '25%' : '0' }}
              />
            ))}
          </div>
        </div>

        {/* Estatísticas adicionais */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {remaining}
            </div>
            <div className="text-xs font-bold text-gray-600 dark:text-gray-500">
              Restantes
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {target > 0 ? Math.round((completed / target) * 100) : 0}%
            </div>
            <div className="text-xs font-bold text-gray-600 dark:text-gray-500">
              Completo
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {progress >= 100 ? '🎯' : '⏱️'}
            </div>
            <div className="text-xs font-bold text-gray-600 dark:text-gray-500">
              Status
            </div>
          </div>
        </div>
      </div>

      {/* Borda inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent" />
    </motion.div>
  );
};

export default ProductivityIndicator;
