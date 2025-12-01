/**
 * ClientFormHorizontal - Step Wizard Ultra Premium
 * Wizard em 4 etapas com campos detalhados e animações espetaculares
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, FileText, MapPin, Building, 
  MessageSquare, Sparkles, Check, AlertCircle, 
  ChevronRight, ChevronLeft, Home, Hash, Navigation
} from 'lucide-react';
import { scrollToFirstErrorField } from '../../../hooks/useScrollToError';

const ClientFormHorizontal = ({
  client = null,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Dados Pessoais
    name: '',
    email: '',
    phone: '',
    // Documentos
    cpf: '',
    cnpj: '',
    // Endereço Detalhado
    street: '',
    number: '',
    hasNumber: true, // true por padrão
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    // Observações
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Definir steps do wizard
  const steps = [
    {
      id: 0,
      title: 'Dados Pessoais',
      subtitle: 'Informações básicas do cliente',
      icon: User,
      color: '#34C759',
      fields: ['name', 'email', 'phone']
    },
    {
      id: 1,
      title: 'Documentos',
      subtitle: 'CPF, CNPJ e identificação',
      icon: FileText,
      color: '#FF9500',
      fields: ['cpf', 'cnpj']
    },
    {
      id: 2,
      title: 'Endereço',
      subtitle: 'Localização completa',
      icon: MapPin,
      color: '#007AFF',
      fields: ['street', 'number', 'complement', 'neighborhood', 'city', 'state', 'zipCode']
    },
    {
      id: 3,
      title: 'Finalizar',
      subtitle: 'Observações e confirmação',
      icon: Check,
      color: '#5856D6',
      fields: ['notes']
    }
  ];

  // Preencher form se editando
  useEffect(() => {
    if (client) {
      const address = client.address || '';
      const addressParts = address.split(',').map(part => part.trim());
      
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        cpf: client.cpf || '',
        cnpj: client.cnpj || '',
        street: addressParts[0] || '',
        number: addressParts[1] || '',
        hasNumber: client.hasNumber !== false, // true por padrão, false apenas se explicitamente definido
        complement: addressParts[2] || '',
        neighborhood: addressParts[3] || '',
        city: addressParts[4] || '',
        state: addressParts[5] || '',
        zipCode: client.zipCode || '',
        notes: client.notes || '',
      });
    }
  }, [client]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    const step = steps[stepIndex];
    
    step.fields.forEach(field => {
      if (field === 'name' && !formData.name.trim()) {
        newErrors.name = 'Nome é obrigatório';
      }
      if (field === 'phone' && !formData.phone.trim()) {
        newErrors.phone = 'Telefone é obrigatório';
      }
      if (field === 'email' && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }
      if (field === 'street' && !formData.street.trim()) {
        newErrors.street = 'Rua é obrigatória';
      }
      if (field === 'number' && formData.hasNumber && !formData.number.trim()) {
        newErrors.number = 'Número é obrigatório quando o endereço possui numeração';
      }
      if (field === 'city' && !formData.city.trim()) {
        newErrors.city = 'Cidade é obrigatória';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Scroll automático para o primeiro campo com erro
      setTimeout(() => {
        scrollToFirstErrorField(errors);
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      // Combinar endereço para compatibilidade
      const fullAddress = [
        formData.street,
        formData.number,
        formData.complement,
        formData.neighborhood,
        formData.city,
        formData.state
      ].filter(Boolean).join(', ');
      
      const finalData = {
        ...formData,
        address: fullAddress
      };
      
      onSave?.(finalData);
    }
  };

  // Ultra Premium Input Component
  const UltraPremiumInput = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    icon: Icon, 
    error, 
    required = false,
    type = 'text',
    delay = 0 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
      className="relative group"
    >
      {/* Label Ultra Premium */}
      <motion.label
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1 }}
        style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          background: error 
            ? 'linear-gradient(135deg, #FF3B30 0%, #FF9500 100%)'
            : focusedField === label
            ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'
            : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '12px',
          transition: 'all 0.3s ease',
        }}
        className="dark:bg-gradient-to-r dark:from-white dark:to-gray-300"
      >
        {label} {required && <span style={{ color: '#FF3B30' }}>*</span>}
      </motion.label>

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            color: error 
              ? '#FF3B30'
              : focusedField === label
              ? '#007AFF'
              : '#8E8E93',
            transition: 'all 0.3s ease',
          }}
        >
          <Icon size={20} strokeWidth={2.5} />
        </motion.div>

        {/* Input Field */}
        <motion.input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocusedField(label)}
          onBlur={() => setFocusedField(null)}
          whileFocus={{ scale: 1.02 }}
          style={{
            width: '100%',
            height: '56px',
            paddingLeft: '52px',
            paddingRight: '16px',
            borderRadius: '16px',
            border: error 
              ? '2px solid #FF3B30'
              : focusedField === label
              ? '2px solid #007AFF'
              : '2px solid transparent',
            background: error
              ? 'rgba(255, 59, 48, 0.05)'
              : focusedField === label
              ? 'rgba(0, 122, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)',
            color: '#1a1a1a',
            fontSize: '16px',
            fontWeight: '500',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
            boxShadow: error
              ? '0 8px 32px rgba(255, 59, 48, 0.2)'
              : focusedField === label
              ? '0 8px 32px rgba(0, 122, 255, 0.2)'
              : '0 4px 16px rgba(0, 0, 0, 0.05)',
          }}
          className="dark:bg-white/5 dark:text-white dark:placeholder-gray-400"
        />

        {/* Animated Underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: focusedField === label ? 1 : 0,
            backgroundColor: error ? '#FF3B30' : '#007AFF'
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '3px',
            borderRadius: '2px',
            transformOrigin: 'center',
          }}
        />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '8px',
              color: '#FF3B30',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <AlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Step Progress Ultra Premium */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-8"
      >
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStepClick(index)}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: index === currentStep
                  ? `linear-gradient(135deg, ${step.color} 0%, ${step.color}CC 100%)`
                  : completedSteps.includes(index)
                  ? 'linear-gradient(135deg, #34C759 0%, #30D158 100%)'
                  : 'rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: (index <= currentStep || completedSteps.includes(index)) ? 'pointer' : 'default',
                boxShadow: index === currentStep
                  ? `0 8px 24px ${step.color}40`
                  : completedSteps.includes(index)
                  ? '0 8px 24px rgba(52, 199, 89, 0.3)'
                  : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
              }}
              className="dark:bg-white/5"
            >
              {completedSteps.includes(index) ? (
                <Check size={24} color="white" strokeWidth={3} />
              ) : (
                <step.icon 
                  size={24} 
                  color={index === currentStep ? 'white' : '#666'} 
                  strokeWidth={2.5} 
                />
              )}
            </motion.div>

            {/* Step Info */}
            <div className="ml-4 flex-1">
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: index === currentStep ? step.color : '#666',
                  marginBottom: '2px',
                }}
                className="dark:text-white"
              >
                {step.title}
              </h4>
              <p
                style={{
                  fontSize: '13px',
                  color: '#999',
                }}
                className="dark:text-gray-400"
              >
                {step.subtitle}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                style={{
                  width: '60px',
                  height: '3px',
                  background: completedSteps.includes(index)
                    ? 'linear-gradient(90deg, #34C759 0%, #30D158 100%)'
                    : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '2px',
                  marginLeft: '20px',
                  marginRight: '20px',
                }}
                className="dark:bg-white/10"
              />
            )}
          </div>
        ))}
      </motion.div>

      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
              duration: 0.4
            }}
          >
            {/* Step 0 - Dados Pessoais */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <UltraPremiumInput
                    label="Nome Completo"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Digite o nome completo do cliente"
                    icon={User}
                    error={errors.name}
                    required
                    delay={0.1}
                  />
                </div>
                <UltraPremiumInput
                  label="Telefone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(11) 98765-4321"
                  icon={Phone}
                  error={errors.phone}
                  required
                  delay={0.2}
                />
                <UltraPremiumInput
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  icon={Mail}
                  error={errors.email}
                  delay={0.3}
                />
              </div>
            )}

            {/* Step 1 - Documentos */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UltraPremiumInput
                  label="CPF"
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  icon={FileText}
                  error={errors.cpf}
                  delay={0.1}
                />
                <UltraPremiumInput
                  label="CNPJ"
                  value={formData.cnpj}
                  onChange={(e) => handleChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  icon={Building}
                  error={errors.cnpj}
                  delay={0.2}
                />
              </div>
            )}

            {/* Step 2 - Endereço Detalhado */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <UltraPremiumInput
                      label="Rua/Avenida"
                      value={formData.street}
                      onChange={(e) => handleChange('street', e.target.value)}
                      placeholder="Nome da rua ou avenida"
                      icon={Home}
                      error={errors.street}
                      required
                      delay={0.1}
                    />
                  </div>
                  {/* Campo Número Customizado com Checkbox */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20
                    }}
                    className="relative group"
                  >
                    {/* Label */}
                    <motion.label
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        background: errors.number 
                          ? 'linear-gradient(135deg, #FF3B30 0%, #FF9500 100%)'
                          : focusedField === 'number'
                          ? 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'
                          : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '12px',
                        transition: 'all 0.3s ease',
                      }}
                      className="dark:bg-gradient-to-r dark:from-white dark:to-gray-300"
                    >
                      Número {formData.hasNumber ? <span style={{ color: '#FF3B30' }}>*</span> : '(Opcional)'}
                    </motion.label>

                    <div className="space-y-3">
                      {/* Input Container */}
                      <div className="relative">
                        {/* Icon */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 2,
                            color: errors.number 
                              ? '#FF3B30'
                              : focusedField === 'number'
                              ? '#007AFF'
                              : formData.hasNumber ? '#8E8E93' : '#C7C7CC',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Hash size={18} />
                        </motion.div>

                        {/* Input */}
                        <input
                          type="text"
                          value={formData.number}
                          onChange={(e) => handleChange('number', e.target.value)}
                          onFocus={() => setFocusedField('number')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="123"
                          disabled={!formData.hasNumber}
                          style={{
                            width: '100%',
                            height: '56px',
                            paddingLeft: '52px',
                            paddingRight: '20px',
                            fontSize: '16px',
                            fontWeight: '500',
                            border: `2px solid ${
                              errors.number 
                                ? '#FF3B30'
                                : focusedField === 'number'
                                ? '#007AFF'
                                : formData.hasNumber ? '#E5E5EA' : '#F2F2F7'
                            }`,
                            borderRadius: '16px',
                            backgroundColor: formData.hasNumber ? '#FFFFFF' : '#F8F8F8',
                            color: formData.hasNumber ? '#000000' : '#8E8E93',
                            outline: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: formData.hasNumber ? 'text' : 'not-allowed',
                            opacity: formData.hasNumber ? 1 : 0.6
                          }}
                          className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500"
                        />
                      </div>

                      {/* Checkbox */}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasNumber}
                          onChange={(e) => {
                            handleChange('hasNumber', e.target.checked);
                            if (!e.target.checked) {
                              handleChange('number', '');
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                        />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                          Este endereço possui número
                        </span>
                      </label>
                    </div>

                    {/* Error Message */}
                    {errors.number && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          marginTop: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#FF3B30',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          ⚠️
                        </motion.span>
                        {errors.number}
                      </motion.p>
                    )}
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UltraPremiumInput
                    label="Complemento"
                    value={formData.complement}
                    onChange={(e) => handleChange('complement', e.target.value)}
                    placeholder="Apto, Bloco, Casa..."
                    icon={Building}
                    error={errors.complement}
                    delay={0.3}
                  />
                  <UltraPremiumInput
                    label="Bairro"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange('neighborhood', e.target.value)}
                    placeholder="Nome do bairro"
                    icon={MapPin}
                    error={errors.neighborhood}
                    delay={0.4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <UltraPremiumInput
                    label="Cidade"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Nome da cidade"
                    icon={Navigation}
                    error={errors.city}
                    required
                    delay={0.5}
                  />
                  <UltraPremiumInput
                    label="Estado"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="SP"
                    icon={MapPin}
                    error={errors.state}
                    delay={0.6}
                  />
                  <UltraPremiumInput
                    label="CEP"
                    value={formData.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    placeholder="00000-000"
                    icon={Hash}
                    error={errors.zipCode}
                    delay={0.7}
                  />
                </div>
              </div>
            )}

            {/* Step 3 - Finalizar */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Textarea Ultra Premium */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <motion.label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      background: focusedField === 'notes'
                        ? 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)'
                        : 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '12px',
                    }}
                    className="dark:bg-gradient-to-r dark:from-white dark:to-gray-300"
                  >
                    Observações
                  </motion.label>

                  <motion.textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Informações adicionais sobre o cliente..."
                    onFocus={() => setFocusedField('notes')}
                    onBlur={() => setFocusedField(null)}
                    rows={6}
                    whileFocus={{ scale: 1.01 }}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      borderRadius: '16px',
                      border: focusedField === 'notes'
                        ? '2px solid #5856D6'
                        : '2px solid transparent',
                      background: focusedField === 'notes'
                        ? 'rgba(88, 86, 214, 0.05)'
                        : 'rgba(0, 0, 0, 0.03)',
                      color: '#1a1a1a',
                      fontSize: '16px',
                      fontWeight: '500',
                      fontFamily: 'inherit',
                      resize: 'none',
                      outline: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                      boxShadow: focusedField === 'notes'
                        ? '0 8px 32px rgba(88, 86, 214, 0.2)'
                        : '0 4px 16px rgba(0, 0, 0, 0.05)',
                    }}
                    className="dark:bg-white/5 dark:text-white dark:placeholder-gray-400"
                  />
                </motion.div>

                {/* Resumo dos Dados */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: 'rgba(0, 122, 255, 0.05)',
                    border: '1px solid rgba(0, 122, 255, 0.1)',
                  }}
                  className="dark:bg-blue-500/5 dark:border-blue-500/20"
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#007AFF',
                      marginBottom: '16px',
                    }}
                    className="dark:text-blue-400"
                  >
                    Resumo dos Dados
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Nome:</strong> {formData.name || 'Não informado'}
                    </div>
                    <div>
                      <strong>Telefone:</strong> {formData.phone || 'Não informado'}
                    </div>
                    <div>
                      <strong>E-mail:</strong> {formData.email || 'Não informado'}
                    </div>
                    <div>
                      <strong>Cidade:</strong> {formData.city || 'Não informado'}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-8 pt-6"
          style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}
        >
          {/* Botão Voltar */}
          <motion.button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            whileHover={currentStep > 0 ? { scale: 1.02, x: -2 } : {}}
            whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              background: currentStep === 0 ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.1)',
              border: 'none',
              color: currentStep === 0 ? '#ccc' : '#666',
              fontSize: '15px',
              fontWeight: '600',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
            className="dark:bg-white/5 dark:text-gray-400"
          >
            <ChevronLeft size={18} />
            Voltar
          </motion.button>

          {/* Botão Próximo/Finalizar */}
          <motion.button
            type={currentStep === steps.length - 1 ? 'submit' : 'button'}
            onClick={currentStep === steps.length - 1 ? undefined : handleNext}
            disabled={isLoading}
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 32px',
              borderRadius: '12px',
              background: isLoading 
                ? 'linear-gradient(135deg, #8E8E93 0%, #AEAEB2 100%)'
                : `linear-gradient(135deg, ${steps[currentStep].color} 0%, ${steps[currentStep].color}CC 100%)`,
              border: 'none',
              color: 'white',
              fontSize: '15px',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLoading 
                ? 'none'
                : `0 8px 24px ${steps[currentStep].color}40`,
              transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                }}
              />
            ) : currentStep === steps.length - 1 ? (
              <>
                <Check size={18} />
                {client ? 'Salvar Alterações' : 'Criar Cliente'}
              </>
            ) : (
              <>
                Próximo
                <ChevronRight size={18} />
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default ClientFormHorizontal;