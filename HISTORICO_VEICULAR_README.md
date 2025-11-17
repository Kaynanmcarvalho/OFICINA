# 🚗 Histórico Veicular - Documentação Completa

## 📋 Visão Geral

Sistema de consulta e exibição de histórico veicular através de scraping de fontes públicas (recalls, leilões, sinistros).

**Status**: 🟡 Em Desenvolvimento (Frontend 100% completo)  
**Versão**: 1.0.0  
**Data**: 17 de Janeiro de 2025  

---

## 🎯 Funcionalidades

### ✅ Implementadas

1. **Badge Visual no Card do Cliente**
   - Indicador de risco (verde/amarelo/vermelho)
   - Contador de recalls pendentes
   - Click para abrir modal

2. **Modal de Detalhes Completo**
   - 4 tabs: Recalls, Leilões, Sinistros, Timeline
   - Exibição detalhada de cada evento
   - Links para fontes oficiais
   - Botão de refresh
   - Exportação PDF (placeholder)

3. **Timeline Visual**
   - Agregação de todos os eventos
   - Ordenação cronológica
   - Ícones e cores por tipo
   - Layout vertical elegante

4. **Sistema de Cache**
   - Cache no Firestore
   - TTL configurável por tipo
   - Verificação automática de expiração
   - Refresh manual

5. **Cálculo de Risco**
   - Algoritmo baseado em múltiplos fatores
   - 3 níveis: baixo, médio, alto
   - Atualização automática

### ⏳ Pendentes

1. **Backend (Cloud Functions)**
   - Scraper de recalls (Gov.br)
   - Scraper de leilões (Detran)
   - Scraper de sinistros (Sinesp)
   - Rate limiting
   - Logs e monitoramento

2. **Testes**
   - Testes E2E
   - Testes de integração
   - Validação com dados reais

---

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   └── vehicleHistoryService.js      # Serviço principal
├── hooks/
│   └── useVehicleHistory.js          # Hook customizado
├── components/
│   └── vehicle-history/
│       ├── VehicleHistoryBadge.jsx   # Badge visual
│       ├── VehicleHistoryModal.jsx   # Modal de detalhes
│       └── VehicleHistoryTimeline.jsx # Timeline de eventos
└── pages/
    └── clients/
        └── ClientCard.jsx            # Integração no card

tests/
└── unit/
    └── vehicleHistoryService.test.js # Testes unitários

docs/
├── HISTORICO_VEICULAR_README.md      # Este arquivo
└── HISTORICO_VEICULAR_IMPLEMENTACAO_INICIADA.md
```

---

## 🚀 Como Usar

### 1. Badge no Card do Cliente

O badge é exibido automaticamente no card do cliente se houver um veículo com placa:

```jsx
import { VehicleHistoryBadge } from '../components/vehicle-history/VehicleHistoryBadge';

<VehicleHistoryBadge 
  placa="ABC1234"
  onClick={() => setShowModal(true)}
/>
```

**Cores do Badge**:
- 🟢 Verde: Sem pendências (risco baixo)
- 🟡 Amarelo: Recalls pendentes (risco médio)
- 🔴 Vermelho: Sinistros/Restrições (risco alto)

### 2. Modal de Histórico

```jsx
import { VehicleHistoryModal } from '../components/vehicle-history/VehicleHistoryModal';

<VehicleHistoryModal
  placa="ABC1234"
  isOpen={showModal}
  onClose={() => setShowModal(false)}
/>
```

### 3. Hook Customizado

```jsx
import { useVehicleHistory } from '../hooks/useVehicleHistory';

