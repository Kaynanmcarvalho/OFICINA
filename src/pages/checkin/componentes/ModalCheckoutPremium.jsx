import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, DollarSign, FileText, CreditCard, Upload, 
  Wrench, Package, AlertTriangle, ChevronRight, ChevronLeft,
  Clock, User, Car, Calendar, TrendingUp, Shield, Star, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import UploaderFotos from './UploaderFotos';
import { checkoutCheckin } from '../../../services/checkinService';
import { useBudgetStore } from '../../../store/budgetStore';
import { scrollToFirstErrorField } from '../../../hooks/useScrollToError';

const STEPS = [
  { id: 1, title: 'Serviços', icon: Wrench, description: 'Serviços realizados' },
  { id: 2, title: 'Peças', icon: Package, description: 'Peças utilizadas' },
  { id: 3, title: 'Pagamento', icon: DollarSign, description: 'Valores e forma de pagamento' },
  { id: 4, title: 'Finalização', icon: Upload, description: 'Fotos e observações finais' }
];

// Payment Method Icons - Apple Style
const PaymentIcons = {
  dinheiro: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M18 9V15M6 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  pix: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  cartao_credito: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 10H22M6 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  cartao_debito: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 10H22M6 15H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  transferencia: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 12L12 7L17 12M12 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
};

const PAYMENT_METHODS = [
  { value: 'dinheiro', label: 'Dinheiro', color: 'from-green-500 to-emerald-600' },
  { value: 'pix', label: 'PIX', color: 'from-cyan-500 to-blue-600' },
  { value: 'cartao_credito', label: 'Cartão de Crédito', color: 'from-purple-500 to-pink-600' },
  { value: 'cartao_debito', label: 'Cartão de Débito', color: 'from-orange-500 to-red-600' },
  { value: 'transferencia', label: 'Transferência', color: 'from-indigo-500 to-purple-600' }
];

