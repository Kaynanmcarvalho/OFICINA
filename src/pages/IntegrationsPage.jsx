import { useState, useEffect } from 'react';
import { Link2, Calendar, Save, RotateCcw, ChevronDown, ChevronUp, FileText, ShoppingCart, Upload, MapPin } from 'lucide-react';
import { useAuthStore } from '../store';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import toast from 'react-hot-toast';

const IntegrationsPage = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de expansão
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [isInvoiceExpanded, setIsInvoiceExpanded] = useState(false);
  const [isSalesExpanded, setIsSalesExpanded] = useState(false);

  // Estado de drag and drop
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);

  // Configurações de Agenda
  const [scheduleIntegrations, setScheduleIntegrations] = useState({
    showEmployeeName: true,
    showResponsibilities: true,
    enableColorCustomization: true,
    defaultColor: '#3B82F6',
    urgentColor: '#EF4444',
    highColor: '#F97316',
    normalColor: '#3B82F6',
    lowColor: '#6B7280',
  });

  // Configurações de Nota Fiscal
  const [invoiceSettings, setInvoiceSettings] = useState({
    regimeTributario: '1',
    cnae: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    ambiente: 'homologacao',
    serieNFe: '1',
    numeroNFe: '1',
    integracaoIBPT: false,
    estadoIBPT: '',
    cfopDentroEstado: '5102',
    cfopForaEstado: '6102',
    csosnIcms: '102',
    ncmPadrao: '',
    cestPadrao: '',
    certificadoUrl: '',
    certificadoSenha: '',
    contadorNome: '',
    contadorEmail: '',
    contadorTelefone: '',
  });

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [user]);

  const loadIntegrations = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Usar uid como fallback se organizationId não existir
    const orgId = user.organizationId || user.uid;

    setIsLoading(true);
    try {
      const docRef = doc(db, 'integrations', orgId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.schedule) {
          setScheduleIntegrations(prev => ({ ...prev, ...data.schedule }));
        }
        if (data.invoice) {
          setInvoiceSettings(prev => ({ ...prev, ...data.invoice }));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    console.log('User data:', user);
    
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    // Usar uid como fallback se organizationId não existir
    const orgId = user.organizationId || user.uid;
    
    if (!orgId) {
      toast.error('ID da organização não encontrado');
      return;
    }

    setIsSaving(true);
    try {
      const docRef = doc(db, 'integrations', orgId);
      await setDoc(docRef, {
        schedule: scheduleIntegrations,
        invoice: invoiceSettings,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      }, { merge: true });

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar integrações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (field) => {
    setScheduleIntegrations({ ...scheduleIntegrations, [field]: !scheduleIntegrations[field] });
  };

  const handleColorChange = (field, value) => {
    setScheduleIntegrations({ ...scheduleIntegrations, [field]: value });
  };

  const handleInvoiceChange = (field, value) => {
    setInvoiceSettings({ ...invoiceSettings, [field]: value });
  };

  const handleCepSearch = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setInvoiceSettings(prev => ({
          ...prev,
          cep: cleanCep,
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }));
        toast.success('CEP encontrado!');
      } else {
        toast.error('CEP não encontrado');
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    }
  };

  const handleCertificateUpload = async (file) => {
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.name.endsWith('.pfx') && !file.name.endsWith('.p12')) {
      toast.error('Apenas arquivos .pfx ou .p12 são permitidos');
      return;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    const orgId = user.organizationId || user.uid;

    setUploadingCertificate(true);
    try {
      const storageRef = ref(storage, `certificates/${orgId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setInvoiceSettings(prev => ({ ...prev, certificadoUrl: url }));
      toast.success('Certificado enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao enviar certificado');
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleCertificateUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleCertificateUpload(file);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando integrações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Integrações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure as integrações e personalizações do sistema
        </p>
      </div>

      <div className="space-y-6">
        {/* Nota Fiscal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setIsInvoiceExpanded(!isInvoiceExpanded)}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 p-6 hover:from-green-700 hover:to-green-800 transition-all"
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" />
                <div className="text-left">
                  <h2 className="text-2xl font-bold">Nota Fiscal</h2>
                  <p className="text-green-100 mt-1">Configurações de emissão de NF-e</p>
                </div>
              </div>
              {isInvoiceExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </div>
          </button>

          {isInvoiceExpanded && (
            <div className="p-6 space-y-6">
              {/* Dados Fiscais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados Fiscais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Regime Tributário
                    </label>
                    <select
                      value={invoiceSettings.regimeTributario}
                      onChange={(e) => handleInvoiceChange('regimeTributario', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="1">Simples Nacional</option>
                      <option value="2">Simples Nacional - Excesso</option>
                      <option value="3">Regime Normal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      CNAE
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.cnae}
                      onChange={(e) => handleInvoiceChange('cnae', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0000-0/00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Inscrição Estadual
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.inscricaoEstadual}
                      onChange={(e) => handleInvoiceChange('inscricaoEstadual', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Inscrição Municipal
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.inscricaoMunicipal}
                      onChange={(e) => handleInvoiceChange('inscricaoMunicipal', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Endereço Completo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.cep}
                      onChange={(e) => {
                        handleInvoiceChange('cep', e.target.value);
                        if (e.target.value.replace(/\D/g, '').length === 8) {
                          handleCepSearch(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Logradouro
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.logradouro}
                      onChange={(e) => handleInvoiceChange('logradouro', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Número
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.numero}
                      onChange={(e) => handleInvoiceChange('numero', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.complemento}
                      onChange={(e) => handleInvoiceChange('complemento', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.bairro}
                      onChange={(e) => handleInvoiceChange('bairro', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.cidade}
                      onChange={(e) => handleInvoiceChange('cidade', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.estado}
                      onChange={(e) => handleInvoiceChange('estado', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      maxLength="2"
                    />
                  </div>
                </div>
              </div>

              {/* Configurações de Numeração e Ambiente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações de Numeração e Ambiente</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Ambiente
                    </label>
                    <select
                      value={invoiceSettings.ambiente}
                      onChange={(e) => handleInvoiceChange('ambiente', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="homologacao">Homologação</option>
                      <option value="producao">Produção</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Série NF-e
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.serieNFe}
                      onChange={(e) => handleInvoiceChange('serieNFe', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Número Inicial NF-e
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.numeroNFe}
                      onChange={(e) => handleInvoiceChange('numeroNFe', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Configurações Tributárias Avançadas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações Tributárias Avançadas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Integração IBPT</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Ativar cálculo de impostos aproximados</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={invoiceSettings.integracaoIBPT}
                        onChange={(e) => handleInvoiceChange('integracaoIBPT', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {invoiceSettings.integracaoIBPT && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Estado para IBPT
                      </label>
                      <input
                        type="text"
                        value={invoiceSettings.estadoIBPT}
                        onChange={(e) => handleInvoiceChange('estadoIBPT', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        maxLength="2"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Configurações Tributárias */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configurações Tributárias</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      CFOP Dentro do Estado
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.cfopDentroEstado}
                      onChange={(e) => handleInvoiceChange('cfopDentroEstado', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="5102"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      CFOP Fora do Estado
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.cfopForaEstado}
                      onChange={(e) => handleInvoiceChange('cfopForaEstado', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="6102"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      CSOSN ICMS
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.csosnIcms}
                      onChange={(e) => handleInvoiceChange('csosnIcms', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="102"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      NCM Padrão
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.ncmPadrao}
                      onChange={(e) => handleInvoiceChange('ncmPadrao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      CEST Padrão
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.cestPadrao}
                      onChange={(e) => handleInvoiceChange('cestPadrao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Certificado Digital */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Certificado Digital A1/A3
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Upload do Certificado
                    </label>

                    {/* Área de Drag and Drop */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`
                        relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
                        ${isDragging
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                        }
                        ${uploadingCertificate ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <input
                        type="file"
                        accept=".pfx,.p12"
                        onChange={handleFileInputChange}
                        disabled={uploadingCertificate}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        id="certificate-upload"
                      />

                      <div className="flex flex-col items-center gap-3">
                        <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center
                          ${isDragging ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-700'}
                        `}>
                          <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
                        </div>

                        {uploadingCertificate ? (
                          <div className="space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Enviando certificado...</p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <p className="text-base font-medium text-gray-900 dark:text-white">
                                {isDragging ? 'Solte o arquivo aqui' : 'Arraste o certificado aqui'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                ou clique para procurar
                              </p>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              Formatos aceitos: .pfx, .p12
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {invoiceSettings.certificadoUrl && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Certificado enviado com sucesso!</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Senha do Certificado
                    </label>
                    <input
                      type="password"
                      value={invoiceSettings.certificadoSenha}
                      onChange={(e) => handleInvoiceChange('certificadoSenha', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dados do Contador */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados do Contador</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={invoiceSettings.contadorNome}
                      onChange={(e) => handleInvoiceChange('contadorNome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={invoiceSettings.contadorEmail}
                      onChange={(e) => handleInvoiceChange('contadorEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={invoiceSettings.contadorTelefone}
                      onChange={(e) => handleInvoiceChange('contadorTelefone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Agenda e Cronograma */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8" />
                <div className="text-left">
                  <h2 className="text-2xl font-bold">Agenda e Cronograma</h2>
                  <p className="text-blue-100 mt-1">Personalize a exibição e funcionalidades da agenda</p>
                </div>
              </div>
              {isScheduleExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </div>
          </button>

          {isScheduleExpanded && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-blue-600" />
                  Funcionalidades de Exibição
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Mostrar Nome do Funcionário</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Exibe o nome do funcionário responsável dentro do card de agendamento
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scheduleIntegrations.showEmployeeName}
                        onChange={() => handleToggle('showEmployeeName')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Mostrar Responsabilidades</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Exibe as responsabilidades e tarefas atribuídas ao agendamento
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scheduleIntegrations.showResponsibilities}
                        onChange={() => handleToggle('showResponsibilities')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Personalização de Cores</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Permite customizar as cores dos agendamentos por prioridade
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scheduleIntegrations.enableColorCustomization}
                        onChange={() => handleToggle('enableColorCustomization')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              {scheduleIntegrations.enableColorCustomization && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cores por Prioridade</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Cor Padrão', field: 'defaultColor' },
                      { label: 'Urgente', field: 'urgentColor' },
                      { label: 'Alta Prioridade', field: 'highColor' },
                      { label: 'Normal', field: 'normalColor' },
                      { label: 'Baixa Prioridade', field: 'lowColor' },
                    ].map(({ label, field }) => (
                      <div key={field} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={scheduleIntegrations[field]}
                            onChange={(e) => handleColorChange(field, e.target.value)}
                            className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={scheduleIntegrations[field]}
                            onChange={(e) => handleColorChange(field, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vendas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setIsSalesExpanded(!isSalesExpanded)}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 p-6 hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                <div className="text-left">
                  <h2 className="text-2xl font-bold">Vendas</h2>
                  <p className="text-purple-100 mt-1">Configurações de vendas e PDV</p>
                </div>
              </div>
              {isSalesExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </div>
          </button>

          {isSalesExpanded && (
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400">Configurações de vendas em desenvolvimento...</p>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={loadIntegrations}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  );
};

export default IntegrationsPage;
