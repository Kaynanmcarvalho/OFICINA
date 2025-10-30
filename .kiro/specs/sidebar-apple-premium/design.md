# Design Document - Sidebar Apple Premium

## Overview

A Sidebar Apple Premium é um componente de navegação lateral que combina estética minimalista da Apple com funcionalidade moderna. O design prioriza fluidez, elegância e microinterações inteligentes, criando uma experiência comparável aos produtos macOS Sonoma e VisionOS.

O componente utiliza React com Tailwind CSS para estilização, Framer Motion para animações, e Lucide React para ícones. A arquitetura é modular, permitindo fácil manutenção e extensibilidade.

## Architecture

### Component Structure

```
src/components/Sidebar/
├── SidebarAppleLike.jsx          # Componente principal
├── SidebarHeader.jsx              # Header com avatar e nome do usuário
├── SidebarMenuItem.jsx            # Item individual de menu
├── SidebarToggleButton.jsx        # Botão de colapsar/expandir
├── SidebarFooter.jsx              # Rodapé com logout
├── useSidebarState.js             # Hook customizado para estado
└── sidebarConfig.js               # Configuração de itens de menu
```

### State Management

O estado da sidebar será gerenciado localmente com React hooks:

- `useState` para estado de expansão/colapso
- `useEffect` para sincronização com LocalStorage
- `useLocation` do React Router para detectar rota ativa
- Hook customizado `useSidebarState` para encapsular lógica de estado

### Integration Points

- **React Router DOM**: Integração para navegação e detecção de rota ativa
- **LocalStorage**: Persistência do estado expandido/colapsado
- **Firebase Auth** (futuro): Dados do usuário para header
- **Theme Context** (futuro): Suporte a modo claro/escuro

## Components and Interfaces

### 1. SidebarAppleLike (Main Component)

**Props:**
```typescript
interface SidebarAppleLikeProps {
  className?: string;
  defaultExpanded?: boolean;
  onNavigate?: (path: string) => void;
}
```

**Responsibilities:**
- Renderizar estrutura completa da sidebar
- Gerenciar estado de expansão/colapso
- Coordenar animações de transição
- Aplicar estilos glassmorphism e tema

**Key Features:**
- Largura dinâmica: 72px (compacto) / 240px (expandido)
- Animação de transição com Framer Motion
- Backdrop blur e efeito translúcido
- Sombras dinâmicas e cantos arredondados

### 2. SidebarHeader

**Props:**
```typescript
interface SidebarHeaderProps {
  isExpanded: boolean;
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
}
```

**Responsibilities:**
- Exibir avatar circular do usuário
- Mostrar nome do usuário (apenas quando expandido)
- Animar entrada de informações
- Preparar integração com Firebase Auth

**Visual Design:**
- Avatar: 40px circular com borda sutil
- Nome: SF Pro Text, peso 500, cor neutra
- Animação: fade-in + slide-down ao carregar
- Modo compacto: apenas avatar centralizado

### 3. SidebarMenuItem

**Props:**
```typescript
interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}
```

**Responsibilities:**
- Renderizar ícone e label do item
- Aplicar estilos de estado ativo
- Executar animações de hover
- Navegar para rota ao clicar

**States:**
- **Default**: Ícone cinza neutro, sem background
- **Hover**: Lift effect, aumento de contraste, blur pulsante
- **Active**: Glow azul/lilás, gradiente translúcido, brilho escovado

**Animations:**
- Hover: scale(1.05), translateY(-2px), shadow fade
- Click: scale(0.98) → scale(1)
- Active: glow pulse sutil e contínuo

### 4. SidebarToggleButton

**Props:**
```typescript
interface SidebarToggleButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}
```

**Responsibilities:**
- Alternar estado da sidebar
- Animar ícone de chevron
- Aplicar hover effect

**Visual Design:**
- Botão circular 32px
- Ícone ChevronLeft/ChevronRight
- Posição: borda direita da sidebar, centralizado verticalmente
- Hover: background translúcido, scale(1.1)

### 5. SidebarFooter

**Props:**
```typescript
interface SidebarFooterProps {
  isExpanded: boolean;
  onLogout?: () => void;
}
```

**Responsibilities:**
- Exibir botão de logout
- Executar animação de fade-out ao logout
- Adaptar layout ao estado expandido/colapsado

