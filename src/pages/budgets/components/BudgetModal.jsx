import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, AlertCircle, FileText, Search } from 'lucide-react';
import { useBudgetStore } from '../../../store/budgetStore';
import { useClientStore } from '../../../store';
import { useInventoryStore } from '../../../store/inventoryStore';
import { searchVehicleByPlate } from '../../../services/vehicleApiService';
import CampoBuscaCliente from '../../checkin/componentes/CampoBuscaCliente';
import toast from 'react-hot-toast';
import './BudgetModal.css';
import '../../../styles/budget-modal-scale-20.css';

const BudgetModal = ({ isOpen, onClose, budget }) => {
  const { createBudget, updateBudget } = useBudgetStore();
  const { clients, fetchClients } = useClientStore();
  const { parts, fetchParts } = useInventoryStore();

  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    vehicleId: '',
    vehiclePlate: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    items: [],
    notes: '',
    internalNotes: ''
  });

  const [selectedClient, setSelectedClient] = useState(null);
  
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const productInputRef = useRef(null);
  const productDropdownRef = useRef(null);
  const [productDropdownPosition, setProductDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const [isSearchingPlate, setIsSearchingPlate] = useState(false);

  const [currentItem, setCurrentItem] = useState({
    type: 'product',
    productId: '',
    name: '',
    description: '',
    quantity: 1,
    price: 0,
    dependsOn: null
  });

  useEffect(() => {
    fetchClients();
    fetchParts();
  }, [fetchClients, fetchParts]);

  // Atualizar posição do dropdown de produtos
  useEffect(() => {
    const updateProductPosition = () => {
      if (productInputRef.current && showProductDropdown) {
        const rect = productInputRef.current.getBoundingClientRect();
        setProductDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      }
    };

    updateProductPosition();
    window.addEventListener('scroll', updateProductPosition, true);
    window.addEventListener('resize', updateProductPosition);

    return () => {
      window.removeEventListener('scroll', updateProductPosition, true);
      window.removeEventListener('resize', updateProductPosition);
    };
  }, [showProductDropdown]);

  // Fechar dropdown de produtos ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProductDropdown && 
          productInputRef.current && !productInputRef.current.contains(event.target) &&
          productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProductDropdown]);

  useEffect(() => {
    if (budget) {
      const clientData = {
        clientId: budget.clientId || '',
        clientName: budget.clientName || '',
        clientPhone: budget.clientPhone || '',
        clientEmail: budget.clientEmail || '',
        vehicleId: budget.vehicleId || '',
        vehiclePlate: budget.vehiclePlate || '',
        vehicleBrand: budget.vehicleBrand || '',
        vehicleModel: budget.vehicleModel || '',
        vehicleYear: budget.vehicleYear || '',
        vehicleColor: budget.vehicleColor || '',
        items: budget.items || [],
        notes: budget.notes || '',
        internalNotes: budget.internalNotes || ''
      };
      setFormData(clientData);
      
      // Se veio com cliente pré-selecionado
      if (budget.clientName) {
        setSelectedClient({
          id: budget.clientId,
          name: budget.clientName,
          phone: budget.clientPhone,
          email: budget.clientEmail
        });
      }
    } else {
      setSelectedClient(null);
    }
  }, [budget]);

  const handleClientSelect = (client) => {
    if (!client) {
      setSelectedClient(null);
      setFormData(prev => ({
        ...prev,
        clientId: '',
        clientName: '',
        clientPhone: '',
        clientEmail: ''
      }));
      return;
    }

    setSelectedClient(client);
    setFormData(prev => ({
      ...prev,
      clientId: client.id || client.firestoreId,
      clientName: client.name,
      clientPhone: client.phone || '',
      clientEmail: client.email || ''
    }));
  };

  const handleProductSearch = (value) => {
    setProductSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredProducts([]);
      setShowProductDropdown(false);
      return;
    }

    const searchLower = value.toLowerCase();
    const filtered = parts.filter(part => 
      part.currentStock > 0 && (
        part.name?.toLowerCase().includes(searchLower) ||
        part.partNumber?.toLowerCase().includes(searchLower) ||
        part.code?.toLowerCase().includes(searchLower) ||
        part.category?.toLowerCase().includes(searchLower) ||
        part.brand?.toLowerCase().includes(searchLower)
      )
    ).slice(0, 8);

    setFilteredProducts(filtered);
    setShowProductDropdown(filtered.length > 0);
  };

  const handleProductSelect = (product) => {
    setCurrentItem(prev => ({
      ...prev,
      productId: product.firestoreId,
      name: product.name,
      price: product.unitPrice || product.price || 0,
      description: product.description || ''
    }));
    setProductSearchTerm(product.name);
    setShowProductDropdown(false);
  };

  const handleSearchPlate = async () => {
    const plate = formData.vehiclePlate?.trim();
    
    if (!plate) {
      toast.error('Digite uma placa para buscar');
      return;
    }

    if (plate.length < 7) {
      toast.error('Placa inválida. Use o formato ABC1234');
      return;
    }

    setIsSearchingPlate(true);
    
    try {
      const result = await searchVehicleByPlate(plate);
      
      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          vehicleBrand: result.data.brand || result.data.marca || '',
          vehicleModel: result.data.model || result.data.modelo || '',
          vehicleYear: result.data.year || result.data.ano || '',
          vehicleColor: result.data.color || result.data.cor || ''
        }));
        
        toast.success('Dados do veículo encontrados!');
      } else {
        toast.error(result.error || 'Veículo não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar placa:', error);
      toast.error('Erro ao buscar dados do veículo');
    } finally {
      setIsSearchingPlate(false);
    }
  };

  const handleAddItem = () => {
    if (!currentItem.name || currentItem.price <= 0) {
      toast.error('Preencha todos os campos do item');
      return;
    }

    // Check stock for products
    if (currentItem.type === 'product' && currentItem.productId) {
      const product = parts.find(p => p.firestoreId === currentItem.productId);
      if (product && product.currentStock < currentItem.quantity) {
        toast.error(`Estoque insuficiente! Disponível: ${product.currentStock} unidades`);
        return;
      }
    }

    const newItem = {
      ...currentItem,
      id: Date.now().toString(),
      total: currentItem.price * currentItem.quantity
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setCurrentItem({
      type: 'product',
      productId: '',
      name: '',
      description: '',
      quantity: 1,
      price: 0,
      dependsOn: null
    });
  };

  const handleRemoveItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.clientName) {
      toast.error('Selecione ou informe um cliente');
      return;
    }

    if (formData.items.length === 0) {
      toast.error('Adicione pelo menos um item ao orçamento');
      return;
    }

    const budgetData = {
      ...formData,
      total: calculateTotal()
    };

    const result = budget
      ? await updateBudget(budget.firestoreId, budgetData)
      : await createBudget(budgetData);

    if (result.success) {
      toast.success(budget ? 'Orçamento atualizado!' : 'Orçamento criado!');
      onClose();
    } else {
      toast.error(result.error || 'Erro ao salvar orçamento');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal - Apple-like Design - Centralizado e Responsivo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="budget-modal-container relative z-[9999] w-full max-w-6xl my-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-[90vh] flex flex-col"
          style={{ isolation: 'auto', overflow: 'visible' }}
        >
          {/* Header - Apple Style Premium */}
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-3xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} style={{ color: 'white', stroke: 'white' }} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {budget ? 'Editar Orçamento' : 'Novo Orçamento'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {budget ? 'Atualize as informações do orçamento' : 'Preencha os dados para criar um novo orçamento'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" strokeWidth={2.5} />
            </button>
          </div>

          {/* Content - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto budget-modal-content scroll-smooth">
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
              {/* Client Search - Usando componente que funciona */}
              <div className="relative" style={{ zIndex: 1 }}>
                <CampoBuscaCliente
                  value={selectedClient}
                  onSelect={handleClientSelect}
                  error={null}
                />
              </div>

              {/* Dados do Cliente Selecionado */}
              {selectedClient && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 relative" style={{ zIndex: 0 }}>
                  {/* Telefone */}
                  {selectedClient.phone && (
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        Telefone
                      </label>
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {selectedClient.phone}
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {selectedClient.email && (
                    <div>
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        Email
                      </label>
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white">
                        {selectedClient.email}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Vehicle Info - Apple Style */}
              <div className="mt-8 relative" style={{ zIndex: 0 }}>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  Veículo
                </label>
                
                {/* Placa com Busca */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="md:col-span-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.vehiclePlate}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehiclePlate: e.target.value.toUpperCase() }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearchPlate();
                          }
                        }}
                        placeholder="ABC-1234"
                        maxLength={8}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all uppercase"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        Placa
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleSearchPlate}
                      disabled={isSearchingPlate || !formData.vehiclePlate}
                      className="w-full h-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:from-indigo-700 active:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-purple-500/40 flex items-center justify-center gap-2"
                    >
                      {isSearchingPlate ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Buscando dados...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" strokeWidth={2.5} />
                          Buscar Dados do Veículo
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Marca, Modelo, Ano, Cor */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <input
                      type="text"
                      value={formData.vehicleBrand}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicleBrand: e.target.value }))}
                      placeholder="Marca"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                      placeholder="Modelo"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.vehicleYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                      placeholder="Ano"
                      maxLength={4}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formData.vehicleColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicleColor: e.target.value }))}
                      placeholder="Cor"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Itens do Orçamento</h3>
                
                {/* Add Item Form - Apple Style */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 mb-4 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                  {/* Tipo de Item */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Tipo
                      </label>
                      <select
                        value={currentItem.type}
                        onChange={(e) => {
                          setCurrentItem(prev => ({ ...prev, type: e.target.value, name: '', productId: '' }));
                          setProductSearchTerm('');
                        }}
                        className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      >
                        <option value="product">Produto</option>
                        <option value="service">Serviço</option>
                      </select>
                    </div>
                    
                    {/* Busca de Produto ou Nome de Serviço */}
                    <div className="relative product-search-container">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {currentItem.type === 'product' ? 'Produto' : 'Nome do Serviço'}
                      </label>
                      {currentItem.type === 'product' ? (
                        <>
                          <input
                            ref={productInputRef}
                            type="text"
                            value={productSearchTerm}
                            onChange={(e) => handleProductSearch(e.target.value)}
                            onFocus={() => {
                              if (filteredProducts.length > 0) {
                                setShowProductDropdown(true);
                              }
                            }}
                            placeholder="Buscar produto..."
                            className="w-full px-3 py-2.5 pr-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                          />
                          <div className="absolute right-3 top-[34px] pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>

                          {/* Dropdown de Produtos */}
                          {showProductDropdown && filteredProducts.length > 0 && createPortal(
                            <div 
                              ref={productDropdownRef}
                              className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
                              style={{
                                top: `${productDropdownPosition.top}px`,
                                left: `${productDropdownPosition.left}px`,
                                width: `${productDropdownPosition.width}px`,
                                zIndex: 999999,
                                isolation: 'isolate'
                              }}
                            >
                              <div className="max-h-64 overflow-y-auto">
                                {filteredProducts.map((product, index) => (
                                  <button
                                    key={product.firestoreId}
                                    type="button"
                                    onClick={() => handleProductSelect(product)}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                      index !== filteredProducts.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                          {product.name}
                                        </div>
                                        {(product.partNumber || product.code) && (
                                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            Código: {product.partNumber || product.code}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                          R$ {product.unitPrice?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          product.currentStock > 10 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : product.currentStock > 0
                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                          {product.currentStock} em estoque
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>,
                            document.body
                          )}

                          {/* Empty State */}
                          {productSearchTerm && filteredProducts.length === 0 && showProductDropdown && createPortal(
                            <div 
                              ref={productDropdownRef}
                              className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 text-center pointer-events-auto"
                              style={{
                                top: `${productDropdownPosition.top}px`,
                                left: `${productDropdownPosition.left}px`,
                                width: `${productDropdownPosition.width}px`,
                                zIndex: 999999,
                                isolation: 'isolate'
                              }}
                            >
                              <svg className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Nenhum produto encontrado</p>
                            </div>,
                            document.body
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          placeholder="Nome do serviço"
                          value={currentItem.name}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                      )}
                    </div>
                  </div>
                  {/* Quantidade e Preço */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Quantidade */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Quantidade
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="1"
                          min="1"
                          value={currentItem.quantity}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                          className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Preço Unitário */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Preço Unitário (R$)
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">R$</span>
                        </div>
                        <input
                          type="number"
                          placeholder="0,00"
                          min="0"
                          step="0.01"
                          value={currentItem.price}
                          onChange={(e) => setCurrentItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Botão Adicionar */}
                    <div>
                      <label className="block text-xs font-medium text-transparent mb-2">
                        Ação
                      </label>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="w-full h-[42px] flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all hover:shadow-lg hover:shadow-blue-500/30"
                      >
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {/* Preview do Total */}
                  {currentItem.quantity > 0 && currentItem.price > 0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subtotal do item:
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        R$ {(currentItem.quantity * currentItem.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={item.id} className="group relative flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                      {/* Número do Item */}
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                          {index + 1}
                        </span>
                      </div>

                      {/* Informações do Item */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-white truncate">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                                {item.quantity}x
                              </span>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className="flex items-center gap-1">
                                <span className="font-medium">R$</span>
                                {item.price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Total do Item */}
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                Subtotal
                              </div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                R$ {item.total.toFixed(2)}
                              </div>
                            </div>

                            {/* Botão Remover */}
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Remover item"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Geral */}
                <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                        Total do Orçamento
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.items.length} {formData.items.length === 1 ? 'item' : 'itens'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        R$ {calculateTotal().toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Observações (visível para o cliente)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notas Internas (apenas para a oficina)
                </label>
                <textarea
                  value={formData.internalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Expiration Info */}
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <p className="font-semibold mb-1">Validade do Orçamento</p>
                    <p>Este orçamento expira em 48h para garantir o controle de estoque e quantidades atualizadas.</p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer - Apple Style Premium */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-md"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="budget-btn-primary px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:from-blue-800 active:to-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
            >
              {budget ? 'Atualizar' : 'Criar'} Orçamento
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BudgetModal;
