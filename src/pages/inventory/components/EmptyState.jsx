import { motion } from 'framer-motion';
import { Package, Search, Plus } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

const EmptyState = ({ hasProducts, hasFilters, onNewProduct, onClearFilters }) => {
  const { isDarkMode } = useThemeStore();

  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          flex flex-col items-center justify-center py-20 px-6
          rounded-2xl backdrop-blur-xl
          ${isDarkMode
            ? 'bg-gray-900/80 border-[2px] border-gray-700/80'
            : 'bg-white/80 border-[2px] border-gray-200'
          }
        `}
      >
        <div className={`
          w-20 h-20 rounded-full flex items-center justify-center mb-6
          ${isDarkMode
            ? 'bg-gray-800'
            : 'bg-gray-100'
          }
        `}>
          <Search className={`w-10 h-10 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
        </div>

        <h3 className={`text-2xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Nenhum produto encontrado
        </h3>

        <p className={`text-center mb-6 max-w-md ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Não encontramos produtos com os filtros aplicados. Tente ajustar os filtros ou limpar a busca.
        </p>

        <button
          onClick={onClearFilters}
          className={`
            px-6 py-3 rounded-xl font-semibold transition-all
            ${isDarkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          Limpar Filtros
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex flex-col items-center justify-center py-20 px-6
        rounded-2xl backdrop-blur-xl
        ${isDarkMode
          ? 'bg-gray-900/80 border-[2px] border-gray-700/80'
          : 'bg-white/80 border-[2px] border-gray-200'
        }
      `}
    >
      <div className={`
        w-24 h-24 rounded-full flex items-center justify-center mb-6
        ${isDarkMode
          ? 'bg-gradient-to-br from-blue-600/20 to-blue-700/20'
          : 'bg-gradient-to-br from-blue-100 to-blue-50'
        }
      `}>
        <Package className={`w-12 h-12 ${
          isDarkMode ? 'text-blue-400' : 'text-blue-600'
        }`} />
      </div>

      <h3 className={`text-2xl font-bold mb-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Nenhum produto cadastrado
      </h3>

      <p className={`text-center mb-8 max-w-md ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Comece adicionando seu primeiro produto ao inventário. Você poderá gerenciar estoque, preços e muito mais.
      </p>

      <button
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
        Adicionar Primeiro Produto
      </button>
    </motion.div>
  );
};

export default EmptyState;