function MyComponent({ placa }) {
  const {
    history,           // Dados do histórico
    loading,           // Estado de carregamento
    error,             // Erro (se houver)
    cached,            // Se veio do cache
    refreshHistory,    // Função para atualizar
    hasRecalls,        // Tem recalls?
    hasPendingRecalls, // Tem recalls pendentes?
    hasLeiloes,        // Tem leilões?
    hasSinistros,      // Tem sinistros?
    hasRestricoes,     // Tem restrições?
    riskLevel,         // Nível de risco
    shouldShowAlert    // Deve mostrar alerta?
  } = useVehicleHistory(placa);

  return (
    <div>
      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      {history && (
        <div>
          <p>Risco: {riskLevel}</p>
          <p>Recalls: {hasRecalls ? 'Sim' : 'Não'}</p>
          <button onClick={refreshHistory}>Atualizar</button>
        </div>
      )}
    </div>
  );
}
```

### 4. Serviço Diretamente

```jsx
import vehicleHistoryService from '../services/vehicleHistoryService';

// Buscar histórico
const result = await vehicleHistoryService.getVehicleHistory(
  'ABC1234',
  'empresa123',
  false // forceRefresh
);

if (result.success) {
  console.log('Histórico:', result.data);
  console.log('Do cache?', result.cached);
}

// Calcular risco
const risk = vehicleHistoryService.calculateRisk(history);
console.log('Risco:', risk); // 'baixo', 'medio' ou 'alto'
```

---

## 📊 Modelo de Dados

### VehicleHistory

```typescript
interface VehicleHistory {
  id: string;
  placa: string;
  chassi?: string;
  empresaId: string;
  
  recalls: Recall[];
  leiloes: Leilao[];
  sinistros: Sinistro[];
  restricoes: Restricao[];
  
  summary: {
    totalRecalls: number;
    recallsPendentes: number;
    temLeilao: boolean;
    temSinistro: boolean;
    temRestricao: boolean;
    risco: 'baixo' | 'medio' | 'alto';
  };
  
