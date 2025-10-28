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

const PrintReceiptModal = ({ 
  isOpen, 
  onClose, 
  saleData,
  paymentData,
  customerData,
  cartItems = [],
  onPrint,
  onDownload
}) => {
  const [printOptions, setPrintOptions] = useState({
    copies: 1,
    includeCustomer: true,
    includePayment: true,
    includeVendedor: true, // ✅ ADICIONADO: Opção para mostrar vendedor
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
      // Lidar com diferentes tipos de timestamp
      let dateObj;
      if (date?.seconds) {
        // Firestore timestamp
        dateObj = new Date(date.seconds * 1000);
      } else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        dateObj = new Date();
      }
      
      // Verificar se a data é válida
      if (isNaN(dateObj.getTime())) {
        console.warn('Data inválida fornecida para formatDate:', date);
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
      console.warn('Erro ao formatar data:', error, date);
      return new Date().toLocaleDateString('pt-BR');
    }
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

  const handlePrint = async () => {
    setLoading(true);
    try {
      const receiptData = {
        sale: saleData,
        payment: paymentData,
        customer: customerData,
        items: cartItems,
        options: printOptions,
        timestamp: new Date().toISOString()
      };
      
      await onPrint(receiptData);
    } catch (error) {
      console.error('Erro ao imprimir:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const receiptData = {
        sale: saleData,
        payment: paymentData,
        customer: customerData,
        items: cartItems,
        options: printOptions,
        timestamp: new Date().toISOString()
      };
      
      await onDownload(receiptData);
    } catch (error) {
      console.error('Erro ao baixar:', error);
    } finally {
      setLoading(false);
    }
  };

  const ReceiptPreview = () => (
    <div 
      ref={receiptRef}
      className={clsx(
        'bg-white border border-gray-300 mx-auto',
        printOptions.paperSize === 'thermal' ? 'w-72' : 'w-full max-w-md',
        printOptions.fontSize === 'small' ? 'text-xs' : 
        printOptions.fontSize === 'large' ? 'text-sm' : 'text-xs'
      )}
      style={{ fontFamily: 'monospace' }}
    >
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="text-center border-b border-dashed border-gray-400 pb-3">
          <div className="font-bold text-lg">ACADEMIA PLAY FIT II</div>
          <div className="text-xs mt-1">
            CNPJ: 57673794000171<br/>
            Logradouro: Avenida C, S/N Complemento: Quadrab3 Lote 17E<br/>
            Bairro: Jardim Boa Esperança - Continuação CEP: 74960-302<br/>
            Município: Aparecida de Goiânia Estado: Goiás<br/>
            Tel: (62) 99192-0954
          </div>
        </div>

        {/* Sale Info */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Data/Hora:</span>
            <span>{formatDate(saleData?.timestamp || new Date())}</span>
          </div>
          <div className="flex justify-between">
            <span>Comprovante:</span>
            <span>#{saleData?.id || '000001'}</span>
          </div>
          {printOptions.includeVendedor && saleData?.vendedor && (
            <div className="flex justify-between">
              <span>Vendedor:</span>
              <span>{saleData.vendedor}</span>
            </div>
          )}
        </div>

        {/* Customer Info */}
        {printOptions.includeCustomer && customerData?.nome && (
          <div className="border-t border-dashed border-gray-400 pt-3">
            <div className="font-bold mb-1">CLIENTE:</div>
            <div>{customerData.nome}</div>
            {customerData.cpf && <div>CPF: {customerData.cpf}</div>}
            {customerData.telefone && <div>Tel: {customerData.telefone}</div>}
          </div>
        )}

        {/* Items */}
        <div className="border-t border-dashed border-gray-400 pt-3">
          <div className="font-bold mb-2">ITENS:</div>
          {cartItems.map((item, index) => (
            <div key={`receipt-item-${item.id || item.codigo || index}-${item.nome}`} className="mb-2">
              <div className="flex justify-between">
                <span className="flex-1">{item.nome}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>{item.quantidade} x {formatCurrency(item.preco)}</span>
                <span>{formatCurrency(item.quantidade * item.preco)}</span>
              </div>
              {item.codigo && (
                <div className="text-xs text-gray-600">Cód: {item.codigo}</div>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-dashed border-gray-400 pt-3">
          <div className="flex justify-between">
            <span>Quant. Itens:</span>
            <span>{cartItems.reduce((sum, item) => sum + item.quantidade, 0)}</span>
          </div>
          {saleData?.desconto > 0 && (
            <div className="flex justify-between">
              <span>Desconto:</span>
              <span>-{formatCurrency(saleData.desconto)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t border-solid border-gray-400 pt-1 mt-1">
            <span>TOTAL:</span>
            <span>{formatCurrency(saleData?.total || 0)}</span>
          </div>
        </div>

        {/* Payment Info */}
        {printOptions.includePayment && paymentData && paymentData.pagamentos && (
          <div className="border-t border-dashed border-gray-400 pt-3">
            <div className="font-bold mb-1">DADOS DO PAGAMENTO:</div>
            {paymentData.pagamentos.map((pagamento, index) => (
              <div key={`payment-${index}-${pagamento.metodo || 'unknown'}-${pagamento.valor}`} className="mb-2">
                <div className="flex justify-between">
                  <span>Método:</span>
                  <span>{formatPaymentMethod(pagamento.metodo)} - {formatCurrency(pagamento.valor)}</span>
                </div>
                {pagamento.parcelas > 1 && (
                  <div className="flex justify-between">
                    <span>Parcelas:</span>
                    <span>{pagamento.parcelas}x</span>
                  </div>
                )}
                {pagamento.troco > 0 && (
                  <div className="flex justify-between">
                    <span>Troco:</span>
                    <span>{formatCurrency(pagamento.troco)}</span>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
              <span>Total Pago:</span>
              <span>{formatCurrency(paymentData.totalPago)}</span>
            </div>
          </div>
        )}

        {/* Barcode */}
        {printOptions.includeBarcode && (
          <div className="border-t border-dashed border-gray-400 pt-3 text-center">
            <div className="font-mono text-xs mb-1">
              {saleData?.id || '000001'}
            </div>
            <div className="h-8 bg-black bg-opacity-80 flex items-end justify-center">
              <div className="text-white text-xs">||||| |||| |||||</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-dashed border-gray-400 pt-3 text-center text-xs">
          <div>Obrigado pela preferência!</div>
          <div className="mt-2">
            {formatDate(new Date())}
          </div>
          <div className="mt-2">- - - CORTE AQUI - - -</div>
        </div>
      </div>
    </div>
  );

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
                Imprimir Recibo
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Configure as opções de impressão
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
              {/* Configurações */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <FiSettings className="w-5 h-5" />
                    Configurações de Impressão
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Número de cópias */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de cópias
                      </label>
                      <select
                        value={printOptions.copies}
                        onChange={(e) => setPrintOptions(prev => ({
                          ...prev,
                          copies: parseInt(e.target.value)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} cópia{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tamanho do papel */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho do papel
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setPrintOptions(prev => ({ ...prev, paperSize: 'thermal' }))}
                          className={clsx(
                            'px-3 py-2 rounded-lg border-2 transition-colors text-sm',
                            printOptions.paperSize === 'thermal'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          )}
                        >
                          Térmica (80mm)
                        </button>
                        <button
                          onClick={() => setPrintOptions(prev => ({ ...prev, paperSize: 'a4' }))}
                          className={clsx(
                            'px-3 py-2 rounded-lg border-2 transition-colors text-sm',
                            printOptions.paperSize === 'a4'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          )}
                        >
                          A4
                        </button>
                      </div>
                    </div>

                    {/* Tamanho da fonte */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho da fonte
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['small', 'normal', 'large'].map(size => (
                          <button
                            key={size}
                            onClick={() => setPrintOptions(prev => ({ ...prev, fontSize: size }))}
                            className={clsx(
                              'px-3 py-2 rounded-lg border-2 transition-colors text-sm capitalize',
                              printOptions.fontSize === size
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            )}
                          >
                            {size === 'small' ? 'Pequena' : size === 'normal' ? 'Normal' : 'Grande'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Opções adicionais */}
                    <div className="space-y-3">
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
                        <span className="text-sm">Incluir dados do cliente</span>
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
                        <span className="text-sm">Incluir dados do pagamento</span>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={printOptions.includeVendedor}
                          onChange={(e) => setPrintOptions(prev => ({
                            ...prev,
                            includeVendedor: e.target.checked
                          }))}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm">Incluir dados do vendedor</span>
                      </label>
                      
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={printOptions.includeBarcode}
                          onChange={(e) => setPrintOptions(prev => ({
                            ...prev,
                            includeBarcode: e.target.checked
                          }))}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm">Incluir código de barras</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-3">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <FiEye className="w-5 h-5" />
                    {previewMode ? 'Ocultar Preview' : 'Visualizar Preview'}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleDownload}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      {loading ? (
                        <FiRefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <FiDownload className="w-5 h-5" />
                      )}
                      Baixar PDF
                    </button>
                    
                    <button
                      onClick={handlePrint}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    >
                      {loading ? (
                        <FiRefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <FiPrinter className="w-5 h-5" />
                      )}
                      Imprimir
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <FiEye className="w-5 h-5" />
                  Preview do Cupom
                </h4>
                
                {previewMode ? (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto max-h-96">
                    <ReceiptPreview />
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-8 bg-gray-50 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <FiEye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Clique em "Visualizar Preview" para ver o cupom</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrintReceiptModal;