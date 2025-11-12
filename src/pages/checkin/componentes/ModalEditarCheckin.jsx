import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Car, Phone, Mail, Wrench, 
  CheckCircle2, Clock
} from 'lucide-react';

// SVG Icons Components
const StatusIcons = {
  pending: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
      <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  in_progress: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  completed: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  cancelled: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
};

const PriorityIcons = {
  low: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 19V5M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="19" r="2" fill="currentColor"/>
    </svg>
  ),
  normal: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M5 12L9 8M5 12L9 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 12L15 8M19 12L15 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  high: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="5" r="2" fill="currentColor"/>
    </svg>
  ),
  urgent: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 9V13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="1" fill="currentColor"/>
    </svg>
  )
};

// Ícone principal do modal - Clipboard com check elegante (sempre branco)
const ClipboardCheckIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="18" rx="2" stroke="white" strokeWidth="2" fill="none"/>
    <path d="M8 2H16V4H8V2Z" fill="white"/>
    <rect x="7" y="1" width="10" height="4" rx="1" stroke="white" strokeWidth="2" fill="none"/>
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ModalEditarCheckin = ({ isOpen, onClose, checkinData, onSave }) => {
  const [formData, setFormData] = useState({
    // Cliente
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    
    // Veículo
    vehicleBrand: '',
    vehicleModel: '',
    vehiclePlate: '',
    vehicleYear: '',
    vehicleColor: '',
    vehicleType: 'car',
    
    // Condições
    mileage: '',
    fuelLevel: '',
    vehicleConditions: [],
    
    // Serviços
    services: '',
    priority: 'normal',
    responsible: '',
    observations: '',
    status: 'in_progress'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (checkinData) {
      setFormData({
        clientName: checkinData.clientName || checkinData.nomeCliente || '',
        clientPhone: checkinData.clientPhone || checkinData.telefoneCliente || '',
        clientEmail: checkinData.clientEmail || checkinData.emailCliente || '',
        vehicleBrand: checkinData.vehicleBrand || checkinData.marca || checkinData.marcaVeiculo || '',
        vehicleModel: checkinData.vehicleModel || checkinData.modelo || checkinData.modeloVeiculo || '',
        vehiclePlate: checkinData.vehiclePlate || checkinData.placa || checkinData.placaVeiculo || '',
        vehicleYear: checkinData.vehicleYear || checkinData.ano || checkinData.anoVeiculo || '',
        vehicleColor: checkinData.vehicleColor || checkinData.cor || checkinData.corVeiculo || '',
        vehicleType: checkinData.vehicleType || checkinData.tipo || checkinData.tipoVeiculo || 'car',
        mileage: checkinData.mileage || checkinData.kilometragem || '',
        fuelLevel: checkinData.fuelLevel || checkinData.nivelCombustivel || '',
        vehicleConditions: checkinData.vehicleConditions || checkinData.condicoesVeiculo || [],
        services: checkinData.services || checkinData.servicoSolicitado || checkinData.servicos || '',
        priority: checkinData.priority || checkinData.prioridade || 'normal',
        responsible: checkinData.responsible || checkinData.responsavel || '',
        observations: checkinData.observations || checkinData.observacoes || '',
        status: checkinData.status || 'in_progress'
      });
      setHasChanges(false);
    }
  }, [checkinData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave({
          ...checkinData,
          ...formData,
          updatedAt: new Date().toISOString()
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal - Apple-like Design - Centralizado e Responsivo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl my-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-[90vh] overflow-hidden"
        >
          {/* Header - Apple-like */}
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0"
              >
                <ClipboardCheckIcon />
              </motion.div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
                  Editar Check-in
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                  Modifique as informações do registro
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30"
                >
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                    Não salvo
                  </span>
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>

          {/* Content - Layout em 2 colunas */}
          <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-200px)] scroll-smooth">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Seção Cliente */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="lg:col-span-1 space-y-5 p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100/50 dark:border-blue-900/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Informações do Cliente
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => {
                      handleChange('clientName', e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    placeholder="Digite o nome do cliente..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => {
                        handleChange('clientPhone', e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => {
                        handleChange('clientEmail', e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Seção Veículo */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1 space-y-5 p-6 rounded-2xl bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-100/50 dark:border-orange-900/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-orange-500/10 dark:bg-orange-500/20">
                    <Car className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Informações do Veículo
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                    Placa
                  </label>
                  <input
                    type="text"
                    value={formData.vehiclePlate}
                    onChange={(e) => {
                      handleChange('vehiclePlate', e.target.value.toUpperCase());
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono text-lg tracking-wider"
                    placeholder="ABC-1234"
                    maxLength={8}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                      Marca
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleBrand}
                      onChange={(e) => {
                        handleChange('vehicleBrand', e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="Ex: Toyota"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                      Modelo
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleModel}
                      onChange={(e) => {
                        handleChange('vehicleModel', e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="Ex: Corolla"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                      Ano
                    </label>
                    <input
                      type="number"
                      value={formData.vehicleYear}
                      onChange={(e) => {
                        handleChange('vehicleYear', e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="2024"
                      min="1900"
                      max="2025"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                      Cor
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleColor}
                      onChange={(e) => {
                        handleChange('vehicleColor', e.target.value);
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="Ex: Prata"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Seção Serviços e Status */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="lg:col-span-2 space-y-5 p-6 rounded-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-100/50 dark:border-purple-900/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
                    <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Serviços e Atendimento
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-3">
                    <label className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                      Serviços Solicitados
                    </label>
                    <textarea
                      value={formData.services}
                      onChange={(e) => {
                        handleChange('services', e.target.value);
                        setHasChanges(true);
                      }}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                      placeholder="Descreva os serviços solicitados..."
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Status
                      </label>
                      <div className="relative">
                        <select
                          value={formData.status}
                          onChange={(e) => {
                            handleChange('status', e.target.value);
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 pl-11 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none cursor-pointer font-medium"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.25rem'
                          }}
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Andamento</option>
                          <option value="completed">Concluído</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <div className={`
                            ${formData.status === 'pending' ? 'text-amber-500' : ''}
                            ${formData.status === 'in_progress' ? 'text-blue-500' : ''}
                            ${formData.status === 'completed' ? 'text-emerald-500' : ''}
                            ${formData.status === 'cancelled' ? 'text-red-500' : ''}
                          `}>
                            {formData.status === 'pending' && <StatusIcons.pending />}
                            {formData.status === 'in_progress' && <StatusIcons.in_progress />}
                            {formData.status === 'completed' && <StatusIcons.completed />}
                            {formData.status === 'cancelled' && <StatusIcons.cancelled />}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                          <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="12" cy="17" r="1" fill="currentColor"/>
                        </svg>
                        Prioridade
                      </label>
                      <div className="relative">
                        <select
                          value={formData.priority}
                          onChange={(e) => {
                            handleChange('priority', e.target.value);
                            setHasChanges(true);
                          }}
                          className="w-full px-4 py-3 pl-11 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none cursor-pointer font-medium"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.75rem center',
                            backgroundSize: '1.25rem'
                          }}
                        >
                          <option value="low">Baixa</option>
                          <option value="normal">Normal</option>
                          <option value="high">Alta</option>
                          <option value="urgent">Urgente</option>
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <div className={`
                            ${formData.priority === 'low' ? 'text-gray-400' : ''}
                            ${formData.priority === 'normal' ? 'text-blue-500' : ''}
                            ${formData.priority === 'high' ? 'text-orange-500' : ''}
                            ${formData.priority === 'urgent' ? 'text-red-500' : ''}
                          `}>
                            {formData.priority === 'low' && <PriorityIcons.low />}
                            {formData.priority === 'normal' && <PriorityIcons.normal />}
                            {formData.priority === 'high' && <PriorityIcons.high />}
                            {formData.priority === 'urgent' && <PriorityIcons.urgent />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                    Observações Adicionais
                  </label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => {
                      handleChange('observations', e.target.value);
                      setHasChanges(true);
                    }}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                    placeholder="Observações, detalhes importantes, condições especiais..."
                  />
                </div>
              </motion.div>
            </form>
          </div>

          {/* Footer - Apple-like */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 w-full sm:w-auto justify-center sm:justify-start">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {checkinData?.updatedAt 
                  ? `Última atualização: ${new Date(checkinData.updatedAt).toLocaleString('pt-BR')}`
                  : 'Novo registro'
                }
              </span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium text-sm sm:text-base"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 sm:flex-none px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span className="hidden sm:inline">Salvando...</span>
                    <span className="sm:hidden">Salvando</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Salvar Alterações</span>
                    <span className="sm:hidden">Salvar</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModalEditarCheckin;