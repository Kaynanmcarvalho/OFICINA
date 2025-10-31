# FAQ - Sidebar & Navbar Premium

## ❓ Perguntas Frequentes

### Instalação e Setup

**Q: Como instalar o Framer Motion?**
```bash
npm install framer-motion --legacy-peer-deps
```

**Q: Por que usar --legacy-peer-deps?**
A: Devido a conflitos de versão do React. O flag permite instalar mesmo com peer dependencies incompatíveis.

**Q: Preciso reinstalar dependências?**
A: Não, apenas o Framer Motion é necessário. As outras dependências já estão no projeto.

---

### Uso Básico

**Q: Como ativar o novo layout?**
A: O layout já está ativo. Ele foi configurado automaticamente no `App.jsx`:
```jsx
import { LayoutPremium as Layout } from './components/layout/LayoutPremium';
```

**Q: Como voltar ao layout antigo?**
A: Altere a importação no `App.jsx`:
```jsx
import { Layout } from './components/layout/Layout'; // Layout antigo
```

**Q: Como adicionar um novo item no menu?**
A: Edite o array `menuItems` em `LayoutPremium.jsx`:
```jsx
const menuItems = [
  { 
    path: '/nova-pagina', 
    name: 'Nova Página', 
    icon: MdIcone, 
    color: 'blue' 
  },
];
```

---

### Customização

**Q: Como mudar as cores do tema?**
A: Edite o `tailwind.config.js`:
```javascript
colors: {
  'primary': '#2563eb', // Sua cor primária
  'accent': '#f59e0b',  // Sua cor de destaque
}
```

**Q: Como ajustar a velocidade das animações?**
A: Edite `src/utils/animations.js`:
```javascript
export const durations = {
  fast: 0.2,    // Mais rápido: 0.1
  normal: 0.3,  // Mais rápido: 0.2
  slow: 0.5     // Mais rápido: 0.3
};
```

**Q: Como desabilitar animações?**
A: As animações respeitam `prefers-reduced-motion` automaticamente. Para desabilitar manualmente:
```javascript
// src/utils/animations.js
export const prefersReducedMotion = () => true; // Sempre retorna true
```

**Q: Como mudar o tamanho da sidebar?**
A: Edite as variantes em `src/utils/animations.js`:
```javascript
export const sidebarAnimations = {
  expanded: { width: 280 }, // Era 256
  collapsed: { width: 64 }  // Era 80
};
```

---

### Problemas Comuns

**Q: A sidebar não aparece**
A: Verifique:
1. Se o `LayoutPremium` está sendo usado no `App.jsx`
2. Se há erros no console do navegador
3. Se o Framer Motion está instalado

**Q: As animações estão travando**
A: Possíveis soluções:
1. Verifique se está usando um navegador moderno
2. Desabilite extensões do navegador
3. Limpe o cache: `Ctrl+Shift+Delete`
4. Reduza a complexidade das animações

**Q: O tema não está mudando**
A: Verifique:
1. Se o `useThemeStore` está funcionando
2. Se a classe `dark` está sendo aplicada ao `<html>`
3. Se o localStorage está habilitado no navegador

**Q: A sidebar não colapsa no mobile**
A: Verifique:
1. Se a largura da tela é < 1024px
2. Se o JavaScript está habilitado
3. Se não há erros no console

**Q: Os ícones não aparecem**
A: Verifique:
1. Se `react-icons` está instalado: `npm install react-icons`
2. Se os imports estão corretos: `import { MdIcone } from 'react-icons/md'`
3. Se o ícone existe na biblioteca

---

### Performance

**Q: Como melhorar a performance?**
A: Dicas:
1. Use `React.memo` em componentes pesados
2. Use `useMemo` para cálculos complexos
3. Use `useCallback` para funções
4. Implemente lazy loading de rotas
5. Otimize imagens e assets

**Q: As animações estão lentas**
A: Soluções:
1. Reduza a duração das animações
2. Use apenas `transform` e `opacity`
3. Evite animar `width`, `height`, `margin`
4. Adicione `will-change: transform` em CSS

**Q: O bundle está muito grande**
A: Otimizações:
1. Implemente code splitting
2. Use lazy loading: `React.lazy()`
3. Remova dependências não usadas
4. Use tree shaking

---

### Acessibilidade

