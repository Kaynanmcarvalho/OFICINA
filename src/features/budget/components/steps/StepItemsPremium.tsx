/**
 * TORQ Budget - Step 3: Items PREMIUM
 * Design Apple-like impressionante com glassmorphism e cores vibrantes
 * 
 * Visual de aplicativo nativo iOS/macOS
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors, getBrandAccent } from '../../styles/budget.tokens';
import { BudgetFlowReturn } from '../../hooks/useBudgetFlow';

// ============================================================================
// PREMIUM ICONS - Mais ricos e detalhados
// ============================================================================
const PackageIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2z" strokeLinejoin="round" />
    <path d="M12 22V11M12 11l9-4.5M12 11L3 6.5" strokeLinecap="round" />
  </svg>
);
const WrenchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

const MinusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M5 12h14" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" strokeLinecap="round" />
  </svg>
);

const ClipboardListIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" strokeLinejoin="round" />
    <path d="M9 12h6M9 16h6" strokeLinecap="round" />
  </svg>
);
// ============================================================================
// MOCK DATA
// ============================================================================
const mockProducts = [
  { id: 'p1', name: 'Óleo Motor 5W30 Sintético', price: 89.90, type: 'product' as const, category: 'Lubrificantes' },
  { id: 'p2', name: 'Filtro de Óleo', price: 45.00, type: 'product' as const, category: 'Filtros' },
  { id: 'p3', name: 'Filtro de Ar', price: 65.00, type: 'product' as const, category: 'Filtros' },
  { id: 'p4', name: 'Pastilha de Freio Dianteira', price: 180.00, type: 'product' as const, category: 'Freios' },
  { id: 'p5', name: 'Disco de Freio Dianteiro', price: 320.00, type: 'product' as const, category: 'Freios' },
  { id: 'p6', name: 'Vela de Ignição', price: 35.00, type: 'product' as const, category: 'Motor' },
];

const mockServices = [
  { id: 's1', name: 'Troca de Óleo', price: 80.00, type: 'service' as const, duration: '30 min' },
  { id: 's2', name: 'Alinhamento e Balanceamento', price: 120.00, type: 'service' as const, duration: '45 min' },
  { id: 's3', name: 'Revisão Completa', price: 350.00, type: 'service' as const, duration: '2h' },
  { id: 's4', name: 'Troca de Pastilhas de Freio', price: 150.00, type: 'service' as const, duration: '1h' },
  { id: 's5', name: 'Diagnóstico Eletrônico', price: 100.00, type: 'service' as const, duration: '40 min' },
  { id: 's6', name: 'Limpeza de Bicos Injetores', price: 180.00, type: 'service' as const, duration: '1h 30min' },
];

// ============================================================================
// COMPONENT
// ============================================================================
interface StepItemsPremiumProps {
  flow: BudgetFlowReturn;
}

export const StepItemsPremium: React.FC<StepItemsPremiumProps> = ({ flow }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('services');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accent = getBrandAccent(flow.effectiveBrand);
  
  const items = activeTab === 'products' ? mockProducts : mockServices;
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleAddItem = useCallback((item: any) => {
    flow.addItem({
      type: item.type,
      name: item.name,
      price: item.price,
      quantity: 1,
      cost: item.price * 0.7, // Custo estimado (70% do preço)
      priority: 'recommended' as const,
      deliveryDays: item.type === 'product' ? 3 : 0,
    });
    setSearchQuery('');
    setShowDropdown(false);
  }, [flow]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  const productCount = flow.data.items.filter(i => i.type === 'product').length;
  const serviceCount = flow.data.items.filter(i => i.type === 'service').length;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
      {/* Hero Section simplificado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: colors.surface.soft,
          border: `1px solid ${colors.border.subtle}`,
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: `${accent.hex}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.primary,
          }}>
            <ClipboardListIcon size={22} />
          </div>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              color: colors.text.primary,
              margin: 0,
              letterSpacing: '-0.01em',
            }}>
              Adicionar Serviços e Produtos
            </h2>
            <p style={{
              fontSize: '14px',
              color: colors.text.secondary,
              margin: '4px 0 0 0',
              opacity: 0.6,
            }}>
              {productCount + serviceCount} {productCount + serviceCount === 1 ? 'item adicionado' : 'itens adicionados'} • {formatCurrency(flow.subtotal)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tabs simplificados */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '4px',
        background: colors.surface.soft,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: '10px',
      }}>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTab('services')}
          style={{
            flex: 1,
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'services' ? accent.hex : 'transparent',
            color: activeTab === 'services' ? '#FFFFFF' : colors.text.secondary,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <WrenchIcon size={18} />
          Serviços
          {serviceCount > 0 && (
            <span style={{
              background: activeTab === 'services' ? 'rgba(255,255,255,0.25)' : accent.hex + '15',
              color: activeTab === 'services' ? '#FFFFFF' : accent.hex,
              padding: '2px 6px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              {serviceCount}
            </span>
          )}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setActiveTab('products')}
          style={{
            flex: 1,
            padding: '12px 20px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'products' ? accent.hex : 'transparent',
            color: activeTab === 'products' ? '#FFFFFF' : colors.text.secondary,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <PackageIcon size={18} />
          Produtos
          {productCount > 0 && (
            <span style={{
              background: activeTab === 'products' ? 'rgba(255,255,255,0.25)' : accent.hex + '15',
              color: activeTab === 'products' ? '#FFFFFF' : accent.hex,
              padding: '2px 6px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              {productCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Search simplificado */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <div style={{
          position: 'relative',
          background: colors.surface.soft,
          borderRadius: '12px',
          border: `1px solid ${showDropdown ? accent.hex + '30' : colors.border.subtle}`,
          transition: 'all 0.2s',
        }}>
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: showDropdown ? accent.hex : colors.text.muted,
            transition: 'color 0.3s',
          }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'products' ? 'produtos' : 'serviços'}...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            style={{
              width: '100%',
              padding: '14px 20px 14px 48px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontWeight: 500,
              color: colors.text.primary,
            }}
          />
        </div>
        
        {/* Dropdown Premium */}
        <AnimatePresence>
          {showDropdown && filteredItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: colors.base.elevated,
                border: `1px solid ${colors.border.default}`,
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                overflow: 'hidden',
                zIndex: 50,
                maxHeight: '400px',
                overflowY: 'auto',
              }}
            >
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.0 }}
                  onClick={() => handleAddItem(item)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    background: hoveredIndex === idx ? colors.surface.soft : 'transparent',
                    borderBottom: idx < filteredItems.length - 1 ? `1px solid ${colors.border.subtle}` : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: `${accent.hex}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.text.primary,
                  }}>
                    {item.type === 'product' ? <PackageIcon size={20} /> : <WrenchIcon size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '15px', 
                      fontWeight: 600, 
                      color: colors.text.primary,
                      marginBottom: '2px',
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      color: colors.text.secondary,
                      fontWeight: 500,
                    }}>
                      {'category' in item ? item.category : item.duration}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: colors.text.primary,
                  }}>
                    {formatCurrency(item.price)}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Items List simplificado */}
      {flow.data.items.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AnimatePresence>
            {flow.data.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 18px',
                  background: colors.surface.soft,
                  border: `1px solid ${hoveredItemId === item.id ? accent.hex + '20' : colors.border.subtle}`,
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                  transform: hoveredItemId === item.id ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: `${accent.hex}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.text.primary,
                  flexShrink: 0,
                }}>
                  {item.type === 'product' ? <PackageIcon size={20} /> : <WrenchIcon size={20} />}
                </div>
                
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: 600, 
                    color: colors.text.primary,
                    marginBottom: '4px',
                  }}>
                    {item.name}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: colors.text.secondary,
                    fontWeight: 500,
                  }}>
                    {formatCurrency(item.price)} / unidade
                  </div>
                </div>
                
                {/* Quantity Control */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 10px',
                  background: colors.base.secondary,
                  borderRadius: '10px',
                  border: `1px solid ${colors.border.subtle}`,
                }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => flow.updateItemQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: item.quantity <= 1 ? colors.surface.soft : accent.hex + '12',
                      border: 'none',
                      color: item.quantity <= 1 ? colors.text.disabled : '#FFFFFF',
                      cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <MinusIcon />
                  </motion.button>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: colors.text.primary,
                    minWidth: '28px',
                    textAlign: 'center',
                  }}>
                    {item.quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => flow.updateItemQuantity(item.id, 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: accent.hex + '12',
                      border: 'none',
                      color: colors.text.primary,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <PlusIcon />
                  </motion.button>
                </div>
                
                {/* Total */}
                <div style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: colors.text.primary,
                  minWidth: '100px',
                  textAlign: 'right',
                }}>
                  {formatCurrency(item.price * item.quantity)}
                </div>
                
                {/* Remove Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => flow.removeItem(item.id)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: '#EF444412',
                    border: '1px solid #EF444425',
                    color: '#EF4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <TrashIcon />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            background: colors.surface.soft,
            border: `2px dashed ${colors.border.default}`,
            borderRadius: '16px',
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 20px',
            borderRadius: '16px',
            background: `${accent.hex}12`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.primary,
          }}>
            {activeTab === 'products' ? <PackageIcon size={28} /> : <WrenchIcon size={28} />}
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 600,
            color: colors.text.primary,
            marginBottom: '6px',
          }}>
            Nenhum item adicionado
          </div>
          <div style={{
            fontSize: '14px',
            color: colors.text.muted,
          }}>
            Use a busca acima para adicionar {activeTab === 'products' ? 'produtos' : 'serviços'}
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {flow.errors.items && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '14px 18px',
            background: '#EF444412',
            border: '1px solid #EF444425',
            borderRadius: '12px',
            color: '#EF4444',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {flow.errors.items}
        </motion.div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
};

export default StepItemsPremium;
