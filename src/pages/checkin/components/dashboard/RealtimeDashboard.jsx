import React from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AnimatedCounter from '../ui/AnimatedCounter';

const RealtimeDashboard = ({ checkins = [] }) => {
  // Calculate metrics
  const inProgress = checkins.filter(c => c.status === 'in_progress' || !c.status).length;
  const completed = checkins.filter(c => c.status === 'completed').length;
  const today = checkins.filter(c => {
    const date = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
    const isToday = date.toDateString() === new Date().toDateString();
    return isToday;
  }).length;

  const metrics = [
    {
      id: 'in-progress',
      label: 'Em Atendimento',
      value: inProgress,
      icon: Car,
      gradient: 'from-blue-500 to-blue-600',
      color: '#3B82F6'
    },
    {
      id: 'completed',
      label: 'Concluídos',
      value: completed,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      color: '#10B981'
    },
    {
      id: 'today',
      label: 'Hoje',
      value: today,
      icon: Clock,
      gradient: 'from-orange-500 to-orange-600',
      color: '#F97316'
    },
    {
      id: 'total',
      label: 'Total',
      value: checkins.length,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      color: '#A855F7'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className="p-6 hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                bg-gradient-to-br ${metric.gradient}
              `}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                <AnimatedCounter value={metric.value} />
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metric.label}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

export default RealtimeDashboard;
