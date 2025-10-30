# 👁️ Guia Visual - Sistema de Seleção

## 🎨 Estados Visuais dos Cards

### 1. Card Normal (Não Selecionado)
```
┌─────────────────────────────────────────────────┐
│  🚗  Cliente A                          🟡 Em andamento  👁️ │
│      HONDA CG 160 • ABC-1234                    │
│      ⏰ 29/10/2025, 14:30                       │
└─────────────────────────────────────────────────┘
Fundo: Branco
Ícone: Azul
Badge: Amarelo
Cursor: Pointer
```

### 2. Card Selecionado
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ← Ring Verde
┃ ┌───────────────────────────────────────────┐ ┃
┃ │  🚗  Cliente A                  🟢 Selecionado  👁️ │ ┃
┃ │      HONDA CG 160 • ABC-1234              │ ┃
┃ │      ⏰ 29/10/2025, 14:30                 │ ┃
┃ └───────────────────────────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
Fundo: Branco + Gradiente Verde Sutil
Ícone: Verde Esmeralda
Badge: Verde "Selecionado"
Ring: Verde Esmeralda (2px)
Cursor: Pointer
```

### 3. Card Concluído
```
┌─────────────────────────────────────────────────┐
│  ✓  Cliente B                       🟢 Concluído  👁️ │
│      YAMAHA FAZER • XYZ-5678                    │
│      ⏰ 28/10/2025, 10:15                       │
└─────────────────────────────────────────────────┘
Fundo: Branco
Ícone: Verde com Check
Badge: Verde "Concluído"
Cursor: Pointer (apenas para ver detalhes)
Não Selecionável
```

## 🎯 Card Check-out Superior

### Estado Desabilitado (Nenhum Selecionado)
```
┌─────────────────────────────────────────┐
│  📤  Check-out                          │
│                                         │
│  Finalize o atendimento selecionando   │
│  um registro ativo abaixo              │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Selecione um registro           │ │ ← Botão Desabilitado
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
Ícone: Cinza
Botão: Cinza (desabilitado)
Cursor: Not-allowed
```

### Estado Ativo (Registro Selecionado)
```
┌─────────────────────────────────────────┐
│  📤  Check-out                          │ ← Ícone Verde
│                                         │
│  Selecionado: Cliente A                │ ← Nome do Cliente
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   Fazer Check-out                 │ │ ← Botão Verde Ativo
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
Ícone: Verde Esmeralda
Botão: Gradiente Verde (ativo)
Cursor: Pointer
Hover: Scale 1.05
```

## 🔄 Fluxo de Interação

### Passo 1: Estado Inicial
```
Check-out: [Desabilitado]
Cards: [Normal] [Normal] [Normal]
```

### Passo 2: Usuário Clica em Card
```
Check-out: [Ativo - Cliente A]
Cards: [SELECIONADO] [Normal] [Normal]
       ↑ Ring Verde
```

### Passo 3: Usuário Clica em Outro Card
```
Check-out: [Ativo - Cliente B]
Cards: [Normal] [SELECIONADO] [Normal]
                ↑ Ring Verde
```

### Passo 4: Usuário Clica no Mesmo Card (Desseleciona)
```
Check-out: [Desabilitado]
Cards: [Normal] [Normal] [Normal]
```

### Passo 5: Usuário Faz Check-out
```
Check-out: [Desabilitado]
Cards: [Normal] [Normal] [Concluído]
Modal: [Aberto]
```

## 🎨 Cores e Estilos

### Paleta de Cores
```css
/* Azul (Normal) */
Icon: #2563eb (blue-600)
Background: rgba(59, 130, 246, 0.2)

/* Verde (Selecionado/Concluído) */
Icon: #059669 (emerald-600)
Badge: #d1fae5 (emerald-100) + #047857 (emerald-700)
Ring: #10b981 (emerald-500)
Button: #10b981 → #059669 (gradient)

/* Amarelo (Em Andamento) */
Badge: #fef3c7 (amber-100) + #b45309 (amber-700)

/* Cinza (Desabilitado) */
Background: #e5e7eb (gray-200)
Text: #9ca3af (gray-400)
```

### Animações
```javascript
// Hover no Card
scale: 1.01
translateY: -2px
duration: 300ms

// Seleção
ring: 2px solid emerald-500
ring-offset: 2px
transition: all 300ms

// Botão Check-out
scale: 1.05 (hover)
scale: 0.98 (click)
transition: all 300ms
```

## 📱 Responsividade

### Mobile (< 640px)
```
┌─────────────────┐
│  Check-in       │
│  [Botão]        │
└─────────────────┘

┌─────────────────┐
│  Check-out      │
│  [Botão]        │
└─────────────────┘

┌─────────────────┐
│  Card 1         │
└─────────────────┘
┌─────────────────┐
│  Card 2         │
└─────────────────┘
```

### Desktop (> 1024px)
```
┌──────────────┐  ┌──────────────┐
│  Check-in    │  │  Check-out   │
│  [Botão]     │  │  [Botão]     │
└──────────────┘  └──────────────┘

┌────────────────────────────────┐
│  Card 1                        │
├────────────────────────────────┤
│  Card 2                        │
├────────────────────────────────┤
│  Card 3                        │
└────────────────────────────────┘
```

## 🎯 Indicadores Visuais

### Selecionável
```
✅ Cursor: pointer
✅ Hover: Elevação sutil
✅ Status: "Em andamento"
✅ Cor: Azul/Amarelo
```

### Selecionado
```
✅ Ring verde ao redor
✅ Ícone verde
✅ Badge verde "Selecionado"
✅ Gradiente verde sutil
```

### Não Selecionável
```
❌ Status: "Concluído"
❌ Não muda ao clicar
❌ Apenas botão "Ver detalhes" ativo
```

## 💡 Dicas de UX

### Feedback Visual Claro
- Ring verde = Selecionado
- Badge amarelo = Disponível para seleção
- Badge verde = Concluído ou Selecionado
- Botão cinza = Nenhuma ação disponível
- Botão verde = Ação disponível

### Hierarquia de Informação
1. Nome do cliente (maior, bold)
2. Veículo e placa (médio)
3. Data/hora (menor, cinza)
4. Status (badge colorido)

### Interações Intuitivas
- Clique no card = Selecionar
- Clique novamente = Desselecionar
- Clique no botão verde = Confirmar ação
- Clique no ícone 👁️ = Ver detalhes

---

**Use este guia como referência visual!** 👁️
