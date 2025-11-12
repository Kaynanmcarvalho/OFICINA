# Especificação: Modal Editar Check-in Apple-Like

## 🎯 Objetivo
Criar um modal de edição de check-in com design Apple-like: moderno, elegante, profissional, responsivo e harmonioso.

## 🎨 Design Principles

### 1. **Layout Horizontal e Centralizado**
- Modal mais largo (max-width: 90vw em telas grandes, 1400px máximo)
- Centralizado vertical e horizontalmente
- Altura adaptativa (max-height: 85vh)
- Scroll suave interno quando necessário

### 2. **Glassmorphism e Depth**
- Backdrop blur sutil
- Cards com glassmorphism
- Sombras em camadas para profundidade
- Bordas sutis e arredondadas

### 3. **Animações Fluidas**
- Entrada/saída suave (spring animations)
- Transições entre seções
- Micro-interações nos inputs
- Feedback visual imediato

### 4. **Responsividade**
- Desktop (>1280px): Layout em 2 colunas
- Tablet (768-1280px): Layout adaptativo
- Mobile (<768px): Layout em coluna única
- Touch-friendly em todos os tamanhos

## 📋 Estrutura do Modal

### Header (Fixo no topo)
```
┌─────────────────────────────────────────────────────────┐
│  [Ícone] Editar Check-in              [Status] [X]      │
│  Modifique as informações do registro                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
└─────────────────────────────────────────────────────────┘
```

### Content (Scroll)
```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │  SEÇÃO CLIENTE       │  │  SEÇÃO VEÍCULO       │    │
│  │  - Nome              │  │  - Placa             │    │
│  │  - Telefone          │  │  - Marca/Modelo      │    │
│  │  - Email             │  │  - Ano/Cor           │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │  CONDIÇÕES           │  │  SERVIÇOS            │    │
│  │  - Kilometragem      │  │  - Serviço Solicitado│    │
│  │  - Combustível       │  │  - Prioridade        │    │
│  │  - Condições         │  │  - Responsável       │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  OBSERVAÇÕES E FOTOS                             │  │
│  │  - Observações (textarea)                        │  │
│  │  - Fotos de entrada/saída                        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Footer (Fixo no fundo)
```
┌─────────────────────────────────────────────────────────┐
│  Última atualização: 15/11/2024 14:30                   │
│                              [Cancelar] [Salvar]         │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Campos do Formulário

### Seção 1: Cliente
- ✅ Nome do Cliente (text, required)
- ✅ Telefone (tel, formatted, required)
- ✅ Email (email, optional)
- ✅ CPF/CNPJ (text, formatted, optional)

### Seção 2: Veículo
- ✅ Placa (text, uppercase, formatted, required)
- ✅ Marca (text, required)
- ✅ Modelo (text, required)
- ✅ Ano (number, 1900-2025, optional)
- ✅ Cor (text, optional)
- ✅ Tipo (select: carro/moto/caminhão/van)

### Seção 3: Condições do Veículo
- ✅ Kilometragem (number, formatted)
- ✅ Nível de Combustível (select visual com ícones)
- ✅ Condições (multi-select com chips)
  - Arranhões
  - Amassados
  - Peças quebradas
  - Itens faltando
  - Sujo
  - Bom estado

### Seção 4: Serviços
- ✅ Serviço Solicitado (textarea, required)
- ✅ Prioridade (select: baixa/normal/alta/urgente)
- ✅ Responsável (text, required)
- ✅ Status (select: pendente/em andamento/concluído/cancelado)

### Seção 5: Observações e Fotos
- ✅ Observações (textarea, rich)
- ✅ Fotos de Entrada (upload/view)
- ✅ Fotos de Saída (upload/view)

## 🎨 Componentes de Design

### 1. Input Fields (Apple-style)
```jsx
<div className="group">
  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
    Nome do Cliente
  </label>
  <input
    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
               bg-white dark:bg-gray-900 text-gray-900 dark:text-white
               focus:ring-2 focus:ring-blue-500 focus:border-transparent
               transition-all duration-200 placeholder:text-gray-400"
    placeholder="Digite o nome..."
  />
</div>
```

