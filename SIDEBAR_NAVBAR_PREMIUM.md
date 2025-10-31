# Sidebar & Navbar Apple Premium - Implementação Completa

## 🎨 Visão Geral

Sistema de navegação premium inspirado nas interfaces da Apple (macOS, iCloud, Final Cut), com minimalismo funcional, glassmorphism sofisticado e animações fluidas.

## ✨ Características Principais

### Sidebar
- **Estados**: Expandida (256px) e Colapsada (80px)
- **Glassmorphism**: Translucidez com backdrop-blur premium
- **Animações**: Transições suaves com cubic-bezier e spring physics
- **Temas**: Suporte completo a dark/light mode
- **Responsividade**: Overlay mobile com slide-in animation
- **Atalho**: Ctrl+B (ou Cmd+B no Mac) para toggle

### Navbar
- **Translúcida**: Flutua sobre o conteúdo com glassmorphism
- **Busca**: Campo expansível com animação de focus
- **Ações**: Theme toggle, notificações, perfil
- **Tipografia**: SF Pro Display/Inter com tracking preciso

### Animações
- **Hover**: Elevação de 1px com glow sutil
- **Active**: Breathing pulse effect
- **Toggle**: Spring animation natural
- **Theme**: Crossfade suave entre modos
- **Icons**: Reflexo interno estilo Apple

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   └── layout/
│       ├── LayoutPremium.jsx          # Layout principal
│       ├── Sidebar/
│       │   ├── Sidebar.jsx            # Container da sidebar
│       │   ├── SidebarLogo.jsx        # Logo animado
│       │   ├── SidebarNav.jsx         # Navegação principal
│       │   ├── SidebarItem.jsx        # Item de menu
│       │   ├── SidebarFooter.jsx      # Footer com toggle
│       │   └── index.js               # Exports
│       └── Navbar/
│           ├── Navbar.jsx             # Container da navbar
│           ├── NavbarSearch.jsx       # Campo de busca
│           ├── NavbarActions.jsx      # Ações rápidas
│           ├── NavbarProfile.jsx      # Dropdown de perfil
│           ├── ThemeToggle.jsx        # Toggle de tema
│           └── index.js               # Exports
├── hooks/
│   ├── useSidebarState.js             # Estado da sidebar
│   └── useThemeTransition.js          # Transições de tema
└── utils/
    └── animations.js                   # Configurações de animação
```

## 🚀 Como Usar

### Ativação

O novo layout já está ativo no sistema. Para reverter ao layout antigo:

```javascript
// src/App.jsx
import { Layout } from './components/layout/Layout'; // Layout antigo
// import { LayoutPremium as Layout } from './components/layout/LayoutPremium'; // Layout novo
```

### Personalização

#### Adicionar Item de Menu

```javascript
// src/components/layout/LayoutPremium.jsx
const menuItems = [
  { 
    path: '/nova-pagina', 
    name: 'Nova Página', 
    icon: MdIcone, 
    color: 'blue' // blue, amber, green, red
  },
];
```

#### Cores Disponíveis

- `blue`: Azul padrão (primary)
- `amber`: Laranja/Âmbar (accent)
- `green`: Verde
- `red`: Vermelho

#### Ajustar Animações

```javascript
// src/utils/animations.js
export const durations = {
  fast: 0.2,    // Animações rápidas
  normal: 0.3,  // Animações normais
  slow: 0.5     // Animações lentas
};
```

## 🎨 Paleta de Cores

### Dark Mode
- Surface: `#0b0b0d`
- Card: `#141417`
- Sidebar: Gradient `#0d0d0f → #1a1a1c`
- Navbar: `rgba(18,18,20,0.55)`
- Divider: `rgba(255,255,255,0.08)`

### Light Mode
- Surface: `#f9f9fb`
- Card: `#ffffff`
- Sidebar: `rgba(255,255,255,0.65)`
- Navbar: `rgba(255,255,255,0.6)`
- Divider: `rgba(0,0,0,0.05)`

### Brand
- Primary: `#2563eb` (Blue)
- Accent: `#f59e0b` (Amber)

## ⌨️ Atalhos de Teclado

- **Ctrl+B** (Windows/Linux) ou **Cmd+B** (Mac): Toggle sidebar

## ♿ Acessibilidade

- ✅ Navegação por teclado completa
- ✅ ARIA labels e estados
- ✅ Suporte a `prefers-reduced-motion`
- ✅ Contraste WCAG AA
- ✅ Focus visible em todos os elementos

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Comportamento
- **Desktop**: Sidebar fixa, toggle entre expandida/colapsada
- **Mobile**: Sidebar overlay com backdrop, fecha ao clicar fora

## 🔧 Tecnologias

- **React**: Componentes funcionais com hooks
- **Framer Motion**: Animações fluidas e físicas
- **Tailwind CSS**: Estilização utility-first
- **React Router**: Navegação
- **Zustand**: Gerenciamento de estado (theme, auth)

## 🎯 Performance

### Otimizações Implementadas
- ✅ React.memo em componentes críticos
- ✅ Animações GPU-accelerated (transform, opacity)
- ✅ Lazy loading de rotas
- ✅ Debounce em search input
- ✅ Virtualização de listas longas (se necessário)

### Métricas Esperadas
- FPS: 60fps constante em animações
- First Paint: < 1s
- Time to Interactive: < 2s

## 🐛 Troubleshooting

### Sidebar não aparece
Verifique se o LayoutPremium está sendo usado no App.jsx

### Animações travando
Verifique se o Framer Motion está instalado:
```bash
npm install framer-motion --legacy-peer-deps
```

### Cores não aplicando
Verifique se o Tailwind foi recompilado:
```bash
npm run dev
```

### Theme não persiste
Verifique o localStorage do navegador (chave: `theme-preference`)

## 📝 Notas de Desenvolvimento

### Próximas Melhorias
- [ ] Adicionar busca global funcional
- [ ] Implementar notificações reais
- [ ] Adicionar submenu expansível
- [ ] Criar variantes de sidebar (mini, full, auto)
- [ ] Adicionar mais temas (high contrast, sepia)

### Manutenção
- Manter consistência de cores no Tailwind config
- Atualizar animações conforme feedback de UX
- Monitorar performance em dispositivos low-end
- Testar acessibilidade regularmente

## 🎓 Referências

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📄 Licença

Este componente faz parte do sistema TORQ e segue a mesma licença do projeto principal.

---

**Desenvolvido com ❤️ para TORQ**
