# Sidebar Apple-like Premium

Componente de navegação lateral inspirado no design da Apple, com estética minimalista, animações fluidas e efeitos glassmorphism.

## Features

✨ **Design Premium**
- Estética minimalista inspirada em macOS Sonoma e VisionOS
- Efeito glassmorphism com backdrop blur
- Sombras dinâmicas e cantos arredondados
- Gradientes sutis e translúcidos

🎭 **Animações Fluidas**
- Transições suaves com Framer Motion
- Microanimações em hover e click
- Efeito glow pulsante em item ativo
- Spring physics para expansão/colapso

🎨 **Tema Claro/Escuro**
- Detecção automática de preferência do sistema
- Suporte completo a dark mode
- Transições suaves entre temas
- Contraste adequado em ambos os modos

💾 **Persistência**
- Estado de expansão salvo no LocalStorage
- Preferência de tema persistida
- Restauração automática ao recarregar

🔍 **Detecção de Rota Ativa**
- Integração com React Router
- Destaque visual automático
- Efeito glow em rota ativa

## Instalação

As dependências necessárias já estão instaladas:
- `framer-motion` - Animações
- `lucide-react` - Ícones
- `react-router-dom` - Roteamento

## Uso Básico

```jsx
import { SidebarAppleLike } from './components/Sidebar/SidebarAppleLike';

function App() {
  const handleLogout = async () => {
    // Lógica de logout
    console.log('Logout');
  };

  return (
    <div className="flex">
      <SidebarAppleLike 
        defaultExpanded={true}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-[240px] transition-all duration-300">
        {/* Conteúdo principal */}
      </main>
    </div>
  );
}
```

## Props

### SidebarAppleLike

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `className` | `string` | `''` | Classes CSS adicionais |
| `defaultExpanded` | `boolean` | `true` | Estado inicial da sidebar |
| `onNavigate` | `function` | - | Callback ao navegar (opcional) |
| `user` | `object` | - | Dados do usuário (name, email, avatar) |
| `onLogout` | `function` | - | Callback ao fazer logout |

### Objeto User

```typescript
{
  name: string;      // Nome do usuário
  email?: string;    // Email (opcional)
  avatar?: string;   // URL do avatar (opcional)
}
```

## Integração com Tema

A sidebar já suporta tema claro/escuro automaticamente através das classes Tailwind `dark:`.

Para controlar o tema manualmente, use o hook `useTheme`:

```jsx
import { useTheme } from './hooks/useTheme';
import { SidebarAppleLike } from './components/Sidebar/SidebarAppleLike';

function App() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="flex">
      <SidebarAppleLike />
      
      <main className="flex-1">
        <button onClick={toggleTheme}>
          Tema: {isDark ? 'Escuro' : 'Claro'}
        </button>
      </main>
    </div>
  );
}
```

## Integração com Firebase Auth

Para exibir dados do usuário autenticado:

```jsx
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import { SidebarAppleLike } from './components/Sidebar/SidebarAppleLike';

function App() {
  const [user] = useAuthState(auth);

  const userData = user ? {
    name: user.displayName || 'Usuário',
    email: user.email,
    avatar: user.photoURL
  } : undefined;

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <div className="flex">
      <SidebarAppleLike 
        user={userData}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {/* Conteúdo */}
      </main>
    </div>
  );
}
```

## Ajustando Layout Principal

Quando a sidebar está expandida (240px) ou colapsada (72px), ajuste o padding do conteúdo:

```jsx
import { useSidebarState } from './components/Sidebar/useSidebarState';

function Layout({ children }) {
  const { isExpanded } = useSidebarState();

  return (
    <div className="flex">
      <SidebarAppleLike />
      
      <main 
        className={`
          flex-1 transition-all duration-300
          ${isExpanded ? 'ml-[240px]' : 'ml-[72px]'}
        `}
      >
        {children}
      </main>
    </div>
  );
}
```

## Customização de Itens de Menu

Edite o arquivo `sidebarConfig.js` para adicionar, remover ou modificar itens:

```javascript
// src/components/Sidebar/sidebarConfig.js
import { Home, Settings } from 'lucide-react';

export const menuItems = [
  {
    id: 'home',
    label: 'Início',
    path: '/',
    icon: Home,
  },
  {
    id: 'settings',
    label: 'Configurações',
    path: '/configuracoes',
    icon: Settings,
    dividerAfter: true, // Adiciona divisor após este item
  },
];
```

## Responsividade

A sidebar é totalmente responsiva:

- **Desktop (≥1024px)**: Sempre visível, expansível
- **Tablet (768px-1023px)**: Colapsável, inicia compacta
- **Mobile (<768px)**: Drawer overlay (implementação futura)

## Acessibilidade

A sidebar inclui:
- Atributos ARIA apropriados
- Navegação por teclado
- Foco visível
- Labels descritivos

### Atalhos de Teclado

- `Tab`: Navegar entre itens
- `Enter/Space`: Ativar item
- `Escape`: Fechar (mobile)

## Performance

Otimizações implementadas:
- Animações GPU-accelerated (transform/opacity)
- Lazy loading de ícones
- Memoization de componentes
- Debounce de LocalStorage

## Estrutura de Arquivos

```
src/components/Sidebar/
├── SidebarAppleLike.jsx          # Componente principal
├── SidebarHeader.jsx              # Header com avatar
├── SidebarMenuItem.jsx            # Item de menu
├── SidebarToggleButton.jsx        # Botão de toggle
├── SidebarFooter.jsx              # Rodapé com logout
├── useSidebarState.js             # Hook de estado
├── sidebarConfig.js               # Configuração de itens
└── README.md                      # Esta documentação
```

## Troubleshooting

### Sidebar não aparece

Verifique se o componente está sendo renderizado e se não há conflitos de z-index.

### Tema não muda

Certifique-se de que o Tailwind está configurado para dark mode:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // ou 'media'
  // ...
}
```

### Animações travando

Verifique se o Framer Motion está instalado corretamente:

```bash
npm install framer-motion
```

### LocalStorage não funciona

O componente continua funcionando mesmo se LocalStorage falhar. Verifique o console para warnings.

## Suporte

Para dúvidas ou problemas, consulte:
- Documentação do Framer Motion: https://www.framer.com/motion/
- Documentação do Lucide: https://lucide.dev/
- Documentação do Tailwind: https://tailwindcss.com/

## Licença

Este componente faz parte do sistema de oficina e segue a mesma licença do projeto.
