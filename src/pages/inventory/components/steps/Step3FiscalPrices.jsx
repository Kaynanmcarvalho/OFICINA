import { useThemeStore } from '../../../../store/themeStore';
import { useEffect, useState } from 'react';
import { suggestFiscalInfo, formatSuggestion } from '../../../../utils/productSuggestions';
import { 
  ncmCodes, 
  cestCodes, 
  cfopCodes, 
  cstCodes, 
  csosnCodes, 
  originCodes, 
  anpCodes,
  getCodeDescription 
} from '../../../../utils/fiscalCodes';
import { Lightbulb, Search } from 'lucide-react';

const Step3FiscalPrices = ({ formData, updateFormData }) => {
  const { isDarkMode } = useThemeStore();
  const [fiscalSuggestion, setFiscalSuggestion] = useState(null);
  const [searchNCM, setSearchNCM] = useState('');
  const [searchCEST, setSearchCEST] = useState('');
  const [searchCFOP, setSearchCFOP] = useState('');
  const [searchANP, setSearchANP] = useState('');

  // Calculate margin when prices change
  useEffect(() => {
    if (formData.cost_price > 0 && formData.sale_price > 0) {
      const margin = ((formData.sale_price - formData.cost_price) / formData.cost_price) * 100;
      updateFormData({ margin: parseFloat(margin.toFixed(2)) });
    }
  }, [formData.cost_price, formData.sale_price]);

  // Suggest fiscal info based on product name and category
  useEffect(() => {
    if (formData.name || formData.category) {
      const suggestion = suggestFiscalInfo(formData.name, formData.category);
      if (suggestion) {
        setFiscalSuggestion(formatSuggestion(suggestion));
      }
    }
  }, [formData.name, formData.category]);

  const updateFiscal = (field, value) => {
    updateFormData({
      fiscal: { ...formData.fiscal, [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      {/* Preços */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Preços
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Preço de Custo
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                R$
              </span>
              <input
                type="number"
                value={formData.cost_price === 0 ? '' : formData.cost_price}
                onChange={(e) => updateFormData({ cost_price: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                placeholder="0,00"
                className={`
                  w-full pl-12 pr-4 py-3 rounded-xl text-sm
                  ${isDarkMode
                    ? 'bg-gray-800 border-[2px] border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-[2px] border-gray-200 text-gray-900 placeholder-gray-400'
                  }
                `}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Preço de Venda
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                R$
              </span>
              <input
                type="number"
                value={formData.sale_price === 0 ? '' : formData.sale_price}
                onChange={(e) => updateFormData({ sale_price: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                placeholder="0,00"
                className={`
                  w-full pl-12 pr-4 py-3 rounded-xl text-sm
                  ${isDarkMode
                    ? 'bg-gray-800 border-[2px] border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-[2px] border-gray-200 text-gray-900 placeholder-gray-400'
                  }
                `}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Margem (%)
            </label>
            <input
              type="text"
              value={formData.margin ? `${formData.margin.toFixed(2)}%` : '0%'}
              readOnly
              className={`
                w-full px-4 py-3 rounded-xl text-sm font-semibold
                ${isDarkMode
                  ? 'bg-gray-900 border-[2px] border-gray-700 text-green-400'
                  : 'bg-gray-50 border-[2px] border-gray-200 text-green-600'
                }
              `}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Margem Mínima (%)
            </label>
            <input
              type="number"
              value={formData.min_margin === 0 ? '' : formData.min_margin}
              onChange={(e) => updateFormData({ min_margin: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              placeholder="0"
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900 placeholder-gray-400'
                }
              `}
            />
          </div>
        </div>
      </div>

      {/* Informações Fiscais */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Informações Fiscais
          </h3>
          
          {fiscalSuggestion && (
            <button
              type="button"
              onClick={() => {
                updateFormData({
                  fiscal: {
                    ...formData.fiscal,
                    ...fiscalSuggestion
                  }
                });
              }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                transition-all
                ${isDarkMode
                  ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }
              `}
            >
              <Lightbulb className="w-4 h-4" />
              Aplicar Sugestões
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              NCM
            </label>
            <select
              value={formData.fiscal?.ncm || ''}
              onChange={(e) => updateFiscal('ncm', e.target.value)}
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900'
                }
              `}
            >
              <option value="">Selecione o NCM</option>
              {ncmCodes.map(item => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.description}
                </option>
              ))}
            </select>
            {formData.fiscal?.ncm && (
              <p className={`text-xs mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {getCodeDescription(ncmCodes, formData.fiscal.ncm)}
              </p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              CEST
            </label>
            <select
              value={formData.fiscal?.cest || ''}
              onChange={(e) => updateFiscal('cest', e.target.value)}
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900'
                }
              `}
            >
              <option value="">Selecione o CEST</option>
              {cestCodes.map(item => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.description}
                </option>
              ))}
            </select>
            {formData.fiscal?.cest && (
              <p className={`text-xs mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {getCodeDescription(cestCodes, formData.fiscal.cest)}
              </p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              CFOP
            </label>
            <select
              value={formData.fiscal?.cfop || ''}
              onChange={(e) => updateFiscal('cfop', e.target.value)}
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900'
                }
              `}
            >
              <option value="">Selecione o CFOP</option>
              {cfopCodes.map(item => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.description}
                </option>
              ))}
            </select>
            {formData.fiscal?.cfop && (
              <p className={`text-xs mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {getCodeDescription(cfopCodes, formData.fiscal.cfop)}
              </p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              CST/CSOSN
            </label>
            <select
              value={formData.fiscal?.csosn || ''}
              onChange={(e) => updateFiscal('csosn', e.target.value)}
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900'
                }
              `}
            >
              <option value="">Selecione CST/CSOSN</option>
              <optgroup label="CSOSN - Simples Nacional">
                {csosnCodes.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.code} - {item.description}
                  </option>
                ))}
              </optgroup>
              <optgroup label="CST - Regime Normal">
                {cstCodes.map(item => (
                  <option key={item.code} value={item.code}>
                    {item.code} - {item.description}
                  </option>
                ))}
              </optgroup>
            </select>
            {formData.fiscal?.csosn && (
              <p className={`text-xs mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {getCodeDescription(csosnCodes, formData.fiscal.csosn) || 
                 getCodeDescription(cstCodes, formData.fiscal.csosn)}
              </p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Origem
            </label>
            <select
              value={formData.fiscal?.origin || '0'}
              onChange={(e) => updateFiscal('origin', e.target.value)}
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900'
                }
              `}
            >
              {originCodes.map(item => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.description}
                </option>
              ))}
            </select>
            {formData.fiscal?.origin && (
              <p className={`text-xs mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {getCodeDescription(originCodes, formData.fiscal.origin)}
              </p>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Código ANP
            </label>
            <select
              value={formData.fiscal?.anp_code || ''}
              onChange={(e) => updateFiscal('anp_code', e.target.value)}
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900'
                }
              `}
            >
              <option value="">Selecione (apenas combustíveis/lubrificantes)</option>
              {anpCodes.map(item => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.description}
                </option>
              ))}
            </select>
            {formData.fiscal?.anp_code && (
              <p className={`text-xs mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {getCodeDescription(anpCodes, formData.fiscal.anp_code)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Alíquotas */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Alíquotas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              ICMS (%)
            </label>
            <input
              type="number"
              value={formData.fiscal?.icms_aliquota === 0 ? '' : formData.fiscal?.icms_aliquota || ''}
              onChange={(e) => updateFiscal('icms_aliquota', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.01"
              placeholder="0"
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900 placeholder-gray-400'
                }
              `}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              IPI (%)
            </label>
            <input
              type="number"
              value={formData.fiscal?.ipi_aliquota === 0 ? '' : formData.fiscal?.ipi_aliquota || ''}
              onChange={(e) => updateFiscal('ipi_aliquota', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.01"
              placeholder="0"
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900 placeholder-gray-400'
                }
              `}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              PIS (%)
            </label>
            <input
              type="number"
              value={formData.fiscal?.pis_aliquota === 0 ? '' : formData.fiscal?.pis_aliquota || ''}
              onChange={(e) => updateFiscal('pis_aliquota', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.01"
              placeholder="0"
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900 placeholder-gray-400'
                }
              `}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              COFINS (%)
            </label>
            <input
              type="number"
              value={formData.fiscal?.cofins_aliquota === 0 ? '' : formData.fiscal?.cofins_aliquota || ''}
              onChange={(e) => updateFiscal('cofins_aliquota', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.01"
              placeholder="0"
              className={`
                w-full px-4 py-3 rounded-xl text-sm
                ${isDarkMode
                  ? 'bg-gray-800 border-[2px] border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-[2px] border-gray-200 text-gray-900 placeholder-gray-400'
                }
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3FiscalPrices;
