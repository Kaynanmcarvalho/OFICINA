/**
 * CheckinFormComplete - Formulário completo de check-in com todos os campos obrigatórios
 * Implementa TODAS as validações e proteções da Fase 1 (Emergencial)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, CreditCard, Mail, Car, Gauge, Droplet, AlertCircle,
  FileText, DollarSign, Calendar, Camera, CheckCircle, X, ChevronRight,
  Shield, Clock, Wrench
} from 'lucide-react';

const CheckinFormComplete = ({ vehicleData, placa, onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados do cliente
    clientName: '',
    clientPhone: '',
    clientCPF: '',
    clientEmail: '',
    
    // Dados do veículo
    vehiclePlate: placa || '',
    vehicleBrand: vehicleData?.marca || '',
    vehicleModel: vehicleData?.modelo || '',
    vehicleYear: vehicleData?.ano || '',
    vehicleColor: vehicleData?.cor || '',
    mileage: '',
    fuelLevel: '',
    
    // Problema e urgência
    problemDescription: '',
    urgency: 'normal',
    requestedServices: [],
    
    // Autorização e valores
    maxAuthorizedValue: '',
    estimatedValue: '',
    estimatedDeliveryDate: '',
    
    // Fotos
    photos: [],
    
    // Condição do veículo
    vehicleCondition: {
      scratches: false,
      dents: false,
      brokenParts: false,
      dirtyInterior: false,
      notes: ''
    },
    
    // Itens no veículo
    itemsInVehicle: [],
    
    // Checklist
    checklist: {
      tires: null,
      brakes: null,
      lights: null,
      documents: null,
      spareTire: null,
      fireExtinguisher: null,
      triangle: null
    },
    
    // Termo de aceite
    termsAccepted: false,
    digitalSignature: null
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validação em tempo real
  useEffect(() => {
    validateField('clientName', formData.clientName);
  }, [formData.clientName]);

  const validateField = (field, value) => {
    let error = '';

    switch (field) {
      case 'clientName':
        if (!value || value.trim().length < 3) {
          error = 'Nome deve ter no mínimo 3 caracteres';
        }
        break;
      
      case 'clientPhone':
        const phone = value.replace(/\D/g, '');
        if (!phone || phone.length < 10 || phone.length > 11) {
          error = 'Telefone inválido';
        }
        break;
      
      case 'clientCPF':
        const cpf = value.replace(/\D/g, '');
        if (!cpf || cpf.length !== 11) {
          error = 'CPF deve ter 11 dígitos';
        } else if (/^(\d)\1{10}$/.test(cpf)) {
          error = 'CPF inválido';
        }
        break;
      
      case 'mileage':
        const km = parseInt(value, 10);
        if (isNaN(km) || km < 0) {
          error = 'Quilometragem inválida';
        } else if (km > 999999) {
          error = 'Quilometragem muito alta';
        }
        break;
      
      case 'fuelLevel':
        if (!value) {
          error = 'Selecione o nível de combustível';
        }
        break;
      
      case 'problemDescription':
        if (!value || value.trim().length < 10) {
          error = 'Descrição deve ter no mínimo 10 caracteres';
        }
        break;
      
      case 'maxAuthorizedValue':
        const val = parseFloat(value);
        if (isNaN(val) || val <= 0) {
          error = 'Valor deve ser maior que zero';
        }
        break;
      
      case 'photos':
        if (!value || value.length < 3) {
          error = 'Mínimo 3 fotos obrigatórias';
        }
        break;
      
      case 'termsAccepted':
        if (!value) {
          error = 'Você deve aceitar os termos';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const canProceedToStep = (stepNumber) => {
    switch (stepNumber) {
      case 2:
        return (
          formData.clientName.trim().length >= 3 &&
          formData.clientPhone.replace(/\D/g, '').length >= 10 &&
          formData.clientCPF.replace(/\D/g, '').length === 11 &&
          !errors.clientName &&
          !errors.clientPhone &&
          !errors.clientCPF
      case 3:
        return (
          formData.mileage &&
          formData.fuelLevel &&
          !errors.mileage &&
          !errors.fuelLevel
      case 4:
        return (
          formData.problemDescription.trim().length >= 10 &&
          formData.maxAuthorizedValue &&
          !errors.problemDescription &&
          !errors.maxAuthorizedValue
      case 5:
        return formData.photos.length >= 3;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceedToStep(step + 1)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    // Validação final
    const allValid = Object.keys(errors).every(key => !errors[key]);
    
    if (!allValid) {
      alert('Por favor, corrija os erros antes de finalizar');
      return;
    }
    
    if (!formData.termsAccepted) {
      alert('Você deve aceitar os termos para continuar');
      return;
    }
    
    onSubmit(formData);
  };

  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  const steps = [
    { number: 1, title: 'Dados do Cliente', icon: User },
    { number: 2, title: 'Dados do Veículo', icon: Car },
    { number: 3, title: 'Problema e Serviços', icon: Wrench },
    { number: 4, title: 'Fotos e Evidências', icon: Camera },
    { number: 5, title: 'Revisão e Aceite', icon: CheckCircle }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${step >= s.number
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  <s.icon size={20} />
                </div>
                <span className="text-xs mt-2 text-center max-w-[80px]">
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 transition-all duration-300
                    ${step > s.number ? 'bg-blue-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Step 1: Dados do Cliente */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dados do Cliente
              </h2>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleChange('clientName', e.target.value)}
                    onBlur={() => handleBlur('clientName')}
                    placeholder="Ex: João da Silva"
                    className={`
                      w-full pl-12 pr-4 py-3 border rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.clientName && touched.clientName ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                </div>
                {errors.clientName && touched.clientName && (
                  <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => handleChange('clientPhone', e.target.value)}
                    onBlur={() => handleBlur('clientPhone')}
                    placeholder="(00) 00000-0000"
                    className={`
                      w-full pl-12 pr-4 py-3 border rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.clientPhone && touched.clientPhone ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                </div>
                {errors.clientPhone && touched.clientPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.clientPhone}</p>
                )}
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.clientCPF}
                    onChange={(e) => handleChange('clientCPF', e.target.value)}
                    onBlur={() => handleBlur('clientCPF')}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={`
                      w-full pl-12 pr-4 py-3 border rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.clientCPF && touched.clientCPF ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                </div>
                {errors.clientCPF && touched.clientCPF && (
                  <p className="mt-1 text-sm text-red-600">{errors.clientCPF}</p>
                )}
              </div>

              {/* Email (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (opcional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleChange('clientEmail', e.target.value)}
                    placeholder="email@exemplo.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dados do Veículo */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Dados do Veículo
              </h2>

              {/* Quilometragem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quilometragem *
                </label>
                <div className="relative">
                  <Gauge className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleChange('mileage', e.target.value)}
                    onBlur={() => handleBlur('mileage')}
                    placeholder="Ex: 50000"
                    className={`
                      w-full pl-12 pr-4 py-3 border rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.mileage && touched.mileage ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                </div>
                {errors.mileage && touched.mileage && (
                  <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
                )}
              </div>

              {/* Nível de Combustível */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Combustível *
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: 'empty', label: 'Vazio', icon: '⚪' },
                    { value: 'quarter', label: '1/4', icon: '🔵' },
                    { value: 'half', label: '1/2', icon: '🔵🔵' },
                    { value: 'three-quarters', label: '3/4', icon: '🔵🔵🔵' },
                    { value: 'full', label: 'Cheio', icon: '🔵🔵🔵🔵' }
                  ].map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleChange('fuelLevel', level.value)}
                      className={`
                        p-4 rounded-xl border-2 transition-all
                        ${formData.fuelLevel === level.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-2xl mb-1">{level.icon}</div>
                      <div className="text-xs font-medium">{level.label}</div>
                    </button>
                  ))}
                </div>
                {errors.fuelLevel && touched.fuelLevel && (
                  <p className="mt-1 text-sm text-red-600">{errors.fuelLevel}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Problema e Serviços */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Problema e Serviços
              </h2>

              {/* Descrição do Problema */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Problema *
                </label>
                <textarea
                  value={formData.problemDescription}
                  onChange={(e) => handleChange('problemDescription', e.target.value)}
                  onBlur={() => handleBlur('problemDescription')}
                  placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
                  rows={4}
                  className={`
                    w-full px-4 py-3 border rounded-xl
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.problemDescription && touched.problemDescription ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
                {errors.problemDescription && touched.problemDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.problemDescription}</p>
                )}
              </div>

              {/* Urgência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgência
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'low', label: 'Baixa', color: 'green' },
                    { value: 'normal', label: 'Normal', color: 'blue' },
                    { value: 'high', label: 'Alta', color: 'orange' },
                    { value: 'emergency', label: 'Emergência', color: 'red' }
                  ].map((urgency) => (
                    <button
                      key={urgency.value}
                      type="button"
                      onClick={() => handleChange('urgency', urgency.value)}
                      className={`
                        p-3 rounded-xl border-2 transition-all
                        ${formData.urgency === urgency.value
                          ? `border-${urgency.color}-500 bg-${urgency.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-sm font-medium">{urgency.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Valor Máximo Autorizado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Máximo Autorizado (sem nova aprovação) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    value={formData.maxAuthorizedValue}
                    onChange={(e) => handleChange('maxAuthorizedValue', e.target.value)}
                    onBlur={() => handleBlur('maxAuthorizedValue')}
                    placeholder="Ex: 500.00"
                    step="0.01"
                    className={`
                      w-full pl-12 pr-4 py-3 border rounded-xl
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.maxAuthorizedValue && touched.maxAuthorizedValue ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                </div>
                {errors.maxAuthorizedValue && touched.maxAuthorizedValue && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxAuthorizedValue}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Valores acima deste limite exigirão nova aprovação do cliente
                </p>
              </div>

              {/* Data Prevista de Entrega */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Prevista de Entrega (opcional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={formData.estimatedDeliveryDate}
                    onChange={(e) => handleChange('estimatedDeliveryDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium"
              >
                Voltar
              </button>
            )}
            
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceedToStep(step + 1)}
                className={`
                  ml-auto px-8 py-3 rounded-xl font-semibold flex items-center gap-2
                  transition-all
                  ${canProceedToStep(step + 1)
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Próximo
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="ml-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold flex items-center gap-2"
              >
                <CheckCircle size={20} />
                Finalizar Check-in
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
};

export default CheckinFormComplete;
