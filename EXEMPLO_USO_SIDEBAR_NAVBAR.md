# Exemplos de Uso - Sidebar & Navbar Premium

## 🎯 Exemplo Básico

### 1. Usando o Layout Premium

```jsx
// src/App.jsx
import { LayoutPremium as Layout } from './components/layout/LayoutPremium';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          {/* ... outras rotas */}
        </Route>
      </Routes>
    </Router>
  );
}
```

### 2. Customizando Menu Items

```jsx
// src/components/layout/LayoutPremium.jsx
import { MdDashboard, MdPeople, MdSettings } from 'react-icons/md';

const menuItems = [
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    icon: MdDashboard, 
    color: 'blue' 
  },
  { 
    path: '/clients', 
    name: 'Clientes', 
    icon: MdPeople, 
    color: 'blue',
    badge: 5 // Opcional: mostra badge com número
  },
  { 
    path: '/settings', 
    name: 'Configurações', 
    icon: MdSettings, 
    color: 'amber' 
  },
];
```

## 🎨 Exemplos de Customização

### 1. Adicionar Novo Item com Cor Personalizada

```jsx
// Adicionar item com cor verde
const menuItems = [
  { 
    path: '/reports', 
    name: 'Relatórios', 
    icon: MdBarChart, 
    color: 'green' // Verde para indicar sucesso/crescimento
  },
];
```

### 2. Item com Badge de Notificação

```jsx
const menuItems = [
  { 
    path: '/notifications', 
    name: 'Notificações', 
    icon: MdNotifications, 
    color: 'red',
    badge: 12 // Mostra "12" no badge
  },
];
```

### 3. Customizar Título da Página

```jsx
// src/components/layout/LayoutPremium.jsx
const getPageTitle = () => {
  const titles = {
    '/dashboard': 'Painel de Controle',
    '/clients': 'Gestão de Clientes',
    '/reports': 'Análises e Relatórios',
  };
  return titles[location.pathname] || 'TORQ';
};

const getPageSubtitle = () => {
  const subtitles = {
    '/dashboard': 'Visão geral do sistema',
    '/clients': 'Cadastro e histórico',
    '/reports': 'Métricas e insights',
  };
  return subtitles[location.pathname] || '';
};
```

## 🔧 Exemplos de Hooks

### 1. Usando useSidebarState

```jsx
import { useSidebarState } from '../hooks/useSidebarState';

function MyComponent() {
  const { 
    isCollapsed, 
    toggleCollapse, 
    activeItem,
    setActive 
  } = useSidebarState();

  return (
    <div>
      <p>Sidebar está {isCollapsed ? 'colapsada' : 'expandida'}</p>
      <button onClick={toggleCollapse}>Toggle Sidebar</button>
    </div>
  );
}
```

### 2. Usando useThemeTransition

```jsx
import { useThemeTransition } from '../hooks/useThemeTransition';

function ThemeButton() {
  const { isDarkMode, toggleTheme, isTransitioning } = useThemeTransition();

  return (
    <button 
      onClick={toggleTheme}
      disabled={isTransitioning}
    >
      {isDarkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

## 🎭 Exemplos de Animações

### 1. Animação Personalizada com Framer Motion

```jsx
import { motion } from 'framer-motion';
import { fadeIn, scaleIn } from '../utils/animations';

function AnimatedCard() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="card"
    >
      <h2>Conteúdo Animado</h2>
    </motion.div>
  );
}
```

### 2. Stagger Animation em Lista

```jsx
import { motion } from 'framer-motion';
import { staggerContainer } from '../utils/animations';

function AnimatedList({ items }) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {items.map((item, index) => (
        <motion.li
          key={item.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: index * 0.05 }
            }
          }}
        >
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### 3. Hover Animation Customizada

```jsx
import { motion } from 'framer-motion';

function HoverCard() {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card"
    >
      <h3>Hover me!</h3>
    </motion.div>
  );
}
```

## 🎨 Exemplos de Estilização

