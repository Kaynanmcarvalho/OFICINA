/**
 * ClientModal - Modal premium para criar/editar cliente
 */

import { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, FileText, Save, Loader2 } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const ClientModal = ({ isOpen, onClose, onSave, client, isLoading }) => {
  const { isDarkMode } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cnpj: '',
    address: '',
    active: true
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        cpf: client.cpf || '',
        cnpj: client.cnpj || '',
        address: client.address || '',
        active: client.active !== false
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        cnpj: '',
        address: '',
        active: true
      });
    }
  }, [client, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`
                w-full max-w-2xl max-h-[90vh] overflow-hidden
                rounded-2xl backdrop-blur-xl border shadow-2xl
                ${isDarkMode 
                  ? 'bg-gray-900/95 border-gray-800' 
                  : 'bg-white/95 border-gray-200'
                }
              `}
            >
              {/* Header */}
              <div className={`
                px-6 py-5 border-b flex items-center justify-between
                ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}
              `}>
                <div>
                  <h2 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {client ? 'Editar Cliente' : 'Novo Cliente'}
                  </h2>
                  <p className={`text-sm mt-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {client ? 'Atualize as informações do cliente' : 'Preencha os dados do novo cliente'}
                  </p>
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

              {/* Form */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="p-6 space-y-6">
                  {/* Nome */}
                  <div>
                    <label className={`
                      flex items-center gap-2 text-sm font-semibold mb-2
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      <User className="w-4 h-4" />
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Digite o nome completo"
                      className={`
                        w-full px-4 py-3 rounded-xl border transition-all
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${isDarkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                        }
                      `}
                    />
                  </div>

                  {/* Email e Telefone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`
                        flex items-center gap-2 text-sm font-semibold mb-2
                        ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                      `}>
                        <Mail className="w-4 h-4" />
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="email@exemplo.com"
                        className={`
                          w-full px-4 py-3 rounded-xl border transition-all
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${isDarkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                          }
                        `}
                      />
                    </div>

                    <div>
                      <label className={`
                        flex items-center gap-2 text-sm font-semibold mb-2
                        ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                      `}>
                        <Phone className="w-4 h-4" />
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                        placeholder="(00) 00000-0000"
                        className={`
                          w-full px-4 py-3 rounded-xl border transition-all
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${isDarkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                          }
                        `}
                      />
                    </div>
                  </div>

                  {/* CPF e CNPJ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`
                        flex items-center gap-2 text-sm font-semibold mb-2
                        ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                      `}>
                        <FileText className="w-4 h-4" />
                        CPF
                      </label>
                      <input
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        className={`
                          w-full px-4 py-3 rounded-xl border transition-all
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${isDarkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                          }
                        `}
                      />
                    </div>

                    <div>
                      <label className={`
                        flex items-center gap-2 text-sm font-semibold mb-2
                        ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                      `}>
                        <FileText className="w-4 h-4" />
                        CNPJ
                      </label>
                      <input
                        type="text"
                        value={formData.cnpj}
                        onChange={(e) => handleChange('cnpj', formatCNPJ(e.target.value))}
                        placeholder="00.000.000/0000-00"
                        className={`
                          w-full px-4 py-3 rounded-xl border transition-all
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${isDarkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                          }
                        `}
                      />
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <label className={`
                      flex items-center gap-2 text-sm font-semibold mb-2
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                    `}>
                      <MapPin className="w-4 h-4" />
                      Endereço
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Rua, número, bairro, cidade - UF"
                      rows={3}
                      className={`
                        w-full px-4 py-3 rounded-xl border transition-all resize-none
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${isDarkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'
                        }
                      `}
                    />
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => handleChange('active', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label 
                      htmlFor="active"
                      className={`text-sm font-medium cursor-pointer ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Cliente ativo
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className={`
                  px-6 py-4 border-t flex items-center justify-end gap-3
                  ${isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'}
                `}>
                  <Motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className={`
                      px-6 py-2.5 rounded-xl font-semibold transition-all
                      ${isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }
                    `}
                  >
                    Cancelar
                  </Motion.button>

                  <Motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || !formData.name}
                    className={`
                      flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold
                      transition-all disabled:opacity-50 disabled:cursor-not-allowed
                      ${isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }
                    `}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {client ? 'Atualizar' : 'Criar Cliente'}
                      </>
                    )}
                  </Motion.button>
                </div>
              </form>
            </Motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClientModal;
