import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Cartão de Indicador (KPI Card) - Apple Premium Design
 * Design inspirado em macOS Sonoma e Apple Music
 * Features:
 * - Glassmorphism com blur 40px
 * - Gradientes sutis e profundidade
 * - Animações fluidas
 * - Glow effects em hover
 * - Reflexos de vidro
 * - Suporte dark/light mode
 */

const CartaoIndicador = ({ 
  titulo, 
  valor, 
  icone: Icone, 
  tendencia, 
  percentual, 
  cor = 'blue',
  loading = false 
}) => {
  // Configurações de cor por tipo
  const coresConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      glow: 'rgba(59, 130, 246, 0.3)',
      glowHover: 'rgba(59, 130, 246, 0.5)',
      bg: 'from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20',
      border: 'border-blue-200/50 dark:border-blue-800/30'
    },
    green: {
      gradient: 'from-emerald-500 to-emerald-600',
      glow: 'rgba(16, 185, 129, 0.3)',
      glowHover: 'rgba(16, 185, 129, 0.5)',
      bg: 'from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-900/20',
      border: 'border-emerald-200/50 dark:border-emerald-800/30'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      glow: 'rgba(168, 85, 247, 0.3)',
      glowHover: 'rgba(168, 85, 247, 0.5)',
      bg: 'from-purple-50/50 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20',
      border: 'border-purple-200/50 dark:border-purple-800/30'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      glow: 'rgba(249, 115, 22, 0.3)',
      glowHover: 'rgba(249, 115, 22, 0.5)',
      bg: 'from-orange-50/50 to-orange-100/30 dark:from-orange-950/30 dark:to-orange-900/20',
      border: 'border-orange-200/50 dark:border-orange-800/30'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      glow: 'rgba(239, 68, 68, 0.3)',
      glowHover: 'rgba(239, 68, 68, 0.5)',
      bg: 'from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20',
      border: 'border-red-200/50 dark:border-red-800/30'
    }
  };

  const config = coresConfig[cor] || coresConfig.blue;

  const getTendenciaIcon = () => {
    if (tendencia === 'up') return <TrendingUp className="w-4 h-4" />;
    if (tendencia === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTendenciaColor = () => {
    if (tendencia === 'up') return 'text-emerald-600 dark:text-emerald-400';
    if (tendencia === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2, ease: [0.2, 0.9, 0.2, 1] }
      }}
      className="relative group"
    >
      {/* Glow effect externo */}
      <div 
        className="absolute -inset-0.5 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${config.glow}, transparent 70%)`
        }}
      />

      {/* Card principal com glassmorphism */}
      <div className={`
        relative overflow-hidden rounded-[1.75rem]
        bg-white dark:bg-gray-900
        border ${config.border}
        shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-all duration-300
        group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)] dark:group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)]
      `}>
        
        {/* Reflexo de vidro no topo */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
        
        {/* Gradiente de fundo sutil */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-50`} />
        
        {/* Padrão de ruído sutil para textura */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
          }}
        />

        {/* Conteúdo */}
        <div className="relative z-10 p-6">
          {/* Header com ícone e tendência */}
          <div className="flex items-start justify-between mb-6">
            {/* Ícone com gradiente e glow */}
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
              <div className={`
                relative p-3.5 rounded-2xl
                bg-gradient-to-br ${config.gradient}
                shadow-lg
                group-hover:shadow-xl
                transition-shadow duration-300
              `}>
                <Icone className="w-6 h-6 text-white drop-shadow-sm" strokeWidth={2.5} />
              </div>
            </motion.div>
            
            {/* Badge de tendência */}
            {percentual !== undefined && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                  ${getTendenciaColor()}
                  bg-white dark:bg-gray-800
                  border border-gray-200/50 dark:border-gray-700/50
                  shadow-sm
                `}
              >
                {getTendenciaIcon()}
                <span className="text-sm font-semibold">
                  {percentual > 0 ? '+' : ''}{percentual}%
                </span>
              </motion.div>
            )}
          </div>

          {/* Valor e título */}
          <div className="space-y-2">
            {loading ? (
              <div className="space-y-2">
                <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                {/* Valor principal */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.9, 0.2, 1] }}
                >
                  <h3 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {valor.toLocaleString('pt-BR')}
                  </h3>
                </motion.div>
                
                {/* Título/Label */}
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 tracking-wide">
                  {titulo}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Borda inferior com gradiente sutil */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent" />
      </div>
    </motion.div>
  );
};

export default CartaoIndicador;
