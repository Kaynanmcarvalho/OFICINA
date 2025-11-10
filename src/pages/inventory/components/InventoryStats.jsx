import { motion } from 'framer-motion';
import { Package, AlertTriangle, DollarSign, Archive, TrendingDown, Clock } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

const InventoryStats = ({ stats }) => {
  const { isDarkMode } = useThemeStore();

  const statCards = [
    {
      icon: Package,
      label: 'Total de Produtos',
      value: stats.totalProducts,
      color: 'blue',
      bgGradient: isDarkMode
        ? 'from-blue-600/20 to-blue-700/20'
        : 'from-blue-100 to-blue-50',
      iconBg: isDarkMode ? 'bg-blue-600/30' : 'bg-blue-500/20',
      textColor: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    },
    {
      icon: DollarSign,
      label: 'Valor Total',
      value: `R$ ${stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      color: 'green',
      bgGradient: isDarkMode
        ? 'from-green-600/20 to-green-700/20'
        : 'from-green-100 to-green-50',
      iconBg: isDarkMode ? 'bg-green-600/30' : 'bg-green-500/20',
      textColor: isDarkMode ? 'text-green-400' : 'text-green-600',
    },
    {
      icon: AlertTriangle,
      label: 'Estoque Baixo',
      value: stats.lowStockCount,
      color: 'yellow',
      bgGradient: isDarkMode
        ? 'from-yellow-600/20 to-yellow-700/20'
        : 'from-yellow-100 to-yellow-50',
      iconBg: isDarkMode ? 'bg-yellow-600/30' : 'bg-yellow-500/20',
      textColor: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
      alert: stats.lowStockCount > 0,
    },
    {
      icon: TrendingDown,
      label: 'Sem Estoque',
      value: stats.outOfStockCount,
      color: 'red',
      bgGradient: isDarkMode
        ? 'from-red-600/20 to-red-700/20'
        : 'from-red-100 to-red-50',
      iconBg: isDarkMode ? 'bg-red-600/30' : 'bg-red-500/20',
      textColor: isDarkMode ? 'text-red-400' : 'text-red-600',
      alert: stats.outOfStockCount > 0,
    },
    {
      icon: Clock,
      label: 'Vencendo em 30 dias',
      value: stats.expiringCount,
      color: 'orange',
      bgGradient: isDarkMode
        ? 'from-orange-600/20 to-orange-700/20'
        : 'from-orange-100 to-orange-50',
      iconBg: isDarkMode ? 'bg-orange-600/30' : 'bg-orange-500/20',
      textColor: isDarkMode ? 'text-orange-400' : 'text-orange-600',
      alert: stats.expiringCount > 0,
    },
    {
      icon: Archive,
      label: 'Reservados',
      value: stats.totalReserved,
      color: 'purple',
      bgGradient: isDarkMode
        ? 'from-purple-600/20 to-purple-700/20'
        : 'from-purple-100 to-purple-50',
      iconBg: isDarkMode ? 'bg-purple-600/30' : 'bg-purple-500/20',
      textColor: isDarkMode ? 'text-purple-400' : 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -4 }}
          className={`
            relative p-5 rounded-2xl backdrop-blur-xl
            transition-all duration-300
            ${isDarkMode
              ? 'bg-gray-900/80 border-[2px] border-gray-700/80 hover:border-gray-600 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
              : 'bg-white/80 border-[2px] border-gray-200 hover:border-gray-300 shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
            }
          `}
        >
          {stat.alert && (
            <div className="absolute top-3 right-3">
              <div className={`w-2 h-2 rounded-full ${
                stat.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
              } animate-pulse`} />
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              bg-gradient-to-br ${stat.bgGradient}
            `}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </p>
              <p className={`text-2xl font-bold truncate ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default InventoryStats;