**Q: Como testar acessibilidade?**
A: Ferramentas:
1. Lighthouse (Chrome DevTools)
2. axe DevTools (extensão)
3. WAVE (extensão)
4. Teclado: navegue apenas com Tab/Enter

**Q: Como melhorar acessibilidade?**
A: Checklist:
- [ ] Todos os botões têm `aria-label`
- [ ] Links têm `aria-current` quando ativos
- [ ] Modais têm `role="dialog"`
- [ ] Foco visível em todos os elementos
- [ ] Contraste de cores adequado (WCAG AA)

**Q: Como adicionar suporte a screen readers?**
A: Use ARIA:
```jsx
<nav aria-label="Navegação principal">
  <button 
    aria-label="Abrir menu"
    aria-expanded={isOpen}
  >
    Menu
  </button>
</nav>
```

---

### Responsividade

**Q: Como testar responsividade?**
A: Métodos:
1. Chrome DevTools (F12 → Toggle Device Toolbar)
2. Redimensione a janela do navegador
3. Teste em dispositivos reais
4. Use ferramentas online (BrowserStack, LambdaTest)

**Q: A sidebar não funciona no mobile**
A: Verifique:
1. Se o overlay está aparecendo
2. Se o backdrop está clicável
3. Se não há `overflow: hidden` no body
4. Se o z-index está correto

**Q: Como customizar breakpoints?**
A: Edite `tailwind.config.js`:
```javascript
theme: {
  screens: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  }
}
```

---

### Integração

**Q: Como integrar com Redux?**
A: Substitua Zustand por Redux:
```jsx
import { useSelector, useDispatch } from 'react-redux';

const isDarkMode = useSelector(state => state.theme.isDarkMode);
const dispatch = useDispatch();
```

**Q: Como integrar com Next.js?**
A: Ajustes necessários:
1. Use `next/link` em vez de `react-router-dom`
2. Use `next/router` para navegação
3. Configure SSR para Framer Motion
4. Use `_app.js` para o Layout

**Q: Como integrar com TypeScript?**
A: Adicione tipos:
```typescript
interface MenuItem {
  path: string;
  name: string;
  icon: React.ComponentType;
  color: 'blue' | 'amber' | 'green' | 'red';
  badge?: number;
}
```

---

### Debugging

**Q: Como debugar animações?**
A: Ferramentas:
1. React DevTools (Components)
2. Framer Motion DevTools
3. Console.log em callbacks
4. Chrome Performance tab

**Q: Como ver o estado da sidebar?**
A: Use React DevTools:
1. Abra DevTools (F12)
2. Vá para "Components"
3. Selecione o componente Sidebar
4. Veja os hooks e props

**Q: Como debugar performance?**
A: Passos:
1. Abra Chrome DevTools
2. Vá para "Performance"
3. Clique em "Record"
4. Interaja com a sidebar
5. Pare a gravação
6. Analise o flamegraph

---

### Avançado

**Q: Como criar uma animação customizada?**
A: Exemplo:
```jsx
const customVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotate: -10 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

<motion.div variants={customVariants}>
  {/* Conteúdo */}
</motion.div>
```

**Q: Como adicionar submenu?**
A: Estrutura:
```jsx
const menuItems = [
  {
    path: '/parent',
    name: 'Parent',
    icon: MdFolder,
    submenu: [
      { path: '/parent/child1', name: 'Child 1', icon: MdFile },
      { path: '/parent/child2', name: 'Child 2', icon: MdFile },
    ]
  }
];
```

**Q: Como persistir estado da sidebar?**
A: Já implementado! O estado é salvo no localStorage automaticamente.

**Q: Como adicionar busca funcional?**
A: Implemente a lógica:
```jsx
const handleSearch = (query) => {
  // Buscar em todas as páginas
  const results = searchableItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  
  // Mostrar resultados
  setSearchResults(results);
};
```

---

## 🆘 Suporte

### Onde conseguir ajuda?

1. **Documentação**: Leia `SIDEBAR_NAVBAR_PREMIUM.md`
2. **Exemplos**: Veja `EXEMPLO_USO_SIDEBAR_NAVBAR.md`
3. **Código**: Explore os componentes em `src/components/layout/`
4. **Issues**: Reporte bugs no repositório

### Recursos Úteis

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Icons](https://react-icons.github.io/react-icons/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**💡 Não encontrou sua pergunta?** Abra uma issue ou consulte a documentação completa!
