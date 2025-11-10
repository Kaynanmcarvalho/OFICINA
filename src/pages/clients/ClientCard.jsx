/**
 * ClientCard - Card premium para visualização em grade
 */

import { motion } from 'framer-motion';
import { 
  Mail, Phone, Car, Calendar, DollarSign, 
  MoreVertical, Eye, Edit, Trash2, MessageCircle,
  User, MapPin
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { useState } from 'react';
import { formatCPF, formatPhone, formatDate, formatAddress } from '../../utils/formatters';

const ClientCard = ({ client, onView, onEdit, onDelete }) => {
  const { isDarkMode } = useThemeStore();
  const [showActions, setShowActions] = useState(false);

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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      onClick={() => onView(client)}
      className={`
        group relative p-6 rounded-2xl backdrop-blur-xl
        transition-all duration-500 cursor-pointer
        ${isDarkMode 
          ? 'bg-gray-900/80 border-[2px] border-gray-700/80 hover:border-gray-600 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]' 
          : 'glass-effect'
        }
      `}
      style={{ minWidth: '320px' }}
    >
      {/* Avatar e Nome */}
      <div className="flex items-start gap-4 mb-3">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          text-xl font-bold flex-shrink-0
          ${isDarkMode 
            ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 border-[2px] border-gray-600/80 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
            : 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 border-[3px] border-blue-300 shadow-[0_4px_16px_rgba(59,130,246,0.25)]'
          }
        `}>
          {getInitials(client.name)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-bold truncate mb-1 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {client.name}
          </h3>
          
          {client.cpf && (
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              CPF: {formatCPF(client.cpf)}
            </p>
          )}
        </div>
      </div>

      {/* Status Badge - Movido para baixo do nome */}
      <div className="mb-4">
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
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {client.email && (
          <div className="flex items-center gap-2">
            <Mail className={`w-4 h-4 flex-shrink-0 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-sm truncate ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {client.email}
            </span>
          </div>
        )}

        {client.phone && (
          <div className="flex items-center gap-2">
            <Phone className={`w-4 h-4 flex-shrink-0 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {formatPhone(client.phone)}
            </span>
          </div>
        )}

        {client.address && (
          <div className="flex items-start gap-2">
            <MapPin className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {formatAddress(client.address)}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className={`
        grid grid-cols-3 gap-3 py-3 border-t border-b mb-4
        ${isDarkMode ? 'border-gray-700/60' : 'border-neutral-200'}
      `}>
        <div className="text-center">
          <div className={`flex items-center justify-center gap-1 mb-1 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            <Car className="w-4 h-4" />
          </div>
          <div className={`text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {client.vehicles?.length || 0}
          </div>
          <div className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Veículos
          </div>
        </div>

        <div className="text-center">
          <div className={`flex items-center justify-center gap-1 mb-1 ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className={`text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {client.totalServices || 0}
          </div>
          <div className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Serviços
          </div>
        </div>

        <div className="text-center">
          <div className={`flex items-center justify-center gap-1 mb-1 ${
            isDarkMode ? 'text-purple-400' : 'text-purple-600'
          }`}>
            <Calendar className="w-4 h-4" />
          </div>
          <div className={`text-xs font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {formatDate(client.lastServiceDate)}
          </div>
          <div className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Última visita
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onView(client);
          }}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
            font-medium text-sm transition-all
            ${isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
              : 'bg-blue-700 hover:bg-blue-800 text-white !border-0'
            }
          `}
        >
          <Eye className="w-4 h-4" />
          Ver Detalhes
        </motion.button>

        {client.phone && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsApp}
            className={`
              p-2.5 rounded-lg transition-all
              ${isDarkMode 
                ? 'bg-green-600 hover:bg-green-500 text-white' 
                : 'bg-green-700 hover:bg-green-800 text-white !border-0'
              }
            `}
            title="WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className={`
            p-2.5 rounded-lg transition-all
            ${isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-gray-300'
            }
          `}
        >
          <MoreVertical className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Actions Dropdown */}
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
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
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
              bottom: '80px'
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(client);
                setShowActions(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg
                text-sm font-medium transition-all
                ${isDarkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>

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
    </motion.div>
  );
};

export default ClientCard;
