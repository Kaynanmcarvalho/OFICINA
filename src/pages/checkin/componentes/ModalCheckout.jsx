import { useState, useEffect } from 'react';
import { X, DollarSign, FileText, CreditCard, Upload } from '@/utils/icons';
import toast from 'react-hot-toast';
import UploaderFotos from './UploaderFotos';
import { checkoutCheckin } from '../../../services/checkinService';

const ModalCheckout = ({ isOpen, onClose, onSuccess, checkinData }) => {
  const [formData, setFormData] = useState({
    servicosRealizados: '',
    valorTotal: '',
    metodoPagamento: '',
    observacoes: '',
    fotos: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const metodosPagamento = [
    { value: 'dinheiro', label: 'Dinheiro' },
    { value: 'pix', label: 'PIX' },
    { value: 'cartao_credito', label: 'Cartão de Crédito' },
    { value: 'cartao_debito', label: 'Cartão de Débito' },
    { value: 'transferencia', label: 'Transferência' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        servicosRealizados: '',
        valorTotal: '',
        metodoPagamento: '',
        observacoes: '',
        fotos: []
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.servicosRealizados.trim()) {
      newErrors.servicosRealizados = 'Descreva os serviços realizados';
    }

    if (!formData.valorTotal) {
      newErrors.valorTotal = 'Informe o valor total';
    } else if (parseFloat(formData.valorTotal) <= 0) {
      newErrors.valorTotal = 'Valor deve ser maior que zero';
    }

    if (!formData.metodoPagamento) {
      newErrors.metodoPagamento = 'Selecione o método de pagamento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutData = {
        servicesPerformed: formData.servicosRealizados,
        totalCost: parseFloat(formData.valorTotal),
        paymentMethod: formData.metodoPagamento,
        checkoutObservations: formData.observacoes
      };

      const photoFiles = formData.fotos.map(f => f.file);
      const updatedCheckin = await checkoutCheckin(checkinData.id, checkoutData, photoFiles);

      toast.success('Check-out realizado com sucesso!');
      onSuccess(updatedCheckin);
      onClose();
    } catch (error) {
      console.error('Erro ao realizar check-out:', error);
      toast.error(error.message || 'Erro ao realizar check-out');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    const number = value.replace(/\D/g, '');
    const formatted = (parseInt(number) / 100).toFixed(2);
    return formatted;
  };

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    const formatted = formatCurrency(value);
    setFormData({ ...formData, valorTotal: formatted });
    setErrors({ ...errors, valorTotal: null });
  };

  if (!isOpen || !checkinData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl dark:shadow-neutral-950/50 border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Finalizar Check-out
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {checkinData.clientName} • {checkinData.plate}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 ease-out text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid Layout - 2 colunas em telas grandes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna Esquerda - Serviços e Observações */}
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Serviços Realizados
                      </label>
                    </div>
                    <textarea
                      value={formData.servicosRealizados}
                      onChange={(e) => {
                        setFormData({ ...formData, servicosRealizados: e.target.value });
                        setErrors({ ...errors, servicosRealizados: null });
                      }}
                      placeholder="Descreva os serviços realizados..."
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                        errors.servicosRealizados
                          ? 'border-red-500'
                          : 'border-neutral-200 dark:border-neutral-700'
                      } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out resize-none`}
                    />
                    {errors.servicosRealizados && (
                      <p className="mt-1 text-xs text-red-500">{errors.servicosRealizados}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Observações Adicionais
                      </label>
                    </div>
                    <textarea
                      value={formData.observacoes}
                      onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                      placeholder="Observações sobre o atendimento..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out resize-none"
                    />
                  </div>
                </div>

                {/* Coluna Direita - Pagamento */}
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-neutral-400" />
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Valor Total
                      </label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400">
                        R$
                      </span>
                      <input
                        type="text"
                        value={formData.valorTotal}
                        onChange={handleCurrencyChange}
                        placeholder="0,00"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                          errors.valorTotal
                            ? 'border-red-500'
                            : 'border-neutral-200 dark:border-neutral-700'
                        } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out`}
                      />
                    </div>
                    {errors.valorTotal && (
                      <p className="mt-1 text-xs text-red-500">{errors.valorTotal}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-neutral-400" />
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Método de Pagamento
                      </label>
                    </div>
                    <select
                      value={formData.metodoPagamento}
                      onChange={(e) => {
                        setFormData({ ...formData, metodoPagamento: e.target.value });
                        setErrors({ ...errors, metodoPagamento: null });
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
                        errors.metodoPagamento
                          ? 'border-red-500'
                          : 'border-neutral-200 dark:border-neutral-700'
                      } text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out`}
                    >
                      <option value="">Selecione o método</option>
                      {metodosPagamento.map((metodo) => (
                        <option key={metodo.value} value={metodo.value}>
                          {metodo.label}
                        </option>
                      ))}
                    </select>
                    {errors.metodoPagamento && (
                      <p className="mt-1 text-xs text-red-500">{errors.metodoPagamento}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload de Fotos - Full Width */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="w-4 h-4 text-neutral-400" />
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Fotos Finais do Veículo
                  </label>
                </div>
                <UploaderFotos
                  fotos={formData.fotos}
                  onChange={(fotos) => setFormData({ ...formData, fotos })}
                  maxFotos={10}
                />
              </div>
            </form>
          </div>

          {/* Footer - Botões */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-300 ease-out disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-medium bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processando...' : 'Finalizar Check-out'}
            </button>
          </div>
        </div>
      </div>
  );
};

export default ModalCheckout;
