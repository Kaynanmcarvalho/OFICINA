# Guia Completo: Redesign Modal de Orçamento Premium

## 🎯 Objetivo
Reconstruir o modal de orçamento com o mesmo nível de excelência dos modais de Check-in e Check-out, usando design Apple-like e sistema de steps inteligente.

## 📋 Estrutura de 4 Steps

### **Step 1: Cliente** 🔵
**Objetivo**: Identificar o cliente

**Campos**:
- 🔍 Busca inteligente de clientes (dropdown com filtro)
- 👤 Nome do cliente *
- 📱 Telefone *
- 📧 Email

**Design**:
- Badge azul com ícone User
- Campo de busca com dropdown animado
- Cards de clientes com foto/avatar
- Indicador "Do Check-in" se vier de check-in

**Validações**:
- Nome obrigatório
- Telefone obrigatório e formatado

---

### **Step 2: Veículo** 🔴
**Objetivo**: Identificar o veículo

**Campos**:
- 🚗 Placa * (com busca automática)
- 🏭 Marca
- 🚙 Modelo *
- 📅 Ano
- 🎨 Cor

**Design**:
- Badge vermelho com ícone Car
- Botão "Buscar Dados" com loading spinner
- Preview do veículo com ícone grande
- Card com gradiente mostrando dados do veículo

**Funcionalidades**:
- Busca automática por placa (API)
- Auto-preenchimento de marca/modelo/ano
- Validação de formato de placa

---

### **Step 3: Itens** 🟢🟡
**Objetivo**: Adicionar produtos e serviços

**Componentes**:
1. **Toggle Produto/Serviço**
   - Botões visuais com ícones
   - Produto: Package icon, azul
   - Serviço: Wrench icon, verde

2. **Busca de Produtos** (se tipo = produto)
   - Campo de busca com dropdown
   - Lista de produtos do inventário
   - Mostra: nome, código, preço, estoque

3. **Formulário de Item**
   - Nome/Descrição
   - Quantidade (number input)
   - Preço unitário (currency input)
   - Botão "Adicionar Item"

4. **Lista de Itens Adicionados**
   - Cards com tipo (produto/serviço)
   - Edição inline de qtd/preço
   - Botão remover
   - Subtotal por item

**Design**:
- Cards coloridos por tipo
- Animações ao adicionar/remover
- Empty state elegante
- Totalizador em tempo real

---

### **Step 4: Resumo** 💰
**Objetivo**: Finalizar valores e observações

**Seções**:

1. **Resumo Financeiro**
   ```
   Subtotal:    R$ XXX,XX
   Desconto:    R$ XXX,XX
   ─────────────────────
   Total:       R$ XXX,XX
   ```

2. **Campos Adicionais**
   - 💸 Desconto (currency)
   - 📅 Válido até (date)
   - 📝 Observações para o cliente (textarea)
   - 🔒 Observações internas (textarea)

3. **Preview do Orçamento**
   - Card com todos os dados
   - Lista de itens
   - Valores destacados
   - Botão "Gerar PDF" (futuro)

**Design**:
- Card de resumo com gradiente
- Valores em destaque
- Separadores visuais
- Botão de finalização destacado

---

## 🎨 Design System

### Paleta de Cores
```css
/* Tema Principal */
--primary: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); /* Roxo → Rosa */

/* Steps */
--step-1: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); /* Azul */
--step-2: linear-gradient(135deg, #ef4444 0%, #f97316 100%); /* Vermelho */
--step-3-product: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); /* Azul */
--step-3-service: linear-gradient(135deg, #10b981 0%, #059669 100%); /* Verde */
--step-4: linear-gradient(135deg, #f59e0b 0%, #eab308 100%); /* Amarelo */
```

### Componentes Reutilizáveis

#### Badge com Ícone
```jsx
<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
  <Icon className="w-4 h-4" stroke="white" strokeWidth={2.5} />
</div>
```

#### Card Glassmorphism
```jsx
<div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
  {/* Content */}
</div>
```

#### Input com Ícone
```jsx
<div className="relative">
  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
    <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
  </div>
  <input className="w-full pl-16 pr-4 py-3.5 rounded-xl..." />
</div>
```

---

## 🔄 Fluxos de Uso

### Fluxo 1: Criar Orçamento do Zero
1. Abre modal vazio
2. Step 1: Busca e seleciona cliente
3. Step 2: Digita placa → busca dados → preenche
4. Step 3: Adiciona produtos/serviços
5. Step 4: Revisa, adiciona desconto/obs
6. Finaliza → Orçamento criado

