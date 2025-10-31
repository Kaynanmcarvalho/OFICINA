# Premium Design System

Sistema de design premium inspirado nos princípios da Apple para o ERP de oficina.

## 🎨 Características

- **Design Tokens**: Sistema completo de tokens (cores, tipografia, espaçamento, elevação)
- **Tema Claro/Escuro**: Suporte completo com transições suaves
- **Glass Morphism**: Efeitos de vidro com backdrop-filter
- **Micro-interações**: Animações polidas com Framer Motion
- **Acessibilidade**: WCAG AA compliance
- **Responsivo**: Mobile-first com breakpoints definidos
- **TypeScript**: Totalmente tipado

## 📦 Estrutura

```
src/design-system/
├── tokens/           # Design tokens e tipos
├── components/       # Componentes React
│   ├── primitives/   # Componentes base (Button, Input, Card)
│   └── composed/     # Componentes compostos (Navbar, Sidebar, DashboardCard)
├── icons/            # Sistema de ícones
├── hooks/            # Hooks customizados
├── utils/            # Utilitários (cn, ThemeProvider)
└── examples/         # Exemplos de uso
```

## 🚀 Uso Rápido

### 1. Configurar o ThemeProvider

```tsx
import { ThemeProvider } from './design-system';

function App() {
  return (
    <ThemeProvider>
      {/* Seu app aqui */}
    </ThemeProvider>
  );
}
```

### 2. Importar CSS de tokens

```tsx
import './design-system/tokens/theme.css';
```

### 3. Usar componentes

```tsx
import { Navbar, Sidebar, DashboardCard, Button } from './design-system';
import { Users } from 'lucide-react';

function Dashboard() {
  return (
    <>
      <Navbar user={{ name: 'João', email: 'joao@email.com' }} />
      <Sidebar sections={sections} activeId="dashboard" />
      
      <main>
        <DashboardCard
          title="Total Clientes"
          value="1,234"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="glass"
        />
        
        <Button variant="primary" size="md">
          Adicionar Cliente
        </Button>
      </main>
    </>
  );
}
```

## 🎨 Componentes Disponíveis

### Primitivos
- **Button**: Botão com variantes (default, primary, secondary, ghost, danger)
- **Input**: Input com validação, ícones e estados
- **Card**: Card com glass effect e variantes
- **ThemeToggle**: Toggle de tema com animação

### Compostos
- **Navbar**: Barra de navegação com busca, notificações e perfil
- **Sidebar**: Sidebar colapsável com navegação
- **DashboardCard**: Card de dashboard com métricas e trends

## 🎯 Design Tokens

### Cores
```tsx
import { colors } from './design-system/tokens';

// Paletas disponíveis: primary, secondary, neutral, success, warning, error, info
// Cada paleta tem 10 steps (50-900)
colors.primary[500] // #3b82f6
```

### Tipografia
```tsx
import { typography } from './design-system/tokens';

typography.fontSize.base // ['1rem', { lineHeight: '1.5rem' }]
typography.fontWeight.semibold // '600'
```

### Espaçamento
```tsx
import { spacing } from './design-system/tokens';

spacing[4] // '1rem'
spacing[8] // '2rem'
```

## 🪝 Hooks

### useTheme
```tsx
import { useTheme } from './design-system';

function MyComponent() {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Modo Claro' : 'Modo Escuro'}
    </button>
  );
}
```

### useMediaQuery
```tsx
import { useIsMobile, useIsDesktop } from './design-system';

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

### useReducedMotion
```tsx
import { useReducedMotion } from './design-system';

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { y: -4 }}
    />
  );
}
```

## 🎭 Variantes

### Button
- `default`: Botão padrão com borda
- `primary`: Botão primário azul
- `secondary`: Botão secundário laranja
- `ghost`: Botão transparente
- `danger`: Botão vermelho para ações destrutivas

### Card
- `default`: Card sólido branco/escuro
- `glass`: Card com efeito de vidro
- `highlight`: Card com gradiente destacado

### Tamanhos
- `sm`: Pequeno
- `md`: Médio (padrão)
- `lg`: Grande

## 🌈 Tema Customizado

```tsx
import { useTheme } from './design-system';

function CustomTheme() {
  const { setTheme } = useTheme();
  
  // Mudar cor primária
  setTheme({ primaryHue: 280 }); // Roxo
  
  // Mudar densidade
  setTheme({ density: 'compact' });
  
  // Desabilitar animações
  setTheme({ reducedMotion: true });
}
```

## 📱 Responsividade

Breakpoints:
- Mobile: `< 768px`
- Tablet: `768px - 1023px`
- Desktop: `>= 1024px`
- Wide: `>= 1280px`

## ♿ Acessibilidade

- Contraste mínimo 4.5:1 para textos
- Navegação completa por teclado
- Focus indicators visíveis
- ARIA labels em todos os componentes
- Suporte a leitores de tela

## 🎬 Animações

Todas as animações respeitam `prefers-reduced-motion` e usam:
- Duração: 150-300ms
- Easing: `cubic-bezier(0.2, 0.9, 0.2, 1)` (Apple)

## 📚 Exemplos

Veja `src/design-system/examples/DashboardExample.tsx` para um exemplo completo de uso.

## 🔧 Configuração do Tailwind

Use `tailwind.config.premium.js` como base para sua configuração.

## 📄 Licença

Propriedade da oficina TORQ.
