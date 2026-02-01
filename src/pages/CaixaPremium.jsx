/**
 * TORQ PDV Premium - Apple-like Point of Sale
 * 
 * Design: Clean, minimal, sophisticated
 * Layout: CSS Grid with fixed cart sidebar
 * UX: Fast, intuitive, professional
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Lucide Icons - Premium elegant icons
import { 
  Search, ShoppingCart, User, Package, Wrench, Plus, Minus, Trash2, 
  X, Check, AlertCircle, CreditCard, UserPlus, Car, LayoutGrid, List, Star,
  Sparkles, Settings, Store, ChevronRight, Receipt, Tag
} from 'lucide-react';
import { useAuthStore, useInventoryStore, useClientStore } from '../store';
import useCaixaStore from '../store/caixaStore';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { activityService } from '../config/activityService';
import PaymentModal from '../components/modals/PaymentModal';
import SaleConfirmationModal from '../components/modals/SaleConfirmationModal';
import PrintReceiptModal from '../components/modals/PrintReceiptModal';
import TaxPreviewModal from '../components/modals/TaxPreviewModal';
import PrinterConfigModal from '../components/modals/PrinterConfigModal';
import ModalAberturaCaixa from '../components/modals/ModalAberturaCaixa';
import ModalFechamentoCaixa from '../components/modals/ModalFechamentoCaixa';
import BannerCaixaAberto from '../components/caixa/BannerCaixaAberto';
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
          <Package size={40} className="opacity-40" />
        )}
        <span className={`pdv-product__badge ${hasStock ? 'pdv-product__badge--stock' : 'pdv-product__badge--out'}`}>
          {product.quantidade}
        </span>
        {hasStock && (
          <button 
            className="pdv-product__add" 
            onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          >
            <Plus size={18} strokeWidth={2.5} />
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
          <Package size={24} className="opacity-40" />
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
        <Plus size={18} strokeWidth={2.5} />
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
        <Package size={20} className="opacity-40" />
      )}
    </div>
    <div className="pdv-cart-item__info">
      <div className="pdv-cart-item__name">{item.nome}</div>
      <div className="pdv-cart-item__qty">
        <button 
          className="pdv-cart-item__qty-btn" 
          onClick={() => onUpdateQuantity(item.id, item.quantidade - 1)}
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <span className="pdv-cart-item__qty-value">{item.quantidade}</span>
        <button 
          className="pdv-cart-item__qty-btn" 
          onClick={() => onUpdateQuantity(item.id, item.quantidade + 1)}
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
    <div className="pdv-cart-item__actions">
      <button className="pdv-cart-item__remove" onClick={() => onRemove(item.id)}>
        <Trash2 size={14} strokeWidth={2.5} />
      </button>
      <span className="pdv-cart-item__subtotal">{formatCurrency(item.preco * item.quantidade)}</span>
    </div>
  </motion.div>
));

// Toast Notification
const Toast = ({ message, type = 'success' }) => (
  <motion.div
    className={`pdv-toast pdv-toast--${type}`}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
  >
    {type === 'success' ? <Check size={16} strokeWidth={2.5} /> : <AlertCircle size={16} />}
    <span>{message}</span>
  </motion.div>
);

// ============================================================================
// CLIENT SEARCH MODAL - APPLE PREMIUM DESIGN
// ============================================================================
const ClientSearchModal = ({ isOpen, onClose, onSelect }) => {
  const { clients, isLoading, fetchClients, createClient } = useClientStore();
  const [search, setSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newClient, setNewClient] = useState({ nome: '', telefone: '', email: '', cpfCnpj: '' });
  const [saving, setSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'recent', 'frequent'
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
      setSelectedTab('all');
    }
  }, [isOpen]);

  // Format phone for display
  const formatPhoneDisplay = (phone) => {
    if (!phone) return '';
    const c = phone.replace(/\D/g, '');
    if (c.length === 11) return `(${c.slice(0,2)}) ${c.slice(2,7)}-${c.slice(7)}`;
    if (c.length === 10) return `(${c.slice(0,2)}) ${c.slice(2,6)}-${c.slice(6)}`;
    return phone;
  };

  // Format CPF/CNPJ for display
  const formatDocument = (doc) => {
    if (!doc) return '';
    const c = doc.replace(/\D/g, '');
    if (c.length === 11) return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (c.length === 14) return c.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    return doc;
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Generate avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      { bg: '#3B82F6', text: '#FFFFFF' }, // Blue
      { bg: '#10B981', text: '#FFFFFF' }, // Green
      { bg: '#F97316', text: '#FFFFFF' }, // Orange
      { bg: '#8B5CF6', text: '#FFFFFF' }, // Purple
      { bg: '#EC4899', text: '#FFFFFF' }, // Pink
      { bg: '#06B6D4', text: '#FFFFFF' }, // Cyan
      { bg: '#EF4444', text: '#FFFFFF' }, // Red
      { bg: '#F59E0B', text: '#FFFFFF' }, // Amber
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const filtered = useMemo(() => {
    let result = clients;
    
    if (search.trim()) {
      const t = search.toLowerCase().replace(/\D/g, '');
      const tText = search.toLowerCase();
      result = clients.filter(c => 
        c.name?.toLowerCase().includes(tText) || 
        c.nome?.toLowerCase().includes(tText) ||
        c.phone?.replace(/\D/g, '').includes(t) ||
        c.telefone?.replace(/\D/g, '').includes(t) ||
        c.email?.toLowerCase().includes(tText) ||
        c.cpf?.replace(/\D/g, '').includes(t) ||
        c.cnpj?.replace(/\D/g, '').includes(t) ||
        c.cpfCnpj?.replace(/\D/g, '').includes(t)
      );
    }
    
    return result.slice(0, 50);
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (showNewForm) {
          setShowNewForm(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showNewForm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cmp-overlay" onClick={onClose}>
      <motion.div 
        className="cmp-modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
      >
        {/* Header Premium */}
        <div className="cmp-header">
          <div className="cmp-header__left">
            <div className="cmp-header__icon">
              <User size={18} />
            </div>
            <div className="cmp-header__titles">
              <h2 className="cmp-header__title">Selecionar Cliente</h2>
              <span className="cmp-header__subtitle">{clients.length} clientes cadastrados</span>
            </div>
          </div>
          <button className="cmp-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Search Premium */}
        <div className="cmp-search-section">
          <div className="cmp-search-container">
            <Search size={18} className="cmp-search-icon" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone, CPF ou email..."
              className="cmp-search-input"
            />
            {search && (
              <button className="cmp-search-clear" onClick={() => setSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>
          
          {/* Quick Stats */}
          {!search && !showNewForm && (
            <div className="cmp-quick-stats">
              <div className="cmp-stat">
                <span className="cmp-stat__value">{clients.length}</span>
                <span className="cmp-stat__label">Total</span>
              </div>
              <div className="cmp-stat">
                <span className="cmp-stat__value">{clients.filter(c => c.phone || c.telefone).length}</span>
                <span className="cmp-stat__label">Com telefone</span>
              </div>
              <div className="cmp-stat">
                <span className="cmp-stat__value">{clients.filter(c => c.email).length}</span>
                <span className="cmp-stat__label">Com email</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {showNewForm ? (
            <motion.div 
              key="form"
              className="cmp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="cmp-form__header">
                <button className="cmp-form__back" onClick={() => setShowNewForm(false)}>
                  <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
                  <span>Voltar</span>
                </button>
                <h3 className="cmp-form__title">Novo Cliente</h3>
              </div>
              
              <div className="cmp-form__fields">
                <div className="cmp-field">
                  <label className="cmp-field__label">
                    <User size={14} />
                    <span>Nome completo</span>
                    <span className="cmp-field__required">*</span>
                  </label>
                  <input
                    type="text"
                    value={newClient.nome}
                    onChange={e => setNewClient(p => ({ ...p, nome: e.target.value }))}
                    placeholder="Ex: João da Silva"
                    className="cmp-field__input"
                    autoFocus
                  />
                </div>
                
                <div className="cmp-field">
                  <label className="cmp-field__label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>Telefone</span>
                  </label>
                  <input
                    type="tel"
                    value={newClient.telefone}
                    onChange={e => setNewClient(p => ({ ...p, telefone: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    className="cmp-field__input"
                  />
                </div>
                
                <div className="cmp-field">
                  <label className="cmp-field__label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                    className="cmp-field__input"
                  />
                </div>
                
                <div className="cmp-field">
                  <label className="cmp-field__label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <path d="M7 7h.01M7 12h.01M12 7h.01M12 12h.01M17 7h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01"/>
                    </svg>
                    <span>CPF ou CNPJ</span>
                  </label>
                  <input
                    type="text"
                    value={newClient.cpfCnpj}
                    onChange={e => setNewClient(p => ({ ...p, cpfCnpj: e.target.value }))}
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    className="cmp-field__input"
                  />
                </div>
              </div>
              
              <div className="cmp-form__actions">
                <button className="cmp-btn cmp-btn--secondary" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </button>
                <button 
                  className="cmp-btn cmp-btn--primary" 
                  onClick={handleCreateClient}
                  disabled={!newClient.nome.trim() || saving}
                >
                  {saving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                      </motion.div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Salvar Cliente</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              className="cmp-list-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Loading */}
              {isLoading ? (
                <div className="cmp-loading">
                  <motion.div
                    className="cmp-loading__spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="cmp-loading__text">Carregando clientes...</span>
                </div>
              ) : filtered.length > 0 ? (
                <div className="cmp-list">
                  {search && (
                    <div className="cmp-list__header">
                      <span className="cmp-list__count">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {filtered.map((client, index) => {
                    const name = client.name || client.nome || 'Cliente';
                    const phone = client.phone || client.telefone;
                    const email = client.email;
                    const doc = client.cpf || client.cnpj || client.cpfCnpj;
                    const avatarColor = getAvatarColor(name);
                    
                    return (
                      <motion.button
                        key={client.id || client.firestoreId || index}
                        className="cmp-client"
                        onClick={() => { onSelect(client); onClose(); }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.2 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div 
                          className="cmp-client__avatar"
                          style={{ backgroundColor: avatarColor.bg, color: avatarColor.text }}
                        >
                          {getInitials(name)}
                        </div>
                        <div className="cmp-client__info">
                          <span className="cmp-client__name">{name}</span>
                          <div className="cmp-client__details">
                            {phone && (
                              <span className="cmp-client__detail">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                {formatPhoneDisplay(phone)}
                              </span>
                            )}
                            {email && (
                              <span className="cmp-client__detail">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                </svg>
                                {email}
                              </span>
                            )}
                            {doc && (
                              <span className="cmp-client__detail cmp-client__detail--doc">
                                {formatDocument(doc)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={18} className="cmp-client__arrow" />
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="cmp-empty">
                  <div className="cmp-empty__icon">
                    <User size={32} />
                  </div>
                  <span className="cmp-empty__title">
                    {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                  </span>
                  <span className="cmp-empty__subtitle">
                    {search 
                      ? `Não encontramos resultados para "${search}"`
                      : 'Adicione seu primeiro cliente clicando no botão abaixo'
                    }
                  </span>
                  {search && (
                    <button className="cmp-empty__action" onClick={() => setSearch('')}>
                      Limpar busca
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Premium */}
        {!showNewForm && (
          <div className="cmp-footer">
            <button className="cmp-footer__new" onClick={() => setShowNewForm(true)}>
              <div className="cmp-footer__new-icon">
                <Plus size={18} />
              </div>
              <div className="cmp-footer__new-text">
                <span className="cmp-footer__new-title">Novo Cliente</span>
                <span className="cmp-footer__new-subtitle">Cadastrar cliente rapidamente</span>
              </div>
              <ChevronRight size={18} className="cmp-footer__new-arrow" />
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
  
  // NOVO: Hook do store de caixa
  const { caixaAtual, carregarCaixaAberto, registrarVenda } = useCaixaStore();
  
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
  
  // NOVO: Estados dos modais de caixa
  const [showModalAberturaCaixa, setShowModalAberturaCaixa] = useState(false);
  const [showModalFechamentoCaixa, setShowModalFechamentoCaixa] = useState(false);
  
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
  
  // NOVO: Carregar caixa aberto ao montar
  useEffect(() => {
    if (currentUser) {
      carregarCaixaAberto(currentUser);
    }
  }, [currentUser, carregarCaixaAberto]);
  
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
    
    // Se tem busca, ignora o filtro de categoria e busca em todos
    if (searchTerm) {
      const t = searchTerm.toLowerCase().trim();
      f = f.filter(p => {
        const nome = (p.nome || '').toLowerCase();
        const codigo = (p.codigo || '').toLowerCase();
        const categoria = (p.categoria || '').toLowerCase();
        return nome.includes(t) || codigo.includes(t) || categoria.includes(t);
      });
    } else if (selectedCategory !== 'all') {
      // Só aplica filtro de categoria se NÃO tiver busca
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
    // Error messages stay longer (5s) than success messages (3s)
    const duration = type === 'error' ? 5000 : 3000;
    setTimeout(() => setNotification(null), duration);
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
    // NOVO: Verificar se tem caixa aberto
    if (!caixaAtual) {
      showNotification('Abra o caixa antes de fazer vendas', 'error');
      setShowModalAberturaCaixa(true);
      return;
    }
    
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
  }, [caixaAtual, cartItems, cartTotal, currentUser, selectedClient, showNotification]);
  
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
        syncStatus: 'pending',
        
        // NOVO: Campos de caixa
        caixaId: caixaAtual?.id || null,
        caixaNumero: caixaAtual?.numero || null,
        operadorCaixa: caixaAtual ? {
          uid: caixaAtual.operadorAbertura.uid,
          nome: caixaAtual.operadorAbertura.nome
        } : null,
        afetaCaixaFisico: paymentData.pagamentos.some(p => 
          p.metodo.toLowerCase() === 'dinheiro'
        ),
        valorCaixaFisico: paymentData.pagamentos
          .filter(p => p.metodo.toLowerCase() === 'dinheiro')
          .reduce((sum, p) => sum + parseFloat(p.valor || 0), 0)
      };
      
      const vendaDoc = await addDoc(collection(db, 'vendas'), vendaData);
      
      // NOVO: Registrar venda no caixa
      if (caixaAtual) {
        await registrarVenda(
          vendaDoc.id,
          paymentData.totalComDesconto,
          paymentData.pagamentos
        );
      }
      
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
  }, [caixaAtual, registrarVenda, cartItems, cartTotal, currentUser, paymentData, clearCart, showNotification, products]);
  
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
          BANNER DE CAIXA ABERTO
          ================================================================ */}
      <AnimatePresence>
        {caixaAtual && (
          <BannerCaixaAberto 
            onFecharCaixa={() => setShowModalFechamentoCaixa(true)} 
          />
        )}
      </AnimatePresence>
      
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
              <Store size={20} />
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
            <Search className="pdv-search__icon" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.trim()) {
                  setSelectedCategory('all');
                }
              }}
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
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button 
                className="pdv-client__btn" 
                onClick={() => setShowClientModal(true)}
              >
                <User size={16} />
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
                  <Icon size={18} />
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
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`pdv-tabs__view-btn ${viewMode === 'list' ? 'pdv-tabs__view-btn--active' : ''}`}
            >
              <List size={18} />
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
              <Package size={64} className="opacity-30" />
              <span className="pdv-empty__title">
                {searchTerm ? `Sem resultados para "${searchTerm}"` : 'Nenhum produto encontrado'}
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
            <ShoppingCart size={22} />
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
            <ShoppingCart size={56} className="opacity-30" />
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
            <CreditCard size={20} />
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
      
      {/* ================================================================
          MODAIS DE CAIXA
          ================================================================ */}
      <AnimatePresence>
        {showModalAberturaCaixa && (
          <ModalAberturaCaixa
            isOpen={showModalAberturaCaixa}
            onClose={() => setShowModalAberturaCaixa(false)}
            onSuccess={() => {
              showNotification('Caixa aberto com sucesso!');
              setShowModalAberturaCaixa(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModalFechamentoCaixa && (
          <ModalFechamentoCaixa
            isOpen={showModalFechamentoCaixa}
            onClose={() => setShowModalFechamentoCaixa(false)}
            onSuccess={(resultado) => {
              const msg = resultado.diferenca === 0 
                ? 'Caixa fechado! Sem diferenças.' 
                : `Caixa fechado! Diferença: ${formatCurrency(Math.abs(resultado.diferenca))}`;
              showNotification(msg);
              setShowModalFechamentoCaixa(false);
            }}
          />
        )}
      </AnimatePresence>
      
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
