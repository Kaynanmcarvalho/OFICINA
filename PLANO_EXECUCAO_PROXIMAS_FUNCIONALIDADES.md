# 📋 Plano de Execução - Próximas Funcionalidades

## 🎯 Objetivo: Completar 100% do Roadmap

**Status Atual**: 85% (6/10 funcionalidades)  
**Meta**: 100% (10/10 funcionalidades)  
**Prazo**: Março 2025  

---

## 📅 Cronograma de Implementação

### Sprint 1 - Fevereiro 2025 (Semanas 1-2)
**Funcionalidade**: Modo Aprendiz (Base Técnica)  
**Estimativa**: 40 horas  
**Prioridade**: Alta  

### Sprint 2 - Fevereiro 2025 (Semanas 3-4)
**Funcionalidade**: Histórico Veicular (Scraping)  
**Estimativa**: 40 horas  
**Prioridade**: Alta  

### Sprint 3 - Março 2025 (Semanas 1-2)
**Funcionalidade**: NF-e (Nota Fiscal Eletrônica)  
**Estimativa**: 60 horas  
**Prioridade**: Média  

### Sprint 4 - Março 2025 (Semanas 3-4)
**Funcionalidade**: Previsão de Estoque  
**Estimativa**: 40 horas  
**Prioridade**: Média  

---

## 🎓 Funcionalidade 7: Modo Aprendiz

### Objetivo
Criar base de conhecimento técnico integrada ao sistema para auxiliar mecânicos com informações confiáveis sobre procedimentos, ferramentas e diagnósticos.

### Escopo

#### 1. Estrutura de Dados (8h)
```javascript
// Collection: mechanic_guides
{
  id: "guide_001",
  empresaId: "empresa123",
  category: "motor",
  subcategory: "troca_oleo",
  title: "Troca de Óleo - Procedimento Completo",
  difficulty: "facil", // facil, medio, dificil
  duration: 30, // minutos
  tools: [
    { name: "Chave de filtro", required: true },
    { name: "Bandeja coletora", required: true }
  ],
  steps: [
    {
      order: 1,
      title: "Preparação",
      description: "Aquecer o motor por 5 minutos",
      image: "url",
      video: "url",
      warnings: ["Cuidado com óleo quente"]
    }
  ],
  parts: [
    { name: "Óleo 5W30", quantity: 4, unit: "litros" },
    { name: "Filtro de óleo", quantity: 1, unit: "unidade" }
  ],
  references: [
    { type: "manual", source: "SENAI", url: "..." },
    { type: "video", source: "YouTube", url: "..." }
  ],
  tags: ["oleo", "manutencao", "preventiva"],
  version: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: "admin_id"
}
```

#### 2. Serviços (12h)

**`src/services/mechanicGuideService.js`**
```javascript
class MechanicGuideService {
  // CRUD
  async createGuide(guideData)
  async getGuide(guideId)
  async updateGuide(guideId, updates)
  async deleteGuide(guideId)
  
  // Busca
  async searchGuides(query, filters)
  async getGuidesByCategory(category)
  async getGuidesByDifficulty(difficulty)
  async getRelatedGuides(guideId)
  
  // Conteúdo
  async importFromSource(source, data)
  async validateGuide(guideData)
  async versionGuide(guideId)
  
  // Analytics
  async trackGuideView(guideId, userId)
  async getPopularGuides(limit)
  async getGuideStats(guideId)
}
```

#### 3. Componentes React (12h)

**`src/components/mechanic-guide/GuideViewer.jsx`**
- Visualização de guia completo
- Steps interativos
- Checklist de ferramentas
- Lista de peças necessárias
- Vídeos e imagens
- Referências externas

**`src/components/mechanic-guide/GuideSearch.jsx`**
- Busca por texto
- Filtros (categoria, dificuldade, duração)
- Resultados paginados
- Preview de guias

**`src/components/mechanic-guide/GuideCard.jsx`**
- Card compacto de guia
- Indicadores (dificuldade, duração)
- Tags
- Ações rápidas

**`src/components/mechanic-guide/GuideEditor.jsx`** (Admin)
- Editor de guias
- Upload de imagens/vídeos
- Gerenciamento de steps
- Versionamento

#### 4. Integração (8h)

**Integrar em:**
- Modal de Orçamento (sugerir guias relacionados)
- Página de Serviços (link para guias)
- Dashboard (guias populares)
- Check-in (guias para problemas detectados)

