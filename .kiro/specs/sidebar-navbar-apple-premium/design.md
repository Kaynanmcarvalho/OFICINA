# Design Document - Sidebar & Navbar Apple Premium

## Overview

Este documento detalha o design técnico para transformar a Sidebar e Navbar do sistema TORQ em uma interface Apple-level premium. O design foca em minimalismo funcional, glassmorphism sofisticado, animações físicas naturais e uma experiência visual harmoniosa em ambos os temas (claro e escuro).

A solução utiliza React com Framer Motion para animações fluidas, Tailwind CSS para estilização utility-first, e uma arquitetura de componentes modular que permite fácil manutenção e extensibilidade.

## Architecture

### Component Structure

```
src/
├── components/
│   └── layout/
│       ├── Layout.jsx (container principal)
│       ├── Sidebar/
│       │   ├── Sidebar.jsx (componente principal)
│       │   ├── SidebarLogo.jsx (logo animado)
│       │   ├── SidebarNav.jsx (navegação principal)
│       │   ├── SidebarItem.jsx (item de menu individual)
│       │   ├── SidebarFooter.jsx (seção inferior)
│       │   └── sidebar.styles.js (estilos e variantes)
│       └── Navbar/
│           ├── Navbar.jsx (componente principal)
│           ├── NavbarSearch.jsx (campo de busca)
│           ├── NavbarActions.jsx (ações rápidas)
│           ├── NavbarProfile.jsx (perfil do usuário)
│           └── navbar.styles.js (estilos e variantes)
├── hooks/
│   ├── useSidebarState.js (gerenciamento de estado da sidebar)
│   └── useThemeTransition.js (transições de tema)
└── utils/
    └── animations.js (configurações de animação)
```

### State Management

O estado da sidebar será gerenciado através de um hook customizado `useSidebarState` que controla:
- Estado de colapso (expandido/colapsado)
- Item ativo atual
- Estado de hover
- Persistência no localStorage

### Animation System

Todas as animações utilizarão Framer Motion com configurações padronizadas:
- **Spring animations**: Para movimentos naturais e orgânicos
- **Cubic bezier**: Para transições suaves e precisas
- **Stagger animations**: Para efeitos em cascata
- **Layout animations**: Para mudanças de layout sem quebras

## Components and Interfaces

### 1. Sidebar Component

#### Props Interface
```typescript
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  menuItems: MenuItem[];
  className?: string;
}

interface MenuItem {
  path: string;
  name: string;
  icon: React.ComponentType;
  color?: 'blue' | 'amber' | 'green' | 'red';
  badge?: number;
  submenu?: MenuItem[];
}
```

#### Visual Specifications

**Expanded State (w-64 / 256px)**
- Dark Mode:
  - Background: `linear-gradient(180deg, #0d0d0f 0%, #1a1a1c 100%)`
  - Backdrop filter: `blur(22px)`
  - Border right: `1px solid rgba(255,255,255,0.08)`
  - Shadow: `0 0 40px rgba(0,0,0,0.3)`

- Light Mode:
  - Background: `rgba(255,255,255,0.65)`
  - Backdrop filter: `blur(20px)`
  - Border right: `1px solid rgba(0,0,0,0.06)`
  - Shadow: `0 0 40px rgba(0,0,0,0.05)`

**Collapsed State (w-20 / 80px)**
- Mesmas propriedades visuais
- Ícones centralizados
- Texto com opacity: 0
- Tooltips visíveis no hover

#### Animation Specifications

**Toggle Animation**
```javascript
const sidebarVariants = {
  expanded: {
    width: 256,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  collapsed: {
    width: 80,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const textVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.2
    }
  }
};
```

### 2. SidebarItem Component

#### Visual States

**Default State**
- Padding: `12px 16px`
- Border radius: `12px`
- Font size: `14px`
- Font weight: `500`
- Transition: `all 200ms ease-out`

**Hover State**
- Background: `rgba(255,255,255,0.05)` (dark) / `rgba(0,0,0,0.03)` (light)
- Transform: `translateY(-1px)`
- Shadow: `inset 0 0 12px rgba(255,255,255,0.05)`

**Active State**
- Background gradient baseado na cor do item
- Border left: `3px solid` com cor primária
- Glow effect: `0 0 20px rgba(primary, 0.3)`
- Breathing animation: pulse sutil

**Icon Styling**
- Size: `20px`
- Inner reflection: gradient overlay
- Active state: gradient border from primary to accent

### 3. Navbar Component

#### Props Interface
```typescript
interface NavbarProps {
  title: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  className?: string;
}
```

#### Visual Specifications

**Container**
- Height: `64px`
- Max width: `7xl` (1280px)
- Padding: `0 24px`
- Margin: `0 auto`
- Position: `sticky` top: 0
- Z-index: `50`

