/**
 * TORQ Invoice WhatsApp - Send Button Component
 * Botão para enviar NF via WhatsApp
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  MessageCircle,
  FileText,
  Link,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Phone,
  User,
  ChevronDown,
} from 'lucide-react';
import { useInvoiceWhatsApp } from '../hooks/useInvoiceWhatsApp';
import type { InvoiceData, MessageType, WhatsAppTemplate } from '../types';
import { MESSAGE_TYPE_LABELS, DEFAULT_TEMPLATES } from '../types';

interface SendInvoiceButtonProps {
  invoice: InvoiceData;
  empresaId: string;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export function SendInvoiceButton({
  invoice,
  empresaId,
  userId,
  onSuccess,
  onError,
  variant = 'primary',
  size = 'md',
}: SendInvoiceButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<MessageType>('invoice_pdf');
  const [phone, setPhone] = useState(invoice.clientPhone || '');
  const [customMessage, setCustomMessage] = useState('');
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [sendResult, setSendResult] = useState<'success' | 'error' | null>(null);

  const { sendInvoice, isSending, templates } = useInvoiceWhatsApp();

  const handleSend = async () => {
    if (!phone) {
      onError?.('Número de telefone é obrigatório');
      return;
    }

    const result = await sendInvoice(
      {
        invoiceId: invoice.id,
        recipientPhone: phone,
        messageType: selectedType,
        customMessage: customMessage || undefined,
        includeAttachments,
      },
      invoice,
      empresaId,
      userId
    );

    if (result.success) {
      setSendResult('success');
      onSuccess?.();
      setTimeout(() => {
        setShowModal(false);
        setSendResult(null);
      }, 2000);
    } else {
      setSendResult('error');
      onError?.(result.error || 'Erro ao enviar');
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm';
      case 'lg': return 'px-6 py-4 text-lg';
      default: return 'px-4 py-3 text-base';
    }
  };

  const getButtonStyle = () => {
    if (variant === 'icon') {
      return 'p-2 rounded-full bg-green-500 text-white hover:bg-green-600';
    }
    if (variant === 'secondary') {
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700';
    }
    return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25';
  };

  // Preview do template
  const getTemplatePreview = () => {
    const template = DEFAULT_TEMPLATES.find(t => t.type === selectedType);
    if (!template) return '';

    let preview = template.content;
    preview = preview.replace('{{clientName}}', invoice.clientName);
    preview = preview.replace('{{invoiceNumber}}', invoice.number);
    preview = preview.replace('{{totalValue}}', invoice.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    preview = preview.replace('{{issueDate}}', new Date(invoice.issueDate).toLocaleDateString('pt-BR'));
    preview = preview.replace('{{vehiclePlate}}', invoice.vehiclePlate || '');
    preview = preview.replace(/{{#if vehiclePlate}}[\s\S]*?{{\/if}}/g, invoice.vehiclePlate ? `🚗 Veículo: ${invoice.vehiclePlate}` : '');

    return preview;
  };

  return (
    <>
      {/* Botão */}
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          ${variant !== 'icon' ? getButtonSize() : ''}
          ${getButtonStyle()}
          rounded-xl font-medium
          flex items-center gap-2
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        `}
      >
        <MessageCircle className="w-4 h-4" />
        {variant !== 'icon' && <span>Enviar via WhatsApp</span>}
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 bg-white dark:bg-neutral-800 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Enviar NF via WhatsApp
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        NF {invoice.number}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>
              </div>

              {/* Resultado */}
              {sendResult && (
                <div className={`p-4 ${sendResult === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <div className="flex items-center gap-3">
                    {sendResult === 'success' ? (
                      <>
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <span className="text-green-800 dark:text-green-200 font-medium">
                          Mensagem enviada com sucesso!
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        <span className="text-red-800 dark:text-red-200 font-medium">
                          Erro ao enviar mensagem
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              {!sendResult && (
                <div className="p-6 space-y-6">
                  {/* Destinatário */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Destinatário
                    </label>
                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/50">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {invoice.clientName}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {invoice.clientDocument}
                      </p>
                    </div>
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Número do WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Tipo de mensagem */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Tipo de Mensagem
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['invoice_pdf', 'invoice_summary', 'payment_reminder'] as MessageType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            selectedType === type
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                          }`}
                        >
                          <span className={`text-sm font-medium ${
                            selectedType === type
                              ? 'text-green-700 dark:text-green-400'
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}>
                            {MESSAGE_TYPE_LABELS[type]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Preview da Mensagem
                    </label>
                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700">
                      <pre className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap font-sans">
                        {getTemplatePreview()}
                      </pre>
                    </div>
                  </div>

                  {/* Opções */}
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeAttachments}
                        onChange={(e) => setIncludeAttachments(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        Incluir PDF da nota fiscal
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Footer */}
              {!sendResult && (
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      onClick={handleSend}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSending || !phone}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg shadow-green-500/25 hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SendInvoiceButton;
