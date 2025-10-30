# 🔄 Guia de Migração - Tema Apple Premium Dark

## 🎯 Objetivo

Migrar componentes existentes do tema escuro atual (preto puro) para o **Apple Premium Dark Mode** (preto profundo com glassmorphism).

---

## 📋 Checklist de Migração

### ✅ Fase 1: Configuração Base (Concluída)

- [x] Atualizar `tailwind.config.js` com cores Apple Premium
- [x] Adicionar variáveis CSS no `src/index.css`
- [x] Criar classes de componentes premium
- [x] Adicionar shadows e effects
- [x] Configurar animações iOS-style

### 🔄 Fase 2: Componentes Globais

- [ ] Atualizar Navbar
- [ ] Atualizar Sidebar
- [ ] Atualizar Layout
- [ ] Atualizar Modais
- [ ] Atualizar Forms

### 🔄 Fase 3: Páginas

- [ ] Dashboard
- [ ] Check-in
- [ ] Clientes
- [ ] Veículos
- [ ] Configurações

---

## 🔧 Substituições Comuns

### Backgrounds

```jsx
// ❌ Antes
className="bg-gray-900 dark:bg-gray-900"

// ✅ Depois
className="bg-gray-50 dark:bg-dark-bg"
```

```jsx
// ❌ Antes
className="bg-gray-800 dark:bg-gray-800"

// ✅ Depois
className="bg-white dark:bg-dark-card"
```

### Cards

```jsx
// ❌ Antes
<div className="bg-gray-800 rounded-lg p-4 border border-gray-700">

// ✅ Depois
<div className="card-macos p-4">
```

```jsx
// ❌ Antes
<div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">

// ✅ Depois
<div className="glass-apple rounded-2xl p-6">
```

### Texto

```jsx
// ❌ Antes
className="text-white dark:text-white"

// ✅ Depois
className="text-gray-900 dark:text-dark-text"
```

```jsx
// ❌ Antes
className="text-gray-400 dark:text-gray-400"

// ✅ Depois
className="text-gray-600 dark:text-dark-muted"
```

```jsx
// ❌ Antes
className="text-gray-500 dark:text-gray-500"

// ✅ Depois
className="text-gray-500 dark:text-dark-subtle"
```

### Bordas

```jsx
// ❌ Antes
className="border border-gray-700 dark:border-gray-700"

// ✅ Depois
className="border border-gray-200 dark:border-dark-border"
```

```jsx
// ❌ Antes
className="divide-y divide-gray-700"

// ✅ Depois
className="divide-y divide-gray-200 dark:divide-dark-border"
```

### Botões

```jsx
// ❌ Antes
<button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">

// ✅ Depois
<button className="btn-macos">
```

```jsx
// ❌ Antes
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">

// ✅ Depois
<button className="btn-primary">
```

### Inputs

```jsx
// ❌ Antes
<input className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded" />

// ✅ Depois
<input className="input-macos" />
```

### Hover States

```jsx
// ❌ Antes
className="hover:bg-gray-700"

// ✅ Depois
className="hover:bg-gray-100 dark:hover:bg-dark-hover"
```

### Shadows

```jsx
// ❌ Antes
className="shadow-lg"

// ✅ Depois
className="shadow-apple-md"
```

```jsx
// ❌ Antes
className="shadow-xl"

// ✅ Depois
className="shadow-apple-lg"
```

---

## 🎨 Padrões de Migração por Componente

### 1. Card Simples

```jsx
// ❌ Antes
<div className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg">
  <h3 className="text-white text-xl font-bold mb-2">Título</h3>
  <p className="text-gray-400">Descrição</p>
</div>

// ✅ Depois
<motion.div
  whileHover={{ y: -2, scale: 1.02 }}
  className="card-macos p-6 space-y-2"
>
  <h3 className="text-gray-900 dark:text-dark-text text-xl font-bold">Título</h3>
  <p className="text-gray-600 dark:text-dark-muted">Descrição</p>
</motion.div>
```

### 2. Card com Glassmorphism

```jsx
// ❌ Antes
<div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6">
  {/* conteúdo */}
</div>

// ✅ Depois
<div className="glass-apple rounded-2xl p-6">
  {/* conteúdo */}
</div>
```

### 3. Lista de Itens

```jsx
// ❌ Antes
<div className="space-y-2">
  <button className="w-full flex items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white">
    <Icon className="w-5 h-5 mr-3" />
    <span>Item</span>
  </button>
</div>

// ✅ Depois
<div className="space-y-2">
  <button className="nav-item w-full">
    <Icon className="w-5 h-5 mr-3" />
    <span>Item</span>
  </button>
</div>
```

### 4. Modal

```jsx
// ❌ Antes
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
  <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-auto mt-20">
    {/* conteúdo */}
  </div>
</div>

// ✅ Depois
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm">
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="card-elevated rounded-2xl p-6 max-w-md mx-auto mt-20"
  >
    {/* conteúdo */}
  </motion.div>
</div>
```

