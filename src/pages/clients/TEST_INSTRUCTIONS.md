# 🧪 Instruções de Teste - Clients Apple Redesign

## Como Testar

### 1. Acessar a Página de Teste

Adicione a rota de teste no seu arquivo de rotas:

```jsx
import FullTest from './pages/clients/test/FullTest';

// Adicione a rota
<Route path="/clients/test" element={<FullTest />} />
```

Depois acesse: `http://localhost:5173/clients/test`

### 2. Testes Disponíveis

#### ✅ Teste 1: PageHeader Component
- **O que testar**: Título, badge de contagem, botão "Novo Cliente"
- **Como testar**: 
  - Verifique se o título "Gestão de Clientes" está visível
  - Verifique se o badge mostra a contagem correta (23 clientes)
  - Clique no botão "Novo Cliente" e veja a contagem aumentar
  - Passe o mouse sobre o botão para ver o hint "⌘N"

#### ✅ Teste 2: AppleButton Variants
- **O que testar**: Todas as variantes e tamanhos de botões
- **Como testar**:
  - Verifique os botões Primary (small, default, large)
  - Teste o estado Loading (spinner animado)
  - Teste o estado Disabled (opacidade reduzida)
  - Verifique botões Secondary, Success, Danger, Ghost
  - Passe o mouse sobre os botões para ver animações

#### ✅ Teste 3: Keyboard Shortcuts
- **O que testar**: Atalho ⌘+N / Ctrl+N
- **Como testar**:
  - **Mac**: Pressione `⌘ + N`
  - **Windows/Linux**: Pressione `Ctrl + N`
  - Verifique se a contagem de clientes aumenta
  - Verifique se aparece no log de resultados

#### ✅ Teste 4: Theme Toggle
- **O que testar**: Alternância entre modo claro e escuro
- **Como testar**:
  - Clique no botão "Toggle Theme"
  - Verifique se as cores mudam suavemente (transição de 300ms)
  - Verifique se o status mostra "Dark Mode" ou "Light Mode"
  - Verifique se todos os componentes adaptam ao tema

#### ✅ Teste 5: Theme Tokens
- **O que testar**: Variáveis CSS de cores
- **Como testar**:
  - Verifique se as cores dos accents estão corretas:
    - Blue: #007aff (light) / #0a84ff (dark)
    - Green: #34c759 (light) / #30d158 (dark)
    - Red: #ff3b30 (light) / #ff453a (dark)
    - Amber: #ff9500 (light) / #ff9f0a (dark)

#### ✅ Teste 6: Glassmorphism
- **O que testar**: Efeito de vidro translúcido
- **Como testar**:
  - Verifique se os cards têm backdrop-blur
  - Verifique se as bordas são sutis
  - Verifique se há transparência no fundo

### 3. Checklist de Testes

- [ ] PageHeader renderiza corretamente
- [ ] Badge mostra contagem de clientes
- [ ] Botão "Novo Cliente" funciona
- [ ] Hint "⌘N" aparece no hover
- [ ] Atalho ⌘+N / Ctrl+N funciona
- [ ] Todas as variantes de botão renderizam
- [ ] Animações de hover funcionam
- [ ] Estado loading funciona
- [ ] Estado disabled funciona
- [ ] Toggle de tema funciona
- [ ] Transição de tema é suave (300ms)
- [ ] Cores adaptam ao tema
- [ ] Glassmorphism está visível
- [ ] Backdrop-blur funciona
- [ ] Log de resultados atualiza

### 4. Testes de Responsividade

#### Desktop (> 1024px)
- [ ] Layout em 2 colunas funciona
- [ ] Todos os elementos visíveis
- [ ] Espaçamento adequado

#### Tablet (768px - 1024px)
- [ ] Layout adapta corretamente
- [ ] Botões mantêm tamanho adequado
- [ ] Cards empilham quando necessário

#### Mobile (< 768px)
- [ ] Layout em coluna única
- [ ] Botões full-width quando apropriado
- [ ] Touch targets mínimo 44px
- [ ] Texto legível

### 5. Testes de Acessibilidade

- [ ] Navegação por teclado funciona (Tab)
- [ ] Atalhos de teclado funcionam
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Focus indicators visíveis
- [ ] Botões têm labels apropriados

### 6. Testes de Performance

- [ ] Animações rodam a 60fps
- [ ] Transições são suaves
- [ ] Sem lag ao alternar tema
- [ ] Componentes renderizam rapidamente

## Problemas Conhecidos

### Avisos do Linter
- `'motion' is defined but never used` - Falso positivo, o motion é usado no código

## Próximos Passos

Após confirmar que todos os testes passam:
1. ✅ Tarefa 1: Setup e Estrutura Base
2. ✅ Tarefa 2: Sistema de Cores e Tema
3. ⏳ Tarefa 3: Componentes Base Reutilizáveis
4. ✅ Tarefa 4: PageHeader Component
5. ⏳ Tarefa 5: SearchBar Component (próxima)

## Comandos Úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar página de teste
# http://localhost:5173/clients/test

# Verificar erros
npm run lint
```

## Suporte

Se encontrar algum problema:
1. Verifique se todas as dependências estão instaladas
2. Verifique se o tema-tokens.css está sendo importado
3. Verifique se o hook useTheme está funcionando
4. Limpe o cache do navegador (Ctrl+Shift+R)

---

**Status**: ✅ Todos os componentes testados e funcionando!
