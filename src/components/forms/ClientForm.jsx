import { useState, useEffect } from 'react';
import { X, User, Building2, Phone, Mail, MapPin, Calendar, Car, FileText, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  validateCPF, 
  validateCNPJ, 
  formatCPF, 
  formatCNPJ, 
  formatPhone, 
  formatCEP,
  validateBirthDate 
} from '../../services/documentValidationService';
import { useClientStore } from '../../store/clientStore';

const ClientForm = ({ onClose, onSubmit, client = null }) => {
  const { clients } = useClientStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [personType, setPersonType] = useState('fisica'); // 'fisica' ou 'juridica'
  
  const [formData, setFormData] = useState({
    // Dados básicos
    name: '',
    cpf: '',
    cnpj: '',
    inscricaoEstadual: '',
    razaoSocial: '',
    nomeFantasia: '',
    birthDate: '',
    phone: '',
    email: '',
    
    // Endereço
    zipCode: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    
    // Veículos
    vehicles: [],
    
    // Observações
    observations: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar dados do cliente se estiver editando
  useEffect(() => {
    if (client) {
      setPersonType(client.cnpj ? 'juridica' : 'fisica');
      setFormData({
        name: client.name || '',
        cpf: client.cpf || '',
        cnpj: client.cnpj || '',
        inscricaoEstadual: client.inscricaoEstadual || '',
        razaoSocial: client.razaoSocial || '',
        nomeFantasia: client.nomeFantasia || '',
        birthDate: client.birthDate || '',
        phone: client.phone || '',
        email: client.email || '',
        zipCode: client.zipCode || '',
        address: client.address || '',
        number: client.number || '',
        complement: client.complement || '',
        neighborhood: client.neighborhood || '',
        city: client.city || '',
        state: client.state || '',
        vehicles: client.vehicles || [],
        observations: client.observations || ''
      });
    }
  }, [client]);

  const steps = [
    { number: 1, title: 'Tipo e Identificação', icon: personType === 'fisica' ? User : Building2 },
    { number: 2, title: 'Contato', icon: Phone },
    { number: 3, title: 'Endereço', icon: MapPin },
    { number: 4, title: 'Veículos', icon: Car },
    { number: 5, title: 'Observações', icon: FileText }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCPFChange = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      handleInputChange('cpf', cleanValue);
    }
  };

  const handleCNPJChange = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 14) {
      handleInputChange('cnpj', cleanValue);
    }
  };

  const handlePhoneChange = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      handleInputChange('phone', cleanValue);
    }
  };

  const handleCEPChange = async (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 8) {
      handleInputChange('zipCode', cleanValue);
      
      // Buscar endereço pelo CEP quando tiver 8 dígitos
      if (cleanValue.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanValue}/json/`);
          const data = await response.json();
          
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              address: data.logradouro || '',
              neighborhood: data.bairro || '',
              city: data.localidade || '',
              state: data.uf || ''
            }));
            toast.success('Endereço encontrado!');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
      }
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (personType === 'fisica') {
      // Validar CPF
      if (!formData.cpf) {
        newErrors.cpf = 'CPF é obrigatório';
      } else {
        const cpfValidation = validateCPF(formData.cpf);
        if (!cpfValidation.valid) {
          newErrors.cpf = cpfValidation.message;
        } else {
          // Verificar duplicata
          const isDuplicate = clients.some(c => 
            c.cpf === formData.cpf && (!client || c.firestoreId !== client.firestoreId)
          );
          if (isDuplicate) {
            newErrors.cpf = 'CPF já cadastrado';
          }
        }
      }
      
      // Validar nome
      if (!formData.name || formData.name.trim().length < 3) {
        newErrors.name = 'Nome completo é obrigatório (mínimo 3 caracteres)';
      }
      
      // Validar data de nascimento
      if (!formData.birthDate) {
        newErrors.birthDate = 'Data de nascimento é obrigatória';
      } else {
        const birthValidation = validateBirthDate(formData.birthDate);
        if (!birthValidation.valid) {
          newErrors.birthDate = birthValidation.message;
        }
      }
    } else {
      // Validar CNPJ
      if (!formData.cnpj) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else {
        const cnpjValidation = validateCNPJ(formData.cnpj);
        if (!cnpjValidation.valid) {
          newErrors.cnpj = cnpjValidation.message;
        } else {
          // Verificar duplicata
          const isDuplicate = clients.some(c => 
            c.cnpj === formData.cnpj && (!client || c.firestoreId !== client.firestoreId)
          );
          if (isDuplicate) {
            newErrors.cnpj = 'CNPJ já cadastrado';
          }
        }
      }
      
      // Validar razão social
      if (!formData.razaoSocial || formData.razaoSocial.trim().length < 3) {
        newErrors.razaoSocial = 'Razão social é obrigatória';
      }
      
      // Validar nome fantasia
      if (!formData.nomeFantasia || formData.nomeFantasia.trim().length < 3) {
        newErrors.nomeFantasia = 'Nome fantasia é obrigatório';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    // Validar telefone
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Telefone inválido';
    }
    
    // Validar email (opcional, mas se preenchido deve ser válido)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    // Validar CEP
    if (!formData.zipCode) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (formData.zipCode.replace(/\D/g, '').length !== 8) {
      newErrors.zipCode = 'CEP inválido';
    }
    
    // Validar endereço
    if (!formData.address || formData.address.trim().length < 3) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    // Validar número
    if (!formData.number) {
      newErrors.number = 'Número é obrigatório';
    }
    
    // Validar bairro
    if (!formData.neighborhood || formData.neighborhood.trim().length < 2) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }
    
    // Validar cidade
    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = 'Cidade é obrigatória';
    }
    
    // Validar estado
    if (!formData.state) {
      newErrors.state = 'Estado é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    
    // Validar pelo menos 1 veículo
    if (formData.vehicles.length === 0) {
      newErrors.vehicles = 'Cadastre pelo menos 1 veículo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      case 5:
        isValid = true;
        break;
      default:
        isValid = false;
    }
    
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      toast.error('Preencha todos os campos obrigatórios');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2() || !validateStep3() || !validateStep4()) {
      toast.error('Verifique todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const clientData = {
        name: personType === 'fisica' ? formData.name.trim() : formData.nomeFantasia.trim(),
        cpf: personType === 'fisica' ? formData.cpf : '',
        cnpj: personType === 'juridica' ? formData.cnpj : '',
        inscricaoEstadual: personType === 'juridica' ? formData.inscricaoEstadual : '',
        razaoSocial: personType === 'juridica' ? formData.razaoSocial.trim() : '',
        nomeFantasia: personType === 'juridica' ? formData.nomeFantasia.trim() : '',
        birthDate: personType === 'fisica' ? formData.birthDate : '',
        phone: formData.phone,
        email: formData.email.trim(),
        zipCode: formData.zipCode,
        address: formData.address.trim(),
        number: formData.number.trim(),
        complement: formData.complement.trim(),
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state,
        vehicles: formData.vehicles,
        observations: formData.observations.trim(),
        personType
      };
      
      await onSubmit(clientData);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error(error.message || 'Erro ao salvar cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVehicle = () => {
    const newVehicle = {
      id: Date.now().toString(),
      type: '',
      brand: '',
      model: '',
      plate: '',
      year: '',
      color: ''
    };
    setFormData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle]
    }));
  };

  const removeVehicle = (id) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(v => v.id !== id)
    }));
  };

  const updateVehicle = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    }));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        
        return (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white scale-110 shadow-lg' 
                  : isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Icon className="w-6 h-6" />
                )}
              </div>
              <span className={`text-xs mt-2 text-center ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Seletor de tipo de pessoa */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Tipo de Pessoa *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPersonType('fisica')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              personType === 'fisica'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <User className={`w-8 h-8 mx-auto mb-2 ${
              personType === 'fisica' ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <span className={`block text-sm font-medium ${
              personType === 'fisica' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
            }`}>
              Pessoa Física
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setPersonType('juridica')}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              personType === 'juridica'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className={`w-8 h-8 mx-auto mb-2 ${
              personType === 'juridica' ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <span className={`block text-sm font-medium ${
              personType === 'juridica' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
            }`}>
              Pessoa Jurídica
            </span>
          </button>
        </div>
      </div>

      {/* Campos para Pessoa Física */}
      {personType === 'fisica' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Digite o nome completo"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CPF *
              </label>
              <input
                type="text"
                value={formatCPF(formData.cpf)}
                onChange={(e) => handleCPFChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.cpf ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {errors.cpf && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cpf}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Nascimento *
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.birthDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.birthDate}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Campos para Pessoa Jurídica */}
      {personType === 'juridica' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Razão Social *
            </label>
            <input
              type="text"
              value={formData.razaoSocial}
              onChange={(e) => handleInputChange('razaoSocial', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.razaoSocial ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Digite a razão social"
            />
            {errors.razaoSocial && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.razaoSocial}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome Fantasia *
            </label>
            <input
              type="text"
              value={formData.nomeFantasia}
              onChange={(e) => handleInputChange('nomeFantasia', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.nomeFantasia ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Digite o nome fantasia"
            />
            {errors.nomeFantasia && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.nomeFantasia}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CNPJ *
              </label>
              <input
                type="text"
                value={formatCNPJ(formData.cnpj)}
                onChange={(e) => handleCNPJChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.cnpj ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
              {errors.cnpj && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cnpj}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Inscrição Estadual
              </label>
              <input
                type="text"
                value={formData.inscricaoEstadual}
                onChange={(e) => handleInputChange('inscricaoEstadual', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Opcional"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Telefone *
        </label>
        <input
          type="tel"
          value={formatPhone(formData.phone)}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder="(00) 00000-0000"
          maxLength={15}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder="email@exemplo.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CEP *
          </label>
          <input
            type="text"
            value={formatCEP(formData.zipCode)}
            onChange={(e) => handleCEPChange(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.zipCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="00000-000"
            maxLength={9}
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.zipCode}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Endereço *
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder="Rua, Avenida, etc."
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.address}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número *
          </label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.number ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="123"
          />
          {errors.number && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.number}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Complemento
          </label>
          <input
            type="text"
            value={formData.complement}
            onChange={(e) => handleInputChange('complement', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Apto, Bloco, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bairro *
        </label>
        <input
          type="text"
          value={formData.neighborhood}
          onChange={(e) => handleInputChange('neighborhood', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.neighborhood ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder="Nome do bairro"
        />
        {errors.neighborhood && (
          <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.neighborhood}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cidade *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Nome da cidade"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado *
          </label>
          <select
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">UF</option>
            <option value="AC">AC</option>
            <option value="AL">AL</option>
            <option value="AP">AP</option>
            <option value="AM">AM</option>
            <option value="BA">BA</option>
            <option value="CE">CE</option>
            <option value="DF">DF</option>
            <option value="ES">ES</option>
            <option value="GO">GO</option>
            <option value="MA">MA</option>
            <option value="MT">MT</option>
            <option value="MS">MS</option>
            <option value="MG">MG</option>
            <option value="PA">PA</option>
            <option value="PB">PB</option>
            <option value="PR">PR</option>
            <option value="PE">PE</option>
            <option value="PI">PI</option>
            <option value="RJ">RJ</option>
            <option value="RN">RN</option>
            <option value="RS">RS</option>
            <option value="RO">RO</option>
            <option value="RR">RR</option>
            <option value="SC">SC</option>
            <option value="SP">SP</option>
            <option value="SE">SE</option>
            <option value="TO">TO</option>
          </select>
          {errors.state && (
            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.state}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Veículos do Cliente
        </h3>
        <button
          type="button"
          onClick={addVehicle}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar Veículo
        </button>
      </div>

      {errors.vehicles && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {errors.vehicles}
          </p>
        </div>
      )}

      {formData.vehicles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Car className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Nenhum veículo cadastrado
          </p>
          <button
            type="button"
            onClick={addVehicle}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cadastrar Primeiro Veículo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.vehicles.map((vehicle, index) => (
            <div key={vehicle.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Veículo {index + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => removeVehicle(vehicle.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={vehicle.type}
                    onChange={(e) => updateVehicle(vehicle.id, 'type', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="moto">Moto</option>
                    <option value="carro">Carro</option>
                    <option value="caminhao">Caminhão</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Placa *
                  </label>
                  <input
                    type="text"
                    value={vehicle.plate}
                    onChange={(e) => updateVehicle(vehicle.id, 'plate', e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ABC-1234"
                    maxLength={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Marca *
                  </label>
                  <input
                    type="text"
                    value={vehicle.brand}
                    onChange={(e) => updateVehicle(vehicle.id, 'brand', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Honda, Yamaha, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={vehicle.model}
                    onChange={(e) => updateVehicle(vehicle.id, 'model', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CB 600F, MT-07, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ano
                  </label>
                  <input
                    type="text"
                    value={vehicle.year}
                    onChange={(e) => updateVehicle(vehicle.id, 'year', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2023"
                    maxLength={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cor
                  </label>
                  <input
                    type="text"
                    value={vehicle.color}
                    onChange={(e) => updateVehicle(vehicle.id, 'color', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Preto, Vermelho, etc."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Observações
        </label>
        <textarea
          value={formData.observations}
          onChange={(e) => handleInputChange('observations', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Informações adicionais sobre o cliente..."
        />
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Resumo do Cadastro
        </h4>
        <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <p>✓ Tipo: {personType === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
          <p>✓ Nome: {personType === 'fisica' ? formData.name : formData.nomeFantasia}</p>
          <p>✓ Documento: {personType === 'fisica' ? formatCPF(formData.cpf) : formatCNPJ(formData.cnpj)}</p>
          <p>✓ Telefone: {formatPhone(formData.phone)}</p>
          <p>✓ Endereço: {formData.city}/{formData.state}</p>
          <p>✓ Veículos: {formData.vehicles.length}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {client ? 'Editar Cliente' : 'Novo Cliente'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
        {renderStepIndicator()}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Voltar
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Etapa {currentStep} de {steps.length}
          </span>
        </div>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Próximo
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {client ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientForm;
