import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import WhatsAppConnectionModal from '../../../components/whatsapp/WhatsAppConnectionModal';
import { checkConnectionStatus, sendMessage } from '../../../services/whatsappService';

const SendBudgetModal = ({ isOpen, onClose, budget }) => {
  const [sendMethod, setSendMethod] = useState('whatsapp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  if (!isOpen || !budget) return null;

  const approvalLink = `${window.location.origin}/orcamento/aprovar/${budget.approvalLink}`;

  const generateWhatsAppMessage = () => {
    return `Olá ${budget.clientName}! 👋

Segue o orçamento solicitado:

📋 *Orçamento:* ${budget.budgetNumber}
🚗 *Veículo:* ${budget.vehiclePlate || 'N/A'}
💰 *Valor Total:* R$ ${budget.total?.toFixed(2)}

Para visualizar os detalhes e aprovar o orçamento, acesse:
${approvalLink}

⏰ *Importante:* Este orçamento é válido por 48 horas para garantir a disponibilidade dos itens.

Qualquer dúvida, estamos à disposição!`;
  };

  const checkWhatsAppConnection = async () => {
    try {
      const status = await checkConnectionStatus();
      return status.connected;
    } catch (error) {
      console.error('Erro ao verificar conexão WhatsApp:', error);
      return false;
    }
  };

  const handleSendWhatsApp = async () => {
    const phone = phoneNumber || budget.clientPhone;
    
    if (!phone) {
      toast.error('Número de telefone não informado');
      return;
    }

    // Verificar se WhatsApp está conectado
    const isConnected = await checkWhatsAppConnection();
    
    if (!isConnected) {
      // Abrir modal de conexão
      setShowWhatsAppModal(true);
      return;
    }

    setIsSending(true);

    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const message = generateWhatsAppMessage();
      
      await sendMessage(cleanPhone, message);

      toast.success('Orçamento enviado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao enviar:', error);
      
      if (error.message.includes('NOT_CONNECTED')) {
        toast.error('WhatsApp desconectado. Reconecte e tente novamente.');
        setShowWhatsAppModal(true);
      } else {
        toast.error('Erro ao enviar pelo WhatsApp');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleWhatsAppConnected = (userData) => {
    console.log('WhatsApp conectado:', userData);
    setShowWhatsAppModal(false);
    toast.success('Agora você pode enviar orçamentos automaticamente!');
    // Tentar enviar novamente após conexão
    setTimeout(() => {
      handleSendWhatsApp();
    }, 500);
  };

  const handleSendEmail = async () => {
    const emailAddress = email || budget.clientEmail;
    
    if (!emailAddress) {
      toast.error('E-mail não informado');
      return;
    }

    setIsSending(true);

    try {
      const subject = `Orçamento ${budget.budgetNumber}`;
      const body = generateWhatsAppMessage();
      
      const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

      toast.success('Cliente de e-mail aberto!');
      onClose();
    } catch {
      toast.error('Erro ao enviar e-mail');
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => {
    if (sendMethod === 'whatsapp') {
      handleSendWhatsApp();
    } else {
      handleSendEmail();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              key="send-budget-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl"
            >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Enviar Orçamento
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Budget Info */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Orçamento:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{budget.budgetNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Cliente:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{budget.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-bold text-gray-900 dark:text-white">R$ {budget.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Send Method Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Método de Envio
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSendMethod('whatsapp')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    sendMethod === 'whatsapp'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Send className={`w-5 h-5 ${sendMethod === 'whatsapp' ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${sendMethod === 'whatsapp' ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    WhatsApp
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setSendMethod('email')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    sendMethod === 'email'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Mail className={`w-5 h-5 ${sendMethod === 'email' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`font-semibold ${sendMethod === 'email' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    E-mail
                  </span>
                </button>
              </div>
            </div>

            {/* Contact Input */}
            {sendMethod === 'whatsapp' ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Número do WhatsApp
                </label>
                <input
                  type="tel"
                  value={phoneNumber || budget.clientPhone || ''}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email || budget.clientEmail || ''}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Preview Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Prévia da Mensagem
              </label>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                  {generateWhatsAppMessage()}
                </pre>
              </div>
            </div>

            {/* Expiration Warning */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800 dark:text-orange-200">
                  <p className="font-semibold mb-1">Validade de 48 horas</p>
                  <p>Os orçamentos expiram em 48h para evitar inconsistências no estoque e garantir que as quantidades exibidas estejam sempre corretas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={isSending}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                sendMethod === 'whatsapp'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              } text-white ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {sendMethod === 'whatsapp' ? <Send className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
              {isSending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp Connection Modal */}
      <WhatsAppConnectionModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onSuccess={handleWhatsAppConnected}
      />
    </>
  );
};

export default SendBudgetModal;
