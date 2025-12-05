import { useState, useEffect } from 'react';
import { X, User, Phone, Mail, CreditCard, MapPin, Car, FileText, ChevronRight, ChevronLeft, Check, Search as SearchIcon, Loader, Building2, AlertCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import './ModalNovoCliente.css';
import { createClient } from '../../../services/clientService';
import { searchVehicleByPlate, fetchBrands, fetchModels, getVehicleTypeForApi } from '../../../services/vehicleApiService';
// import { detectVehicleType } from '../../../services/vehicleTypeDetector';
import SearchableSelect from '../../../components/ui/SearchableSelect';
import {
    validateCPF,
    validateCNPJ,
    formatCPF as formatCPFUtil,
    formatCNPJ as formatCNPJUtil,
    validateBirthDate
} from '../../../services/documentValidationService';
import { useClientStore } from '../../../store/clientStore';
import { useVehicleStore } from '../../../store/vehicleStore';
import { consultarCNPJ, validarSituacaoEmpresa } from '../../../services/cnpjService';
import { scrollToFirstErrorField } from '../../../hooks/useScrollToError';

const ModalNovoCliente = ({ isOpen, onClose, onSuccess, initialName = '', existingClient = null }) => {
    const { clients } = useClientStore();
    const { createVehicle } = useVehicleStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [personType, setPersonType] = useState(existingClient?.personType || 'fisica'); // 'fisica' ou 'juridica'
    const [formData, setFormData] = useState({
        name: existingClient?.name || initialName,
        phone: existingClient?.phone || '',
        cpf: existingClient?.cpf || '',
        cnpj: existingClient?.cnpj || '',
        inscricaoEstadual: existingClient?.inscricaoEstadual || '',
        indicadorIE: existingClient?.indicadorIE || '1', // 1=Contribuinte ICMS, 2=Isento, 9=Não Contribuinte
        razaoSocial: existingClient?.razaoSocial || '',
        nomeFantasia: existingClient?.nomeFantasia || '',
        email: existingClient?.email || '',
        birthDate: existingClient?.birthDate || '',
        address: existingClient?.address || '',
        number: existingClient?.number || '',
        hasNumber: existingClient?.hasNumber === true, // false por padrão
        complement: existingClient?.complement || '',
        neighborhood: existingClient?.neighborhood || '',
        city: existingClient?.city || '',
        state: existingClient?.state || '',
        zipCode: existingClient?.zipCode || '',
        vehicles: existingClient?.vehicles || [],
        observations: existingClient?.observations || ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);

    // Atualizar dados quando existingClient mudar
    useEffect(() => {
        console.log('🔄 ModalNovoCliente - existingClient mudou:', existingClient);
        if (existingClient) {
            console.log('📝 Preenchendo dados do cliente:', existingClient);
            setPersonType(existingClient.personType || 'fisica');
            setFormData({
                name: existingClient.name || '',
                phone: existingClient.phone || '',
                cpf: existingClient.cpf || '',
                cnpj: existingClient.cnpj || '',
                inscricaoEstadual: existingClient.inscricaoEstadual || '',
                indicadorIE: existingClient.indicadorIE || '1',
                razaoSocial: existingClient.razaoSocial || '',
                nomeFantasia: existingClient.nomeFantasia || '',
                email: existingClient.email || '',
                birthDate: existingClient.birthDate || '',
                address: existingClient.address || '',
                number: existingClient.number || '',
                hasNumber: existingClient.hasNumber === true, // false por padrão
                complement: existingClient.complement || '',
                neighborhood: existingClient.neighborhood || '',
                city: existingClient.city || '',
                state: existingClient.state || '',
                zipCode: existingClient.zipCode || '',
                vehicles: existingClient.vehicles || [],
                observations: existingClient.observations || ''
            });
            setCurrentStep(1);
            setErrors({});
        } else if (initialName) {
            // Reset para novo cliente com nome inicial
            setPersonType('fisica');
            setFormData({
                name: initialName,
                phone: '',
                cpf: '',
                cnpj: '',
                inscricaoEstadual: '',
                indicadorIE: '1',
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
            setCurrentStep(1);
            setErrors({});
        }
    }, [existingClient, initialName]);

    // Estados para veículos
    const [vehicleSearchMode, setVehicleSearchMode] = useState({});
    const [isSearchingPlate, setIsSearchingPlate] = useState({});
    const [availableBrands, setAvailableBrands] = useState({});
    const [, setAvailableModels] = useState({});
    const [isLoadingBrands, setIsLoadingBrands] = useState({});
    const [, setIsLoadingModels] = useState({});

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
    const formatBirthDate = (value) => {
        const clean = value.replace(/\D/g, '');
        if (clean.length <= 2) return clean;
        if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
        return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
    };

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
            console.log('[PLATE SEARCH] Resultado da busca:', result);

            if (result.success) {
                const vehicleData = result.data;
                console.log('[PLATE SEARCH] Dados do veículo:', vehicleData);

                const searchMode = vehicleSearchMode[vehicleId] || 'plate';
                console.log('[PLATE SEARCH] Modo de busca:', searchMode);

                // Detecta o tipo de veículo baseado nos dados
                let vehicleType = 'carro'; // padrão para carros
                const categoria = (vehicleData.category || vehicleData.categoria || '').toLowerCase();
                const modelo = (vehicleData.model || vehicleData.modelo || '').toLowerCase();
                
                if (categoria.includes('moto') || modelo.includes('moto') || modelo.includes('cb ') || modelo.includes('cg ') || modelo.includes('fazer') || modelo.includes('ybr')) {
                    vehicleType = 'moto';
                } else if (categoria.includes('caminhao') || categoria.includes('caminhão') || modelo.includes('truck')) {
                    vehicleType = 'caminhao';
                }

                // Processa marca e modelo - suporta tanto português quanto inglês
                let marca = vehicleData.brand || vehicleData.marca || '';
                let modeloVeiculo = vehicleData.model || vehicleData.modelo || '';
                let ano = vehicleData.year || vehicleData.ano || '';
                let cor = vehicleData.color || vehicleData.cor || '';

                // Se marca ou modelo estiverem vazios, tenta extrair
                if (!marca || !modeloVeiculo) {
                    // Lista de marcas conhecidas (maiúsculas)
                    const marcasConhecidas = [
                        'YAMAHA', 'HONDA', 'SUZUKI', 'KAWASAKI', 'BMW', 'DUCATI', 'HARLEY', 'TRIUMPH', 'KTM',
                        'CHEVROLET', 'FORD', 'FIAT', 'VOLKSWAGEN', 'VW', 'TOYOTA', 'HYUNDAI', 'NISSAN', 'RENAULT',
                        'MERCEDES', 'MERCEDES-BENZ', 'AUDI', 'VOLVO', 'SCANIA', 'IVECO', 'JEEP', 'MITSUBISHI', 'PEUGEOT', 'CITROEN'
                    ];

                    // Se marca está vazia e modelo contém tudo junto
                    if (!marca && modeloVeiculo) {
                        // Remove o ano do final do modelo se ele já estiver no campo ano
                        if (ano && modeloVeiculo.endsWith(ano)) {
                            modeloVeiculo = modeloVeiculo.substring(0, modeloVeiculo.length - ano.length).trim();
                        }

                        // Tenta encontrar marca conhecida no início do modelo
                        const modeloUpper = modeloVeiculo.toUpperCase();
                        let marcaEncontrada = null;

                        for (const marcaConhecida of marcasConhecidas) {
                            if (modeloUpper.startsWith(marcaConhecida)) {
                                marcaEncontrada = marcaConhecida;
                                break;
                            }
                        }

                        if (marcaEncontrada) {
                            // Encontrou marca conhecida
                            marca = marcaEncontrada;
                            modeloVeiculo = modeloVeiculo.substring(marcaEncontrada.length).trim();
                        } else {
                            // Não encontrou marca conhecida
                            marca = 'Marca não identificada';
                        }
                    }
                }

                // Atualiza os dados básicos de forma síncrona
                setFormData(prev => ({
                    ...prev,
                    vehicles: prev.vehicles.map(v =>
                        v.id === vehicleId ? {
                            ...v,
                            type: vehicleType,
                            brand: marca,
                            model: modeloVeiculo,
                            year: ano,
                            color: cor
                        } : v
                    )
                }));

                console.log('[PLATE SEARCH] Dados processados:', {
                    original: vehicleData,
                    processado: {
                        tipo: vehicleType,
                        marca: marca,
                        modelo: modeloVeiculo,
                        ano: ano,
                        cor: cor
                    }
                });

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
                        // Verificar duplicata (exceto o próprio cliente se estiver editando)
                        const isDuplicate = clients.some(c => 
                            c.cpf === formData.cpf.replace(/\D/g, '') && 
                            (!existingClient || (c.id !== existingClient.id && c.firestoreId !== existingClient.id))
                        );
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
                        // Verificar duplicata (exceto o próprio cliente se estiver editando)
                        const isDuplicate = clients.some(c => 
                            c.cnpj === formData.cnpj.replace(/\D/g, '') && 
                            (!existingClient || (c.id !== existingClient.id && c.firestoreId !== existingClient.id))
                        );
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

            // Validar número (só obrigatório se hasNumber for true)
            if (formData.hasNumber && !formData.number.trim()) {
                newErrors.number = 'Número é obrigatório quando o endereço possui numeração';
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
            // Scroll automático para o primeiro campo com erro
            setTimeout(() => {
                scrollToFirstErrorField(errors);
            }, 100);
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
            // Converte data de DD/MM/AAAA para AAAA-MM-DD
            let birthDateISO = '';
            if (personType === 'fisica' && formData.birthDate) {
                const digits = formData.birthDate.replace(/\D/g, '');
                if (digits.length === 8) {
                    const day = digits.substring(0, 2);
                    const month = digits.substring(2, 4);
                    const year = digits.substring(4, 8);
                    birthDateISO = `${year}-${month}-${day}`;
                }
            }

            const clientData = {
                name: personType === 'fisica' ? formData.name.trim() : formData.nomeFantasia.trim(),
                cpf: personType === 'fisica' ? formData.cpf.replace(/\D/g, '') : '',
                cnpj: personType === 'juridica' ? formData.cnpj.replace(/\D/g, '') : '',
                inscricaoEstadual: personType === 'juridica' ? formData.inscricaoEstadual.trim() : '',
                indicadorIE: personType === 'juridica' ? formData.indicadorIE : '',
                razaoSocial: personType === 'juridica' ? formData.razaoSocial.trim() : '',
                nomeFantasia: personType === 'juridica' ? formData.nomeFantasia.trim() : '',
                birthDate: birthDateISO,
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

            let clientResult;
            if (existingClient) {
                // Importar updateClient
                const { updateClient } = await import('../../../services/clientService');
                const clientId = existingClient.firestoreId || existingClient.id;
                console.log('🔄 Atualizando cliente com ID:', clientId);
                clientResult = await updateClient(clientId, clientData);
            } else {
                clientResult = await createClient(clientData);
            }

            // Salvar veículos no Firestore
            const vehicleSavePromises = formData.vehicles.map(async (vehicle) => {
                const vehicleData = {
                    plate: vehicle.plate.toUpperCase(),
                    brand: vehicle.brand,
                    model: vehicle.model,
                    year: vehicle.year,
                    color: vehicle.color,
                    type: vehicle.type,
                    clientId: clientResult.clientId || clientResult.id || existingClient?.id,
                    clientName: personType === 'fisica' ? formData.name.trim() : formData.nomeFantasia.trim(),
                    notes: `Veículo ${existingClient ? 'atualizado' : 'cadastrado'} junto com o cliente ${personType === 'fisica' ? formData.name.trim() : formData.nomeFantasia.trim()}`,
                };

                return await createVehicle(vehicleData);
            });

            // Aguarda todos os veículos serem salvos
            const vehicleResults = await Promise.all(vehicleSavePromises);
            const successfulVehicles = vehicleResults.filter(r => r.success).length;

            if (successfulVehicles > 0) {
                toast.success(`Cliente ${existingClient ? 'atualizado' : 'cadastrado'} e ${successfulVehicles} veículo(s) ${existingClient ? 'atualizados' : 'cadastrados'} com sucesso!`);
            } else {
                toast.success(`Cliente ${existingClient ? 'atualizado' : 'cadastrado'} com sucesso!`);
                if (formData.vehicles.length > 0) {
                    toast.warning('Alguns veículos não foram salvos. Verifique a listagem de veículos.');
                }
            }

            onSuccess(clientResult);
            onClose();
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            toast.error(error.message || `Erro ao ${existingClient ? 'atualizar' : 'cadastrar'} cliente`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div 
                className="w-full max-w-7xl bg-white dark:bg-neutral-900 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15),0_8px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-gray-300/40 dark:border-neutral-700 flex flex-col overflow-hidden max-h-[92vh] animate-scaleIn" 
                style={{ 
                    fontSmooth: 'always',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    textRendering: 'optimizeLegibility'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/60 dark:border-neutral-700/60">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 antialiased">
                            {existingClient ? 'Editar Cliente' : 'Novo Cliente'}
                        </h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 antialiased font-medium">Etapa {currentStep} de {steps.length}: {steps[currentStep - 1].title}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 ease-out text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:scale-110 hover:rotate-90" 
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 py-4 border-b border-gray-200/60 dark:border-neutral-700/60 bg-gray-50/50 dark:bg-neutral-800/30">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;
                            return (
                                <div key={step.number} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out transform ' + (isCompleted ? 'bg-green-600 text-white shadow-lg scale-105' : isActive ? 'bg-blue-600 text-white shadow-lg scale-110 animate-pulse' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 scale-95')}>
                                            {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <span className={'text-xs mt-2 font-semibold hidden sm:block transition-all duration-300 ' + (isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400')}>{step.title}</span>
                                    </div>
                                    {index < steps.length - 1 && <div className={'h-1 flex-1 mx-2 rounded-full transition-all duration-500 ' + (isCompleted ? 'bg-green-600' : 'bg-neutral-200 dark:bg-neutral-700')} />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 animate-slideIn">
                    {/* Etapa 1: Tipo e Identificação */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            {/* Seletor de Tipo de Pessoa */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 antialiased">
                                    Tipo de Pessoa *
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPersonType('fisica')}
                                        className={`p-4 rounded-2xl border-2 transition-all duration-500 ease-out transform hover:scale-105 ${personType === 'fisica'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                                            : 'border-gray-300/60 dark:border-neutral-700 hover:border-blue-400/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
                                            }`}
                                    >
                                        <User className={`w-8 h-8 mx-auto mb-2 transition-all duration-300 ${personType === 'fisica' ? 'text-blue-600' : 'text-neutral-400'
                                            }`} />
                                        <span className={`block text-sm font-bold antialiased ${personType === 'fisica' ? 'text-blue-600' : 'text-neutral-600 dark:text-neutral-400'
                                            }`}>
                                            Pessoa Física
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPersonType('juridica')}
                                        className={`p-4 rounded-2xl border-2 transition-all duration-500 ease-out transform hover:scale-105 ${personType === 'juridica'
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                                            : 'border-gray-300/60 dark:border-neutral-700 hover:border-blue-400/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
                                            }`}
                                    >
                                        <Building2 className={`w-8 h-8 mx-auto mb-2 transition-all duration-300 ${personType === 'juridica' ? 'text-blue-600' : 'text-neutral-400'
                                            }`} />
                                        <span className={`block text-sm font-bold antialiased ${personType === 'juridica' ? 'text-blue-600' : 'text-neutral-600 dark:text-neutral-400'
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
                                            <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 antialiased">Nome Completo *</label>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                setErrors({ ...errors, name: null });
                                            }}
                                            placeholder="João da Silva"
                                            className={'input-premium ' + (errors.name ? 'input-error' : '')}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <CreditCard className="w-4 h-4 text-neutral-400" />
                                                <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 antialiased">CPF *</label>
                                            </div>
                                            <input
                                                type="text"
                                                value={formatCPF(formData.cpf)}
                                                onChange={(e) => {
                                                    const cpfDigits = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, cpf: cpfDigits });

                                                    // Validar automaticamente quando atingir 11 dígitos
                                                    if (cpfDigits.length === 11) {
                                                        const cpfValidation = validateCPF(cpfDigits);
                                                        if (!cpfValidation.valid) {
                                                            setErrors({ ...errors, cpf: cpfValidation.message });
                                                        } else {
                                                            // Verificar duplicata (exceto o próprio cliente se estiver editando)
                                                            const isDuplicate = clients.some(c => 
                                                                c.cpf === cpfDigits && 
                                                                (!existingClient || (c.id !== existingClient.id && c.firestoreId !== existingClient.id))
                                                            );
                                                            if (isDuplicate) {
                                                                setErrors({ ...errors, cpf: 'CPF já cadastrado' });
                                                            } else {
                                                                setErrors({ ...errors, cpf: null });
                                                            }
                                                        }
                                                    } else {
                                                        setErrors({ ...errors, cpf: null });
                                                    }
                                                }}
                                                placeholder="123.456.789-00"
                                                maxLength={14}
                                                className={'input-premium ' + (errors.cpf ? 'input-error' : '')}
                                            />
                                            {errors.cpf && (
                                                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                        <span className="font-medium">{errors.cpf}</span>
                                                    </p>
                                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 ml-6">
                                                        Verifique se o CPF foi digitado corretamente
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="w-4 h-4 text-neutral-400" />
                                                <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 antialiased">Data de Nascimento *</label>
                                            </div>
                                            <input
                                                type="text"
                                                value={formatBirthDate(formData.birthDate)}
                                                onChange={(e) => {
                                                    const digits = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, birthDate: digits });
                                                    setErrors({ ...errors, birthDate: null });
                                                }}
                                                placeholder="DD/MM/AAAA"
                                                maxLength={10}
                                                className={'input-premium ' + (errors.birthDate ? 'input-error' : '')}
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
                                    {/* CNPJ com botão de busca */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <CreditCard className="w-4 h-4 text-neutral-400" />
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">CNPJ *</label>
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formatCNPJ(formData.cnpj)}
                                                onChange={(e) => {
                                                    const cnpjDigits = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, cnpj: cnpjDigits });

                                                    // Validar automaticamente quando atingir 14 dígitos
                                                    if (cnpjDigits.length === 14) {
                                                        const cnpjValidation = validateCNPJ(cnpjDigits);
                                                        if (!cnpjValidation.valid) {
                                                            setErrors({ ...errors, cnpj: cnpjValidation.message });
                                                        } else {
                                                            // Verificar duplicata (exceto o próprio cliente se estiver editando)
                                                            const isDuplicate = clients.some(c => 
                                                                c.cnpj === cnpjDigits && 
                                                                (!existingClient || (c.id !== existingClient.id && c.firestoreId !== existingClient.id))
                                                            );
                                                            if (isDuplicate) {
                                                                setErrors({ ...errors, cnpj: 'CNPJ já cadastrado' });
                                                            } else {
                                                                setErrors({ ...errors, cnpj: null });
                                                            }
                                                        }
                                                    } else {
                                                        setErrors({ ...errors, cnpj: null });
                                                    }
                                                }}
                                                placeholder="00.000.000/0000-00"
                                                maxLength={18}
                                                className={'flex-1 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ' + (errors.cnpj ? 'border-red-500 ring-2 ring-red-500/20' : 'border-neutral-200 dark:border-neutral-700') + ' text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out'}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCNPJSearch}
                                                disabled={formData.cnpj.replace(/\D/g, '').length !== 14 || isLoadingCNPJ}
                                                className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-neutral-400 text-white rounded-xl text-sm font-medium transition-all duration-300 ease-out shadow-lg shadow-green-600/30 flex items-center gap-2"
                                                title="Buscar dados da empresa na Receita Federal"
                                            >
                                                {isLoadingCNPJ ? (
                                                    <>
                                                        <Loader className="w-4 h-4 animate-spin" />
                                                        Buscando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="w-4 h-4" />
                                                        Buscar
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        {errors.cnpj ? (
                                            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                    <span className="font-medium">{errors.cnpj}</span>
                                                </p>
                                                <p className="text-xs text-red-500 dark:text-red-400 mt-1 ml-6">
                                                    Verifique se o CNPJ foi digitado corretamente
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                                                <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                                                Digite o CNPJ e clique em "Buscar" para preencher automaticamente
                                            </p>
                                        )}
                                    </div>

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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Phone className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 antialiased">Telefone *</label>
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFormData({ ...formData, phone: formatPhone(e.target.value) });
                                            setErrors({ ...errors, phone: null });
                                        }}
                                        placeholder="(11) 98765-4321"
                                        className={'input-premium ' + (errors.phone ? 'input-error' : '')}
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
                                        <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 antialiased">Email <span className="text-neutral-500 font-medium">(opcional)</span></label>
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="cliente@email.com"
                                        className="input-premium"
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
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Número {formData.hasNumber ? '*' : '(Opcional)'}
                                        </label>
                                    </div>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={formData.number}
                                            onChange={(e) => {
                                                setFormData({ ...formData, number: e.target.value });
                                                setErrors({ ...errors, number: null });
                                            }}
                                            placeholder="123"
                                            disabled={!formData.hasNumber}
                                            className={`w-full px-4 py-3 rounded-xl border text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out ${
                                                formData.hasNumber 
                                                    ? `bg-neutral-50 dark:bg-neutral-800 ${errors.number ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'}` 
                                                    : 'bg-neutral-100 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 opacity-60 cursor-not-allowed'
                                            }`}
                                        />
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.hasNumber}
                                                onChange={(e) => setFormData({ 
                                                    ...formData, 
                                                    hasNumber: e.target.checked,
                                                    number: e.target.checked ? formData.number : ''
                                                })}
                                                className="w-4 h-4 text-blue-600 bg-neutral-100 border-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                                            />
                                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                                Este endereço possui número
                                            </span>
                                        </label>
                                    </div>
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

                                        const loadingBrands = isLoadingBrands[vehicle.id];


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

                                                        {/* Premium Vehicle Preview Card */}
                                                        {vehicle.brand && (
                                                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/50 p-5 shadow-lg">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative flex-shrink-0">
                                                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
                                                                        <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                                            {vehicle.type === 'moto' ? (
                                                                                <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <circle cx="5" cy="17" r="3" stroke="currentColor" strokeWidth="1.8"/>
                                                                                    <circle cx="19" cy="17" r="3" stroke="currentColor" strokeWidth="1.8"/>
                                                                                    <path d="M5 17H8L10 12L14 8H17L19 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                    <path d="M14 8L12 12H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                </svg>
                                                                            ) : vehicle.type === 'caminhao' ? (
                                                                                <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <rect x="1" y="6" width="15" height="10" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                                                                                    <path d="M16 10H20L22 14V16H16V10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                                                                                    <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.8"/>
                                                                                    <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.8"/>
                                                                                </svg>
                                                                            ) : (
                                                                                <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M5 13L7 7H17L19 13M5 13V17C5 17.5523 5.44772 18 6 18H7M5 13H19M19 13V17C19 17.5523 18.5523 18 18 18H17M7 18C7 19.1046 7.89543 20 9 20C10.1046 20 11 19.1046 11 18M7 18C7 16.8954 7.89543 16 9 16C10.1046 16 11 16.8954 11 18M17 18C17 19.1046 16.1046 20 15 20C13.8954 20 13 19.1046 13 18M17 18C17 16.8954 16.1046 16 15 16C13.8954 16 13 16.8954 13 18M11 18H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                    <path d="M7 10L8 7H16L17 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                                                                </svg>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 mb-2">
                                                                            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none">
                                                                                <rect x="2" y="10" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                                                <path d="M6 14H8M16 14H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                                            </svg>
                                                                            <span className="text-xs font-bold text-gray-900 dark:text-white tracking-wider">
                                                                                {vehicle.plate}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                                                                            {vehicle.brand && `${vehicle.brand} `}{vehicle.model}
                                                                        </div>
                                                                        {(vehicle.year || vehicle.color) && (
                                                                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                                                {vehicle.year && (
                                                                                    <span className="flex items-center gap-1">
                                                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                                                                            <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                                                            <path d="M3 10H21M8 3V6M16 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                                                        </svg>
                                                                                        {vehicle.year}
                                                                                    </span>
                                                                                )}
                                                                                {vehicle.color && (
                                                                                    <>
                                                                                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                                                                                        <span>{vehicle.color}</span>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {/* Editable color field */}
                                                                <div className="mt-4 pt-3 border-t border-emerald-200/50 dark:border-emerald-700/50">
                                                                    <label className="block text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1.5">Cor do Veículo</label>
                                                                    <input
                                                                        type="text"
                                                                        value={vehicle.color}
                                                                        onChange={(e) => updateVehicle(vehicle.id, 'color', e.target.value)}
                                                                        placeholder="Ex: Vermelha, Prata, Preto..."
                                                                        className="w-full px-3 py-2 text-sm rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-emerald-300/50 dark:border-emerald-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none"
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
                <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2 rounded-lg font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-300 ease-out disabled:opacity-50 antialiased"
                    >
                        Cancelar
                    </button>
                    <div className="flex items-center gap-3">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-lg font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-300 ease-out disabled:opacity-50 flex items-center gap-2 antialiased"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Voltar
                            </button>
                        )}
                        {currentStep < steps.length ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-5 py-2 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 ease-out flex items-center gap-2 antialiased"
                            >
                                Avançar
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-5 py-2 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 antialiased"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Cadastrando...
                                    </>
                                ) : (
                                    <>
                                        {existingClient ? 'Atualizar Cliente' : 'Finalizar Cadastro'}
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
