# 📦 Previsão de Estoque - Requisitos

## 📋 Visão Geral

**Funcionalidade**: Sistema de previsão de fim de estoque e sugestão de reposição  
**Prioridade**: Média  
**Estimativa**: 40 horas  
**Sprint**: Março 2025 (Semanas 3-4)  
**Status**: 📋 Planejado  

---

## 🎯 Objetivos

### Objetivo Principal
Prever quando produtos acabarão no estoque e sugerir quantidades ideais de reposição baseado em análise estatística de consumo histórico, evitando rupturas e otimizando capital de giro.

### Objetivos Específicos
1. Analisar padrões de consumo histórico
2. Detectar tendências e sazonalidade
3. Prever dias até fim de estoque
4. Sugerir quantidade e data de reposição
5. Alertar sobre estoque crítico
6. Gerar relatórios de análise
7. Integrar com sistema de orçamentos

---

## 👥 Personas e Casos de Uso

### Persona 1: Gerente de Estoque
**Necessidade**: Evitar ruptura e otimizar compras  
**Caso de Uso**:
- Visualizar dashboard de previsões
- Identificar produtos críticos
- Receber alertas de estoque baixo
- Gerar pedidos de compra
- Analisar tendências de consumo

### Persona 2: Proprietário da Oficina
**Necessidade**: Otimizar capital de giro  
**Caso de Uso**:
- Monitorar investimento em estoque
- Identificar produtos parados
- Reduzir desperdício
- Melhorar fluxo de caixa

### Persona 3: Mecânico/Atendente
**Necessidade**: Garantir disponibilidade de peças  
**Caso de Uso**:
- Verificar disponibilidade antes de orçar
- Receber alerta de peça em falta
- Sugerir alternativas

---

## 📊 Requisitos Funcionais

### RF01: Análise de Consumo Histórico
**Prioridade**: Alta  
**Descrição**: Analisar movimentações passadas do produto

**Critérios de Aceitação**:
- [ ] Coletar dados dos últimos 90 dias
- [ ] Calcular média diária de consumo
- [ ] Identificar dias sem movimento
- [ ] Calcular desvio padrão
- [ ] Detectar outliers
- [ ] Gerar gráfico de consumo

### RF02: Detecção de Tendência
**Prioridade**: Alta  
**Descrição**: Identificar se consumo está aumentando, estável ou diminuindo

**Critérios de Aceitação**:
- [ ] Aplicar regressão linear simples
- [ ] Classificar: crescente, estável, decrescente
- [ ] Calcular taxa de crescimento
- [ ] Ajustar previsão pela tendência
- [ ] Visualizar linha de tendência

### RF03: Detecção de Sazonalidade
**Prioridade**: Média  
**Descrição**: Identificar padrões sazonais de consumo

**Critérios de Aceitação**:
- [ ] Analisar padrão semanal
- [ ] Analisar padrão mensal
- [ ] Identificar picos e vales
- [ ] Ajustar previsão pela sazonalidade
- [ ] Alertar sobre períodos de alta demanda

### RF04: Previsão de Fim de Estoque
**Prioridade**: Alta  
**Descrição**: Calcular quando produto acabará

**Critérios de Aceitação**:
- [ ] Calcular dias restantes
- [ ] Considerar estoque atual
- [ ] Considerar média de consumo
- [ ] Considerar tendência
- [ ] Calcular intervalo de confiança
- [ ] Exibir data prevista

### RF05: Sugestão de Reposição
**Prioridade**: Alta  
**Descrição**: Sugerir quantidade e data ideal de compra

**Critérios de Aceitação**:
- [ ] Calcular ponto de pedido
- [ ] Sugerir quantidade (lote econômico)
- [ ] Considerar lead time do fornecedor
- [ ] Considerar estoque mínimo
- [ ] Considerar estoque máximo
- [ ] Calcular data ideal de pedido

### RF06: Alertas Automáticos
**Prioridade**: Alta  
**Descrição**: Notificar sobre situações críticas

**Critérios de Aceitação**:
- [ ] Alerta: estoque < 7 dias
- [ ] Alerta: estoque crítico (< 3 dias)
- [ ] Alerta: produto parado (> 30 dias sem movimento)
- [ ] Alerta: consumo anormal (> 2x desvio padrão)
- [ ] Notificação in-app
- [ ] Email opcional

### RF07: Dashboard de Previsões
**Prioridade**: Alta  
**Descrição**: Visualização consolidada de previsões

**Critérios de Aceitação**:
- [ ] Lista de produtos críticos
- [ ] Gráficos de tendência
- [ ] Métricas agregadas
- [ ] Filtros (categoria, fornecedor, criticidade)
- [ ] Ordenação customizável
- [ ] Exportação de dados

