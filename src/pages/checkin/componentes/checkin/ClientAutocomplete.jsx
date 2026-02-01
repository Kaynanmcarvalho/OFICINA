/**
 * ClientAutocomplete Component
 * Busca inteligente de clientes com autocomplete
 * Integração com Firebase /clients collection
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Plus, Phone, Mail } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../../config/firebase';

const ClientAutocomplete = ({ 
  selectedClient, 
  onClientSelect,
  onCreateNew 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Buscar clientes no Firebase
  useEffect(() => {
    const searchClients = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const clientsRef = collection(db, 'clients');
        
        // Buscar por nome
        const nameQuery = query(
          clientsRef,
          where('name', '>=', searchTerm),
          where('name', '<=', searchTerm + '\uf8ff'),
          limit(5)

        const snapshot = await getDocs(nameQuery);
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchClients, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Selecionar cliente
  const handleSelectClient = (client) => {
    onClientSelect(client);
    setSearchTerm(client.name);
    setIsOpen(false);
  };

  // Limpar seleção
  const handleClear = () => {
    setSearchTerm('');
    onClientSelect(null);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="relative space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Cliente
      </label>

      {/* Input com ícone */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Buscar cliente por nome..."
          className="
            w-full pl-10 pr-10 py-3 rounded-xl
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-white
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500/50
            transition-all duration-200
          "
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
              transition-colors
            "
          >
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown de sugestões */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="
              absolute z-50 w-full mt-2
              rounded-xl overflow-hidden
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              shadow-2xl
              max-h-80 overflow-y-auto
            "
          >
            {suggestions.map((client, index) => (
              <motion.button
                key={client.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectClient(client)}
                className="
                  w-full px-4 py-3
                  flex items-start gap-3
                  hover:bg-gray-50 dark:hover:bg-gray-700/50
                  transition-colors duration-150
                  border-b border-gray-100 dark:border-gray-700/50
                  last:border-b-0
                "
              >
                {/* Avatar */}
                <div className="
                  flex-shrink-0 w-10 h-10 rounded-full
                  bg-gradient-to-br from-blue-500 to-blue-600
                  flex items-center justify-center
                  text-white font-semibold
                ">
                  {client.name?.charAt(0).toUpperCase() || 'C'}
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {client.phone && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="w-3 h-3" />
                        {client.phone}
                      </span>
                    )}
                    {client.email && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="w-3 h-3" />
                        {client.email}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Criar novo cliente */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: suggestions.length * 0.05 }}
              onClick={() => {
                setIsOpen(false);
                onCreateNew?.();
              }}
              className="
                w-full px-4 py-3
                flex items-center gap-3
                bg-blue-50 dark:bg-blue-900/20
                hover:bg-blue-100 dark:hover:bg-blue-900/30
                transition-colors duration-150
                border-t-2 border-blue-200 dark:border-blue-800
              "
            >
              <div className="
                flex-shrink-0 w-10 h-10 rounded-full
                bg-gradient-to-br from-blue-500 to-blue-600
                flex items-center justify-center
                text-white
              ">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Criar novo cliente
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cliente selecionado */}
      {selectedClient && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="
            flex items-center gap-3 p-4 rounded-xl
            bg-green-50 dark:bg-green-900/20
            border border-green-200 dark:border-green-800
          "
        >
          <div className="
            flex-shrink-0 w-12 h-12 rounded-full
            bg-gradient-to-br from-green-500 to-green-600
            flex items-center justify-center
            text-white font-semibold text-lg
          ">
            {selectedClient.name?.charAt(0).toUpperCase() || 'C'}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {selectedClient.name}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {selectedClient.phone && (
                <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <Phone className="w-3 h-3" />
                  {selectedClient.phone}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleClear}
            className="
              flex-shrink-0 p-2 rounded-lg
              hover:bg-green-100 dark:hover:bg-green-900/30
              text-gray-600 dark:text-gray-400
              transition-colors
            "
          >
            <Plus className="w-5 h-5 rotate-45" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ClientAutocomplete;
