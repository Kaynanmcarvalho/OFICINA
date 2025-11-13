# 🚀 TORQ AI - PLANO MESTRE DE IMPLEMENTAÇÃO

## 📋 VISÃO GERAL

Implementação completa e industrial de funcionalidades IA para o sistema Torq, com foco em:
- **Dados reais** (zero mocks)
- **Firebase completo** (Firestore, Storage, Functions, Hosting)
- **Testes E2E** obrigatórios
- **UX Apple-like** (dark/light mode, animações, glassmorphism)
- **Segurança** (Firestore Rules, isolamento multi-tenant)

---

## 🎯 PRIORIDADES DE IMPLEMENTAÇÃO

### **SPRINT 1 (Semanas 1-2): Auto Diagnóstico Visual** ⭐⭐⭐
**Status**: 🟡 EM ANDAMENTO
**Objetivo**: Upload de foto/vídeo → detecção de danos → relatório visual

#### Entregas Sprint 1:
1. ✅ Schema Firestore (`diagnostics` collection)
2. ✅ Cloud Function `processVehicleImage` (YOLOv8)
3. ✅ UI de upload integrada em `/clients`
4. ✅ Componente de resultados com imagens anotadas
5. ✅ Testes E2E com emulador Firebase
6. ✅ Documentação completa

**Estimativa**: 10 dias úteis
**Pontos**: 21 (complexidade alta)

---

### **SPRINT 2 (Semanas 3-4): Assistente de Orçamento Falado** ⭐⭐⭐
**Status**: 🔴 PENDENTE
**Objetivo**: Gravação via Web Speech API → extração de entidades → criação de orçamento

#### Entregas Sprint 2:
1. ⬜ Web Speech API integration (frontend-first)
2. ⬜ NLP parser para extração de entidades
3. ⬜ Dicionários customizáveis no Firestore
4. ⬜ UI de gravação com feedback visual
5. ⬜ Preview editável de orçamento
6. ⬜ Fallback para Whisper (opcional)
7. ⬜ Testes de accuracy (>90%)

**Estimativa**: 12 dias úteis
**Pontos**: 18 (complexidade média-alta)

---

### **SPRINT 3 (Semanas 5-6): Análise de Custos & Margens** ⭐⭐
**Status**: 🔴 PENDENTE
**Objetivo**: Insights reais a partir dos orçamentos e entradas de custos

#### Entregas Sprint 3:
1. ⬜ Queries agregadas Firestore
2. ⬜ Cloud Functions para cálculos
3. ⬜ Visualizações com Recharts
4. ⬜ Relatórios exportáveis (CSV/PDF)
5. ⬜ Cards de insights no `/clients`
6. ⬜ Testes de performance

**Estimativa**: 8 dias úteis
**Pontos**: 13 (complexidade média)

---

### **SPRINT 4 (Semanas 7-8): Modo Aprendiz** ⭐⭐
**Status**: 🔴 PENDENTE
**Objetivo**: Base técnica confiável embutida e integrada aos orçamentos

#### Entregas Sprint 4:
1. ⬜ Collection `mechanic_guides` no Firestore
2. ⬜ Conteúdo inicial (SENAI, manuais públicos)
3. ⬜ UI de busca e visualização
4. ⬜ Integração com orçamentos
5. ⬜ Sistema de versionamento
6. ⬜ Documentação de fontes

**Estimativa**: 6 dias úteis
**Pontos**: 8 (complexidade baixa-média)

---

### **SPRINT 5 (Semanas 9-10): Histórico Veicular** ⭐⭐
**Status**: 🔴 PENDENTE
**Objetivo**: Scraping de fontes públicas (recall, sinistro, leilões)

#### Entregas Sprint 5:
1. ⬜ Scrapers para fontes públicas
2. ⬜ Cache no Firestore (TTL 24h)
3. ⬜ Badge/selo no card do veículo
4. ⬜ Modal de detalhes
5. ⬜ Rate limiting e respeito a robots.txt
6. ⬜ Documentação legal

**Estimativa**: 10 dias úteis
**Pontos**: 16 (complexidade alta)

---

### **SPRINT 6 (Semanas 11-12): NF-e** ⭐
**Status**: 🔴 PENDENTE
**Objetivo**: Geração/assinatura/enfileiramento de XML para envio à SEFAZ

#### Entregas Sprint 6:
1. ⬜ Geração de XML (schema SEFAZ)
2. ⬜ Assinatura com certificado A1
3. ⬜ Envio para SEFAZ (endpoints estaduais)
4. ⬜ Geração de DANFE (PDF)
5. ⬜ Fila de processamento
6. ⬜ Testes em homologação

**Estimativa**: 12 dias úteis
**Pontos**: 21 (complexidade alta)

---