### RF08: Análise Individual de Produto
**Prioridade**: Média  
**Descrição**: Detalhamento completo de um produto

**Critérios de Aceitação**:
- [ ] Gráfico de consumo histórico
- [ ] Linha de tendência
- [ ] Previsão futura (30 dias)
- [ ] Estatísticas detalhadas
- [ ] Histórico de reposições
- [ ] Sugestões de otimização

### RF09: Relatórios
**Prioridade**: Média  
**Descrição**: Gerar relatórios de análise

**Critérios de Aceitação**:
- [ ] Relatório de produtos críticos
- [ ] Relatório de giro de estoque
- [ ] Relatório de acurácia de previsões
- [ ] Relatório de produtos parados
- [ ] Exportar Excel/PDF
- [ ] Agendar envio automático

### RF10: Integração com Orçamentos
**Prioridade**: Média  
**Descrição**: Considerar orçamentos pendentes na previsão

**Critérios de Aceitação**:
- [ ] Incluir itens de orçamentos aprovados
- [ ] Alertar se orçamento usa produto em falta
- [ ] Sugerir alternativas
- [ ] Reservar estoque para orçamentos

---

## 🔒 Requisitos Não-Funcionais

### RNF01: Performance
- Cálculo de previsão: < 2s por produto
- Atualização dashboard: < 5s
- Processamento em lote (noturno)
- Cache de previsões (24h)

### RNF02: Precisão
- Acurácia > 80% (±20% do real)
- Intervalo de confiança 95%
- Ajuste contínuo do modelo
- Feedback loop de aprendizado

### RNF03: Escalabilidade
- Suportar 10.000+ produtos
- Processamento paralelo
- Otimização de queries
- Índices adequados

### RNF04: Confiabilidade
- Cálculos determinísticos
- Logs de previsões
- Versionamento de algoritmos
- Fallback para média simples

### RNF05: Usabilidade
- Interface intuitiva
- Visualizações claras
- Feedback visual
- Suporte dark/light mode

---

## 🗄️ Modelo de Dados

### Collection: `stock_predictions`

```typescript
interface StockPrediction {
  id: string;
  empresaId: string;
  productId: string;
  
  // Dados atuais
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  
  // Análise de consumo
  analysis: {
    avgDailyUsage: number;
    medianDailyUsage: number;
    stdDeviation: number;
    maxDailyUsage: number;
    minDailyUsage: number;
    daysWithMovement: number;
    daysWithoutMovement: number;
  };
  
  // Tendência
  trend: {
    direction: 'increasing' | 'stable' | 'decreasing';
    slope: number; // Taxa de crescimento diário
    confidence: number; // 0-1
    rSquared: number; // Qualidade do ajuste
  };
  
  // Sazonalidade
  seasonality: {
    detected: boolean;
    pattern: 'weekly' | 'monthly' | 'none';
    peakDays: number[]; // Dias da semana com pico
    lowDays: number[]; // Dias da semana com baixa
  };
  
  // Previsão
  prediction: {
    daysUntilEmpty: number;
    emptyDate: Timestamp;
    confidence: number;
    confidenceInterval: {
      min: number; // Dias mínimo
      max: number; // Dias máximo
    };
  };
  
  // Sugestão de reposição
  reorder: {
    shouldReorder: boolean;
    suggestedQuantity: number;
    reorderDate: Timestamp;
    leadTime: number; // Dias
    economicOrderQuantity: number;
    reorderPoint: number;
  };
  
  // Alertas
  alerts: Alert[];
  
  // Metadados
  lastUpdate: Timestamp;
  nextUpdate: Timestamp;
  calculationTime: number; // ms
  algorithmVersion: string;
  createdAt: Timestamp;
}

interface Alert {
  type: 'low_stock' | 'critical_stock' | 'no_movement' | 'abnormal_usage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: Timestamp;
  acknowledged: boolean;
}
```

### Collection: `stock_movements` (já existe)

```typescript
interface StockMovement {
  id: string;
  empresaId: string;
  productId: string;
  type: 'entrada' | 'saida';
  quantity: number;
  date: Timestamp;
  budgetId?: string;
  userId: string;
  notes?: string;
}
```

---

## 🧮 Algoritmos

### 1. Média Móvel Simples (SMA)
```javascript
function calculateSMA(data, period) {
  const sum = data.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}
```

### 2. Média Móvel Exponencial (EMA)
```javascript
function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  let ema = data[0];
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  return ema;
}
```

### 3. Regressão Linear
```javascript
function linearRegression(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}
```

### 4. Lote Econômico de Compra (EOQ)
```javascript
function calculateEOQ(annualDemand, orderCost, holdingCost) {
  return Math.sqrt((2 * annualDemand * orderCost) / holdingCost);
}
```

