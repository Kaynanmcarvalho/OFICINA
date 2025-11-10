import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import './BudgetStats.css';

const BudgetStats = ({ stats }) => {
  const statCards = [
    {
      label: 'Total de Orçamentos',
      value: stats.total,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      color: 'yellow'
    },
    {
      label: 'Aprovados',
      value: stats.approved + stats.partiallyApproved,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Taxa de Conversão',
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="budget-stat-card bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
              {stat.label}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BudgetStats;
