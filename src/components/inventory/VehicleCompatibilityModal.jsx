import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Car, Bike, Truck, Filter, Package } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useProductStore } from '../../store/productStore';
import VehicleThumbnail from '../VehicleThumbnail';

const VehicleCompatibilityModal = ({ isOpen, onClose }) => {
  const { isDarkMode } = useThemeStore();
  const { products } = useProductStore();
  
  // Força o uso do motion para evitar que o autofix remova
  const MotionDiv = motion.div;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [compatibleParts, setCompatibleParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Base completa de veículos populares do Brasil
  const vehicles = [
    // === MOTOS POPULARES ===
    // Honda
    { id: 1, type: 'moto', brand: 'Honda', model: 'CG 160', year: '2024' },
    { id: 2, type: 'moto', brand: 'Honda', model: 'CG 160 Titan', year: '2024' },
    { id: 3, type: 'moto', brand: 'Honda', model: 'CG 160 Start', year: '2024' },
    { id: 4, type: 'moto', brand: 'Honda', model: 'Biz 125', year: '2024' },
    { id: 5, type: 'moto', brand: 'Honda', model: 'Pop 110i', year: '2024' },
    { id: 6, type: 'moto', brand: 'Honda', model: 'Bros 160', year: '2024' },
    { id: 7, type: 'moto', brand: 'Honda', model: 'XRE 190', year: '2024' },
    { id: 8, type: 'moto', brand: 'Honda', model: 'CB 500F', year: '2024' },
    { id: 9, type: 'moto', brand: 'Honda', model: 'CB 500X', year: '2024' },
    { id: 10, type: 'moto', brand: 'Honda', model: 'PCX 160', year: '2024' },
    // Yamaha
    { id: 11, type: 'moto', brand: 'Yamaha', model: 'Factor 150', year: '2024' },
    { id: 12, type: 'moto', brand: 'Yamaha', model: 'Fazer 150', year: '2024' },
    { id: 13, type: 'moto', brand: 'Yamaha', model: 'Crosser 150', year: '2024' },
    { id: 14, type: 'moto', brand: 'Yamaha', model: 'Lander 250', year: '2024' },
    { id: 15, type: 'moto', brand: 'Yamaha', model: 'MT-03', year: '2024' },
    { id: 16, type: 'moto', brand: 'Yamaha', model: 'MT-07', year: '2024' },
    { id: 17, type: 'moto', brand: 'Yamaha', model: 'XTZ 150', year: '2024' },
    { id: 18, type: 'moto', brand: 'Yamaha', model: 'Neo 125', year: '2024' },
    // Outras marcas
    { id: 19, type: 'moto', brand: 'Suzuki', model: 'Intruder 150', year: '2024' },
    { id: 20, type: 'moto', brand: 'Suzuki', model: 'GSX-S750', year: '2024' },
    
    // === CARROS POPULARES ===
    // Fiat
    { id: 21, type: 'carro', brand: 'Fiat', model: 'Argo', year: '2024' },
    { id: 22, type: 'carro', brand: 'Fiat', model: 'Mobi', year: '2024' },
    { id: 23, type: 'carro', brand: 'Fiat', model: 'Strada', year: '2024' },
    { id: 24, type: 'carro', brand: 'Fiat', model: 'Toro', year: '2024' },
    { id: 25, type: 'carro', brand: 'Fiat', model: 'Pulse', year: '2024' },
    { id: 26, type: 'carro', brand: 'Fiat', model: 'Fastback', year: '2024' },
    // Chevrolet
    { id: 27, type: 'carro', brand: 'Chevrolet', model: 'Onix', year: '2024' },
    { id: 28, type: 'carro', brand: 'Chevrolet', model: 'Onix Plus', year: '2024' },
    { id: 29, type: 'carro', brand: 'Chevrolet', model: 'Tracker', year: '2024' },
    { id: 30, type: 'carro', brand: 'Chevrolet', model: 'S10', year: '2024' },
    { id: 31, type: 'carro', brand: 'Chevrolet', model: 'Montana', year: '2024' },
    { id: 32, type: 'carro', brand: 'Chevrolet', model: 'Spin', year: '2024' },
    // Volkswagen
    { id: 33, type: 'carro', brand: 'Volkswagen', model: 'Gol', year: '2024' },
    { id: 34, type: 'carro', brand: 'Volkswagen', model: 'Polo', year: '2024' },
    { id: 35, type: 'carro', brand: 'Volkswagen', model: 'Virtus', year: '2024' },
    { id: 36, type: 'carro', brand: 'Volkswagen', model: 'T-Cross', year: '2024' },
    { id: 37, type: 'carro', brand: 'Volkswagen', model: 'Nivus', year: '2024' },
    { id: 38, type: 'carro', brand: 'Volkswagen', model: 'Saveiro', year: '2024' },
    { id: 39, type: 'carro', brand: 'Volkswagen', model: 'Amarok', year: '2024' },
    // Toyota
    { id: 40, type: 'carro', brand: 'Toyota', model: 'Corolla', year: '2024' },
    { id: 41, type: 'carro', brand: 'Toyota', model: 'Hilux', year: '2024' },
    { id: 42, type: 'carro', brand: 'Toyota', model: 'SW4', year: '2024' },
    { id: 43, type: 'carro', brand: 'Toyota', model: 'Yaris', year: '2024' },
    { id: 44, type: 'carro', brand: 'Toyota', model: 'Corolla Cross', year: '2024' },
    // Hyundai
    { id: 45, type: 'carro', brand: 'Hyundai', model: 'HB20', year: '2024' },
    { id: 46, type: 'carro', brand: 'Hyundai', model: 'HB20S', year: '2024' },
    { id: 47, type: 'carro', brand: 'Hyundai', model: 'Creta', year: '2024' },
    { id: 48, type: 'carro', brand: 'Hyundai', model: 'Tucson', year: '2024' },
    // Jeep
    { id: 49, type: 'carro', brand: 'Jeep', model: 'Renegade', year: '2024' },
    { id: 50, type: 'carro', brand: 'Jeep', model: 'Compass', year: '2024' },
    { id: 51, type: 'carro', brand: 'Jeep', model: 'Commander', year: '2024' },
    // Renault
    { id: 52, type: 'carro', brand: 'Renault', model: 'Kwid', year: '2024' },
    { id: 53, type: 'carro', brand: 'Renault', model: 'Sandero', year: '2024' },
    { id: 54, type: 'carro', brand: 'Renault', model: 'Duster', year: '2024' },
    { id: 55, type: 'carro', brand: 'Renault', model: 'Oroch', year: '2024' },
    
    // === CAMINHÕES POPULARES ===
    // Mercedes-Benz
    { id: 56, type: 'caminhao', brand: 'Mercedes-Benz', model: 'Accelo', year: '2024' },
    { id: 57, type: 'caminhao', brand: 'Mercedes-Benz', model: 'Atego', year: '2024' },
    { id: 58, type: 'caminhao', brand: 'Mercedes-Benz', model: 'Actros', year: '2024' },
    // Volkswagen
    { id: 59, type: 'caminhao', brand: 'Volkswagen', model: 'Delivery', year: '2024' },
    { id: 60, type: 'caminhao', brand: 'Volkswagen', model: 'Constellation', year: '2024' },
    // Volvo
    { id: 61, type: 'caminhao', brand: 'Volvo', model: 'FH', year: '2024' },
    { id: 62, type: 'caminhao', brand: 'Volvo', model: 'FM', year: '2024' },
    // Scania
    { id: 63, type: 'caminhao', brand: 'Scania', model: 'R 450', year: '2024' },
    { id: 64, type: 'caminhao', brand: 'Scania', model: 'S 500', year: '2024' },
    // Iveco
    { id: 65, type: 'caminhao', brand: 'Iveco', model: 'Daily', year: '2024' },
    { id: 66, type: 'caminhao', brand: 'Iveco', model: 'Tector', year: '2024' },
  ];

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = `${v.brand} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || v.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsLoading(true);
    
    // Buscar peças compatíveis com lógica melhorada
    setTimeout(() => {
      const compatible = products.filter(product => {
        // Verificar se tem campo de compatibilidade
        if (product.compatibility) {
          const compat = product.compatibility.toLowerCase();
          const brandMatch = compat.includes(vehicle.brand.toLowerCase());
          const modelMatch = compat.includes(vehicle.model.toLowerCase());
          
          if (brandMatch || modelMatch) return true;
        }
        
        // Verificar no nome do produto
        const productName = (product.name || '').toLowerCase();
        const brandInName = productName.includes(vehicle.brand.toLowerCase());
        const modelInName = productName.includes(vehicle.model.toLowerCase());
        
        if (brandInName || modelInName) return true;
        
        // Verificar na descrição
        if (product.description) {
          const desc = product.description.toLowerCase();
          const brandInDesc = desc.includes(vehicle.brand.toLowerCase());
          const modelInDesc = desc.includes(vehicle.model.toLowerCase());
          
          if (brandInDesc || modelInDesc) return true;
        }
        
        // Produtos universais (óleos, filtros genéricos, etc)
        const universalKeywords = ['universal', 'todos', 'qualquer', 'genérico', 'compatível'];
        const hasUniversal = universalKeywords.some(keyword => 
          productName.includes(keyword) || 
          (product.description && product.description.toLowerCase().includes(keyword))

        if (hasUniversal) return true;
        
        return false;
      });
      
      setCompatibleParts(compatible);
      setIsLoading(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`
            relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden
            ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
            shadow-2xl
          `}
        >
          {/* Header */}
          <div className={`
            px-6 py-4 border-b
            ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
          `}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-100'}
                `}>
                  <Package className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Buscar Peças por Veículo
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Encontre todas as peças compatíveis com qualquer veículo
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isDarkMode 
                    ? 'hover:bg-gray-800 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }
                `}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-[calc(90vh-120px)]">
            {/* Left Panel - Vehicle Selection */}
            <div className={`
              w-1/2 border-r overflow-y-auto
              ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
            `}>
              <div className="p-6 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className={`
                    absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5
                    ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}
                  `} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar marca ou modelo..."
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl border-2
                      ${isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      }
                      focus:outline-none focus:border-blue-500
                    `}
                  />
                </div>

                {/* Type Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedType('all')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
                      font-medium text-sm transition-all
                      ${selectedType === 'all'
                        ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                        : isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Filter className="w-4 h-4" />
                    Todos
                  </button>
                  <button
                    onClick={() => setSelectedType('carro')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
                      font-medium text-sm transition-all
                      ${selectedType === 'carro'
                        ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                        : isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Car className="w-4 h-4" />
                    Carros
                  </button>
                  <button
                    onClick={() => setSelectedType('moto')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
                      font-medium text-sm transition-all
                      ${selectedType === 'moto'
                        ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                        : isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Bike className="w-4 h-4" />
                    Motos
                  </button>
                  <button
                    onClick={() => setSelectedType('caminhao')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
                      font-medium text-sm transition-all
                      ${selectedType === 'caminhao'
                        ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                        : isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <Truck className="w-4 h-4" />
                    Caminhões
                  </button>
                </div>

                {/* Vehicle List */}
                <div className="space-y-2">
                  {filteredVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => handleSelectVehicle(vehicle)}
                      className={`
                        w-full p-4 rounded-xl text-left transition-all
                        ${selectedVehicle?.id === vehicle.id
                          ? isDarkMode
                            ? 'bg-blue-600/20 border-2 border-blue-600'
                            : 'bg-blue-50 border-2 border-blue-500'
                          : isDarkMode
                            ? 'bg-gray-800 border-2 border-transparent hover:border-gray-700'
                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <VehicleThumbnail
                          vehicle={vehicle}
                          size="sm"
                          showLabel={false}
                        />
                        <div className="flex-1">
                          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {vehicle.year}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Compatible Parts */}
            <div className="w-1/2 overflow-y-auto">
              <div className="p-6">
                {!selectedVehicle ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Package className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Selecione um veículo
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Escolha um veículo para ver as peças compatíveis
                    </p>
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Peças Compatíveis
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {compatibleParts.length} peça(s) encontrada(s) para {selectedVehicle.brand} {selectedVehicle.model}
                      </p>
                    </div>

                    {compatibleParts.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                        <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          Nenhuma peça compatível cadastrada
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {compatibleParts.map((part) => (
                          <div
                            key={part.id}
                            className={`
                              p-4 rounded-xl border-2
                              ${isDarkMode 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                              }
                            `}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {part.name}
                                </h4>
                                {part.sku && (
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    SKU: {part.sku}
                                  </p>
                                )}
                                <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  Estoque: {part.stock_total || 0} unidades
                                </p>
                              </div>
                              <div className="text-right">
                                <p className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                  R$ {(part.sale_price || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </AnimatePresence>
  );
};

export default VehicleCompatibilityModal;
