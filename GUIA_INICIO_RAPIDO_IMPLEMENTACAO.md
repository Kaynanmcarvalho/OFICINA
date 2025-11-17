# 🚀 Guia de Início Rápido - Implementação das 3 Funcionalidades

## 📋 Visão Geral

Este guia fornece um passo a passo prático para iniciar a implementação das 3 funcionalidades restantes do TORQ AI.

**Data de início**: 03 de Fevereiro de 2025  
**Duração total**: 8 semanas  
**Horas totais**: 140h  

---

## ✅ Pré-requisitos

### Ambiente de Desenvolvimento
- [ ] Node.js 18+ instalado
- [ ] Python 3.9+ instalado
- [ ] Firebase CLI instalado
- [ ] Git configurado
- [ ] VS Code ou IDE preferida
- [ ] Acesso ao projeto Firebase
- [ ] Acesso ao repositório GitHub

### Conhecimentos Necessários
- [ ] React + TypeScript
- [ ] Firebase (Firestore, Functions, Storage)
- [ ] Node.js backend
- [ ] Python básico (para scrapers)
- [ ] APIs REST
- [ ] Web scraping (Puppeteer/Cheerio)

### Acessos e Credenciais
- [ ] Firebase Console
- [ ] Google Cloud Console
- [ ] GitHub repository
- [ ] Slack workspace
- [ ] Notion workspace

---

## 🗂️ Estrutura de Pastas

### Criar estrutura base:

```bash
# Backend - Cloud Functions
functions/
├── vehicle-history/
│   ├── index.js
│   ├── scrapers/
│   │   ├── recallScraper.js
│   │   ├── leilaoScraper.js
│   │   └── sinistroScraper.js
│   └── utils/
│       ├── cache.js
│       ├── rateLimiter.js
│       └── logger.js
├── nfe/
│   ├── index.js
│   ├── generators/
│   │   ├── xmlGenerator.js
│   │   └── danfeGenerator.js
│   ├── sefaz/
│   │   ├── sefazClient.js
│   │   └── signer.js
│   └── utils/
│       └── validator.js
└── stock-prediction/
    ├── index.js
    ├── algorithms/
    │   ├── sma.js
    │   ├── ema.js
    │   └── regression.js
    └── utils/
        └── calculator.js

# Frontend - React
src/
├── components/
│   ├── vehicle-history/
│   │   ├── VehicleHistoryBadge.jsx
│   │   ├── VehicleHistoryModal.jsx
│   │   └── VehicleHistoryTimeline.jsx
│   ├── nfe/
│   │   ├── NFEWizard.jsx
│   │   ├── NFEModal.jsx
│   │   └── NFEList.jsx
│   └── stock-prediction/
│       ├── PredictionDashboard.jsx
│       ├── PredictionCard.jsx
│       └── StockChart.jsx
├── services/
│   ├── vehicleHistoryService.js
│   ├── nfeService.js
│   └── stockPredictionService.js
└── hooks/
    ├── useVehicleHistory.js
    ├── useNFE.js
    └── useStockPrediction.js

# Testes
tests/
├── unit/
│   ├── vehicleHistory.test.js
│   ├── nfe.test.js
│   └── stockPrediction.test.js
├── integration/
│   ├── vehicleHistory.integration.test.js
│   ├── nfe.integration.test.js
│   └── stockPrediction.integration.test.js
└── e2e/
    └── cypress/
        └── e2e/
            ├── vehicle-history.cy.js
            ├── nfe.cy.js
            └── stock-prediction.cy.js
```

---

## 🛠️ Setup Inicial

### 1. Instalar Dependências

```bash
# Backend (Cloud Functions)
cd functions
npm install puppeteer cheerio axios xml2js node-forge soap pdfkit qrcode

# Frontend
cd ..
npm install recharts react-query @tanstack/react-query

# Testes
npm install --save-dev @testing-library/react @testing-library/jest-dom cypress
```

### 2. Configurar Firebase

```bash
# Login no Firebase
firebase login

# Selecionar projeto
firebase use torq-ai-production

# Configurar Functions
firebase init functions

# Configurar Firestore
firebase init firestore

# Configurar Storage
firebase init storage
```

### 3. Configurar Variáveis de Ambiente

```bash
# .env.local (Frontend)
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# functions/.env (Backend)
SEFAZ_HOMOLOG_URL=https://...
SEFAZ_PROD_URL=https://...
```

### 4. Configurar Secret Manager (para certificados NF-e)

```bash
# Criar secret para certificado
gcloud secrets create nfe-certificate --data-file=certificate.pfx

# Dar permissão para Cloud Functions
gcloud secrets add-iam-policy-binding nfe-certificate \
  --member=serviceAccount:your-project@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor
```

---

## 📅 Semana 1-2: Preparação (03-16 Fev)

### Dia 1: Setup Completo

