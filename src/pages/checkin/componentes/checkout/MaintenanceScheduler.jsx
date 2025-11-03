import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MaintenanceScheduler Component
 * 
 * Agendador de próxima manutenção com sugestões inteligentes
 * Permite agendar serviço futuro e configurar lembretes
 * 
 * @param {Object} lastService - Último serviço realizado
 * @param {Function} onSchedule - Callback quando manutenção é agendada
 * @param {String} vehicleType - Tipo do veículo (car, motorcycle, truck)
 */
const MaintenanceScheduler = ({ 
  lastService = {}, 
  onSchedule, 
  vehicleType = 'car' 
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [customService, setCustomService] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Sugestões de serviço baseadas no tipo de veículo
  const serviceOptions = {
    car: [
      { value: 'troca_oleo', label: 'Troca de Óleo', months: 3 },
      { value: 'revisao', label: 'Revisão Geral', months: 6 },
      { value: 'alinhamento', label: 'Alinhamento e Balanceamento', months: 6 },
      { value: 'freios', label: 'Revisão de Freios', months: 12 },
      { value: 'ar_condicionado', label: 'Manutenção Ar Condicionado', months: 12 },
      { value: 'custom', label: 'Outro serviço...', months: 3 }
    ],
    motorcycle: [
      { value: 'troca_oleo', label: 'Troca de Óleo', months: 2 },
      { value: 'revisao', label: 'Revisão Geral', months: 4 },
      { value: 'corrente', label: 'Lubrificação de Corrente', months: 1 },
      { value: 'freios', label: 'Revisão de Freios', months: 6 },
      { value: 'custom', label: 'Outro serviço...', months: 2 }
    ],
    truck: [
      { value: 'troca_oleo', label: 'Troca de Óleo', months: 2 },
      { value: 'revisao', label: 'Revisão Geral', months: 3 },
      { value: 'freios', label: 'Sistema de Freios', months: 6 },
      { value: 'suspensao', label: 'Suspensão', months: 6 },
      { value: 'custom', label: 'Outro serviço...', months: 3 }
    ]
  };

  const services = serviceOptions[vehicleType] || serviceOptions.car;

  // Calcular data sugerida baseada no serviço selecionado
  useEffect(() => {
    if (serviceType && serviceType !== 'custom') {
      const service = services.find(s => s.value === serviceType);
      if (service) {
        const suggestedDate = new Date();
        suggestedDate.setMonth(suggestedDate.getMonth() + service.months);
        setSelectedDate(suggestedDate.toISOString().split('T')[0]);
      }
    }
  }, [serviceType]);

  /**
   * Calcula dias até a manutenção
   */
  const getDaysUntil = () => {
    if (!selectedDate) return null;
    const today = new Date();
    const scheduled = new Date(selectedDate);
    const diffTime = scheduled - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Formata a data para exibição
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  /**
   * Manipula o agendamento
   */
  const handleSchedule = () => {
    if (!selectedDate || !serviceType) return;

    const scheduleData = {
      date: selectedDate,
      serviceType: serviceType === 'custom' ? customService : serviceType,
      serviceName: serviceType === 'custom' 
        ? customService 
        : services.find(s => s.value === serviceType)?.label,
      reminderEnabled,
      scheduledAt: new Date().toISOString()
    };

    onSchedule(scheduleData);
    setShowSuccess(true);

    // Reset após 2 segundos
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const daysUntil = getDaysUntil();
  const isValid = selectedDate && (serviceType !== 'custom' || customService);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Agendar Próxima Manutenção
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure um lembrete para o próximo serviço recomendado
        </p>
      </div>

      {/* Service Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo de Serviço
        </label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Selecione o serviço...</option>
          {services.map(service => (
            <option key={service.value} value={service.value}>
              {service.label} {service.value !== 'custom' && `(sugestão: ${service.months} ${service.months === 1 ? 'mês' : 'meses'})`}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Service Input */}
      <AnimatePresence>
        {serviceType === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Especifique o Serviço
            </label>
            <input
              type="text"
              value={customService}
              onChange={(e) => setCustomService(e.target.value)}
              placeholder="Ex: Troca de pneus, Revisão elétrica..."
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Data Sugerida
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        
        {/* Date Info */}
        {selectedDate && daysUntil !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600 dark:text-gray-400">
              {formatDate(selectedDate)} 
              {daysUntil > 0 && ` (em ${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'})`}
              {daysUntil === 0 && ' (hoje)'}
              {daysUntil < 0 && ' (data passada)'}
            </span>
          </motion.div>
        )}
      </div>

      {/* Reminder Toggle */}
      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Lembrete por WhatsApp
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Enviaremos um lembrete 3 dias antes da data agendada
            </p>
          </div>
        </div>
        <button
          onClick={() => setReminderEnabled(!reminderEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            reminderEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              reminderEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Schedule Button */}
      <button
        onClick={handleSchedule}
        disabled={!isValid || showSuccess}
        className={`w-full px-6 py-3 rounded-xl font-medium transition-all ${
          isValid && !showSuccess
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        {showSuccess ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Agendado com Sucesso!
          </span>
        ) : (
          'Agendar Manutenção'
        )}
      </button>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Manutenção agendada!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                  {reminderEnabled && 'Você receberá um lembrete 3 dias antes.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaintenanceScheduler;
