/**
 * TORQ PDV Premium - Apple-like Point of Sale
 * 
 * Design: Clean, minimal, sophisticated
 * Layout: CSS Grid with fixed cart sidebar
 * UX: Fast, intuitive, professional
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Phosphor Icons - Premium elegant icons
import { 
  MagnifyingGlass, ShoppingCartSimple, User, Package, Wrench, Plus, Minus, Trash, 
  X, Check, WarningCircle, CreditCard, UserPlus, Car, SquaresFour, List, Star,
  Sparkle, GearSix, Storefront, CaretRight, Receipt, Tag
} from '@phosphor-icons/react';
import { useAuthStore, useInventoryStore, useClientStore } from '../store';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { activityService } from '../config/activityService';
import PaymentModal from '../components/modals/PaymentModal';
import SaleConfirmationModal from '../components/modals/SaleConfirmationModal';
import PrintReceiptModal from '../components/modals/PrintReceiptModal';
import TaxPreviewModal from '../components/modals/TaxPreviewModal';
import PrinterConfigModal from '../components/modals/PrinterConfigModal';
import configService from '../config/configService';
import taxCalculationService from '../config/taxCalculationService';
import printService from '../config/printService';
import productService from '../config/productService';

// Import styles
import '../styles/pdv-premium.css';
import '../styles/client-modal.css';

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Sparkle },
  { id: 'produtos', label: 'Produtos', icon: Package },
  { id: 'servicos', label: 'Serviços', icon: Wrench },
  { id: 'pecas', label: 'Peças', icon: GearSix },
  { id: 'acessorios', label: 'Acessórios', icon: Star },
];

// ============================================================================
// UTILITIES
// ============================================================================

const formatCurrency = (value) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const formatPhone = (phone) => {
  if (!phone) return '';
  const c = phone.replace(/\D/g, '');
  return c.length === 11 ? `(${c.slice(0,2)}) ${c.slice(2,7)}-${c.slice(7)}` : phone;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Product Card - Grid View
const ProductCard = ({ product, onAdd }) => {
  const hasStock = product.quantidade > 0;
  
  return (
    <div 
      className={`pdv-product ${!hasStock ? 'pdv-product--disabled' : ''}`}
      onClick={() => hasStock && onAdd(product)}
    >
      <div className="pdv-product__image">
        {product.imagem ? (
          <img src={product.imagem} alt={product.nome} loading="lazy" />
        ) : (
          <Package weight="duotone" size={40} />
        )}
        <span className={`pdv-product__badge ${hasStock ? 'pdv-product__badge--stock' : 'pdv-product__badge--out'}`}>
          {product.quantidade}
        </span>
        {hasStock && (
          <button 
            className="pdv-product__add" 
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          >
            <Plus weight="bold" size={18} />
          </button>
        )}
      </div>
      <div className="pdv-product__body">
        <div className="pdv-product__code">{product.codigo || 'S/C'}</div>
        <div className="pdv-product__name">{product.nome}</div>
        <div className="pdv-product__price">{formatCurrency(product.preco)}</div>
      </div>
    </div>
  );
};

// Product Row - List View
const ProductRow = ({ product, onAdd }) => {
  const hasStock = product.quantidade > 0;
  
  return (
    <div 
      className={`pdv-product-row ${!hasStock ? 'pdv-product-row--disabled' : ''}`}
      onClick={() => hasStock && onAdd(product)}
    >
      <div className="pdv-product-row__image">
        {product.imagem ? (
          <img src={product.imagem} alt="" loading="lazy" />
        ) : (
          <Package weight="duotone" size={24} />
        )}
      </div>
      <div className="pdv-product-row__info">
        <div className="pdv-product-row__name">{product.nome}</div>
        <div className="pdv-product-row__code">{product.codigo || 'Sem código'}</div>
      </div>
      <div className="pdv-product-row__meta">
        <div className="pdv-product-row__price">{formatCurrency(product.preco)}</div>
        <div className="pdv-product-row__stock">{product.quantidade} un</div>
      </div>
      <button 
        className="pdv-product-row__add" 
        onClick={(e) => { e.stopPropagation(); hasStock && onAdd(product); }}
        disabled={!hasStock}
      >
        <Plus weight="bold" size={18} />
      </button>
    </div>
  );
};

// Cart Item
const CartItem = React.forwardRef(({ item, onUpdateQuantity, onRemove }, ref) => (
  <motion.div 
    ref={ref}
    className="pdv-cart-item"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    layout
  >
    <div className="pdv-cart-item__image">
      {item.imagem ? (
        <img src={item.imagem} alt="" />
      ) : (
        <Package weight="duotone" size={20} />
      )}
    </div>
    <div className="pdv-cart-item__info">
      <div className="pdv-cart-item__name">{item.nome}</div>
      <div className="pdv-cart-item__qty">
        <button 
          className="pdv-cart-item__qty-btn" 
          onClick={() => onUpdateQuantity(item.id, item.quantidade - 1)}
        >
          <Minus weight="bold" size={14} />
        </button>
        <span className="pdv-cart-item__qty-value">{item.quantidade}</span>
        <button 
          className="pdv-cart-item__qty-btn" 
          onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}
        >
          <Plus weight="bold" size={14} />
        </button>
      </div>
    </div>
    <div className="pdv-cart-item__actions">
      <button className="pdv-cart-item__remove" onClick={() => onRemove(item.id)}>
        <Trash weight="bold" size={14} />
      </button>
      <span className="pdv-cart-item__subtotal">{formatCurrency(item.preco * item.quantidade)}</span>
    </div>
  </motion.div>
));

// Toast Notification
const Toast = ({ message, type = 'success' }) => (
  <motion.div
    className={`pdv-toast pdv-toast--${type}`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    {type === 'success' ? <Check weight="bold" size={18} /> : <WarningCircle weight="fill" size={18} />}
    <span>{message}</span>
  </motion.div>
);

// ============================================================================
// CLIENT SEARCH MODAL - APPLE MINIMAL DESIGN
// ============================================================================
const ClientSearchModal = ({ isOpen, onClose, onSelect }) => {
  const { clients, isLoading, fetchClients, createClient } = useClientStore();
  const [search, setSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newClient, setNewClient] = useState({ nome: '', telefone: '', email: '', cpfCnpj: '' });
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  // Fetch clients on mount
  useEffect(() => {
    if (isOpen && clients.length === 0) {
      fetchClients();
    }
  }, [isOpen, clients.length, fetchClients]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    if (!isOpen) {
      setSearch('');
      setShowNewForm(false);
      setNewClient({ nome: '', telefone: '', email: '', cpfCnpj: '' });
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!search.trim()) return clients.slice(0, 50);
    const t = search.toLowerCase();
    return clients.filter(c => 
      c.name?.toLowerCase().includes(t) || 
      c.nome?.toLowerCase().includes(t) ||
      c.phone?.includes(t) ||
      c.telefone?.includes(t) ||
      c.email?.toLowerCase().includes(t) ||
      c.cpf?.includes(t) ||
      c.cpfCnpj?.includes(t)
    ).slice(0, 50);
  }, [clients, search]);

  const handleCreateClient = async () => {
    if (!newClient.nome.trim()) return;
    setSaving(true);
    try {
      const result = await createClient({
        name: newClient.nome,
        nome: newClient.nome,
        phone: newClient.telefone,
        telefone: newClient.telefone,
        email: newClient.email,
        cpf: newClient.cpfCnpj?.length <= 14 ? newClient.cpfCnpj : '',
        cnpj: newClient.cpfCnpj?.length > 14 ? newClient.cpfCnpj : '',
        cpfCnpj: newClient.cpfCnpj,
      });
      if (result.success) {
        onSelect(result.data);
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cm-overlay" onClick={onClose}>
      <motion.div 
        className="cm-modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <div className="cm-header">
          <span className="cm-title">Clientes</span>
          <button className="cm-close" onClick={onClose}>
            <X weight="regular" size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="cm-search-wrap">
          <MagnifyingGlass weight="regular" size={16} className="cm-search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cliente..."
            className="cm-search"
          />
        </div>

        {/* Content */}
        {showNewForm ? (
          <div className="cm-form">
            <div className="cm-form-field">
              <label>Nome *</label>
              <input
                type="text"
                value={newClient.nome}
                onChange={e => setNewClient(p => ({ ...p, nome: e.target.value }))}
                placeholder="Nome completo"
                autoFocus
              />
            </div>
            <div className="cm-form-field">
              <label>Telefone</label>
              <input
                type="tel"
                value={newClient.telefone}
                onChange={e => setNewClient(p => ({ ...p, telefone: e.target.value }))}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="cm-form-field">
              <label>Email</label>
              <input
                type="email"
                value={newClient.email}
                onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="cm-form-field">
              <label>CPF/CNPJ</label>
              <input
                type="text"
                value={newClient.cpfCnpj}
                onChange={e => setNewClient(p => ({ ...p, cpfCnpj: e.target.value }))}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="cm-form-actions">
              <button className="cm-btn-secondary" onClick={() => setShowNewForm(false)}>
                Cancelar
              </button>
              <button 
                className="cm-btn-primary" 
                onClick={handleCreateClient}
                disabled={!newClient.nome.trim() || saving}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        ) : (
          <div className="cm-list">
            {isLoading ? (
              <div className="cm-loading">
                <div className="cm-spinner" />
              </div>
            ) : filtered.length > 0 ? (
              filtered.map(client => (
                <button
                  key={client.id || client.firestoreId}
                  className="cm-item"
                  onClick={() => { onSelect(client); onClose(); }}
                >
                  <div className="cm-avatar">
                    {(client.name || client.nome)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="cm-info">
                    <span className="cm-name">{client.name || client.nome}</span>
                    <span className="cm-detail">
                      {client.phone || client.telefone || client.email || '—'}
                    </span>
                  </div>
                  <CaretRight weight="regular" size={16} className="cm-arrow" />
                </button>
              ))
            ) : (
              <div className="cm-empty">
                <span>Nenhum cliente encontrado</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!showNewForm && (
          <div className="cm-footer">
            <button className="cm-new-btn" onClick={() => setShowNewForm(true)}>
              <Plus weight="regular" size={16} />
              <span>Novo Cliente</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CaixaPremium = () => {
  const { user: currentUser } = useAuthStore();
  const { parts: inventoryProducts, fetchParts, isLoading: inventoryLoading } = useInventoryStore();
  
  // State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSaleConfirmationModal, setShowSaleConfirmationModal] = useState(false);
  const [showPrintReceiptModal, setShowPrintReceiptModal] = useState(false);
  const [showTaxPreview, setShowTaxPreview] = useState(false);
  const [showPrinterConfig, setShowPrinterConfig] = useState(false);
  const [lastSaleData, setLastSaleData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [taxCalculation, setTaxCalculation] = useState(null);
  const [paymentModalKey, setPaymentModalKey] = useState(0);
  
  const searchInputRef = useRef(null);
  
  // Computed
  const cartTotal = useMemo(() => 
    cartItems.reduce((sum, item) => sum + (item.preco * item.quantidade), 0), 
    [cartItems]
  );
  const cartItemsCount = useMemo(() => 
    cartItems.reduce((sum, item) => sum + item.quantidade, 0), 
    [cartItems]
  );

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    activityService.logCaixaAccess();
    fetchParts().catch(console.error);
  }, []);
  
  useEffect(() => {
    if (inventoryProducts?.length > 0) {
      setProducts(inventoryProducts.map(p => ({
        id: p.firestoreId || p.id,
        nome: p.name || p.nome || 'Produto',
        preco: parseFloat(p.unitPrice || p.price || p.preco || 0),
        quantidade: parseInt(p.quantity || p.quantidade || p.currentStock || 0, 10),
        categoria: p.category || p.categoria || 'Geral',
        codigo: p.partNumber || p.sku || p.codigo || '',
        imagem: p.image || p.imagem || '',
        custo: parseFloat(p.cost || p.custo) || 0,
      })));
    }
  }, [inventoryProducts]);
  
  useEffect(() => {
    let f = products;
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      f = f.filter(p => p.nome?.toLowerCase().includes(t) || p.codigo?.includes(searchTerm));
    }
    if (selectedCategory !== 'all') {
      f = f.filter(p => {
        const prodCat = (p.categoria || '').toLowerCase().trim();
        const selCat = selectedCategory.toLowerCase();
        
        // Se produto não tem categoria, mostrar em "Produtos" (categoria padrão)
        if (!prodCat || prodCat === '' || prodCat === 'geral' || prodCat === 'outros') {
          return selCat === 'produtos';
        }
        
        // Mapeia categorias do PDV para possíveis valores do inventário
        const categoryMappings = {
          'produtos': ['produto', 'produtos', 'geral', 'item', 'itens', 'outros', 'other', 'general', 'mercadoria', 'mercadorias'],
          'servicos': ['serviço', 'servico', 'serviços', 'servicos', 'service', 'services', 'mão de obra', 'mao de obra', 'labor'],
          'pecas': ['peça', 'peca', 'peças', 'pecas', 'part', 'parts', 'autopeça', 'autopeca', 'autopeças', 'autopecas', 'componente', 'componentes'],
          'acessorios': ['acessório', 'acessorio', 'acessórios', 'acessorios', 'accessory', 'accessories', 'acessorio automotivo']
        };
        
        const mappedCategories = categoryMappings[selCat] || [selCat];
        return mappedCategories.some(cat => prodCat.includes(cat) || cat.includes(prodCat));
      });
    }
    setFilteredProducts(f);
  }, [products, searchTerm, selectedCategory]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'F2') { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === 'F3') { e.preventDefault(); setShowClientModal(true); }
      if (e.key === 'F4' && cartItems.length > 0) { e.preventDefault(); handleCheckout(); }
      if (e.key === 'Escape' && searchTerm) setSearchTerm('');
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [cartItems, searchTerm]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const showNotification = useCallback((msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 2500);
  }, []);
  
  const addToCart = useCallback((product) => {
    const existing = cartItems.find(i => i.id === product.id);
    const qty = existing ? existing.quantidade + 1 : 1;
    if (qty > product.quantidade) { 
      showNotification('Estoque insuficiente', 'error'); 
      return; 
    }
    if (existing) {
      setCartItems(items => items.map(i => 
        i.id === product.id ? { ...i, quantidade: i.quantidade + 1 } : i
      ));
    } else {
      setCartItems(items => [...items, { ...product, quantidade: 1 }]);
    }
    showNotification(`${product.nome} adicionado`);
  }, [cartItems, showNotification]);
  
  const updateCartQuantity = useCallback((id, qty) => {
    if (qty <= 0) { 
      setCartItems(items => items.filter(i => i.id !== id)); 
      showNotification('Item removido'); 
      return; 
    }
    const product = products.find(p => p.id === id);
    if (qty > product?.quantidade) { 
      showNotification('Estoque insuficiente', 'error'); 
      return; 
    }
    setCartItems(items => items.map(i => i.id === id ? { ...i, quantidade: qty } : i));
  }, [products, showNotification]);
  
  const removeFromCart = useCallback((id) => {
    setCartItems(items => items.filter(i => i.id !== id));
    showNotification('Item removido');
  }, [showNotification]);
  
  const clearCart = useCallback(async () => {
    for (const item of cartItems) {
      await productService.reduceStock(item.id, item.quantidade);
    }
    setCartItems([]);
    await fetchParts();
  }, [cartItems, fetchParts]);
  
  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) { 
      showNotification('Carrinho vazio', 'error'); 
      return; 
    }
    setLastSaleData({ 
      items: cartItems, 
      total: cartTotal, 
      timestamp: new Date().toISOString(), 
      vendedor: currentUser?.displayName || currentUser?.email, 
      cliente: selectedClient 
    });
    setPaymentModalKey(k => k + 1);
    setShowPaymentModal(true);
  }, [cartItems, cartTotal, currentUser, selectedClient, showNotification]);
  
  const handlePaymentConfirm = useCallback((payment) => {
    setLastSaleData(prev => ({ 
      ...prev, 
      desconto: payment.desconto || 0, 
      subtotal: payment.subtotal, 
      total: payment.totalComDesconto 
    }));
    setPaymentData(payment);
    setShowPaymentModal(false);
    setShowSaleConfirmationModal(true);
  }, []);
  
  const handleSaleConfirm = useCallback(async (confirmationData) => {
    try {
      setCustomerData(confirmationData.customer);
      const vendaData = {
        items: cartItems.map(i => ({ 
          id: i.id, nome: i.nome, preco: i.preco, quantidade: i.quantidade, 
          total: i.preco * i.quantidade, custo: i.custo || 0, categoria: i.categoria 
        })),
        subtotal: paymentData.subtotal, 
        desconto: paymentData.desconto || 0, 
        total: paymentData.totalComDesconto,
        paymentMethod: paymentData?.pagamentos?.[0]?.metodo || 'não informado', 
        paymentDetails: paymentData,
        timestamp: new Date(), 
        createdAt: new Date(), 
        dataVenda: new Date().toISOString().split('T')[0],
        numero: Date.now().toString(), 
        vendedor: currentUser?.displayName || currentUser?.email,
        customer: confirmationData.customer, 
        userId: currentUser.uid, 
        empresaId: currentUser.empresaId, 
        nfId: null, 
        syncStatus: 'pending'
      };
      
      const vendaDoc = await addDoc(collection(db, 'vendas'), vendaData);
      await activityService.logSaleCompleted(paymentData.totalComDesconto.toFixed(2));
      
      setLastSaleData(prev => ({ 
        ...prev, 
        ...confirmationData, 
        id: vendaDoc.id, 
        numero: Date.now().toString(), 
        timestamp: new Date(), 
        items: cartItems 
      }));
      
      setShowSaleConfirmationModal(false);
      
      if (confirmationData.options.generateNFe) {
        const config = await configService.getConfig(currentUser.uid);
        setTaxCalculation(taxCalculationService.calculateTaxes(
          { items: cartItems, subtotal: cartTotal, discount: 0, total: cartTotal, customer: confirmationData.customer }, 
          config, 
          products
        ));
        setShowTaxPreview(true);
      }
      
      if (confirmationData.options.printReceipt) {
        setShowPrintReceiptModal(true);
      }
      
      if (!confirmationData.options.generateNFe && !confirmationData.options.printReceipt) {
        await clearCart();
      }
      
      showNotification('Venda finalizada!');
    } catch (error) { 
      console.error(error); 
      showNotification('Erro ao finalizar', 'error'); 
    }
  }, [cartItems, cartTotal, currentUser, paymentData, clearCart, showNotification, products]);
  
  const handlePrintReceipt = useCallback(async (receiptData) => {
    const result = await printService.printReceipt(receiptData, currentUser?.uid);
    showNotification(result.message, result.success ? 'success' : 'error');
    setShowPrintReceiptModal(false);
    await clearCart();
  }, [currentUser, clearCart, showNotification]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="pdv-container">
      {/* ================================================================
          HEADER - 3 Column Layout: Logo | Search (centered) | Client
          ================================================================ */}
      <header className="pdv-header" style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* LEFT: Logo */}
        <div className="pdv-header__left" style={{ flex: '0 0 auto' }}>
          <div className="pdv-header__logo">
            <div className="pdv-header__logo-icon">
              <Storefront weight="fill" size={20} />
            </div>
            <span className="pdv-header__logo-text">PDV</span>
          </div>
        </div>
        
        {/* CENTER: Search Bar (horizontally centered) */}
        <div className="pdv-header__center" style={{ 
          flex: '1 1 auto',
          display: 'flex', 
          justifyContent: 'center'
        }}>
          <div className="pdv-search" style={{ width: '100%', maxWidth: '550px' }}>
            <MagnifyingGlass className="pdv-search__icon" weight="bold" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produto ou serviço..."
              className="pdv-search__input"
            />
            <span className="pdv-search__shortcut">F2</span>
          </div>
        </div>
        
        {/* RIGHT: Client Selector */}
        <div className="pdv-header__right" style={{ flex: '0 0 auto' }}>
          <div className="pdv-client">
            {selectedClient ? (
              <div className="pdv-client__selected">
                <div className="pdv-client__avatar">
                  {(selectedClient.name || selectedClient.nome)?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div className="pdv-client__info">
                  <span className="pdv-client__name">
                    {selectedClient.name || selectedClient.nome || 'Cliente'}
                  </span>
                  <span className="pdv-client__phone">
                    {formatPhone(selectedClient.phone || selectedClient.telefone) || selectedClient.email || '—'}
                  </span>
                </div>
                <button 
                  className="pdv-client__remove" 
                  onClick={() => setSelectedClient(null)}
                  title="Remover cliente"
                >
                  <X weight="regular" size={14} />
                </button>
              </div>
            ) : (
              <button 
                className="pdv-client__btn" 
                onClick={() => setShowClientModal(true)}
              >
                <User weight="regular" size={16} />
                <span>Cliente (F3)</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================================================================
          CATALOG
          ================================================================ */}
      <div className="pdv-catalog">
        <div className="pdv-tabs">
          <div className="pdv-tabs__list">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`pdv-tabs__item ${selectedCategory === cat.id ? 'pdv-tabs__item--active' : ''}`}
                >
                  <Icon weight={selectedCategory === cat.id ? 'fill' : 'duotone'} size={18} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="pdv-tabs__view">
            <button
              onClick={() => setViewMode('grid')}
              className={`pdv-tabs__view-btn ${viewMode === 'grid' ? 'pdv-tabs__view-btn--active' : ''}`}
            >
              <SquaresFour weight={viewMode === 'grid' ? 'fill' : 'duotone'} size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`pdv-tabs__view-btn ${viewMode === 'list' ? 'pdv-tabs__view-btn--active' : ''}`}
            >
              <List weight={viewMode === 'list' ? 'fill' : 'duotone'} size={18} />
            </button>
          </div>
        </div>
        
        <div className="pdv-products">
          {inventoryLoading ? (
            <div className="pdv-loading">
              <div className="pdv-spinner" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div 
                  key="grid-view"
                  className="pdv-products__grid"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  {filteredProducts.map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: Math.min(index * 0.02, 0.3),
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    >
                      <ProductCard product={p} onAdd={addToCart} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="list-view"
                  className="pdv-products__list"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  {filteredProducts.map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: Math.min(index * 0.015, 0.2),
                        ease: [0.4, 0, 0.2, 1]
                      }}
                    >
                      <ProductRow product={p} onAdd={addToCart} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="pdv-empty">
              <Package weight="duotone" size={64} />
              <span className="pdv-empty__title">
                {searchTerm ? `Sem resultados para "${searchTerm}"` : 'Nenhum produto cadastrado'}
              </span>
              {searchTerm && (
                <button className="pdv-empty__action" onClick={() => setSearchTerm('')}>
                  Limpar busca
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="pdv-catalog__footer">
          <span className="pdv-catalog__count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'itens'}
            {searchTerm && ` • "${searchTerm}"`}
          </span>
        </div>
      </div>

      {/* ================================================================
          CART SIDEBAR
          ================================================================ */}
      <aside className="pdv-cart" style={{ 
        paddingLeft: '20px',
        paddingRight: '24px'
      }}>
        <div className="pdv-cart__header">
          <div className="pdv-cart__title">
            <ShoppingCartSimple weight="duotone" size={22} />
            <span>Carrinho</span>
            {cartItemsCount > 0 && (
              <span className="pdv-cart__badge">{cartItemsCount}</span>
            )}
          </div>
          {cartItems.length > 0 && (
            <button className="pdv-cart__clear" onClick={() => setCartItems([])}>
              Limpar
            </button>
          )}
        </div>
        
        {cartItems.length > 0 ? (
          <div className="pdv-cart__items">
            <AnimatePresence mode="popLayout">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateCartQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="pdv-cart__empty">
            <ShoppingCartSimple weight="duotone" size={56} />
            <span className="pdv-cart__empty-text">Carrinho vazio</span>
          </div>
        )}
        
        <div className="pdv-cart__footer">
          <div className="pdv-cart__totals">
            <div className="pdv-cart__row">
              <span className="pdv-cart__label">Subtotal</span>
              <span className="pdv-cart__value">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="pdv-cart__row">
              <span className="pdv-cart__label">Itens</span>
              <span className="pdv-cart__value">{cartItemsCount}</span>
            </div>
            <div className="pdv-cart__divider" />
            <div className="pdv-cart__row pdv-cart__row--total">
              <span className="pdv-cart__label">Total</span>
              <span className="pdv-cart__value">{formatCurrency(cartTotal)}</span>
            </div>
          </div>
          
          <button
            className="pdv-checkout"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            <CreditCard weight="duotone" size={20} />
            <span>Finalizar Venda (F4)</span>
          </button>
        </div>
      </aside>

      {/* ================================================================
          MODALS
          ================================================================ */}
      <AnimatePresence>
        {showClientModal && (
          <ClientSearchModal
            isOpen={showClientModal}
            onClose={() => setShowClientModal(false)}
            onSelect={setSelectedClient}
          />
        )}
      </AnimatePresence>
      
      <PaymentModal
        key={paymentModalKey}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentConfirm}
        total={lastSaleData?.total || 0}
        cartItems={lastSaleData?.items || []}
        saleData={lastSaleData}
      />
      
      <SaleConfirmationModal
        isOpen={showSaleConfirmationModal}
        onClose={() => setShowSaleConfirmationModal(false)}
        onConfirm={handleSaleConfirm}
        saleData={lastSaleData}
        paymentData={paymentData}
      />
      
      <PrintReceiptModal
        isOpen={showPrintReceiptModal}
        onClose={() => setShowPrintReceiptModal(false)}
        onPrint={handlePrintReceipt}
        onDownload={() => {}}
        saleData={lastSaleData}
        customerData={customerData}
        paymentData={paymentData}
        cartItems={lastSaleData?.items || cartItems}
      />
      
      <TaxPreviewModal
        isOpen={showTaxPreview}
        onClose={async () => { setShowTaxPreview(false); await clearCart(); }}
        onConfirm={() => setShowTaxPreview(false)}
        saleData={{ items: cartItems, subtotal: cartTotal, discount: 0, total: cartTotal, customer: selectedClient }}
        clearCart={clearCart}
      />
      
      <PrinterConfigModal
        isOpen={showPrinterConfig}
        onClose={() => setShowPrinterConfig(false)}
        onSave={() => showNotification('Configurações salvas!')}
      />
      
      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <Toast message={notification.message} type={notification.type} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaixaPremium;
