# 🗄️ FIRESTORE SCHEMA - TORQ AI FEATURES

## 📊 Collection: `diagnostics`

**Path**: `/empresas/{empresaId}/diagnostics/{diagnosisId}`

### Structure
```typescript
interface Diagnosis {
  id: string;
  empresaId: string;
  vehicleId: string;
  clientId: string;
  
  // Images and detections
  images: DiagnosisImage[];
  
  // Summary
  summary: {
    totalDamages: number;
    estimatedCost: number;
    needsHumanReview: boolean;
    confidence: number; // 0-1
  };
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reviewed';
  error?: string;
  
  // Metadata
  createdAt: Timestamp;
  completedAt?: Timestamp;
  reviewedAt?: Timestamp;
  createdBy: string;
  reviewedBy?: string;
  
  // Source
  source: 'manual_upload' | 'checkin' | 'mobile_app';
  
  // Notes
  notes?: string;
  internalNotes?: string;
}

interface DiagnosisImage {
  id: string;
  original: string; // Storage URL
  annotated: string; // Storage URL with bounding boxes
  thumbnail: string; // Compressed version
  
  detections: Detection[];
  
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number; // bytes
    uploadedAt: Timestamp;
  };
}

interface Detection {
  id: string;
  label: DamageType;
  confidence: number; // 0-1
  bbox: [number, number, number, number]; // [x, y, width, height]
  severity: 'low' | 'medium' | 'high';
  estimatedCost?: number;
  description?: string;
  
  // Human review
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  corrected: boolean;
  correctedLabel?: DamageType;
}

type DamageType = 
  | 'broken_glass'
  | 'broken_light'
  | 'bumper_damage'
  | 'dent'
  | 'scratch'
  | 'rust'
  | 'paint_damage'
  | 'flat_tire'
  | 'tire_wear'
  | 'mirror_damage'
  | 'door_damage'
  | 'hood_damage'
  | 'trunk_damage'
  | 'wheel_damage'
  | 'other';
```

### Indexes
```javascript
// Composite indexes needed
diagnostics:
  - empresaId, createdAt (desc)
  - empresaId, vehicleId, createdAt (desc)
  - empresaId, clientId, createdAt (desc)
  - empresaId, status, createdAt (desc)
  - empresaId, needsHumanReview, createdAt (desc)
```

### Example Document
```json
{
  "id": "diag_abc123",
  "empresaId": "empresa_xyz",
  "vehicleId": "vehicle_456",
  "clientId": "client_789",
  "images": [
    {
      "id": "img_001",
      "original": "gs://bucket/empresas/xyz/diagnostics/abc123/original_001.jpg",
      "annotated": "gs://bucket/empresas/xyz/diagnostics/abc123/annotated_001.jpg",
      "thumbnail": "gs://bucket/empresas/xyz/diagnostics/abc123/thumb_001.jpg",
      "detections": [
        {
          "id": "det_001",
          "label": "dent",
          "confidence": 0.92,
          "bbox": [120, 340, 80, 60],
          "severity": "medium",
          "estimatedCost": 350,
          "description": "Amassado lateral direito",
          "reviewed": false,
          "corrected": false
        },
        {
          "id": "det_002",
          "label": "scratch",
          "confidence": 0.87,
          "bbox": [200, 400, 150, 20],
          "severity": "low",
          "estimatedCost": 150,
          "description": "Arranhão superficial",
          "reviewed": false,
          "corrected": false
        }
      ],
      "metadata": {
        "width": 1920,
        "height": 1080,
        "format": "jpeg",
        "size": 2456789,
        "uploadedAt": "2025-01-13T10:30:00Z"
      }
    }
  ],
  "summary": {
    "totalDamages": 2,
    "estimatedCost": 500,
    "needsHumanReview": false,
    "confidence": 0.895
  },
  "status": "completed",
  "createdAt": "2025-01-13T10:30:00Z",
  "completedAt": "2025-01-13T10:30:45Z",
  "createdBy": "user_123",
  "source": "manual_upload"
}
```

---

## 📊 Collection: `voice_transcriptions`

**Path**: `/empresas/{empresaId}/voice_transcriptions/{transcriptionId}`

### Structure
```typescript
interface VoiceTranscription {
  id: string;
  empresaId: string;
  
  // Audio
  audioUrl?: string; // Storage URL (optional, deleted after processing)
  duration: number; // seconds
  
  // Transcription
  transcript: string;
  language: string; // 'pt-BR'
  confidence: number; // 0-1
  
  // Extracted entities
  entities: {
    services: string[];
    parts: Array<{
      name: string;
      quantity: number;
      position?: string;
    }>;
    price?: number;
    client?: string;
    vehicle?: string;
    date?: string;
  };
  
  // Budget creation
  budgetId?: string;
  budgetCreated: boolean;
  
  // Status
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  
  // Metadata
  createdAt: Timestamp;
  completedAt?: Timestamp;
  createdBy: string;
  
  // Source
  source: 'web_speech_api' | 'whisper' | 'mobile';
}
```

