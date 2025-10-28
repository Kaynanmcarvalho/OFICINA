import { useState } from 'react';
import { X, User, Phone, Mail, CreditCard, MapPin, Car, FileText, ChevronRight, ChevronLeft, Check, Search as SearchIcon, Loader, Building2, AlertCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '../../../services/clientService';
import { searchVehicleByPlate, fetchBrands, fetchModels, getVehicleTypeForApi } from '../../../services/vehicleApiService';
import { detectVehicleType } from '../../../services/vehicleTypeDetector';
import SearchableSelect from '../../../components/ui/SearchableSelect';
import { 
    validateCPF, 
    validateCNPJ, 
    formatCPF as formatCPFUtil, 
    formatCNPJ as formatCNPJUtil,
    validateBirthDate 
} from '../../../services/documentValidationService';
import { useClientStore } from '../../../store/clientStore';
import { consultarCNPJ, validarSituacaoEmpresa } from '../../../services/cnpjService';

const ModalNovoCliente = ({ isOpen, onClose, onSuccess, initialName = '' }) => {
    const { clients } = useClientStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [personType, setPersonType] = useState('fisica'); // 'fisica' ou 'juridica'
    const [formData, setFormData] = useState({
        name: initialName,
        phone: '',
        cpf: '',
        cnpj: '',
        inscricaoEstadual: '',
        indicadorIE: '1', // 1=Contribuinte ICMS, 2=Isento, 9=Não Contribuinte
        razaoSocial: '',
        nomeFantasia: '',
        email: '',
        birthDate: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        vehicles: [],
        observations: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);

    // Estados para veículos
    const [vehicleSearchMode, setVehicleSearchMode] = useState({});
    const [isSearchingPlate, setIsSearchingPlate] = useState({});
    const [availableBrands, setAvailableBrands] = useState({});
    const [availableModels, setAvailableModels] = useState({});
    const [isLoadingBrands, setIsLoadingBrands] = useState({});
    const [isLoadingModels, setIsLoadingModels] = useState({});

    const steps = [
        { number: 1, title: 'Tipo e Identificação', icon: personType === 'fisica' ? User : Building2 },
        { number: 2, title: 'Endereço', icon: MapPin },
        { number: 3, title: 'Veículos', icon: Car },
        { number: 4, title: 'Observações', icon: FileText }
    ];

    const vehicleTypes = [
        { value: 'moto', label: 'Moto' },
        { value: 'carro', label: 'Carro' },
        { value: 'caminhao', label: 'Caminhão' }
    ];

    const formatCPF = (value) => {
        const clean = value.replace(/\D/g, '');
        return clean.length <= 11 ? formatCPFUtil(clean) : formatCPFUtil(clean.substring(0, 11));
    };
    const formatCNPJ = (value) => {
        const clean = value.replace(/\D/g, '');
        return clean.length <= 14 ? formatCNPJUtil(clean) : formatCNPJUtil(clean.substring(0, 14));
    };
    const formatPhone = (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
    const formatZipCode = (value) => value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
    const formatPlate = (value) => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().substring(0, 7);

    const handleZipCodeChange = async (e) => {
        const formatted = formatZipCode(e.target.value);
        setFormData({ ...formData, zipCode: formatted });
        const value = e.target.value.replace(/\D/g, '');
        if (value.length === 8) {
            setIsLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        address: data.logradouro || prev.address,
                        neighborhood: data.bairro || prev.neighborhood,
                        city: data.localidade || prev.city,
                        state: data.uf || prev.state
                    }));
                    toast.success('CEP encontrado!');
                } else {
                    toast.error('CEP não encontrado');
                }
            } catch {
                toast.error('Erro ao buscar CEP');
            } finally {
                setIsLoadingCep(false);
            }
        }
    };

    const handleCNPJSearch = async () => {
        const cnpjLimpo = formData.cnpj.replace(/\D/g, '');
        
        if (cnpjLimpo.length !== 14) {
            toast.error('CNPJ deve ter 14 dígitos');
            return;
        }

        // Validar CNPJ antes de buscar
        const cnpjValidation = validateCNPJ(cnpjLimpo);
        if (!cnpjValidation.valid) {
            toast.error(cnpjValidation.message);
            return;
        }

        setIsLoadingCNPJ(true);
        
        try {
            const result = await consultarCNPJ(cnpjLimpo);
            
            if (result.success) {
                const dados = result.data;
                
                // Verificar se a empresa está ativa
                if (!validarSituacaoEmpresa(dados.situacaoCadastral)) {
                    toast.error(`Empresa com situação: ${dados.situacaoCadastral}. Verifique os dados.`, {
                        duration: 5000
                    });
                }
                
                // Preencher todos os campos automaticamente
                setFormData(prev => ({
                    ...prev,
                    razaoSocial: dados.razaoSocial || prev.razaoSocial,
                    nomeFantasia: dados.nomeFantasia || prev.nomeFantasia,
                    inscricaoEstadual: prev.inscricaoEstadual, // Mantém o que já foi digitado
                    zipCode: dados.cep ? formatZipCode(dados.cep) : prev.zipCode,
                    address: dados.logradouro || prev.address,
                    number: dados.numero || prev.number,
                    complement: dados.complemento || prev.complement,
                    neighborhood: dados.bairro || prev.neighborhood,
                    city: dados.cidade || prev.city,
                    state: dados.estado || prev.state,
                    phone: dados.telefone ? formatPhone(dados.telefone) : prev.phone,
                    email: dados.email || prev.email
                }));
                
                toast.success('Dados da empresa carregados com sucesso!', {
                    duration: 4000,
                    icon: '🏢'
                });
                
                console.log('[CNPJ] Dados carregados:', dados);
            } else {
                toast.error(result.error || 'Erro ao consultar CNPJ');
            }
        } catch (error) {
            console.error('[CNPJ] Erro ao buscar:', error);
            toast.error('Erro ao consultar CNPJ. Tente novamente.');
        } finally {
            setIsLoadingCNPJ(false);
        }
    };

    const handleCNPJSearch = async () => {
        const cnpjLimpo = formData.cnpj.replace(/\D/g, '');
        
        if (cnpjLimpo.length !== 14) {
            toast.error('CNPJ deve ter 14 dígitos');
            return;
        }

        // Validar CNPJ antes de buscar
        const cnpjValidation = validateCNPJ(cnpjLimpo);
        if (!cnpjValidation.valid) {
            toast.error(cnpjValidation.message);
            return;
        }

        setIsLoadingCNPJ(true);
        
        try {
            const result = await consultarCNPJ(cnpjLimpo);
            
            if (result.success) {
                const dados = result.data;
                
                // Verificar se a empresa está ativa
                if (!validarSituacaoEmpresa(dados.situacaoCadastral)) {
                    toast.error(`Empresa ${dados.situacaoCadastral}. Verifique a situação cadastral.`, {
                        duration: 5000
                    });
                }
                
                // Preencher todos os dados da empresa
                setFormData(prev => ({
                    ...prev,
                    razaoSocial: dados.razaoSocial || prev.razaoSocial,
                    nomeFantasia: dados.nomeFantasia || prev.nomeFantasia,
                    email: dados.email || prev.email,
                    phone: dados.telefone || prev.phone,
                    zipCode: dados.cep ? formatZipCode(dados.cep) : prev.zipCode,
                    address: dados.logradouro || prev.address,
                    number: dados.numero || prev.number,
                    complement: dados.complemento || prev.complement,
                    neighborhood: dados.bairro || prev.neighborhood,
                    city: dados.cidade || prev.city,
                    state: dados.estado || prev.state
                }));
                
                // Limpar erros dos campos preenchidos
                setErrors({});
                
                toast.success('Dados da empresa carregados com sucesso!', {
                    duration: 4000,
                    icon: '✅'
                });
                
                console.log('[CNPJ] Dados carregados:', {
                    razaoSocial: dados.razaoSocial,
                    nomeFantasia: dados.nomeFantasia,
                    situacao: dados.situacaoCadastral,
                    endereco: `${dados.logradouro}, ${dados.numero} - ${dados.cidade}/${dados.estado}`
                });
                
            } else {
                toast.error(result.error || 'Erro ao consultar CNPJ');
            }
            
        } catch (error) {
            console.error('[CNPJ] Erro ao buscar:', error);
            toast.error('Erro ao consultar CNPJ. Tente novamente.');
        } finally {
            setIsLoadingCNPJ(false);
        }
    };

    const addVehicle = () => {
        const newVehicleId = Date.now();
        setFormData(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, {
                id: newVehicleId,
                type: 'moto',
                searchMode: 'plate',
                plate: '',
                brand: '',
                brandCode: '',
                model: '',
                modelCode: '',
                year: '',
                color: ''
            }]
        }));
        setVehicleSearchMode(prev => ({ ...prev, [newVehicleId]: 'plate' }));
    };

    const removeVehicle = (vehicleId) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.filter(v => v.id !== vehicleId)
        }));
        // Limpar estados relacionados
        const newSearchMode = { ...vehicleSearchMode };
        delete newSearchMode[vehicleId];
        setVehicleSearchMode(newSearchMode);
    };

    const updateVehicle = (vehicleId, field, value) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.map(v =>
                v.id === vehicleId ? { ...v, [field]: value } : v
            )
        }));

        // Busca automática quando placa tiver 7 caracteres na busca manual
        if (field === 'plate' && value.length === 7) {
            const vehicle = formData.vehicles.find(v => v.id === vehicleId);
            const searchMode = vehicleSearchMode[vehicleId] || 'plate';
            
            // Só faz busca automática se estiver na busca manual
            if (searchMode === 'manual' && !isSearchingPlate[vehicleId]) {
                console.log('[AUTO-SEARCH] Placa completa detectada na busca manual:', value);
                handlePlateSearch(vehicleId, value);
            }
        }
    };

    const handlePlateSearch = async (vehicleId, plate) => {
        if (plate.length < 7) return;

        setIsSearchingPlate(prev => ({ ...prev, [vehicleId]: true }));
        try {
            const result = await searchVehicleByPlate(plate);
            if (result.success) {
                const vehicleData = result.data;
                const searchMode = vehicleSearchMode[vehicleId] || 'plate';
                
                // Atualiza os dados básicos
                updateVehicle(vehicleId, 'type', vehicleData.tipo || 'moto');
                updateVehicle(vehicleId, 'brand', vehicleData.marca || '');
                updateVehicle(vehicleId, 'model', vehicleData.modelo || '');
                updateVehicle(vehicleId, 'year', vehicleData.ano || '');
                updateVehicle(vehicleId, 'color', vehicleData.cor || '');
                
                // Se estiver na busca manual, carregar e selecionar nos dropdowns
                if (searchMode === 'manual') {
                    console.log('[AUTO-SEARCH] Carregando marcas e modelos para dropdowns...');
                    
                    // 1. Carregar marcas do tipo
                    const vehicleType = vehicleData.tipo || 'moto';
                    setIsLoadingBrands(prev => ({ ...prev, [vehicleId]: true }));
                    
                    try {
                        const apiType = getVehicleTypeForApi(vehicleType);
                        const brandsResult = await fetchBrands(apiType);
                        
                        if (brandsResult.success && brandsResult.data) {
                            setAvailableBrands(prev => ({ ...prev, [vehicleId]: brandsResult.data }));
                            
                            // 2. Encontrar e selecionar a marca
                            const brandMatch = brandsResult.data.find(b => 
                                b.label.toUpperCase().includes(vehicleData.marca.toUpperCase()) ||
                                vehicleData.marca.toUpperCase().includes(b.label.toUpperCase())
                            );
                            
                            if (brandMatch) {
                                console.log('[AUTO-SEARCH] Marca encontrada:', brandMatch.label);
                                updateVehicle(vehicleId, 'brandCode', brandMatch.value);
                                
                                // 3. Carregar modelos da marca
                                setIsLoadingModels(prev => ({ ...prev, [vehicleId]: true }));
                                
                                try {
                                    const modelsResult = await fetchModels(apiType, brandMatch.value);
                                    
                                    if (modelsResult.success && modelsResult.data) {
                                        setAvailableModels(prev => ({ ...prev, [vehicleId]: modelsResult.data }));
                                        
                                        // 4. Encontrar e selecionar o modelo
                                        const modelMatch = modelsResult.data.find(m => 
                                            m.label.toUpperCase().includes(vehicleData.modelo.toUpperCase().split(' ')[0]) ||
                                            vehicleData.modelo.toUpperCase().includes(m.label.toUpperCase())
                                        );
                                        
                                        if (modelMatch) {
                                            console.log('[AUTO-SEARCH] Modelo encontrado na lista:', modelMatch.label);
                                            updateVehicle(vehicleId, 'modelCode', modelMatch.value);
                                        } else {
                                            // Modelo não encontrado - adiciona como opção customizada
                                            console.log('[AUTO-SEARCH] ✨ Modelo não encontrado, adicionando como opção customizada:', vehicleData.modelo);
                                            
                                            const customModelCode = `custom_${Date.now()}`;
                                            const customModel = {
                                                value: customModelCode,
                                                label: `${vehicleData.modelo} (Encontrado pela placa)`,
                                                isCustom: true
                                            };
                                            
                                            // Adiciona o modelo customizado ao início da lista
                                            setAvailableModels(prev => ({
                                                ...prev,
                                                [vehicleId]: [customModel, ...modelsResult.data]
                                            }));
                                            
                                            // Seleciona o modelo customizado
                                            updateVehicle(vehicleId, 'modelCode', customModelCode);
                                            
                                            toast.success('Modelo adicionado à lista!', { duration: 2000 });
                                        }
                                    }
                                } catch (error) {
                                    console.error('[AUTO-SEARCH] Erro ao carregar modelos:', error);
                                } finally {
                                    setIsLoadingModels(prev => ({ ...prev, [vehicleId]: false }));
                                }
                            } else {
                                console.log('[AUTO-SEARCH] Marca não encontrada nos dropdowns, mantendo texto');
                            }
                        }
                    } catch (error) {
                        console.error('[AUTO-SEARCH] Erro ao carregar marcas:', error);
                    } finally {
                        setIsLoadingBrands(prev => ({ ...prev, [vehicleId]: false }));
                    }
                }
                
                toast.success('Veículo encontrado!');
            } else {
                toast.error('Placa não encontrada. Preencha manualmente.');
            }
        } catch (error) {
            console.error('[PLATE SEARCH] Erro:', error);
            toast.error('Erro ao buscar placa');
        } finally {
            setIsSearchingPlate(prev => ({ ...prev, [vehicleId]: false }));
        }
    };

    const handleVehicleTypeChange = async (vehicleId, type) => {
        updateVehicle(vehicleId, 'type', type);
        updateVehicle(vehicleId, 'brand', '');
        updateVehicle(vehicleId, 'brandCode', '');
        updateVehicle(vehicleId, 'model', '');
        updateVehicle(vehicleId, 'modelCode', '');

        // Carregar marcas do tipo selecionado
        setIsLoadingBrands(prev => ({ ...prev, [vehicleId]: true }));
        try {
            const apiType = getVehicleTypeForApi(type);
            const result = await fetchBrands(apiType);
            if (result.success) {
                setAvailableBrands(prev => ({ ...prev, [vehicleId]: result.data }));
            }
        } catch {
            toast.error('Erro ao carregar marcas');
        } finally {
            setIsLoadingBrands(prev => ({ ...prev, [vehicleId]: false }));
        }
    };

    const handleBrandChange = async (vehicleId, brandValue) => {
        const vehicle = formData.vehicles.find(v => v.id === vehicleId);
        const brand = availableBrands[vehicleId]?.find(b => b.value === brandValue);
        
        updateVehicle(vehicleId, 'brandCode', brandValue);
        updateVehicle(vehicleId, 'brand', brand?.label || '');
        updateVehicle(vehicleId, 'model', '');
        updateVehicle(vehicleId, 'modelCode', '');

        // Carregar modelos da marca selecionada
        setIsLoadingModels(prev => ({ ...prev, [vehicleId]: true }));
        try {
            const apiType = getVehicleTypeForApi(vehicle.type);
            const result = await fetchModels(apiType, brandValue);
            if (result.success) {
                setAvailableModels(prev => ({ ...prev, [vehicleId]: result.data }));
            }
        } catch {
            toast.error('Erro ao carregar modelos');
        } finally {
            setIsLoadingModels(prev => ({ ...prev, [vehicleId]: false }));
        }
    };

    const handleModelChange = (vehicleId, modelValue) => {
        const model = availableModels[vehicleId]?.find(m => m.value === modelValue);
        updateVehicle(vehicleId, 'modelCode', modelValue);
        updateVehicle(vehicleId, 'model', model?.label || '');
    };

    const toggleSearchMode = async (vehicleId) => {
        const currentMode = vehicleSearchMode[vehicleId] || 'plate';
        const newMode = currentMode === 'plate' ? 'manual' : 'plate';
        setVehicleSearchMode(prev => ({ ...prev, [vehicleId]: newMode }));
        updateVehicle(vehicleId, 'searchMode', newMode);

        // Se mudou para manual, carregar marcas
        if (newMode === 'manual') {
            const vehicle = formData.vehicles.find(v => v.id === vehicleId);
            if (vehicle && !availableBrands[vehicleId]) {
                await handleVehicleTypeChange(vehicleId, vehicle.type);
            }
        }
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (personType === 'fisica') {
                // Validar nome
                if (!formData.name.trim() || formData.name.trim().length < 3) {
                    newErrors.name = 'Nome completo é obrigatório (mínimo 3 caracteres)';
                }
                
                // Validar CPF
                if (!formData.cpf) {
                    newErrors.cpf = 'CPF é obrigatório';
                } else {
                    const cpfValidation = validateCPF(formData.cpf);
                    if (!cpfValidation.valid) {
                        newErrors.cpf = cpfValidation.message;
                    } else {
                        // Verificar duplicata
                        const isDuplicate = clients.some(c => c.cpf === formData.cpf.replace(/\D/g, ''));
                        if (isDuplicate) {
                            newErrors.cpf = 'CPF já cadastrado';
                        }
                    }
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
                // Validar razão social
                if (!formData.razaoSocial.trim() || formData.razaoSocial.trim().length < 3) {
                    newErrors.razaoSocial = 'Razão social é obrigatória';
                }
                
                // Validar nome fantasia
                if (!formData.nomeFantasia.trim() || formData.nomeFantasia.trim().length < 3) {
                    newErrors.nomeFantasia = 'Nome fantasia é obrigatório';
                }
                
                // Validar CNPJ
                if (!formData.cnpj) {
                    newErrors.cnpj = 'CNPJ é obrigatório';
                } else {
                    const cnpjValidation = validateCNPJ(formData.cnpj);
                    if (!cnpjValidation.valid) {
                        newErrors.cnpj = cnpjValidation.message;
                    } else {
                        // Verificar duplicata
                        const isDuplicate = clients.some(c => c.cnpj === formData.cnpj.replace(/\D/g, ''));
                        if (isDuplicate) {
                            newErrors.cnpj = 'CNPJ já cadastrado';
                        }
                    }
                }
                
                // Validar Indicador de IE
                if (!formData.indicadorIE) {
                    newErrors.indicadorIE = 'Indicador de IE é obrigatório';
                }
                
                // Validar Inscrição Estadual (obrigatória apenas para Contribuinte ICMS)
                if (formData.indicadorIE === '1') {
                    if (!formData.inscricaoEstadual || formData.inscricaoEstadual.trim().length === 0) {
                        newErrors.inscricaoEstadual = 'Inscrição Estadual é obrigatória para Contribuinte ICMS';
                    }
                }
                
                // Se for Isento, preencher automaticamente com ISENTO
                if (formData.indicadorIE === '2' && !formData.inscricaoEstadual) {
                    setFormData(prev => ({ ...prev, inscricaoEstadual: 'ISENTO' }));
                }
            }
            
            // Validar telefone (obrigatório para ambos)
            if (!formData.phone.trim()) {
                newErrors.phone = 'Telefone é obrigatório';
            } else if (formData.phone.replace(/\D/g, '').length < 10) {
                newErrors.phone = 'Telefone inválido';
            }
        }
        
        if (step === 2) {
            // Validar CEP
            if (!formData.zipCode) {
                newErrors.zipCode = 'CEP é obrigatório';
            } else if (formData.zipCode.replace(/\D/g, '').length !== 8) {
                newErrors.zipCode = 'CEP inválido';
            }
            
            // Validar endereço
            if (!formData.address.trim() || formData.address.trim().length < 3) {
                newErrors.address = 'Endereço é obrigatório';
            }
            
            // Validar número
            if (!formData.number.trim()) {
                newErrors.number = 'Número é obrigatório';
            }
            
            // Validar bairro
            if (!formData.neighborhood.trim() || formData.neighborhood.trim().length < 2) {
                newErrors.neighborhood = 'Bairro é obrigatório';
            }
            
            // Validar cidade
            if (!formData.city.trim() || formData.city.trim().length < 2) {
                newErrors.city = 'Cidade é obrigatória';
            }
            
            // Validar estado
            if (!formData.state) {
                newErrors.state = 'Estado é obrigatório';
            }
        }
        
        if (step === 3) {
            // Validar pelo menos 1 veículo
            if (formData.vehicles.length === 0) {
                newErrors.vehicles = 'Cadastre pelo menos 1 veículo';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        } else {
            toast.error('Preencha todos os campos obrigatórios corretamente');
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        // Validar todas as etapas
        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
            toast.error('Verifique todos os campos obrigatórios');
            return;
        }
        
        setIsSubmitting(true);
        try {
            const clientData = {
                name: personType === 'fisica' ? formData.name.trim() : formData.nomeFantasia.trim(),
                cpf: personType === 'fisica' ? formData.cpf.replace(/\D/g, '') : '',
                cnpj: personType === 'juridica' ? formData.cnpj.replace(/\D/g, '') : '',
                inscricaoEstadual: personType === 'juridica' ? formData.inscricaoEstadual.trim() : '',
                indicadorIE: personType === 'juridica' ? formData.indicadorIE : '',
                razaoSocial: personType === 'juridica' ? formData.razaoSocial.trim() : '',
                nomeFantasia: personType === 'juridica' ? formData.nomeFantasia.trim() : '',
                birthDate: personType === 'fisica' ? formData.birthDate : '',
                phone: formData.phone.replace(/\D/g, ''),
                email: formData.email.trim(),
                address: formData.address.trim(),
                number: formData.number.trim(),
                complement: formData.complement.trim(),
                neighborhood: formData.neighborhood.trim(),
                city: formData.city.trim(),
                state: formData.state,
                zipCode: formData.zipCode.replace(/\D/g, ''),
                vehicles: formData.vehicles.map(v => ({
                    type: v.type,
                    brand: v.brand,
                    model: v.model,
                    plate: v.plate,
                    year: v.year,
                    color: v.color
                })),
                observations: formData.observations.trim(),
                personType
            };
            
            const newClient = await createClient(clientData);
            toast.success('Cliente cadastrado com sucesso!');
            onSuccess(newClient);
            onClose();
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            toast.error(error.message || 'Erro ao cadastrar cliente');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl dark:shadow-neutral-950/50 border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Novo Cliente</h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Etapa {currentStep} de {steps.length}: {steps[currentStep - 1].title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 ease-out text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100" aria-label="Fechar">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;
                            return (
                                <div key={step.number} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ' + (isCompleted ? 'bg-green-600 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400')}>
                                            {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <span className={'text-xs mt-2 font-medium hidden sm:block ' + (isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400')}>{step.title}</span>
                                    </div>
                                    {index < steps.length - 1 && <div className={'h-0.5 flex-1 mx-2 ' + (isCompleted ? 'bg-green-600' : 'bg-neutral-200 dark:bg-neutral-700')} />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {/* Etapa 1: Tipo e Identificação */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            {/* Seletor de Tipo de Pessoa */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                    Tipo de Pessoa *
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPersonType('fisica')}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                            personType === 'fisica'
                                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                                        }`}
                                    >
                                        <User className={`w-8 h-8 mx-auto mb-2 ${
                                            personType === 'fisica' ? 'text-blue-600' : 'text-neutral-400'
                                        }`} />
                                        <span className={`block text-sm font-medium ${
                                            personType === 'fisica' ? 'text-blue-600' : 'text-neutral-600 dark:text-neutral-400'
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
                                                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                                        }`}
                                    >
                                        <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                                            personType === 'juridica' ? 'text-blue-600' : 'text-neutral-400'
                                        }`} />
                                        <span className={`block text-sm font-medium ${
                                            personType === 'juridica' ? 'text-blue-600' : 'text-neutral-600 dark:text-neutral-400'
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
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="w-4 h-4 text-neutral-400" />
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nome Completo *</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                setErrors({ ...errors, name: null });
                                            }}
                                            placeholder="João da Silva"
                                            className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.name ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <CreditCard className="w-4 h-4 text-neutral-400" />
                                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">CPF *</label>
                                            </div>
                                            <input
                                                type="text"
                                                value={formatCPF(formData.cpf)}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, '') });
                                                    setErrors({ ...errors, cpf: null });
                                                }}
                                                placeholder="123.456.789-00"
                                                maxLength={14}
                                                className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.cpf ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                            />
                                            {errors.cpf && (
                                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.cpf}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="w-4 h-4 text-neutral-400" />
                                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Data de Nascimento *</label>
                                            </div>
                                            <input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, birthDate: e.target.value });
                                                    setErrors({ ...errors, birthDate: null });
                                                }}
                                                className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.birthDate ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                            />
                                            {errors.birthDate && (
                                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
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
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4 text-neutral-400" />
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Razão Social *</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.razaoSocial}
                                            onChange={(e) => {
                                                setFormData({ ...formData, razaoSocial: e.target.value });
                                                setErrors({ ...errors, razaoSocial: null });
                                            }}
                                            placeholder="Empresa LTDA"
                                            className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.razaoSocial ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                        />
                                        {errors.razaoSocial && (
                                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.razaoSocial}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4 text-neutral-400" />
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nome Fantasia *</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.nomeFantasia}
                                            onChange={(e) => {
                                                setFormData({ ...formData, nomeFantasia: e.target.value });
                                                setErrors({ ...errors, nomeFantasia: null });
                                            }}
                                            placeholder="Minha Empresa"
                                            className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.nomeFantasia ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                        />
                                        {errors.nomeFantasia && (
                                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.nomeFantasia}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <CreditCard className="w-4 h-4 text-neutral-400" />
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">CNPJ *</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formatCNPJ(formData.cnpj)}
                                            onChange={(e) => {
                                                setFormData({ ...formData, cnpj: e.target.value.replace(/\D/g, '') });
                                                setErrors({ ...errors, cnpj: null });
                                            }}
                                            placeholder="00.000.000/0000-00"
                                            maxLength={18}
                                            className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.cnpj ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                        />
                                        {errors.cnpj && (
                                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.cnpj}
                                            </p>
                                        )}
                                    </div>

                                    {/* Indicador de Inscrição Estadual */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4 text-neutral-400" />
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                Indicador de IE *
                                            </label>
                                        </div>
                                        <select
                                            value={formData.indicadorIE}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData({ 
                                                    ...formData, 
                                                    indicadorIE: value,
                                                    // Limpa IE se for Não Contribuinte
                                                    inscricaoEstadual: value === '9' ? '' : formData.inscricaoEstadual
                                                });
                                                setErrors({ ...errors, indicadorIE: null, inscricaoEstadual: null });
                                            }}
                                            className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.indicadorIE ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                        >
                                            <option value="1">1 - Contribuinte ICMS</option>
                                            <option value="2">2 - Contribuinte Isento de IE</option>
                                            <option value="9">9 - Não Contribuinte</option>
                                        </select>
                                        {errors.indicadorIE && (
                                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.indicadorIE}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            {formData.indicadorIE === '1' && '✓ Empresa contribuinte do ICMS (possui IE)'}
                                            {formData.indicadorIE === '2' && '✓ Empresa isenta de Inscrição Estadual'}
                                            {formData.indicadorIE === '9' && '✓ Empresa não contribuinte do ICMS'}
                                        </p>
                                    </div>

                                    {/* Inscrição Estadual - Condicional */}
                                    {(formData.indicadorIE === '1' || formData.indicadorIE === '2') && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <CreditCard className="w-4 h-4 text-neutral-400" />
                                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                    Inscrição Estadual {formData.indicadorIE === '1' ? '*' : ''}
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.inscricaoEstadual}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, inscricaoEstadual: e.target.value });
                                                    setErrors({ ...errors, inscricaoEstadual: null });
                                                }}
                                                placeholder={formData.indicadorIE === '1' ? 'Digite a IE' : 'ISENTO'}
                                                disabled={formData.indicadorIE === '2'}
                                                className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.inscricaoEstadual ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed'}
                                            />
                                            {errors.inscricaoEstadual && (
                                                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.inscricaoEstadual}
                                                </p>
                                            )}
                                            {formData.indicadorIE === '1' && (
                                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                    Obrigatório para emissão de NF-e/NFS-e
                                                </p>
                                            )}
                                            {formData.indicadorIE === '2' && (
                                                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                                    Empresa isenta - Informar "ISENTO" na nota fiscal
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Telefone e Email (comuns para ambos) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Phone className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Telefone *</label>
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFormData({ ...formData, phone: formatPhone(e.target.value) });
                                            setErrors({ ...errors, phone: null });
                                        }}
                                        placeholder="(11) 98765-4321"
                                        className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.phone ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Mail className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email <span className="text-neutral-400">(opcional)</span></label>
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="cliente@email.com"
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Etapa 2: Endereço */}
                    {currentStep === 2 && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">CEP *</label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.zipCode}
                                            onChange={(e) => {
                                                handleZipCodeChange(e);
                                                setErrors({ ...errors, zipCode: null });
                                            }}
                                            placeholder="00000-000"
                                            maxLength={9}
                                            className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.zipCode ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                        />
                                        {isLoadingCep && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader className="w-4 h-4 animate-spin text-blue-600" />
                                            </div>
                                        )}
                                    </div>
                                    {errors.zipCode && (
                                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.zipCode}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Cidade *</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => {
                                            setFormData({ ...formData, city: e.target.value });
                                            setErrors({ ...errors, city: null });
                                        }}
                                        placeholder="São Paulo"
                                        className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.city ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.city}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Estado *</label>
                                    </div>
                                    <select
                                        value={formData.state}
                                        onChange={(e) => {
                                            setFormData({ ...formData, state: e.target.value });
                                            setErrors({ ...errors, state: null });
                                        }}
                                        className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.state ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="AC">Acre</option>
                                        <option value="AL">Alagoas</option>
                                        <option value="AP">Amapá</option>
                                        <option value="AM">Amazonas</option>
                                        <option value="BA">Bahia</option>
                                        <option value="CE">Ceará</option>
                                        <option value="DF">Distrito Federal</option>
                                        <option value="ES">Espírito Santo</option>
                                        <option value="GO">Goiás</option>
                                        <option value="MA">Maranhão</option>
                                        <option value="MT">Mato Grosso</option>
                                        <option value="MS">Mato Grosso do Sul</option>
                                        <option value="MG">Minas Gerais</option>
                                        <option value="PA">Pará</option>
                                        <option value="PB">Paraíba</option>
                                        <option value="PR">Paraná</option>
                                        <option value="PE">Pernambuco</option>
                                        <option value="PI">Piauí</option>
                                        <option value="RJ">Rio de Janeiro</option>
                                        <option value="RN">Rio Grande do Norte</option>
                                        <option value="RS">Rio Grande do Sul</option>
                                        <option value="RO">Rondônia</option>
                                        <option value="RR">Roraima</option>
                                        <option value="SC">Santa Catarina</option>
                                        <option value="SP">São Paulo</option>
                                        <option value="SE">Sergipe</option>
                                        <option value="TO">Tocantins</option>
                                    </select>
                                    {errors.state && (
                                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.state}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-neutral-400" />
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Endereço *</label>
                                </div>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => {
                                        setFormData({ ...formData, address: e.target.value });
                                        setErrors({ ...errors, address: null });
                                    }}
                                    placeholder="Rua, Avenida..."
                                    className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.address ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                />
                                {errors.address && (
                                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Número *</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.number}
                                        onChange={(e) => {
                                            setFormData({ ...formData, number: e.target.value });
                                            setErrors({ ...errors, number: null });
                                        }}
                                        placeholder="123"
                                        className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.number ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                    />
                                    {errors.number && (
                                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.number}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Bairro *</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.neighborhood}
                                        onChange={(e) => {
                                            setFormData({ ...formData, neighborhood: e.target.value });
                                            setErrors({ ...errors, neighborhood: null });
                                        }}
                                        placeholder="Centro"
                                        className={'w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.neighborhood ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                    />
                                    {errors.neighborhood && (
                                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.neighborhood}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Complemento</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.complement}
                                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                                        placeholder="Apto 45, Bloco B..."
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Etapa 3: Veículos */}
                    {currentStep === 3 && (
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Car className="w-5 h-5 text-neutral-400" />
                                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Veículos do Cliente *</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        addVehicle();
                                        setErrors({ ...errors, vehicles: null });
                                    }}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-300 ease-out shadow-lg shadow-blue-600/30"
                                >
                                    + Adicionar Veículo
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
                                <div className={'text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-2 border-dashed ' + (errors.vehicles ? 'border-red-300 dark:border-red-800' : 'border-neutral-300 dark:border-neutral-700')}>
                                    <Car className={'w-12 h-12 mx-auto mb-3 ' + (errors.vehicles ? 'text-red-400' : 'text-neutral-400')} />
                                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">Nenhum veículo cadastrado</p>
                                    <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-1">Clique em "Adicionar Veículo" para começar</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.vehicles.map((vehicle, index) => {
                                        const searchMode = vehicleSearchMode[vehicle.id] || 'plate';
                                        const isSearching = isSearchingPlate[vehicle.id];
                                        const brands = availableBrands[vehicle.id] || [];
                                        const models = availableModels[vehicle.id] || [];
                                        const loadingBrands = isLoadingBrands[vehicle.id];
                                        const loadingModels = isLoadingModels[vehicle.id];

                                        return (
                                            <div key={vehicle.id} className="p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Veículo {index + 1}</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVehicle(vehicle.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Toggle Search Mode */}
                                                <div className="mb-4 flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSearchMode(vehicle.id)}
                                                        className={'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ' + (searchMode === 'plate' ? 'bg-blue-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300')}
                                                    >
                                                        <SearchIcon className="w-4 h-4 inline mr-2" />
                                                        Buscar por Placa
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSearchMode(vehicle.id)}
                                                        className={'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ' + (searchMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300')}
                                                    >
                                                        Busca Manual
                                                    </button>
                                                </div>

                                                {/* Busca por Placa */}
                                                {searchMode === 'plate' && (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Placa do Veículo</label>
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={vehicle.plate}
                                                                    onChange={(e) => updateVehicle(vehicle.id, 'plate', formatPlate(e.target.value))}
                                                                    placeholder="ABC1234"
                                                                    maxLength={7}
                                                                    className="flex-1 px-3 py-2 text-sm rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 uppercase focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handlePlateSearch(vehicle.id, vehicle.plate)}
                                                                    disabled={vehicle.plate.length < 7 || isSearching}
                                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-neutral-400 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                                                                >
                                                                    {isSearching ? (
                                                                        <>
                                                                            <Loader className="w-4 h-4 animate-spin" />
                                                                            Buscando...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <SearchIcon className="w-4 h-4" />
                                                                            Buscar
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Digite a placa e clique em Buscar para preencher automaticamente</p>
                                                        </div>

                                                        {/* Campos preenchidos automaticamente */}
                                                        {vehicle.brand && (
                                                            <div className="grid grid-cols-2 gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                                <div>
                                                                    <label className="block text-xs font-medium text-green-900 dark:text-green-300 mb-1">Tipo</label>
                                                                    <p className="text-sm text-green-800 dark:text-green-400 capitalize">{vehicle.type}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-green-900 dark:text-green-300 mb-1">Marca</label>
                                                                    <p className="text-sm text-green-800 dark:text-green-400">{vehicle.brand}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-green-900 dark:text-green-300 mb-1">Modelo</label>
                                                                    <p className="text-sm text-green-800 dark:text-green-400">{vehicle.model}</p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-medium text-green-900 dark:text-green-300 mb-1">Ano</label>
                                                                    <p className="text-sm text-green-800 dark:text-green-400">{vehicle.year}</p>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <label className="block text-xs font-medium text-green-900 dark:text-green-300 mb-1">Cor</label>
                                                                    <input
                                                                        type="text"
                                                                        value={vehicle.color}
                                                                        onChange={(e) => updateVehicle(vehicle.id, 'color', e.target.value)}
                                                                        placeholder="Ex: Vermelha"
                                                                        className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-neutral-800 border border-green-300 dark:border-green-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Busca Manual */}
                                                {searchMode === 'manual' && (
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Tipo de Veículo</label>
                                                                <select
                                                                    value={vehicle.type}
                                                                    onChange={(e) => handleVehicleTypeChange(vehicle.id, e.target.value)}
                                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                >
                                                                    {vehicleTypes.map(type => (
                                                                        <option key={type.value} value={type.value}>{type.label}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <SearchableSelect
                                                                    label="Marca"
                                                                    options={brands}
                                                                    value={vehicle.brandCode}
                                                                    onChange={(value) => handleBrandChange(vehicle.id, value)}
                                                                    placeholder={loadingBrands ? 'Carregando...' : 'Selecione a marca'}
                                                                    disabled={loadingBrands}
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Modelo</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicle.model}
                                                                    onChange={(e) => updateVehicle(vehicle.id, 'model', e.target.value)}
                                                                    placeholder="Ex: FAZER 250 BLUEFLEX"
                                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                />
                                                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Digite o modelo livremente ou busque pela placa</p>
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Placa</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicle.plate}
                                                                    onChange={(e) => updateVehicle(vehicle.id, 'plate', formatPlate(e.target.value))}
                                                                    placeholder="ABC1234"
                                                                    maxLength={7}
                                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 uppercase focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Ano</label>
                                                                <input
                                                                    type="number"
                                                                    value={vehicle.year}
                                                                    onChange={(e) => updateVehicle(vehicle.id, 'year', e.target.value)}
                                                                    placeholder="2023"
                                                                    min="1900"
                                                                    max={new Date().getFullYear() + 1}
                                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">Cor</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicle.color}
                                                                    onChange={(e) => updateVehicle(vehicle.id, 'color', e.target.value)}
                                                                    placeholder="Ex: Vermelha"
                                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Etapa 4: Observações */}
                    {currentStep === 4 && (
                        <div className="space-y-5">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-neutral-400" />
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Observações Adicionais</label>
                                </div>
                                <textarea
                                    value={formData.observations}
                                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                                    placeholder="Informações adicionais sobre o cliente, preferências, histórico..."
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out resize-none"
                                />
                            </div>

                            {/* Resumo do Cadastro */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    Resumo do Cadastro
                                </h4>
                                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Nome:</span>
                                        <span>{formData.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Telefone:</span>
                                        <span>{formData.phone || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Email:</span>
                                        <span>{formData.email || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Endereço:</span>
                                        <span className="text-right">
                                            {formData.address ? 
                                                `${formData.address}${formData.number ? ', ' + formData.number : ''}${formData.city ? ' - ' + formData.city : ''}${formData.state ? '/' + formData.state : ''}` 
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Veículos:</span>
                                        <span>{formData.vehicles.length} cadastrado(s)</span>
                                    </div>
                                    {formData.vehicles.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                                            {formData.vehicles.map((v, i) => (
                                                <div key={v.id} className="text-xs mb-1">
                                                    <span className="font-medium">Veículo {i + 1}:</span> {v.brand} {v.model} - {v.plate || 'Sem placa'}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Navigation Buttons */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-300 ease-out disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <div className="flex items-center gap-3">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-300 ease-out disabled:opacity-50 flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Voltar
                            </button>
                        )}
                        {currentStep < steps.length ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 ease-out flex items-center gap-2"
                            >
                                Avançar
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 rounded-xl font-medium bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Cadastrando...
                                    </>
                                ) : (
                                    <>
                                        Finalizar Cadastro
                                        <Check className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalNovoCliente;
