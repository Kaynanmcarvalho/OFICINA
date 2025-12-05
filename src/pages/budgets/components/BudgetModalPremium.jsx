import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, User, Car, Package, DollarSign, FileText,
  ChevronRight, ChevronLeft, AlertTriangle, Plus, Trash2, 
  Search, Phone, Mail, Calendar, Wrench, ShoppingCart, Sparkles,
  Edit2, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useBudgetStore } from '../../../store/budgetStore';
import { useClientStore } from '../../../store';
import { useInventoryStore } from '../../../store/inventoryStore';
import { searchVehicleByPlate } from '../../../services/vehicleApiService';
import { formatPhone } from '../../../utils/formatters';
import { scrollToFirstErrorField } from '../../../hooks/useScrollToError';

const STEPS = [
  { id: 1, title: 'Cliente', icon: User, description: 'Dados do cliente' },
  { id: 2, title: 'Veículo', icon: Car, description: 'Informações do veículo' },
  { id: 3, title: 'Itens', icon: Package, description: 'Produtos e serviços' },
  { id: 4, title: 'Resumo', icon: DollarSign, description: 'Valores e observações' }
];

const BudgetModalPremium = ({ isOpen, onClose, budget, checkinData }) => {
  const { createBudget, updateBudget } = useBudgetStore();
  const { clients, fetchClients } = useClientStore();
  const { parts, fetchParts } = useInventoryStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: '', clientName: '', clientPhone: '', clientEmail: '',
    vehicleId: '', vehiclePlate: '', vehicleBrand: '', vehicleModel: '',
    vehicleYear: '', vehicleColor: '', items: [], discount: '',
    notes: '', internalNotes: '', validUntil: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingPlate, setIsSearchingPlate] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    type: 'product', productId: '', name: '', description: '', quantity: 1, price: 0
  });

  useEffect(() => {
    fetchClients();
    fetchParts();
  }, [fetchClients, fetchParts]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        clientId: '', clientName: '', clientPhone: '', clientEmail: '',
        vehicleId: '', vehiclePlate: '', vehicleBrand: '', vehicleModel: '',
        vehicleYear: '', vehicleColor: '', items: [], discount: '',
        notes: '', internalNotes: '', validUntil: ''
      });
      setErrors({});
      setClientSearchTerm('');
      return;
    }

    if (budget) {
      setFormData({
        clientId: budget.clientId || '', clientName: budget.clientName || '',
        clientPhone: budget.clientPhone || '', clientEmail: budget.clientEmail || '',
        vehicleId: budget.vehicleId || '', vehiclePlate: budget.vehiclePlate || '',
        vehicleBrand: budget.vehicleBrand || '', vehicleModel: budget.vehicleModel || '',
        vehicleYear: budget.vehicleYear || '', vehicleColor: budget.vehicleColor || '',
        items: budget.items || [], discount: budget.discount || '',
        notes: budget.notes || '', internalNotes: budget.internalNotes || '',
        validUntil: budget.validUntil || ''
      });
      setClientSearchTerm(budget.clientName || '');
    } else if (checkinData) {
      setFormData(prev => ({
        ...prev,
        clientName: checkinData.clientName || '',
        clientPhone: checkinData.clientPhone || '',
        vehiclePlate: checkinData.plate || checkinData.vehiclePlate || '',
        vehicleBrand: checkinData.vehicleBrand || '',
        vehicleModel: checkinData.vehicleModel || '',
        vehicleYear: checkinData.vehicleYear || '',
        vehicleColor: checkinData.vehicleColor || ''
      }));
      setClientSearchTerm(checkinData.clientName || '');
    }
  }, [isOpen, budget, checkinData]);

  useEffect(() => {
    if (clientSearchTerm.length >= 2) {
      const filtered = clients.filter(client =>
        client.name?.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
        client.phone?.includes(clientSearchTerm) ||
        client.cpf?.includes(clientSearchTerm)
      );
      setFilteredClients(filtered);
      setShowClientDropdown(true);
    } else {
      setFilteredClients([]);
      setShowClientDropdown(false);
    }
  }, [clientSearchTerm, clients]);

  useEffect(() => {
    if (productSearchTerm.length >= 2 && currentItem.type === 'product') {
      const filtered = parts.filter(part =>
        part.name?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        part.code?.toLowerCase().includes(productSearchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowProductDropdown(true);
    } else {
      setFilteredProducts([]);
      setShowProductDropdown(false);
    }
  }, [productSearchTerm, parts, currentItem.type]);

  const handleClientSelect = (client) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.id || client.firestoreId,
      clientName: client.name,
      clientPhone: client.phone || '',
      clientEmail: client.email || ''
    }));
    setClientSearchTerm(client.name);
    setShowClientDropdown(false);
    setErrors(prev => ({ ...prev, clientName: null }));
  };

  const handlePlateSearch = async () => {
    if (!formData.vehiclePlate || formData.vehiclePlate.length < 7) {
      toast.error('Digite uma placa válida');
      return;
    }

    setIsSearchingPlate(true);
    try {
      console.log('[BudgetModal] 🔍 Buscando placa:', formData.vehiclePlate);
      const response = await searchVehicleByPlate(formData.vehiclePlate);
      console.log('[BudgetModal] 📡 Resposta da API:', response);
      
      if (response && response.success && response.data) {
        const vehicleData = response.data;
        setFormData(prev => ({
          ...prev,
          vehicleBrand: vehicleData.brand || '',
          vehicleModel: vehicleData.model || '',
          vehicleYear: vehicleData.year || '',
          vehicleColor: vehicleData.color || ''
        }));
        toast.success('Dados do veículo encontrados!');
      } else {
        const errorMsg = response?.error || 'Veículo não encontrado';
        toast.error(errorMsg);
        console.warn('[BudgetModal] ⚠️ Erro na busca:', errorMsg);
      }
    } catch (error) {
      console.error('[BudgetModal] ❌ Erro ao buscar placa:', error);
      toast.error('Erro ao consultar placa. Tente novamente.');
    } finally {
      setIsSearchingPlate(false);
    }
  };

  const handleProductSelect = (product) => {
    setCurrentItem(prev => ({
      ...prev,
      productId: product.id || product.firestoreId,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.salePrice || product.price || 0)
    }));
    setProductSearchTerm(product.name);
    setShowProductDropdown(false);
  };

  const addItem = () => {
    if (!currentItem.name.trim()) {
      toast.error('Informe o nome do item');
      return;
    }
    if (currentItem.quantity <= 0) {
      toast.error('Quantidade deve ser maior que zero');
      return;
    }
    if (currentItem.price <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...currentItem, id: Date.now() }]
    }));

    setCurrentItem({
      type: 'product', productId: '', name: '', description: '', quantity: 1, price: 0
    });
    setProductSearchTerm('');
    toast.success('Item adicionado!');
  };

  const removeItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
    toast.success('Item removido');
  };

  const updateItem = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);
    const discount = parseFloat(formData.discount) || 0;
    return Math.max(0, subtotal - discount);
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.clientName.trim()) newErrors.clientName = 'Nome do cliente é obrigatório';
      if (!formData.clientPhone.trim()) newErrors.clientPhone = 'Telefone é obrigatório';
    }
    if (step === 2) {
      if (!formData.vehiclePlate.trim()) newErrors.vehiclePlate = 'Placa é obrigatória';
      if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Modelo é obrigatório';
    }
    if (step === 3) {
      if (formData.items.length === 0) newErrors.items = 'Adicione pelo menos um item';
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
    return (parseInt(number || 0) / 100).toFixed(2);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      const budgetData = {
        clientId: formData.clientId, clientName: formData.clientName,
        clientPhone: formData.clientPhone, clientEmail: formData.clientEmail,
        vehicleId: formData.vehicleId, vehiclePlate: formData.vehiclePlate.toUpperCase(),
        vehicleBrand: formData.vehicleBrand, vehicleModel: formData.vehicleModel,
        vehicleYear: formData.vehicleYear, vehicleColor: formData.vehicleColor,
        items: formData.items, discount: parseFloat(formData.discount) || 0,
        total: calculateTotal(), notes: formData.notes,
        internalNotes: formData.internalNotes, validUntil: formData.validUntil,
        checkinId: checkinData?.id || checkinData?.firestoreId || null
      };

      let result;
      if (budget) {
        result = await updateBudget(budget.id || budget.firestoreId, budgetData);
      } else {
        result = await createBudget(budgetData);
      }

      if (result.success) {
        toast.success(budget ? 'Orçamento atualizado!' : 'Orçamento criado!');
        onClose();
      } else {
        throw new Error(result.error || 'Erro ao salvar orçamento');
      }
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      toast.error(error.message || 'Erro ao salvar orçamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentStepData = STEPS.find(s => s.id === currentStep);
  const subtotal = formData.items.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0);
  const total = calculateTotal();

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl my-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-[90vh] flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="relative px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30"
                      >
                        <currentStepData.icon className="w-5 h-5" stroke="white" strokeWidth={2.5} />
                      </motion.div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                          {budget ? 'Editar Orçamento' : 'Novo Orçamento'}
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {currentStepData.description}
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

                  {/* Steps Indicator */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-2">
                      {STEPS.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                          <div className="flex flex-col items-center w-full">
                            <motion.div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-all ${
                                currentStep >= step.id
                                  ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-600/30'
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
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {step.title}
                            </span>
                          </div>
                          {index < STEPS.length - 1 && (
                            <div className="flex-1 h-1 mx-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              <motion.div
                                className="h-full bg-indigo-600"
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
                    {/* Step 1: Cliente */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-7"
                      >
                        {checkinData && (
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
                                  Dados carregados do check-in
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                  Cliente e veículo já preenchidos automaticamente
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                              <User className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Buscar Cliente</span>
                            <span className="text-red-500 text-xs ml-1">*</span>
                          </label>
                          
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={clientSearchTerm}
                              onChange={(e) => {
                                setClientSearchTerm(e.target.value);
                                setFormData(prev => ({ ...prev, clientName: e.target.value }));
                              }}
                              placeholder="Buscar por nome, telefone ou CPF..."
                              className={`w-full pl-16 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                                errors.clientName
                                  ? 'border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                              } text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:border-blue-500 transition-all outline-none`}
                            />
                            
                            {showClientDropdown && filteredClients.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute z-[100] w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto"
                              >
                                {filteredClients.map((client) => (
                                  <button
                                    key={client.id || client.firestoreId}
                                    type="button"
                                    onClick={() => handleClientSelect(client)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                  >
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                        {client.name}
                                      </p>
                                      {client.phone && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                          {formatPhone(client.phone)}
                                        </p>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </div>
                          {errors.clientName && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2.5 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {errors.clientName}
                            </motion.p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                                <Phone className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Telefone</span>
                              <span className="text-red-500 text-xs ml-1">*</span>
                            </label>
                            <input
                              type="tel"
                              value={formData.clientPhone}
                              onChange={(e) => {
                                const formatted = formatPhone(e.target.value);
                                setFormData({ ...formData, clientPhone: formatted });
                                setErrors({ ...errors, clientPhone: null });
                              }}
                              placeholder="(11) 98765-4321"
                              maxLength={15}
                              className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                                errors.clientPhone
                                  ? 'border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                              } text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:border-blue-500 transition-all outline-none`}
                            />
                            {errors.clientPhone && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2.5 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {errors.clientPhone}
                              </motion.p>
                            )}
                          </div>

                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                <Mail className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Email</span>
                            </label>
                            <input
                              type="email"
                              value={formData.clientEmail}
                              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                              placeholder="cliente@email.com"
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Veículo */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-7"
                      >
                        {formData.vehiclePlate && formData.vehicleModel && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200/50 dark:border-red-800/50 p-6 shadow-lg"
                          >
                            <div className="flex items-center gap-5">
                              <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl blur-xl" />
                                <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                  <Car className="w-11 h-11 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-2">
                                  <span className="text-sm font-bold text-gray-900 dark:text-white tracking-wider">
                                    {formData.vehiclePlate}
                                  </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white truncate mb-1">
                                  {formData.vehicleBrand && `${formData.vehicleBrand} `}{formData.vehicleModel}
                                </div>
                                {(formData.vehicleYear || formData.vehicleColor) && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {formData.vehicleYear && <span>{formData.vehicleYear}</span>}
                                    {formData.vehicleColor && (
                                      <>
                                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                                        <span>{formData.vehicleColor}</span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/25">
                              <Car className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Placa do Veículo</span>
                            <span className="text-red-500 text-xs ml-1">*</span>
                          </label>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={formData.vehiclePlate}
                              onChange={(e) => {
                                setFormData({ ...formData, vehiclePlate: e.target.value.toUpperCase() });
                                setErrors({ ...errors, vehiclePlate: null });
                              }}
                              placeholder="ABC-1234"
                              maxLength={8}
                              className={`flex-1 px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                                errors.vehiclePlate
                                  ? 'border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                              } text-gray-900 dark:text-white placeholder-gray-400 uppercase font-bold text-lg tracking-widest text-center focus:ring-2 focus:border-blue-500 transition-all outline-none`}
                            />
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={handlePlateSearch}
                              disabled={isSearchingPlate}
                              className="px-6 py-3.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                              {isSearchingPlate ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Buscando...
                                </>
                              ) : (
                                <>
                                  <Search className="w-4 h-4" />
                                  Buscar
                                </>
                              )}
                            </motion.button>
                          </div>
                          {errors.vehiclePlate && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2.5 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {errors.vehiclePlate}
                            </motion.p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                              Marca
                            </label>
                            <input
                              type="text"
                              value={formData.vehicleBrand}
                              onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                              placeholder="Honda, Toyota..."
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                            />
                          </div>

                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                              Modelo <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.vehicleModel}
                              onChange={(e) => {
                                setFormData({ ...formData, vehicleModel: e.target.value });
                                setErrors({ ...errors, vehicleModel: null });
                              }}
                              placeholder="Civic, CB 600F..."
                              className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                                errors.vehicleModel
                                  ? 'border-red-500 focus:ring-red-500/50'
                                  : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                              } text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:border-blue-500 transition-all outline-none`}
                            />
                            {errors.vehicleModel && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {errors.vehicleModel}
                              </motion.p>
                            )}
                          </div>

                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                              Ano
                            </label>
                            <input
                              type="text"
                              value={formData.vehicleYear}
                              onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                              placeholder="2023"
                              maxLength={4}
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                            />
                          </div>

                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                              Cor
                            </label>
                            <input
                              type="text"
                              value={formData.vehicleColor}
                              onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                              placeholder="Preto, Branco..."
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Itens */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-7"
                      >
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-600/25">
                              <Plus className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Adicionar Item</span>
                          </label>

                          {/* Toggle Produto/Serviço */}
                          <div className="flex gap-3 mb-4">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setCurrentItem({ ...currentItem, type: 'product' })}
                              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                                currentItem.type === 'product'
                                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/30'
                                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Package className="w-6 h-6" />
                                <span className="text-sm font-bold">Produto</span>
                              </div>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setCurrentItem({ ...currentItem, type: 'service' })}
                              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                                currentItem.type === 'service'
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-transparent text-white shadow-lg shadow-green-500/30'
                                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <Wrench className="w-6 h-6" />
                                <span className="text-sm font-bold">Serviço</span>
                              </div>
                            </motion.button>
                          </div>

                          {/* Busca de Produto (se tipo = product) */}
                          {currentItem.type === 'product' && (
                            <div className="relative mb-4">
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Buscar Produto
                              </label>
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                  <Search className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                  type="text"
                                  value={productSearchTerm}
                                  onChange={(e) => setProductSearchTerm(e.target.value)}
                                  placeholder="Buscar no inventário..."
                                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                />
                                
                                {showProductDropdown && filteredProducts.length > 0 && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute z-[100] w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto"
                                  >
                                    {filteredProducts.map((product) => (
                                      <button
                                        key={product.id || product.firestoreId}
                                        type="button"
                                        onClick={() => handleProductSelect(product)}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                      >
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                          <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {product.name}
                                          </p>
                                          <p className="text-xs text-gray-600 dark:text-gray-400">
                                            R$ {parseFloat(product.salePrice || product.price || 0).toFixed(2)}
                                          </p>
                                        </div>
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Formulário do Item */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            <div className="lg:col-span-5">
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Nome/Descrição
                              </label>
                              <input
                                type="text"
                                value={currentItem.name}
                                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                placeholder={currentItem.type === 'product' ? 'Ex: Filtro de óleo' : 'Ex: Troca de óleo'}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                              />
                            </div>

                            <div className="lg:col-span-2">
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Qtd
                              </label>
                              <input
                                type="number"
                                value={currentItem.quantity}
                                onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                                min="1"
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                              />
                            </div>

                            <div className="lg:col-span-3">
                              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Preço Unit.
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                                  R$
                                </span>
                                <input
                                  type="text"
                                  value={currentItem.price.toFixed(2)}
                                  onChange={(e) => {
                                    const formatted = formatCurrency(e.target.value);
                                    setCurrentItem({ ...currentItem, price: parseFloat(formatted) });
                                  }}
                                  placeholder="0,00"
                                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                                />
                              </div>
                            </div>

                            <div className="lg:col-span-2 flex items-end">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={addItem}
                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Adicionar
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Lista de Itens */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                <ShoppingCart className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Itens Adicionados</span>
                            </label>
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                              {formData.items.length} {formData.items.length === 1 ? 'item' : 'itens'}
                            </span>
                          </div>

                          {formData.items.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Nenhum item adicionado
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Adicione produtos ou serviços ao orçamento
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {formData.items.map((item, index) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`p-4 rounded-xl border-2 ${
                                    item.type === 'product'
                                      ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                                      : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                      item.type === 'product'
                                        ? 'bg-blue-100 dark:bg-blue-900/30'
                                        : 'bg-green-100 dark:bg-green-900/30'
                                    }`}>
                                      {item.type === 'product' ? (
                                        <Package className={`w-5 h-5 ${
                                          item.type === 'product'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-green-600 dark:text-green-400'
                                        }`} />
                                      ) : (
                                        <Wrench className="w-5 h-5 text-green-600 dark:text-green-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                            {item.name}
                                          </p>
                                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold mt-1 ${
                                            item.type === 'product'
                                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                          }`}>
                                            {item.type === 'product' ? 'Produto' : 'Serviço'}
                                          </span>
                                        </div>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          type="button"
                                          onClick={() => removeItem(item.id)}
                                          className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                      </div>
                                      <div className="grid grid-cols-3 gap-3">
                                        <div>
                                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Qtd</label>
                                          <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                            min="1"
                                            className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Preço</label>
                                          <input
                                            type="text"
                                            value={parseFloat(item.price).toFixed(2)}
                                            onChange={(e) => {
                                              const formatted = formatCurrency(e.target.value);
                                              updateItem(item.id, 'price', parseFloat(formatted));
                                            }}
                                            className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Subtotal</label>
                                          <div className="px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-bold">
                                            R$ {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}

                          {errors.items && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {errors.items}
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Resumo */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-7"
                      >
                        {/* Resumo Financeiro */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-2xl p-6 border-2 border-yellow-200/50 dark:border-yellow-800/50 shadow-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                              <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              Resumo Financeiro
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Subtotal ({formData.items.length} {formData.items.length === 1 ? 'item' : 'itens'})
                              </span>
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                R$ {subtotal.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-t border-yellow-200 dark:border-yellow-800">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Desconto
                              </span>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                  R$
                                </span>
                                <input
                                  type="text"
                                  value={formData.discount}
                                  onChange={(e) => {
                                    const formatted = formatCurrency(e.target.value);
                                    setFormData({ ...formData, discount: formatted });
                                  }}
                                  placeholder="0,00"
                                  className="w-32 pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500/50 outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between py-3 border-t-2 border-yellow-300 dark:border-yellow-700">
                              <span className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                Total
                              </span>
                              <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                R$ {total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Validade */}
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                          <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                              <Calendar className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                            </div>
                            <span className="tracking-tight">Válido Até</span>
                          </label>
                          <input
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                          />
                          <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Data limite para aprovação do orçamento
                          </p>
                        </div>

                        {/* Observações */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <FileText className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Observações para o Cliente</span>
                            </label>
                            <textarea
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="Informações que o cliente verá no orçamento..."
                              rows={4}
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none resize-none"
                            />
                          </div>

                          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                                <Edit2 className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                              </div>
                              <span className="tracking-tight">Observações Internas</span>
                            </label>
                            <textarea
                              value={formData.internalNotes}
                              onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                              placeholder="Anotações internas (não visíveis para o cliente)..."
                              rows={4}
                              className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none resize-none"
                            />
                          </div>
                        </div>

                        {/* Preview do Orçamento */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-2xl p-6 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              Preview do Orçamento
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-purple-200 dark:border-purple-800">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliente</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{formData.clientName}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-indigo-200 dark:border-indigo-800">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Veículo</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {formData.vehiclePlate} - {formData.vehicleModel}
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-indigo-200 dark:border-indigo-800">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Itens</span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {formData.items.length} {formData.items.length === 1 ? 'item' : 'itens'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor Total</span>
                              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                                R$ {total.toFixed(2)}
                              </span>
                            </div>
                          </div>
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
                        className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                        className="px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            {budget ? 'Atualizar Orçamento' : 'Criar Orçamento'}
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
    </>
  );
};

export default BudgetModalPremium;
