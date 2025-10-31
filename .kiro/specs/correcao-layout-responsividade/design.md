# Design Document

## Overview

Este documento detalha a arquitetura e estratégia de implementação para corrigir todos os problemas de layout, responsividade, navegação e consistência visual do sistema. A solução será implementada de forma sistemática, começando pelas correções de rotas, seguindo para ajustes de layout global, e finalizando com otimizações específicas de cada página.

## Architecture

### Estrutura de Correções

```
Camada 1: Configuração Global
├── Correção de rotas (sidebarConfig.js)
├── Layout wrapper (Layout.jsx)
└── Estilos globais (index.css)

Camada 2: Componentes Base
├── Sidebar responsiva
├── Navbar ajustada
└── Containers principais

Camada 3: Páginas Individuais
├── Dashboard
├── Check-in
├── Clientes
├── Veículos
├── Estoque
├── Ferramentas
├── Agenda
├── Relatórios
└── Configurações
```

## Components and Interfaces

### 1. Correção de Rotas do Sidebar

**Problema Identificado:**
O `sidebarConfig.js` usa labels em português mas as rotas não correspondem às definidas no `App.jsx`:

```javascript
// sidebarConfig.js (ATUAL - INCORRETO)
{ id: 'clientes', label: 'Clientes', path: '/clientes' }
{ id: 'veiculos', label: 'Veículos', path: '/veiculos' }
{ id: 'estoque', label: 'Estoque', path: '/estoque' }

// App.jsx (ROTAS REAIS)
<Route path="clients" element={<ClientsPage />} />
<Route path="vehicles" element={<VehiclesPage />} />
<Route path="inventory" element={<InventoryPage />} />
```

**Solução:**
Atualizar `sidebarConfig.js` para usar as rotas corretas em inglês:

```javascript
export const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'caixa', label: 'Caixa / PDV', path: '/caixa', icon: CreditCard },
  { id: 'checkin', label: 'Check-in', path: '/checkin', icon: ClipboardCheck },
  { id: 'clients', label: 'Clientes', path: '/clients', icon: Users },
  { id: 'vehicles', label: 'Veículos', path: '/vehicles', icon: Car },
  { id: 'inventory', label: 'Estoque', path: '/inventory', icon: Package },
  { id: 'tools', label: 'Ferramentas', path: '/tools', icon: Wrench },
  { id: 'schedule', label: 'Agenda', path: '/schedule', icon: Calendar },
  { id: 'reports', label: 'Relatórios', path: '/reports', icon: BarChart3, dividerAfter: true },
  { id: 'settings', label: 'Configurações', path: '/settings', icon: Settings },
];
```

### 2. Layout Global - Eliminação de Overflow

**Estratégia:**
Aplicar contenção de largura em múltiplos níveis:

```jsx
// Layout.jsx - Container principal
<motion.div
  className="min-h-screen w-full flex flex-col"
  style={{
    maxWidth: '100vw',
    overflowX: 'hidden',
    boxSizing: 'border-box'
  }}
>
  <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-x-hidden">
    <div className="w-full max-w-full" style={{ boxSizing: 'border-box' }}>
      <Outlet />
    </div>
  </main>
</motion.div>
```

**Estilos Globais (index.css):**

```css
/* Prevenir overflow horizontal global */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Container padrão para páginas */
.page-container {
  width: 100%;
  max-width: 100%;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .page-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (min-width: 1024px) {
  .page-container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

/* Prevenir overflow em grids */
.responsive-grid {
  display: grid;
  width: 100%;
  max-width: 100%;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .responsive-grid.cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .responsive-grid.cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  .responsive-grid.cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 3. Sidebar Responsiva

**Comportamento por Breakpoint:**

- **Desktop (≥1024px):** Sidebar fixa, expansível/colapsável
- **Tablet (768px-1023px):** Sidebar colapsada por padrão
- **Mobile (<768px):** Sidebar como drawer overlay

**Implementação:**

```jsx
// useSidebarState.js - Adicionar lógica responsiva
const useSidebarState = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return {
    isExpanded,
    setIsExpanded,
    isMobile,
    isDrawerOpen,
    setIsDrawerOpen
  };
};
```

### 4. Dashboard - Correções Específicas

**Problemas Identificados:**
- Grids não responsivos adequadamente
- Cards com largura fixa causando overflow
- Gráficos não se ajustam à largura disponível

**Solução:**

```jsx
// Dashboard - Container principal
<div className="w-full max-w-full overflow-x-hidden">
  <div className="page-container space-y-4 md:space-y-6">
    
    {/* KPIs - Grid responsivo */}
    <div className="responsive-grid cols-2 lg:cols-4">
      <CartaoIndicador {...} />
      {/* ... */}
    </div>

    {/* Gráficos - Grid responsivo */}
    <div className="responsive-grid lg:cols-2">
      <GraficoMovimentacao />
      <InsightsClientes />
    </div>

    {/* Listas - Grid responsivo */}
    <div className="responsive-grid lg:cols-2">
      <ListaClientesRecentes />
      <EstoqueCritico />
    </div>
  </div>