### 2. Select com Ícones
```jsx
<div className="grid grid-cols-5 gap-2">
  {FUEL_LEVELS.map(level => (
    <button
      className={`p-3 rounded-xl border-2 transition-all
                  ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
    >
      <span className="text-2xl">{level.icon}</span>
      <span className="text-xs">{level.label}</span>
    </button>
  ))}
</div>
```

### 3. Multi-Select Chips
```jsx
<div className="flex flex-wrap gap-2">
  {CONDITIONS.map(condition => (
    <button
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${selected 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
    >
      <span>{condition.icon}</span>
      <span>{condition.label}</span>
    </button>
  ))}
</div>
```

### 4. Status Badge
```jsx
<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30">
  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
  <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">
    Em Andamento
  </span>
</div>
```

### 5. Photo Gallery
```jsx
<div className="grid grid-cols-4 gap-3">
  {photos.map(photo => (
    <div className="relative group aspect-square rounded-xl overflow-hidden">
      <img src={photo} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  ))}
</div>
```

## 🎭 Animações

### Modal Entrance
```javascript
initial={{ opacity: 0, scale: 0.96, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.96, y: 20 }}
transition={{ 
  duration: 0.2, 
  ease: [0.16, 1, 0.3, 1] // Apple's easing
}}
```

### Section Reveal (Stagger)
```javascript
{sections.map((section, index) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    {section}
  </motion.div>
))}
```

### Input Focus
```javascript
<motion.div
  whileFocus={{ scale: 1.01 }}
  transition={{ duration: 0.15 }}
>
  <input />
</motion.div>
```

## 📱 Responsividade

### Desktop (>1280px)
- Layout em 2 colunas
- Modal width: 1200px
- Padding: 32px
- Gap: 24px

### Tablet (768-1280px)
- Layout em 2 colunas (adaptativo)
- Modal width: 90vw
- Padding: 24px
- Gap: 16px

### Mobile (<768px)
- Layout em 1 coluna
- Modal width: 95vw
- Padding: 16px
- Gap: 12px
- Full-screen em telas muito pequenas

## 🎨 Color Palette

### Light Mode
- Background: #FFFFFF
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #111827
- Text Secondary: #6B7280
- Accent: #3B82F6

### Dark Mode
- Background: #111827
- Surface: #1F2937
- Border: #374151
- Text Primary: #F9FAFB
- Text Secondary: #9CA3AF
- Accent: #60A5FA

## ✅ Validações

### Cliente
- Nome: min 3 caracteres
- Telefone: formato brasileiro (XX) XXXXX-XXXX
- Email: formato válido (opcional)

### Veículo
- Placa: formato brasileiro ABC-1234 ou ABC1D23
- Marca/Modelo: min 2 caracteres
- Ano: entre 1900 e ano atual + 1

### Serviços
- Serviço Solicitado: min 10 caracteres
- Responsável: min 3 caracteres

## 🚀 Features Extras

1. **Auto-save Draft**: Salvar rascunho automaticamente
2. **Undo/Redo**: Desfazer/refazer alterações
3. **Keyboard Shortcuts**: 
   - Ctrl+S: Salvar
   - Esc: Fechar
   - Tab: Navegar entre campos
4. **Smart Suggestions**: Sugerir serviços baseado no histórico
5. **Photo Comparison**: Comparar fotos de entrada/saída
6. **Change History**: Mostrar histórico de alterações
7. **Quick Actions**: Ações rápidas no header

## 📊 Performance

- Lazy load de fotos
- Debounce em auto-save (2s)
- Memoização de componentes pesados
- Virtual scroll para listas grandes
- Otimização de re-renders

## 🎯 Resultado Esperado

Um modal que impressione pela:
- ✨ Elegância visual
- 🎨 Atenção aos detalhes
- ⚡ Performance fluida
- 📱 Responsividade perfeita
- 🎭 Animações suaves
- 🔧 Funcionalidade completa
- 💎 Qualidade Apple-like
