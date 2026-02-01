import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiInfo, FiDollarSign, FiWifi, FiWifiOff, FiAlertCircle } from 'react-icons/fi';
import taxCalculationService from '../../config/taxCalculationService';
import { useAuthStore } from '../../store';

const TaxPreviewModal = ({ isOpen, onClose, onConfirm, saleData, clearCart }) => {
  const { user: currentUser } = useAuthStore();
  const [taxCalculation, setTaxCalculation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ibptStatus, setIbptStatus] = useState(null);

  useEffect(() => {
    if (isOpen && saleData) {
      calculateTaxes();
    }
  }, [isOpen, saleData]);

  const calculateTaxes = async () => {
    setLoading(true);
    setError(null);
    setIbptStatus(null);
    
    try {
      // Preparar dados dos itens
      const itens = saleData.items?.map(item => ({
        nome: item.name || item.nome,
        preco: parseFloat(item.price || item.preco) || 0,
        quantidade: parseInt(item.quantity || item.quantidade) || 1,
        categoria: item.category || item.categoria || 'Geral',
        ncm: item.ncm || null
      })) || [];
      
      // Dados do cliente (se disponível)
      const cliente = {
        nome: saleData.customer?.name || saleData.cliente?.nome || 'Cliente não identificado',
        cpf: saleData.customer?.cpf || saleData.cliente?.cpf || '',
        uf: saleData.customer?.uf || saleData.cliente?.uf || 'SP'
      };
      
      const resultado = await taxCalculationService.calcularImpostos(itens, cliente, currentUser?.uid);
      setTaxCalculation(resultado);
      
      // Verificar se IBPT foi usado
      const usouIbpt = resultado.itens.some(item => item.fonte === 'IBPT');
      setIbptStatus({
        ativo: resultado.configuracao?.ibptAtivo || false,
        usado: usouIbpt,
        itensComIbpt: resultado.itens.filter(item => item.fonte === 'IBPT').length,
        totalItens: resultado.itens.length
      });
      
      } catch (err) {
      console.error('❌ Erro ao calcular impostos:', err);
      setError('Erro ao calcular impostos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatPercentage = (value) => {
    const numValue = Number(value) || 0;
    return `${numValue.toFixed(2)}%`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FiDollarSign className="text-blue-600 text-xl" />
            <h2 className="text-xl font-semibold text-gray-900">
              Pré-visualização de Impostos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status IBPT */}
          {ibptStatus && (
            <div className={`rounded-lg p-4 border ${
              ibptStatus.ativo 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-2">
                {ibptStatus.ativo ? (
                  <FiWifi className="text-green-600" />
                ) : (
                  <FiWifiOff className="text-yellow-600" />
                )}
                <span className={`font-medium ${
                  ibptStatus.ativo ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {ibptStatus.ativo ? 'IBPT Ativo' : 'IBPT Inativo'}
                </span>
              </div>
              {ibptStatus.ativo && (
                <div className="text-sm mt-1 text-green-700">
                  {ibptStatus.itensComIbpt} de {ibptStatus.totalItens} itens calculados via IBPT
                </div>
              )}
              {!ibptStatus.ativo && (
                <div className="text-sm mt-1 text-yellow-700">
                  Usando configurações tributárias manuais
                </div>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Calculando impostos...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <FiAlertCircle className="text-red-600" />
                <span className="font-medium text-red-800">Erro no Cálculo</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Resumo da Venda */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Resumo da Venda</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium ml-2">{formatCurrency(taxCalculation?.totais?.produtos || saleData?.subtotal)}</span>
              </div>
              <div>
                <span className="text-gray-600">Desconto:</span>
                <span className="font-medium ml-2">{formatCurrency(saleData?.discount)}</span>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="font-medium ml-2">{formatCurrency(taxCalculation?.totais?.venda || saleData?.total)}</span>
              </div>
              <div>
                <span className="text-gray-600">Itens:</span>
                <span className="font-medium ml-2">{saleData?.items?.length || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">Regime:</span>
                <span className="font-medium ml-2">
                  {taxCalculation?.configuracao?.regimeTributario === 'simples_nacional' 
                    ? 'Simples Nacional' 
                    : 'Lucro Presumido'
                  }
                </span>
              </div>
              <div>
                <span className="text-gray-600">UF:</span>
                <span className="font-medium ml-2">{taxCalculation?.configuracao?.uf || 'SP'}</span>
              </div>
            </div>
          </div>

          {/* Cálculo de Impostos */}
          {taxCalculation && !loading && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <FiInfo className="mr-2 text-blue-600" />
                Cálculo de Impostos
              </h3>
              
              {/* ICMS */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">ICMS</span>
                  <span className="text-sm text-gray-500">
                    {formatPercentage(taxCalculation?.percentuais?.icms)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base de Cálculo:</span>
                  <span>{formatCurrency(taxCalculation?.totais?.produtos)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600">Valor do ICMS:</span>
                  <span>{formatCurrency(taxCalculation?.totais?.icms)}</span>
                </div>
                {taxCalculation?.configuracao?.regimeTributario === 'simples_nacional' && (
                  <div className="text-xs text-gray-500 mt-1">
                    CSOSN 102 - Simples Nacional sem permissão de crédito
                  </div>
                )}
              </div>

              {/* PIS */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">PIS</span>
                  <span className="text-sm text-gray-500">
                    {formatPercentage(taxCalculation?.percentuais?.pis)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base de Cálculo:</span>
                  <span>{formatCurrency(taxCalculation?.totais?.produtos)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600">Valor do PIS:</span>
                  <span>{formatCurrency(taxCalculation?.totais?.pis)}</span>
                </div>
              </div>

              {/* COFINS */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">COFINS</span>
                  <span className="text-sm text-gray-500">
                    {formatPercentage(taxCalculation?.percentuais?.cofins)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base de Cálculo:</span>
                  <span>{formatCurrency(taxCalculation?.totais?.produtos)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600">Valor do COFINS:</span>
                  <span>{formatCurrency(taxCalculation?.totais?.cofins)}</span>
                </div>
              </div>

              {/* IPI */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">IPI</span>
                  <span className="text-sm text-gray-500">
                    {formatPercentage(taxCalculation?.percentuais?.ipi)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base de Cálculo:</span>
                  <span>{formatCurrency(taxCalculation?.totais?.produtos)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600">Valor do IPI:</span>
                  <span>{formatCurrency(taxCalculation?.totais?.ipi)}</span>
                </div>
              </div>

              {/* Total de Impostos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-blue-900">Total de Impostos:</span>
                  <span className="font-bold text-blue-900 text-lg">
                    {formatCurrency(taxCalculation?.totais?.impostos)}
                  </span>
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  {formatPercentage(taxCalculation?.percentuais?.total)} do valor total
                </div>
              </div>

              {/* Detalhes por Item */}
              {taxCalculation?.itens?.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Detalhes por Item</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {taxCalculation.itens.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-b-0">
                        <div>
                          <span className="font-medium">{item.produto}</span>
                          {item.ncm && item.ncm !== 'Não informado' && (
                            <span className="text-gray-500 ml-2">NCM: {item.ncm}</span>
                          )}
                          <div className="text-xs text-gray-500">
                            Fonte: {item.fonte} | Qtd: {item.quantidade}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.valorTotal)}</div>
                          <div className="text-xs text-gray-500">
                            Impostos: {formatCurrency(item.impostos?.total || 0)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Observações */}
          {taxCalculation && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Observações:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {taxCalculation.observacoes?.map((obs, index) => (
                  <li key={index}>• {obs}</li>
                ))}
                {taxCalculation.configuracao?.regimeTributario === 'simples_nacional' && (
                  <>
                    <li>• CFOP padrão: 5102 (Venda dentro do estado) / 6108 (Venda fora do estado)</li>
                    <li>• CSOSN ICMS: 102 (Simples Nacional sem permissão de crédito)</li>
                    <li>• CNAE: 93.13-1-00 - Atividades de condicionamento físico</li>
                  </>
                )}
                <li>• Verifique as configurações de NF antes de prosseguir</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              if (onConfirm && taxCalculation) {
                await onConfirm(taxCalculation);
                if (clearCart) {
                  clearCart();
                }
              }
            }}
            disabled={loading || error || !taxCalculation}
            className={`px-6 py-2 rounded-lg transition-colors ${
              loading || error || !taxCalculation
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Calculando...' : 'Gerar Nota Fiscal'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaxPreviewModal;