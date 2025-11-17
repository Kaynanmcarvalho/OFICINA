# 🚀 Quick Start - Análise de Custos e Margens

## Instalação Rápida (5 minutos)

### 1. Importar Componentes

```javascript
// No seu BudgetModal.jsx
import { CostAnalysisPanel } from '../components/cost-analysis';

function BudgetModal({ budget, empresaId }) {
  return (
    <div>
      {/* Seu formulário existente */}
      <BudgetForm budget={budget} />
      
      {/* Adicionar análise de custos */}
      <CostAnalysisPanel
        budgetData={budget}
        empresaId={empresaId}
      />
    </div>
  );
}
```

### 2. Adicionar Card no Dashboard

```javascript
// No seu Dashboard.jsx
import { MarginAnalysisCard } from '../components/cost-analysis';

function Dashboard({ empresaId }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <RevenueCard />
      <OrdersCard />
      <MarginAnalysisCard empresaId={empresaId} period={30} />
    </div>
  );
}
```

### 3. Adicionar Badge nos Cards

```javascript
// No seu BudgetCard.jsx
import { MarginBadge } from '../components/cost-analysis';
import { useCostAnalysis } from '../hooks/useCostAnalysis';

function BudgetCard({ budget, empresaId }) {
  const { totalMargin } = useCostAnalysis(budget, empresaId);
  
  return (
    <div className="budget-card">
      <h3>{budget.title}</h3>
      <MarginBadge margin={totalMargin} size="sm" />
      <p>Total: R$ {budget.total}</p>
    </div>
  );
}
```

---

## 🧪 Testes Rápidos

### Teste 1: Análise Básica

```javascript
import costAnalysisService from './services/costAnalysisService';

// Criar orçamento de teste
const testBudget = {
  id: 'test123',
  items: [
    {
      id: '1',
      description: 'Troca de óleo',
      type: 'servico',
      cost: 50,
      costPrice: 50,
      price: 80,
      quantity: 1
    },
    {
      id: '2',
      description: 'Filtro de óleo',
      type: 'peca',
      cost: 30,
      costPrice: 30,
      price: 50,
      quantity: 1
    }
  ]
};

// Analisar
const analysis = await costAnalysisService.analyzeBudget(
  testBudget, 
  'empresa-test'
);

// Verificar resultados
console.log('✓ Custo Total:', analysis.totals.cost); // 80
console.log('✓ Preço Total:', analysis.totals.price); // 130
console.log('✓ Margem:', analysis.totals.margin); // ~38.46%
console.log('✓ Lucro:', analysis.totals.profitAmount); // 50
```

### Teste 2: Calculadora de Margem

```javascript
import marginCalculatorService from './services/marginCalculatorService';

// Teste 1: Calcular preço com margem de 35%
const cost = 100;
const targetMargin = 35;
const price = marginCalculatorService.suggestPrice(cost, targetMargin);
console.log('✓ Preço sugerido:', price); // 153.85

// Teste 2: Calcular margem de um preço
const margin = marginCalculatorService.calculateMargin(100, 150);
console.log('✓ Margem:', margin); // 33.33%

// Teste 3: Calcular markup
const markup = marginCalculatorService.calculateMarkup(100, 150);
console.log('✓ Markup:', markup); // 1.5x
```

### Teste 3: Hook useCostAnalysis

```javascript
import { useCostAnalysis } from './hooks/useCostAnalysis';

function TestComponent() {
  const {
    analysis,
    loading,
    totalMargin,
    totalProfit,
    isHealthy,
    formatCurrency
  } = useCostAnalysis(testBudget, 'empresa-test');

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <p>✓ Margem: {totalMargin}%</p>
      <p>✓ Lucro: {formatCurrency(totalProfit)}</p>
      <p>✓ Status: {isHealthy ? 'Saudável' : 'Atenção'}</p>
    </div>
  );
}
```

---

## 📊 Cenários de Teste

### Cenário 1: Margem Excelente (≥35%)

```javascript
const excellentBudget = {
  items: [{
    cost: 100,
    price: 160,  // Margem: 37.5%
    quantity: 1
  }]
};
// Resultado esperado: Badge verde, status "Excelente"
```

### Cenário 2: Margem Boa (20-35%)