const ModalCheckoutPremium = ({ isOpen, onClose, onSuccess, checkinData }) => {
  const { budgets } = useBudgetStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Serviços
    servicosRealizados: '',
    tempoGasto: '',
    garantia: '',
    
    // Step 2: Peças
    pecasUtilizadas: [],
    
    // Step 3: Pagamento
    valorServicos: '',
    valorPecas: '',
    desconto: '',
    valorTotal: '',
    metodoPagamento: '',
    parcelas: '1',
    
    // Step 4: Finalização
    observacoes: '',
    recomendacoes: '',
    proximaRevisao: '',
    fotos: [],
    avaliacaoCliente: 0
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetLoaded, setBudgetLoaded] = useState(false);

  // Buscar e carregar orçamento aprovado automaticamente
  useEffect(() => {
    if (isOpen && checkinData && !budgetLoaded) {
      loadApprovedBudget();
    }
  }, [isOpen, checkinData, budgets]);

  const loadApprovedBudget = () => {
    try {
      // Buscar orçamento aprovado relacionado ao checkin
      const approvedBudget = budgets.find(budget => 
        budget.status === 'approved' && 
        (budget.checkinId === checkinData.id || 
         budget.checkinId === checkinData.firestoreId ||
         budget.vehiclePlate === checkinData.plate)
      );

      if (approvedBudget && approvedBudget.items) {
        console.log('✅ Orçamento aprovado encontrado:', approvedBudget);
        
        // Separar serviços e produtos
        const servicos = [];
        const pecas = [];
        let valorServicos = 0;
        let valorPecas = 0;

        approvedBudget.items.forEach(item => {
          if (item.type === 'service') {
            servicos.push(item.name || item.description);
            valorServicos += parseFloat(item.price || 0) * parseInt(item.quantity || 1);
          } else if (item.type === 'product') {
            pecas.push({
              nome: item.name || item.description,
              quantidade: String(item.quantity || 1),
              valor: (parseFloat(item.price || 0)).toFixed(2)
            });
            valorPecas += parseFloat(item.price || 0) * parseInt(item.quantity || 1);
          }
        });

        // Preencher formulário automaticamente
        setFormData(prev => ({
          ...prev,
          servicosRealizados: servicos.length > 0 ? servicos.join('\n• ') : prev.servicosRealizados,
          pecasUtilizadas: pecas.length > 0 ? pecas : prev.pecasUtilizadas,
          valorServicos: valorServicos > 0 ? valorServicos.toFixed(2) : prev.valorServicos,
          valorPecas: valorPecas > 0 ? valorPecas.toFixed(2) : prev.valorPecas,
          desconto: approvedBudget.discount ? parseFloat(approvedBudget.discount).toFixed(2) : prev.desconto
        }));

        setBudgetLoaded(true);
        toast.success('✨ Dados do orçamento aprovado carregados automaticamente!', {
          icon: '📋',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Erro ao carregar orçamento:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        servicosRealizados: '', tempoGasto: '', garantia: '',
        pecasUtilizadas: [], valorServicos: '', valorPecas: '', desconto: '',
        valorTotal: '', metodoPagamento: '', parcelas: '1',
        observacoes: '', recomendacoes: '', proximaRevisao: '', fotos: [], avaliacaoCliente: 0
      });
      setErrors({});
      setBudgetLoaded(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Calcular valor total automaticamente
    const servicos = parseFloat(formData.valorServicos) || 0;
    const pecas = parseFloat(formData.valorPecas) || 0;
    const desconto = parseFloat(formData.desconto) || 0;
    const total = servicos + pecas - desconto;
    setFormData(prev => ({ ...prev, valorTotal: total.toFixed(2) }));
  }, [formData.valorServicos, formData.valorPecas, formData.desconto]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.servicosRealizados.trim()) {
        newErrors.servicosRealizados = 'Descreva os serviços realizados';
      }
    }

    if (step === 3) {
      if (!formData.valorServicos && !formData.valorPecas) {
        newErrors.valorServicos = 'Informe o valor dos serviços ou peças';
      }
      if (!formData.metodoPagamento) {
        newErrors.metodoPagamento = 'Selecione o método de pagamento';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } else {
      toast.error('Preencha todos os campos obrigatórios');
      // Scroll automático para o primeiro campo com erro
      setTimeout(() => {
        scrollToFirstErrorField(errors);
      }, 100);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, '');
    const formatted = (parseInt(number || 0) / 100).toFixed(2);
    return formatted;
  };

  const handleCurrencyChange = (field, value) => {
    const formatted = formatCurrency(value);
    setFormData({ ...formData, [field]: formatted });
    setErrors({ ...errors, [field]: null });
  };

  const addPeca = () => {
    setFormData(prev => ({
      ...prev,
      pecasUtilizadas: [...prev.pecasUtilizadas, { nome: '', quantidade: '1', valor: '' }]
    }));
  };

  const removePeca = (index) => {
    setFormData(prev => ({
      ...prev,
      pecasUtilizadas: prev.pecasUtilizadas.filter((_, i) => i !== index)
    }));
  };

  const updatePeca = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pecasUtilizadas: prev.pecasUtilizadas.map((peca, i) => 
        i === index ? { ...peca, [field]: value } : peca
      )
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutData = {
        servicesPerformed: formData.servicosRealizados,
        timeSpent: formData.tempoGasto,
        warranty: formData.garantia,
        partsUsed: formData.pecasUtilizadas,
        servicesCost: parseFloat(formData.valorServicos) || 0,
        partsCost: parseFloat(formData.valorPecas) || 0,
        discount: parseFloat(formData.desconto) || 0,
        totalCost: parseFloat(formData.valorTotal),
        paymentMethod: formData.metodoPagamento,
        installments: parseInt(formData.parcelas),
        checkoutObservations: formData.observacoes,
        recommendations: formData.recomendacoes,
        nextMaintenance: formData.proximaRevisao,
        customerRating: formData.avaliacaoCliente
      };

      const photoFiles = formData.fotos.map(f => f.file);
      const updatedCheckin = await checkoutCheckin(checkinData.id, checkoutData, photoFiles);

      toast.success('Check-out realizado com sucesso!');
      onSuccess(updatedCheckin);
      onClose();
    } catch (error) {
      console.error('Erro ao realizar check-out:', error);
      toast.error(error.message || 'Erro ao realizar check-out');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !checkinData) return null;

  const currentStepData = STEPS.find(s => s.id === currentStep);

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
              />
              
              {/* Modal Container - Apple-like */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl my-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-[90vh] flex flex-col overflow-hidden"
              >
                {/* Header - Apple Style */}
                <div className="relative px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30"
                      >
                        <currentStepData.icon className="w-5 h-5" stroke="white" strokeWidth={2.5} />
                      </motion.div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                          Finalizar Check-out
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {checkinData.clientName} • {checkinData.plate}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="w-10 h-10 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all backdrop-blur-sm"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                  </div>

                  {/* Steps Indicator - Apple Style */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-2">
                      {STEPS.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                          <div className="flex flex-col items-center w-full">
                            <motion.div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-all ${
                                currentStep >= step.id
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-400 dark:text-gray-500 border-2 border-gray-200/50 dark:border-gray-700/50'
                              }`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {currentStep > step.id ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                step.id
                              )}
                            </motion.div>
                            <span className={`text-xs font-bold mt-1 ${
                              currentStep >= step.id
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {step.title}
                            </span>
                          </div>
                          {index < STEPS.length - 1 && (
                            <div className="flex-1 h-1 mx-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: 0 }}
                                animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 overflow-y-auto scroll-smooth">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Serviços Realizados */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-7"
                      >
                        {/* Badge de Orçamento Carregado */}
                        {budgetLoaded && formData.servicosRealizados && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-4 border border-green-200/50 dark:border-green-800/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  Serviços carregados do orçamento aprovado
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                  Você pode editar ou adicionar mais informações conforme necessário
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Serviços Realizados */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                              <Wrench className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Serviços Realizados</span>
                            <span className="text-red-500 text-xs ml-1">*</span>
                            {budgetLoaded && formData.servicosRealizados && (
                              <span className="ml-2 px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
                                Do Orçamento
                              </span>
                            )}
                          </label>
                          <textarea
                            value={formData.servicosRealizados}
                            onChange={(e) => {
                              setFormData({ ...formData, servicosRealizados: e.target.value });
                              setErrors({ ...errors, servicosRealizados: null });
                            }}
                            placeholder="Descreva detalhadamente os serviços realizados no veículo..."
                            rows={6}
                            className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                              errors.servicosRealizados
                                ? 'border-red-500 focus:ring-red-500/50'
                                : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                            } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:border-blue-500 transition-all outline-none resize-none`}
                          />
                          {errors.servicosRealizados && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2.5 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {errors.servicosRealizados}
                            </motion.p>
                          )}
                          <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Liste todos os serviços executados, ajustes e reparos realizados
                          </p>
                        </div>

                        {/* Tempo Gasto e Garantia */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Tempo Gasto */}
                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                <Clock className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Tempo Gasto</span>
                            </label>
                            <input
                              type="text"
                              value={formData.tempoGasto}
                              onChange={(e) => setFormData({ ...formData, tempoGasto: e.target.value })}
                              placeholder="Ex: 2 horas, 3 dias..."
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                            />
                            <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                              Tempo total gasto na execução dos serviços
                            </p>
                          </div>

                          {/* Garantia */}
                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                                <Shield className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Garantia</span>
                            </label>
                            <input
                              type="text"
                              value={formData.garantia}
                              onChange={(e) => setFormData({ ...formData, garantia: e.target.value })}
                              placeholder="Ex: 90 dias, 6 meses..."
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                            />
                            <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                              Período de garantia oferecido para os serviços
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Peças Utilizadas */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-7"
                      >
                        {/* Badge de Orçamento Carregado */}
                        {budgetLoaded && formData.pecasUtilizadas.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-800/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  Dados carregados do orçamento aprovado
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                  {formData.pecasUtilizadas.length} {formData.pecasUtilizadas.length === 1 ? 'peça' : 'peças'} e serviços preenchidos automaticamente
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                <Package className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Peças Utilizadas</span>
                              {budgetLoaded && formData.pecasUtilizadas.length > 0 && (
                                <span className="ml-2 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                                  Do Orçamento
                                </span>
                              )}
                            </label>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={addPeca}
                              className="px-4 py-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                            >
                              + Adicionar Peça
                            </motion.button>
                          </div>

                          {formData.pecasUtilizadas.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Nenhuma peça adicionada
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Clique em "Adicionar Peça" para registrar as peças utilizadas
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {formData.pecasUtilizadas.map((peca, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="grid grid-cols-12 gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200/50 dark:border-gray-700/50"
                                >
                                  <div className="col-span-12 lg:col-span-5">
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                      Nome da Peça
                                    </label>
                                    <input
                                      type="text"
                                      value={peca.nome}
                                      onChange={(e) => updatePeca(index, 'nome', e.target.value)}
                                      placeholder="Ex: Filtro de óleo"
                                      className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                    />
                                  </div>
                                  <div className="col-span-6 lg:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                      Qtd
                                    </label>
                                    <input
                                      type="number"
                                      value={peca.quantidade}
                                      onChange={(e) => updatePeca(index, 'quantidade', e.target.value)}
                                      min="1"
                                      className="w-full px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                    />
                                  </div>
                                  <div className="col-span-6 lg:col-span-4">
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                      Valor Unit.
                                    </label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                                        R$
                                      </span>
                                      <input
                                        type="text"
                                        value={peca.valor}
                                        onChange={(e) => updatePeca(index, 'valor', formatCurrency(e.target.value))}
                                        placeholder="0,00"
                                        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-span-12 lg:col-span-1 flex items-end">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      type="button"
                                      onClick={() => removePeca(index)}
                                      className="w-full lg:w-auto px-3 py-2.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                                    >
                                      <X className="w-4 h-4 mx-auto" />
                                    </motion.button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Pagamento */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-7"
                      >
                        {/* Valores */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                              <DollarSign className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Valores</span>
                          </label>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                            {/* Valor Serviços */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Serviços
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                  R$
                                </span>
                                <input
                                  type="text"
                                  value={formData.valorServicos}
                                  onChange={(e) => handleCurrencyChange('valorServicos', e.target.value)}
                                  placeholder="0,00"
                                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                />
                              </div>
                            </div>

                            {/* Valor Peças */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Peças
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                  R$
                                </span>
                                <input
                                  type="text"
                                  value={formData.valorPecas}
                                  onChange={(e) => handleCurrencyChange('valorPecas', e.target.value)}
                                  placeholder="0,00"
                                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                />
                              </div>
                            </div>

                            {/* Desconto */}
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Desconto
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                  R$
                                </span>
                                <input
                                  type="text"
                                  value={formData.desconto}
                                  onChange={(e) => handleCurrencyChange('desconto', e.target.value)}
                                  placeholder="0,00"
                                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Valor Total - Destaque */}
                          <div className="mt-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border-2 border-green-200/50 dark:border-green-800/50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Valor Total
                              </span>
                              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                R$ {formData.valorTotal || '0,00'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Método de Pagamento */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                              <CreditCard className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Método de Pagamento</span>
                            <span className="text-red-500 text-xs ml-1">*</span>
                          </label>

                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                            {PAYMENT_METHODS.map((method) => {
                              const Icon = PaymentIcons[method.value];
                              const isSelected = formData.metodoPagamento === method.value;
                              
                              return (
                                <motion.button
                                  key={method.value}
                                  type="button"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    setFormData({ ...formData, metodoPagamento: method.value });
                                    setErrors({ ...errors, metodoPagamento: null });
                                  }}
                                  className={`p-4 rounded-xl border-2 transition-all ${
                                    isSelected
                                      ? `bg-gradient-to-br ${method.color} border-transparent text-white shadow-lg`
                                      : 'bg-white dark:bg-gray-900 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                  }`}
                                >
                                  <div className="flex flex-col items-center gap-2">
                                    <Icon />
                                    <span className="text-xs font-bold text-center">
                                      {method.label}
                                    </span>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>

                          {errors.metodoPagamento && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2.5 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {errors.metodoPagamento}
                            </motion.p>
                          )}

                          {/* Parcelas - Apenas para cartão de crédito */}
                          {formData.metodoPagamento === 'cartao_credito' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4"
                            >
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Número de Parcelas
                              </label>
                              <select
                                value={formData.parcelas}
                                onChange={(e) => setFormData({ ...formData, parcelas: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                  <option key={num} value={num}>
                                    {num}x de R$ {(parseFloat(formData.valorTotal) / num).toFixed(2)}
                                  </option>
                                ))}
                              </select>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Finalização */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-7"
                      >
                        {/* Fotos Finais */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                              <Upload className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Fotos Finais do Veículo</span>
                          </label>
                          <UploaderFotos
                            fotos={formData.fotos}
                            onChange={(fotos) => setFormData({ ...formData, fotos })}
                            maxFotos={10}
                          />
                          <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Registre o estado final do veículo após os serviços
                          </p>
                        </div>

                        {/* Observações e Recomendações */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Observações */}
                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                <FileText className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Observações</span>
                            </label>
                            <textarea
                              value={formData.observacoes}
                              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                              placeholder="Observações sobre o atendimento..."
                              rows={4}
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none resize-none"
                            />
                          </div>

                          {/* Recomendações */}
                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                <TrendingUp className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Recomendações</span>
                            </label>
                            <textarea
                              value={formData.recomendacoes}
                              onChange={(e) => setFormData({ ...formData, recomendacoes: e.target.value })}
                              placeholder="Recomendações para o cliente..."
                              rows={4}
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none resize-none"
                            />
                          </div>
                        </div>

                        {/* Próxima Revisão */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                              <Calendar className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Próxima Revisão</span>
                          </label>
                          <input
                            type="text"
                            value={formData.proximaRevisao}
                            onChange={(e) => setFormData({ ...formData, proximaRevisao: e.target.value })}
                            placeholder="Ex: 10.000 km ou 6 meses..."
                            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                          />
                          <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Quando o cliente deve retornar para manutenção
                          </p>
                        </div>

                        {/* Avaliação do Cliente */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-2xl p-6 border border-yellow-200/50 dark:border-yellow-800/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/25">
                              <Star className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Avaliação do Atendimento</span>
                          </label>
                          <div className="flex items-center justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <motion.button
                                key={rating}
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setFormData({ ...formData, avaliacaoCliente: rating })}
                                className="transition-all"
                              >
                                <Star
                                  className={`w-10 h-10 ${
                                    rating <= formData.avaliacaoCliente
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              </motion.button>
                            ))}
                          </div>
                          <p className="mt-3 text-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {formData.avaliacaoCliente === 0 && 'Clique nas estrelas para avaliar'}
                            {formData.avaliacaoCliente === 1 && 'Muito Insatisfeito'}
                            {formData.avaliacaoCliente === 2 && 'Insatisfeito'}
                            {formData.avaliacaoCliente === 3 && 'Regular'}
                            {formData.avaliacaoCliente === 4 && 'Satisfeito'}
                            {formData.avaliacaoCliente === 5 && 'Muito Satisfeito'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer - Navigation Buttons */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1 || isSubmitting}
                    className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                      Cancelar
                    </motion.button>

                    {currentStep < STEPS.length ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Próximo
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            Finalizar Check-out
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Modal Novo Cliente (se necessário) */}
    </>
  );
};

export default ModalCheckoutPremium;
