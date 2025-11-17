# 🏗️ Arquitetura - Histórico Veicular

## 📐 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    TORQ AI - Sistema                         │
│                   Histórico Veicular                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │ ───▶ │   Firebase   │ ───▶ │   Backend    │
│   (React)    │ ◀─── │  Functions   │ ◀─── │  (Scrapers)  │
└──────────────┘      └──────────────┘      └──────────────┘
       │                      │                      │
       │                      │                      │
       ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Components  │      │   Firestore  │      │  External    │
│   & Hooks    │      │    Cache     │      │   Sources    │
└──────────────┘      └──────────────┘      └──────────────┘
```

---

## 🎨 Camada Frontend

### Estrutura de Componentes

```
src/
├── services/
│   └── vehicleHistoryService.js
│       ├── getVehicleHistory()
│       ├── calculateRiskLevel()
│       └── generateHistoryId()
│
├── hooks/
│   └── useVehicleHistory.js
│       ├── Estado: history, loading, error
│       ├── Helpers: hasRecalls, hasSinistros
│       └── Actions: refreshHistory
│
└── components/
    └── vehicle-history/
        ├── VehicleHistoryBadge.jsx
        │   ├── Indicador visual de risco
        │   └── Click handler
        │
        ├── VehicleHistoryModal.jsx
        │   ├── Sistema de tabs
        │   ├── Exibição de dados
        │   └── Botões de ação
        │
        └── VehicleHistoryTimeline.jsx
            ├── Agregação de eventos
            ├── Ordenação cronológica
            └── Visualização elegante
```

### Fluxo de Dados Frontend

```
┌─────────────────┐
│  ClientCard     │
│  (Usuário)      │
└────────┬────────┘
         │ Click no Badge
         ▼
┌─────────────────┐
│ VehicleHistory  │
│     Badge       │
└────────┬────────┘
         │ onClick
         ▼
┌─────────────────┐
│ useVehicle      │
│   History       │
└────────┬────────┘
         │ getVehicleHistory()
         ▼
┌─────────────────┐
│ vehicleHistory  │
│    Service      │
└────────┬────────┘
         │ Firebase Functions
         ▼
┌─────────────────┐
│ Cloud Function  │
│ getVehicle      │
│   History       │
└─────────────────┘
```

---

## ☁️ Camada Backend

### Estrutura Cloud Functions

```
functions/vehicle-history/
├── index.js (Cloud Function Principal)
│   ├── Autenticação
│   ├── Validação
│   ├── Rate Limiting
│   ├── Cache Check
│   ├── Execução Paralela
│   └── Resposta
│
├── scrapers/
│   ├── recallScraper.js
│   │   ├── Puppeteer Setup
│   │   ├── Navegação
│   │   ├── Extração
│   │   └── Validação
│   │
│   ├── leilaoScraper.js
│   │   ├── Axios Request
│   │   ├── Cheerio Parse
│   │   ├── Múltiplas Fontes
│   │   └── Deduplicação
│   │
│   └── sinistroScraper.js
│       ├── Análise de Indicadores
│       ├── Classificação
│       └── Preparação para APIs
│
└── utils/
    ├── cache.js
    │   ├── get()
    │   ├── set()
    │   ├── isExpired()
    │   └── cleanExpired()
    │
    ├── rateLimiter.js
    │   ├── checkLimit()
    │   ├── reset()
    │   └── cleanOld()
    │
    └── logger.js
        ├── info()
        ├── warn()
        ├── error()
        └── debug()
```

### Fluxo de Execução Backend

```
┌─────────────────────────────────────────────────────────┐
│              Cloud Function: getVehicleHistory          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  1. Validação                                           │
│     ├── Autenticação Firebase                           │
│     ├── Validação de placa                              │
│     └── Validação de empresaId                          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  2. Rate Limiting                                       │
│     ├── Verificar limite (10 req/min)                   │
│     └── Bloquear se excedido                            │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  3. Cache Check                                         │
│     ├── Buscar no Firestore                             │
│     ├── Verificar expiração (24h)                       │
│     └── Retornar se válido                              │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  4. Execução Paralela (Promise.allSettled)              │
│     ├── scrapeRecalls(placa)                            │
│     ├── scrapeLeiloes(placa)                            │
│     └── scrapeSinistros(placa)                          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  5. Processamento                                       │
│     ├── Agregar resultados                              │
│     ├── Calcular risco                                  │
│     └── Gerar resumo                                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  6. Cache Save                                          │
│     ├── Salvar no Firestore                             │
│     └── Definir TTL (24h)                               │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  7. Resposta                                            │
│     ├── Dados completos                                 │
│     ├── Status de fontes                                │
│     └── Indicador de cache                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Camada de Dados

