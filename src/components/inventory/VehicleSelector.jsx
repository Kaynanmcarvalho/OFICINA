/**
 * VehicleSelector - Seletor Premium de Veículos
 * Design Apple-like com integração FIPE
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bike, Truck, Loader2, Check } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { fetchBrands, fetchModels, fetchYears, VEHICLE_TYPES } from '../../services/fipeService';

const VehicleSelector = ({ onVehicleSelect, initialValue, disabled = false }) => {
  const { isDarkMode } = useThemeStore();
  
  // Ref para callback para evitar loop infinito
  const onVehicleSelectRef = useRef(onVehicleSelect);
  
  useEffect(() => {
    onVehicleSelectRef.current = onVehicleSelect;
  }, [onVehicleSelect]);
  
  // Estados
  const [selectedType, setSelectedType] = useState(initialValue?.tipo || '');
  const [selectedBrand, setSelectedBrand] = useState(initialValue?.marca || null);
  const [selectedModel, setSelectedModel] = useState(initialValue?.modelo || null);
  const [selectedYear, setSelectedYear] = useState(initialValue?.ano || null);
  
  // Dados
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  
  // Loading states
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  
  // Busca
  const [brandSearch, setBrandSearch] = useState('');
  const [modelSearch, setModelSearch] = useState('');

  // Força uso do motion
  const MotionDiv = motion.div;

  const loadBrands = useCallback(async () => {
    setLoadingBrands(true);
    try {
      const data = await fetchBrands(selectedType);
      setBrands(data);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    } finally {
      setLoadingBrands(false);
    }
  }, [selectedType]);

  const loadModels = useCallback(async () => {
    if (!selectedBrand) return;
    setLoadingModels(true);
    try {
      const data = await fetchModels(selectedType, selectedBrand.codigo);
      setModels(data);
    } catch (error) {
      console.error('Erro ao carregar modelos:', error);
    } finally {
      setLoadingModels(false);
    }
  }, [selectedType, selectedBrand]);

  const loadYears = useCallback(async () => {
    if (!selectedBrand || !selectedModel) return;
    setLoadingYears(true);
    try {
      const data = await fetchYears(selectedType, selectedBrand.codigo, selectedModel.codigo);
      setYears(data);
    } catch (error) {
      console.error('Erro ao carregar anos:', error);
    } finally {
      setLoadingYears(false);
    }
  }, [selectedType, selectedBrand, selectedModel]);

  // Carregar marcas quando tipo é selecionado
  useEffect(() => {
    if (selectedType) {
      loadBrands();
    } else {
      setBrands([]);
      setModels([]);
      setYears([]);
    }
  }, [selectedType, loadBrands]);

  // Carregar modelos quando marca é selecionada
  useEffect(() => {
    if (selectedBrand) {
      loadModels();
    } else {
      setModels([]);
      setYears([]);
    }
  }, [selectedBrand, loadModels]);

  // Carregar anos quando modelo é selecionado
  useEffect(() => {
    if (selectedModel) {
      loadYears();
    } else {
      setYears([]);
    }
  }, [selectedModel, loadYears]);

  // Notificar seleção completa
  useEffect(() => {
    if (selectedType && selectedBrand && selectedModel && selectedYear && onVehicleSelectRef.current) {
      onVehicleSelectRef.current({
        tipo: selectedType,
        marca: selectedBrand.nome,
        marcaId: selectedBrand.codigo,
        modelo: selectedModel.nome,
        modeloId: selectedModel.codigo,
        ano: selectedYear.nome,
        anoId: selectedYear.codigo
      });
    }
  }, [selectedType, selectedBrand, selectedModel, selectedYear]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedYear(null);
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    setSelectedYear(null);
    setBrandSearch('');
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setSelectedYear(null);
    setModelSearch('');
  };

  const filteredBrands = brands.filter(b => 
    b.nome.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredModels = models.filter(m => 
    m.nome.toLowerCase().includes(modelSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Tipo de Veículo */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Tipo de Veículo
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleTypeSelect(VEHICLE_TYPES.CARRO)}
            disabled={disabled}
            className={`
              p-4 rounded-xl border-2 transition-all
              ${selectedType === VEHICLE_TYPES.CARRO
                ? isDarkMode
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-blue-600 border-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Car className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Carro</div>
          </button>

          <button
            onClick={() => handleTypeSelect(VEHICLE_TYPES.MOTO)}
            disabled={disabled}
            className={`
              p-4 rounded-xl border-2 transition-all
              ${selectedType === VEHICLE_TYPES.MOTO
                ? isDarkMode
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-blue-600 border-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Bike className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Moto</div>
          </button>

          <button
            onClick={() => handleTypeSelect(VEHICLE_TYPES.CAMINHAO)}
            disabled={disabled}
            className={`
              p-4 rounded-xl border-2 transition-all
              ${selectedType === VEHICLE_TYPES.CAMINHAO
                ? isDarkMode
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-blue-600 border-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Truck className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Caminhão</div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedType && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Marca */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Marca
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedBrand ? selectedBrand.nome : brandSearch}
                  onChange={(e) => {
                    setBrandSearch(e.target.value);
                    setSelectedBrand(null);
                  }}
                  placeholder="Buscar marca..."
                  disabled={disabled || loadingBrands}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2
                    ${isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }
                    focus:outline-none focus:border-blue-500
                    ${disabled || loadingBrands ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                />
                {loadingBrands && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-blue-600" />
                )}
                {selectedBrand && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                )}
              </div>
              
              {brandSearch && !selectedBrand && filteredBrands.length > 0 && (
                <div className={`
                  mt-2 max-h-60 overflow-y-auto rounded-xl border-2
                  ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
                `}>
                  {filteredBrands.slice(0, 10).map((brand) => (
                    <button
                      key={brand.codigo}
                      onClick={() => handleBrandSelect(brand)}
                      className={`
                        w-full px-4 py-2 text-left transition-colors
                        ${isDarkMode
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      {brand.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modelo */}
            {selectedBrand && (
              <MotionDiv
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Modelo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedModel ? selectedModel.nome : modelSearch}
                    onChange={(e) => {
                      setModelSearch(e.target.value);
                      setSelectedModel(null);
                    }}
                    placeholder="Buscar modelo..."
                    disabled={disabled || loadingModels}
                    className={`
                      w-full px-4 py-3 rounded-xl border-2
                      ${isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }
                      focus:outline-none focus:border-blue-500
                      ${disabled || loadingModels ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  />
                  {loadingModels && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-blue-600" />
                  )}
                  {selectedModel && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                  )}
                </div>
                
                {modelSearch && !selectedModel && filteredModels.length > 0 && (
                  <div className={`
                    mt-2 max-h-60 overflow-y-auto rounded-xl border-2
                    ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
                  `}>
                    {filteredModels.slice(0, 10).map((model) => (
                      <button
                        key={model.codigo}
                        onClick={() => handleModelSelect(model)}
                        className={`
                          w-full px-4 py-2 text-left transition-colors
                          ${isDarkMode
                            ? 'hover:bg-gray-700 text-gray-300'
                            : 'hover:bg-gray-100 text-gray-700'
                          }
                        `}
                      >
                        {model.nome}
                      </button>
                    ))}
                  </div>
                )}
              </MotionDiv>
            )}

            {/* Ano */}
            {selectedModel && (
              <MotionDiv
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Ano
                </label>
                <select
                  value={selectedYear?.codigo || ''}
                  onChange={(e) => {
                    const year = years.find(y => y.codigo === e.target.value);
                    setSelectedYear(year);
                  }}
                  disabled={disabled || loadingYears}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2
                    ${isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                    focus:outline-none focus:border-blue-500
                    ${disabled || loadingYears ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <option value="">Selecione o ano</option>
                  {years.map((year) => (
                    <option key={year.codigo} value={year.codigo}>
                      {year.nome}
                    </option>
                  ))}
                </select>
              </MotionDiv>
            )}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleSelector;
