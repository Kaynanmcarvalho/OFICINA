/**
 * ClientSlideOver - Slide-over premium com abas para detalhes do cliente
 */

import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import './ClientSlideOver.css';
import { 
  X, User, Car, History, MessageSquare, Zap,
  Mail, Phone, MapPin, Calendar, DollarSign,
  Edit, Trash2, MessageCircle, FileText
} from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { formatCPF, formatPhone, formatDate, formatAddress } from '../../utils/formatters';
import VehiclesTab from './tabs/VehiclesTab';
import HistoryTab from './tabs/HistoryTab';
import ConversationsTab from './tabs/ConversationsTab';
import ActionsTab from './tabs/ActionsTab';

const TABS = [
  { id: 'overview', label: 'Visão Geral', icon: User },
  { id: 'vehicles', label: 'Veículos', icon: Car },
  { id: 'history', label: 'Histórico', icon: History },
  { id: 'conversations', label: 'Conversas', icon: MessageSquare },
  { id: 'actions', label: 'Ações', icon: Zap }
];

const ClientSlideOver = ({ isOpen, onClose, client, onEdit, onDelete }) => {
  const { isDarkMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [offsetY, setOffsetY] = useState(() => {
    const saved = localStorage.getItem('slideOverOffsetY');
    return saved ? parseInt(saved) : 0;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);

  if (!client) return null;

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };



  const handleWhatsApp = () => {
    const phone = client.phone?.replace(/\D/g, '');
    if (phone) {
      const message = encodeURIComponent(`Olá ${client.name}! Tudo bem?`);
      window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
    }
  };

  const isActive = client.active !== false;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartY(e.clientY - offsetY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newOffsetY = e.clientY - dragStartY;
    const maxOffset = window.innerHeight - 200;
    const minOffset = -window.innerHeight + 200;
    const clampedOffset = Math.max(minOffset, Math.min(maxOffset, newOffsetY));
    setOffsetY(clampedOffset);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('slideOverOffsetY', offsetY.toString());
    }
  };

  // Ocultar scrollbar do body quando aberto
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Slide Over */}
          <Motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ 
              transform: `translateY(${offsetY}px) translateX(0)`,
              cursor: isDragging ? 'grabbing' : 'default',
              right: 0,
              left: 'auto'
            }}
            className={`
              client-slideover-container
              flex flex-col
              ${isDarkMode 
                ? 'bg-gray-900 border-l-[3px] border-gray-700/80 shadow-[-8px_0_40px_rgba(0,0,0,0.5)]' 
                : 'bg-white border-l-[2px] border-gray-300/40 shadow-[-8px_0_40px_rgba(0,0,0,0.2),-4px_0_16px_rgba(0,0,0,0.1)]'
              }
            `}
          >
            {/* Header */}
            <div 
              onMouseDown={handleMouseDown}
              className={`
                px-6 py-4 border-b flex-shrink-0
                ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                ${isDarkMode ? 'border-gray-700/60' : 'border-gray-300/80'}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center
                    text-2xl font-bold
                    ${isDarkMode 
                      ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-100 border-[2px] border-gray-600/80 shadow-[0_4px_16px_rgba(0,0,0,0.4)]' 
                      : 'bg-gradient-to-br from-gray-800 to-gray-900 text-white border-[3px] border-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]'
                    }
                  `}>
                    {getInitials(client.name)}
                  </div>

                  <div>
                    <h2 className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {client.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`
                        px-2.5 py-1 rounded-full text-xs font-semibold
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
                      {client.cpf && (
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          CPF: {formatCPF(client.cpf)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`
                    p-2 rounded-xl transition-colors
                    ${isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  <X className="w-5 h-5" />
                </Motion.button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit(client)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                    font-medium text-sm transition-all
                    ${isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }
                  `}
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Motion.button>

                {client.phone && (
                  <Motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsApp}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                      font-medium text-sm transition-all
                      ${isDarkMode 
                        ? 'bg-green-600 hover:bg-green-500 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      }
                    `}
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Motion.button>
                )}

                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete(client.firestoreId)}
                  className={`
                    px-4 py-2.5 rounded-xl font-medium text-sm transition-all
                    ${isDarkMode 
                      ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400' 
                      : 'bg-red-50 hover:bg-red-100 text-red-600'
                    }
                  `}
                >
                  <Trash2 className="w-4 h-4" />
                </Motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className={`
              px-6 border-b flex-shrink-0 overflow-x-hidden
              ${isDarkMode ? 'border-gray-700/60' : 'border-gray-300/80'}
            `}>
              <div className="flex gap-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <Motion.button
                      key={tab.id}
                      whileHover={{ y: -2 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        relative flex items-center gap-2 px-4 py-3
                        font-medium text-sm transition-all whitespace-nowrap
                        ${isActive
                          ? isDarkMode
                            ? 'text-blue-400'
                            : 'text-blue-600'
                          : isDarkMode
                            ? 'text-gray-400 hover:text-gray-300'
                            : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      
                      {isActive && (
                        <Motion.div
                          layoutId="activeTab"
                          className={`
                            absolute bottom-0 left-0 right-0 h-0.5
                            ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}
                          `}
                        />
                      )}
                    </Motion.button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 pb-12 min-h-0">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <Motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Contact Info */}
                    <div>
                      <h3 className={`text-lg font-bold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Informações de Contato
                      </h3>
                      
                      <div className="space-y-3">
                        {client.email && (
                          <div className="flex items-center gap-3">
                            <div className={`
                              p-2 rounded-lg
                              ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}
                            `}>
                              <Mail className={`w-5 h-5 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                E-mail
                              </div>
                              <div className={`font-medium ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {client.email}
                              </div>
                            </div>
                          </div>
                        )}

                        {client.phone && (
                          <div className="flex items-center gap-3">
                            <div className={`
                              p-2 rounded-lg
                              ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}
                            `}>
                              <Phone className={`w-5 h-5 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                Telefone
                              </div>
                              <div className={`font-medium ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {formatPhone(client.phone)}
                              </div>
                            </div>
                          </div>
                        )}

                        {client.address && (
                          <div className="flex items-start gap-3">
                            <div className={`
                              p-2 rounded-lg flex-shrink-0
                              ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}
                            `}>
                              <MapPin className={`w-5 h-5 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                Endereço
                              </div>
                              <div className={`font-medium ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {formatAddress(client.address)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <h3 className={`text-lg font-bold mb-4 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Estatísticas
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`
                          p-4 rounded-xl border
                          ${isDarkMode 
                            ? 'bg-gray-800/80 border-gray-700/60 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
                            : 'bg-gray-50 border-gray-300/60 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                          }
                        `}>
                          <div className="flex items-center gap-2 mb-2">
                            <Car className={`w-5 h-5 ${
                              isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                            <span className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Veículos
                            </span>
                          </div>
                          <div className={`text-3xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {client.vehicles?.length || 0}
                          </div>
                        </div>

                        <div className={`
                          p-4 rounded-xl border
                          ${isDarkMode 
                            ? 'bg-gray-800/80 border-gray-700/60 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
                            : 'bg-gray-50 border-gray-300/60 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                          }
                        `}>
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className={`w-5 h-5 ${
                              isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`} />
                            <span className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Serviços
                            </span>
                          </div>
                          <div className={`text-3xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {client.totalServices || 0}
                          </div>
                        </div>

                        <div className={`
                          p-4 rounded-xl col-span-2 border
                          ${isDarkMode 
                            ? 'bg-gray-800/80 border-gray-700/60 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
                            : 'bg-gray-50 border-gray-300/60 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                          }
                        `}>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className={`w-5 h-5 ${
                              isDarkMode ? 'text-purple-400' : 'text-purple-600'
                            }`} />
                            <span className={`text-sm font-medium ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Última Visita
                            </span>
                          </div>
                          <div className={`text-xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {formatDate(client.lastServiceDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                )}

                {activeTab === 'vehicles' && (
                  <VehiclesTab client={client} />
                )}

                {activeTab === 'history' && (
                  <HistoryTab client={client} />
                )}

                {activeTab === 'conversations' && (
                  <ConversationsTab client={client} />
                )}

                {activeTab === 'actions' && (
                  <ActionsTab client={client} onClose={onClose} />
                )}
              </AnimatePresence>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClientSlideOver;
