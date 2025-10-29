import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Cartão de Indicador (KPI Card)
 * Design Apple-like com animações suaves
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
  const cores = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    gray: 'from-gray-500 to-gray-600'
  };

  const getTendenciaIcon = () => {
    if (tendencia === 'up') return <TrendingUp className="w-4 h-4" />;
    if (tendencia === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTendenciaColor = () => {
    if (tendencia === 'up') return 'text-green-500';
    if (tendencia === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      {/* Gradient Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cores[cor]} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${cores[cor]} rounded-xl shadow-lg`}>
            <Icone className="w-6 h-6 text-white" />
          </div>
          
          {percentual && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTendenciaColor()}`}>
              {getTendenciaIcon()}
              <span>{percentual}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="space-y-1">
          <motion.h3 
            className="text-3xl font-bold text-gray-900 dark:text-white"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ) : (
              valor
            )}
          </motion.h3>
          
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {titulo}
          </p>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700 transition-colors duration-300" />
    </motion.div>
  );
};

export default CartaoIndicador;
