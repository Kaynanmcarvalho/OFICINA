/**
 * OnboardingEmpresa - Cadastro de Nova Empresa Cliente
 * 
 * APENAS para o dono do SaaS Torq
 * Cria nova empresa + primeiro usuário admin
 */

import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, User, MapPin, Save, ArrowLeft,
  Search, Loader2, CheckCircle, Info
} from 'lucide-react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cnpjApiService } from '../../services/cnpjApiService';
import { cepApiService } from '../../services/cepApiService';
import { 
  TIPOS_INSCRICAO_ESTADUAL, 
  SITUACOES_CNPJ,
  determinarTipoInscricaoEstadual 
} from '../../constants/inscricaoEstadual';

const OnboardingEmpresa = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCNPJ, setIsLoadingCNPJ] = useState(false);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [step, setStep] = useState(1);
  const [cnpjData, setCnpjData] = useState(null);
  const [cepData, setCepData] = useState(null);
  const [errors, setErrors] = useState({});

  // Dados da Empresa
  const [empresaData, setEmpresaData] = useState({
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: '',
    tipoInscricaoEstadual: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    telefone: '',
    email: '',
    site: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil'
    },
    situacao: '',
    atividade: '',
    porte: '',
    ativo: true
  });

  // Dados do Primeiro Usuário (Admin)
  const [adminData, setAdminData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    cargo: 'Administrador'
  });

  // Consultar CNPJ automaticamente
  const consultarCNPJ = async (cnpj) => {
    if (!cnpj || cnpj.replace(/[^\d]/g, '').length !== 14) return;

    setIsLoadingCNPJ(true);
    // Limpar dados do CEP anterior quando consultar CNPJ
    setCepData(null);
    
    try {
      const data = await cnpjApiService.consultarCNPJ(cnpj);
      setCnpjData(data);

      // Preencher dados automaticamente
      setEmpresaData(prev => ({
        ...prev,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        email: data.contato.email || prev.email,
        telefone: data.contato.telefone || prev.telefone,
        situacao: data.situacao,
        atividade: data.atividade,
        porte: data.porte,
        endereco: {
          ...prev.endereco,
          cep: data.endereco.cep || prev.endereco.cep,
          logradouro: data.endereco.logradouro || prev.endereco.logradouro,
          numero: data.endereco.numero || prev.endereco.numero,
          complemento: data.endereco.complemento || prev.endereco.complemento,
          bairro: data.endereco.bairro || prev.endereco.bairro,
          cidade: data.endereco.cidade || prev.endereco.cidade,
          estado: data.endereco.uf || prev.endereco.estado
        }
      }));

      // Sugerir tipo de inscrição estadual
      const tipoSugerido = determinarTipoInscricaoEstadual(data.atividade, data.naturezaJuridica);
      if (tipoSugerido) {
        setEmpresaData(prev => ({
          ...prev,
          tipoInscricaoEstadual: tipoSugerido
        }));
      }

      toast.success('Dados da empresa carregados com sucesso!', { icon: '✅' });
    } catch (error) {
      toast.error(`Erro ao consultar CNPJ: ${error.message}`, { icon: '❌' });
      setCnpjData(null);
    } finally {
      setIsLoadingCNPJ(false);
    }
  };

  // Consultar CEP automaticamente
  const consultarCEP = async (cep) => {
    if (!cep || cep.replace(/[^\d]/g, '').length !== 8) return;

    setIsLoadingCEP(true);
    try {
      const data = await cepApiService.consultarCEP(cep);
      setCepData(data);

      // Preencher endereço automaticamente
      setEmpresaData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.uf
        }
      }));

      toast.success('Endereço carregado com sucesso!', { icon: '📍' });
    } catch (error) {
      toast.error(`Erro ao consultar CEP: ${error.message}`, { icon: '❌' });
      setCepData(null);
    } finally {
      setIsLoadingCEP(false);
    }
  };

  const handleEmpresaChange = (field, value) => {
    setEmpresaData(prev => ({ ...prev, [field]: value }));

    // Auto-consultar CNPJ quando completo
    if (field === 'cnpj' && value.replace(/[^\d]/g, '').length === 14) {
      consultarCNPJ(value);
    }
  };

  const handleEnderecoChange = (field, value) => {
    setEmpresaData(prev => ({
      ...prev,
      endereco: { ...prev.endereco, [field]: value }
    }));

    // Auto-consultar CEP quando completo
    if (field === 'cep' && value.replace(/[^\d]/g, '').length === 8) {
      consultarCEP(value);
    }
  };

  const handleAdminChange = (field, value) => {
    setAdminData(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (nomeFantasia) => {
    return nomeFantasia
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpar erros anteriores
    setErrors({});
    const newErrors = {};

    // Validar campos do admin
    if (!adminData.nome) {
      newErrors.adminNome = true;
    }
    if (!adminData.email) {
      newErrors.adminEmail = true;
    }
    if (!adminData.senha) {
      newErrors.adminSenha = true;
    }
    if (!adminData.confirmarSenha) {
      newErrors.adminConfirmarSenha = true;
    }

    // Se houver erros, mostrar e destacar campos
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todos os campos obrigatórios destacados', { icon: '⚠️' });
      return;
    }

    // Validações adicionais
    if (adminData.senha !== adminData.confirmarSenha) {
      setErrors({ adminConfirmarSenha: true });
      toast.error('As senhas não coincidem');
      return;
    }

    if (adminData.senha.length < 6) {
      setErrors({ adminSenha: true });
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Gerar empresaId único
      const empresaId = doc(collection(db, 'empresas')).id;
      const slug = generateSlug(empresaData.nomeFantasia);

      // 2. Criar empresa no Firestore
      await setDoc(doc(db, 'empresas', empresaId), {
        ...empresaData,
        slug,
        empresaId,
        dataCriacao: serverTimestamp(),
        dataAtualizacao: serverTimestamp()
      });

      // 3. Criar primeiro usuário (admin) no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        adminData.email,
        adminData.senha
      );

      const userId = userCredential.user.uid;

      // 4. Criar documento do usuário em /usuarios (global)
      await setDoc(doc(db, 'usuarios', userId), {
        empresaId,
        nome: adminData.nome,
        email: adminData.email,
        telefone: adminData.telefone,
        cargo: adminData.cargo,
        role: 'admin',
        ativo: true,
        permissoes: ['all'],
        dataCriacao: serverTimestamp()
      });

      // 5. Criar documento do usuário em /empresas/{empresaId}/usuarios
      await setDoc(doc(db, `empresas/${empresaId}/usuarios`, userId), {
        nome: adminData.nome,
        email: adminData.email,
        telefone: adminData.telefone,
        cargo: adminData.cargo,
        role: 'admin',
        ativo: true,
        permissoes: ['all'],
        dataCriacao: serverTimestamp()
      });

      // 6. Criar configurações padrão da empresa
      await setDoc(doc(db, `empresas/${empresaId}/configuracoes`, 'tema'), {
        corPrimaria: '#F28C1D',
        corSecundaria: '#007AFF',
        corFundo: '#FFFFFF',
        gradiente: ['#F28C1D', '#FF6B35', '#F28C1D']
      });

      toast.success('Empresa criada com sucesso!', {
        icon: '🎉',
        duration: 4000
      });

      // Redirecionar para dashboard
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      
      let errorMessage = 'Erro ao criar empresa';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca';
      }

      toast.error(errorMessage, {
        icon: '❌',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Nova Empresa Cliente
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Cadastre uma nova empresa no sistema Torq
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            step === 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            <Building2 className="w-4 h-4" />
            <span className="font-semibold">1. Dados da Empresa</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            step === 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            <User className="w-4 h-4" />
            <span className="font-semibold">2. Primeiro Usuário</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            {step === 1 && (
              <Step1DadosEmpresa
                empresaData={empresaData}
                onEmpresaChange={handleEmpresaChange}
                onEnderecoChange={handleEnderecoChange}
                onNext={() => setStep(2)}
                isLoadingCNPJ={isLoadingCNPJ}
                isLoadingCEP={isLoadingCEP}
                cnpjData={cnpjData}
                cepData={cepData}
                errors={errors}
                setErrors={setErrors}
              />
            )}

            {step === 2 && (
              <Step2PrimeiroUsuario
                adminData={adminData}
                onAdminChange={handleAdminChange}
                onBack={() => {
                  setStep(1);
                  setErrors({});
                }}
                isLoading={isLoading}
                errors={errors}
                setErrors={setErrors}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Step 1: Dados da Empresa
const Step1DadosEmpresa = ({ 
  empresaData, 
  onEmpresaChange, 
  onEnderecoChange, 
  onNext,
  isLoadingCNPJ,
  isLoadingCEP,
  cnpjData,
  cepData,
  errors,
  setErrors
}) => {
  const handleNext = (e) => {
    e.preventDefault();
    
    // Limpar erros anteriores
    setErrors({});
    const newErrors = {};

    // Validar campos obrigatórios
    if (!empresaData.nomeFantasia) {
      newErrors.nomeFantasia = true;
    }
    if (!empresaData.cnpj) {
      newErrors.cnpj = true;
    }
    if (!empresaData.email) {
      newErrors.email = true;
    }
    if (!empresaData.tipoInscricaoEstadual) {
      newErrors.tipoInscricaoEstadual = true;
    }

    // Validar IE se necessário
    const tipoIE = TIPOS_INSCRICAO_ESTADUAL.find(t => t.value === empresaData.tipoInscricaoEstadual);
    if (tipoIE?.requiresNumber && !empresaData.inscricaoEstadual) {
      newErrors.inscricaoEstadual = true;
    }

    // Se houver erros, mostrar e destacar campos
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Preencha todos os campos obrigatórios destacados', { icon: '⚠️' });
      return;
    }

    // Validar situação da empresa
    if (cnpjData && cnpjData.situacao) {
      const situacao = SITUACOES_CNPJ[cnpjData.situacao.toUpperCase()];
      if (situacao && !situacao.canRegister) {
        toast.error(situacao.warning, { icon: '⚠️', duration: 5000 });
        return;
      }
    }
    
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Dados da Empresa
      </h2>

      {/* CNPJ com consulta automática */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            Consulta Automática de CNPJ
          </h3>
        </div>
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            CNPJ * {isLoadingCNPJ && <span className="text-blue-500">(Consultando Receita Federal...)</span>}
          </label>
          <div className="relative">
            <input
              type="text"
              value={empresaData.cnpj}
              onChange={(e) => {
                const formatted = cnpjApiService.formatCNPJDisplay(e.target.value);
                onEmpresaChange('cnpj', formatted);
                if (errors.cnpj) {
                  setErrors(prev => ({ ...prev, cnpj: false }));
                }
              }}
              className={`w-full px-4 py-3 pr-12 bg-white dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                errors.cnpj 
                  ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/50' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              required
            />
            {isLoadingCNPJ && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              </div>
            )}
            {cnpjData && !isLoadingCNPJ && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
          {errors.cnpj && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Campo obrigatório</p>
          )}
        </div>

        {/* Dados consultados do CNPJ */}
        <AnimatePresence>
          {cnpjData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-700 dark:text-green-300">
                  Dados encontrados na Receita Federal
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Situação:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    SITUACOES_CNPJ[cnpjData.situacao?.toUpperCase()]?.color === 'green' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {SITUACOES_CNPJ[cnpjData.situacao?.toUpperCase()]?.icon} {cnpjData.situacao}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Porte:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{cnpjData.porte}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Atividade:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{cnpjData.atividade}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dados Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nome Fantasia *
          </label>
          <input
            type="text"
            value={empresaData.nomeFantasia}
            onChange={(e) => {
              onEmpresaChange('nomeFantasia', e.target.value);
              if (errors.nomeFantasia) {
                setErrors(prev => ({ ...prev, nomeFantasia: false }));
              }
            }}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.nomeFantasia 
                ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/50' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Ex: SpeedCar Motors"
            required
          />
          {errors.nomeFantasia && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Campo obrigatório</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Razão Social
          </label>
          <input
            type="text"
            value={empresaData.razaoSocial}
            onChange={(e) => onEmpresaChange('razaoSocial', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Ex: SpeedCar Motors Ltda"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tipo de Inscrição Estadual *
          </label>
          <select
            value={empresaData.tipoInscricaoEstadual}
            onChange={(e) => {
              onEmpresaChange('tipoInscricaoEstadual', e.target.value);
              if (errors.tipoInscricaoEstadual) {
                setErrors(prev => ({ ...prev, tipoInscricaoEstadual: false }));
              }
            }}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.tipoInscricaoEstadual 
                ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/50' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            required
          >
            <option value="">Selecione o tipo</option>
            {TIPOS_INSCRICAO_ESTADUAL.map(tipo => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.icon} {tipo.label}
              </option>
            ))}
          </select>
          {errors.tipoInscricaoEstadual && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Campo obrigatório</p>
          )}
          {empresaData.tipoInscricaoEstadual && !errors.tipoInscricaoEstadual && (
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              {TIPOS_INSCRICAO_ESTADUAL.find(t => t.value === empresaData.tipoInscricaoEstadual)?.description}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Número da Inscrição Estadual
            {TIPOS_INSCRICAO_ESTADUAL.find(t => t.value === empresaData.tipoInscricaoEstadual)?.requiresNumber && ' *'}
          </label>
          <input
            type="text"
            value={empresaData.inscricaoEstadual}
            onChange={(e) => {
              onEmpresaChange('inscricaoEstadual', e.target.value);
              if (errors.inscricaoEstadual) {
                setErrors(prev => ({ ...prev, inscricaoEstadual: false }));
              }
            }}
            disabled={!TIPOS_INSCRICAO_ESTADUAL.find(t => t.value === empresaData.tipoInscricaoEstadual)?.requiresNumber}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all ${
              errors.inscricaoEstadual 
                ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/50' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={
              TIPOS_INSCRICAO_ESTADUAL.find(t => t.value === empresaData.tipoInscricaoEstadual)?.requiresNumber
                ? "000.000.000.000" 
                : "Não aplicável"
            }
          />
          {errors.inscricaoEstadual && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Campo obrigatório</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={empresaData.email}
            onChange={(e) => {
              onEmpresaChange('email', e.target.value);
              if (errors.email) {
                setErrors(prev => ({ ...prev, email: false }));
              }
            }}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.email 
                ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/50' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="contato@empresa.com"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Campo obrigatório</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Telefone
          </label>
          <input
            type="text"
            value={empresaData.telefone}
            onChange={(e) => onEmpresaChange('telefone', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="(00) 00000-0000"
          />
        </div>

      </div>

      {/* Endereço com consulta automática de CEP */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Endereço
        </h3>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-green-900 dark:text-green-100">
              Consulta Automática de CEP
            </h4>
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              CEP {isLoadingCEP && <span className="text-green-500">(Consultando...)</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                value={empresaData.endereco.cep}
                onChange={(e) => {
                  const formatted = cepApiService.formatCEPDisplay(e.target.value);
                  onEnderecoChange('cep', formatted);
                }}
                className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="00000-000"
                maxLength={9}
              />
              {isLoadingCEP && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
                </div>
              )}
              {cepData && !isLoadingCEP && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
          </div>

          {/* Dados consultados do CEP */}
          <AnimatePresence>
            {cepData && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-green-700 dark:text-green-300 text-sm">
                    Endereço encontrado
                  </span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p>{cepData.logradouro}</p>
                  <p>{cepData.bairro} - {cepData.cidade}/{cepData.uf}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Logradouro
            </label>
            <input
              type="text"
              value={empresaData.endereco.logradouro}
              onChange={(e) => onEnderecoChange('logradouro', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Rua, Avenida, etc"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Número
            </label>
            <input
              type="text"
              value={empresaData.endereco.numero}
              onChange={(e) => onEnderecoChange('numero', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="123"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bairro
            </label>
            <input
              type="text"
              value={empresaData.endereco.bairro}
              onChange={(e) => onEnderecoChange('bairro', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Centro"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={empresaData.endereco.cidade}
              onChange={(e) => onEnderecoChange('cidade', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="São Paulo"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <input
              type="text"
              value={empresaData.endereco.estado}
              onChange={(e) => onEnderecoChange('estado', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="SP"
              maxLength={2}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          Próximo: Primeiro Usuário →
        </button>
      </div>
    </div>
  );
};

// Step 2: Primeiro Usuário (Admin)
const Step2PrimeiroUsuario = ({ adminData, onAdminChange, onBack, isLoading, errors, setErrors }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Primeiro Usuário (Administrador)
      </h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          Este será o usuário administrador da empresa. Ele poderá criar outros usuários posteriormente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            value={adminData.nome}
            onChange={(e) => {
              onAdminChange('nome', e.target.value);
              if (errors.adminNome) {
                setErrors(prev => ({ ...prev, adminNome: false }));
              }
            }}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.adminNome 
                ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/50' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="João Silva"
            required
          />
          {errors.adminNome && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Campo obrigatório</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={adminData.email}
            onChange={(e) => {
              onAdminChange('email', e.target.value);
              if (errors.adminEmail) {
                setErrors(prev => ({ ...prev, adminEmail: false }));
              }
            }}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.adminEmail 
                ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/50' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="joao@empresa.com"
            required
          />
          {errors.adminEmail && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Campo obrigatório</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Telefone
          </label>
          <input
            type="text"
            value={adminData.telefone}
            onChange={(e) => onAdminChange('telefone', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Cargo
          </label>
          <input
            type="text"
            value={adminData.cargo}
            onChange={(e) => onAdminChange('cargo', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Administrador"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Senha *
          </label>
          <input
            type="password"
            value={adminData.senha}
            onChange={(e) => {
              onAdminChange('senha', e.target.value);
              if (errors.adminSenha) {
                setErrors(prev => ({ ...prev, adminSenha: false }));
              }
            }}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.adminSenha 
                ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/50' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
          {errors.adminSenha && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">Campo obrigatório (mínimo 6 caracteres)</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Confirmar Senha *
          </label>
          <input
            type="password"
            value={adminData.confirmarSenha}
            onChange={(e) => {
              onAdminChange('confirmarSenha', e.target.value);
              if (errors.adminConfirmarSenha) {
                setErrors(prev => ({ ...prev, adminConfirmarSenha: false }));
              }
            }}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
              errors.adminConfirmarSenha 
                ? 'border-red-500 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/50' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Repita a senha"
            required
            minLength={6}
          />
          {errors.adminConfirmarSenha && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {adminData.senha !== adminData.confirmarSenha ? 'As senhas não coincidem' : 'Campo obrigatório'}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all"
          disabled={isLoading}
        >
          ← Voltar
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Criando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Criar Empresa
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OnboardingEmpresa;
