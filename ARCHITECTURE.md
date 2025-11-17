# 🏗️ Arquitetura do Sistema - TORQ AI

## 📊 Visão Geral

O TORQ AI é uma aplicação web moderna construída com arquitetura serverless, utilizando React no frontend e Firebase no backend.

---

## 🎯 Princípios Arquiteturais

### 1. Separação de Responsabilidades
- **Apresentação**: Componentes React
- **Lógica de Negócio**: Serviços
- **Estado**: Hooks customizados
- **Dados**: Firebase Firestore

### 2. Modularidade
- Componentes independentes e reutilizáveis
- Serviços desacoplados
- Hooks compartilhados

### 3. Escalabilidade
- Serverless architecture
- Cloud Functions para processamento pesado
- Cache inteligente

### 4. Performance
- Code splitting
- Lazy loading
- Otimização de imagens
- Service Workers

---

## 🏛️ Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │ Components │  │   Hooks    │  │  Services  │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      FIREBASE BACKEND                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Firestore   │  │   Storage    │  │     Auth     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Functions   │  │   Hosting    │  │  Cloud Run   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  OpenAI API  │  │   WhatsApp   │  │  YOLOv8 ML   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Diretórios

```
torq-ai/
├── src/                          # Código fonte frontend
│   ├── components/               # Componentes React
│   │   ├── cost-analysis/       # Análise de custos
│   │   ├── voice/               # Assistente de voz
│   │   ├── diagnosis/           # Auto diagnóstico
│   │   ├── mechanic-guide/      # Modo aprendiz
│   │   ├── whatsapp/            # WhatsApp
│   │   └── inventory/           # Estoque
│   ├── services/                # Serviços de negócio
│   │   ├── costAnalysisService.js
│   │   ├── mechanicGuideService.js
│   │   ├── aiDiagnosisService.js
│   │   └── whatsappService.js
│   ├── hooks/                   # Hooks customizados
│   │   ├── useCostAnalysis.js
│   │   ├── useMechanicGuide.js
│   │   └── useAIDiagnosis.js
│   ├── pages/                   # Páginas da aplicação
│   │   ├── dashboard/
│   │   ├── budgets/
│   │   ├── checkin/
│   │   └── inventory/
│   ├── utils/                   # Utilitários
│   ├── styles/                  # Estilos globais
│   └── firebase/                # Configuração Firebase
├── functions/                    # Cloud Functions
│   ├── yolov8-detector/         # Detector YOLOv8
│   └── processVehicleImage/     # Processamento imagens
├── server/                       # Backend WhatsApp
│   ├── services/
│   └── routes/
├── tests/                        # Testes
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/                         # Documentação
```

---

## 🔄 Fluxo de Dados

### 1. Fluxo de Criação de Orçamento

```
User Input (Voice/Manual)
    ↓
Voice Recognition / Form
    ↓
AI Processing (OpenAI)
    ↓
Budget Service
    ↓
Cost Analysis Service
    ↓
Firestore (Save)
    ↓
UI Update (Real-time)
```

### 2. Fluxo de Auto Diagnóstico

```
Image Upload
    ↓
Firebase Storage
    ↓
Cloud Function Trigger
    ↓
YOLOv8 Detection
    ↓
Result Processing
    ↓
Firestore (Save)
    ↓
UI Update (Annotated Image)
```

### 3. Fluxo de WhatsApp

```
Budget Created
    ↓
User Action (Send)
    ↓
WhatsApp Service
    ↓
Baileys API
    ↓
Message Sent
    ↓
Status Update (Firestore)
```

---

## 🗄️ Modelo de Dados (Firestore)

### Collections Principais

