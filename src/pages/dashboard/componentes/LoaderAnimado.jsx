import { motion } from 'framer-motion';

/**
 * Componente de Loading com animação Apple-like
 * Skeleton loaders para diferentes tipos de conteúdo
 */

export const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
  >
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3"></div>
    </div>
  </motion.div>
);

export const SkeletonChart = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
  >
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>
  </motion.div>
);

export const SkeletonList = ({ items = 3 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
  >
    <div className="animate-pulse space-y-3">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
    />
  </div>
);

const LoaderAnimado = ({ tipo = 'card', items = 3 }) => {
  switch (tipo) {
    case 'chart':
      return <SkeletonChart />;
    case 'list':
      return <SkeletonList items={items} />;
    case 'spinner':
      return <LoadingSpinner />;
    case 'card':
    default:
      return <SkeletonCard />;
  }
};

export default LoaderAnimado;