#### 5. Conteúdo Inicial (8h)

**Fontes Públicas:**
- SENAI (manuais técnicos)
- Manuais de fabricantes (domínio público)
- Vídeos educacionais (YouTube com permissão)
- Artigos técnicos (blogs automotivos)

**Guias Iniciais (20+):**
- Troca de óleo
- Troca de pastilhas de freio
- Alinhamento e balanceamento
- Troca de filtros (ar, combustível, cabine)
- Diagnóstico de bateria
- Verificação de fluidos
- Inspeção de pneus
- Troca de lâmpadas
- Limpeza de bicos injetores
- Regulagem de motor

---

## 🚗 Funcionalidade 8: Histórico Veicular

### Objetivo
Consultar e exibir histórico completo de veículos através de scraping de fontes públicas (recalls, leilões, sinistros).

### Escopo

#### 1. Estrutura de Dados (6h)
```javascript
// Collection: vehicle_history
{
  id: "history_001",
  placa: "ABC1234",
  chassi: "9BWZZZ377VT004251",
  empresaId: "empresa123",
  
  recalls: [
    {
      id: "recall_001",
      fabricante: "Volkswagen",
      modelo: "Gol",
      ano: 2020,
      campanha: "2020/001",
      descricao: "Problema no airbag",
      gravidade: "alta",
      status: "pendente",
      dataInicio: "2020-01-15",
      fonte: "gov.br",
      url: "..."
    }
  ],
  
  leiloes: [
    {
      id: "leilao_001",
      leiloeiro: "Detran SP",
      data: "2019-05-20",
      motivo: "Recuperado de roubo",
      valor: 15000,
      status: "vendido",
      fonte: "detran.sp.gov.br",
      url: "..."
    }
  ],
  
  sinistros: [
    {
      id: "sinistro_001",
      tipo: "colisao",
      gravidade: "media",
      data: "2018-03-10",
      seguradora: "Porto Seguro",
      indenizado: true,
      fonte: "sinesp",
      url: "..."
    }
  ],
  
  restricoes: [
    {
      tipo: "roubo",
      status: "recuperado",
      data: "2019-04-15",
      fonte: "sinesp"
    }
  ],
  
  lastUpdate: Timestamp,
  cacheExpiry: Timestamp,
  createdAt: Timestamp
}
```

#### 2. Scrapers (20h)

**`functions/scrapers/recallScraper.js`**
```javascript
class RecallScraper {
  async scrapeRecalls(placa, chassi)
  async parseRecallData(html)
  async validateRecall(data)
  async cacheRecall(data, ttl)
}
```

**`functions/scrapers/leilaoScraper.js`**
```javascript
class LeilaoScraper {
  async scrapeLeiloes(placa, chassi)
  async parseDetranData(html)
  async validateLeilao(data)
  async cacheLeilao(data, ttl)
}
```

**`functions/scrapers/sinistroScraper.js`**
```javascript
class SinistroScraper {
  async scrapeSinistros(placa, chassi)
  async parseSinespData(html)
  async validateSinistro(data)
  async cacheSinistro(data, ttl)
}
```

**Características:**
- Rate limiting (max 10 req/min)
- User-agent rotation
- Retry logic (3 tentativas)
- Cache inteligente (24h TTL)
- Logs detalhados
- Error handling robusto

#### 3. Serviços (8h)

**`src/services/vehicleHistoryService.js`**
```javascript
class VehicleHistoryService {
  async getVehicleHistory(placa, chassi)
  async refreshHistory(placa, force = false)
  async getCachedHistory(placa)
  async hasRecalls(placa)
  async hasLeiloes(placa)
  async hasSinistros(placa)
  async getHistorySummary(placa)
}
```

#### 4. Componentes React (6h)

**`src/components/vehicle-history/HistoryPanel.jsx`**
- Painel completo de histórico
- Tabs (Recalls, Leilões, Sinistros)
- Timeline visual
- Badges de alerta
- Links para fontes

**`src/components/vehicle-history/HistoryBadge.jsx`**
- Badge de alerta no card do veículo
- Cores: Verde (limpo), Amarelo (recalls), Vermelho (sinistros)

**`src/components/vehicle-history/HistoryTimeline.jsx`**
- Timeline visual de eventos
- Ordenação cronológica
- Ícones por tipo de evento

---

## 📄 Funcionalidade 9: NF-e

