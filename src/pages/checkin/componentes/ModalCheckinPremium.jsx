import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Phone, Car, FileText, UserCircle, Upload, 
  Gauge, Fuel, Wrench, AlertTriangle, CheckCircle2,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import CampoBuscaCliente from './CampoBuscaCliente';
import UploaderFotosComAnalise from './UploaderFotosComAnalise';
import ModalNovoCliente from './ModalNovoCliente';
import VehicleThumbnail from '../../../components/VehicleThumbnail';
import { useCheckinStore } from '../../../store';
import { formatPhone } from '../../../utils/formatters';
import { scrollToFirstErrorField } from '../../../hooks/useScrollToError';

const STEPS = [
  { id: 1, title: 'Cliente', icon: User, description: 'Dados do cliente' },
  { id: 2, title: 'Veículo', icon: Car, description: 'Informações do veículo' },
  { id: 3, title: 'Detalhes', icon: Wrench, description: 'Condições e serviços' },
  { id: 4, title: 'Fotos', icon: Upload, description: 'Registro fotográfico' }
];

// SVG Icons para Nível de Combustível - Apple Style
const FuelIcon = ({ level }) => {
  const fillPercentages = {
    empty: 0,
    '1/4': 25,
    '1/2': 50,
    '3/4': 75,
    full: 100
  };
  
  const fillPercent = fillPercentages[level] || 0;
  const fillHeight = (14 * fillPercent) / 100;
  const fillY = 6 + (14 - fillHeight);
  
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tank outline */}
      <rect x="4" y="6" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      {/* Fuel fill */}
      {fillPercent > 0 && (
        <rect 
          x="6" 
          y={fillY} 
          width="8" 
          height={fillHeight} 
          rx="1" 
          fill="currentColor" 
          opacity="0.4"
        />
      )}
      {/* Nozzle */}
      <path d="M16 10H18C19.1 10 20 10.9 20 12V14C20 15.1 19.1 16 18 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="18" cy="13" r="1.5" fill="currentColor"/>
    </svg>
  );
};

const FUEL_LEVELS = [
  { value: 'empty', label: 'Vazio' },
  { value: '1/4', label: '1/4' },
  { value: '1/2', label: '1/2' },
  { value: '3/4', label: '3/4' },
  { value: 'full', label: 'Cheio' }
];

// SVG Icons para Condições do Veículo
const ConditionIcons = {
  scratches: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L21 21M8 8L16 16M5 12L12 19M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  dents: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12C8 12 10 14 12 14C14 14 16 12 16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  broken_parts: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="1" fill="currentColor"/>
    </svg>
  ),
  missing_items: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  dirty: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.69L17 7.19V13.69C17 17.69 14.5 21.19 12 22.19C9.5 21.19 7 17.69 7 13.69V7.19L12 2.69Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  good_condition: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

const VEHICLE_CONDITIONS = [
  { id: 'scratches', label: 'Arranhões' },
  { id: 'dents', label: 'Amassados' },
  { id: 'broken_parts', label: 'Peças quebradas' },
  { id: 'missing_items', label: 'Itens faltando' },
  { id: 'dirty', label: 'Sujo' },
  { id: 'good_condition', label: 'Bom estado' }
];