### 1. Card com Glassmorphism

```jsx
function GlassCard({ children }) {
  return (
    <div className="
      bg-white/10 dark:bg-gray-800/30
      backdrop-blur-xl
      border border-white/20 dark:border-gray-700/50
      rounded-2xl
      p-6
      shadow-2xl
    ">
      {children}
    </div>
  );
}
```

### 2. Botão Premium

```jsx
function PremiumButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="
        px-6 py-3 rounded-xl
        bg-gradient-to-r from-primary-500 to-primary-700
        text-white font-semibold
        shadow-lg shadow-primary-500/50
        hover:shadow-xl hover:shadow-primary-500/70
        transition-all duration-300
      "
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
```

### 3. Input com Focus Premium

```jsx
function PremiumInput({ placeholder, value, onChange }) {
  return (
    <motion.input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full px-4 py-3 rounded-xl
        bg-white/5 dark:bg-gray-800/30
        border border-gray-300/20 dark:border-gray-700/50
        focus:border-primary-500
        focus:ring-2 focus:ring-primary-500/20
        backdrop-blur-md
        transition-all duration-300
        outline-none
      "
      whileFocus={{ scale: 1.02 }}
    />
  );
}
```

## 🔄 Exemplos de Integração

### 1. Página com Navbar Customizada

```jsx
import { Navbar } from '../components/layout/Navbar';

function CustomPage() {
  const handleSearch = (query) => {
    console.log('Searching:', query);
    // Implementar lógica de busca
  };

  return (
    <div>
      <Navbar 
        title="Minha Página" 
        subtitle="Descrição da página"
        onSearch={handleSearch}
      />
      <div className="content">
        {/* Conteúdo da página */}
      </div>
    </div>
  );
}
```

### 2. Sidebar Item Customizado

```jsx
import SidebarItem from '../components/layout/Sidebar/SidebarItem';
import { MdCustomIcon } from 'react-icons/md';

function CustomSidebar() {
  const customItem = {
    path: '/custom',
    name: 'Custom Page',
    icon: MdCustomIcon,
    color: 'amber',
    badge: 3
  };

  return (
    <SidebarItem 
      item={customItem}
      isCollapsed={false}
      onClick={() => console.log('Clicked!')}
    />
  );
}
```

## 📱 Exemplos Responsivos

### 1. Componente Responsivo

```jsx
import { useState, useEffect } from 'react';

function ResponsiveComponent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`
      ${isMobile ? 'flex-col' : 'flex-row'}
      flex gap-4
    `}>
      {/* Conteúdo */}
    </div>
  );
}
```

### 2. Grid Responsivo

```jsx
function ResponsiveGrid({ items }) {
  return (
    <div className="
      grid gap-6
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
    ">
      {items.map(item => (
        <div key={item.id} className="card">
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Dicas de Uso

### 1. Performance

```jsx
// Use React.memo para componentes que não mudam frequentemente
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Renderização pesada */}</div>;
});

// Use useMemo para cálculos pesados
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Use useCallback para funções passadas como props
const handleClick = useCallback(() => {
  console.log('Clicked!');
}, []);
```

### 2. Acessibilidade

```jsx
// Sempre adicione ARIA labels
<button 
  aria-label="Fechar modal"
  onClick={onClose}
>
  <MdClose />
</button>

// Use semantic HTML
<nav aria-label="Navegação principal">
  {/* Menu items */}
</nav>

// Indique estado atual
<Link 
  to="/dashboard"
  aria-current={isActive ? 'page' : undefined}
>
  Dashboard
</Link>
```

### 3. Temas

```jsx
// Use classes condicionais para temas
<div className={`
  ${isDarkMode 
    ? 'bg-gray-800 text-white' 
    : 'bg-white text-gray-900'
  }
`}>
  {/* Conteúdo */}
</div>

// Ou use as classes do Tailwind
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  {/* Conteúdo */}
</div>
```

---

**💡 Dica**: Explore os componentes existentes para ver mais exemplos de implementação!
