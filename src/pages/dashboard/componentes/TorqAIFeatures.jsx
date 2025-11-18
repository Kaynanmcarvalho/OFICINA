import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { 
  Brain, 
  Mic, 
  BookOpen, 
  TrendingUp, 
  Zap
} from 'lucide-react';

const TorqAIFeatures = () => {
  const navigate = useNavigate();

  // Memoizar features para evitar re-renders
  const features = useMemo(() => [
    {
      id: 'diagnostico',
      title: 'Diagnóstico IA',
      subtitle: 'No Check-in',
      icon: Brain,
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      iconBg: 'bg-blue-100 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-500/15',
      path: '/checkin'
    },
    {
      id: 'voz',
      title: 'Voz',
      subtitle: 'Orçamentos',
      icon: Mic,
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      iconBg: 'bg-orange-100 dark:bg-orange-500/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      hoverBg: 'hover:bg-orange-100 dark:hover:bg-orange-500/15',
      path: '/orcamentos'
    },
    {
      id: 'guia',
      title: 'Guia',
      subtitle: 'Mecânico',
      icon: BookOpen,
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      iconBg: 'bg-purple-100 dark:bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-500/15',
      path: '/tools'
    },
    {
      id: 'previsao',
      title: 'Previsão',
      subtitle: 'Estoque',
      icon: TrendingUp,
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      hoverBg: 'hover:bg-indigo-100 dark:hover:bg-indigo-500/15',
      path: '/inventory'
    }
  ], []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-6"
    >
      {/* Header minimalista */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Funcionalidades TORQ AI
        </h2>
      </div>

      {/* Grid de features - design limpo e consistente */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.2
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.15 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(feature.path)}
              className={`
                group
                relative
                ${feature.bg}
                ${feature.hoverBg}
                rounded-2xl
                p-4
                text-left
                border-2 border-gray-200/80 dark:border-gray-600/40
                shadow-lg dark:shadow-xl dark:shadow-black/20
                hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/30
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900
                backdrop-blur-sm
                will-change-transform
              `}
            >
              {/* Ícone */}
              <div className="mb-3">
                <div className={`
                  inline-flex items-center justify-center
                  w-12 h-12
                  rounded-2xl
                  ${feature.iconBg}
                  shadow-md dark:shadow-lg dark:shadow-black/10
                  ring-1 ring-black/5 dark:ring-white/10
                  transition-all duration-200
                  group-hover:scale-110 group-hover:shadow-lg dark:group-hover:shadow-xl
                  will-change-transform
                `}>
                  <Icon 
                    className={`w-6 h-6 ${feature.iconColor}`}
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              {/* Texto */}
              <div className="space-y-0.5">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {feature.subtitle}
                </p>
              </div>

              {/* Indicador sutil de hover */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <svg 
                  className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TorqAIFeatures;
