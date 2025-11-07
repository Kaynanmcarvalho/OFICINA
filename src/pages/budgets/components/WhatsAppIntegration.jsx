/**
 * Integração WhatsApp para Orçamentos
 * Componente que adiciona funcionalidade de envio via WhatsApp
 */

import { useState } from 'react';
import { MessageCircle, Send, CheckCircle } from 'lucide-react';
import { whatsappService } from '../../../services/whatsappService';
import { useWhatsAppConnection } from '../../../hooks/useWhatsAppConnection';
import WhatsAppConnectionModal from '../../../components/whatsapp/WhatsAppConnectionModal';
import toast from 'react-hot-toast';

export default function WhatsAppIntegration({ budget, onSent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { isConnected, status } = useWhatsAppConnection();

  const handleSendBudget = async () => {
    // Verificar se está conectado
    if (!isConnected) {
      toast.error('WhatsApp não está conectado');
      setIsModalOpen(true);
      return;
    }

    // Validar número do cliente
    if (!budget.client?.phone) {
      toast.error('Cliente não possui número de telefone cadastrado');
      return;
    }

    try {
      setIsSending(true);

      // Enviar orçamento
      const result = await whatsappService.sendBudget(
        budget.client.phone,
        budget
      );

      if (result.success) {
        toast.success('Orçamento enviado com sucesso!');
        onSent?.();
      } else {
        toast.error('Erro ao enviar orçamento');
      }
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      toast.error(error.message || 'Erro ao enviar orçamento');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Botão de Enviar */}
        <button
          onClick={handleSendBudget}
          disabled={isSending}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl
            font-medium transition-all duration-200
            ${isConnected
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }
            ${isSending ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Enviando...</span>
            </>
          ) : isConnected ? (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar via WhatsApp</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4" />
              <span>Conectar WhatsApp</span>
            </>
          )}
        </button>

        {/* Indicador de Status */}
        {isConnected && (
          <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Conectado</span>
          </div>
        )}
      </div>

      {/* Modal de Conexão */}
      <WhatsAppConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
