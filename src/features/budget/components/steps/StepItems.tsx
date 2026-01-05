/**
 * TORQ Budget - Step 3: Items
 * Produtos e serviços do orçamento
 * 
 * Design premium com lista interativa
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BudgetSection, SectionCard } from '../BudgetSection';
import { BudgetInput } from '../BudgetInput';
import { dropdownStyles, itemListStyles, buttonStyles } from '../../styles/budget.styles';
import { colors, transitions, getBrandAccent } from '../../styles/budget.tokens';
import { BudgetFlowReturn, BudgetItem } from '../../hooks/useBudgetFlow';

// ============================================================================
// ICONS
// ============================================================================
const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2z" strokeLinejoin="round" />
    <path d="M12 22V11M12 11l9-4.5M12 11L3 6.5" strokeLinecap="round" />
  </svg>
);

const WrenchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14" strokeLinecap="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// MOCK DATA (replace with real store integration)
// ============================================================================
const mockProducts = [
  { id: 'p1', name: 'Óleo Motor 5W30 Sintético', price: 89.90, type: 'product' as const },
  { id: 'p2', name: 'Filtro de Óleo', price: 45.00, type: 'product' as const },
  { id: 'p3', name: 'Filtro de Ar', price: 65.00, type: 'product' as const },
  { id: 'p4', name: 'Pastilha de Freio Dianteira', price: 180.00, type: 'product' as const },
  { id: 'p5', name: 'Disco de Freio Dianteiro', price: 320.00, type: 'product' as const },
];

const mockServices = [
  { id: 's1', name: 'Troca de Óleo', price: 80.00, type: 'service' as const },
  { id: 's2', name: 'Alinhamento e Balanceamento', price: 120.00, type: 'service' as const },
  { id: 's3', name: 'Revisão Completa', price: 350.00, type: 'service' as const },
  { id: 's4', name: 'Troca de Pastilhas de Freio', price: 150.00, type: 'service' as const },
  { id: 's5', name: 'Diagnóstico Eletrônico', price: 100.00, type: 'service' as const },
];

// ============================================================================
// COMPONENT
// ============================================================================
interface StepItemsProps {
  flow: BudgetFlowReturn;
}

export const StepItems: React.FC<StepItemsProps> = ({ flow }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accent = getBrandAccent(flow.effectiveBrand);
  
  // Filter items based on search
  const items = activeTab === 'products' ? mockProducts : mockServices;
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Add item to budget
  const handleAddItem = useCallback((item: { id: string; name: string; price: number; type: 'product' | 'service' }) => {
    flow.addItem({
      type: item.type,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
    setSearchQuery('');
    setShowDropdown(false);
  }, [flow]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Search Section */}
      <BudgetSection
        title="Adicionar Itens"
        description="Busque produtos ou serviços para adicionar ao orçamento"
        icon={activeTab === 'products' ? <PackageIcon /> : <WrenchIcon />}
      >
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          padding: '4px',
          background: colors.surface.soft,
          borderRadius: '10px',
        }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'products' ? accent.hex : 'transparent',
              color: activeTab === 'products' ? '#FFFFFF' : colors.text.muted,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: transitions.fast,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <PackageIcon />
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('services')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'services' ? accent.hex : 'transparent',
              color: activeTab === 'services' ? '#FFFFFF' : colors.text.muted,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: transitions.fast,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <WrenchIcon />
            Serviços
          </button>
        </div>
        
        {/* Search Input */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <BudgetInput
            placeholder={`Buscar ${activeTab === 'products' ? 'produtos' : 'serviços'}...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            icon={<SearchIcon />}
            brand={flow.effectiveBrand}
          />
          
          {/* Dropdown */}
          {showDropdown && (
            <div style={dropdownStyles.container}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      ...dropdownStyles.item,
                      ...(hoveredIndex === idx ? dropdownStyles.itemHover : {}),
                    }}
                    onClick={() => handleAddItem(item)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(-1)}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: item.type === 'product' 
                        ? 'rgba(10, 132, 255, 0.15)' 
                        : 'rgba(255, 159, 10, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.type === 'product' ? colors.state.info : colors.state.warning,
                    }}>
                      {item.type === 'product' ? <PackageIcon /> : <WrenchIcon />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={dropdownStyles.itemText}>{item.name}</div>
                      <div style={dropdownStyles.itemSubtext}>
                        {item.type === 'product' ? 'Produto' : 'Serviço'}
                      </div>
                    </div>
                    <div style={{
                      color: colors.text.primary,
                      fontWeight: 600,
                      fontSize: '15px',
                    }}>
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: colors.text.muted,
                }}>
                  Nenhum item encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </BudgetSection>
      
      {/* Items List */}
      <BudgetSection
        title="Itens do Orçamento"
        description={flow.data.items.length > 0 
          ? `${flow.data.items.length} ${flow.data.items.length === 1 ? 'item' : 'itens'} adicionados`
          : 'Nenhum item adicionado ainda'
        }
        icon={<PackageIcon />}
      >
        {flow.data.items.length > 0 ? (
          <div style={itemListStyles.container}>
            {flow.data.items.map((item) => (
              <div key={item.id} style={itemListStyles.item}>
                {/* Icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '11px',
                  background: item.type === 'product' 
                    ? 'rgba(10, 132, 255, 0.15)' 
                    : 'rgba(255, 159, 10, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.type === 'product' ? colors.state.info : colors.state.warning,
                  flexShrink: 0,
                }}>
                  {item.type === 'product' ? <PackageIcon /> : <WrenchIcon />}
                </div>
                
                {/* Info */}
                <div style={itemListStyles.itemInfo}>
                  <div style={itemListStyles.itemName}>{item.name}</div>
                  <div style={itemListStyles.itemMeta}>
                    {formatCurrency(item.price)} / un
                  </div>
                </div>
                
                {/* Quantity Control */}
                <div style={itemListStyles.quantityControl}>
                  <button
                    onClick={() => flow.updateItemQuantity(item.id, -1)}
                    style={itemListStyles.quantityButton}
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon />
                  </button>
                  <span style={itemListStyles.quantityValue}>{item.quantity}</span>
                  <button
                    onClick={() => flow.updateItemQuantity(item.id, 1)}
                    style={itemListStyles.quantityButton}
                  >
                    <PlusIcon />
                  </button>
                </div>
                
                {/* Total */}
                <div style={{
                  ...itemListStyles.itemPrice,
                  minWidth: '90px',
                  textAlign: 'right',
                }}>
                  {formatCurrency(item.price * item.quantity)}
                </div>
                
                {/* Remove */}
                <button
                  onClick={() => flow.removeItem(item.id)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(255, 69, 58, 0.1)',
                    border: 'none',
                    color: colors.state.error,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: transitions.fast,
                    flexShrink: 0,
                  }}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: colors.text.muted,
            background: colors.surface.soft,
            borderRadius: '12px',
            border: `1px dashed ${colors.border.default}`,
          }}>
            <div style={{ marginBottom: '8px', opacity: 0.5 }}>
              <PackageIcon />
            </div>
            <div style={{ fontSize: '14px' }}>
              Use a busca acima para adicionar produtos e serviços
            </div>
          </div>
        )}
        
        {/* Error message */}
        {flow.errors.items && (
          <div style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: 'rgba(255, 69, 58, 0.1)',
            border: '1px solid rgba(255, 69, 58, 0.2)',
            borderRadius: '10px',
            color: colors.state.error,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            {flow.errors.items}
          </div>
        )}
      </BudgetSection>
    </div>
  );
};

export default StepItems;