### Fluxo 2: Criar de um Check-in
1. Abre modal com dados pré-preenchidos
2. Step 1: Cliente já preenchido (badge "Do Check-in")
3. Step 2: Veículo já preenchido
4. Step 3: Adiciona itens
5. Step 4: Finaliza
6. Orçamento vinculado ao check-in

### Fluxo 3: Editar Orçamento Existente
1. Abre modal com todos os dados
2. Navega pelos steps editando
3. Salva alterações
4. Histórico de versões mantido

---

## ✨ Funcionalidades Inteligentes

### Auto-preenchimento
- Cliente: busca por nome/telefone/CPF
- Veículo: busca por placa (API externa)
- Produtos: busca no inventário

### Cálculos Automáticos
- Subtotal por item
- Subtotal geral
- Desconto
- Total final
- Atualização em tempo real

### Validações
- Por step (não avança sem preencher)
- Formato de telefone
- Formato de placa
- Valores numéricos
- Pelo menos 1 item

### Integrações
- **Inventário**: Busca produtos, mostra estoque
- **Clientes**: Busca clientes cadastrados
- **Check-in**: Vincula orçamento ao atendimento
- **API Placa**: Busca dados do veículo

---

## 🎯 Indicadores Visuais

### Badges
- "Do Check-in": Azul, quando vem de check-in
- "Produto": Azul, nos itens tipo produto
- "Serviço": Verde, nos itens tipo serviço
- "Editando": Amarelo, quando está editando

### Animações
- Fade in/out entre steps
- Slide ao adicionar/remover itens
- Pulse no botão de finalizar
- Loading spinners em buscas

### Feedback
- Toast de sucesso/erro
- Mensagens de validação
- Loading states
- Empty states elegantes

---

## 📱 Responsividade

### Desktop (>1024px)
- Grid 2 colunas em alguns steps
- Sidebar com resumo sempre visível
- Dropdowns amplos

### Tablet (768px - 1024px)
- Grid 1 coluna
- Campos maiores
- Botões adaptados

### Mobile (<768px)
- Stack vertical
- Inputs full-width
- Botões grandes para touch
- Steps compactos

---

## 🚀 Implementação

### Arquivo Principal
`src/pages/budgets/components/BudgetModalPremium.jsx`

### Dependências
```javascript
import { motion, AnimatePresence } from 'framer-motion';
import { lucide-react icons };
import { useBudgetStore } from '../../../store/budgetStore';
import { useClientStore } from '../../../store';
import { useInventoryStore } from '../../../store/inventoryStore';
```

### Estrutura de Estado
```javascript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({
  // Step 1
  clientId, clientName, clientPhone, clientEmail,
  // Step 2
  vehicleId, vehiclePlate, vehicleBrand, vehicleModel, vehicleYear, vehicleColor,
  // Step 3
  items: [],
  // Step 4
  discount, notes, internalNotes, validUntil
});
```

---

## ✅ Checklist de Implementação

### Design
- [ ] Header com gradiente roxo/rosa
- [ ] Steps indicator animado
- [ ] Cards glassmorphism
- [ ] Badges coloridos
- [ ] Animações Framer Motion
- [ ] Dark mode completo

### Step 1: Cliente
- [ ] Campo de busca com dropdown
- [ ] Lista de clientes filtrada
- [ ] Seleção de cliente
- [ ] Campos de contato
- [ ] Validações

### Step 2: Veículo
- [ ] Campo de placa
- [ ] Botão buscar dados
- [ ] Auto-preenchimento
- [ ] Preview do veículo
- [ ] Validações

### Step 3: Itens
- [ ] Toggle produto/serviço
- [ ] Busca de produtos
- [ ] Formulário de item
- [ ] Lista de itens
- [ ] Edição inline
- [ ] Remover item
- [ ] Cálculos automáticos

### Step 4: Resumo
- [ ] Tabela de itens
- [ ] Resumo financeiro
- [ ] Campo de desconto
- [ ] Observações
- [ ] Preview final
- [ ] Botão finalizar

### Funcionalidades
- [ ] Navegação entre steps
- [ ] Validação por step
- [ ] Auto-save (opcional)
- [ ] Integração com inventário
- [ ] Integração com check-in
- [ ] Busca de placa (API)
- [ ] Cálculos em tempo real

---

## 🎉 Resultado Esperado

Um modal de orçamento profissional, intuitivo e visualmente impressionante que:
- ✅ Organiza o processo em 4 steps claros
- ✅ Facilita a criação de orçamentos
- ✅ Integra com inventário e check-ins
- ✅ Calcula valores automaticamente
- ✅ Tem design Apple-like premium
- ✅ Funciona perfeitamente em qualquer dispositivo

**Tempo estimado de implementação**: 4-6 horas
**Complexidade**: Alta
**Impacto**: Muito Alto