### Estrutura do Firestore

```
Firestore
├── vehicle_history/
│   └── {empresaId}_{placa}/
│       ├── placa: string
│       ├── empresaId: string
│       ├── recalls: array
│       │   └── {
│       │       id, fabricante, modelo, ano,
│       │       campanha, descricao, gravidade,
│       │       status, dataInicio, fonte, url
│       │     }
│       ├── leiloes: array
│       │   └── {
│       │       id, placa, leiloeiro, lote,
│       │       dataLeilao, valorInicial, status,
│       │       motivo, local, fonte, url
│       │     }
│       ├── sinistros: array
│       │   └── {
│       │       id, placa, tipo, gravidade,
│       │       data, seguradora, valorIndenizado,
│       │       status, descricao, fonte
│       │     }
│       ├── restricoes: array
│       ├── summary: object
│       │   ├── totalRecalls
│       │   ├── recallsPendentes
│       │   ├── temLeilao
│       │   ├── temSinistro
│       │   ├── temRestricao
│       │   └── risco
│       ├── sources: object
│       │   ├── recalls: { success, error }
│       │   ├── leiloes: { success, error }
│       │   └── sinistros: { success, error }
│       ├── lastUpdate: timestamp
│       └── cacheExpiry: timestamp
│
└── rate_limits/
    └── {userId}_{empresaId}/
        ├── requests: array[timestamps]
        └── lastRequest: timestamp
```

### Índices do Firestore

```
Índice 1: vehicle_history
├── cacheExpiry (Ascending)
└── empresaId (Ascending)

Índice 2: rate_limits
└── lastRequest (Ascending)
```

---

## 🔄 Fluxo Completo End-to-End

```
┌──────────────────────────────────────────────────────────┐
│                    FLUXO COMPLETO                         │
└──────────────────────────────────────────────────────────┘

1. Usuário clica no badge
   │
   ▼
2. useVehicleHistory hook ativa
   │
   ▼
3. vehicleHistoryService.getVehicleHistory()
   │
   ▼
4. Firebase Functions chamada
   │
   ▼
5. Cloud Function: getVehicleHistory
   ├── Autenticação ✓
   ├── Validação ✓
   ├── Rate Limiting ✓
   └── Cache Check
       │
       ├─▶ Cache HIT (< 1s)
       │   └─▶ Retorna dados
       │
       └─▶ Cache MISS
           │
           ▼
       6. Execução Paralela
          ├── Recall Scraper
          │   ├── Puppeteer
          │   ├── Navegação
          │   └── Extração
          │
          ├── Leilão Scraper
          │   ├── Axios
          │   ├── Cheerio
          │   └── Parse
          │
          └── Sinistro Scraper
              ├── Análise
              └── Classificação
              │
              ▼
       7. Processamento
          ├── Agregar
          ├── Calcular risco
          └── Gerar resumo
              │
              ▼
       8. Cache Save
          └── Firestore (TTL 24h)
              │
              ▼
       9. Resposta
          └── Dados completos
              │
              ▼
10. Frontend recebe dados
    │
    ▼
11. Hook atualiza estado
    │
    ▼
12. Modal renderiza
    │
    ▼
13. Usuário visualiza histórico
```

---

## 🔒 Camada de Segurança

### Autenticação e Autorização

```
┌─────────────────────────────────────────────────────────┐
│                  Segurança em Camadas                    │
└─────────────────────────────────────────────────────────┘

Camada 1: Firebase Authentication
├── Usuário deve estar autenticado
└── Token JWT validado

Camada 2: Validação de Entrada
├── Formato de placa validado
├── EmpresaId obrigatório
└── Sanitização de dados

Camada 3: Rate Limiting
├── 10 requisições por minuto
├── Por usuário/empresa
└── Janela deslizante

Camada 4: Firestore Rules
├── Leitura: apenas mesma empresa
├── Escrita: apenas Cloud Functions
└── Validação de estrutura

Camada 5: Logging
├── Todas as ações registradas
├── Logs estruturados (JSON)
└── Auditoria completa
```

