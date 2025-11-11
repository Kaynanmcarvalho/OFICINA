import { Search, X } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';

const InventorySearchBar = ({ value, onChange, isLoading, resultCount }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="relative">
      <div className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl
        backdrop-blur-xl transition-all duration-300
        ${isDarkMode
          ? 'bg-gray-900/80 border-[3px] border-gray-600/80 focus-within:border-blue-500 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
          : 'bg-white/80 border-[3px] border-gray-400/80 focus-within:border-blue-500 shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
        }
      `}>
        <Search className={`w-5 h-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar por nome, SKU, código de barras, marca..."
          className={`
            flex-1 bg-transparent outline-none text-sm
            ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
          `}
          data-search-input
        />

        {value && (
          <button
            onClick={() => onChange('')}
            className={`
              p-1 rounded-lg transition-colors
              ${isDarkMode
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {value && (
        <div className={`
          absolute top-full mt-2 left-0 px-3 py-1.5 rounded-lg text-xs
          ${isDarkMode
            ? 'bg-gray-800 text-gray-300'
            : 'bg-gray-100 text-gray-700'
          }
        `}>
          {isLoading ? 'Buscando...' : `${resultCount} resultado(s)`}
        </div>
      )}
    </div>
  );
};

export default InventorySearchBar;
