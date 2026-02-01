/**
 * ClientRow - Linha da tabela para visualização em lista
 */

import { motion } from 'framer-motion';
import { 
  Mail, Phone, Car, Calendar, DollarSign,
  Eye, Edit, Trash2, MessageCircle, MoreVertical
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useState, useRef } from 'react';
import { formatCPF, formatPhone, formatDate } from '../../utils/formatters';

const ClientRow = ({ client, onView, onEdit, onDelete }) => {
  const { isDarkMode } = useThemeStore();
  const [showActions, setShowActions] = useState(false);
  const buttonRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const phone = client.phone?.replace(/\D/g, '');
    if (phone) {
      window.open(`https://wa.me/55${phone}`, '_blank');
    }
  };

  const isActive = client.active !== false;

  return (
    <motion.tr
      data-client-id={client.firestoreId}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ 
        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 1)'
      }}
      onClick={() => onView(client)}
      className={`
        cursor-pointer transition-all duration-200
        ${isDarkMode ? 'border-gray-800' : 'border-gray-300'}
      `}
    >
      {/* Cliente */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            text-sm font-bold flex-shrink-0
            ${isDarkMode 
              ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 border-[2px] border-gray-600/80 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
              : 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 border-[2px] border-blue-300 shadow-[0_2px_8px_rgba(59,130,246,0.2)]'
            }
          `}>
            {getInitials(client.name)}
          </div>
          
          <div className="min-w-0">
            <div className={`font-semibold truncate ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {client.name}
            </div>
            {client.cpf && (
              <div className={`text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-600'
              }`}>
                CPF: {formatCPF(client.cpf)}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Contato */}
      <td className="px-6 py-4">
        <div className="space-y-1">
          {client.phone && (
            <div className="flex items-center gap-2">
              <Phone className={`w-3.5 h-3.5 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {formatPhone(client.phone)}
              </span>
              {client.phone && (
                <button
                  onClick={handleWhatsApp}
                  className={`
                    p-1 rounded transition-colors
                    ${isDarkMode 
                      ? 'hover:bg-green-900/30 text-green-400' 
                      : 'hover:bg-green-50 text-green-600'
                    }
                  `}
                  title="WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-2">
              <Mail className={`w-3.5 h-3.5 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <span className={`text-sm truncate ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {client.email}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Veículos */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Car className={`w-4 h-4 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <span className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {client.vehicles?.length || 0}
          </span>
        </div>
      </td>

      {/* Última Visita */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <span className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {formatDate(client.lastServiceDate)}
          </span>
        </div>
      </td>

      {/* Total Serviços */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <DollarSign className={`w-4 h-4 ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`} />
          <span className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {client.totalServices || 0}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <div className={`
          inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
          ${isActive
            ? isDarkMode
              ? 'bg-green-500/20 text-green-400'
              : 'bg-green-100 text-green-700'
            : isDarkMode
              ? 'bg-gray-700 text-gray-400'
              : 'bg-gray-200 text-gray-600'
          }
        `}>
          {isActive ? 'Ativo' : 'Inativo'}
        </div>
      </td>

      {/* Ações */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 justify-end">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onView(client);
            }}
            className={`
              p-2 rounded-lg transition-colors
              ${isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
              }
            `}
            title="Ver detalhes"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(client);
            }}
            className={`
              p-2 rounded-lg transition-colors
              ${isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-yellow-400' 
                : 'hover:bg-gray-100 text-gray-600 hover:text-yellow-600'
              }
            `}
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </motion.button>

          <div className="relative">
            <motion.button
              ref={buttonRef}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className={`
                p-2 rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
                }
              `}
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            {showActions && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(false);
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`
                    fixed z-[9999] w-48 p-2 rounded-xl
                    backdrop-blur-xl border
                    ${isDarkMode 
                      ? 'bg-gray-900/95 border-[2px] border-gray-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.5)]' 
                      : 'glass-effect shadow-[0_12px_40px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.1)]'
                    }
                  `}
                  style={{
                    right: '20px',
                    top: 'auto',
                    bottom: 'auto'
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(client.firestoreId);
                      setShowActions(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg
                      text-sm font-medium transition-all
                      ${isDarkMode 
                        ? 'hover:bg-red-900/20 text-red-400' 
                        : 'hover:bg-red-50 text-red-600'
                      }
                    `}
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </td>
    </motion.tr>
  );
};

export default ClientRow;
