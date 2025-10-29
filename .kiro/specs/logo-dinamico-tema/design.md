# Design Document - Logo Dinâmico com Tema

## Overview

Este documento descreve a arquitetura e implementação de um sistema de logo dinâmico que se adapta automaticamente ao tema (claro/escuro) do sistema, proporcionando uma experiência visual premium e consistente com os padrões Apple-like.

## Architecture

### Estrutura de Componentes

```
src/
├── components/
│   ├── Logo/
│   │   ├── Logo.jsx              # Componente principal
│   │   ├── Logo.module.css       # Estilos isolados
│   │   ├── LogoSVG.jsx          # Componente SVG otimizado
│   │   └── index.js             # Export barrel
│   └── layout/
│       └── Header.jsx            # Atualização para usar novo Logo
├── assets/
│   └── logos/
│       ├── logo-dark.svg         # Logo para tema escuro (convertida)
│       └── logo-light.svg        # Logo para tema claro (convertida)
└── hooks/
    └── useTheme.js               # Hook existente para detecção de tema
```

### Fluxo de Dados

```
Tema Store (Zustand/Context)
    ↓
useTheme Hook
    ↓
Logo Component
    ↓
LogoSVG Component (renderiza SVG apropriado)
    ↓
CSS Transitions (animação suave)
```

## Components and Interfaces

### 1. Logo Component (Logo.jsx)

```jsx
/**
 * Componente de Logo Dinâmico
 * Adapta-se automaticamente ao tema ativo do sistema
 */
interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'auto';
  variant?: 'full' | 'compact' | 'icon';
  onClick?: () => void;
  className?: string;
  animate?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  variant = 'full',
  onClick,
  className,
  animate = true
}) => {
  // Implementação
}
```

**Responsabilidades:**
- Detectar tema atual via useTheme hook
- Renderizar SVG apropriado baseado no tema
- Aplicar animações de transição
- Gerenciar estados de loading e erro
- Fornecer feedback visual em hover

### 2. LogoSVG Component (LogoSVG.jsx)

```jsx
/**
 * Componente SVG Otimizado
 * Renderiza logo vetorial com suporte a temas
 */
interface LogoSVGProps {
  theme: 'light' | 'dark';
  size: number;
  className?: string;
}

const LogoSVG: React.FC<LogoSVGProps> = ({
  theme,
  size,
  className
}) => {
  // SVG inline otimizado
}
```

**Responsabilidades:**
- Renderizar SVG inline para performance
- Aplicar cores via CSS variables
- Manter aspect ratio correto
- Suportar acessibilidade (ARIA)

### 3. useTheme Hook (Atualização)

```javascript
/**
 * Hook para detecção e controle de tema
 */
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Detecta mudanças de tema
  // Gerencia transições
  // Persiste preferência
  
  return { theme, setTheme, isTransitioning };
}
```

## Data Models

### Theme Configuration

```typescript
interface ThemeConfig {
  mode: 'light' | 'dark';
  colors: {
    logo: {
      primary: string;
      secondary: string;
      accent: string;
    };
    background: string;
    shadow: string;
  };
  transitions: {
    duration: number;
    easing: string;
  };
}
```

### Logo Configuration

```typescript
interface LogoConfig {
  sizes: {
    small: { width: number; height: number };
    medium: { width: number; height: number };
    large: { width: number; height: number };
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  animations: {
    fadeIn: string;
    slideIn: string;
    hover: string;
  };
}
```

## Error Handling

### Estratégias de Fallback

1. **Falha no Carregamento do SVG**
   - Exibir texto "ReparoFácil" estilizado
   - Log de erro no console (dev mode)
   - Retry automático após 2 segundos

2. **Tema Não Detectado**
   - Usar tema light como padrão
   - Detectar preferência do sistema (prefers-color-scheme)
   - Permitir override manual

3. **Performance Issues**
   - Desabilitar animações em dispositivos lentos
   - Usar versão simplificada da logo
   - Implementar debounce em mudanças de tema

### Error Boundary

```jsx
<ErrorBoundary
  fallback={<LogoFallback />}
  onError={(error) => console.error('Logo Error:', error)}
>
  <Logo />
</ErrorBoundary>
```

## Testing Strategy

### Unit Tests

1. **Logo Component**
   - Renderiza corretamente em ambos os temas
   - Aplica classes CSS apropriadas
   - Responde a mudanças de tema
   - Executa callback onClick quando fornecido