### 5. Ponto de Pedido
```javascript
function calculateReorderPoint(avgDailyUsage, leadTime, safetyStock) {
  return (avgDailyUsage * leadTime) + safetyStock;
}
```

---

## 🎨 Especificações de UI/UX

### Dashboard de Previsões

```
┌─────────────────────────────────────────────────────┐
│  Previsão de Estoque                                │
│  [Filtros ▼] [Atualizar] [Exportar]               │
├─────────────────────────────────────────────────────┤
│  📊 Resumo                                          │
│  ┌──────────┬──────────┬──────────┬──────────┐    │
│  │ Críticos │ Baixos   │ OK       │ Parados  │    │
│  │    5     │    12    │   143    │    8     │    │
│  └──────────┴──────────┴──────────┴──────────┘    │
│                                                      │
│  🚨 Produtos Críticos (< 3 dias)                   │
│  ┌────────────────────────────────────────────┐   │
│  │ 🔴 Óleo 5W30 - 2 dias restantes            │   │
│  │    Sugestão: Pedir 20L até amanhã          │   │
│  │    [Ver Detalhes] [Criar Pedido]           │   │
│  └────────────────────────────────────────────┘   │
│                                                      │
│  ⚠️ Produtos Baixos (3-7 dias)                     │
│  ┌────────────────────────────────────────────┐   │
│  │ 🟡 Filtro de Ar - 5 dias restantes         │   │
│  │ 🟡 Pastilha de Freio - 6 dias restantes    │   │
│  └────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Análise Individual

```
┌─────────────────────────────────────────────────────┐
│  Óleo 5W30 - Análise Detalhada            [X]      │
├─────────────────────────────────────────────────────┤
│  📊 Consumo Histórico (90 dias)                    │
│  ┌────────────────────────────────────────────┐   │
│  │     ╱╲    ╱╲                               │   │
│  │    ╱  ╲  ╱  ╲    ╱╲                        │   │
│  │   ╱    ╲╱    ╲  ╱  ╲                       │   │
│  │  ╱            ╲╱    ╲                      │   │
│  └────────────────────────────────────────────┘   │
│                                                      │
│  📈 Estatísticas                                    │
│  Média diária: 2.5L                                │
│  Tendência: ↗️ Crescente (+5%/semana)              │
│  Sazonalidade: Pico às segundas                    │
│                                                      │
│  🎯 Previsão                                        │
│  Dias restantes: 2 (±1 dia)                        │
│  Data prevista: 19/01/2025                         │
│  Confiança: 85%                                     │
│                                                      │
│  📦 Sugestão de Reposição                          │
│  Quantidade: 20L                                    │
│  Data do pedido: Hoje                              │
│  Lead time: 2 dias                                  │
│                                                      │
│  [Criar Pedido] [Ajustar Parâmetros]               │
└─────────────────────────────────────────────────────┘
```

### Card de Produto

```
┌────────────────────────────────┐
│ 🔴 Óleo 5W30                   │
│ Estoque: 5L                    │
│ Previsão: 2 dias               │
│ ────────────────────────────── │
│ Média: 2.5L/dia                │
│ Tendência: ↗️ +5%              │
│ ────────────────────────────── │
│ [Ver Detalhes] [Pedir]         │
└────────────────────────────────┘
```

---

## ✅ Critérios de Aceitação Geral

### Funcionalidade
- [ ] Previsões calculadas para 100% dos produtos
- [ ] Alertas funcionando corretamente
- [ ] Sugestões de reposição precisas
- [ ] Dashboard responsivo

### Precisão
- [ ] Acurácia > 80%
- [ ] Intervalo de confiança calculado
- [ ] Ajuste contínuo do modelo

### Performance
- [ ] Cálculos < 2s por produto
- [ ] Dashboard carrega < 5s
- [ ] Processamento em lote eficiente

### UX
- [ ] Interface intuitiva
- [ ] Visualizações claras
- [ ] Feedback visual
- [ ] Dark mode suportado

---

## 🚫 Fora do Escopo (v1)

- Machine Learning avançado (LSTM, Prophet)
- Previsão de demanda externa
- Integração com fornecedores
- Pedidos automáticos
- Análise de múltiplos depósitos
- Otimização de mix de produtos

---

## 📅 Cronograma

### Semana 1: Backend (20h)
- Algoritmos de análise
- Cálculo de previsões
- Sistema de alertas

### Semana 2: Frontend (20h)
- Dashboard
- Análise individual
- Relatórios
- Testes e deploy

---

**Documento criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Status**: 📋 Aprovado  
**Próximo**: Design detalhado