```javascript
const goodBudget = {
  items: [{
    cost: 100,
    price: 130,  // Margem: 23.08%
    quantity: 1
  }]
};
// Resultado esperado: Badge azul, status "Boa"
```

### Cenário 3: Margem Baixa (<20%)

```javascript
const lowBudget = {
  items: [{
    cost: 100,
    price: 115,  // Margem: 13.04%
    quantity: 1
  }]
};
// Resultado esperado: Badge amarelo, alerta de margem baixa
```

### Cenário 4: Margem Crítica (<10%)

```javascript
const criticalBudget = {
  items: [{
    cost: 100,
    price: 105,  // Margem: 4.76%
    quantity: 1
  }]
};
// Resultado esperado: Badge vermelho, alerta crítico
```

---

## 🔧 Configuração Personalizada

### Alterar Margens Padrão

```javascript
import costAnalysisService from './services/costAnalysisService';

// Atualizar configuração da empresa
await costAnalysisService.updateMarginConfig('empresa123', {
  minMargin: 25,        // Margem mínima 25%
  targetMargin: 40,     // Margem alvo 40%
  defaultMarkup: 1.6,   // Markup padrão 60%
  categoryMarkups: {
    pecas: 1.5,        // 50% markup peças
    servicos: 1.7,     // 70% markup serviços
    maoDeObra: 2.0     // 100% markup mão de obra
  },
  indirectCosts: {
    monthly: 8000,     // R$ 8000/mês custos fixos
    perHour: 35        // R$ 35/hora overhead
  }
});
```

---

## 🎨 Personalização Visual

### Cores Customizadas

```javascript
// Criar variante customizada do MarginBadge
import { MarginBadge } from '../components/cost-analysis';

function CustomMarginBadge({ margin }) {
  return (
    <MarginBadge
      margin={margin}
      size="lg"
      showIcon={true}
      showLabel={false}
      className="custom-badge"
    />
  );
}
```

### Tema Escuro

```javascript
// Todos os componentes suportam dark mode automaticamente
<div className="dark">
  <CostAnalysisPanel budgetData={budget} empresaId={empresaId} />
</div>
```

---

## 📱 Responsividade

Todos os componentes são responsivos por padrão:

```javascript
// Mobile: Stack vertical
// Tablet: Grid 2 colunas
// Desktop: Grid 4 colunas

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <CostCard />
  <PriceCard />
  <MarginCard />
  <ProfitCard />
</div>
```

---

## 🐛 Troubleshooting

### Problema: Análise não aparece

**Solução**: Verificar se os itens têm `costPrice` ou `cost`:

```javascript
const item = {
  id: '1',
  description: 'Produto',
  cost: 50,           // ✓ Necessário
  costPrice: 50,      // ✓ Ou este
  price: 80,
  quantity: 1
};
```

### Problema: Margem sempre 0%

**Solução**: Verificar se `price` está definido:

```javascript
const item = {
  cost: 50,
  price: 80,  // ✓ Necessário
  quantity: 1
};
```

### Problema: Configuração não carrega

**Solução**: Verificar permissões Firestore:

```javascript
// firestore.rules
match /marginConfig/{empresaId} {
  allow read, write: if request.auth != null 
    && request.auth.token.empresaId == empresaId;
}
```

---

## ✅ Checklist de Implementação

- [ ] Importar componentes necessários
- [ ] Adicionar CostAnalysisPanel no BudgetModal
- [ ] Adicionar MarginAnalysisCard no Dashboard
- [ ] Adicionar MarginBadge nos BudgetCards
- [ ] Testar análise básica
- [ ] Testar calculadora de margem
- [ ] Configurar margens personalizadas
- [ ] Verificar dark mode
- [ ] Testar responsividade
- [ ] Validar permissões Firestore

---

## 📚 Próximos Passos

1. **Integrar no Estoque**: Adicionar análise de margem nos produtos
2. **Criar Relatórios**: Página de relatórios detalhados
3. **Adicionar Gráficos**: Visualização de tendências
4. **Configurar Alertas**: Notificações de margem baixa

---

**Tempo estimado de implementação**: 30 minutos  
**Dificuldade**: ⭐⭐ (Fácil)  
**Suporte**: Documentação completa em `ANALISE_CUSTOS_MARGENS_COMPLETO.md`

**PRONTO PARA USAR! 🚀💰**
