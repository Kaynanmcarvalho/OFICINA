import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Phone, Car, FileText, UserCircle, Upload, 
  Gauge, Fuel, Wrench, AlertTriangle, CheckCircle2,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import CampoBuscaCliente from './CampoBuscaCliente';
import UploaderFotos from './UploaderFotos';
import ModalNovoCliente from './ModalNovoCliente';
import VehicleThumbnail from '../../../components/VehicleThumbnail';
import { useCheckinStore } from '../../../store';

const STEPS = [
  { id: 1, title: 'Cliente', icon: User, description: 'Dados do cliente' },
  { id: 2, title: 'Veículo', icon: Car, description: 'Informações do veículo' },
  { id: 3, title: 'Detalhes', icon: Wrench, description: 'Condições e serviços' },
  { id: 4, title: 'Fotos', icon: Upload, description: 'Registro fotográfico' }
];

const FUEL_LEVELS = [
  { value: 'empty', label: 'Vazio', icon: '🔴' },
  { value: '1/4', label: '1/4', icon: '🟡' },
  { value: '1/2', label: '1/2', icon: '🟡' },
  { value: '3/4', label: '3/4', icon: '🟢' },
  { value: 'full', label: 'Cheio', icon: '🟢' }
];

const VEHICLE_CONDITIONS = [
  { id: 'scratches', label: 'Arranhões', icon: '🔸' },
  { id: 'dents', label: 'Amassados', icon: '🔹' },
  { id: 'broken_parts', label: 'Peças quebradas', icon: '⚠️' },
  { id: 'missing_items', label: 'Itens faltando', icon: '❌' },
  { id: 'dirty', label: 'Sujo', icon: '💧' },
  { id: 'good_condition', label: 'Bom estado', icon: '✅' }
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

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({
        cliente: null, telefone: '', placa: '', modelo: '', marca: '', ano: '', cor: '',
        kilometragem: '', nivelCombustivel: '', condicoesVeiculo: [], observacoes: '',
        servicoSolicitado: '', prioridade: 'normal', responsavel: '', fotos: []
      });
      setErrors({});
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
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    } else {
      toast.error('Preencha todos os campos obrigatórios');
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-screen flex items-center justify-center p-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl border-[3px] border-gray-700 dark:border-gray-700 shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 py-5 border-b-2 border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                    <currentStepData.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-950 dark:text-white">
                      Novo Check-in
                    </h2>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mt-0.5">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </motion.button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  {STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                            currentStep >= step.id
                              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}
                          whileHover={{ scale: 1.1 }}
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
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Step 1: Cliente */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                          Cliente <span className="text-red-500">*</span>
                        </label>
                        <CampoBuscaCliente
                          value={formData.cliente}
                          onSelect={handleClienteSelect}
                          error={errors.cliente}
                        />
                        {errors.cliente && (
                          <p className="mt-1 text-xs text-red-500 font-bold">{errors.cliente}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                          Telefone <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.telefone}
                            onChange={(e) => {
                              setFormData({ ...formData, telefone: e.target.value });
                              setErrors({ ...errors, telefone: null });
                            }}
                            placeholder="(11) 98765-4321"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 ${
                              errors.telefone
                                ? 'border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                            } text-gray-900 dark:text-gray-100 placeholder-gray-400 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                          />
                        </div>
                        {errors.telefone && (
                          <p className="mt-1 text-xs text-red-500 font-bold">{errors.telefone}</p>
                        )}
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
                    className="space-y-8"
                  >
                    {/* Preview Minimalista */}
                    {formData.placa && formData.modelo && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-5 p-6 rounded-3xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/40"
                      >
                        <VehicleThumbnail
                          vehicle={{
                            brand: formData.marca || formData.modelo.split(' ')[0],
                            model: formData.modelo,
                            plate: formData.placa,
                            type: 'car'
                          }}
                          size="lg"
                          showLabel={false}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                            {formData.placa}
                          </div>
                          <div className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                            {formData.marca && `${formData.marca} `}{formData.modelo}
                          </div>
                          {(formData.ano || formData.cor) && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {formData.ano} {formData.cor && `• ${formData.cor}`}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Campos */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Placa */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">
                            Placa <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.placa}
                            onChange={(e) => {
                              setFormData({ ...formData, placa: e.target.value.toUpperCase() });
                              setErrors({ ...errors, placa: null });
                            }}
                            placeholder="ABC-1234"
                            maxLength={8}
                            className={`w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border ${
                              errors.placa
                                ? 'border-red-400'
                                : 'border-gray-300 dark:border-gray-600'
                            } text-gray-900 dark:text-gray-100 placeholder-gray-400 uppercase font-semibold text-lg tracking-wide focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all`}
                          />
                          {errors.placa && (
                            <p className="mt-2 text-xs text-red-500">{errors.placa}</p>
                          )}
                        </div>

                        {/* Modelo */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">
                            Modelo <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.modelo}
                            onChange={(e) => {
                              setFormData({ ...formData, modelo: e.target.value });
                              setErrors({ ...errors, modelo: null });
                            }}
                            placeholder="Civic, CB 600F..."
                            className={`w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border ${
                              errors.modelo
                                ? 'border-red-400'
                                : 'border-gray-300 dark:border-gray-600'
                            } text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all`}
                          />
                          {errors.modelo && (
                            <p className="mt-2 text-xs text-red-500">{errors.modelo}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Marca */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">
                            Marca
                          </label>
                          <input
                            type="text"
                            value={formData.marca}
                            onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                            placeholder="Honda, Toyota..."
                            className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          />
                        </div>

                        {/* Ano */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">
                            Ano
                          </label>
                          <input
                            type="text"
                            value={formData.ano}
                            onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                            placeholder="2024"
                            maxLength={4}
                            className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          />
                        </div>

                        {/* Cor */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2.5">
                            Cor
                          </label>
                          <input
                            type="text"
                            value={formData.cor}
                            onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                            placeholder="Preto, Branco..."
                            className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Detalhes */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Kilometragem */}
                      <div>
                        <label className="block text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                          <Gauge className="w-4 h-4 inline mr-1" />
                          Kilometragem (opcional)
                        </label>
                        <input
                          type="number"
                          value={formData.kilometragem}
                          onChange={(e) => setFormData({ ...formData, kilometragem: e.target.value })}
                          placeholder="Ex: 45000"
                          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Registre a km atual do veículo
                        </p>
                      </div>

                      {/* Nível de Combustível */}
                      <div>
                        <label className="block text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                          <Fuel className="w-4 h-4 inline mr-1" />
                          Nível de Combustível (opcional)
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                          {FUEL_LEVELS.map((level) => (
                            <motion.button
                              key={level.value}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFormData({ ...formData, nivelCombustivel: level.value })}
                              className={`p-3 rounded-xl border-2 font-bold text-xs transition-all ${
                                formData.nivelCombustivel === level.value
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              <div className="text-2xl mb-1">{level.icon}</div>
                              {level.label}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Condições do Veículo */}
                    <div>
                      <label className="block text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-3">
                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                        Condições do Veículo (opcional)
                      </label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {VEHICLE_CONDITIONS.map((condition) => (
                          <motion.button
                            key={condition.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleCondition(condition.id)}
                            className={`p-3 rounded-xl border-2 font-bold text-sm transition-all text-left ${
                              formData.condicoesVeiculo.includes(condition.id)
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <span className="text-xl mr-2">{condition.icon}</span>
                            {condition.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Serviço Solicitado */}
                    <div>
                      <label className="block text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                        <Wrench className="w-4 h-4 inline mr-1" />
                        Serviço Solicitado <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.servicoSolicitado}
                        onChange={(e) => {
                          setFormData({ ...formData, servicoSolicitado: e.target.value });
                          setErrors({ ...errors, servicoSolicitado: null });
                        }}
                        placeholder="Ex: Troca de óleo, Revisão completa, Alinhamento..."
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 ${
                          errors.servicoSolicitado
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-700'
                        } text-gray-900 dark:text-gray-100 placeholder-gray-400 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      />
                      {errors.servicoSolicitado && (
                        <p className="mt-1 text-xs text-red-500 font-bold">{errors.servicoSolicitado}</p>
                      )}
                    </div>

                    {/* Prioridade */}
                    <div>
                      <label className="block text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                        Prioridade
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormData({ ...formData, prioridade: 'low' })}
                          className={`p-3 rounded-xl border-2 font-bold transition-all ${
                            formData.prioridade === 'low'
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Baixa
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormData({ ...formData, prioridade: 'normal' })}
                          className={`p-3 rounded-xl border-2 font-bold transition-all ${
                            formData.prioridade === 'normal'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Normal
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFormData({ ...formData, prioridade: 'high' })}
                          className={`p-3 rounded-xl border-2 font-bold transition-all ${
                            formData.prioridade === 'high'
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Alta
                        </motion.button>
                      </div>
                    </div>

                    {/* Observações */}
                    <div>
                      <label className="block text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                        <FileText className="w-4 h-4 inline mr-1" />
                        Observações
                      </label>
                      <textarea
                        value={formData.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                        placeholder="Descreva detalhes importantes, problemas relatados pelo cliente, etc..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      />
                    </div>

                    {/* Responsável */}
                    <div>
                      <label className="block text-sm font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                        <UserCircle className="w-4 h-4 inline mr-1" />
                        Responsável pelo Atendimento <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.responsavel}
                        onChange={(e) => {
                          setFormData({ ...formData, responsavel: e.target.value });
                          setErrors({ ...errors, responsavel: null });
                        }}
                        placeholder="Nome do mecânico/atendente"
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 ${
                          errors.responsavel
                            ? 'border-red-500'
                            : 'border-gray-200 dark:border-gray-700'
                        } text-gray-900 dark:text-gray-100 placeholder-gray-400 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      />
                      {errors.responsavel && (
                        <p className="mt-1 text-xs text-red-500 font-bold">{errors.responsavel}</p>
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

                    <UploaderFotos
                      fotos={formData.fotos}
                      onChange={(fotos) => setFormData({ ...formData, fotos })}
                      maxFotos={10}
                    />

                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                        💡 Dica: Tire fotos de todos os ângulos do veículo, incluindo detalhes de danos existentes
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
                Passo {currentStep} de {STEPS.length}
              </div>

              <div className="flex gap-3">
                {currentStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar
                  </motion.button>
                )}

                {currentStep < STEPS.length ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 transition-all"
                  >
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirmar Check-in
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
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