const ModalCheckinPremium = ({ isOpen, onClose, onSuccess }) => {
  const { createCheckin, uploadPhotos } = useCheckinStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Cliente
    cliente: null,
    telefone: '',
    
    // Step 2: Veículo
    placa: '',
    modelo: '',
    marca: '',
    ano: '',
    cor: '',
    
    // Step 3: Detalhes
    kilometragem: '',
    nivelCombustivel: '',
    condicoesVeiculo: [],
    observacoes: '',
    servicoSolicitado: '',
    prioridade: 'normal',
    responsavel: '',
    
    // Step 4: Fotos
    fotos: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
  const [novoClienteNome, setNovoClienteNome] = useState('');
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0);
  const [isNewVehicle, setIsNewVehicle] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        cliente: null, telefone: '', placa: '', modelo: '', marca: '', ano: '', cor: '',
        kilometragem: '', nivelCombustivel: '', condicoesVeiculo: [], observacoes: '',
        servicoSolicitado: '', prioridade: 'normal', responsavel: '', fotos: []
      });
      setErrors({});
      setSelectedVehicleIndex(0);
      setIsNewVehicle(false);
    }
  }, [isOpen]);

  const handleClienteSelect = (cliente) => {
    if (cliente?.isNew) {
      setNovoClienteNome(cliente.name);
      setShowNovoClienteModal(true);
      return;
    }

    const primeiroVeiculo = cliente?.vehicles?.[0];
    setFormData(prev => ({
      ...prev,
      cliente,
      telefone: cliente?.phone || '',
      placa: primeiroVeiculo?.plate || '',
      modelo: primeiroVeiculo?.model || '',
      marca: primeiroVeiculo?.brand || '',
      ano: primeiroVeiculo?.year || '',
      cor: primeiroVeiculo?.color || ''
    }));
    setErrors(prev => ({ ...prev, cliente: null }));
    setSelectedVehicleIndex(0);
    setIsNewVehicle(false);
  };

  const handleVehicleSelect = (index) => {
    const vehicles = formData.cliente?.vehicles || [];
    if (index === -1) {
      // Novo veículo
      setIsNewVehicle(true);
      setSelectedVehicleIndex(-1);
      setFormData(prev => ({
        ...prev,
        placa: '',
        modelo: '',
        marca: '',
        ano: '',
        cor: ''
      }));
    } else if (vehicles[index]) {
      setIsNewVehicle(false);
      setSelectedVehicleIndex(index);
      const veiculo = vehicles[index];
      setFormData(prev => ({
        ...prev,
        placa: veiculo.plate || '',
        modelo: veiculo.model || '',
        marca: veiculo.brand || '',
        ano: veiculo.year || '',
        cor: veiculo.color || ''
      }));
    }
    setErrors(prev => ({ ...prev, placa: null, modelo: null }));
  };

  const handleNovoClienteSuccess = (newClient) => {
    const primeiroVeiculo = newClient?.vehicles?.[0];
    setFormData(prev => ({
      ...prev,
      cliente: newClient,
      telefone: newClient.phone || '',
      placa: primeiroVeiculo?.plate || '',
      modelo: primeiroVeiculo?.model || ''
    }));
    setErrors(prev => ({ ...prev, cliente: null }));
    setShowNovoClienteModal(false);
    setSelectedVehicleIndex(0);
    setIsNewVehicle(false);
    toast.success('Cliente cadastrado! Continue o check-in.');
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.cliente) newErrors.cliente = 'Selecione um cliente';
      if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    }

    if (step === 2) {
      if (!formData.placa.trim()) {
        newErrors.placa = 'Placa é obrigatória';
      } else if (!/^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/i.test(formData.placa)) {
        newErrors.placa = 'Placa inválida';
      }
      if (!formData.modelo.trim()) newErrors.modelo = 'Modelo é obrigatório';
    }

    if (step === 3) {
      if (!formData.responsavel.trim()) newErrors.responsavel = 'Responsável é obrigatório';
      if (!formData.servicoSolicitado.trim()) newErrors.servicoSolicitado = 'Serviço solicitado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const newErrors = {};

    // Validação por step
    if (currentStep === 1) {
      if (!formData.cliente) newErrors.cliente = 'Selecione um cliente';
      if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    }

    if (currentStep === 2) {
      if (!formData.placa.trim()) {
        newErrors.placa = 'Placa é obrigatória';
      } else if (!/^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/i.test(formData.placa)) {
        newErrors.placa = 'Placa inválida';
      }
      if (!formData.modelo.trim()) newErrors.modelo = 'Modelo é obrigatório';
    }

    if (currentStep === 3) {
      if (!formData.responsavel.trim()) newErrors.responsavel = 'Responsável é obrigatório';
      if (!formData.servicoSolicitado.trim()) newErrors.servicoSolicitado = 'Serviço solicitado é obrigatório';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } else {
      toast.error('Preencha todos os campos obrigatórios');
      // Scroll automático para o primeiro campo com erro
      setTimeout(() => {
        scrollToFirstErrorField(newErrors);
      }, 100);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      const checkinData = {
        clientId: formData.cliente.firestoreId || formData.cliente.id || formData.cliente.clientId,
        clientName: formData.cliente.name,
        clientPhone: formData.telefone,
        vehicleModel: formData.modelo,
        vehicleBrand: formData.marca,
        vehiclePlate: formData.placa.toUpperCase(),
        vehicleYear: formData.ano,
        vehicleColor: formData.cor,
        mileage: formData.kilometragem,
        fuelLevel: formData.nivelCombustivel,
        vehicleConditions: formData.condicoesVeiculo,
        observations: formData.observacoes,
        requestedService: formData.servicoSolicitado,
        priority: formData.prioridade,
        responsible: formData.responsavel
      };

      const result = await createCheckin(checkinData);

      if (!result.success) {
        throw new Error(result.error || 'Erro ao criar check-in');
      }

      // Upload photos if any
      if (formData.fotos.length > 0) {
        const photoFiles = formData.fotos.map(f => f.file);
        await uploadPhotos(result.data.firestoreId, photoFiles, 'before');
      }

      toast.success('Check-in realizado com sucesso!');
      onSuccess(result.data);
      onClose();
    } catch (error) {
      console.error('Erro ao realizar check-in:', error);
      toast.error(error.message || 'Erro ao realizar check-in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCondition = (conditionId) => {
    setFormData(prev => ({
      ...prev,
      condicoesVeiculo: prev.condicoesVeiculo.includes(conditionId)
        ? prev.condicoesVeiculo.filter(id => id !== conditionId)
        : [...prev.condicoesVeiculo, conditionId]
    }));
  };

  if (!isOpen) return null;

  const currentStepData = STEPS.find(s => s.id === currentStep);
  const progress = (currentStep / STEPS.length) * 100;

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
            <div className="relative px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                  >
                    <currentStepData.icon className="w-5 h-5" stroke="white" strokeWidth={2.5} />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Novo Check-in
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

              {/* Steps Indicator - Apple Style */}
              <div className="mt-3">
                <div className="flex items-center justify-between gap-2">
                  {STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center w-full">
                        <motion.div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs transition-all ${
                            currentStep >= step.id
                              ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
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
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {step.title}
                        </span>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className="flex-1 h-1 mx-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-500"
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
                {/* Step 1: Cliente - Apple Design */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-7"
                  >
                    {/* Busca de Cliente - Apple Style */}
                    <div id="field-cliente" data-field="cliente" className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm overflow-visible">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <User className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-tight">Selecione o Cliente</span>
                        <span className="text-red-500 text-xs ml-1">*</span>
                      </label>
                      <CampoBuscaCliente
                        value={formData.cliente}
                        onSelect={handleClienteSelect}
                        error={errors.cliente}
                      />
                      {errors.cliente && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2.5 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.cliente}
                        </motion.p>
                      )}
                      <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Busque por nome, telefone ou documento do cliente
                      </p>
                    </div>

                    {/* Telefone - Apple Style */}
                    <div id="field-telefone" data-field="telefone" className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                          <Phone className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-tight">Telefone de Contato</span>
                        <span className="text-red-500 text-xs ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="telefone"
                          value={formData.telefone}
                          onChange={(e) => {
                            const formatted = formatPhone(e.target.value);
                            setFormData({ ...formData, telefone: formatted });
                            setErrors({ ...errors, telefone: null });
                          }}
                          placeholder="(11) 98765-4321"
                          maxLength={15}
                          className={`w-full pl-16 pr-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                            errors.telefone
                              ? 'border-red-500 focus:ring-red-500/50'
                              : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                          } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:border-blue-500 transition-all outline-none`}
                        />
                      </div>
                      {errors.telefone && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2.5 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.telefone}
                        </motion.p>
                      )}
                      <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Número principal para contato com o cliente
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Veículo - Apple Design */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-7"
                  >
                    {/* Seleção de Veículos do Cliente */}
                    {formData.cliente?.vehicles?.length > 0 && (
                      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                        <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <Car className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                          </div>
                          <span className="tracking-tight">Veículos do Cliente</span>
                          <span className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {formData.cliente.vehicles.length} cadastrado{formData.cliente.vehicles.length > 1 ? 's' : ''}
                          </span>
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                          {formData.cliente.vehicles.map((veiculo, index) => (
                            <motion.button
                              key={veiculo.plate || index}
                              type="button"
                              onClick={() => handleVehicleSelect(index)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                                selectedVehicleIndex === index && !isNewVehicle
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/20'
                                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              {selectedVehicleIndex === index && !isNewVehicle && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                </div>
                              )}
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                  <Car className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-sm text-gray-900 dark:text-white tracking-wider">
                                    {veiculo.plate || 'Sem placa'}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {veiculo.brand && `${veiculo.brand} `}{veiculo.model || 'Modelo não informado'}
                                  </div>
                                  {veiculo.year && (
                                    <div className="text-xs text-gray-500 dark:text-gray-500">
                                      {veiculo.year}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                          
                          {/* Botão Adicionar Novo Veículo */}
                          <motion.button
                            type="button"
                            onClick={() => handleVehicleSelect(-1)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-4 rounded-xl border-2 border-dashed transition-all text-left ${
                              isNewVehicle
                                ? 'border-green-500 bg-green-50 dark:bg-green-950/30 shadow-lg shadow-green-500/20'
                                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50/50 dark:hover:bg-green-950/20'
                            }`}
                          >
                            {isNewVehicle && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isNewVehicle 
                                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                  : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700'
                              }`}>
                                <svg className={`w-5 h-5 ${isNewVehicle ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} viewBox="0 0 24 24" fill="none">
                                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-bold text-sm ${isNewVehicle ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                  Novo Veículo
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                  Cadastrar outro veículo
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          Selecione um veículo cadastrado ou adicione um novo
                        </p>
                      </div>
                    )}

                    {/* Preview Premium do Veículo */}
                    {formData.placa && formData.modelo && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/50 p-6 shadow-lg"
                      >
                        <div className="flex items-center gap-5">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
                            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <svg className="w-11 h-11 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 13L7 7H17L19 13M5 13V17C5 17.5523 5.44772 18 6 18H7M5 13H19M19 13V17C19 17.5523 18.5523 18 18 18H17M7 18C7 19.1046 7.89543 20 9 20C10.1046 20 11 19.1046 11 18M7 18C7 16.8954 7.89543 16 9 16C10.1046 16 11 16.8954 11 18M17 18C17 19.1046 16.1046 20 15 20C13.8954 20 13 19.1046 13 18M17 18C17 16.8954 16.1046 16 15 16C13.8954 16 13 16.8954 13 18M11 18H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 10L8 7H16L17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-2">
                              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="10" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <path d="M6 14H8M16 14H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                              <span className="text-sm font-bold text-gray-900 dark:text-white tracking-wider">
                                {formData.placa}
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white truncate mb-1">
                              {formData.marca && `${formData.marca} `}{formData.modelo}
                            </div>
                            {(formData.ano || formData.cor) && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                {formData.ano && (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                      <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
                                      <path d="M3 10H21M8 3V6M16 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                    {formData.ano}
                                  </span>
                                )}
                                {formData.cor && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                                    <span className="flex items-center gap-1">
                                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                                      </svg>
                                      {formData.cor}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Placa e Modelo - Apple Style */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/25">
                          <Car className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-tight">Identificação do Veículo</span>
                      </label>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Placa */}
                        <div id="field-placa" data-field="placa">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Placa <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="placa"
                            value={formData.placa}
                            onChange={(e) => {
                              setFormData({ ...formData, placa: e.target.value.toUpperCase() });
                              setErrors({ ...errors, placa: null });
                            }}
                            placeholder="ABC-1234"
                            maxLength={8}
                            className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                              errors.placa
                                ? 'border-red-500 focus:ring-red-500/50'
                                : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                            } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 uppercase font-bold text-lg tracking-widest text-center focus:ring-2 focus:border-blue-500 transition-all outline-none`}
                          />
                          {errors.placa && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {errors.placa}
                            </motion.p>
                          )}
                        </div>

                        {/* Modelo */}
                        <div id="field-modelo" data-field="modelo">
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Modelo <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="modelo"
                            value={formData.modelo}
                            onChange={(e) => {
                              setFormData({ ...formData, modelo: e.target.value });
                              setErrors({ ...errors, modelo: null });
                            }}
                            placeholder="Civic, CB 600F..."
                            className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                              errors.modelo
                                ? 'border-red-500 focus:ring-red-500/50'
                                : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                            } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:border-blue-500 transition-all outline-none`}
                          />
                          {errors.modelo && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {errors.modelo}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Detalhes Adicionais - Apple Style */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2.5"/>
                            <path d="M9 12H15M9 16H12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <span className="tracking-tight">Detalhes Adicionais</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-auto">(opcional)</span>
                      </label>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Marca */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Marca
                          </label>
                          <input
                            type="text"
                            value={formData.marca}
                            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                            placeholder="Honda, Toyota..."
                            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>

                        {/* Ano */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Ano
                          </label>
                          <input
                            type="text"
                            value={formData.ano}
                            onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                            placeholder="2024"
                            maxLength={4}
                            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>

                        {/* Cor */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Cor
                          </label>
                          <input
                            type="text"
                            value={formData.cor}
                            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                            placeholder="Preto, Branco..."
                            className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Detalhes - Apple Design */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-7"
                  >
                    {/* Kilometragem - Apple Style */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <Gauge className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-tight">Kilometragem</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-auto">(opcional)</span>
                      </label>
                      <input
                        type="number"
                        value={formData.kilometragem}
                        onChange={(e) => setFormData({ ...formData, kilometragem: e.target.value })}
                        placeholder="45.000 km"
                        className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                      />
                      <p className="mt-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Registre a quilometragem atual do veículo
                      </p>
                    </div>

                    {/* Nível de Combustível - Apple Style */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                          <Fuel className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-tight">Nível de Combustível</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-auto">(opcional)</span>
                      </label>
                      <div className="grid grid-cols-5 gap-2.5">
                        {FUEL_LEVELS.map((level) => (
                          <motion.button
                            key={level.value}
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setFormData({ ...formData, nivelCombustivel: level.value })}
                            className={`relative p-3.5 rounded-xl transition-all ${
                              formData.nivelCombustivel === level.value
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30'
                                : 'bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1.5">
                              <FuelIcon level={level.value} />
                              <span className={`text-xs font-semibold tracking-tight ${
                                formData.nivelCombustivel === level.value
                                  ? 'text-white'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {level.label}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Condições do Veículo - Apple Style */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                          <AlertTriangle className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-tight">Condições do Veículo</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-auto">(opcional)</span>
                      </label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {VEHICLE_CONDITIONS.map((condition) => {
                          const Icon = ConditionIcons[condition.id];
                          const isSelected = formData.condicoesVeiculo.includes(condition.id);
                          return (
                            <motion.button
                              key={condition.id}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => toggleCondition(condition.id)}
                              className={`relative p-4 rounded-xl transition-all text-left ${
                                isSelected
                                  ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30'
                                  : 'bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-white/20'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                  <div className={isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}>
                                    <Icon />
                                  </div>
                                </div>
                                <span className={`text-sm font-semibold tracking-tight ${
                                  isSelected
                                    ? 'text-white'
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {condition.label}
                                </span>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" strokeWidth={3} />
                                </motion.div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Serviço Solicitado - Apple Style */}
                    <div id="field-servicoSolicitado" data-field="servicoSolicitado" className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                          <Wrench className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-tight">Serviço Solicitado</span>
                        <span className="text-red-500 text-xs ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="servicoSolicitado"
                        value={formData.servicoSolicitado}
                        onChange={(e) => {
                          setFormData({ ...formData, servicoSolicitado: e.target.value });
                          setErrors({ ...errors, servicoSolicitado: null });
                        }}
                        placeholder="Troca de óleo, Revisão completa, Alinhamento..."
                        className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                          errors.servicoSolicitado
                            ? 'border-red-500 focus:ring-red-500/50'
                            : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                        } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:border-blue-500 transition-all outline-none`}
                      />
                      {errors.servicoSolicitado && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2.5 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.servicoSolicitado}
                        </motion.p>
                      )}
                    </div>

                    {/* Prioridade - Apple Style */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="tracking-tight">Prioridade</span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setFormData({ ...formData, prioridade: 'low' })}
                          className={`relative p-4 rounded-xl transition-all ${
                            formData.prioridade === 'low'
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                              : 'bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              formData.prioridade === 'low'
                                ? 'bg-white/20'
                                : 'bg-green-100 dark:bg-green-900/30'
                            }`}>
                              <svg className={`w-4 h-4 ${formData.prioridade === 'low' ? 'text-white' : 'text-green-600 dark:text-green-400'}`} viewBox="0 0 24 24" fill="none">
                                <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 7L12 12L17 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span className={`text-sm font-semibold tracking-tight ${
                              formData.prioridade === 'low'
                                ? 'text-white'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              Baixa
                            </span>
                          </div>
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setFormData({ ...formData, prioridade: 'normal' })}
                          className={`relative p-4 rounded-xl transition-all ${
                            formData.prioridade === 'normal'
                              ? 'bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/30'
                              : 'bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              formData.prioridade === 'normal'
                                ? 'bg-white/20'
                                : 'bg-blue-100 dark:bg-blue-900/30'
                            }`}>
                              <svg className={`w-4 h-4 ${formData.prioridade === 'normal' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                              </svg>
                            </div>
                            <span className={`text-sm font-semibold tracking-tight ${
                              formData.prioridade === 'normal'
                                ? 'text-white'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              Normal
                            </span>
                          </div>
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setFormData({ ...formData, prioridade: 'high' })}
                          className={`relative p-4 rounded-xl transition-all ${
                            formData.prioridade === 'high'
                              ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30'
                              : 'bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              formData.prioridade === 'high'
                                ? 'bg-white/20'
                                : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                              <svg className={`w-4 h-4 ${formData.prioridade === 'high' ? 'text-white' : 'text-red-600 dark:text-red-400'}`} viewBox="0 0 24 24" fill="none">
                                <path d="M7 11L12 6L17 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 17L12 12L17 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span className={`text-sm font-semibold tracking-tight ${
                              formData.prioridade === 'high'
                                ? 'text-white'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              Alta
                            </span>
                          </div>
                        </motion.button>
                      </div>
                    </div>

                    {/* Observações - Apple Style */}
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-lg shadow-slate-500/25">
                          <FileText className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-tight">Observações</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-auto">(opcional)</span>
                      </label>
                      <textarea
                        value={formData.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                        placeholder="Descreva detalhes importantes, problemas relatados pelo cliente..."
                        rows={4}
                        className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none outline-none"
                      />
                    </div>

                    {/* Responsável - Apple Style */}
                    <div id="field-responsavel" data-field="responsavel" className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                      <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                          <UserCircle className="w-4 h-4" stroke="white" strokeWidth={2.5} />
                        </div>
                        <span className="tracking-tight">Responsável pelo Atendimento</span>
                        <span className="text-red-500 text-xs ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="responsavel"
                        value={formData.responsavel}
                        onChange={(e) => {
                          setFormData({ ...formData, responsavel: e.target.value });
                          setErrors({ ...errors, responsavel: null });
                        }}
                        placeholder="Nome do mecânico ou atendente"
                        className={`w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-900 border ${
                          errors.responsavel
                            ? 'border-red-500 focus:ring-red-500/50'
                            : 'border-gray-300/50 dark:border-gray-600/50 focus:ring-blue-500/50'
                        } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium focus:ring-2 focus:border-blue-500 transition-all outline-none`}
                      />
                      {errors.responsavel && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2.5 text-xs text-red-500 font-semibold flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {errors.responsavel}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Fotos */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-6">
                      <Upload className="w-12 h-12 mx-auto text-blue-500 mb-3" />
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
                        Registro Fotográfico
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Adicione fotos do veículo para documentar o estado na entrada (opcional)
                      </p>
                    </div>

                    <UploaderFotosComAnalise
                      fotos={formData.fotos}
                      onChange={(fotos) => setFormData({ ...formData, fotos })}
                      maxFotos={10}
                      autoAnalyze={true}
                      vehicleInfo={{
                        plate: formData.placa,
                        brand: formData.marca,
                        model: formData.modelo,
                        year: formData.ano ? parseInt(formData.ano) : undefined,
                      }}
                    />

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                          <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                            Análise Automática de Danos
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            As fotos são analisadas automaticamente por IA para detectar riscos, amassados, trincas e outros danos.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer - Apple Style */}
            <div className="flex items-center justify-between px-6 py-2.5 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Passo <span className="font-bold text-gray-900 dark:text-white">{currentStep}</span> de {STEPS.length}
                </span>
              </div>

              <div className="flex gap-3">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-semibold"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Voltar
                  </motion.button>
                )}

                {currentStep < STEPS.length ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
                  >
                    Próximo
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Confirmar Check-in
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

      <ModalNovoCliente
        isOpen={showNovoClienteModal}
        onClose={() => setShowNovoClienteModal(false)}
        onSuccess={handleNovoClienteSuccess}
        initialName={novoClienteNome}
      />
    </>
  );
};

export default ModalCheckinPremium;
