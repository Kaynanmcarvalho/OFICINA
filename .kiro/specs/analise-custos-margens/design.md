# Design - Análise de Custos & Margens

## Overview

Sistema de análise financeira integrado que adiciona capacidades de análise de custos, margens e lucratividade em todas as abas relevantes do sistema Torq.

## Architecture

### Component Integration Map

```
Dashboard
├── MarginAnalysisCard (novo)
├── ProfitabilityChart (novo)
└── CostBreakdownWidget (novo)

Budgets (Orçamentos)
├── BudgetModal
│   ├── CostAnalysisPanel (novo)
│   ├── MarginCalculator (novo)
│   └── ProfitabilityIndicator (novo)
└── BudgetCard
    └── MarginBadge (novo)

Inventory (Estoque)
├── ProductModal
│   ├── CostPriceAnalysis (novo)
│   ├── MarginSuggestion (novo)
│   └── PriceHistory (novo)
└── ProductCard
    └── MarginIndicator (novo)

CheckIn
├── CheckInModal
│   ├── EstimatedCostPanel (novo)
│   └── ServicePriceSuggestion (novo)
└── VehicleSummary
    └── CostEstimate (novo)

Reports (novo)
└── ProfitabilityReport
    ├── PeriodSelector
    ├── CostBreakdown
    ├── MarginTrends
    └── ExportOptions
```

## Components and Interfaces

### 1. Core Services

#### CostAnalysisService
```javascript
class CostAnalysisService {
  calculateItemCost(item)
  calculateItemMargin(item)
  calculateTotalCost(items)
  calculateTotalMargin(items)
  calculateBreakEven(costs, margin)
  validateMargin(margin, minMargin)
}
```

#### MarginCalculatorService
```javascript
class MarginCalculatorService {
  calculateMarkup(cost, price)
  calculateMargin(cost, price)
  suggestPrice(cost, targetMargin)
  applyMarkup(cost, markup)
}
```


### 2. React Components

#### MarginAnalysisCard (Dashboard)
- Exibe margem média, total de lucro, tendência
- Gráfico de evolução de margens
- Link para relatório detalhado

#### CostAnalysisPanel (Budget Modal)
- Breakdown de custos por item
- Cálculo de margem total
- Indicadores visuais (verde/amarelo/vermelho)
- Sugestões de ajuste de preço

#### MarginCalculator (Budget Modal)
- Input de custo
- Seletor de margem desejada
- Cálculo automático de preço
- Comparativo com preço de mercado

#### CostPriceAnalysis (Product Modal)
- Custo de aquisição
- Preço de venda atual
- Margem atual
- Margem sugerida
- Histórico de preços

## Data Models

### CostAnalysis (Firestore)
```javascript
{
  id: string,
  budgetId: string,
  empresaId: string,
  items: [{
    itemId: string,
    description: string,
    cost: number,
    price: number,
    quantity: number,
    margin: number,
    markup: number
  }],
  totalCost: number,
  totalPrice: number,
  totalMargin: number,
  averageMargin: number,
  indirectCosts: number,
  profitAmount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### MarginConfig (Firestore)
```javascript
{
  empresaId: string,
  minMargin: number,
  targetMargin: number,
  defaultMarkup: number,
  categoryMarkups: {
    pecas: number,
    servicos: number,
    maoDeObra: number
  },
  indirectCosts: {
    monthly: number,
    perHour: number
  },
  updatedAt: timestamp
}
```

## Error Handling

- Validação de margens negativas
- Alertas para margens abaixo do mínimo
- Fallback para configurações padrão
- Logs de erros de cálculo

## Testing Strategy

- Unit tests para cálculos de margem
- Integration tests para salvamento
- E2E tests para fluxo completo
- Performance tests para dashboard

---

**Version**: 1.0.0  
**Date**: 2025-01-13  
**Status**: Ready for Tasks  
**Author**: Torq AI Team
