import { useThemeStore } from '../../../../store/themeStore';
import { Plus, Trash2, Lightbulb, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { suggestCompatibleVehicles } from '../../../../utils/productSuggestions';

const Step5Compatibility = ({ formData, updateFormData }) => {
  const { isDarkMode } = useThemeStore();
  const [newCompat, setNewCompat] = useState({
    marca: '',
    modelo: '',
    ano_inicial: '',
    ano_final: '',
    motorizacao: '',
  });
  const [suggestedVehicles, setSuggestedVehicles] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

  // Suggest compatible vehicles based on product info
  useEffect(() => {
    if (formData.name || formData.category) {
      const suggestions = suggestCompatibleVehicles(
        formData.name,
        formData.category,
        formData.tags || []
      );

      setSuggestedVehicles(suggestions);
    }
  }, [formData.name, formData.category, formData.tags]);

  const handleAdd = () => {
    if (newCompat.marca && newCompat.modelo) {
      updateFormData({
        compatibilities: [...(formData.compatibilities || []), { ...newCompat, id: Date.now().toString() }]
      });
      setNewCompat({ marca: '', modelo: '', ano_inicial: '', ano_final: '', motorizacao: '' });
    }
  };

  const handleRemove = (id) => {
    updateFormData({
      compatibilities: formData.compatibilities.filter(c => c.id !== id)
    });
  };

  const handleApplySuggestions = () => {
    const newCompatibilities = suggestedVehicles.map(vehicle => ({
      ...vehicle,
      id: Date.now().toString() + Math.random()
    }));
    updateFormData({
      compatibilities: [...(formData.compatibilities || []), ...newCompatibilities]
    });
    setSuggestedVehicles([]);
    setSelectedSuggestions([]);
  };

  const handleApplySelectedSuggestions = () => {
    const selectedVehicles = suggestedVehicles.filter((_, index) => 
      selectedSuggestions.includes(index)
  );

  const newCompatibilities = selectedVehicles.map(vehicle => ({
      ...vehicle,
      id: Date.now().toString() + Math.random()
    }));
    updateFormData({
      compatibilities: [...(formData.compatibilities || []), ...newCompatibilities]
    });
    // Remove selected vehicles from suggestions
    const remainingVehicles = suggestedVehicles.filter((_, index) => 
      !selectedSuggestions.includes(index)
    );
    setSuggestedVehicles(remainingVehicles);
    setSelectedSuggestions([]);
  };

  const handleToggleSelection = (index) => {
    setSelectedSuggestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectedSuggestions.length === suggestedVehicles.length) {
      setSelectedSuggestions([]);
    } else {
      setSelectedSuggestions(suggestedVehicles.map((_, index) => index));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Compatibilidade com Veículos
          </h3>

          {suggestedVehicles.length > 0 && (
            <button
              type="button"
              onClick={handleApplySuggestions}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                transition-all
                ${isDarkMode
                  ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }
              `}
            >
              <Sparkles className="w-4 h-4" />
              Adicionar {suggestedVehicles.length} Sugestões
            </button>
          )}
        </div>

        {/* Sugestões */}
        {suggestedVehicles.length > 0 && (
          <div className={`
            p-4 rounded-xl mb-4
            ${isDarkMode
              ? 'bg-purple-600/10 border-[2px] border-purple-600/30'
              : 'bg-purple-50 border-[2px] border-purple-200'
            }
          `}>
            <div className="flex items-start gap-3 mb-3">
              <Lightbulb className={`w-5 h-5 flex-shrink-0 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-900'
                }`}>
                  Veículos Compatíveis Sugeridos ({suggestedVehicles.length})
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-700'
                }`}>
                  Selecione os veículos que deseja adicionar à compatibilidade.
                </p>
              </div>
            </div>

            {/* Controles de seleção */}
            <div className="flex items-center gap-3 mb-3">
              <button
                type="button"
                onClick={handleSelectAll}
                className={`
                  text-sm font-medium transition-colors
                  ${isDarkMode
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-purple-600 hover:text-purple-700'
                  }
                `}
              >
                {selectedSuggestions.length === suggestedVehicles.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </button>
              
              {selectedSuggestions.length > 0 && (
                <span className={`text-sm $${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {selectedSuggestions.length} selecionado(s)
                </span>
              )}
            </div>

            {/* Lista de veículos com checkboxes */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {suggestedVehicles.map((vehicle, index) => (
                <label
                  key={index}
                  className={`
                    flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${selectedSuggestions.includes(index)
                      ? isDarkMode
                        ? 'bg-purple-600/20 border-[2px] border-purple-600/50'
                        : 'bg-purple-100 border-[2px] border-purple-300'
                      : isDarkMode
                        ? 'bg-gray-800 hover:bg-gray-700 border-[2px] border-transparent'
                        : 'bg-white hover:bg-gray-50 border-[2px] border-transparent'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedSuggestions.includes(index)}
                    onChange={() => handleToggleSelection(index)}
                    className={`
                      w-4 h-4 rounded border-2 mt-0.5
                      ${isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-purple-600'
                        : 'bg-white border-gray-300 text-purple-600'
                      }
                    `}
                  />
                  <div className="flex-1 text-sm">
                    <div className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {vehicle.marca} {vehicle.modelo}
                    </div>
                    <div className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {vehicle.ano_inicial && vehicle.ano_final
                        ? `${vehicle.ano_inicial} - ${vehicle.ano_final}`
                        : 'Todos os anos'
                      }
                      {vehicle.motorizacao && ` • ${vehicle.motorizacao}`}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Botões de ação */}
            <div className={`flex items-center gap-3 mt-4 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={handleApplySuggestions}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                  transition-all border-[2px]
                  ${isDarkMode
                    ? 'bg-purple-600 border-purple-500/60 hover:bg-purple-500 text-white shadow-[0_4px_12px_rgba(168,85,247,0.4)]'
                    : 'bg-purple-600 border-purple-500/60 hover:bg-purple-700 text-white shadow-[0_4px_12px_rgba(147,51,234,0.3)]'
                  }
                `}
              >
                <Sparkles className="w-4 h-4" />
                Adicionar Todos ({suggestedVehicles.length})
              </button>

              {selectedSuggestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplySelectedSuggestions}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                    transition-all border-[2px]
                    ${isDarkMode
                      ? 'bg-blue-600 border-blue-500/60 hover:bg-blue-500 text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)]'
                      : 'bg-blue-600 border-blue-500/60 hover:bg-blue-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                    }
                  `}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Selecionados ({selectedSuggestions.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Add Form */}
        <div className={`
          p-4 rounded-xl mb-4 border-[2px]
          ${isDarkMode ? 'bg-gray-800/50 border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' : 'bg-gray-50 border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'}
        `}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
            <input
              type="text"
              value={newCompat.marca}
              onChange={(e) => setNewCompat({ ...newCompat, marca: e.target.value })}
              placeholder="Marca"
              className={`
                px-3 py-2 rounded-lg text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white'
                  : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900'
                }
              `}
            />
            <input
              type="text"
              value={newCompat.modelo}
              onChange={(e) => setNewCompat({ ...newCompat, modelo: e.target.value })}
              placeholder="Modelo"
              className={`
                px-3 py-2 rounded-lg text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white'
                  : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900'
                }
              `}
            />
            <input
              type="text"
              value={newCompat.ano_inicial}
              onChange={(e) => setNewCompat({ ...newCompat, ano_inicial: e.target.value })}
              placeholder="Ano Inicial"
              className={`
                px-3 py-2 rounded-lg text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white'
                  : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900'
                }
              `}
            />
            <input
              type="text"
              value={newCompat.ano_final}
              onChange={(e) => setNewCompat({ ...newCompat, ano_final: e.target.value })}
              placeholder="Ano Final"
              className={`
                px-3 py-2 rounded-lg text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white'
                  : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900'
                }
              `}
            />
            <input
              type="text"
              value={newCompat.motorizacao}
              onChange={(e) => setNewCompat({ ...newCompat, motorizacao: e.target.value })}
              placeholder="Motorização"
              className={`
                px-3 py-2 rounded-lg text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white'
                  : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900'
                }
              `}
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
              border-[2px]
              ${isDarkMode
                ? 'bg-blue-600 border-blue-500/60 hover:bg-blue-500 text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)]'
                : 'bg-blue-600 border-blue-500/60 hover:bg-blue-700 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
              }
            `}
          >
            <Plus className="w-4 h-4" />
            Adicionar Compatibilidade
          </button>
        </div>

        {/* List */}
        {formData.compatibilities && formData.compatibilities.length > 0 && (
          <div className="space-y-2">
            {formData.compatibilities.map((compat) => (
              <div
                key={compat.id}
                className={`
                  flex items-center justify-between p-4 rounded-xl
                  ${isDarkMode
                    ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                    : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                  }
                `}
              >
                <div className="flex-1">
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {compat.marca} {compat.modelo}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {compat.ano_inicial && compat.ano_final
                      ? `${compat.ano_inicial} - ${compat.ano_final}`
                      : compat.ano_inicial || compat.ano_final || 'Todos os anos'
                    }
                    {compat.motorizacao && ` • ${compat.motorizacao}`}
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(compat.id)}
                  className={`
                    p-2 rounded-lg transition-colors
                    ${isDarkMode
                      ? 'hover:bg-red-900/20 text-red-400'
                      : 'hover:bg-red-50 text-red-600'
                    }
                  `}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5Compatibility;