### Example Document
```json
{
  "id": "trans_abc123",
  "empresaId": "empresa_xyz",
  "duration": 12.5,
  "transcript": "Troca de óleo e filtro do Palio do cliente João Silva, duzentos e cinquenta reais",
  "language": "pt-BR",
  "confidence": 0.94,
  "entities": {
    "services": ["oil_change", "filter_replacement"],
    "parts": [],
    "price": 250,
    "client": "João Silva",
    "vehicle": "Fiat Palio"
  },
  "budgetId": "budget_456",
  "budgetCreated": true,
  "status": "completed",
  "createdAt": "2025-01-13T11:00:00Z",
  "completedAt": "2025-01-13T11:00:05Z",
  "createdBy": "user_123",
  "source": "web_speech_api"
}
```

---

## 📊 Collection: `voice_mappings`

**Path**: `/empresas/{empresaId}/voice_mappings/default`

### Structure
```typescript
interface VoiceMappings {
  empresaId: string;
  
  services: Record<string, string>; // "troca de óleo" -> "oil_change"
  parts: Record<string, string>; // "filtro de ar" -> "air_filter"
  vehicles: Record<string, string>; // "palio" -> "Fiat Palio"
  
  // Custom patterns
  customPatterns: {
    services: string[];
    parts: string[];
  };
  
  // Metadata
  version: number;
  updatedAt: Timestamp;
  updatedBy: string;
}
```

---

## 📊 Collection: `mechanic_guides`

**Path**: `/mechanic_guides/{guideId}` (global, não por empresa)

### Structure
```typescript
interface MechanicGuide {
  id: string;
  service: string; // "oil_change", "brake_pad_replacement", etc.
  
  // Content
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // minutes
  
  // Requirements
  tools: string[];
  parts: string[];
  skills: string[];
  
  // Steps
  steps: Array<{
    order: number;
    title: string;
    description: string;
    image?: string; // Storage URL
    video?: string; // YouTube URL
    warning?: string;
    tip?: string;
  }>;
  
  // Safety
  safetyWarnings: string[];
  
  // Sources
  sources: Array<{
    name: string;
    url: string;
    license: string;
    type: 'manual' | 'video' | 'article' | 'course';
  }>;
  
  // Metadata
  version: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  
  // Stats
  views: number;
  helpful: number;
  notHelpful: number;
}
```

### Example Document
```json
{
  "id": "guide_oil_change",
  "service": "oil_change",
  "title": "Troca de Óleo - Guia Completo",
  "description": "Aprenda a trocar o óleo do motor de forma segura e eficiente",
  "difficulty": "easy",
  "duration": 30,
  "tools": ["Chave de filtro", "Bandeja coletora", "Funil", "Pano"],
  "parts": ["Óleo motor", "Filtro de óleo", "Arruela de vedação"],
  "skills": ["Básico de mecânica"],
  "steps": [
    {
      "order": 1,
      "title": "Preparação",
      "description": "Aqueça o motor por 5 minutos e desligue",
      "warning": "Motor quente! Use luvas de proteção",
      "tip": "Óleo quente flui melhor"
    },
    {
      "order": 2,
      "title": "Drenar óleo usado",
      "description": "Remova o bujão de drenagem e aguarde",
      "image": "gs://bucket/guides/oil_change/step2.jpg"
    }
  ],
  "safetyWarnings": [
    "Use óculos de proteção",
    "Trabalhe em superfície plana",
    "Descarte óleo usado corretamente"
  ],
  "sources": [
    {
      "name": "SENAI - Manutenção Automotiva",
      "url": "https://senai.br/cursos/manutencao",
      "license": "CC BY-NC-SA 4.0",
      "type": "course"
    }
  ],
  "version": 1,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z",
  "createdBy": "system",
  "views": 1250,
  "helpful": 980,
  "notHelpful": 45
}
```

---

## 📊 Collection: `vehicle_history_cache`

**Path**: `/vehicle_history_cache/{placa}` (global, compartilhado)

### Structure
```typescript
interface VehicleHistoryCache {
  placa: string;
  
  data: {
    recalls: Array<{
      date: string;
      description: string;
      manufacturer: string;
      severity: 'low' | 'medium' | 'high';
      resolved: boolean;
    }>;
    
    sinistros: Array<{
      date: string;
      type: string;
      severity: string;
      source: string;
    }>;
    
    leiloes: Array<{
      date: string;
      leilao: string;
      lote: string;
      valor: number;
    }>;
    
    restricoes: Array<{
      type: string;
      description: string;
      date: string;
    }>;
  };
  
  // Sources
  sources: string[];
  
  // Cache metadata
  cachedAt: Timestamp;
  expiresAt: Timestamp;
  ttl: number; // seconds
  
  // Stats
  hits: number;
  lastAccessedAt: Timestamp;
}
```