#### 1. budgets
```javascript
{
  id: string,
  empresaId: string,
  clientId: string,
  vehicleId: string,
  items: [
    {
      id: string,
      description: string,
      type: 'peca' | 'servico' | 'maoDeObra',
      cost: number,
      price: number,
      quantity: number
    }
  ],
  total: number,
  status: 'draft' | 'sent' | 'approved' | 'rejected',
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. costAnalysis
```javascript
{
  id: string,
  budgetId: string,
  empresaId: string,
  totals: {
    cost: number,
    price: number,
    margin: number,
    profitAmount: number
  },
  validation: {
    isValid: boolean,
    status: string,
    message: string
  },
  recommendations: Array,
  createdAt: Timestamp
}
```

#### 3. mechanic_guides
```javascript
{
  id: string,
  empresaId: string,
  title: string,
  category: string,
  difficulty: 'facil' | 'medio' | 'dificil',
  duration: number,
  steps: Array,
  tools: Array,
  parts: Array,
  views: number,
  likes: number,
  createdAt: Timestamp
}
```

#### 4. diagnostics
```javascript
{
  id: string,
  vehicleId: string,
  empresaId: string,
  imageUrl: string,
  annotatedImageUrl: string,
  detections: [
    {
      class: string,
      confidence: number,
      bbox: [x, y, w, h]
    }
  ],
  status: 'processing' | 'completed' | 'failed',
  createdAt: Timestamp
}
```

---

## 🔐 Segurança

### Autenticação
- Firebase Authentication
- JWT tokens
- Session management

### Autorização
- Firestore Security Rules
- Role-based access control (RBAC)
- Resource-level permissions

### Firestore Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Budgets
    match /budgets/{budgetId} {
      allow read: if request.auth != null 
        && request.auth.token.empresaId == resource.data.empresaId;
      allow write: if request.auth != null 
        && request.auth.token.empresaId == request.resource.data.empresaId;
    }
    
    // Cost Analysis
    match /costAnalysis/{analysisId} {
      allow read: if request.auth != null 
        && request.auth.token.empresaId == resource.data.empresaId;
      allow write: if request.auth != null;
    }
    
    // Mechanic Guides
    match /mechanic_guides/{guideId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.token.role == 'admin';
    }
  }
}
```

---

## 🚀 Performance

### Frontend Optimizations

1. **Code Splitting**
```javascript
const BudgetModal = lazy(() => import('./components/BudgetModal'));
const CheckinPage = lazy(() => import('./pages/CheckinPage'));
```

2. **Memoization**
```javascript
const MemoizedComponent = React.memo(ExpensiveComponent);
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

3. **Debouncing**
```javascript
const debouncedSearch = useDebounce(searchQuery, 300);
```

### Backend Optimizations

1. **Firestore Indexes**
```javascript
// Composite indexes for common queries
budgets: [empresaId, createdAt]
guides: [empresaId, category, views]
```

2. **Caching**
```javascript
// Cache frequently accessed data
const cache = new Map();
const getCachedData = (key, ttl = 3600) => {
  // Implementation
};
```

3. **Batch Operations**
```javascript
const batch = db.batch();
items.forEach(item => {
  const ref = db.collection('items').doc(item.id);
  batch.set(ref, item);
});
await batch.commit();
```

---

## 🔄 CI/CD Pipeline

```
┌─────────────┐
│  Git Push   │
└──────┬──────┘
       ↓
┌─────────────┐
│   Lint      │
└──────┬──────┘
       ↓
┌─────────────┐
│   Tests     │
└──────┬──────┘
       ↓
┌─────────────┐
│   Build     │
└──────┬──────┘
       ↓
┌─────────────┐
│   Deploy    │
│  (Staging)  │
└──────┬──────┘
       ↓
┌─────────────┐
│   E2E Tests │
└──────┬──────┘
       ↓
┌─────────────┐
│   Deploy    │
│ (Production)│
└─────────────┘
```

### GitHub Actions Workflow

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: firebase deploy
```

---

## 📊 Monitoramento

### Métricas Coletadas

1. **Performance**
   - Page load time
   - Time to interactive
   - First contentful paint

2. **Erros**
   - JavaScript errors
   - API errors
   - Network errors

3. **Uso**
   - Active users
   - Feature usage
   - User flows

### Ferramentas

- Firebase Analytics
- Firebase Performance Monitoring
- Firebase Crashlytics
- Google Analytics

---

## 🔮 Escalabilidade

### Horizontal Scaling

- Cloud Functions auto-scale
- Firestore auto-scale
- CDN para assets estáticos

### Vertical Scaling

- Otimização de queries
- Indexes apropriados
- Caching estratégico

### Load Balancing

- Firebase Hosting CDN
- Cloud Run auto-scaling
- Rate limiting

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

### Backend
- Firebase (Firestore, Storage, Auth, Functions, Hosting)
- Node.js
- Express

### IA/ML
- YOLOv8 (Ultralytics)
- OpenAI GPT-4
- Web Speech API
- Python + PyTorch

### DevOps
- GitHub Actions
- Docker
- Firebase CLI

---

## 📚 Referências

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [YOLOv8](https://docs.ultralytics.com)

---

**Versão**: 2.1.0  
**Data**: 17 de Janeiro de 2025  
**Autor**: Torq AI Team  

**ARQUITETURA SÓLIDA E ESCALÁVEL! 🏗️🚀**