**Visual Design:**
- Botão discreto com ícone LogOut
- Hover: background vermelho translúcido
- Animação: fade-out suave ao clicar

### 6. useSidebarState (Custom Hook)

**Interface:**
```typescript
function useSidebarState(defaultExpanded?: boolean): {
  isExpanded: boolean;
  toggleExpanded: () => void;
  setExpanded: (value: boolean) => void;
}
```

**Responsibilities:**
- Gerenciar estado de expansão
- Sincronizar com LocalStorage
- Fornecer funções de controle

## Data Models

### Menu Item Configuration

```typescript
interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  dividerAfter?: boolean;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { id: 'caixa', label: 'Caixa / PDV', path: '/caixa', icon: CreditCard },
  { id: 'checkin', label: 'Check-in', path: '/checkin', icon: ClipboardCheck },
  { id: 'clientes', label: 'Clientes', path: '/clientes', icon: Users },
  { id: 'veiculos', label: 'Veículos', path: '/veiculos', icon: Car },
  { id: 'estoque', label: 'Estoque', path: '/estoque', icon: Package },
  { id: 'ferramentas', label: 'Ferramentas', path: '/ferramentas', icon: Wrench },
  { id: 'agenda', label: 'Agenda', path: '/agenda', icon: Calendar },
  { id: 'relatorios', label: 'Relatórios', path: '/relatorios', icon: BarChart3, dividerAfter: true },
  { id: 'configuracoes', label: 'Configurações', path: '/configuracoes', icon: Settings }
];
```

### LocalStorage Schema

```typescript
interface SidebarState {
  isExpanded: boolean;
  lastUpdated: string;
}

// Key: 'sidebar-state'
```

## Styling Strategy

### Tailwind Classes - Base Sidebar

```css
/* Container principal */
.sidebar-container {
  @apply fixed left-0 top-0 h-screen z-50;
  @apply bg-white/80 dark:bg-gray-900/80;
  @apply backdrop-blur-md;
  @apply border-r border-gray-200/50 dark:border-gray-700/50;
  @apply shadow-[0_4px_10px_rgba(0,0,0,0.08)];
  @apply transition-all duration-300 ease-in-out;
}

/* Glassmorphism effect */
.glass-effect {
  @apply bg-gradient-to-br from-white/90 to-white/70;
  @apply dark:from-gray-900/90 dark:to-gray-800/70;
  @apply backdrop-blur-xl backdrop-saturate-150;
}
```

### Tailwind Classes - Menu Item

```css
/* Item padrão */
.menu-item {
  @apply flex items-center gap-3 px-4 py-3 mx-2 rounded-2xl;
  @apply text-gray-600 dark:text-gray-400;
  @apply transition-all duration-200;
  @apply cursor-pointer;
}

/* Item hover */
.menu-item:hover {
  @apply bg-gray-100/50 dark:bg-gray-800/50;
  @apply text-gray-900 dark:text-gray-100;
  @apply shadow-sm;
}

/* Item ativo */
.menu-item-active {
  @apply bg-gradient-to-r from-blue-500/10 to-purple-500/10;
  @apply dark:from-blue-400/20 dark:to-purple-400/20;
  @apply text-blue-600 dark:text-blue-400;
  @apply shadow-[0_0_20px_rgba(59,130,246,0.3)];
  @apply ring-1 ring-blue-500/20;
}
```

### Framer Motion Variants

```javascript
// Sidebar expansion animation
const sidebarVariants = {
  expanded: {
    width: 240,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  collapsed: {
    width: 72,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Menu item hover animation
const menuItemVariants = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Icon glow animation (active state)
const glowVariants = {
  active: {
    boxShadow: [
      "0 0 10px rgba(59, 130, 246, 0.3)",
      "0 0 20px rgba(59, 130, 246, 0.5)",
      "0 0 10px rgba(59, 130, 246, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Label fade animation
const labelVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.1, duration: 0.2 }
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.15 }
  }
};
```

## Color Palette

### Light Mode
```css
--sidebar-bg: rgba(255, 255, 255, 0.8)
--sidebar-border: rgba(229, 231, 235, 0.5)
--item-text: rgb(75, 85, 99)
--item-text-hover: rgb(17, 24, 39)
--item-active-bg: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))
--item-active-text: rgb(37, 99, 235)
--glow-color: rgba(59, 130, 246, 0.3)
```