</div>
```

**Ajuste de Cards:**

```jsx
// CartaoIndicador.jsx
<motion.div
  className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg"
  style={{ maxWidth: '100%', boxSizing: 'border-box' }}
>
  {/* Conteúdo */}
</motion.div>
```

### 5. Check-in Page - Correções

**Problemas:**
- Cards de ação muito largos em mobile
- Lista de registros com overflow
- Modal não responsivo

**Solução:**

```jsx
// CheckInPage.jsx
<div className="page-container space-y-6 md:space-y-12">
  
  {/* Cards de ação - Stack em mobile */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
    <ActionCard type="checkin" />
    <ActionCard type="checkout" />
  </div>

  {/* Lista de registros */}
  <div className="w-full max-w-full overflow-hidden">
    <div className="space-y-4">
      {checkins.map(checkin => (
        <RegistroCard key={checkin.id} checkin={checkin} />
      ))}
    </div>
  </div>
</div>
```

**RegistroCard Responsivo:**

```jsx
<div className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6">
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
    <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0">
      {/* Ícone */}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-base md:text-lg font-semibold truncate">
        {checkin.clientName}
      </h3>
      <p className="text-sm text-gray-600 truncate">
        {checkin.vehiclePlate}
      </p>
    </div>
    <div className="flex gap-2 w-full sm:w-auto">
      <button className="flex-1 sm:flex-none px-4 py-2 text-sm">
        Ver Detalhes
      </button>
    </div>
  </div>
</div>
```

### 6. Clients Page - Tabela Responsiva

**Problema:**
Tabela muito larga causa overflow horizontal

**Solução - Abordagem Híbrida:**

```jsx
// ClientsPage.jsx
<div className="w-full overflow-x-hidden">
  
  {/* Desktop: Tabela tradicional */}
  <div className="hidden md:block overflow-x-auto">
    <table className="min-w-full">
      {/* Tabela completa */}
    </table>
  </div>

  {/* Mobile: Cards empilhados */}
  <div className="md:hidden space-y-4">
    {clients.map(client => (
      <ClientCard key={client.id} client={client} />
    ))}
  </div>
</div>
```

**ClientCard para Mobile:**

```jsx
const ClientCard = ({ client }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{client.name}</h3>
        <p className="text-sm text-gray-600 truncate">{client.cpf}</p>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4" />
        <span>{client.phone}</span>
      </div>
      {client.email && (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span className="truncate">{client.email}</span>
        </div>
      )}
    </div>
    <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">
      Editar
    </button>
  </div>
);
```

### 7. Modais - Responsividade

**Problema:**
Modais não se ajustam bem em telas pequenas

**Solução:**

```jsx
// Modal.jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
  
  <motion.div
    className={`
      relative w-full max-h-[90vh] overflow-y-auto
      bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
      ${size === 'sm' && 'max-w-md'}
      ${size === 'md' && 'max-w-lg'}
      ${size === 'lg' && 'max-w-2xl'}
      ${size === 'xl' && 'max-w-4xl'}
    `}
    style={{ boxSizing: 'border-box' }}
  >
    <div className="p-4 md:p-6">
      {children}
    </div>
  </motion.div>
</div>
```

### 8. Formulários - Responsividade

**Padrão para Formulários:**

```jsx
<form className="space-y-4 md:space-y-6">
  
  {/* Grid responsivo para campos */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="block text-sm font-medium">Nome</label>
      <input
        type="text"
        className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border"
      />
    </div>
    <div className="space-y-2">
      <label className="block text-sm font-medium">CPF</label>
      <input
        type="text"
        className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border"
      />
    </div>
  </div>

  {/* Campo full-width */}
  <div className="space-y-2">
    <label className="block text-sm font-medium">Email</label>
    <input
      type="email"
      className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border"
    />
  </div>

  {/* Botões */}
  <div className="flex flex-col sm:flex-row gap-3 pt-4">
    <button
      type="button"
      className="flex-1 px-4 py-2 md:py-3 border rounded-lg"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="flex-1 px-4 py-2 md:py-3 bg-blue-600 text-white rounded-lg"
    >
      Salvar
    </button>
  </div>
</form>
```

## Data Models

### Breakpoints Padrão (Tailwind CSS)

```javascript
const breakpoints = {
  sm: '640px',   // Mobile landscape, tablets pequenos
  md: '768px',   // Tablets
  lg: '1024px',  // Desktop pequeno
  xl: '1280px',  // Desktop médio
  '2xl': '1536px' // Desktop grande
};
```

### Classes Utilitárias Customizadas

```javascript
// tailwind.config.js - Adicionar utilities
module.exports = {
  theme: {
    extend: {
      spacing: {
        'safe': 'env(safe-area-inset-bottom)', // Para iOS
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.overflow-x-clip': {
          'overflow-x': 'clip',
        },
      });
    },
  ],
};
```

## Error Handling

### Estratégias de Fallback

1. **Detecção de Overflow:**
```javascript
useEffect(() => {
  const checkOverflow = () => {
    const hasHorizontalScrollbar = document.body.scrollWidth > window.innerWidth;
    if (hasHorizontalScrollbar) {
      console.warn('Overflow horizontal detectado!');
      // Aplicar correção automática
      document.body.style.overflowX = 'hidden';
    }
  };

  checkOverflow();
  window.addEventListener('resize', checkOverflow);
  return () => window.removeEventListener('resize', checkOverflow);
}, []);
```

2. **Rota Não Encontrada:**
```jsx
// App.jsx - Catch all route
<Route path="*" element={<NotFoundPage />} />
```

3. **Imagens Quebradas:**
```jsx
<img
  src={imageUrl}
  onError={(e) => {
    e.target.src = '/placeholder.png';
  }}
  alt="..."
