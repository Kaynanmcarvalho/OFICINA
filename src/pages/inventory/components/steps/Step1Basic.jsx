import { useThemeStore } from '../../../../store/themeStore';
import { useProductStore } from '../../../../store/productStore';
import { X } from 'lucide-react';
import { useState } from 'react';

const Step1Basic = ({ formData, updateFormData }) => {
  const { isDarkMode } = useThemeStore();
  const { categories } = useProductStore();
  const [tagInput, setTagInput] = useState('');

  const units = ['UN', 'KG', 'L', 'M', 'M²', 'M³', 'CX', 'PC', 'PAR'];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      updateFormData({
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    updateFormData({
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      {/* Nome e Marca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Nome do Produto *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Ex: Filtro de Óleo"
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
            `}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Marca
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => updateFormData({ brand: e.target.value })}
            placeholder="Ex: Bosch"
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
            `}
          />
        </div>
      </div>

      {/* Modelo */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Modelo
        </label>
        <input
          type="text"
          value={formData.model}
          onChange={(e) => updateFormData({ model: e.target.value })}
          placeholder="Ex: OF-1234"
          className={`
            w-full px-4 py-3 rounded-xl text-sm
            transition-all
            ${isDarkMode
              ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }
          `}
        />
      </div>

      {/* Categoria e Subcategoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Categoria *
          </label>
          <select
            value={formData.category}
            onChange={(e) => updateFormData({ category: e.target.value })}
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white focus:border-blue-500'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 focus:border-blue-500'
              }
            `}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Subcategoria
          </label>
          <input
            type="text"
            value={formData.subcategory}
            onChange={(e) => updateFormData({ subcategory: e.target.value })}
            placeholder="Ex: Filtros de Motor"
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
            `}
          />
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Descrição Técnica
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Descreva as características técnicas do produto..."
          rows={4}
          className={`
            w-full px-4 py-3 rounded-xl text-sm resize-none
            transition-all
            ${isDarkMode
              ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }
          `}
        />
      </div>

      {/* Unidade, SKU e Código de Barras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Unidade de Medida
          </label>
          <select
            value={formData.unit}
            onChange={(e) => updateFormData({ unit: e.target.value })}
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white focus:border-blue-500'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 focus:border-blue-500'
              }
            `}
          >
            {units.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            SKU / Código Interno
          </label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => updateFormData({ sku: e.target.value })}
            placeholder="Ex: FLT-001"
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
            `}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Código de Barras
          </label>
          <input
            type="text"
            value={formData.barcode}
            onChange={(e) => updateFormData({ barcode: e.target.value })}
            placeholder="Ex: 7891234567890"
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
            `}
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Tags e Compatibilidades
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Ex: Gol, Palio, Universal..."
            className={`
              flex-1 px-4 py-3 rounded-xl text-sm
              transition-all
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
            `}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all
              ${isDarkMode
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            Adicionar
          </button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                  ${isDarkMode
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'bg-blue-100 text-blue-700'
                  }
                `}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:opacity-70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1Basic;


