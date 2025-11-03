/**
 * ClientRow - Linha da tabela de clientes
 * Com hover effect e microinterações
 */

import { motion } from 'framer-motion';
import { Phone, Mail, Edit3, Eye, MessageCircle } from 'lucide-react';
import ClientAvatar from './ClientAvatar';
import ToggleSwitch from '../../../components/ui/ToggleSwitch';

const ClientRow = ({ client, index, onEdit, onToggleStatus, onView, onViewVehicles }) => {
  
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const formatDate = (date) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Formatação de CPF
  const formatCPF = (cpf) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11) return cpf;
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Formatação de CNPJ
  const formatCNPJ = (cnpj) => {
    if (!cnpj) return '';
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length !== 14) return cnpj;
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  // Formatação de telefone com DDD
  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      // Celular: (11) 99999-9999
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      // Fixo: (11) 9999-9999
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  // Validação de WhatsApp (celular com 11 dígitos)
  const hasWhatsApp = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned.charAt(2) === '9';
  };

  // Função para abrir WhatsApp
  const openWhatsApp = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const whatsappNumber = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
    const message = encodeURIComponent(`Olá ${client.name}! Como posso ajudá-lo?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  // Determinar se é CPF ou CNPJ
  const getDocumentDisplay = () => {
    if (client.cnpj) {
      return {
        type: 'CNPJ',
        value: formatCNPJ(client.cnpj),
        label: client.razaoSocial || client.nomeFantasia || client.name
      };
    } else if (client.cpf) {
      return {
        type: 'CPF',
        value: formatCPF(client.cpf),
        label: client.name
      };
    }
    return null;
  };

  const documentInfo = getDocumentDisplay();

  return (
    <motion.tr
      key={`client-${client.firestoreId || client.id}`}
      variants={rowVariants}
      className="group transition-all duration-200 client-row-optimized"
      style={{
        borderBottom: '1px solid var(--apple-border-light)',
        height: '72px',
      }}
    >
      {/* Cliente */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <ClientAvatar name={documentInfo?.label || client.name} />
          <div>
            <div className="font-semibold" style={{ color: 'var(--apple-text-primary)' }}>
              {documentInfo?.label || client.name}
            </div>
            {documentInfo && (
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" 
                      style={{ 
                        background: documentInfo.type === 'CPF' ? 'var(--apple-accent-green)' : 'var(--apple-accent-blue)',
                        color: 'white'
                      }}>
                  {documentInfo.type}
                </span>
                <span className="text-sm font-mono" style={{ color: 'var(--apple-text-tertiary)' }}>
                  {documentInfo.value}
                </span>
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Contato */}
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
              <Phone size={14} />
              <span className="font-mono">{formatPhone(client.phone)}</span>
            </div>
            {hasWhatsApp(client.phone) && (
              <motion.button
                onClick={() => openWhatsApp(client.phone)}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                }}

                whileTap={{ scale: 0.95 }}
                title="Conversar no WhatsApp"
              >
                <MessageCircle size={12} />
                <span>WhatsApp</span>
              </motion.button>
            )}
          </div>
          {client.email && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
              <Mail size={14} />
              <span className="truncate max-w-[200px]">{client.email}</span>
            </div>
          )}
        </div>
      </td>

      {/* Veículos */}
      <td className="px-6 py-4 text-center">
        <motion.button
          onClick={() => onViewVehicles && onViewVehicles(client)}
          className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            background: 'var(--apple-accent-blue)',
            color: 'white',
          }}

          whileTap={{ scale: 0.95 }}
          disabled={!client.vehicles || client.vehicles.length === 0}
        >
          {client.vehicles?.length || 0}
        </motion.button>
      </td>

      {/* Última Visita */}
      <td className="px-6 py-4 text-center text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
        {formatDate(client.lastServiceDate)}
      </td>

      {/* Total Serviços */}
      <td className="px-6 py-4 text-center text-sm font-semibold" style={{ color: 'var(--apple-text-primary)' }}>
        {client.totalServices || 0}
      </td>

      {/* Ações */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            onClick={() => onView?.(client)}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            title="Visualizar dados do cliente"
          >
            <Eye size={16} strokeWidth={2.5} />
          </motion.button>
          <motion.button
            onClick={onEdit}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: 'var(--apple-accent-blue)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            title="Editar cliente"
          >
            <Edit3 size={16} strokeWidth={2.5} />
          </motion.button>
          <div className="flex items-center gap-2">
            <ToggleSwitch
              enabled={client.active !== false} // Por padrão, clientes são ativos
              onChange={(newStatus) => onToggleStatus(client.id, newStatus)}
              size="sm"
              className="mr-1"
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400 min-w-[50px] text-center">
              {client.active !== false ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </td>
    </motion.tr>
  );
};

export default ClientRow;