### Objetivo
Gerar, assinar e enviar Notas Fiscais Eletrônicas de Serviço conforme padrões SEFAZ.

### Escopo

#### 1. Estrutura de Dados (8h)
```javascript
// Collection: nfe
{
  id: "nfe_001",
  empresaId: "empresa123",
  budgetId: "budget_456",
  
  // Identificação
  numero: 1,
  serie: 1,
  tipo: "saida",
  modelo: "55",
  
  // Emitente
  emitente: {
    cnpj: "12345678000190",
    razaoSocial: "Oficina Silva LTDA",
    nomeFantasia: "Silva Auto",
    endereco: {...},
    ie: "123456789",
    crt: 1
  },
  
  // Destinatário
  destinatario: {
    cpfCnpj: "12345678901",
    nome: "João Silva",
    endereco: {...}
  },
  
  // Itens
  itens: [
    {
      numero: 1,
      codigo: "SERV001",
      descricao: "Troca de óleo",
      ncm: "27101990",
      cfop: "5933",
      unidade: "UN",
      quantidade: 1,
      valorUnitario: 150.00,
      valorTotal: 150.00,
      impostos: {
        icms: {...},
        pis: {...},
        cofins: {...}
      }
    }
  ],
  
  // Totais
  totais: {
    baseCalculo: 150.00,
    valorICMS: 0,
    valorTotal: 150.00
  },
  
  // Status
  status: "pendente", // pendente, processando, autorizada, rejeitada
  chaveAcesso: "35210112345678000190550010000000011234567890",
  protocolo: "135210000000001",
  dataAutorizacao: Timestamp,
  
  // XML
  xmlGerado: "...",
  xmlAssinado: "...",
  xmlRetorno: "...",
  
  // DANFE
  danfePdf: "url_storage",
  
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. Serviços (30h)

**`functions/nfe/nfeGenerator.js`**
```javascript
class NFEGenerator {
  async generateXML(nfeData)
  async validateXML(xml)
  async signXML(xml, certificate)
  async sendToSEFAZ(xml)
  async checkStatus(chaveAcesso)
  async generateDANFE(xml)
}
```

**Bibliotecas:**
- `node-nfe` ou `xml2js` para geração XML
- `node-forge` para assinatura digital
- `axios` para comunicação SEFAZ
- `pdfkit` para geração DANFE

#### 3. Componentes React (12h)

**`src/components/nfe/NFEGenerator.jsx`**
- Formulário de geração
- Validação de campos
- Preview do XML
- Status de envio

**`src/components/nfe/NFEList.jsx`**
- Lista de NF-es emitidas
- Filtros e busca
- Download XML/PDF
- Reenvio

**`src/components/nfe/NFEConfig.jsx`** (Admin)
- Configuração de certificado
- Dados da empresa
- Séries e numeração
- Ambiente (homologação/produção)

#### 4. Integração (10h)

**Integrar em:**
- Modal de Orçamento (botão "Emitir NF-e")
- Página de Orçamentos (status NF-e)
- Dashboard (NF-es pendentes)
- Relatórios (faturamento)

---

## 📦 Funcionalidade 10: Previsão de Estoque

### Objetivo
Prever fim de estoque e sugerir reposição baseado em análise estatística de movimentações.

### Escopo

#### 1. Estrutura de Dados (6h)
```javascript
// Collection: stock_predictions
{
  id: "pred_001",
  empresaId: "empresa123",
  productId: "prod_456",
  
  // Dados atuais
  currentStock: 10,
  minStock: 5,
  maxStock: 50,
  
  // Análise
  avgDailyUsage: 2.5,
  trend: "increasing", // increasing, stable, decreasing
  seasonality: "high", // high, medium, low
  
  // Previsão
  daysUntilEmpty: 4,
  suggestedReorder: 30,
  reorderDate: "2025-02-01",
  confidence: 0.85,
  
  // Histórico
  last30Days: {
    totalUsage: 75,
    avgDaily: 2.5,
    maxDaily: 5,
    minDaily: 0
  },
  
  // Alertas
  alerts: [
    {
      type: "low_stock",
      severity: "high",
      message: "Estoque crítico - 4 dias restantes",
      createdAt: Timestamp
    }
  ],
  
  lastUpdate: Timestamp,
  createdAt: Timestamp
}
```

#### 2. Serviços (20h)

**`src/services/stockPredictionService.js`**
```javascript
class StockPredictionService {
  // Análise
  async analyzeProduct(productId)
  async calculateAvgUsage(productId, days)
  async detectTrend(usageData)
  async detectSeasonality(usageData)
  