  lastUpdate: Timestamp;
  cacheExpiry: Timestamp;
  consultadoPor: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Recall

```typescript
interface Recall {
  id: string;
  fabricante: string;
  modelo: string;
  ano: number;
  campanha: string;
  descricao: string;
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'pendente' | 'realizado' | 'nao_aplicavel';
  dataInicio: string;
  dataFim?: string;
  fonte: string;
  url: string;
  realizado: boolean;
  dataRealizacao?: Timestamp;
}
```

### Leilao

```typescript
interface Leilao {
  id: string;
  leiloeiro: string;
  data: string;
  motivo: string;
  valor?: number;
  status: 'vendido' | 'nao_vendido' | 'cancelado';
  lote?: string;
  fonte: string;
  url: string;
}
```

### Sinistro

```typescript
interface Sinistro {
  id: string;
  tipo: 'roubo' | 'furto' | 'colisao' | 'incendio';
  gravidade: 'baixa' | 'media' | 'alta';
  data: string;
  status: 'ativo' | 'recuperado' | 'baixado';
  seguradora?: string;
  indenizado: boolean;
  fonte: string;
  boletim?: string;
}
```

---

## 🎨 Customização

### Cores do Badge

Edite em `VehicleHistoryBadge.jsx`:

```jsx
const getBadgeStyle = () => {
  switch (riskLevel) {
    case 'alto':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        // ...
      };
    // ...
  }
};
```

### TTL do Cache

Edite em `vehicleHistoryService.js`:

```javascript
this.cacheTTL = {
  recalls: 7 * 24 * 60 * 60 * 1000,    // 7 dias
  leiloes: 30 * 24 * 60 * 60 * 1000,   // 30 dias
  sinistros: 24 * 60 * 60 * 1000       // 24 horas
};
```

### Algoritmo de Risco

Edite em `vehicleHistoryService.js`:

```javascript
calculateRisk(history) {
  let riskScore = 0;
  
  // Ajuste os pesos conforme necessário
  riskScore += pendentes.length * 2;  // Recalls
  riskScore += leiloes.length * 3;    // Leilões
  riskScore += graves.length * 5;     // Sinistros graves
  
  // Ajuste os limites
  if (riskScore === 0) return 'baixo';
  if (riskScore <= 5) return 'medio';
  return 'alto';
}
```

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Apenas testes do histórico veicular
npm test vehicleHistoryService

# Com coverage
npm test -- --coverage
```

### Testes Implementados

- ✅ `generateHistoryId` - Geração de IDs únicos
- ✅ `calculateRisk` - Cálculo de risco
- ✅ `isCacheExpired` - Verificação de expiração
- ✅ `calculateCacheExpiry` - Cálculo de TTL

### Testes Pendentes

- ⏳ Testes de componentes React
- ⏳ Testes E2E com Cypress
- ⏳ Testes de integração com Firestore

---

## 🐛 Troubleshooting

### Badge não aparece

**Problema**: Badge não é exibido no card do cliente

**Soluções**:
1. Verificar se o cliente tem veículo com placa
2. Verificar se a placa está no formato correto
3. Verificar console para erros

```javascript
// Debug
console.log('Placa:', client.vehicles?.[0]?.plate);
console.log('Veículos:', client.vehicles);
```

### Modal não abre

**Problema**: Click no badge não abre o modal

**Soluções**:
1. Verificar se `onClick` está sendo passado
2. Verificar se `stopPropagation` está funcionando
3. Verificar estado `showHistoryModal`

```javascript
// Debug
onClick={(e) => {
  console.log('Badge clicked');
  e.stopPropagation();
  setShowHistoryModal(true);
}}
```

### Dados não carregam

**Problema**: Histórico não é carregado

**Soluções**:
1. Verificar se `empresaId` está disponível
2. Verificar permissões do Firestore
3. Verificar console para erros de rede

```javascript
// Debug no hook
useEffect(() => {
  console.log('Placa:', placa);
  console.log('EmpresaId:', empresaId);
  fetchHistory();
}, [fetchHistory]);
```

### Cache não funciona

**Problema**: Sempre busca dados frescos

**Soluções**:
1. Verificar se `forceRefresh` não está sempre `true`
2. Verificar se `cacheExpiry` está sendo salvo
3. Verificar cálculo de TTL

```javascript
// Debug
const cached = await this.getCachedHistory(historyId);
console.log('Cache encontrado:', cached);
console.log('Cache expirado?', this.isCacheExpired(cached));
```

---

## 📈 Roadmap

### Fase 1: Frontend Base ✅ (Completo)
- ✅ Serviço base
- ✅ Hook customizado
- ✅ Componentes visuais
- ✅ Integração no ClientCard

### Fase 2: Backend (Em Andamento)
- ⏳ Cloud Functions
- ⏳ Scrapers (recalls, leilões, sinistros)
- ⏳ Rate limiting
- ⏳ Logs e monitoramento

### Fase 3: Testes
- ⏳ Testes E2E
- ⏳ Testes de integração
- ⏳ Validação com dados reais

### Fase 4: Melhorias Futuras
- 📋 Notificações push para recalls novos
- 📋 Histórico de consultas
- 📋 Filtros avançados
- 📋 Exportação real de PDF
- 📋 Integração com agendamento

---

## 🤝 Contribuindo

### Adicionar Nova Fonte de Dados

1. Criar scraper em `functions/vehicle-history/scrapers/`
2. Adicionar tipo no modelo de dados
3. Atualizar `fetchFreshHistory` no serviço
4. Adicionar tab no modal
5. Atualizar timeline
6. Adicionar testes

### Melhorar Algoritmo de Risco

1. Editar `calculateRisk` em `vehicleHistoryService.js`
2. Ajustar pesos e limites
3. Adicionar novos fatores
4. Atualizar testes
5. Documentar mudanças

---

## 📞 Suporte

### Dúvidas
- Slack: #torq-ai-dev
- Email: dev@torqai.com.br

### Bugs
- GitHub Issues: torq-ai/issues
- Label: `vehicle-history`

---

## 📝 Changelog

### v1.0.0 (17/01/2025)
- ✅ Implementação inicial do frontend
- ✅ Badge visual no ClientCard
- ✅ Modal com 4 tabs
- ✅ Timeline de eventos
- ✅ Sistema de cache
- ✅ Hook customizado
- ✅ Testes unitários básicos

---

**Última atualização**: 17 de Janeiro de 2025  
**Versão**: 1.0.0  
**Status**: 🟡 Em Desenvolvimento  
**Próximo**: Implementação do backend
