# Auto Diagnóstico Visual - Requirements

## Objetivo
Implementar sistema de detecção automática de danos em veículos usando visão computacional (YOLOv8) integrado ao Firebase.

## Funcionalidades Core

### 1. Upload de Imagem/Vídeo
- Upload via drag-and-drop ou seleção de arquivo
- Suporte para múltiplas imagens (até 5 por análise)
- Preview antes do processamento
- Compressão automática para otimizar storage

### 2. Detecção de Danos
- **Tipos de danos detectados:**
  - `dent` - Amassados
  - `scratch` - Arranhões
  - `broken_light` - Faróis/lanternas quebrados
  - `flat_tire` - Pneu furado/careca
  - `bumper_damage` - Danos no para-choque
  - `broken_glass` - Vidros quebrados
  - `rust` - Ferrugem
  - `paint_damage` - Danos na pintura

### 3. Processamento
- Cloud Function processa imagem via YOLOv8
- Threshold configurável (default: 0.45)
- Retorna bounding boxes + labels + scores
- Gera imagem anotada com marcações

### 4. Relatório Visual
- Imagem original vs anotada (side-by-side)
- Lista de danos detectados com confiança
- Sugestão de serviços baseado nos danos
- Estimativa de custo (baseado em histórico)
- Flag para "verificação humana" se confiança < 0.5

## Integração com Sistema Existente

### Localização no UI
- **Card do Veículo** (/clients): Botão "📸 Analisar Foto"
- **Modal de Check-in**: Ação rápida "Diagnóstico Visual"
- **Página de Orçamentos**: Link para análise antes de criar orçamento

### Firestore Schema

```javascript
// Collection: diagnostics
{
  id: string,
  vehicleId: string,
  clientId: string,
  empresaId: string,
  createdAt: timestamp,
  createdBy: string,
  images: [{
    original: string, // Storage URL
    annotated: string, // Storage URL
    detections: [{
      label: string,
      confidence: number,
      bbox: [x, y, w, h],
      severity: 'low' | 'medium' | 'high'
    }]
  }],
  summary: {
    totalDamages: number,
    needsHumanReview: boolean,
    estimatedCost: number,
    suggestedServices: [serviceId]
  },
  status: 'processing' | 'completed' | 'failed',
  reviewedBy: string | null,
  reviewedAt: timestamp | null
}
```

## Datasets para Treinamento

### Fontes Públicas
1. **Kaggle Car Damage Detection**
   - URL: https://www.kaggle.com/datasets/anujms/car-damage-detection
   - ~1000 imagens com bounding boxes

2. **Vehicle Visual Inspection**
   - URL: https://www.kaggle.com/datasets/lplenka/coco-car-damage-detection-dataset
   - COCO format, múltiplas categorias

3. **Custom Dataset (a criar)**
   - Fotos reais dos clientes (com consentimento)
   - Rotulação via human-in-the-loop

## Requisitos Técnicos

### Frontend
- React component: `DiagnosisUploader.jsx`
- Hook: `useDiagnosis.js`
- Service: `diagnosisService.js`

### Backend
- Cloud Function: `processVehicleImage`
- Cloud Run container: YOLOv8 detector
- Storage bucket: `vehicle-diagnostics/`

### Segurança
- Apenas usuários autenticados
- Verificar ownership do veículo
- Criptografar dados sensíveis
- Audit log de todas análises

## Critérios de Aceitação

✅ Upload de imagem funcional com preview
✅ Processamento em < 30s para CPU baseline
✅ Detecção com accuracy > 75% (validado com test set)
✅ Imagem anotada gerada corretamente
✅ Relatório visual completo e legível
✅ Integração com orçamentos funcionando
✅ Testes E2E passando
✅ Documentação completa

## Limitações Conhecidas

⚠️ Detecção pode falhar com:
- Iluminação muito baixa
- Ângulos extremos
- Sujeira pesada (falso positivo)
- Danos muito pequenos (< 2cm)

## Próximos Passos (Fase 2)
- Detecção de peças específicas (capô, porta, etc)
- Estimativa de custo mais precisa com IA
- Comparação com fotos anteriores (histórico)
- Detecção de modificações não autorizadas
