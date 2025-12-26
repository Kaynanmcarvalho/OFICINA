/**
 * TORQ PDV Premium - Apple-like Point of Sale
 * 
 * Design: Clean, minimal, sophisticated
 * Layout: CSS Grid with fixed cart sidebar
 * UX: Fast, intuitive, professional
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingCart, User, Package, Wrench, Plus, Minus, Trash2, 
  X, Check, AlertCircle, CreditCard, UserPlus, Car, LayoutGrid, List, Star,
  Sparkles, Settings
} from 'lucide-react';
import { useAuthStore, useInventoryStore } from '../store';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
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

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Sparkles },
  { id: 'produtos', label: 'Produtos', icon: Package },
  { id: 'servicos', label: 'Serviços', icon: Wrench },
  { id: 'pecas', label: 'Peças', icon: Settings },
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
          <Package strokeWidth={1.5} />
        )}
        <span className={`pdv-product__badge ${hasStock ? 'pdv-product__badge--stock' : 'pdv-product__badge--out'}`}>
          {product.quantidade}
        </span>
        {hasStock && (
          <button 
            className="pdv-product__add" 
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          >
            <Plus strokeWidth={2} />
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
          <Package strokeWidth={1.5} />
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
        <Plus strokeWidth={2} />
      </button>
    </div>
  );
};

// Cart Item
const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <motion.div 
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
        <Package strokeWidth={1.5} />
      )}
    </div>
    <div className="pdv-cart-item__info">
      <div className="pdv-cart-item__name">{item.nome}</div>
      <div className="pdv-cart-item__qty">
        <button 
          className="pdv-cart-item__qty-btn" 
          onClick={() => onUpdateQuantity(item.id, item.quantidade - 1)}
        >
          <Minus strokeWidth={2} />
        </button>
        <span className="pdv-cart-item__qty-value">{item.quantidade}</span>
        <button 
          className="pdv-cart-item__qty-btn" 
          onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}
        >
          <Plus strokeWidth={2} />
        </button>
      </div>
    </div>
    <div className="pdv-cart-item__actions">
      <button className="pdv-cart-item__remove" onClick={() => onRemove(item.id)}>
        <Trash2 strokeWidth={2} />
      </button>
      <span className="pdv-cart-item__subtotal">{formatCurrency(item.preco * item.quantidade)}</span>
    </div>
  </motion.div>
);

// Toast Notification
const Toast = ({ message, type = 'success' }) => (
  <motion.div
    className={`pdv-toast pdv-toast--${type}`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    {type === 'success' ? <Check strokeWidth={2} /> : <AlertCircle strokeWidth={2} />}
    <span>{message}</span>
  </motion.div>
);

// Client Search Modal
const ClientSearchModal = ({ isOpen, onClose, onSelect, clients, isLoading }) => {
  const [search, setSearch] = useState('');
  
  const filtered = useMemo(() => {
    if (!search.trim()) return clients.slice(0, 20);
    const t = search.toLowerCase();
    return clients.filter(c => 
      c.nome?.toLowerCase().includes(t) || c.telefone?.includes(t)
    ).slice(0, 20);
  }, [clients, search]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div 
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'var(--pdv-surface)', boxShadow: 'var(--pdv-shadow-lg)' }}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="p-4" style={{ borderBottom: '1px solid var(--pdv-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontSize: 'var(--pdv-font-md)', fontWeight: 600, color: 'var(--pdv-text-primary)' }}>
              Selecionar Cliente
            </h2>
            <button 
              onClick={onClose}
              style={{ 
                padding: 6, borderRadius: 8, background: 'transparent', border: 'none',
                color: 'var(--pdv-text-secondary)', cursor: 'pointer'
              }}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
          <div className="pdv-search">
            <Search className="pdv-search__icon" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou telefone..."
              className="pdv-search__input"
              autoFocus
            />
          </div>
        </div>
        
        <div style={{ maxHeight: 320, overflowY: 'auto', padding: 8 }}>
          {isLoading ? (
            <div className="pdv-loading"><div className="pdv-spinner" /></div>
          ) : filtered.length > 0 ? (
            filtered.map(client => (
              <button
                key={client.id}
                onClick={() => { onSelect(client); onClose(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: 12, borderRadius: 8, border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--pdv-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="pdv-client__avatar">
                  {client.nome?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ 
                    fontSize: 'var(--pdv-font-sm)', fontWeight: 500, 
                    color: 'var(--pdv-text-primary)', marginBottom: 2 
                  }}>
                    {client.nome}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--pdv-text-secondary)' }}>
                    {formatPhone(client.telefone)}
                  </p>
                </div>
                {client.vehicles?.length > 0 && (
                  <span style={{ 
                    fontSize: 11, color: 'var(--pdv-text-tertiary)', 
                    display: 'flex', alignItems: 'center', gap: 4 
                  }}>
                    <Car size={14} strokeWidth={1.5} />
                    {client.vehicles[0].placa}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="pdv-empty" style={{ minHeight: 200 }}>
              <User strokeWidth={1.5} />
              <span className="pdv-empty__text">Nenhum cliente encontrado</span>
            </div>
          )}
        </div>
        
        <div style={{ padding: 12, borderTop: '1px solid var(--pdv-border)', background: 'var(--pdv-bg)' }}>
          <button 
            className="pdv-client__btn" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <UserPlus size={14} strokeWidth={2} />
            <span>Novo cliente</span>
          </button>
        </div>
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
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(false);
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
      f = f.filter(p => p.categoria?.toLowerCase() === selectedCategory.toLowerCase());
    }
    setFilteredProducts(f);
  }, [products, searchTerm, selectedCategory]);
  
  useEffect(() => {
    if (!currentUser?.empresaId) return;
    setClientsLoading(true);
    getDocs(query(collection(db, 'clients'), where('empresaId', '==', currentUser.empresaId)))
      .then(snap => setClients(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .finally(() => setClientsLoading(false));
  }, [currentUser?.empresaId]);

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
              <ShoppingCart strokeWidth={2} />
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
            <Search className="pdv-search__icon" strokeWidth={2} />
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
                  {selectedClient.nome?.charAt(0).toUpperCase()}
                </div>
                <div className="pdv-client__info">
                  <span className="pdv-client__name">{selectedClient.nome}</span>
                  <span className="pdv-client__phone">{formatPhone(selectedClient.telefone)}</span>
                </div>
                <button 
                  className="pdv-client__remove" 
                  onClick={() => setSelectedClient(null)}
                >
                  <X strokeWidth={2} />
                </button>
              </div>
            ) : (
              <button 
                className="pdv-client__btn" 
                onClick={() => setShowClientModal(true)}
              >
                <User strokeWidth={2} />
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
                  <Icon strokeWidth={1.5} />
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
              <LayoutGrid strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`pdv-tabs__view-btn ${viewMode === 'list' ? 'pdv-tabs__view-btn--active' : ''}`}
            >
              <List strokeWidth={1.5} />
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
              <Search strokeWidth={1} />
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
            <ShoppingCart strokeWidth={2} />
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
            <ShoppingCart strokeWidth={1} />
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
            <CreditCard strokeWidth={2} />
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
            clients={clients}
            isLoading={clientsLoading}
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