/>
```

## Testing Strategy

### Checklist de Validação

**1. Teste de Rotas:**
- [ ] Clicar em cada item do sidebar
- [ ] Verificar se a rota correta é carregada
- [ ] Confirmar que não há erros 404
- [ ] Validar que o item ativo é destacado

**2. Teste de Overflow:**
- [ ] Abrir cada página em diferentes resoluções
- [ ] Verificar ausência de scroll horizontal
- [ ] Testar com sidebar expandida e colapsada
- [ ] Validar em Chrome DevTools (responsive mode)

**3. Teste de Responsividade:**
- [ ] Mobile (375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1280px, 1920px)
- [ ] Testar rotação de tela (portrait/landscape)

**4. Teste de Tema:**
- [ ] Alternar entre light e dark mode
- [ ] Verificar contraste de texto
- [ ] Validar cores de fundo e bordas
- [ ] Confirmar transições suaves

**5. Teste de Performance:**
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### Ferramentas de Teste

```bash
# Teste de responsividade
npm run dev
# Abrir Chrome DevTools > Toggle device toolbar
# Testar em diferentes dispositivos

# Lighthouse audit
npm run build
npx serve -s dist
# Chrome DevTools > Lighthouse > Generate report

# Validação de acessibilidade
npx @axe-core/cli http://localhost:5173
```

## Implementation Priority

1. **Crítico (P0):** Correção de rotas do sidebar
2. **Alto (P1):** Eliminação de overflow horizontal
3. **Alto (P1):** Responsividade básica (mobile/desktop)
4. **Médio (P2):** Consistência de espaçamento
5. **Médio (P2):** Otimização de tabelas e listas
6. **Baixo (P3):** Ajustes finos de animações
7. **Baixo (P3):** Otimizações de performance

## Notes

- Todas as correções devem manter o tema Apple Premium existente
- Priorizar soluções CSS puras sobre JavaScript quando possível
- Usar Tailwind CSS utilities ao invés de CSS customizado
- Manter compatibilidade com navegadores modernos (últimas 2 versões)
- Documentar qualquer breaking change ou alteração de comportamento
