/**
 * ProductModal - Modal multi-step para cadastro/edição de produtos
 * 6 Steps: Básico, Estoque, Fiscal/Preços, Imagens, Compatibilidade, Histórico
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { useProductStore } from '../../../store/productStore';
import { useEmpresa } from '../../../contexts/EmpresaContext';
import toast from 'react-hot-toast';

// Step Components
import Step1Basic from './steps/Step1Basic';
import Step2Stock from './steps/Step2Stock';
import Step3FiscalPrices from './steps/Step3FiscalPrices';
import Step4Images from './steps/Step4Images';
import Step5Compatibility from './steps/Step5Compatibility';
import Step6History from './steps/Step6History';

const STEPS = [
  { id: 1, title: 'Informações Básicas', component: Step1Basic },
  { id: 2, title: 'Estoque e Lotes', component: Step2Stock },
  { id: 3, title: 'Fiscal e Preços', component: Step3FiscalPrices },
  { id: 4, title: 'Imagens', component: Step4Images },
  { id: 5, title: 'Compatibilidade', component: Step5Compatibility },
  { id: 6, title: 'Histórico', component: Step6History },
];

const ProductModal = ({ isOpen, onClose, product }) => {
  const { isDarkMode } = useThemeStore();
  const { createProduct, updateProduct, isLoading } = useProductStore();
  const empresaContext = useEmpresa();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Basic
    name: '',
    brand: '',
    model: '',
    category: '',
    subcategory: '',
    description: '',
    unit: 'UN',
    sku: '',
    barcode: '',
    tags: [],
    
    // Step 2 - Stock
    stock_total: 0,
    stock_min: 0,
    stock_reserved: 0,
    location: '',
    lots: [],
    
    // Step 3 - Fiscal & Prices
    fiscal: {
      ncm: '',
      cest: '',
      cfop: '',
      csosn: '',
      origin: '0',
      icms_aliquota: 0,
      ipi_aliquota: 0,
      pis_aliquota: 0,
      cofins_aliquota: 0,
      anp_code: '',
    },
    cost_price: 0,
    sale_price: 0,
    margin: 0,
    min_margin: 0,
    price_history: [],
    
    // Step 4 - Images
    images: [],
    main_image_index: 0,
    
    // Step 5 - Compatibility
    compatibilities: [],
    
    // Step 6 - History (read-only)
    movements: [],
    audit: [],
  });

  // Load product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        ...formData,
        ...product,
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        brand: '',
        model: '',
        category: '',
        subcategory: '',
        description: '',
        unit: 'UN',
        sku: '',
        barcode: '',
        tags: [],
        stock_total: 0,
        stock_min: 0,
        stock_reserved: 0,
        location: '',
        lots: [],
        fiscal: {
          ncm: '',
          cest: '',
          cfop: '',
          csosn: '',
          origin: '0',
          icms_aliquota: 0,
          ipi_aliquota: 0,
          pis_aliquota: 0,
          cofins_aliquota: 0,
          anp_code: '',
        },
        cost_price: 0,
        sale_price: 0,
        margin: 0,
        min_margin: 0,
        price_history: [],
        images: [],
        main_image_index: 0,
        compatibilities: [],
        movements: [],
        audit: [],
      });
      setCurrentStep(1);
    }
  }, [product, isOpen]);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name) {
      toast.error('Nome do produto é obrigatório');
      setCurrentStep(1);
      return;
    }

    if (!formData.category) {
      toast.error('Categoria é obrigatória');
      setCurrentStep(1);
      return;
    }

    // Verificar se é Super Admin
    const isSuperAdmin = empresaContext?.isSuperAdmin || false;
    
    // Verificar se empresaId está disponível (com múltiplas fontes)
    let empresaId = empresaContext?.empresaId || sessionStorage.getItem('empresaId');
    
    // Super Admins não precisam de empresaId
    if (!isSuperAdmin) {
      // Se não for Super Admin, empresaId é obrigatório
      
      // Se ainda não tiver, tentar forçar reload do contexto
      if (!empresaId && empresaContext?.refreshEmpresa) {
        console.log('[ProductModal] empresaId not found, attempting to refresh...');
        toast.loading('Carregando dados da empresa...', { id: 'empresa-loading' });
        
        try {
          await empresaContext.refreshEmpresa();
          empresaId = sessionStorage.getItem('empresaId');
          toast.dismiss('empresa-loading');
        } catch (error) {
          toast.dismiss('empresa-loading');
          console.error('[ProductModal] Failed to refresh empresa:', error);
        }
      }
      
      if (!empresaId) {
        toast.error('Empresa não identificada. Por favor, faça login novamente.');
        console.error('[ProductModal] empresaId not found after all attempts');
        console.error('[ProductModal] empresaContext:', empresaContext);
        console.error('[ProductModal] sessionStorage:', sessionStorage.getItem('empresaId'));
        return;
      }
    } else {
      console.log('[ProductModal] Super Admin mode: empresaId not required');
    }

    console.log('[ProductModal] Saving product', isSuperAdmin ? '(Super Admin)' : `with empresaId: ${empresaId}`);

    try {
      if (product) {
        // Update existing product
        await updateProduct(product.id || product.firestoreId, formData);
      } else {
        // Create new product
        await createProduct(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erro ao salvar produto: ' + error.message);
    }
  };

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  if (!isOpen) return null;

  // Verificar se empresaId está disponível
  const isSuperAdmin = empresaContext?.isSuperAdmin || false;
  const empresaId = empresaContext?.empresaId || sessionStorage.getItem('empresaId');
  const hasEmpresaId = !!empresaId || isSuperAdmin; // Super Admin não precisa de empresaId

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`
            relative w-full max-w-5xl max-h-[90vh] flex flex-col
            rounded-3xl backdrop-blur-xl overflow-hidden
            ${isDarkMode
              ? 'bg-gray-900/95 border-[2px] border-gray-700/80 shadow-[0_20px_80px_rgba(0,0,0,0.8)]'
              : 'bg-white/95 border-[2px] border-gray-200 shadow-[0_20px_80px_rgba(0,0,0,0.2)]'
            }
          `}
        >
          {/* Header */}
          <div className={`
            flex items-center justify-between px-8 py-6 border-b
            ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
          `}>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {product ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {STEPS[currentStep - 1].title}
              </p>
              
              {/* Indicador de Status da Empresa */}
              {!hasEmpresaId && (
                <div className={`
                  flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-xs font-medium
                  ${isDarkMode
                    ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-800/30'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  }
                `}>
                  <span>⚠️</span>
                  <span>Empresa não identificada - Não será possível salvar</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className={`
                p-2 rounded-xl transition-colors
                ${isDarkMode
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className={`
            px-8 py-4 border-b
            ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
          `}>
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`
                      flex items-center gap-2 transition-all
                      ${currentStep === step.id
                        ? isDarkMode
                          ? 'text-blue-400'
                          : 'text-blue-600'
                        : currentStep > step.id
                          ? isDarkMode
                            ? 'text-green-400'
                            : 'text-green-600'
                          : isDarkMode
                            ? 'text-gray-600'
                            : 'text-gray-400'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      font-bold text-sm transition-all
                      ${currentStep === step.id
                        ? isDarkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : currentStep > step.id
                          ? isDarkMode
                            ? 'bg-green-600 text-white'
                            : 'bg-green-600 text-white'
                          : isDarkMode
                            ? 'bg-gray-800 text-gray-600'
                            : 'bg-gray-200 text-gray-400'
                      }
                    `}>
                      {currentStep > step.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="text-xs font-medium hidden lg:block">
                      {step.title}
                    </span>
                  </button>
                  
                  {index < STEPS.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-2
                      ${currentStep > step.id
                        ? isDarkMode
                          ? 'bg-green-600'
                          : 'bg-green-600'
                        : isDarkMode
                          ? 'bg-gray-800'
                          : 'bg-gray-200'
                      }
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentStepComponent
                  formData={formData}
                  updateFormData={updateFormData}
                  product={product}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className={`
            flex items-center justify-between px-8 py-6 border-t
            ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
          `}>
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl
                font-semibold transition-all
                ${currentStep === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                }
                ${isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }
              `}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="flex items-center gap-3">
              {currentStep < STEPS.length ? (
                <button
                  onClick={handleNext}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl
                    font-semibold transition-all
                    ${isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }
                  `}
                >
                  Próximo
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl
                    font-semibold transition-all
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isDarkMode
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                    }
                  `}
                >
                  <Check className="w-5 h-5" />
                  {isLoading ? 'Salvando...' : product ? 'Atualizar' : 'Criar Produto'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
