/**
 * ActionsTab - Ações rápidas para o cliente
 */

import { motion as Motion } from 'framer-motion';
import { 
  ClipboardCheck, FileText, MessageCircle, Calendar, 
  Gift, Download, ExternalLink
} from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ActionsTab = ({ client, onClose }) => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const actions = [
    {
      id: 'checkin',
      label: 'Novo Check-in',
      description: 'Criar um novo check-in para este cliente',
      icon: ClipboardCheck,
      color: 'blue',
      onClick: () => {
        navigate('/checkin', { state: { client } });
        onClose();
      }
    },
    {
      id: 'budget',
      label: 'Novo Orçamento',
      description: 'Criar um orçamento para este cliente',
      icon: FileText,
      color: 'green',
      onClick: () => {
        navigate('/orcamentos', { state: { client } });
        onClose();
      }
    },
    {
      id: 'whatsapp',
      label: 'Enviar WhatsApp',
      description: 'Abrir conversa no WhatsApp',
      icon: MessageCircle,
      color: 'green',
      onClick: () => {
        const phone = client.phone?.replace(/\D/g, '');
        if (phone) {
          const message = encodeURIComponent(`Olá ${client.name}! Tudo bem?`);
          window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
        } else {
          toast.error('Cliente sem telefone cadastrado');
        }
      }
    },
    {
      id: 'schedule',
      label: 'Agendar Serviço',
      description: 'Agendar um novo serviço',
      icon: Calendar,
      color: 'purple',
      onClick: () => {
        navigate('/schedule', { state: { client } });
        onClose();
      }
    },
    {
      id: 'voucher',
      label: 'Gerar Voucher',
      description: 'Criar voucher de desconto',
      icon: Gift,
      color: 'pink',
      onClick: () => {
        toast.success('Funcionalidade em breve!');
      }
    },
    {
      id: 'export',
      label: 'Exportar Dados',
      description: 'Exportar informações do cliente',
      icon: Download,
      color: 'gray',
      onClick: () => {
        const data = JSON.stringify(client, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cliente-${client.name}.json`;
        a.click();
        toast.success('Dados exportados!');
      }
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: isDarkMode 
        ? 'bg-blue-900/30 hover:bg-blue-900/50 border-blue-800 text-blue-400' 
        : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
      green: isDarkMode 
        ? 'bg-green-900/30 hover:bg-green-900/50 border-green-800 text-green-400' 
        : 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700',
      purple: isDarkMode 
        ? 'bg-purple-900/30 hover:bg-purple-900/50 border-purple-800 text-purple-400' 
        : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
      pink: isDarkMode 
        ? 'bg-pink-900/30 hover:bg-pink-900/50 border-pink-800 text-pink-400' 
        : 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700',
      gray: isDarkMode 
        ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300' 
        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
    };
    return colors[color] || colors.gray;
  };

  return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className={`text-lg font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Ações Rápidas
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Motion.button
              key={action.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className={`
                p-4 rounded-xl border text-left transition-all
                ${getColorClasses(action.color)}
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-lg
                  ${isDarkMode ? 'bg-black/20' : 'bg-white/50'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="font-semibold mb-1 flex items-center gap-2">
                    {action.label}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </div>
                  <div className={`text-xs opacity-75`}>
                    {action.description}
                  </div>
                </div>
              </div>
            </Motion.button>
          );
        })}
      </div>
    </Motion.div>
  );
};

export default ActionsTab;