### **SPRINT 7 (Semanas 13-14): Estoque & Previsão** ⭐
**Status**: 🔴 PENDENTE
**Objetivo**: Lógica estatística para previsão de fim de estoque

#### Entregas Sprint 7:
1. ⬜ Algoritmo de previsão (média móvel)
2. ⬜ Alertas de reposição
3. ⬜ UI de gestão de estoque
4. ⬜ Integração com orçamentos
5. ⬜ Relatórios de movimentação
6. ⬜ Testes de accuracy

**Estimativa**: 8 dias úteis
**Pontos**: 13 (complexidade média)

---

## 🏗️ ARQUITETURA TÉCNICA

### **Frontend Stack**
- React 18 + TypeScript
- TailwindCSS + Framer Motion
- shadcn/ui + lucide-react
- Tema claro/escuro (Apple-like)

### **Backend Stack**
- Firebase Firestore (dados reais)
- Firebase Storage (imagens/vídeos)
- Firebase Functions (Node.js/TypeScript)
- Firebase Hosting (deploy)

### **ML/AI Stack**
- YOLOv8 (Ultralytics) para detecção de danos
- Web Speech API para transcrição
- Whisper (fallback opcional)
- NLP custom para extração de entidades

### **Testing Stack**
- Jest (unit tests)
- Testing Library (integration)
- Cypress (E2E)
- Firebase Emulator Suite

---

## 📊 SCHEMA FIRESTORE

### **Collection: `diagnostics`**
```javascript
{
  id: string,
  empresaId: string,
  vehicleId: string,
  clientId: string,
  images: [
    {
      original: string, // Storage URL
      annotated: string, // Storage URL
      detections: [
        {
          label: string,
          confidence: number,
          bbox: [x, y, w, h],
          severity: 'low' | 'medium' | 'high'
        }
      ]
    }
  ],
  summary: {
    totalDamages: number,
    estimatedCost: number,
    needsHumanReview: boolean
  },
  status: 'processing' | 'completed' | 'failed',
  createdAt: timestamp,
  completedAt: timestamp,
  createdBy: string
}
```

### **Collection: `voice_mappings`**
```javascript
{
  empresaId: string,
  services: {
    'troca de óleo': 'oil_change',
    'alinhamento': 'wheel_alignment',
    // ...
  },
  parts: {
    'filtro de ar': 'air_filter',
    'pastilha de freio': 'brake_pad',
    // ...
  },
  vehicles: {
    'palio': 'Fiat Palio',
    'civic': 'Honda Civic',
    // ...
  },
  updatedAt: timestamp
}
```

### **Collection: `mechanic_guides`**
```javascript
{
  id: string,
  service: string,
  title: string,
  difficulty: 'easy' | 'medium' | 'hard',
  duration: number, // minutes
  tools: [string],
  steps: [
    {
      order: number,
      description: string,
      image: string, // optional
      warning: string // optional
    }
  ],
  sources: [
    {
      name: string,
      url: string,
      license: string
    }
  ],
  version: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **Collection: `vehicle_history_cache`**
```javascript
{
  placa: string,
  data: {
    recalls: [...],
    sinistros: [...],
    leiloes: [...]
  },
  sources: [string],
  cachedAt: timestamp,
  expiresAt: timestamp
}
```

---

## 🔒 FIRESTORE SECURITY RULES

```javascript
// Diagnósticos
match /empresas/{empresaId}/diagnostics/{diagId} {
  allow read: if belongsToUserEmpresa(empresaId);
  allow create: if belongsToUserEmpresa(empresaId) && 
                   (hasRole('admin') || hasRole('atendente')) &&
                   isValidEmpresaId();
  allow update: if belongsToUserEmpresa(empresaId) && 
                   request.resource.data.empresaId == resource.data.empresaId;
  allow delete: if belongsToUserEmpresa(empresaId) && isAdmin();
}

// Voice Mappings (por empresa)
match /empresas/{empresaId}/voice_mappings/{mappingId} {
  allow read: if belongsToUserEmpresa(empresaId);
  allow write: if belongsToUserEmpresa(empresaId) && isAdmin();
}

// Mechanic Guides (global, read-only para usuários)
match /mechanic_guides/{guideId} {
  allow read: if isAuthenticated();
  allow write: if false; // Apenas backend
}