### 5. Form

```jsx
// ❌ Antes
<form className="space-y-4">
  <div>
    <label className="text-white text-sm font-medium mb-2 block">Nome</label>
    <input
      type="text"
      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
    />
  </div>
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
    Enviar
  </button>
</form>

// ✅ Depois
<form className="space-y-4">
  <div>
    <label className="text-gray-900 dark:text-dark-text text-sm font-medium mb-2 block">
      Nome
    </label>
    <input
      type="text"
      className="input-macos"
    />
  </div>
  <button className="w-full btn-primary">
    Enviar
  </button>
</form>
```

### 6. Tabela

```jsx
// ❌ Antes
<table className="w-full">
  <thead className="bg-gray-800 border-b border-gray-700">
    <tr>
      <th className="text-white text-left p-3">Coluna</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-700">
    <tr className="hover:bg-gray-800">
      <td className="text-gray-400 p-3">Dado</td>
    </tr>
  </tbody>
</table>

// ✅ Depois
<table className="w-full">
  <thead className="bg-gray-100 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
    <tr>
      <th className="text-gray-900 dark:text-dark-text text-left p-3">Coluna</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
    <tr className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
      <td className="text-gray-600 dark:text-dark-muted p-3">Dado</td>
    </tr>
  </tbody>
</table>
```

---

## 🎭 Adicionando Animações

### Hover com Elevação

```jsx
import { motion } from 'framer-motion';

<motion.div
  whileHover={{ y: -2, scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
  className="card-macos p-6"
>
  {/* conteúdo */}
</motion.div>
```

### Fade In ao Montar

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
  {/* conteúdo */}
</motion.div>
```

### Tap Feedback

```jsx
<motion.button
  whileTap={{ scale: 0.95 }}
  className="btn-primary"
>
  Clique aqui
</motion.button>
```

---

## 🔍 Buscar e Substituir (Regex)

### VS Code Find & Replace

1. **Backgrounds escuros**
```regex
Buscar: bg-gray-900
Substituir: bg-gray-50 dark:bg-dark-bg
```

2. **Cards escuros**
```regex
Buscar: bg-gray-800
Substituir: bg-white dark:bg-dark-card
```

3. **Texto branco**
```regex
Buscar: text-white
Substituir: text-gray-900 dark:text-dark-text
```

4. **Texto cinza**
```regex
Buscar: text-gray-400
Substituir: text-gray-600 dark:text-dark-muted
```

5. **Bordas**
```regex
Buscar: border-gray-700
Substituir: border-gray-200 dark:border-dark-border
```

---

## ✅ Checklist por Arquivo

Ao migrar cada arquivo, verificar:

- [ ] Backgrounds atualizados
- [ ] Texto com cores corretas
- [ ] Bordas com microcontraste
- [ ] Cards usando classes premium
- [ ] Botões usando btn-macos ou btn-primary
- [ ] Inputs usando input-macos
- [ ] Hover states suaves
- [ ] Animações adicionadas (opcional)
- [ ] Glassmorphism onde apropriado
- [ ] Shadows Apple-style

---

## 🎯 Prioridades de Migração

### Alta Prioridade
1. Layout principal
2. Navbar
3. Sidebar
4. Dashboard
5. Modais principais

### Média Prioridade
6. Páginas de listagem
7. Forms
8. Tabelas
9. Cards de dados

### Baixa Prioridade
10. Páginas secundárias
11. Componentes raramente usados
12. Páginas de erro

---

## 🧪 Testando a Migração

### Checklist de Teste

- [ ] Tema claro funciona normalmente
- [ ] Tema escuro usa cores Apple Premium
- [ ] Transição entre temas é suave
- [ ] Glassmorphism aparece corretamente
- [ ] Animações são fluidas
- [ ] Texto é legível (contraste adequado)
- [ ] Hover states funcionam
- [ ] Mobile responsivo
- [ ] Performance não degradou

### Ferramentas de Teste

1. **Contrast Checker**: Verificar WCAG AA
2. **DevTools**: Inspecionar cores aplicadas
3. **Lighthouse**: Performance e acessibilidade
4. **Diferentes navegadores**: Chrome, Safari, Firefox

---

## 📚 Recursos Adicionais

- `TEMA_APPLE_PREMIUM_DARK.md` - Guia completo do tema
- `src/components/ApplePremiumShowcase.jsx` - Showcase de componentes
- `src/index.css` - Classes CSS premium
- `tailwind.config.js` - Configuração de cores

---

## 🎉 Resultado Esperado

Após a migração completa:

✨ Interface elegante e sofisticada
🎨 Profundidade visual com glassmorphism
🌙 Dark mode premium digno da Apple
⚡ Animações fluidas e naturais
📱 Responsivo e acessível
🚀 Performance mantida

---

**Status**: 📝 Guia Pronto para Uso
**Próximo Passo**: Começar migração pelos componentes globais