### Dark Mode
```css
--sidebar-bg: rgba(17, 24, 39, 0.8)
--sidebar-border: rgba(55, 65, 81, 0.5)
--item-text: rgb(156, 163, 175)
--item-text-hover: rgb(243, 244, 246)
--item-active-bg: linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2))
--item-active-text: rgb(96, 165, 250)
--glow-color: rgba(96, 165, 250, 0.4)
```

## Responsive Behavior

### Desktop (≥1024px)
- Sidebar sempre visível
- Largura: 72px (compacto) / 240px (expandido)
- Animações completas habilitadas

### Tablet (768px - 1023px)
- Sidebar colapsável com overlay
- Inicia em modo compacto
- Fecha automaticamente após navegação

### Mobile (<768px)
- Sidebar como drawer overlay
- Ocupa 80% da largura da tela
- Backdrop escuro semi-transparente
- Fecha ao clicar fora ou navegar

## Error Handling

### LocalStorage Failures
```javascript
try {
  localStorage.setItem('sidebar-state', JSON.stringify(state));
} catch (error) {
  console.warn('Failed to save sidebar state:', error);
  // Fallback: usar apenas estado em memória
}
```

### Icon Loading Failures
```javascript
// Fallback para ícone genérico se importação falhar
const IconComponent = icon || Circle;
```

### Navigation Errors
```javascript
const handleNavigate = (path) => {
  try {
    navigate(path);
  } catch (error) {
    console.error('Navigation failed:', error);
    // Fallback: usar window.location
    window.location.href = path;
  }
};
```

## Testing Strategy

### Unit Tests
- Testar renderização do componente em diferentes estados
- Verificar persistência no LocalStorage
- Validar detecção de rota ativa
- Testar funções de toggle e navegação

### Integration Tests
- Testar integração com React Router
- Verificar animações de transição
- Validar comportamento responsivo
- Testar modo claro/escuro

### Visual Regression Tests
- Capturar screenshots em diferentes estados
- Comparar com baseline aprovado
- Verificar consistência visual entre temas

### Accessibility Tests
- Verificar navegação por teclado
- Testar leitores de tela
- Validar contraste de cores
- Garantir foco visível

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading de Ícones**
   - Importar ícones dinamicamente quando necessário
   - Reduzir bundle size inicial

2. **Memoization**
   - Usar `React.memo` para SidebarMenuItem
   - Evitar re-renders desnecessários

3. **Animation Performance**
   - Usar `transform` e `opacity` para animações (GPU-accelerated)
   - Evitar animações de propriedades que causam reflow

4. **LocalStorage Throttling**
   - Debounce de salvamento de estado
   - Evitar writes excessivos

## Accessibility

### Keyboard Navigation
- Tab: navegar entre itens
- Enter/Space: ativar item
- Escape: fechar sidebar (mobile)
- Arrow keys: navegar verticalmente

### ARIA Attributes
```jsx
<nav aria-label="Main navigation">
  <button aria-expanded={isExpanded} aria-label="Toggle sidebar">
  <a aria-current={isActive ? "page" : undefined}>
</nav>
```

### Focus Management
- Foco visível em todos os elementos interativos
- Ordem de foco lógica
- Trap de foco em modo mobile overlay

## Future Enhancements

1. **Badges de Notificação**
   - Contador de itens não lidos
   - Indicador visual discreto

2. **Busca Rápida**
   - Cmd/Ctrl + K para busca
   - Filtro de itens de menu

3. **Favoritos**
   - Usuário pode marcar itens favoritos
   - Seção de acesso rápido

4. **Customização**
   - Reordenar itens de menu
   - Ocultar itens não utilizados

5. **Tooltips Inteligentes**
   - Mostrar atalhos de teclado
   - Descrições contextuais

## Implementation Notes

### Dependencies Required
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "framer-motion": "^10.16.0",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.3.0"
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
        },
      },
    },
  },
};
```

### File Structure Best Practices
- Separar lógica de apresentação
- Usar hooks customizados para lógica reutilizável
- Manter componentes pequenos e focados
- Documentar decisões de design no código