```bash
# 1. Clonar repositório (se necessário)
git clone https://github.com/your-org/torq-ai.git
cd torq-ai

# 2. Criar branch de desenvolvimento
git checkout -b feature/historico-veicular

# 3. Instalar dependências
npm install
cd functions && npm install && cd ..

# 4. Rodar testes existentes
npm test

# 5. Iniciar emuladores Firebase
firebase emulators:start
```

### Dia 2-3: Pesquisa de Fontes

**Histórico Veicular - Fontes a pesquisar**:

1. **Recalls (Gov.br)**
   - URL: https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/recall
   - Testar busca manual
   - Identificar seletores CSS
   - Documentar estrutura HTML

2. **Leilões (Detran)**
   - Identificar portais por estado
   - Testar consultas
   - Documentar APIs (se existirem)

3. **Sinistros (Sinesp)**
   - Pesquisar API oficial
   - Testar endpoints
   - Documentar autenticação

**Criar documento de pesquisa**:
```markdown
# Pesquisa de Fontes - Histórico Veicular

## Recalls (Gov.br)
- URL: ...
- Método: Scraping
- Seletores: ...
- Exemplo de resposta: ...

## Leilões (Detran SP)
- URL: ...
- Método: API/Scraping
- Autenticação: ...
- Exemplo de resposta: ...

## Sinistros (Sinesp)
- URL: ...
- Método: API
- Autenticação: ...
- Exemplo de resposta: ...
```

### Dia 4-5: Testes de Scrapers

**Criar scrapers de teste**:

```javascript
// functions/vehicle-history/scrapers/test-recall.js
const puppeteer = require('puppeteer');

async function testRecallScraper() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://www.gov.br/mj/pt-br/assuntos/seus-direitos/consumidor/recall');
  
  // Testar busca
  await page.type('#search-input', 'ABC1234');
  await page.click('#search-button');
  
  // Aguardar resultados
  await page.waitForSelector('.result-item');
  
  // Extrair dados
  const results = await page.evaluate(() => {
    const items = document.querySelectorAll('.result-item');
    return Array.from(items).map(item => ({
      campanha: item.querySelector('.campanha')?.textContent,
      descricao: item.querySelector('.descricao')?.textContent,
      // ... outros campos
    }));
  });
  
  console.log('Resultados:', results);
  
  await browser.close();
}

testRecallScraper();
```

**Executar testes**:
```bash
node functions/vehicle-history/scrapers/test-recall.js
```

---

## 📅 Semana 3: Histórico Veicular - Backend (17-23 Fev)

### Checklist Diário

#### Segunda (Dia 1) - Setup e Infraestrutura
- [ ] Criar estrutura de pastas
- [ ] Configurar package.json
- [ ] Criar schemas Firestore
- [ ] Implementar Security Rules
- [ ] Setup de testes
- [ ] Commit: "feat: setup vehicle history infrastructure"

#### Terça (Dia 2) - Scraper de Recalls
- [ ] Implementar recallScraper.js
- [ ] Parser de dados
- [ ] Validação
- [ ] Testes unitários
- [ ] Commit: "feat: implement recall scraper"

#### Quarta (Dia 3) - Scrapers de Leilões e Sinistros
- [ ] Implementar leilaoScraper.js
- [ ] Implementar sinistroScraper.js
- [ ] Testes unitários
- [ ] Commit: "feat: implement leilao and sinistro scrapers"

#### Quinta (Dia 4) - Cloud Function Orquestradora
- [ ] Implementar getVehicleHistory
- [ ] Sistema de cache
- [ ] Agregação de resultados
- [ ] Testes de integração
- [ ] Commit: "feat: implement vehicle history orchestrator"

#### Sexta (Dia 5) - Rate Limiting e Logs
- [ ] Implementar rate limiter
- [ ] Sistema de logs
- [ ] Monitoramento
- [ ] Deploy em staging
- [ ] Commit: "feat: add rate limiting and logging"

### Comandos Úteis

```bash
# Rodar testes
npm test -- vehicle-history

# Deploy em staging
firebase deploy --only functions:getVehicleHistory --project staging

# Ver logs
firebase functions:log --only getVehicleHistory

# Testar localmente
firebase emulators:start --only functions
```

---

## 📅 Semana 4: Histórico Veicular - Frontend (24 Fev - 02 Mar)

### Checklist Diário

#### Segunda (Dia 1) - Badge
- [ ] Criar VehicleHistoryBadge.jsx
- [ ] Estilos e animações
- [ ] Integrar no ClientCard
- [ ] Testes de componente
- [ ] Commit: "feat: add vehicle history badge"

#### Terça (Dia 2) - Modal
- [ ] Criar VehicleHistoryModal.jsx
- [ ] Sistema de Tabs
- [ ] Cards de detalhes
- [ ] Testes de componente
- [ ] Commit: "feat: add vehicle history modal"

