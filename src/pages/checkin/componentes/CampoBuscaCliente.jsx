import { useState, useEffect, useRef } from 'react';
import { Search, User, X, Plus, Phone, CreditCard, Building2 } from 'lucide-react';
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
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);
      try {
        const clientes = await searchClients(query);
        setResults(clientes || []);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(buscarClientes, 200);
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
          className={`w-full pl-10 pr-10 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border ${error ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-700'
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
          {isLoading ? (
            <div className="px-4 py-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-sm text-neutral-500 dark:text-neutral-400">Buscando clientes...</span>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                <>
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-700">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {results.length} {results.length === 1 ? 'cliente encontrado' : 'clientes encontrados'}
                    </p>
                  </div>
                  {results.map((cliente) => {
                    const hasVehicles = cliente.vehicles && cliente.vehicles.length > 0;
                    const firstVehicle = hasVehicles ? cliente.vehicles[0] : null;
                    
                    return (
                      <button
                        key={cliente.id}
                        type="button"
                        onClick={() => handleSelect(cliente)}
                        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 text-left border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate mb-1">
                            {cliente.name}
                          </p>
                          <div className="space-y-0.5">
                            {cliente.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{cliente.phone}</span>
                              </div>
                            )}
                            {cliente.cpf && (
                              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                                <CreditCard className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">CPF: {cliente.cpf}</span>
                              </div>
                            )}
                            {cliente.cnpj && (
                              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                                <Building2 className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">CNPJ: {cliente.cnpj}</span>
                              </div>
                            )}
                            {firstVehicle && (
                              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 mt-1">
                                <span className="font-medium">{firstVehicle.plate}</span>
                                <span className="text-neutral-400">•</span>
                                <span className="truncate">{firstVehicle.model}</span>
                              </div>
                            )}
                            {hasVehicles && cliente.vehicles.length > 1 && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-500 italic">
                                +{cliente.vehicles.length - 1} {cliente.vehicles.length - 1 === 1 ? 'outro veículo' : 'outros veículos'}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className="px-4 py-6 text-center">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-neutral-400" />
                  </div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Nenhum cliente encontrado
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Tente buscar por nome, telefone ou CPF
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleNovoCliente}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 text-left border-t-2 border-green-500 dark:border-green-600"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    Cadastrar novo cliente
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Nome: <span className="font-medium text-green-600 dark:text-green-400">{query}</span>
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default CampoBuscaCliente;
