/**
 * Botão WhatsApp
 * Botão para abrir modal de conexão e indicador de status
 */

import { useState } from 'react';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useWhatsAppConnection } from '../../hooks/useWhatsAppConnection';
import WhatsAppConnectionModal from './WhatsAppConnectionModal';

export default function WhatsAppButton({ className = '' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, status, phoneNumber } = useWhatsAppConnection();

  const getStatusColor = () => {
    if (isConnected) return 'text-green-600 dark:text-green-400';
    if (status === 'loading' || status === 'qr_ready') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-400 dark:text-gray-600';
  };

  const getStatusIcon = () => {
    if (isConnected) return <CheckCircle className="w-4 h-4" />;
    if (status === 'error' || status === 'auth_failure') return <AlertCircle className="w-4 h-4" />;
    return null;
  };

  const getStatusText = () => {
    if (isConnected && phoneNumber) return `WhatsApp: +${phoneNumber}`;
    if (isConnected) return 'WhatsApp Conectado';
    if (status === 'qr_ready') return 'Aguardando QR Code';
    if (status === 'loading') return 'Conectando...';
    return 'Conectar WhatsApp';
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          hover:bg-gray-50 dark:hover:bg-gray-700
          transition-all duration-200
          ${className}
        `}
      >
        <div className="relative">
          <MessageCircle className={`w-5 h-5 ${getStatusColor()}`} />
          {getStatusIcon() && (
            <div className="absolute -top-1 -right-1">
              {getStatusIcon()}
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getStatusText()}
        </span>
      </button>

      <WhatsAppConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>

}
