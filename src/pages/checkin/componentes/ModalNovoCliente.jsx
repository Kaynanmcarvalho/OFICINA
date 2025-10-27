import { useState } from 'react';
import { X, User, Phone, Mail, CreditCard, MapPin, Car, FileText, ChevronRight, ChevronLeft, Check, Search as SearchIcon, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '../../../services/clientService';
import { searchVehicleByPlate, fetchBrands, fetchModels, getVehicleTypeForApi } from '../../../services/vehicleApiService';
import SearchableSelect from '../../../components/ui/SearchableSelect';

const ModalNovoCliente = ({ isOpen, onClose, onSuccess, initialName = '' }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: initialName,
        phone: '',
        cpf: '',
        email: '',
        birthDate: '',
        address: '',
        number: '',
        complement: '',
        city: '',
        state: '',
        zipCode: '',
        vehicles: [],
        observations: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCep, setIsLoadingCep] = useState(false);

    // Estados para veículos
    const [vehicleSearchMode, setVehicleSearchMode] = useState({});
    const [isSearchingPlate, setIsSearchingPlate] = useState({});
    const [availableBrands, setAvailableBrands] = useState({});
    const [availableModels, setAvailableModels] = useState({});
    const [isLoadingBrands, setIsLoadingBrands] = useState({});
    const [isLoadingModels, setIsLoadingModels] = useState({});

    const steps = [
        { number: 1, title: 'Dados Pessoais', icon: User },
        { number: 2, title: 'Endereço', icon: MapPin },
        { number: 3, title: 'Veículos', icon: Car },
        { number: 4, title: 'Observações', icon: FileText }
    ];

    const vehicleTypes = [
        { value: 'moto', label: 'Moto' },
        { value: 'carro', label: 'Carro' },
        { value: 'caminhao', label: 'Caminhão' }
    ];

    const formatCPF = (value) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
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
    };

    const handlePlateSearch = async (vehicleId, plate) => {
        if (plate.length < 7) return;

        setIsSearchingPlate(prev => ({ ...prev, [vehicleId]: true }));
        try {
            const result = await searchVehicleByPlate(plate);
            if (result.success) {
                const vehicleData = result.data;
                updateVehicle(vehicleId, 'type', vehicleData.tipo || 'moto');
                updateVehicle(vehicleId, 'brand', vehicleData.marca || '');
                updateVehicle(vehicleId, 'model', vehicleData.modelo || '');
                updateVehicle(vehicleId, 'year', vehicleData.ano || '');
                updateVehicle(vehicleId, 'color', vehicleData.cor || '');
                toast.success('Veículo encontrado!');
            } else {
                toast.error('Placa não encontrada. Preencha manualmente.');
            }
        } catch {
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
            if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
            if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        } else {
            toast.error('Preencha os campos obrigatórios');
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(1)) {
            toast.error('Preencha os campos obrigatórios');
            setCurrentStep(1);
            return;
        }
        setIsSubmitting(true);
        try {
            const newClient = await createClient({
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                cpf: formData.cpf.trim(),
                email: formData.email.trim(),
                birthDate: formData.birthDate,
                address: formData.address.trim(),
                number: formData.number.trim(),
                complement: formData.complement.trim(),
                city: formData.city.trim(),
                state: formData.state,
                zipCode: formData.zipCode.trim(),
                vehicles: formData.vehicles.map(v => ({
                    type: v.type,
                    brand: v.brand,
                    model: v.model,
                    plate: v.plate,
                    year: v.year,
                    color: v.color
                })),
                observations: formData.observations.trim()
            });
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
                    {/* Etapa 1: Dados Pessoais */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
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
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
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
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">CPF <span className="text-neutral-400">(opcional)</span></label>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.cpf}
                                        onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                                        placeholder="123.456.789-00"
                                        maxLength={14}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Data de Nascimento <span className="text-neutral-400">(opcional)</span></label>
                                    </div>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
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
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">CEP</label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.zipCode}
                                            onChange={handleZipCodeChange}
                                            placeholder="00000-000"
                                            maxLength={9}
                                            className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                                        />
                                        {isLoadingCep && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Loader className="w-4 h-4 animate-spin text-blue-600" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Cidade</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="São Paulo"
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Estado</label>
                                    </div>
                                    <select
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
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
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-neutral-400" />
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Endereço</label>
                                </div>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Rua, Avenida..."
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Número <span className="text-neutral-400">(opcional)</span></label>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.number}
                                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                        placeholder="123"
                                        className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-neutral-400" />
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Complemento <span className="text-neutral-400">(opcional)</span></label>
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
                                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Veículos do Cliente</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={addVehicle}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-300 ease-out shadow-lg shadow-blue-600/30"
                                >
                                    + Adicionar Veículo
                                </button>
                            </div>

                            {formData.vehicles.length === 0 ? (
                                <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                                    <Car className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
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
                                                                <SearchableSelect
                                                                    label="Modelo"
                                                                    options={models}
                                                                    value={vehicle.modelCode}
                                                                    onChange={(value) => handleModelChange(vehicle.id, value)}
                                                                    placeholder={loadingModels ? 'Carregando...' : vehicle.brandCode ? 'Selecione o modelo' : 'Selecione a marca primeiro'}
                                                                    disabled={!vehicle.brandCode || loadingModels}
                                                                />
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
