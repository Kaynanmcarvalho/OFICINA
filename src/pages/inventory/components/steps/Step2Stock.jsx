import { useThemeStore } from '../../../../store/themeStore';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const Step2Stock = ({ formData, updateFormData }) => {
  const { isDarkMode } = useThemeStore();
  const [newLot, setNewLot] = useState({
    lote: '',
    fabricacao: '',
    validade: '',
    quantidade: 0,
  });

  const handleAddLot = () => {
    if (newLot.lote && newLot.quantidade > 0) {
      updateFormData({
        lots: [...(formData.lots || []), { ...newLot, id: Date.now().toString() }]
      });
      setNewLot({ lote: '', fabricacao: '', validade: '', quantidade: 0 });
    }
  };

  const handleRemoveLot = (lotId) => {
    updateFormData({
      lots: formData.lots.filter(lot => lot.id !== lotId)
    });
  };

  return (
    <div className="space-y-6">
      {/* Estoque Atual e Mínimo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Quantidade Atual
          </label>
          <input
            type="number"
            value={formData.stock_total === 0 ? '' : formData.stock_total}
            onChange={(e) => updateFormData({ stock_total: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
            min="0"
            placeholder="0"
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900'
              }
            `}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Estoque Mínimo
          </label>
          <input
            type="number"
            value={formData.stock_min === 0 ? '' : formData.stock_min}
            onChange={(e) => updateFormData({ stock_min: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
            min="0"
            placeholder="0"
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900'
              }
            `}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Localização Física
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="Ex: Prateleira A3"
            className={`
              w-full px-4 py-3 rounded-xl text-sm
              ${isDarkMode
                ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500'
                : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400'
              }
            `}
          />
        </div>
      </div>

      {/* Lotes */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Lotes e Validade
        </h3>

        {/* Add New Lot */}
        <div className={`
          p-4 rounded-xl mb-4 border-[2px]
          ${isDarkMode ? 'bg-gray-800/50 border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' : 'bg-gray-50 border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'}
        `}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Nº do Lote
              </label>
              <input
                type="text"
                value={newLot.lote}
                onChange={(e) => setNewLot({ ...newLot, lote: e.target.value })}
                placeholder="Ex: 2024-01"
                className={`
                  w-full px-3 py-2 rounded-lg text-sm
                  ${isDarkMode
                    ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500'
                    : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400'
                  }
                `}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Data de Fabricação
              </label>
              <input
                type="date"
                value={newLot.fabricacao}
                onChange={(e) => setNewLot({ ...newLot, fabricacao: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg text-sm
                  ${isDarkMode
                    ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white'
                    : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900'
                  }
                `}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Data de Validade
              </label>
              <input
                type="date"
                value={newLot.validade}
                onChange={(e) => setNewLot({ ...newLot, validade: e.target.value })}
                className={`
                  w-full px-3 py-2 rounded-lg text-sm
                  ${isDarkMode
                    ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white'
                    : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900'
                  }
                `}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Quantidade
              </label>
              <input
                type="number"
                value={newLot.quantidade === 0 ? '' : newLot.quantidade}
                onChange={(e) => setNewLot({ ...newLot, quantidade: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                className={`
                  w-full px-3 py-2 rounded-lg text-sm
                  ${isDarkMode
                    ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)] text-white placeholder-gray-500'
                    : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-gray-900 placeholder-gray-400'
                  }
                `}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddLot}
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
            Adicionar Lote
          </button>
        </div>

        {/* Lots List */}
        {formData.lots && formData.lots.length > 0 && (
          <div className="space-y-2">
            {formData.lots.map((lot) => (
              <div
                key={lot.id}
                className={`
                  flex items-center justify-between p-4 rounded-xl
                  ${isDarkMode
                    ? 'bg-gray-800 border-[2px] border-gray-600/70 shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                    : 'bg-white border-[2px] border-gray-400/70 shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                  }
                `}
              >
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      Lote
                    </div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {lot.lote}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      Fabricação
                    </div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {lot.fabricacao ? new Date(lot.fabricacao).toLocaleDateString('pt-BR') : '-'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      Validade
                    </div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {lot.validade ? new Date(lot.validade).toLocaleDateString('pt-BR') : '-'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      Quantidade
                    </div>
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {lot.quantidade}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveLot(lot.id)}
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

export default Step2Stock;




