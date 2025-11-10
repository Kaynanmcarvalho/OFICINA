import { motion } from 'framer-motion';
import { Package, Plus } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

const InventoryHeader = ({ productCount, onNewProduct }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center
            ${isDarkMode
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/50'
              : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30'
            }
          `}>
            <Package className="w-7 h-7 text-white" />
          </div>

          <div>
            <h1 className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Inventário
            </h1>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {productCount} {productCount === 1 ? 'produto' : 'produtos'} cadastrados
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewProduct}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl
            font-semibold transition-all
            ${isDarkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
            }
          `}
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InventoryHeader;
