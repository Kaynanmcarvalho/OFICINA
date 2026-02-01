import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiFileText, FiLoader, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { nfGenerationService } from '../../config/nfGenerationService';
import nfUsageService from '../../config/nfUsageService';

const NFGenerationModal = ({ 
  isOpen, 
  onClose, 
  saleData, 
  user, 
  products = [], 
  onSuccess,
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nfData, setNfData] = useState(null);

  const handleGenerateNF = async () => {
    if (!saleData) {
      setError('Dados da venda não encontrados');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validar dados da venda
      const validation = nfGenerationService.validateSaleData(saleData);
      if (!validation.isValid) {
        setError(`Dados inválidos: ${validation.errors.join(', ')}`);
        return;
      }

      // Gerar NF usando o serviço centralizado
      const result = await nfGenerationService.generateNF(saleData, user, products);
      
      if (result.success) {
        setNfData(result.data);
        setSuccess(result.message);
        
        // Registrar uso da NF no Firestore para controle
        try {
          const nfType = result.data.tipo || (result.data.modelo === '65' ? 'nfce' : 'nfe');
          const usageResult = await nfUsageService.registerNFUsage(result.data, user, nfType);
          
          if (usageResult.success) {
            } else {
            }
        } catch (usageError) {
          console.error('❌ [NF USAGE] Erro ao registrar uso:', usageError);
          // Não interromper o fluxo principal se o controle de uso falhar
        }
        
        // Chamar callback de sucesso se fornecido
        if (onSuccess) {
          onSuccess(result.data);
        }
      } else {
        setError(`Erro ao gerar NF: ${result.error}`);
        
        // Chamar callback de erro se fornecido
        if (onError) {
          onError(result.error);
        }
      }
      
    } catch (error) {
      console.error('Erro ao gerar NF:', error);
      const errorMessage = `Erro inesperado: ${error.message}`;
      setError(errorMessage);
      
      // Chamar callback de erro se fornecido
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setNfData(null);
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiFileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Gerar Nota Fiscal
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Mensagens de erro e sucesso */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
              >
                <FiAlertTriangle className="text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
              >
                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                <span className="text-green-700 text-sm">{success}</span>
              </motion.div>
            )}

            {/* Dados da venda */}
            {saleData && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Dados da Venda</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Número:</span>
                      <p className="font-medium">{saleData.numero || saleData.id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Valor Total:</span>
                      <p className="font-medium">{formatCurrency(saleData.total)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Cliente:</span>
                      <p className="font-medium">{saleData.customer?.nome || 'CONSUMIDOR FINAL'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Forma de Pagamento:</span>
                      <p className="font-medium capitalize">
                        {saleData.paymentMethod?.replace('_', ' ') || 'Não informado'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Itens da venda */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Itens ({saleData.items?.length || 0})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {saleData.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                        <span className="font-medium">{item.nome || item.descricao}</span>
                        <span className="text-gray-600">
                          {item.quantidade}x {formatCurrency(item.preco)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dados da NF gerada */}
                {nfData && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3">Nota Fiscal Gerada</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Número/Série:</span>
                        <p className="font-medium text-blue-900">{nfData.numero}/{nfData.serie}</p>
                      </div>
                      <div>
                        <span className="text-blue-700">Status:</span>
                        <p className="font-medium text-blue-900">{nfData.status}</p>
                      </div>
                      {nfData.chave_acesso && (
                        <div className="col-span-2">
                          <span className="text-blue-700">Chave de Acesso:</span>
                          <p className="font-mono text-xs text-blue-900 break-all">{nfData.chave_acesso}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              {nfData ? 'Fechar' : 'Cancelar'}
            </button>
            
            {!nfData && (
              <button
                onClick={handleGenerateNF}
                disabled={loading || !saleData}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FiFileText className="w-4 h-4" />
                    Gerar Nota Fiscal
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NFGenerationModal;