import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail, AlertCircle, LogOut, WifiOff, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import WhatsAppConnectionModal from '../../../components/whatsapp/WhatsAppConnectionModal';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { checkConnectionStatus, sendMessage } from '../../../services/whatsappService';
import { whatsappService } from '../../../services/whatsappService';

const SendBudgetModal = ({ isOpen, onClose, budget }) => {
  const [sendMethod, setSendMethod] = useState('whatsapp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  const [showDisconnectedAlert, setShowDisconnectedAlert] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [requireSignature, setRequireSignature] = useState(false);

  const approvalLink = budget ? `${window.location.origin}/orcamento/aprovar/${budget.approvalLink}` : '';

  const generateWhatsAppMessage = useCallback(() => {
    if (!budget) return '';
    
    return `Olá ${budget.clientName}! 👋

Segue o orçamento solicitado:

📋 *Orçamento:* ${budget.budgetNumber}
🚗 *Veículo:* ${budget.vehiclePlate || 'N/A'}
💰 *Valor Total:* R$ ${budget.total?.toFixed(2)}

Para visualizar os detalhes e aprovar o orçamento, acesse:
${approvalLink}

⏰ *Importante:* Este orçamento é válido por 48 horas para garantir a disponibilidade dos itens.

Qualquer dúvida, estamos à disposição!`;
  });

  // Inicializar mensagem customizada quando modal abre
  useEffect(() => {
    if (isOpen && budget && !customMessage) {
      setCustomMessage(generateWhatsAppMessage());
    }
  }, [isOpen, budget, customMessage, generateWhatsAppMessage]);

  // Verificar status do WhatsApp quando modal abre
  useEffect(() => {
    if (isOpen && sendMethod === 'whatsapp') {
      checkWhatsAppStatus();
    }
  }, [isOpen, sendMethod]);

  const checkWhatsAppStatus = async () => {
    try {
      const status = await checkConnectionStatus();
      console.log('[SendBudget] Status verificado:', status);
      
      // Considerar conectado se está conectado OU tem sessão salva
      const isConnected = status.connected === true || status.exists === true;
      setIsWhatsAppConnected(isConnected);
      
      // NÃO mostrar alerta automaticamente ao abrir o modal
      // O alerta só deve aparecer quando tentar enviar e falhar
      console.log('[SendBudget] Status:', isConnected ? 'Conectado/Sessão disponível' : 'Desconectado');
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setIsWhatsAppConnected(false);
      // NÃO mostrar alerta automaticamente
    }
  };

  const handleDisconnectWhatsApp = () => {
    setShowDisconnectConfirm(true);
  };

  const confirmDisconnect = async () => {
    try {
      await whatsappService.disconnect();
      setIsWhatsAppConnected(false);
      setShowDisconnectedAlert(true);
      toast.success('WhatsApp desconectado com sucesso');
    } catch (error) {
      console.error('Erro ao desconectar:', error);
      toast.error('Erro ao desconectar WhatsApp');
    }
  };

  const handleReconnectWhatsApp = () => {
    setShowDisconnectedAlert(false);
    setShowWhatsAppModal(true);
  };

  if (!isOpen || !budget) return null;

  // Função para normalizar número de telefone (remover 9 extra)
  const normalizePhoneNumber = (phone) => {
    // Remove tudo que não é número
    let cleaned = phone.replace(/\D/g, '');
    
    // Se tem 11 dígitos e o terceiro dígito é 9, remove o 9
    // Exemplo: 62992782003 -> 6292782003
    if (cleaned.length === 11 && cleaned.charAt(2) === '9') {
      cleaned = cleaned.substring(0, 2) + cleaned.substring(3);
    }
    
    // Se tem 13 dígitos (com código do país 55) e o quinto dígito é 9, remove o 9
    // Exemplo: 5562992782003 -> 556292782003
    if (cleaned.length === 13 && cleaned.charAt(4) === '9') {
      cleaned = cleaned.substring(0, 4) + cleaned.substring(5);
    }
    
    return cleaned;
  };

  

  const handleSendWhatsApp = async (skipConnectionCheck = false) => {
    console.log('[SendBudget] handleSendWhatsApp iniciado');
    const phone = phoneNumber || budget.clientPhone;
    
    console.log('[SendBudget] Telefone:', phone);
    console.log('[SendBudget] Mensagem:', customMessage?.substring(0, 50) + '...');
    
    if (!phone) {
      console.error('[SendBudget] Telefone não informado');
      toast.error('Número de telefone não informado');
      return;
    }

    if (!customMessage.trim()) {
      console.error('[SendBudget] Mensagem vazia');
      toast.error('Mensagem não pode estar vazia');
      return;
    }

    // Se não deve pular a verificação, verificar conexão primeiro
    console.log('[SendBudget] skipConnectionCheck:', skipConnectionCheck);
    if (!skipConnectionCheck) {
      // Se já verificamos que está conectado, pular verificação
      if (isWhatsAppConnected) {
        console.log('[SendBudget] WhatsApp já verificado como conectado - pulando verificação');
      } else {
        console.log('[SendBudget] Verificando conexão WhatsApp...');
        try {
          const status = await checkConnectionStatus();
          console.log('[SendBudget] Status da conexão:', status);
          
          // Se NÃO está conectado E NÃO tem sessão salva, mostrar alerta
          if (!status.connected && !status.exists) {
            console.log('[SendBudget] WhatsApp sem sessão - mostrando alerta');
            setIsWhatsAppConnected(false);
            setShowDisconnectedAlert(true);
            return;
          }
          
          // Se está conectado OU tem sessão, continuar com envio
          console.log('[SendBudget] WhatsApp disponível - enviando...');
          setIsWhatsAppConnected(true);
        } catch (error) {
          console.error('Erro ao verificar conexão:', error);
          // Só mostrar alerta se realmente não conseguir verificar
          setIsWhatsAppConnected(false);
          setShowDisconnectedAlert(true);
          return;
        }
      }
    }

    // Enviar mensagem
    setIsSending(true);

    try {
      // Normalizar número (remover 9 extra se necessário)
      const normalizedPhone = normalizePhoneNumber(phone);
      
      console.log('[SendBudget] Número original:', phone);
      console.log('[SendBudget] Número normalizado:', normalizedPhone);
      console.log('[SendBudget] Enviando mensagem...');
      
      await sendMessage(normalizedPhone, customMessage);

      // Atualizar status para "sent" e registrar data de envio
      const budgetStore = window.budgetStore || (await import('../../../store/budgetStore')).useBudgetStore.getState();
      await budgetStore.updateBudget(budget.id || budget.firestoreId, {
        status: 'sent',
        sentAt: new Date().toISOString(),
        requireSignature: requireSignature
      });

      toast.success('Orçamento enviado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao enviar:', error);
      
      if (error.message.includes('NOT_CONNECTED') || error.message.includes('desconectado')) {
        setIsWhatsAppConnected(false);
        setShowDisconnectedAlert(true);
      } else if (error.message.includes('TIMEOUT')) {
        toast.error('Timeout ao restaurar sessão. Tente novamente em alguns segundos.');
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
    // Enviar mensagem diretamente após conexão (pulando verificação)
    setTimeout(() => {
      handleSendWhatsApp(true);
    }, 500);
  };

  const handleSendEmail = async () => {
    const emailAddress = email || budget.clientEmail;
    
    if (!emailAddress) {
      toast.error('E-mail não informado');
      return;
    }

    if (!customMessage.trim()) {
      toast.error('Mensagem não pode estar vazia');
      return;
    }

    setIsSending(true);

    try {
      const subject = `Orçamento ${budget.budgetNumber}`;
      const body = customMessage;
      
      const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

      // Atualizar status para "sent" e registrar data de envio
      const budgetStore = window.budgetStore || (await import('../../../store/budgetStore')).useBudgetStore.getState();
      await budgetStore.updateBudget(budget.id || budget.firestoreId, {
        status: 'sent',
        sentAt: new Date().toISOString(),
        requireSignature: requireSignature
      });

      toast.success('Cliente de e-mail aberto!');
      onClose();
    } catch {
      toast.error('Erro ao enviar e-mail');
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = () => {
    console.log('[SendBudget] handleSend chamado - método:', sendMethod);
    if (sendMethod === 'whatsapp') {
      console.log('[SendBudget] Chamando handleSendWhatsApp...');
      handleSendWhatsApp();
    } else {
      console.log('[SendBudget] Chamando handleSendEmail...');
      handleSendEmail();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 dark:bg-black/60 backdrop-blur-md"
            onClick={onClose}
          >
            <motion.div
              key="send-budget-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-2xl w-full max-w-7xl xl:max-w-[90vw] 2xl:max-w-[85vw] max-h-[90vh] border border-gray-200 dark:border-gray-700/50 overflow-hidden flex flex-col"
            >
          {/* Header */}
          <div className="relative px-7 py-5 border-b border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/30 dark:from-gray-800/30 dark:via-gray-800/20 dark:to-gray-800/10">
            <button
              onClick={onClose}
              className="absolute top-5 right-6 p-2 hover:bg-gray-200 dark:hover:bg-gray-700/60 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 group shadow-sm hover:shadow-md"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors" />
            </button>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Enviar Orçamento
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Escolha o método de envio e personalize sua mensagem
              </p>
            </div>
          </div>

          {/* Content - Grid Layout */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7">
              {/* Left Column - Info & Settings */}
              <div className="space-y-5">
                {/* Budget Info Card */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-5 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-2xl border border-blue-100 dark:border-gray-700/50 shadow-lg shadow-blue-100/50 dark:shadow-none"
                >
                  <h3 className="text-xs font-semibold text-indigo-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Detalhes do Orçamento
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between py-1.5 border-b border-indigo-100 dark:border-gray-700/50">
                      <span className="text-xs text-gray-700 dark:text-gray-400">Número</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{budget.budgetNumber}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-indigo-100 dark:border-gray-700/50">
                      <span className="text-xs text-gray-700 dark:text-gray-400">Cliente</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{budget.clientName}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-gray-700 dark:text-gray-400">Valor Total</span>
                      <span className="text-lg font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        R$ {budget.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Send Method Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                    Método de Envio
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <motion.button
                      type="button"
                      onClick={() => setSendMethod('whatsapp')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center justify-center gap-2.5 p-3 rounded-2xl border-2 transition-all duration-300 ${
                        sendMethod === 'whatsapp'
                          ? 'border-green-500 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:to-emerald-900/20 shadow-lg shadow-green-500/30'
                          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <Send className={`w-4 h-4 transition-colors ${sendMethod === 'whatsapp' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold transition-colors ${sendMethod === 'whatsapp' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        WhatsApp
                      </span>
                      {sendMethod === 'whatsapp' && (
                        <motion.div
                          layoutId="activeMethod"
                          className="absolute inset-0 border-2 border-green-500 rounded-2xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setSendMethod('email')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex items-center justify-center gap-2.5 p-3 rounded-2xl border-2 transition-all duration-300 ${
                        sendMethod === 'email'
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:to-indigo-900/20 shadow-lg shadow-blue-500/30'
                          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <Mail className={`w-4 h-4 transition-colors ${sendMethod === 'email' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold transition-colors ${sendMethod === 'email' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        E-mail
                      </span>
                      {sendMethod === 'email' && (
                        <motion.div
                          layoutId="activeMethod"
                          className="absolute inset-0 border-2 border-blue-500 rounded-2xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                {/* WhatsApp Status & Disconnect */}
                {sendMethod === 'whatsapp' && isWhatsAppConnected && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="p-3 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-200 dark:border-green-800/50 rounded-2xl shadow-md shadow-green-100/50 dark:shadow-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-green-800 dark:text-green-200">
                          WhatsApp Conectado
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleDisconnectWhatsApp}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/80 dark:bg-gray-800/80 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-medium transition-all hover:scale-105 active:scale-95 border border-red-200 dark:border-red-800/50"
                      >
                        <LogOut className="w-3 h-3" />
                        Desconectar
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Require Signature Checkbox */}
                {sendMethod === 'whatsapp' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.27 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:to-indigo-900/10 border border-purple-200 dark:border-purple-800/50 rounded-2xl"
                  >
                    <input
                      type="checkbox"
                      id="requireSignature"
                      checked={requireSignature}
                      onChange={(e) => setRequireSignature(e.target.checked)}
                      className="w-5 h-5 text-purple-600 bg-white border-purple-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                    />
                    <label htmlFor="requireSignature" className="flex-1 cursor-pointer">
                      <span className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                        Solicitar Assinatura Digital
                      </span>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-0.5">
                        O cliente precisará assinar digitalmente antes de aprovar
                      </p>
                    </label>
                  </motion.div>
                )}

                {/* Contact Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {sendMethod === 'whatsapp' ? (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Número do WhatsApp
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phoneNumber || budget.clientPhone || ''}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="(62) 92782003"
                          className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:focus:border-green-400 transition-all shadow-sm"
                        />
                        {phoneNumber && phoneNumber.replace(/\D/g, '').length === 11 && phoneNumber.replace(/\D/g, '').charAt(2) === '9' && (
                          <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-700 dark:text-blue-300">
                              <p className="font-medium mb-1">Número será ajustado automaticamente</p>
                              <p className="text-blue-600 dark:text-blue-400">
                                {phoneNumber} → {phoneNumber.replace(/\D/g, '').substring(0, 2) + phoneNumber.replace(/\D/g, '').substring(3)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={email || budget.clientEmail || ''}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="cliente@email.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:border-blue-400 transition-all shadow-sm"
                      />
                    </div>
                  )}
                </motion.div>

                {/* Expiration Warning */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-3 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:to-amber-900/10 border border-orange-200 dark:border-orange-800/50 rounded-2xl shadow-md shadow-orange-100/50 dark:shadow-none"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-gradient-to-br from-orange-100 to-amber-100 dark:bg-orange-900/30 rounded-lg shadow-sm">
                      <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-orange-900 dark:text-orange-200 mb-0.5">
                        Validade de 48 horas
                      </p>
                      <p className="text-[10px] text-orange-800 dark:text-orange-300/80 leading-relaxed">
                        Os orçamentos expiram em 48h para garantir a disponibilidade dos itens.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Editable Message */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Mensagem para Envio
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomMessage(generateWhatsAppMessage())}
                    className="text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    Restaurar padrão
                  </button>
                </div>
                <div className="flex-1 min-h-[270px] lg:min-h-[360px]">
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Digite sua mensagem aqui..."
                    className="w-full h-full p-5 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-800 dark:via-gray-750 dark:to-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-600 shadow-lg shadow-gray-200/50 dark:shadow-black/30 text-xs text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 transition-all resize-none font-sans leading-relaxed custom-scrollbar"
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                  <span>{customMessage.length} caracteres</span>
                  <span>•</span>
                  <span>{customMessage.split('\n').length} linhas</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 px-3 sm:px-5 lg:px-7 py-3 sm:py-5 border-t border-gray-200 dark:border-gray-700/50 bg-gradient-to-t from-gray-100/50 via-gray-50/30 to-transparent dark:from-gray-800/30"
          >
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 text-sm bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-all duration-200 border-2 border-gray-300 dark:border-gray-700 shadow-md hover:shadow-lg"
            >
              Cancelar
            </motion.button>
            <motion.button
              onClick={handleSend}
              disabled={isSending}
              whileHover={{ scale: isSending ? 1 : 1.02 }}
              whileTap={{ scale: isSending ? 1 : 0.98 }}
              className={`flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 text-sm rounded-xl font-semibold transition-all duration-200 shadow-xl ${
                sendMethod === 'whatsapp'
                  ? 'bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 shadow-green-500/40 hover:shadow-green-500/50'
                  : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 shadow-blue-500/40 hover:shadow-blue-500/50'
              } text-white ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {sendMethod === 'whatsapp' ? <Send className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSending ? 'Enviando...' : 'Enviar Orçamento'}</span>
              <span className="sm:hidden">{isSending ? 'Enviando...' : 'Enviar'}</span>
            </motion.button>
          </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Connection Modal */}
      <WhatsAppConnectionModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        onSuccess={handleWhatsAppConnected}
      />

      {/* WhatsApp Disconnected Alert */}
      <AnimatePresence>
        {showDisconnectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/40 dark:bg-black/60 backdrop-blur-md"
            onClick={() => setShowDisconnectedAlert(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md xl:max-w-lg 2xl:max-w-xl border border-gray-200 dark:border-gray-700/50 overflow-hidden"
            >
              {/* Alert Header */}
              <div className="p-6 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-900/20 dark:to-orange-900/10 border-b border-red-100 dark:border-red-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <WifiOff className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      WhatsApp Desconectado
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Sua sessão foi encerrada
                    </p>
                  </div>
                </div>
              </div>

              {/* Alert Content */}
              <div className="p-6 space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    O WhatsApp foi desconectado. Isso pode ter acontecido porque:
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Você desconectou manualmente pelo aplicativo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>A sessão expirou por inatividade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Houve um problema de conexão</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                      Para continuar enviando orçamentos pelo WhatsApp, você precisa reconectar sua conta escaneando o QR Code novamente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Alert Actions */}
              <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
                <motion.button
                  type="button"
                  onClick={() => setShowDisconnectedAlert(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm transition-all border-2 border-gray-300 dark:border-gray-700"
                >
                  Fechar
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleReconnectWhatsApp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-green-500/30"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reconectar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 4px;
          transition: background 0.2s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
        
        /* Scrollbar para Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
        }
        .dark .custom-scrollbar {
          scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
        }
      `}</style>

      {/* Confirm Dialog - Desconectar WhatsApp */}
      <ConfirmDialog
        isOpen={showDisconnectConfirm}
        onClose={() => setShowDisconnectConfirm(false)}
        onConfirm={confirmDisconnect}
        title="Desconectar WhatsApp?"
        message="Você precisará escanear o QR Code novamente para reconectar. Tem certeza que deseja continuar?"
        confirmText="Sim, Desconectar"
        cancelText="Cancelar"
        type="warning"
      />
    </>
  );
};

export default SendBudgetModal;