// Vehicle History Cache (global, compartilhado)
match /vehicle_history_cache/{placa} {
  allow read: if isAuthenticated();
  allow create, update: if isAuthenticated();
  allow delete: if false;
}
```

---

## 🧪 ESTRATÉGIA DE TESTES

### **Unit Tests** (Jest)
- Parsers (voz → entidade)
- Funções utilitárias
- Regras de negócio
- Cobertura mínima: 80%

### **Integration Tests** (Testing Library)
- Integração com Firestore
- Upload para Storage
- Chamadas a Functions
- Usar Firebase Emulator

### **E2E Tests** (Cypress)
- Fluxo completo de diagnóstico
- Criação de orçamento por voz
- Emissão de NF-e
- Testes em staging

### **Load Tests** (k6/artillery)
- Processamento de imagens
- Scrapers
- Endpoints críticos
- Validar escalonamento

---

## 📦 ESTRUTURA DE PASTAS

```
torq/
├── src/
│   ├── components/
│   │   ├── diagnosis/
│   │   │   ├── DiagnosisUploader.jsx ✅
│   │   │   ├── DiagnosisResults.jsx ✅
│   │   │   └── DiagnosisHistory.jsx
│   │   ├── voice/
│   │   │   ├── VoiceAssistant.jsx ✅
│   │   │   ├── VoiceRecorder.jsx
│   │   │   └── EntityPreview.jsx
│   │   └── ...
│   ├── services/
│   │   ├── diagnosisService.js ✅
│   │   ├── voiceService.js ✅
│   │   ├── costAnalysisService.js
│   │   └── ...
│   ├── hooks/
│   │   ├── useDiagnosis.js ✅
│   │   ├── useVoiceAssistant.js ✅
│   │   └── ...
│   └── ...
├── functions/
│   ├── processVehicleImage/ ✅
│   │   ├── index.js
│   │   ├── detector.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── processVoiceTranscription/
│   ├── generateNFe/
│   ├── scrapeVehicleHistory/
│   └── ...
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── TESTING.md
└── ...
```

---

## 🚀 CI/CD PIPELINE

### **GitHub Actions Workflow**
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build

  deploy:
    needs: [lint, test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: firebase deploy --only hosting,functions
```

---

## 📈 MÉTRICAS DE SUCESSO

### **Auto Diagnóstico Visual**
- ✅ Accuracy > 85% (detecção de danos)
- ✅ Tempo de processamento < 30s (CPU)
- ✅ False positives < 10%
- ✅ Taxa de revisão humana < 20%

### **Assistente de Voz**
- ✅ Accuracy > 90% (comandos simples)
- ✅ Tempo de processamento < 5s total
- ✅ Taxa de correção manual < 15%

### **Análise de Custos**
- ✅ Queries < 2s
- ✅ Relatórios exportáveis
- ✅ Insights acionáveis

### **Modo Aprendiz**
- ✅ 100+ guias iniciais
- ✅ Fontes documentadas
- ✅ Busca < 1s

### **Histórico Veicular**
- ✅ Cache hit rate > 80%
- ✅ Scraping < 10s
- ✅ Conformidade legal

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### **AGORA (Sprint 1 - Dia 1)**
1. ✅ Criar schema Firestore para `diagnostics`
2. ✅ Implementar Cloud Function `processVehicleImage`
3. ✅ Criar componente `DiagnosisUploader`
4. ✅ Integrar em `/clients`
5. ⬜ Configurar Firebase Emulator
6. ⬜ Escrever testes E2E
7. ⬜ Documentar API

### **Datasets para Treinamento**
- Kaggle Car Damage Detection: https://www.kaggle.com/datasets/anujms/car-damage-detection
- Vehicle Visual Inspection: https://www.kaggle.com/datasets/lplenka/coco-car-damage-detection-dataset
- Roboflow Car Damage: https://universe.roboflow.com/car-damage-detection

---

## 📝 NOTAS IMPORTANTES

### **Segredos e Credenciais**
- ❌ NUNCA commitar certificados/chaves
- ✅ Usar Firebase Secret Manager
- ✅ Instruir cliente para fornecer credenciais
- ✅ Documentar processo de setup

### **Conformidade Legal**
- ✅ Scraping: respeitar robots.txt
- ✅ NF-e: documentar requisitos SEFAZ
- ✅ LGPD: não armazenar áudio após processamento
- ✅ Consentimento explícito do usuário

### **Performance**
- ✅ Usar Cloud Run para detector (escalonamento)
- ✅ Cache agressivo (Firestore + CDN)
- ✅ Lazy loading de componentes
- ✅ Otimização de imagens

---

## 🏆 CRITÉRIOS DE ACEITAÇÃO FINAL

- ✅ Todos os testes E2E passando
- ✅ Cobertura de testes > 80%
- ✅ Documentação completa
- ✅ Deploy em staging funcionando
- ✅ Aprovação do cliente
- ✅ Zero dados mock
- ✅ Firestore Rules validadas
- ✅ Performance dentro dos SLAs

---

**Última atualização**: 2025-01-13
**Responsável**: Claude 4.5 (Kiro AI)
**Status Geral**: 🟡 Sprint 1 em andamento
