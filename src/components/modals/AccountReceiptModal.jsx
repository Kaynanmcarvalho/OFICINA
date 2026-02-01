import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiPrinter, 
  FiDownload, 
  FiEye,
  FiSettings,
  FiCheck,
  FiRefreshCw
} from 'react-icons/fi';
import { clsx } from 'clsx';
import accountPrintService from '../../config/accountPrintService';

const AccountReceiptModal = ({ 
  isOpen, 
  onClose, 
  account,
  onPrint,
  onDownload
}) => {
  const [printOptions, setPrintOptions] = useState({
    copies: 1,
    includeCustomer: true,
    includePayment: true,
    includeBarcode: false,
    paperSize: 'thermal', // thermal, a4
    fontSize: 'normal' // small, normal, large
  });
  
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const receiptRef = useRef(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return new Date().toLocaleDateString('pt-BR');
    
    try {
      let dateObj;
      if (date?.seconds) {
        dateObj = new Date(date.seconds * 1000);
      } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date();
      }
      
      if (isNaN(dateObj.getTime())) {
        return new Date().toLocaleDateString('pt-BR');
      }
      
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch (error) {
      return new Date().toLocaleDateString('pt-BR');
    }
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      'pix': 'PIX',
      'debito': 'Cartão de Débito',
      'credito': 'Cartão de Crédito',
      'desconto_salario': 'Desconto em Salário',
      'boleto': 'Boleto',
      'vale': 'Vale',
      'dinheiro': 'Dinheiro',
      'transferencia': 'Transferência'
    };
    return methods[method] || method || 'Não informado';
  };

  const handlePrint = async () => {
    setLoading(true);
    try {
      const receiptData = {
        account: account,
        options: printOptions,
        timestamp: new Date().toISOString()
      };
      
      if (onPrint) {
        await onPrint(receiptData);
      } else {
        // Usar serviço de impressão padrão
        const result = await accountPrintService.printAccountReceipt(receiptData);
        if (result.success) {
          } else {
          console.error('❌ Erro ao imprimir recibo:', result.message);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao imprimir recibo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const receiptData = {
        account: account,
        options: printOptions,
        timestamp: new Date().toISOString()
      };
      
      if (onDownload) {
        await onDownload(receiptData);
      } else {
        // Usar serviço de download padrão
        const result = await accountPrintService.downloadAccountReceipt(receiptData);
        if (result.success) {
          } else {
          console.error('❌ Erro ao baixar recibo:', result.message);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao baixar recibo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !account) return null;

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recibo da Conta</h2>
              <p className="text-sm text-gray-600 mt-1">
                {account.tipo === 'receber' ? 'Conta a Receber' : 'Conta a Pagar'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Preview */}
            <div className="flex-1 p-6 bg-gray-50">
              <div className="bg-white rounded-lg shadow-sm p-6 max-w-sm mx-auto" ref={receiptRef}>
                {/* Header do Recibo */}
                <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
                  <h3 className="font-bold text-lg">PLAY FIT</h3>
                  <p className="text-xs text-gray-600">Recibo de Conta</p>
                  <p className="text-xs text-gray-500">{formatDate(new Date())}</p>
                </div>

                {/* Informações da Conta */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-medium">
                      {account.tipo === 'receber' ? 'A Receber' : 'A Pagar'}
                    </span>
                  </div>
                  
                  {printOptions.includeCustomer && (
                    <div className="flex justify-between">
                      <span>{account.tipo === 'receber' ? 'Cliente:' : 'Fornecedor:'}</span>
                      <span className="font-medium">
                        {account.tipo === 'receber' 
                          ? (account.cliente || 'Não informado') 
                          : (account.fornecedor || 'Não informado')
                        }
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Descrição:</span>
                    <span className="font-medium">{account.nome}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Vencimento:</span>
                    <span>{formatDate(account.dataVencimento)}</span>
                  </div>
                  
                  {account.categoria && (
                    <div className="flex justify-between">
                      <span>Categoria:</span>
                      <span>{account.categoria}</span>
                    </div>
                  )}
                </div>

                {/* Valor */}
                <div className="border-t border-dashed border-gray-400 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>VALOR:</span>
                    <span>{formatCurrency(account.valor)}</span>
                  </div>
                </div>

                {/* Informações de Pagamento */}
                {printOptions.includePayment && account.formaPagamento && (
                  <div className="border-t border-dashed border-gray-400 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span>Forma de Pagamento:</span>
                      <span>{formatPaymentMethod(account.formaPagamento)}</span>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="border-t border-dashed border-gray-400 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={clsx(
                      'font-medium',
                      account.status === 'pago' ? 'text-green-600' : 'text-orange-600'
                    )}>
                      {account.status === 'pago' ? 'PAGO' : 'PENDENTE'}
                    </span>
                  </div>
                  
                  {account.status === 'pago' && account.dataPagamento && (
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Pago em:</span>
                      <span>{formatDate(account.dataPagamento)}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 mt-4 pt-3 border-t border-dashed border-gray-400">
                  <p>Obrigado pela preferência!</p>
                  <p>Este é um recibo gerado automaticamente</p>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="w-full lg:w-80 p-6 border-l border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Opções de Impressão</h3>
              
              <div className="space-y-4">
                {/* Copies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Cópias
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={printOptions.copies}
                    onChange={(e) => setPrintOptions(prev => ({
                      ...prev,
                      copies: parseInt(e.target.value) || 1
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Include Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Incluir no Recibo</h4>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={printOptions.includeCustomer}
                      onChange={(e) => setPrintOptions(prev => ({
                        ...prev,
                        includeCustomer: e.target.checked
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Dados do {account.tipo === 'receber' ? 'cliente' : 'fornecedor'}</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={printOptions.includePayment}
                      onChange={(e) => setPrintOptions(prev => ({
                        ...prev,
                        includePayment: e.target.checked
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Forma de pagamento</span>
                  </label>
                </div>

                {/* Paper Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho do Papel
                  </label>
                  <select
                    value={printOptions.paperSize}
                    onChange={(e) => setPrintOptions(prev => ({
                      ...prev,
                      paperSize: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="thermal">Térmica (80mm)</option>
                    <option value="a4">A4</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamanho da Fonte
                  </label>
                  <select
                    value={printOptions.fontSize}
                    onChange={(e) => setPrintOptions(prev => ({
                      ...prev,
                      fontSize: e.target.value
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="small">Pequena</option>
                    <option value="normal">Normal</option>
                    <option value="large">Grande</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handlePrint}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {loading ? <FiRefreshCw className="animate-spin" size={16} /> : <FiPrinter size={16} />}
                  {loading ? 'Imprimindo...' : 'Imprimir'}
                </button>
                
                <button
                  onClick={handleDownload}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {loading ? <FiRefreshCw className="animate-spin" size={16} /> : <FiDownload size={16} />}
                  {loading ? 'Baixando...' : 'Baixar PDF'}
                </button>
                
                <button
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FiX size={16} />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccountReceiptModal;