# 🎨 Histórico Veicular - Design Detalhado

## 📋 Visão Geral

**Funcionalidade**: Sistema de consulta e exibição de histórico veicular  
**Versão**: 1.0  
**Data**: 17 de Janeiro de 2025  
**Status**: 📋 Em Design  

---

## 🏗️ Arquitetura do Sistema

### Visão Geral
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│Cloud Function│─────▶│  Scrapers   │
│   (React)   │      │  (Orquestrador)     │  (Python)   │
└─────────────┘      └──────────────┘      └─────────────┘
       │                     │                      │
       │                     ▼                      ▼
       │              ┌──────────────┐      ┌─────────────┐
       └─────────────▶│  Firestore   │      │ Fontes      │
                      │   (Cache)    │      │ Públicas    │
                      └──────────────┘      └─────────────┘
```

### Componentes Principais

#### 1. Frontend (React)
- `VehicleHistoryBadge.jsx` - Badge visual no card
- `VehicleHistoryModal.jsx` - Modal com detalhes completos
- `VehicleHistoryTimeline.jsx` - Timeline de eventos
- `useVehicleHistory.js` - Hook customizado

#### 2. Backend (Cloud Functions)
- `getVehicleHistory` - Orquestrador principal
- `scrapeRecalls` - Scraper de recalls
- `scrapeLeiloes` - Scraper de leilões
- `scrapeSinistros` - Scraper de sinistros

#### 3. Cache (Firestore)
- Collection: `vehicle_history`
- Collection: `vehicle_history_logs`

---

## 🗄️ Estrutura de Dados Detalhada

### Collection: vehicle_history

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

interface Restricao {
  tipo: 'judicial' | 'administrativa' | 'financeira';
  descricao: string;
  status: 'ativa' | 'baixada';
  dataInicio: string;
  fonte: string;
}
```

---

## 🎨 Design de Componentes

### 1. VehicleHistoryBadge

**Localização**: Canto superior direito do ClientCard

**Estados Visuais**:
```jsx
// Verde - Sem pendências
<Badge className="bg-green-500">
  <CheckCircle className="w-4 h-4" />
  <span>Limpo</span>
</Badge>

// Amarelo - Recalls pendentes
<Badge className="bg-yellow-500">
  <AlertTriangle className="w-4 h-4" />
  <span>1 Recall</span>
</Badge>

// Vermelho - Sinistros/Restrições
<Badge className="bg-red-500">
  <XCircle className="w-4 h-4" />
  <span>Alerta</span>
</Badge>
```

**Interações**:
- Hover: Tooltip com resumo
- Click: Abre modal completo
- Loading: Skeleton com pulse

### 2. VehicleHistoryModal

**Layout**:
```
┌────────────────────────────────────────────────┐
│  Histórico do Veículo - ABC1234          [X]   │
├────────────────────────────────────────────────┤
│  [Recalls] [Leilões] [Sinistros] [Restrições] │
├────────────────────────────────────────────────┤
│                                                 │
│  📋 Recalls Ativos (1)                         │
│  ┌──────────────────────────────────────────┐ │
│  │ ⚠️ Airbag - Campanha 2020/001            │ │
│  │ Gravidade: Alta | Status: Pendente       │ │
│  │ Descrição: Problema no sistema...        │ │
│  │ [Ver Fonte] [Agendar Correção]           │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  🔄 Última atualização: há 2 dias              │
│  [Atualizar Agora] [Exportar PDF]              │
└────────────────────────────────────────────────┘
```

**Tabs**:
1. **Recalls**: Lista de recalls com status
2. **Leilões**: Histórico de leilões
3. **Sinistros**: Sinistros e recuperações
4. **Restrições**: Restrições ativas

### 3. VehicleHistoryTimeline

**Visualização Cronológica**:
```jsx
<Timeline>
  <TimelineItem date="2020-01-15" type="recall">
    <AlertTriangle className="text-yellow-500" />
    <div>
      <h4>Recall Iniciado</h4>
      <p>Campanha 2020/001 - Airbag</p>
    </div>
  </TimelineItem>
  
  <TimelineItem date="2019-05-20" type="leilao">
    <Gavel className="text-blue-500" />
    <div>
      <h4>Leilão Detran SP</h4>
      <p>Vendido por R$ 15.000</p>
    </div>
  </TimelineItem>
</Timeline>
```

---

## 🔌 APIs e Integrações

### Cloud Function: getVehicleHistory

**Endpoint**: `https://us-central1-{project}.cloudfunctions.net/getVehicleHistory`

**Request**:
```typescript
{
  placa: string;
  chassi?: string;
  empresaId: string;
  forceRefresh?: boolean;
}
```

**Response**:
```typescript
{
  success: boolean;
  data: VehicleHistory;
  cached: boolean;
  sources: {
    recalls: { success: boolean; error?: string };
    leiloes: { success: boolean; error?: string };
    sinistros: { success: boolean; error?: string };
  };
}
```

**Fluxo**:
1. Verificar cache (se não forceRefresh)
2. Se cache válido, retornar
3. Se não, executar scrapers em paralelo
4. Agregar resultados
5. Salvar no cache
6. Retornar dados

### Scrapers

#### 1. Recall Scraper
**Fonte**: https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/recall

**Estratégia**:
- Puppeteer para navegação
- Busca por placa/chassi
- Parse HTML com Cheerio
- Extração de dados estruturados

#### 2. Leilão Scraper
**Fontes**: Detran estaduais

**Estratégia**:
- Identificar estado pela placa
- Consultar portal específico
- Parse de tabelas HTML
- Fallback se indisponível

#### 3. Sinistro Scraper
**Fonte**: Sinesp Cidadão (se permitido)

**Estratégia**:
- API oficial (se disponível)
- Fallback para scraping
- Validação de dados
- Logs de auditoria

---

## 🎨 Especificações de UI/UX

### Cores e Ícones

**Gravidade de Recalls**:
- Baixa: 🟢 Verde (#10b981)
- Média: 🟡 Amarelo (#f59e0b)
- Alta: 🟠 Laranja (#f97316)
- Crítica: 🔴 Vermelho (#ef4444)

**Status**:
- Pendente: 🟡 Amarelo
- Realizado: 🟢 Verde
- Não Aplicável: ⚪ Cinza

**Tipos de Evento**:
- Recall: ⚠️ AlertTriangle
- Leilão: 🔨 Gavel
- Sinistro: 🚨 AlertOctagon
- Restrição: 🔒 Lock

### Animações

**Badge**:
- Fade in ao carregar
- Pulse se alerta crítico
- Hover: Scale 1.05

**Modal**:
- Slide up ao abrir
- Fade out ao fechar
- Tabs: Slide horizontal

**Timeline**:
- Fade in sequencial
- Scroll suave

### Responsividade

**Desktop (> 1024px)**:
- Modal: 800px largura
- Timeline: 2 colunas
- Tabs: Horizontal

**Tablet (768px - 1024px)**:
- Modal: 90% largura
- Timeline: 1 coluna
- Tabs: Horizontal

**Mobile (< 768px)**:
- Modal: Full screen
- Timeline: Compacta
- Tabs: Scroll horizontal

---

## 🔒 Segurança e Conformidade

### Rate Limiting
```javascript
const rateLimiter = {
  maxRequests: 10,
  windowMs: 60000, // 1 minuto
  perSource: true
};
```

### User Agent
```javascript
const userAgent = 'TorqAI/1.0 (Consulta Legal; +https://torqai.com.br/bot)';
```

### Robots.txt
- Respeitar sempre
- Fallback se bloqueado
- Logs de tentativas

### LGPD
- Consentimento explícito
- Dados mínimos necessários
- Direito ao esquecimento
- Auditoria completa

---

## 📊 Métricas e Monitoramento

### Métricas Técnicas
- Taxa de sucesso por fonte
- Tempo médio de resposta
- Cache hit rate
- Erros por tipo

### Métricas de Negócio
- Consultas por dia
- Recalls identificados
- Conversão para serviços
- Satisfação do usuário

### Alertas
- Taxa de erro > 10%
- Tempo resposta > 15s
- Fonte indisponível > 1h
- Cache expirado > 50%

---

## 🧪 Estratégia de Testes

### Unit Tests
- Parsers de HTML
- Validadores de dados
- Cálculo de risco
- Formatadores

### Integration Tests
- Scrapers com mocks
- Cache Firestore
- Cloud Functions
- Fluxo completo

### E2E Tests
```javascript
describe('Vehicle History', () => {
  it('should display badge on vehicle card', () => {
    // Test badge rendering
  });
  
  it('should open modal on badge click', () => {
    // Test modal interaction
  });
  
  it('should fetch and display history', () => {
    // Test data fetching
  });
  
  it('should handle errors gracefully', () => {
    // Test error states
  });
});
```

---

## 📝 Checklist de Implementação

### Backend
- [ ] Criar Cloud Functions base
- [ ] Implementar scrapers
- [ ] Sistema de cache
- [ ] Rate limiting
- [ ] Logs e monitoramento
- [ ] Testes unitários
- [ ] Testes de integração

### Frontend
- [ ] VehicleHistoryBadge
- [ ] VehicleHistoryModal
- [ ] VehicleHistoryTimeline
- [ ] useVehicleHistory hook
- [ ] vehicleHistoryService
- [ ] Integração em ClientCard
- [ ] Testes E2E

### Documentação
- [ ] README
- [ ] API Reference
- [ ] Guia de uso
- [ ] Troubleshooting
- [ ] Exemplos

### Deploy
- [ ] Deploy Cloud Functions
- [ ] Deploy Frontend
- [ ] Configurar monitoramento
- [ ] Testes em staging
- [ ] Deploy produção

---

**Documento criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Status**: 📋 Aprovado  
**Próximo**: Implementação
