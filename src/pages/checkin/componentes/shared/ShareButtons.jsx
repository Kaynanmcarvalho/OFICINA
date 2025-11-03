import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ShareButtons Component
 * 
 * Botões para compartilhar relatório de serviço via WhatsApp e Email
 * Integra com dados do cliente e gera links/mensagens automaticamente
 * 
 * @param {Object} clientData - Dados do cliente (phone, email)
 * @param {String} pdfUrl - URL do PDF gerado
 * @param {Object} serviceData - Dados do serviço para mensagem
 */
const ShareButtons = ({ clientData, pdfUrl, serviceData }) => {
  const [sending, setSending] = useState({ whatsapp: false, email: false });
  const [sent, setSent] = useState({ whatsapp: false, email: false });

  /**
   * Formata número de telefone para WhatsApp
   * Remove caracteres especiais e adiciona código do país
   */
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return null;
    
    // Remove tudo exceto números
    const cleaned = phone.replace(/\D/g, '');
    
    // Adiciona código do Brasil se não tiver
    if (cleaned.length === 11) {
      return `55${cleaned}`;
    } else if (cleaned.length === 10) {
      return `5511${cleaned}`; // Assume SP se tiver 10 dígitos
    }
    
    return cleaned;
  };

  /**
   * Gera mensagem para WhatsApp
   */
  const generateWhatsAppMessage = () => {
    const vehicleInfo = `${serviceData.vehicleBrand} ${serviceData.vehicleModel} - ${serviceData.vehiclePlate}`;
    const date = new Date().toLocaleDateString('pt-BR');
    
    let message = `🔧 *Relatório de Serviço*\n\n`;
    message += `Olá ${clientData.name}!\n\n`;
    message += `Seu veículo *${vehicleInfo}* foi atendido em ${date}.\n\n`;
    
    if (serviceData.services) {
      message += `*Serviços realizados:*\n`;
      message += `${serviceData.services}\n\n`;
    }
    
    if (pdfUrl) {
      message += `📄 Relatório completo: ${pdfUrl}\n\n`;
    }
    
    message += `Obrigado pela confiança! 🚗✨\n\n`;
    message += `_Mensagem automática do Sistema de Gestão_`;
    
    return encodeURIComponent(message);
  };

  /**
   * Abre WhatsApp com mensagem pré-preenchida
   */
  const handleWhatsAppShare = () => {
    const phone = formatPhoneForWhatsApp(clientData.phone);
    
    if (!phone) {
      alert('Número de telefone do cliente não encontrado.');
      return;
    }

    setSending({ ...sending, whatsapp: true });

    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    
    // Abrir em nova aba
    window.open(whatsappUrl, '_blank');
    
    // Marcar como enviado após 1 segundo
    setTimeout(() => {
      setSending({ ...sending, whatsapp: false });
      setSent({ ...sent, whatsapp: true });
    }, 1000);
  };

  /**
   * Gera corpo do email
   */
  const generateEmailBody = () => {
    const vehicleInfo = `${serviceData.vehicleBrand} ${serviceData.vehicleModel} - ${serviceData.vehiclePlate}`;
    const date = new Date().toLocaleDateString('pt-BR');
    
    let body = `Olá ${clientData.name},\n\n`;
    body += `Seu veículo ${vehicleInfo} foi atendido em ${date}.\n\n`;
    
    if (serviceData.services) {
      body += `Serviços realizados:\n${serviceData.services}\n\n`;
    }
    
    if (pdfUrl) {
      body += `Você pode baixar o relatório completo aqui: ${pdfUrl}\n\n`;
    }
    
    body += `Obrigado pela confiança!\n\n`;
    body += `Atenciosamente,\nEquipe da Oficina`;
    
    return encodeURIComponent(body);
  };

  /**
   * Abre cliente de email
   */
  const handleEmailShare = () => {
    if (!clientData.email) {
      alert('Email do cliente não encontrado.');
      return;
    }

    setSending({ ...sending, email: true });

    const subject = encodeURIComponent(`Relatório de Serviço - ${serviceData.vehiclePlate}`);
    const body = generateEmailBody();
    const mailtoUrl = `mailto:${clientData.email}?subject=${subject}&body=${body}`;
    
    // Abrir cliente de email
    window.location.href = mailtoUrl;
    
    // Marcar como enviado após 1 segundo
    setTimeout(() => {
      setSending({ ...sending, email: false });
      setSent({ ...sent, email: true });
    }, 1000);
  };

  /**
   * Copia link do PDF
   */
  const handleCopyLink = () => {
    if (!pdfUrl) {
      alert('PDF ainda não foi gerado.');
      return;
    }

    navigator.clipboard.writeText(pdfUrl);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Compartilhar Relatório
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Envie o relatório de serviço para o cliente
        </p>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* WhatsApp Button */}
        <motion.button
          onClick={handleWhatsAppShare}
          disabled={!clientData.phone || sending.whatsapp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
            clientData.phone && !sending.whatsapp
              ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {sending.whatsapp ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
            </>
          ) : sent.whatsapp ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Enviado
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </>
          )}
        </motion.button>

        {/* Email Button */}
        <motion.button
          onClick={handleEmailShare}
          disabled={!clientData.email || sending.email}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
            clientData.email && !sending.email
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {sending.email ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
            </>
          ) : sent.email ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Enviado
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </>
          )}
        </motion.button>
      </div>

      {/* Copy Link Button */}
      {pdfUrl && (
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copiar Link do PDF
        </button>
      )}

      {/* Contact Info Display */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        {clientData.phone && (
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{clientData.phone}</span>
          </div>
        )}
        {clientData.email && (
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{clientData.email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareButtons;