#### Quarta (Dia 3) - Timeline e Serviços
- [ ] Criar VehicleHistoryTimeline.jsx
- [ ] Implementar vehicleHistoryService.js
- [ ] Criar useVehicleHistory hook
- [ ] Testes
- [ ] Commit: "feat: add timeline and services"

#### Quinta (Dia 4) - Testes Frontend
- [ ] Testes de componentes
- [ ] Testes E2E (Cypress)
- [ ] Ajustes de bugs
- [ ] Commit: "test: add vehicle history tests"

#### Sexta (Dia 5) - Documentação e Deploy
- [ ] Escrever documentação
- [ ] Criar vídeo tutorial
- [ ] Deploy em produção
- [ ] Commit: "docs: add vehicle history documentation"

---

## 📅 Semanas 5-7: NF-e (03-23 Mar)

### Semana 5 - Backend Parte 1

**Foco**: Geração e assinatura de XML

```bash
# Instalar dependências específicas
cd functions/nfe
npm install xml2js node-forge soap

# Baixar schemas SEFAZ
wget https://www.nfe.fazenda.gov.br/portal/schemas/nfe_v4.00.xsd
```

**Checklist**:
- [ ] Geração de XML
- [ ] Assinatura digital
- [ ] Validação contra schema
- [ ] Testes unitários

### Semana 6 - Backend Parte 2 + Frontend

**Foco**: Integração SEFAZ e interface

**Checklist**:
- [ ] Cliente SOAP para SEFAZ
- [ ] Geração de DANFE
- [ ] Wizard de configuração
- [ ] Modal de emissão

### Semana 7 - Testes + Previsão Backend

**Foco**: Homologação NF-e e início Previsão

**Checklist**:
- [ ] Testes em homologação SEFAZ
- [ ] Documentação NF-e
- [ ] Algoritmos de previsão
- [ ] Cálculos estatísticos

---

## 📅 Semana 8: Previsão de Estoque - Frontend (24-30 Mar)

### Checklist Semanal

- [ ] Dashboard de previsões
- [ ] Análise individual de produto
- [ ] Sistema de alertas
- [ ] Relatórios
- [ ] Testes completos
- [ ] Deploy em produção

---

## 🧪 Testes

### Executar Testes

```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Testes E2E
npm run cypress:open

# Cobertura
npm run test:coverage
```

### Metas de Cobertura

- Unit tests: > 80%
- Integration tests: > 70%
- E2E tests: Fluxos críticos

---

## 🚀 Deploy

### Staging

```bash
# Deploy Functions
firebase deploy --only functions --project staging

# Deploy Frontend
npm run build
firebase deploy --only hosting --project staging
```

### Produção

```bash
# Criar tag de release
git tag -a v3.0.0 -m "Release 3.0.0 - 100% Complete"
git push origin v3.0.0

# Deploy
firebase deploy --project production
```

---

## 📊 Monitoramento

### Ferramentas

1. **Firebase Console**: Logs e métricas
2. **Google Cloud Console**: Performance e custos
3. **Sentry**: Error tracking
4. **LogRocket**: Session replay

### Métricas Importantes

- Taxa de sucesso de scrapers
- Tempo de resposta
- Taxa de erro
- Uso de recursos
- Satisfação do usuário

---

## 🆘 Troubleshooting

### Problemas Comuns

**1. Scraper não funciona**
```bash
# Verificar se site mudou estrutura
# Atualizar seletores CSS
# Verificar rate limiting
```

**2. Erro de assinatura NF-e**
```bash
# Verificar validade do certificado
# Verificar senha
# Verificar permissões Secret Manager
```

**3. Previsões imprecisas**
```bash
# Verificar dados históricos
# Ajustar parâmetros dos algoritmos
# Aumentar período de análise
```

---

## 📞 Suporte

### Canais
- **Slack**: #torq-ai-dev
- **Email**: dev@torqai.com.br
- **GitHub Issues**: Para bugs e features

### Documentação
- **Specs**: `.kiro/specs/`
- **README**: Cada módulo tem seu README
- **API Docs**: `/docs/api/`

---

## ✅ Checklist Final

### Antes de Iniciar
- [ ] Ambiente configurado
- [ ] Acessos validados
- [ ] Specs revisadas
- [ ] Equipe alinhada

### Durante Desenvolvimento
- [ ] Commits diários
- [ ] Testes contínuos
- [ ] Code reviews
- [ ] Documentação atualizada

### Antes de Deploy
- [ ] Todos os testes passando
- [ ] Cobertura > 80%
- [ ] Documentação completa
- [ ] Aprovação do tech lead

---

**Documento criado**: 17 de Janeiro de 2025  
**Versão**: 1.0  
**Status**: 📋 Pronto para uso  

**BOA SORTE NA IMPLEMENTAÇÃO! 🚀💪**
