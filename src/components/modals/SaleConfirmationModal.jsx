import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiCheck, 
  FiUser, 
  FiPhone, 
  FiMapPin,
  FiFileText,
  FiPrinter
} from 'react-icons/fi';
import { useAuthStore } from '../../store';
import configService from '../../config/configService';
import cepService from '../../config/cepService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const SaleConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  saleData,
  paymentData,
  cartItems = [],
  loading = false
}) => {
  const { user: currentUser } = useAuthStore();
  const [permissions, setPermissions] = useState({ nfeAtivo: false, nfceAtivo: false, nfseAtivo: false });
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    const loadPerms = async () => {
      if (!currentUser) {
        setLoadingPermissions(false);
        return;
      }
      try {
        // Buscar permissões da coleção integrations
        const orgId = currentUser.organizationId || currentUser.uid;
        const docRef = doc(db, 'integrations', orgId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPermissions({
            nfeAtivo: data.invoice?.nfeAtivo || false,
            nfceAtivo: data.invoice?.nfceAtivo || false,
            nfseAtivo: data.invoice?.nfseAtivo || false
          });
        } else {
          setPermissions({ nfeAtivo: false, nfceAtivo: false, nfseAtivo: false });
        }
      } catch (e) {
        console.error('Erro ao carregar permissões de NF:', e);
        setPermissions({ nfeAtivo: false, nfceAtivo: false, nfseAtivo: false });
      } finally {
        setLoadingPermissions(false);
      }
    };
    loadPerms();
  }, [currentUser]);

  const [customerData, setCustomerData] = useState({
    nome: '',
    cpfCnpj: '',
    tipoPessoa: 'fisica', // 'fisica' ou 'juridica'
    email: '',
    telefone: '',
    inscricaoEstadual: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: '',
      codigoMunicipio: '' // Código IBGE do município (opcional)
    }
  });
  
  const [generateNFe, setGenerateNFe] = useState(false);
  const [nfeType, setNfeType] = useState('nfce'); // 'nfe' ou 'nfce'

  // Ajustar tipo inicial conforme permissões
  useEffect(() => {
    if (!loadingPermissions) {
      if (!permissions.nfceAtivo && permissions.nfeAtivo) {
        setNfeType('nfe');
      }
      if (!permissions.nfeAtivo && permissions.nfceAtivo) {
        setNfeType('nfce');
      }
      if (!permissions.nfeAtivo && !permissions.nfceAtivo && permissions.nfseAtivo) {
        setNfeType('nfse');
      }
      if (!permissions.nfeAtivo && !permissions.nfceAtivo && !permissions.nfseAtivo) {
        setGenerateNFe(false);
      }
    }
  }, [loadingPermissions, permissions]);
  
  // Ajustar tpImp automaticamente baseado no tipo de NF
  const handleNfeTypeChange = (type) => {
    // Impedir seleção de tipo desabilitado
    if ((type === 'nfce' && !permissions.nfceAtivo) || 
        (type === 'nfe' && !permissions.nfeAtivo) ||
        (type === 'nfse' && !permissions.nfseAtivo)) {
      return;
    }
    setNfeType(type);
    setNfeOptions(prev => ({
      ...prev,
      tpImp: type === 'nfce' ? 4 : type === 'nfse' ? 0 : 1 // NFCe=4 (DANFe NFC-e), NFe=1 (Retrato), NFSe=0 (Sem DANFE)
    }));
  };
  const [printReceipt, setPrintReceipt] = useState(true);
  const [observations, setObservations] = useState('');
  
  // Opções avançadas baseadas no manual.md
  const [nfeOptions, setNfeOptions] = useState({
    tpImp: 4, // Formato impressão (4=DANFe NFC-e)
    indPres: 1, // Presença comprador (1=Presencial)
    finNFe: 1, // Finalidade (1=Normal)
    tpEmis: 1, // Forma emissão (1=Normal)
    idDest: 1, // Local destino (1=Interna)
    modFrete: 9 // Modalidade do frete (9=Sem frete)
  });
  // Removidos loadings de CEP/CPF/CNPJ (sem chamadas externas)

  const handleConfirm = async () => {
    const confirmationData = {
      ...saleData,
      payment: paymentData,
      customer: customerData,
      options: {
        generateNFe,
        nfeType,
        printReceipt,
        ...nfeOptions // Incluir opções avançadas
      },
      observations,
      timestamp: new Date().toISOString()
    };

    await onConfirm(confirmationData);
  };

  const handleCustomerChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomerData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCustomerData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Função para determinar se dados do cliente são obrigatórios
  const isCustomerDataRequired = () => {
    if (!generateNFe) return false;
    
    // Para NFe (modelo 55), dados do cliente são sempre obrigatórios
    if (nfeType === 'nfe') return true;
    
    // Para NFS-e (serviços), dados do cliente são obrigatórios
    if (nfeType === 'nfse') return true;
    
    // Para NFCe, dados do cliente não são obrigatórios
    if (nfeType === 'nfce') {
      return false;
    }
    
    return false;
  };

  const handleCepChange = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    handleCustomerChange('endereco.cep', cleanCep);
    if (cleanCep.length === 8) {
      try {
        const data = await cepService.lookupCep(cleanCep);
        setCustomerData(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            cep: cleanCep,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            uf: data.uf || ''
          }
        }));
      } catch (err) {
        console.error('CEP lookup erro:', err);
      }
    }
  };

  const handleCpfCnpjChange = async (value) => {
    handleCustomerChange('cpfCnpj', value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      'dinheiro': 'Dinheiro',
      'cartao_credito': 'Cartão de Crédito',
      'cartao_debito': 'Cartão de Débito',
      'pix': 'PIX'
    };
    return methods[method] || method;
  };

  const formatCpfCnpj = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (customerData.tipoPessoa === 'fisica') {
      // CPF: 000.000.000-00
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const formatCep = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Confirmar Venda
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Revise os dados antes de finalizar
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Resumo da Venda */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiFileText className="w-5 h-5" />
                    Resumo da Venda
                  </h4>
                  
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div>
                          <div className="font-medium">{item.nome}</div>
                          <div className="text-gray-500">
                            {item.quantidade}x {formatCurrency(item.preco)}
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatCurrency(item.quantidade * item.preco)}
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(saleData?.subtotal || 0)}</span>
                      </div>
                      {saleData?.desconto > 0 && (
                        <div className="flex justify-between items-center text-sm text-green-600">
                          <span>Desconto:</span>
                          <span>- {formatCurrency(saleData.desconto)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span className="text-green-600">
                          {formatCurrency(saleData?.total || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados do Pagamento */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Dados do Pagamento
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    {paymentData?.pagamentos && paymentData.pagamentos.length > 0 ? (
                      paymentData.pagamentos.map((pagamento, index) => (
                        <div key={index} className="mb-3 pb-2 border-b border-blue-200 last:border-b-0">
                          <div className="flex justify-between">
                            <span>Método {paymentData.pagamentos.length > 1 ? `${index + 1}:` : ':'}:</span>
                            <span className="font-medium">
                              {formatPaymentMethod(pagamento.metodo)} - {formatCurrency(pagamento.valor)}
                            </span>
                          </div>
                          
                          {pagamento.parcelas > 1 && (
                            <div className="flex justify-between">
                              <span>Parcelas:</span>
                              <span className="font-medium">
                                {pagamento.parcelas}x de {formatCurrency(pagamento.valorParcela)}
                              </span>
                            </div>
                          )}
                          
                          {pagamento.troco > 0 && (
                            <div className="flex justify-between">
                              <span>Troco:</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(pagamento.troco)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">Dados de pagamento não disponíveis</div>
                    )}
                    
                    {paymentData?.pagamentos && paymentData.pagamentos.length > 1 && (
                      <div className="border-t border-blue-300 pt-2 flex justify-between font-bold">
                        <span>Total pago:</span>
                        <span>{formatCurrency(paymentData.totalPago || 0)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Opções */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Opções</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printReceipt}
                        onChange={(e) => setPrintReceipt(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <FiPrinter className="w-4 h-4 text-gray-600" />
                        <span>Imprimir recibo</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={generateNFe}
                        onChange={(e) => setGenerateNFe(e.target.checked)}
                        disabled={loadingPermissions || (!permissions.nfeAtivo && !permissions.nfceAtivo && !permissions.nfseAtivo)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <FiFileText className="w-4 h-4 text-gray-600" />
                        <span>Gerar Nota Fiscal Eletrônica</span>
                      </div>
                    </label>
                    {(!permissions.nfeAtivo && !permissions.nfceAtivo && !permissions.nfseAtivo) && (
                      <p className="text-xs text-red-600 dark:text-red-400 ml-7">
                        Ative NFe, NFCe ou NFS-e em Integrações → Nota Fiscal → Permissões de Emissão.
                      </p>
                    )}
 
                     {/* Tipo de Nota Fiscal */}
                     {generateNFe && (
                       <div className="ml-7 mt-3 p-3 bg-blue-50 rounded-lg">
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Tipo de Nota Fiscal
                         </label>
                         <div className="flex flex-wrap gap-4">
                           <label className="flex items-center gap-2 cursor-pointer">
                             <input
                               type="radio"
                               name="nfeType"
                               value="nfce"
                               checked={nfeType === 'nfce'}
                               onChange={(e) => handleNfeTypeChange(e.target.value)}
                               disabled={!permissions.nfceAtivo}
                               className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                             />
                             <span className="text-sm">NFCe (Consumidor)</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                             <input
                               type="radio"
                               name="nfeType"
                               value="nfe"
                               checked={nfeType === 'nfe'}
                               onChange={(e) => handleNfeTypeChange(e.target.value)}
                               disabled={!permissions.nfeAtivo}
                               className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                             />
                             <span className="text-sm">NF-e (Empresa)</span>
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer">
                             <input
                               type="radio"
                               name="nfeType"
                               value="nfse"
                               checked={nfeType === 'nfse'}
                               onChange={(e) => handleNfeTypeChange(e.target.value)}
                               disabled={!permissions.nfseAtivo}
                               className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                             />
                             <span className="text-sm">NFS-e (Serviço)</span>
                           </label>
                         </div>
                        
                        {/* Opções Avançadas baseadas no manual.md */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Opções Avançadas</h5>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Formato de Impressão */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Formato Impressão (tpImp)
                              </label>
                              <select
                                value={nfeOptions.tpImp}
                                onChange={(e) => setNfeOptions(prev => ({...prev, tpImp: parseInt(e.target.value)}))}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              >
                                <option value={0}>0 - Sem DANFE</option>
                                <option value={1}>1 - DANFe Retrato</option>
                                <option value={2}>2 - DANFe Paisagem</option>
                                <option value={3}>3 - DANFe Simplificado</option>
                                <option value={4}>4 - DANFe NFC-e</option>
                                <option value={5}>5 - DANFe NFC-e em mensagem eletrônica</option>
                              </select>
                            </div>

                            {/* Presença do Comprador */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Presença Comprador (indPres)
                              </label>
                              <select
                                value={nfeOptions.indPres}
                                onChange={(e) => setNfeOptions(prev => ({...prev, indPres: parseInt(e.target.value)}))}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              >
                                <option value={0}>0 - Não se aplica</option>
                                <option value={1}>1 - Operação presencial</option>
                                <option value={2}>2 - Não presencial, internet</option>
                                <option value={3}>3 - Não presencial, teleatendimento</option>
                                <option value={4}>4 - NFC-e entrega em domicílio</option>
                                <option value={5}>5 - Operação presencial, fora do estabelecimento</option>
                                <option value={9}>9 - Não presencial, outros</option>
                              </select>
                            </div>

                            {/* Finalidade da NF */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Finalidade (finNFe)
                              </label>
                              <select
                                value={nfeOptions.finNFe}
                                onChange={(e) => setNfeOptions(prev => ({...prev, finNFe: parseInt(e.target.value)}))}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              >
                                <option value={1}>1 - NFe normal</option>
                                <option value={2}>2 - NFe complementar</option>
                                <option value={3}>3 - NFe de ajuste</option>
                                <option value={4}>4 - Devolução/Retorno</option>
                                <option value={5}>5 - Nota de crédito</option>
                                <option value={6}>6 - Nota de débito</option>
                              </select>
                            </div>

                            {/* Local de Destino */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Local Destino (idDest)
                              </label>
                              <select
                                value={nfeOptions.idDest}
                                onChange={(e) => setNfeOptions(prev => ({...prev, idDest: parseInt(e.target.value)}))}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              >
                                <option value={1}>1 - Interna</option>
                                <option value={2}>2 - Interestadual</option>
                                <option value={3}>3 - Exterior</option>
                              </select>
                            </div>

                            {/* Modalidade do Frete */}
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Modalidade Frete (modFrete)
                              </label>
                              <select
                                value={nfeOptions.modFrete}
                                onChange={(e) => setNfeOptions(prev => ({...prev, modFrete: parseInt(e.target.value)}))}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              >
                                <option value={0}>0 - Por conta do emitente</option>
                                <option value={1}>1 - Por conta do destinatário</option>
                                <option value={2}>2 - Por conta de terceiros</option>
                                <option value={3}>3 - Transporte próprio por conta do remetente</option>
                                <option value={4}>4 - Transporte próprio por conta do destinatário</option>
                                <option value={9}>9 - Sem frete</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dados do Cliente */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FiUser className="w-5 h-5" />
                    Dados do Cliente {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type="text"
                          value={customerData.nome}
                          onChange={(e) => handleCustomerChange('nome', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nome completo"
                          required={isCustomerDataRequired()}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Pessoa {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                        </label>
                        <select
                          value={customerData.tipoPessoa}
                          onChange={(e) => {
                            handleCustomerChange('tipoPessoa', e.target.value);
                            handleCustomerChange('cpfCnpj', ''); // Limpa o campo ao trocar tipo
                            handleCustomerChange('inscricaoEstadual', ''); // Limpa IE
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={isCustomerDataRequired()}
                        >
                          <option value="fisica">Pessoa Física</option>
                          <option value="juridica">Pessoa Jurídica</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {customerData.tipoPessoa === 'fisica' ? 'CPF' : 'CNPJ'} {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formatCpfCnpj(customerData.cpfCnpj)}
                            onChange={(e) => handleCpfCnpjChange(e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={customerData.tipoPessoa === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                            required={isCustomerDataRequired()}
                          />
                          
                        </div>
                        
                      </div>
                      
                      {/* Inscrição Estadual - só para pessoa jurídica */}
                      {customerData.tipoPessoa === 'juridica' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Inscrição Estadual
                          </label>
                          <input
                            type="text"
                            value={customerData.inscricaoEstadual}
                            onChange={(e) => handleCustomerChange('inscricaoEstadual', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="000.000.000.000"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={customerData.email}
                          onChange={(e) => handleCustomerChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="email@exemplo.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={customerData.telefone}
                          onChange={(e) => handleCustomerChange('telefone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                    
                    {generateNFe && (
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h5 className="font-medium text-gray-900 flex items-center gap-2">
                          <FiMapPin className="w-4 h-4" />
                          Endereço {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                        </h5>
                        
                        {/* CEP primeiro */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CEP {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formatCep(customerData.endereco.cep)}
                              onChange={(e) => handleCepChange(e.target.value)}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="00000-000"
                              maxLength={9}
                              required={isCustomerDataRequired()}
                            />
                            
                          </div>
                          
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Logradouro {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type="text"
                              value={customerData.endereco.logradouro}
                              onChange={(e) => handleCustomerChange('endereco.logradouro', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Logradouro"
                              required={isCustomerDataRequired()}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Número {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type="text"
                              value={customerData.endereco.numero}
                              onChange={(e) => handleCustomerChange('endereco.numero', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Número"
                              required={isCustomerDataRequired()}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bairro {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type="text"
                              value={customerData.endereco.bairro}
                              onChange={(e) => handleCustomerChange('endereco.bairro', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Bairro"
                              required={isCustomerDataRequired()}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cidade {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type="text"
                              value={customerData.endereco.cidade}
                              onChange={(e) => handleCustomerChange('endereco.cidade', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Cidade"
                              required={isCustomerDataRequired()}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              UF {isCustomerDataRequired() && <span className="text-red-500">*</span>}
                            </label>
                            <input
                              type="text"
                              value={customerData.endereco.uf}
                              onChange={(e) => handleCustomerChange('endereco.uf', e.target.value.toUpperCase())}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="UF"
                              maxLength={2}
                              required={isCustomerDataRequired()}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Código Município (opcional)
                            </label>
                            <input
                              type="text"
                              value={customerData.endereco.codigoMunicipio}
                              onChange={(e) => handleCustomerChange('endereco.codigoMunicipio', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="5201405 (padrão: Aparecida de Goiânia)"
                              maxLength={7}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Observações adicionais sobre a venda..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || (isCustomerDataRequired() && (!customerData.nome || !customerData.cpfCnpj))}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCheck className="w-5 h-5" />
              )}
              {loading ? 'Finalizando...' : 'Finalizar Venda'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SaleConfirmationModal;