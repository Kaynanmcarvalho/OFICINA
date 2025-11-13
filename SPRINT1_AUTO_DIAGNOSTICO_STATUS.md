# 🚀 SPRINT 1: AUTO DIAGNÓSTICO VISUAL - STATUS

## ✅ IMPLEMENTADO ATÉ AGORA

### 1. Documentação e Planejamento
- ✅ **TORQ_AI_MASTER_PLAN.md** - Plano mestre completo com 7 sprints
- ✅ **FIRESTORE_SCHEMA_AI.md** - Schema detalhado de todas as collections
- ✅ **ROADMAP_IA_TORQ.md** - Roadmap original do produto
- ✅ Specs completas em `.kiro/specs/auto-diagnostico-visual/`

### 2. Backend (Cloud Functions)
- ✅ **functions/processVehicleImage/index.js** - Function completa
  - Trigger: Storage upload
  - Processamento de imagens
  - Integração com YOLOv8 detector
  - Geração de imagens anotadas
  - Cálculo de summary e custos
  - Atualização do Firestore
- ✅ **functions/processVehicleImage/package.json** - Dependências

### 3. Frontend (React Components)
- ✅ **src/components/diagnosis/DiagnosisUploader.jsx** - Upload de imagens
- ✅ **src/components/diagnosis/DiagnosisResults.jsx** - Exibição de resultados
- ✅ **src/services/diagnosisService.js** - Service layer
- ✅ **src/hooks/useDiagnosis.js** - Custom hook

### 4. Firestore Schema
- ✅ Collection `diagnostics` definida
- ✅ Security Rules documentadas
- ✅ Indexes necessários listados

---

## 🔴 PENDENTE PARA COMPLETAR SPRINT 1

### 1. YOLOv8 Detector (CRÍTICO)
**Status**: ⚠️ NÃO IMPLEMENTADO

Precisamos criar o serviço de detecção que será chamado pela Cloud Function:

#### Opção A: Cloud Run (Recomendado para produção)
```
functions/yolov8-detector/
├── Dockerfile
├── requirements.txt
├── detector.py
├── model/
│   └── best.pt (modelo treinado)
└── README.md
```

#### Opção B: Local/Development
- Servidor Flask/FastAPI local
- Para testes e desenvolvimento

**Tarefas**:
1. ⬜ Criar Dockerfile para YOLOv8
2. ⬜ Implementar API REST (FastAPI)
3. ⬜ Treinar/ajustar modelo com datasets
4. ⬜ Deploy para Cloud Run
5. ⬜ Configurar variável de ambiente `YOLOV8_DETECTOR_URL`

### 2. Datasets e Treinamento
**Status**: ⚠️ NÃO INICIADO

**Datasets sugeridos**:
- Kaggle Car Damage Detection: https://www.kaggle.com/datasets/anujms/car-damage-detection
- Vehicle Visual Inspection: https://www.kaggle.com/datasets/lplenka/coco-car-damage-detection-dataset
- Roboflow Car Damage: https://universe.roboflow.com/car-damage-detection

**Tarefas**:
1. ⬜ Baixar e preparar datasets
2. ⬜ Treinar modelo YOLOv8
3. ⬜ Validar accuracy (target: >85%)
4. ⬜ Ajustar thresholds
5. ⬜ Documentar métricas (confusion matrix)

### 3. Integração com /clients
**Status**: ⬜ NÃO INICIADO

**Tarefas**:
1. ⬜ Adicionar botão "Analisar Foto" no card do veículo
2. ⬜ Integrar DiagnosisUploader no modal do veículo
3. ⬜ Exibir histórico de diagnósticos
4. ⬜ Badge de status no card

### 4. Testes
**Status**: ⬜ NÃO INICIADO

**Tarefas**:
1. ⬜ Unit tests (Jest)
   - diagnosisService.js
   - useDiagnosis.js
   - Funções utilitárias
2. ⬜ Integration tests (Firebase Emulator)
   - Upload → Firestore
   - Function trigger
   - Storage operations
