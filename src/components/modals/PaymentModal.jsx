import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiCreditCard, 
  FiDollarSign, 
  FiSmartphone,
  FiCheck,
  FiPercent,
  FiAlertTriangle
} from 'react-icons/fi';
import { clsx } from 'clsx';
import configService from '../../config/configService';
import { useAuthStore } from '../../store';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  total, 
  cartItems = [],
  saleData = {} 
}) => {
  const [selectedPayment, setSelectedPayment] = useState('dinheiro');
  const [valorRecebido, setValorRecebido] = useState('');
  const [parcelas, setParcelas] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagamentos, setPagamentos] = useState([]);
  const [valorRestante, setValorRestante] = useState(0);
  const [isMultiplePayments, setIsMultiplePayments] = useState(false);
  const [desconto, setDesconto] = useState(0);
  const [descontoMaximo, setDescontoMaximo] = useState(50);
  const [descontoError, setDescontoError] = useState('');
  
  // Estados para campos de cartão
  const [cardData, setCardData] = useState({
    tBand: '', // Bandeira do cartão
    tpIntegra: '2', // Tipo de integração (2 = não integrado por padrão)
    cAut: '' // Código de autorização
  });
  
  const { user: currentUser } = useAuthStore();
  
  // Calcular total com desconto
  const subtotal = cartItems.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const totalComDesconto = subtotal - desconto;
  
  // Carregar configuração de desconto máximo
  useEffect(() => {
    const loadConfig = async () => {
      if (isOpen && currentUser) {
        try {
          const config = await configService.getConfig(currentUser.uid);
          setDescontoMaximo(config.descontoMaximo || 50);
        } catch (error) {
          console.error('Erro ao carregar configuração:', error);
          setDescontoMaximo(50); // Valor padrão
        }
      }
    };
    
    loadConfig();
  }, [isOpen, currentUser]);

  // Inicializar valorRestante quando o modal abrir
  React.useEffect(() => {
    if (isOpen) {
      setValorRestante(totalComDesconto);
      setDescontoError(''); // Reset erro de desconto
    }
  }, [isOpen, totalComDesconto]);

  // Função para validar campos do cartão
  const isCardDataValid = () => {
    if (selectedPayment === 'cartao_credito' || selectedPayment === 'cartao_debito') {
      return cardData.tBand && cardData.cAut.trim();
    }
    return true;
  };

  const paymentMethods = [
    {
      id: 'dinheiro',
      name: 'Dinheiro',
      icon: FiDollarSign,
      color: 'green',
      description: 'Pagamento à vista'
    },
    {
      id: 'cartao_credito',
      name: 'Cartão de Crédito',
      icon: FiCreditCard,
      color: 'blue',
      description: 'Parcelamento disponível'
    },
    {
      id: 'cartao_debito',
      name: 'Cartão de Débito',
      icon: FiCreditCard,
      color: 'purple',
      description: 'Débito à vista'
    },
    {
      id: 'pix',
      name: 'PIX',
      icon: FiSmartphone,
      color: 'orange',
      description: 'Transferência instantânea'
    }
  ];

  // Bandeiras de cartão aceitas pela SEFAZ
  const cardBrands = [
    { code: '01', name: 'Visa' },
    { code: '02', name: 'Mastercard' },
    { code: '03', name: 'American Express' },
    { code: '04', name: 'Sorocred' },
    { code: '05', name: 'Diners Club' },
    { code: '06', name: 'Elo' },
    { code: '07', name: 'Hipercard' },
    { code: '08', name: 'Aura' },
    { code: '09', name: 'Cabal' },
    { code: '99', name: 'Outros' }
  ];

  // Lista de métodos "Outros"
  const otherMethods = [
    { id: 'cheque', label: 'Cheque', code: '02' },
    { id: 'credito_loja', label: 'Crédito Loja', code: '05' },
    { id: 'vale_alimentacao', label: 'Vale Alimentação', code: '10' },
    { id: 'vale_refeicao', label: 'Vale Refeição', code: '11' },
    { id: 'vale_presente', label: 'Vale Presente', code: '12' },
    { id: 'vale_combustivel', label: 'Vale Combustível', code: '13' },
    { id: 'boleto_bancario', label: 'Boleto bancário', code: '15' },
    { id: 'deposito_bancario', label: 'Depósito bancário', code: '16' },
    { id: 'cartao', label: 'Cartão (genérico 17)', code: '17' },
    { id: 'transferencia_bancaria', label: 'Transferência bancária', code: '19' },
    { id: 'sem_pagamento', label: 'Sem pagamento (90)', code: '90' }
  ];

  const valorAtual = isMultiplePayments ? valorRestante : totalComDesconto;
  const troco = valorRecebido ? (parseFloat(valorRecebido) - valorAtual) : 0;
  const valorParcela = parcelas > 1 ? (valorAtual / parcelas) : valorAtual;
  const totalPago = pagamentos.reduce((sum, pag) => sum + pag.valor, 0);
  const valorRestanteAtual = totalComDesconto - totalPago;

  const adicionarPagamento = () => {
    if (selectedPayment === 'dinheiro' && (!valorRecebido || parseFloat(valorRecebido) <= 0)) {
      return;
    }

    const valorPagamento = selectedPayment === 'dinheiro' ? parseFloat(valorRecebido) : valorRestanteAtual;
    const novoPagamento = {
      metodo: selectedPayment,
      valor: valorPagamento,
      troco: selectedPayment === 'dinheiro' && valorPagamento > valorRestanteAtual ? valorPagamento - valorRestanteAtual : 0,
      parcelas: selectedPayment === 'cartao_credito' ? parcelas : 1,
      valorParcela: selectedPayment === 'cartao_credito' ? valorParcela : valorPagamento,
      observacoes
    };

    const novosPagamentos = [...pagamentos, novoPagamento];
    setPagamentos(novosPagamentos);
    
    const novoTotalPago = novosPagamentos.reduce((sum, pag) => sum + pag.valor, 0);
    const novoValorRestante = totalComDesconto - novoTotalPago;
    
    setValorRestante(novoValorRestante);
    
    if (novoValorRestante <= 0) {
      // Pagamento completo
      handleConfirm(novosPagamentos);
    } else {
      // Ainda há valor restante, preparar para próximo pagamento
      setIsMultiplePayments(true);
      setSelectedPayment('dinheiro');
      setValorRecebido('');
      setParcelas(1);
      setObservacoes('');
    }
  };

  const handleConfirm = async (pagamentosFinais = null) => {
    let pagamentosParaEnviar;
    
    if (pagamentosFinais && Array.isArray(pagamentosFinais)) {
      pagamentosParaEnviar = pagamentosFinais;
    } else {
      const pagamentoAtual = {
        metodo: selectedPayment,
        valor: selectedPayment === 'dinheiro' ? parseFloat(valorRecebido) : (isMultiplePayments ? valorRestanteAtual : valorAtual),
        troco: selectedPayment === 'dinheiro' ? troco : 0,
        parcelas: selectedPayment === 'cartao_credito' ? parcelas : 1,
        valorParcela: selectedPayment === 'cartao_credito' ? valorParcela : (isMultiplePayments ? valorRestanteAtual : valorAtual),
        observacoes,
        // Adicionar dados do cartão se for pagamento com cartão
        ...(selectedPayment === 'cartao_credito' || selectedPayment === 'cartao_debito' ? {
          cardData: {
            tBand: cardData.tBand,
            tpIntegra: cardData.tpIntegra,
            cAut: cardData.cAut
          }
        } : {})
      };
      
      // Se já existem pagamentos (multi), incluir todos + o atual
      pagamentosParaEnviar = isMultiplePayments && pagamentos.length > 0
        ? [...pagamentos, pagamentoAtual]
        : [pagamentoAtual];
    }

    setLoading(true);
    
    try {
      // Garantir que pagamentosParaEnviar é um array válido
      if (!Array.isArray(pagamentosParaEnviar)) {
        throw new Error('Dados de pagamento inválidos');
      }
      
      const paymentData = {
        pagamentos: pagamentosParaEnviar,
        isMultiple: pagamentosParaEnviar.length > 1,
        totalPago: pagamentosParaEnviar.reduce((sum, pag) => sum + (pag?.valor || 0), 0),
        desconto: desconto,
        subtotal: subtotal,
        totalComDesconto: totalComDesconto
      };
      
      await onConfirm(paymentData);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const voltarPagamentoAnterior = () => {
    if (pagamentos.length > 0) {
      const novosPagamentos = pagamentos.slice(0, -1);
      setPagamentos(novosPagamentos);
      
      const novoTotalPago = novosPagamentos.reduce((sum, pag) => sum + pag.valor, 0);
      setValorRestante(totalComDesconto - novoTotalPago);
      
      if (novosPagamentos.length === 0) {
        setIsMultiplePayments(false);
      }
      
      setSelectedPayment('dinheiro');
      setValorRecebido('');
      setParcelas(1);
      setObservacoes('');
    }
  };

  const resetForm = () => {
    setSelectedPayment('dinheiro');
    setValorRecebido('');
    setParcelas(1);
    setObservacoes('');
    setPagamentos([]);
    setValorRestante(totalComDesconto);
    setIsMultiplePayments(false);
    setCardData({
      tBand: '',
      tpIntegra: '2',
      cAut: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {isMultiplePayments ? 'Pagamento Adicional' : 'Finalizar Pagamento'}
              </h3>
              <div className="text-sm text-gray-600 mt-1">
                {isMultiplePayments ? (
                  <>
                    <p>Valor restante: <span className="font-bold text-red-600">
                      R$ {valorRestanteAtual.toFixed(2)}
                    </span></p>
                    <p>Total original: <span className="font-bold text-gray-700">
                      R$ {totalComDesconto.toFixed(2)}
                    </span></p>
                  </>
                ) : (
                  <p>Total: <span className="font-bold text-green-600">
                    R$ {totalComDesconto.toFixed(2)}
                  </span></p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Pagamentos Realizados */}
            {pagamentos.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Pagamentos Realizados</h4>
                <div className="space-y-2">
                  {pagamentos.map((pag, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-blue-700">
                        {pag.metodo === 'dinheiro' ? 'Dinheiro' : 
                         pag.metodo === 'cartao_credito' ? 'Cartão de Crédito' :
                         pag.metodo === 'cartao_debito' ? 'Cartão de Débito' : 'PIX'}
                        {pag.parcelas > 1 && ` (${pag.parcelas}x)`}
                      </span>
                      <span className="font-medium text-blue-900">R$ {pag.valor.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-blue-200 pt-2 flex justify-between font-bold">
                    <span className="text-blue-900">Total pago:</span>
                    <span className="text-blue-900">R$ {totalPago.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Resumo da Venda */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Resumo da Venda</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Itens ({cartItems.length}):</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {/* Campo de Desconto */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Desconto:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">R$</span>
                      <input
                        type="number"
                        value={desconto}
                        onChange={(e) => {
                          const value = Math.max(0, parseFloat(e.target.value) || 0);
                          const percentualDesconto = (value / subtotal) * 100;
                          
                          // Validar desconto máximo
                          if (percentualDesconto > descontoMaximo) {
                            setDescontoError(`Desconto máximo permitido: ${descontoMaximo}% (R$ ${(subtotal * descontoMaximo / 100).toFixed(2)})`);
                            setDesconto(subtotal * descontoMaximo / 100);
                          } else {
                            setDescontoError('');
                            setDesconto(Math.min(value, subtotal));
                          }
                        }}
                        min="0"
                        max={subtotal}
                        step="0.01"
                        className={clsx(
                          "w-20 px-2 py-1 text-sm border rounded text-right focus:ring-1 focus:border-blue-500",
                          descontoError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                        )}
                        placeholder="0,00"
                      />
                      <span className="text-xs text-gray-500">
                        ({desconto > 0 ? ((desconto / subtotal) * 100).toFixed(1) : '0'}%)
                      </span>
                    </div>
                  </div>
                  
                  {/* Erro de desconto */}
                  {descontoError && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <FiAlertTriangle className="w-3 h-3" />
                      {descontoError}
                    </div>
                  )}
                  
                  {/* Indicador de desconto máximo */}
                  <div className="text-xs text-gray-500">
                    Máximo permitido: {descontoMaximo}%
                  </div>
                </div>
                
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {totalComDesconto.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Métodos de Pagamento */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Método de Pagamento</h4>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPayment === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={clsx(
                        'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                        isSelected
                          ? `border-${method.color}-500 bg-${method.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={clsx(
                          'w-5 h-5',
                          isSelected ? `text-${method.color}-600` : 'text-gray-400'
                        )} />
                        <div>
                          <div className={clsx(
                            'font-medium',
                            isSelected ? `text-${method.color}-900` : 'text-gray-900'
                          )}>
                            {method.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                  })}
                  <div className="col-span-2">
                  <details className="rounded-lg border border-gray-200">
                    <summary className="px-4 py-2 cursor-pointer text-sm text-gray-700">Outros métodos</summary>
                    <div className="p-3 grid grid-cols-2 gap-2">
                      {otherMethods.map(m => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedPayment(m.id)}
                          className={clsx(
                            'px-3 py-2 text-sm rounded border',
                            selectedPayment === m.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
                          )}
                          title={`Código SEFAZ: ${m.code}`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            </div>

            {/* Campos específicos por método */}
            {selectedPayment === 'dinheiro' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Recebido
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={valorRecebido}
                      onChange={(e) => setValorRecebido(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0,00"
                    />
                  </div>
                  {valorRecebido && troco >= 0 && (
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-800">
                          Troco:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          R$ {troco.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                  {valorRecebido && troco < 0 && (
                    <div className="mt-2 p-3 bg-red-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-red-800">
                          Valor insuficiente:
                        </span>
                        <span className="text-lg font-bold text-red-600">
                          R$ {Math.abs(troco).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedPayment === 'cartao_credito' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Parcelas
                </label>
                <select
                  value={parcelas}
                  onChange={(e) => setParcelas(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>
                      {num}x de R$ {(valorAtual / num).toFixed(2)}
                      {num === 1 ? ' (à vista)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Campos específicos para cartão de crédito e débito */}
            {(selectedPayment === 'cartao_credito' || selectedPayment === 'cartao_debito') && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">
                  Dados do Cartão (obrigatório para NFCe)
                </h4>
                
                {/* Bandeira do Cartão */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bandeira do Cartão *
                  </label>
                  <select
                    value={cardData.tBand}
                    onChange={(e) => setCardData(prev => ({ ...prev, tBand: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione a bandeira</option>
                    {cardBrands.map(brand => (
                      <option key={brand.code} value={brand.code}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Integração */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Maquininha
                  </label>
                  <select
                    value={cardData.tpIntegra}
                    onChange={(e) => setCardData(prev => ({ ...prev, tpIntegra: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">TEF (Integrada ao sistema)</option>
                    <option value="2">POS comum (Não integrada)</option>
                  </select>
                </div>

                {/* Código de Autorização */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Autorização *
                  </label>
                  <input
                    type="text"
                    value={cardData.cAut}
                    onChange={(e) => setCardData(prev => ({ ...prev, cAut: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o código do comprovante"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Código que aparece no comprovante da transação
                  </p>
                </div>
              </div>
            )}

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Adicione observações sobre o pagamento..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={isMultiplePayments ? voltarPagamentoAnterior : handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {isMultiplePayments ? 'Voltar' : 'Cancelar'}
            </button>
            <button
              onClick={selectedPayment === 'dinheiro' && troco < 0 ? adicionarPagamento : handleConfirm}
              disabled={loading || 
                (selectedPayment === 'dinheiro' && (!valorRecebido || parseFloat(valorRecebido) <= 0)) ||
                !isCardDataValid()
              }
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCheck className="w-5 h-5" />
              )}
              {loading ? 'Processando...' : 
               selectedPayment === 'dinheiro' && troco < 0 ? 'Adicionar Pagamento' : 'Confirmar Pagamento'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;