  // Previsão
  async predictDaysUntilEmpty(productId)
  async suggestReorderQuantity(productId)
  async calculateReorderDate(productId)
  
  // Alertas
  async checkLowStock(empresaId)
  async generateAlerts(predictions)
  async notifyLowStock(productId)
  
  // Relatórios
  async getStockReport(empresaId)
  async getProductPrediction(productId)
  async getBulkPredictions(empresaId)
}
```

**Algoritmos:**
- Média móvel simples (SMA)
- Média móvel exponencial (EMA)
- Detecção de tendência (linear regression)
- Análise de sazonalidade

#### 3. Componentes React (8h)

**`src/components/stock-prediction/PredictionDashboard.jsx`**
- Dashboard de previsões
- Produtos críticos
- Gráficos de tendência
- Alertas

**`src/components/stock-prediction/PredictionCard.jsx`**
- Card de previsão por produto
- Indicadores visuais
- Ações rápidas (pedir reposição)

**`src/components/stock-prediction/StockChart.jsx`**
- Gráfico de uso histórico
- Linha de previsão
- Marcadores de eventos

#### 4. Integração (6h)

**Integrar em:**
- Página de Estoque (previsões por produto)
- Dashboard (alertas de estoque baixo)
- Modal de Produto (previsão individual)
- Relatórios (análise de estoque)

---

## 📊 Resumo de Esforço

| Funcionalidade | Horas | Complexidade | Prioridade |
|----------------|-------|--------------|------------|
| Modo Aprendiz | 40h | Média | Alta |
| Histórico Veicular | 40h | Alta | Alta |
| NF-e | 60h | Alta | Média |
| Previsão de Estoque | 40h | Média | Média |
| **Total** | **180h** | - | - |

---

## ✅ Checklist de Implementação

### Para Cada Funcionalidade

#### Planejamento
- [ ] Definir estrutura de dados
- [ ] Criar schemas Firestore
- [ ] Definir APIs necessárias
- [ ] Listar dependências

#### Desenvolvimento
- [ ] Implementar serviços backend
- [ ] Criar componentes React
- [ ] Desenvolver hooks customizados
- [ ] Integrar com Firestore
- [ ] Adicionar suporte dark mode
- [ ] Garantir responsividade

#### Testes
- [ ] Testes unitários (serviços)
- [ ] Testes de integração
- [ ] Testes E2E
- [ ] Testes de performance
- [ ] Validação manual

#### Documentação
- [ ] README da funcionalidade
- [ ] Quick Start Guide
- [ ] Exemplos de uso
- [ ] Referência de API
- [ ] Troubleshooting

#### Deploy
- [ ] Deploy em staging
- [ ] Testes em staging
- [ ] Deploy em produção
- [ ] Monitoramento
- [ ] Coleta de feedback

---

## 🎯 Metas de Qualidade

### Código
- ✅ 80%+ cobertura de testes
- ✅ 0 bugs críticos
- ✅ < 5 warnings
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier

### Performance
- ✅ < 2s tempo de carregamento
- ✅ < 100ms cálculos
- ✅ < 3s processamento IA
- ✅ 99.9% uptime

### UX
- ✅ Design Apple-like
- ✅ Dark mode completo
- ✅ 100% responsivo
- ✅ WCAG 2.1 compliance
- ✅ Animações suaves

---

## 🚀 Próximos Passos Imediatos

### Semana 1 (Fev 2025)
1. Iniciar Modo Aprendiz
2. Definir estrutura de dados
3. Coletar conteúdo técnico
4. Implementar serviços básicos

### Semana 2 (Fev 2025)
1. Criar componentes React
2. Integrar com sistema
3. Testes e validação
4. Documentação

### Semana 3 (Fev 2025)
1. Iniciar Histórico Veicular
2. Implementar scrapers
3. Criar sistema de cache
4. Desenvolver componentes

### Semana 4 (Fev 2025)
1. Integrar histórico veicular
2. Testes completos
3. Deploy em staging
4. Preparar para produção

---

**Plano Criado**: 17 de Janeiro de 2025  
**Início Previsto**: 1 de Fevereiro de 2025  
**Conclusão Prevista**: 31 de Março de 2025  
**Status**: 📋 PLANEJADO  

**VAMOS COMPLETAR OS 100%! 🚀🎯**