3. ⬜ E2E tests (Cypress)
   - Fluxo completo de diagnóstico
   - Upload de múltiplas imagens
   - Visualização de resultados
4. ⬜ Load tests (k6)
   - Processamento de imagens
   - Concorrência

### 5. Documentação
**Status**: 🟡 PARCIAL

**Tarefas**:
1. ⬜ README.md do detector
2. ⬜ Guia de deploy
3. ⬜ Guia de uso para usuários
4. ⬜ API documentation
5. ⬜ Troubleshooting guide

---

## 📊 PROGRESSO SPRINT 1

```
███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 15%

Concluído: 15%
Em andamento: 0%
Pendente: 85%
```

### Breakdown por Tarefa:
- ✅ Planejamento e documentação: 100%
- ✅ Cloud Function base: 100%
- ✅ Frontend components: 100%
- ⬜ YOLOv8 Detector: 0%
- ⬜ Datasets e treinamento: 0%
- ⬜ Integração /clients: 0%
- ⬜ Testes: 0%
- 🟡 Documentação: 40%

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### Passo 1: Criar YOLOv8 Detector (PRIORIDADE MÁXIMA)
```bash
# 1. Criar estrutura
mkdir -p functions/yolov8-detector
cd functions/yolov8-detector

# 2. Criar arquivos
touch Dockerfile
touch requirements.txt
touch detector.py
touch README.md

# 3. Implementar detector
# (ver código abaixo)

# 4. Build e test local
docker build -t yolov8-detector .
docker run -p 8080:8080 yolov8-detector

# 5. Deploy para Cloud Run
gcloud run deploy yolov8-detector \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Passo 2: Baixar e Preparar Datasets
```bash
# 1. Instalar Kaggle CLI
pip install kaggle

# 2. Configurar credenciais
# (baixar kaggle.json do Kaggle)

# 3. Baixar datasets
kaggle datasets download -d anujms/car-damage-detection
kaggle datasets download -d lplenka/coco-car-damage-detection-dataset

# 4. Extrair e organizar
unzip car-damage-detection.zip -d datasets/car-damage
unzip coco-car-damage-detection-dataset.zip -d datasets/coco-car
```

### Passo 3: Treinar Modelo
```python
# train.py
from ultralytics import YOLO

# Load a model
model = YOLO('yolov8n.pt')  # nano model for speed

# Train the model
results = model.train(
    data='car_damage.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    device='cpu',  # or 'cuda' if GPU available
    patience=20,
    save=True,
    project='runs/train',
    name='car_damage_detector'
)

# Validate
metrics = model.val()
print(f"mAP50: {metrics.box.map50}")
print(f"mAP50-95: {metrics.box.map}")

# Export
model.export(format='onnx')  # for faster inference
```

### Passo 4: Integrar em /clients
```javascript
// src/pages/ClientsPage.jsx
import DiagnosisUploader from '../components/diagnosis/DiagnosisUploader';

// No card do veículo, adicionar:
<button onClick={() => setShowDiagnosisModal(true)}>
  <Camera className="w-4 h-4" />
  Analisar Foto
</button>

// Modal:
{showDiagnosisModal && (
  <DiagnosisUploader
    vehicleId={vehicle.id}
    clientId={client.id}
    onClose={() => setShowDiagnosisModal(false)}
    onComplete={(diagnosis) => {
      // Atualizar UI
      toast.success('Análise concluída!');
    }}
  />
)}
```

---

## 🔧 CÓDIGO DO DETECTOR (YOLOv8)

### Dockerfile
```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Download model (or copy pre-trained)
# RUN python download_model.py

# Expose port
EXPOSE 8080

# Run
CMD ["uvicorn", "detector:app", "--host", "0.0.0.0", "--port", "8080"]
```

### requirements.txt
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
ultralytics==8.0.200
opencv-python-headless==4.8.1.78
pillow==10.1.0
numpy==1.24.3
pydantic==2.5.0
```