**Dark Mode**
- Background: `rgba(18,18,20,0.55)`
- Backdrop filter: `blur(40px)` (xl)
- Border bottom: `1px solid rgba(255,255,255,0.08)`

**Light Mode**
- Background: `rgba(255,255,255,0.6)`
- Backdrop filter: `blur(12px)` (md)
- Border bottom: `1px solid rgba(0,0,0,0.06)`

#### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  [Title/Subtitle]    [Search]    [Theme][Notif][Avatar] │
└─────────────────────────────────────────────────────────┘
     Left (flex-1)      Center       Right (flex items)
```

### 4. NavbarSearch Component

#### Visual Specifications

**Default State**
- Width: `320px`
- Height: `40px`
- Border radius: `10px`
- Background: `rgba(255,255,255,0.08)` (dark) / `rgba(0,0,0,0.04)` (light)
- Border: `1px solid rgba(255,255,255,0.1)` (dark) / `rgba(0,0,0,0.08)` (light)

**Focus State**
- Width: `400px`
- Scale: `1.02`
- Shadow: `0 4px 24px rgba(0,0,0,0.15)`
- Border color: primary
- Backdrop blur: increased

**Animation**
```javascript
const searchVariants = {
  default: {
    width: 320,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  focused: {
    width: 400,
    scale: 1.02,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};
```

### 5. Theme Toggle Component

#### Animation Specifications

**Icon Transition**
- Rotation: `180deg`
- Opacity crossfade: `0 → 1`
- Duration: `300ms`
- Easing: `ease-in-out`

```javascript
const themeIconVariants = {
  light: {
    rotate: 0,
    scale: 1,
    opacity: 1
  },
  dark: {
    rotate: 180,
    scale: 1,
    opacity: 1
  }
};
```

### 6. Profile Dropdown Component

#### Visual Specifications

**Dropdown Container**
- Width: `280px`
- Border radius: `16px`
- Padding: `8px`
- Background: glassmorphism effect
- Shadow: `0 8px 32px rgba(0,0,0,0.2)`

**Animation**
```javascript
const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  }
};
```

## Data Models

### Sidebar State Model
```typescript
interface SidebarState {
  isCollapsed: boolean;
  activeItem: string;
  hoveredItem: string | null;
  isTransitioning: boolean;
}
```

### Theme State Model
```typescript
interface ThemeState {
  isDarkMode: boolean;
  isTransitioning: boolean;
  transitionDuration: number;
}
```

### Navigation Item Model
```typescript
interface NavigationItem {
  id: string;
  path: string;
  name: string;
  icon: React.ComponentType;
  color: 'blue' | 'amber' | 'green' | 'red';
  badge?: number;
  submenu?: NavigationItem[];
  roles?: string[]; // Permissões de acesso
}
```

## Error Handling

### Graceful Degradation

1. **Animation Fallbacks**
   - Se Framer Motion falhar, usar transições CSS puras
   - Detectar `prefers-reduced-motion` e desabilitar animações complexas

2. **Theme Persistence**
   - Salvar preferência no localStorage
   - Fallback para tema do sistema se localStorage não disponível
   - Detectar `prefers-color-scheme` do navegador

3. **Responsive Breakpoints**
   - Mobile: < 640px
   - Tablet: 640px - 1024px
   - Desktop: > 1024px
   - Ajustar comportamento da sidebar em cada breakpoint

### Error Boundaries

Implementar Error Boundaries específicos para:
- Sidebar (fallback para versão simplificada)
- Navbar (fallback para barra básica)
- Animações (fallback para transições CSS)

## Testing Strategy

### Unit Tests

1. **Sidebar Component**
   - Teste de toggle entre estados expandido/colapsado
   - Teste de navegação entre itens
   - Teste de persistência de estado
   - Teste de submenu expansion

2. **Navbar Component**
   - Teste de busca e filtragem
   - Teste de theme toggle
   - Teste de dropdown de perfil
   - Teste de responsividade

3. **Animation Hooks**
   - Teste de transições de estado
   - Teste de timing e easing
   - Teste de cleanup de animações

### Integration Tests

1. **Layout Integration**
   - Teste de interação entre Sidebar e Navbar
   - Teste de sincronização de tema
   - Teste de navegação completa
   - Teste de estados de loading

2. **Responsive Behavior**
   - Teste em diferentes viewports
   - Teste de overlay mobile
   - Teste de touch interactions
   - Teste de keyboard navigation

### Visual Regression Tests

1. **Screenshot Comparisons**
   - Sidebar expandida (dark/light)
   - Sidebar colapsada (dark/light)
   - Navbar com diferentes estados
   - Transições de tema
   - Estados de hover e active

### Performance Tests

1. **Animation Performance**
   - FPS durante transições
   - Tempo de resposta ao toggle
   - Memory leaks em animações
   - Smooth scrolling

2. **Bundle Size**
   - Tamanho do bundle de componentes
   - Code splitting efetivo
   - Lazy loading de ícones

## Design Tokens

### Color Tokens
```javascript
const colorTokens = {
  // Surfaces
  'surface-dark': '#0b0b0d',
  'surface-light': '#f9f9fb',
  'card-dark': '#141417',
  'card-light': '#ffffff',
  'sidebar-dark': '#0f0f12',
  
  // Borders
  'divider-dark': 'rgba(255,255,255,0.08)',
  'divider-light': 'rgba(0,0,0,0.05)',
  
  // Text
  'muted-dark': 'rgba(255,255,255,0.55)',
  'muted-light': 'rgba(0,0,0,0.55)',
  
  // Brand
  'primary': '#2563eb',
  'accent': '#f59e0b',
};
```

### Spacing Tokens
```javascript
const spacingTokens = {
  'sidebar-padding': '16px',
  'navbar-height': '64px',
  'item-gap': '8px',
  'section-gap': '24px',
};
```

### Animation Tokens
```javascript
const animationTokens = {
  'duration-fast': '200ms',
  'duration-normal': '300ms',
  'duration-slow': '500ms',
  'easing-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'easing-spring': { type: 'spring', stiffness: 300, damping: 30 },
};
```

### Typography Tokens
```javascript
const typographyTokens = {
  'font-family': '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
  'navbar-title': { size: '1.5rem', weight: 600, tracking: '-0.025em' },
  'navbar-subtitle': { size: '0.875rem', weight: 400 },
  'sidebar-item': { size: '0.875rem', weight: 500 },
};
```

## Implementation Notes

### Tailwind Configuration Extensions

Adicionar ao `tailwind.config.js`:

```javascript
extend: {
  colors: {
    'surface-dark': '#0b0b0d',
    'surface-light': '#f9f9fb',
    'card-dark': '#141417',
    'card-light': '#ffffff',
    'sidebar-dark': '#0f0f12',
    'divider-dark': 'rgba(255,255,255,0.08)',
    'divider-light': 'rgba(0,0,0,0.05)',
    'muted-dark': 'rgba(255,255,255,0.55)',
    'muted-light': 'rgba(0,0,0,0.55)',
  },
  borderRadius: {
    'xl': '1rem',
    '2xl': '1.5rem',
  },
  backdropBlur: {
    'xs': '2px',
    'sm': '4px',
    'md': '12px',
    'lg': '16px',
    'xl': '40px',
  },
}
```

### Framer Motion Configuration

```javascript
// src/utils/animations.js
export const motionConfig = {
  reducedMotion: 'user',
  layoutTransition: {
    type: 'spring',
    stiffness: 300,
    damping: 30
  }
};

