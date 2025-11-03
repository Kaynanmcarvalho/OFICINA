/**
 * ClientRow - Linha da tabela de clientes
 * Com hover effect e microinterações
 */

import { motion } from 'framer-motion';
import { Phone, Mail, Edit3, Trash2 } from 'lucide-react';
import ClientAvatar from './ClientAvatar';

const ClientRow = ({ client, index, onEdit, onDelete }) => {
  
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

  return (
    <motion.tr
      variants={rowVariants}
      className="group transition-all duration-200"
      style={{
        borderBottom: '1px solid var(--apple-border-light)',
        height: '72px',
      }}
      whileHover={{
        backgroundColor: 'var(--apple-overlay-light)',
        y: -1,
      }}
    >
      {/* Cliente */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <ClientAvatar name={client.name} />
          <div>
            <div className="font-semibold" style={{ color: 'var(--apple-text-primary)' }}>
              {client.name}
            </div>
            {client.cpf && (
              <div className="text-sm font-mono" style={{ color: 'var(--apple-text-tertiary)' }}>
                {client.cpf}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Contato */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
            <Phone size={14} />
            {client.phone}
          </div>
          {client.email && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--apple-text-secondary)' }}>
              <Mail size={14} />
              {client.email}
            </div>
          )}
        </div>
      </td>

      {/* Veículos */}
      <td className="px-6 py-4 text-center">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold"
             style={{
               background: 'var(--apple-accent-blue)',
               color: 'white',
             }}>
          {client.vehicles?.length || 0}
        </div>
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
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: 'var(--apple-accent-blue)',
              color: 'white',
            }}
            title="Editar cliente"
          >
            <Edit3 size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={onDelete}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: 'var(--apple-accent-red)',
              color: 'white',
            }}
            title="Excluir cliente"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export default ClientRow;