### detector.py
```python
"""
YOLOv8 Car Damage Detector API
FastAPI service for detecting vehicle damages
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO
import base64
import numpy as np
import cv2
from io import BytesIO
from PIL import Image
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="YOLOv8 Car Damage Detector")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
MODEL_PATH = "model/best.pt"  # or "yolov8n.pt" for pretrained
try:
    model = YOLO(MODEL_PATH)
    logger.info(f"✅ Model loaded: {MODEL_PATH}")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    model = None

# Damage classes
DAMAGE_CLASSES = {
    0: "broken_glass",
    1: "broken_light",
    2: "bumper_damage",
    3: "dent",
    4: "scratch",
    5: "rust",
    6: "paint_damage",
    7: "flat_tire",
    8: "tire_wear",
    9: "mirror_damage"
}

class DetectionRequest(BaseModel):
    image: str  # base64 encoded
    confidence_threshold: float = 0.45

class Detection(BaseModel):
    label: str
    confidence: float
    bbox: list[float]  # [x, y, width, height]

class DetectionResponse(BaseModel):
    detections: list[Detection]
    processing_time: float

@app.get("/")
async def root():
    return {
        "service": "YOLOv8 Car Damage Detector",
        "version": "1.0.0",
        "status": "ok" if model else "model_not_loaded"
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy" if model else "unhealthy",
        "model_loaded": model is not None
    }

@app.post("/detect", response_model=DetectionResponse)
async def detect(request: DetectionRequest):
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image)
        image = Image.open(BytesIO(image_data))
        image_np = np.array(image)
        
        # Convert RGB to BGR for OpenCV
        if len(image_np.shape) == 3 and image_np.shape[2] == 3:
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        
        logger.info(f"Processing image: {image_np.shape}")
        
        # Run inference
        results = model(image_np, conf=request.confidence_threshold)
        
        # Parse results
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Get box coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                w = x2 - x1
                h = y2 - y1
                
                # Get class and confidence
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                
                # Map class to label
                label = DAMAGE_CLASSES.get(cls, f"unknown_{cls}")
                
                detections.append(Detection(
                    label=label,
                    confidence=conf,
                    bbox=[x1, y1, w, h]
                ))
        
        logger.info(f"✅ Detected {len(detections)} damages")
        
        return DetectionResponse(
            detections=detections,
            processing_time=results[0].speed['inference']
        )
        
    except Exception as e:
        logger.error(f"❌ Detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

---

## 📝 NOTAS IMPORTANTES

### Sobre o Modelo YOLOv8
- **Versão recomendada**: YOLOv8n (nano) para CPU
- **Versão alternativa**: YOLOv8s (small) se GPU disponível
- **Treinamento**: Mínimo 100 epochs, idealmente 200+
- **Dataset**: Mínimo 1000 imagens anotadas
- **Accuracy target**: mAP50 > 0.85

### Sobre Cloud Run
- **Memória**: 2GB mínimo (4GB recomendado)
- **CPU**: 2 vCPUs
- **Timeout**: 300s (5 minutos)
- **Concurrency**: 1 (processamento pesado)
- **Cold start**: ~10-15s (aceitável)

### Sobre Custos
- **Cloud Run**: ~$0.10 por 1000 requisições
- **Storage**: ~$0.02 por GB/mês
- **Firestore**: Grátis até 50k reads/day
- **Estimativa mensal**: $20-50 para 1000 diagnósticos/mês

---

## 🎯 CRITÉRIOS DE ACEITAÇÃO SPRINT 1

- ✅ Schema Firestore definido e documentado
- ✅ Cloud Function implementada
- ✅ Frontend components criados
- ⬜ YOLOv8 detector funcionando (local ou Cloud Run)
- ⬜ Accuracy > 85% em dataset de teste
- ⬜ Tempo de processamento < 30s
- ⬜ Integração completa em /clients
- ⬜ Testes E2E passando
- ⬜ Documentação completa

---

**Última atualização**: 2025-01-13
**Responsável**: Claude 4.5 (Kiro AI)
**Status**: 🟡 15% concluído - Detector YOLOv8 é próximo passo crítico
