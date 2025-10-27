import { useState, useEffect, useRef } from 'react';
import { Search, User, X, Plus } from 'lucide-react';
import { searchClients } from '../../../services/clientService';

const CampoBuscaCliente = ({ value, onSelect, error }) => {
  const [query, setQuery] = useState(value?.name || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const buscarClientes = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const clientes = await searchClients(query);
        setResults(clientes || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(buscarClientes, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (cliente) => {
    setQuery(cliente.name);
    setIsOpen(false);
    onSelect(cliente);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    onSelect(null);
  };

  const handleNovoCliente = () => {
    onSelect({ id: 'new', name: query, isNew: true });
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        Cliente
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Buscar por nome, CPF ou telefone..."
          className={`w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${
            error ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
          } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-out`}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">

            <div className="max-h-64 overflow-y-auto">
              {results.length > 0 ? (
                results.map((cliente) => (
                  <button
                    key={cliente.id}
                    type="button"
                    onClick={() => handleSelect(cliente)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-all duration-200 text-left"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {cliente.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {cliente.phone} {cliente.cpf && `• ${cliente.cpf}`}
                      </p>
                    </div>
                  </button>
                ))
              ) : !isLoading && (
                <button
                  type="button"
                  onClick={handleNovoCliente}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 text-left border-t-2 border-green-500"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      Cadastrar novo cliente: <span className="text-blue-600 dark:text-blue-400">{query}</span>
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Clique para adicionar este cliente
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

      {isLoading && (
        <div className="absolute right-3 top-11 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default CampoBuscaCliente;