### Regras do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Histórico Veicular
    match /vehicle_history/{historyId} {
      // Leitura: usuário da mesma empresa
      allow read: if request.auth != null && 
        historyId.matches('^' + request.auth.token.empresaId + '_.*');
      
      // Escrita: apenas Cloud Functions
      allow write: if false;
    }
    
    // Rate Limiting
    match /rate_limits/{userId} {
      // Apenas Cloud Functions
      allow read, write: if false;
    }
  }
}
```

---

## ⚡ Otimizações de Performance

### Cache Strategy

```
┌─────────────────────────────────────────────────────────┐
│              Estratégia de Cache (24h TTL)              │
└─────────────────────────────────────────────────────────┘

Primeira Requisição (Cache MISS):
├── Tempo: 20-30 segundos
├── Executa scrapers
├── Salva no Firestore
└── Retorna dados

Segunda Requisição (Cache HIT):
├── Tempo: < 1 segundo
├── Busca no Firestore
├── Valida expiração
└── Retorna dados

Após 24 horas:
├── Cache expira
├── Próxima requisição: Cache MISS
└── Ciclo reinicia
```

### Execução Paralela

```
Sequencial (Lento):
├── Recall: 10s
├── Leilão: 8s
├── Sinistro: 5s
└── Total: 23s

Paralela (Rápido):
├── Todos simultaneamente
├── Aguarda o mais lento
└── Total: 10s (3x mais rápido!)
```

---

## 📊 Monitoramento e Observabilidade

### Métricas Coletadas

```
┌─────────────────────────────────────────────────────────┐
│                    Métricas do Sistema                   │
└─────────────────────────────────────────────────────────┘

Performance:
├── Tempo de resposta (p50, p95, p99)
├── Cache hit rate
├── Taxa de sucesso dos scrapers
└── Latência por scraper

Uso:
├── Invocações por dia
├── Usuários únicos
├── Placas consultadas
└── Empresas ativas

Erros:
├── Taxa de erro geral
├── Erros por scraper
├── Timeouts
└── Rate limit hits

Custos:
├── Invocações
├── Tempo de execução
├── Armazenamento
└── Rede
```

### Logs Estruturados

```json
{
  "level": "INFO",
  "context": "VehicleHistory",
  "message": "Histórico consultado com sucesso",
  "data": {
    "placa": "ABC1234",
    "empresaId": "empresa123",
    "recalls": 1,
    "leiloes": 0,
    "sinistros": 0,
    "cached": false,
    "duration": 8500
  },
  "timestamp": "2025-01-17T10:30:00.000Z"
}
```

---

## 🎯 Decisões Arquiteturais

### Por que Firebase Functions?
- ✅ Escalabilidade automática
- ✅ Sem gerenciamento de servidor
- ✅ Integração nativa com Firestore
- ✅ Custo baseado em uso

### Por que Puppeteer?
- ✅ Sites governamentais usam JavaScript
- ✅ Renderização completa necessária
- ✅ Mais robusto que Cheerio sozinho

### Por que Cache no Firestore?
- ✅ Já temos Firestore configurado
- ✅ Fácil de consultar e gerenciar
- ✅ Suporta TTL nativo
- ✅ Compartilhável entre usuários

### Por que Execução Paralela?
- ✅ 3x mais rápido
- ✅ Scrapers são independentes
- ✅ Melhor experiência do usuário

---

## 📈 Escalabilidade

### Limites Atuais

```
Usuários simultâneos:     1.000+
Consultas por dia:        10.000+
Tempo de resposta:        < 30s
Cache hit rate:           > 80%
Taxa de sucesso:          > 95%
```

### Plano de Escalabilidade

```
Fase 1 (Atual):
├── 1.000 usuários
├── 10.000 consultas/dia
└── Custo: ~$50/mês

Fase 2 (Crescimento):
├── 10.000 usuários
├── 100.000 consultas/dia
├── Otimizações necessárias
└── Custo: ~$200/mês

Fase 3 (Escala):
├── 100.000 usuários
├── 1.000.000 consultas/dia
├── Infraestrutura dedicada
└── Custo: ~$1.000/mês
```

---

**Criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Status**: ✅ Arquitetura Completa  

🏗️ **Sistema arquitetado para escala e performance!** 🚀