export const sidebarAnimations = {
  expanded: {
    width: 256,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  collapsed: {
    width: 80,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const itemAnimations = {
  hover: {
    y: -1,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};
```

### Accessibility Considerations

1. **Keyboard Navigation**
   - Tab order lógico
   - Focus visible em todos os elementos interativos
   - Atalhos de teclado para toggle da sidebar (Ctrl+B)

2. **Screen Readers**
   - ARIA labels apropriados
   - ARIA expanded states
   - Anúncios de mudança de estado

3. **Reduced Motion**
   - Respeitar `prefers-reduced-motion`
   - Fallback para transições simples
   - Manter funcionalidade sem animações

4. **Color Contrast**
   - WCAG AA compliance mínimo
   - Contraste adequado em ambos os temas
   - Indicadores visuais além de cor

## Performance Optimizations

1. **Component Memoization**
   - Usar `React.memo` para SidebarItem
   - Usar `useMemo` para cálculos de estilo
   - Usar `useCallback` para handlers

2. **Animation Performance**
   - Usar `transform` e `opacity` (GPU accelerated)
   - Evitar animações de `width` quando possível
   - Usar `will-change` estrategicamente

3. **Bundle Optimization**
   - Code splitting por rota
   - Lazy loading de ícones
   - Tree shaking de Framer Motion

4. **Rendering Optimization**
   - Virtualização de listas longas
   - Debounce em search input
   - Throttle em scroll handlers

## Browser Support

- Chrome/Edge: últimas 2 versões
- Firefox: últimas 2 versões
- Safari: últimas 2 versões
- Mobile browsers: iOS Safari 14+, Chrome Android 90+

## Migration Strategy

1. **Phase 1**: Criar novos componentes sem afetar os existentes
2. **Phase 2**: Implementar feature flag para toggle entre versões
3. **Phase 3**: Migrar gradualmente, página por página
4. **Phase 4**: Remover componentes antigos após validação completa