2. **LogoSVG Component**
   - Renderiza SVG válido
   - Aplica cores corretas por tema
   - Mantém aspect ratio
   - Inclui atributos de acessibilidade

3. **useTheme Hook**
   - Detecta tema inicial corretamente
   - Atualiza tema quando solicitado
   - Persiste preferência no localStorage
   - Sincroniza com preferência do sistema

### Integration Tests

1. **Transição de Tema**
   - Logo muda suavemente entre temas
   - Sem flickering ou flash de conteúdo
   - Animações executam corretamente
   - Performance mantida durante transição

2. **Responsividade**
   - Logo redimensiona em diferentes viewports
   - Breakpoints funcionam corretamente
   - Touch targets adequados em mobile
   - Orientação landscape/portrait

### Visual Regression Tests

1. **Screenshots Automatizados**
   - Logo em tema light
   - Logo em tema dark
   - Estados de hover
   - Diferentes tamanhos
   - Diferentes resoluções

## Implementation Details

### Conversão PNG para SVG

**Processo:**
1. Analisar PNGs originais (Preto.png e Branca.png)
2. Extrair formas e paths usando ferramenta de vetorização
3. Otimizar SVG com SVGO
4. Criar versão inline para React
5. Aplicar CSS variables para cores dinâmicas

**Otimizações SVG:**
```xml
<svg
  viewBox="0 0 200 60"
  xmlns="http://www.w3.org/2000/svg"
  aria-labelledby="logoTitle"
  role="img"
>
  <title id="logoTitle">ReparoFácil Logo</title>
  <g fill="currentColor">
    <!-- Paths otimizados -->
  </g>
</svg>
```

### CSS Architecture

**Variáveis de Tema:**
```css
:root {
  --logo-color-light: #000000;
  --logo-color-dark: #ffffff;
  --logo-shadow-light: rgba(0, 0, 0, 0.1);
  --logo-shadow-dark: rgba(255, 255, 255, 0.1);
  --logo-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Animações:**
```css
@keyframes logoFadeIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo {
    animation: none;
    transition: none;
  }
}
```

### Performance Optimizations

1. **Lazy Loading**
   - Pré-carregar ambas versões da logo
   - Usar IntersectionObserver se necessário
   - Cache em memória

2. **CSS Optimizations**
   - will-change: transform, opacity
   - transform3d para aceleração GPU
   - contain: layout style paint

3. **React Optimizations**
   - React.memo para evitar re-renders
   - useMemo para cálculos de tamanho
   - useCallback para handlers

### Accessibility Features

```jsx
<Logo
  aria-label={`ReparoFácil - Tema ${theme === 'dark' ? 'escuro' : 'claro'}`}
  role="img"
  tabIndex={onClick ? 0 : -1}
  onKeyPress={(e) => {
    if (e.key === 'Enter' && onClick) onClick();
  }}
/>
```

## Integration Points

### Header Component Update

```jsx
// Antes
<div className="header-logo">
  <h1>Oficina ReparoFácil</h1>
</div>

// Depois
<div className="header-logo">
  <Logo 
    size="medium"
    onClick={() => navigate('/')}
    animate={true}
  />
</div>
```

### Theme Provider Integration

```jsx
<ThemeProvider>
  <Header>
    <Logo /> {/* Detecta tema automaticamente */}
  </Header>
  <MainContent />
</ThemeProvider>
```

## Design Tokens

```javascript
export const logoTokens = {
  sizes: {
    small: { width: 120, height: 36 },
    medium: { width: 160, height: 48 },
    large: { width: 200, height: 60 }
  },
  spacing: {
    marginLeft: 24,
    marginRight: 16
  },
  transitions: {
    theme: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    hover: '150ms ease-out'
  },
  shadows: {
    light: '0 2px 8px rgba(0, 0, 0, 0.08)',
    dark: '0 2px 8px rgba(0, 0, 0, 0.24)'
  }
};
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Android 90+

## Future Enhancements

1. **Animação de Loading**
   - Skeleton loader durante carregamento inicial
   - Shimmer effect sutil

2. **Variantes Adicionais**
   - Logo monocromática
   - Logo com gradiente
   - Logo animada (micro-interações)

3. **Customização**
   - Permitir upload de logo personalizada
   - Editor de cores no admin
   - Múltiplos temas (não apenas light/dark)