---

## 📊 Collection: `cost_analysis`

**Path**: `/empresas/{empresaId}/cost_analysis/{analysisId}`

### Structure
```typescript
interface CostAnalysis {
  id: string;
  empresaId: string;
  
  // Period
  period: {
    start: Timestamp;
    end: Timestamp;
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  
  // Metrics
  metrics: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number; // percentage
    
    // By service
    byService: Array<{
      serviceId: string;
      serviceName: string;
      count: number;
      revenue: number;
      cost: number;
      profit: number;
      margin: number;
    }>;
    
    // By client
    byClient: Array<{
      clientId: string;
      clientName: string;
      count: number;
      revenue: number;
      avgTicket: number;
    }>;
    
    // Trends
    trends: {
      revenueGrowth: number; // percentage
      profitGrowth: number;
      clientGrowth: number;
    };
  };
  
  // Metadata
  generatedAt: Timestamp;
  generatedBy: string;
}
```

---

## 🔐 FIRESTORE SECURITY RULES

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserEmpresaId() {
      return request.auth.token.empresaId;
    }
    
    function getUserRole() {
      return request.auth.token.role;
    }
    
    function belongsToUserEmpresa(empresaId) {
      return isAuthenticated() && getUserEmpresaId() == empresaId;
    }
    
    function isValidEmpresaId() {
      return request.resource.data.empresaId == getUserEmpresaId();
    }
    
    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }
    
    function hasRole(role) {
      return isAuthenticated() && getUserRole() == role;
    }
    
    // DIAGNOSTICS
    match /empresas/{empresaId}/diagnostics/{diagId} {
      allow read: if belongsToUserEmpresa(empresaId);
      allow create: if belongsToUserEmpresa(empresaId) && 
                       (hasRole('admin') || hasRole('atendente')) &&
                       isValidEmpresaId();
      allow update: if belongsToUserEmpresa(empresaId) && 
                       request.resource.data.empresaId == resource.data.empresaId;
      allow delete: if belongsToUserEmpresa(empresaId) && isAdmin();
    }
    
    // VOICE TRANSCRIPTIONS
    match /empresas/{empresaId}/voice_transcriptions/{transId} {
      allow read: if belongsToUserEmpresa(empresaId);
      allow create: if belongsToUserEmpresa(empresaId) && 
                       (hasRole('admin') || hasRole('atendente')) &&
                       isValidEmpresaId();
      allow update: if belongsToUserEmpresa(empresaId);
      allow delete: if belongsToUserEmpresa(empresaId) && isAdmin();
    }
    
    // VOICE MAPPINGS
    match /empresas/{empresaId}/voice_mappings/{mappingId} {
      allow read: if belongsToUserEmpresa(empresaId);
      allow write: if belongsToUserEmpresa(empresaId) && isAdmin();
    }
    
    // MECHANIC GUIDES (global, read-only)
    match /mechanic_guides/{guideId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only backend can write
    }
    
    // VEHICLE HISTORY CACHE (global, shared)
    match /vehicle_history_cache/{placa} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if false;
    }
    
    // COST ANALYSIS
    match /empresas/{empresaId}/cost_analysis/{analysisId} {
      allow read: if belongsToUserEmpresa(empresaId) && 
                     (hasRole('admin') || hasRole('financeiro'));
      allow write: if false; // Only backend can write
    }
  }
}
```

---

## 📝 MIGRATION SCRIPTS

### Create Indexes
```bash
# Run this after deploying
firebase firestore:indexes

# Or manually create in Firebase Console:
# - empresas/{empresaId}/diagnostics: empresaId, createdAt DESC
# - empresas/{empresaId}/diagnostics: empresaId, status, createdAt DESC
# - empresas/{empresaId}/diagnostics: empresaId, vehicleId, createdAt DESC
```

### Seed Mechanic Guides
```javascript
// scripts/seedMechanicGuides.js
const admin = require('firebase-admin');
admin.initializeApp();

const guides = [
  {
    id: 'guide_oil_change',
    service: 'oil_change',
    title: 'Troca de Óleo - Guia Completo',
    // ... (see example above)
  },
  // Add more guides
];

async function seed() {
  const db = admin.firestore();
  const batch = db.batch();
  
  guides.forEach(guide => {
    const ref = db.collection('mechanic_guides').doc(guide.id);
    batch.set(ref, {
      ...guide,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      views: 0,
      helpful: 0,
      notHelpful: 0
    });
  });
  
  await batch.commit();
  console.log(`✅ Seeded ${guides.length} mechanic guides`);
}

seed().catch(console.error);
```

---

**Última atualização**: 2025-01-13
**Status**: ✅ Schema definido e documentado
