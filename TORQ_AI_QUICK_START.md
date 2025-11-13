# 🚀 Torq AI - Quick Start Guide

## O Que Foi Implementado

### ✅ Documentação Completa
- Roadmap de 20 sprints
- Specs detalhadas do Auto Diagnóstico Visual
- Arquitetura e design system
- Tasks com estimativas

### ✅ Código Base Implementado

#### Backend
- `functions/processVehicleImage/index.js` - Cloud Function completa
  - Trigger on Storage upload
  - Integração com YOLOv8
  - Geração de imagem anotada
  - Cálculo de severidade e custos

#### Frontend
- `src/components/diagnosis/DiagnosisUploader.jsx` - Componente de upload
  - Drag & drop
  - Preview de imagens
  - Compressão automática
  - Progress tracking
  
- `src/services/diagnosisService.js` - Service completo
  - Upload para Storage
  - CRUD de diagnósticos
  - Real-time listeners
  
- `src/hooks/useDiagnosis.js` - Hook customizado
  - Estado gerenciado
  - Error handling
  - Real-time updates

---

## 🎯 Próximos Passos para Deploy

### 1. Setup Firebase (15 min)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto
firebase init

# Selecionar:
# - Firestore
# - Functions
# - Storage
# - Hosting
```

### 2. Criar Collections no Firestore (5 min)

Acesse Firebase Console → Firestore Database → Create collection:

```
diagnostics/
├── id (auto)
├── vehicleId (string)
├── clientId (string)
├── empresaId (string)
├── createdBy (string)
├── createdAt (timestamp)
├── status (string)
├── images (array)
└── summary (map)
```

### 3. Configurar Storage Bucket (5 min)

```bash
# Criar bucket
gsutil mb gs://torq-vehicle-diagnostics

# Configurar CORS
echo '[{"origin": ["*"], "method": ["GET", "POST"], "maxAgeSeconds": 3600}]' > cors.json
gsutil cors set cors.json gs://torq-vehicle-diagnostics
```

### 4. Deploy Cloud Function (10 min)

```bash
cd functions/processVehicleImage/

# Instalar dependências
npm install firebase-functions firebase-admin axios sharp @google-cloud/storage

# Deploy
firebase deploy --only functions:processVehicleImage
```

### 5. Setup Cloud Run (YOLOv8) (30 min)

**Criar `cloud-run/yolov8-detector/Dockerfile`:**

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir \
    flask \
    ultralytics \
    opencv-python-headless \
    pillow \
    numpy

# Copy model (você precisa treinar primeiro)
COPY model.pt .
COPY app.py .

EXPOSE 8080

CMD ["python", "app.py"]
```

**Criar `cloud-run/yolov8-detector/app.py`:**

```python
from flask import Flask, request, jsonify
from ultralytics import YOLO
import base64
import io
from PIL import Image
import numpy as np

app = Flask(__name__)

# Load model
model = YOLO('model.pt')

@app.route('/detect', methods=['POST'])
def detect():
    try:
        data = request.json
        image_b64 = data['image']
        confidence_threshold = data.get('confidence_threshold', 0.45)
        
        # Decode image
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Run detection
        results = model(image, conf=confidence_threshold)
        
        # Parse results
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                detections.append({
                    'label': model.names[int(box.cls)],
                    'confidence': float(box.conf),
                    'bbox': box.xyxy[0].tolist()
                })
        
        return jsonify({'detections': detections})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

**Deploy:**

```bash
cd cloud-run/yolov8-detector/

# Build
docker build -t gcr.io/YOUR_PROJECT_ID/yolov8-detector .

# Push
docker push gcr.io/YOUR_PROJECT_ID/yolov8-detector

# Deploy
gcloud run deploy yolov8-detector \
  --image gcr.io/YOUR_PROJECT_ID/yolov8-detector \
  --platform managed \
  --region us-central1 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 5 \
  --allow-unauthenticated
```

### 6. Configurar Environment Variables (5 min)

```bash
# Set Cloud Run URL in Functions
firebase functions:config:set \
  yolov8.detector_url="https://yolov8-detector-xxxxx.run.app"

# Redeploy functions
firebase deploy --only functions
```

### 7. Deploy Security Rules (5 min)

**Criar `firestore.rules`:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /diagnostics/{diagnosisId} {
      allow read: if request.auth != null 
        && (resource.data.empresaId == request.auth.token.empresaId
            || request.auth.token.role == 'super_admin');
      
      allow create: if request.auth != null
        && request.resource.data.empresaId == request.auth.token.empresaId;
      
      allow update, delete: if request.auth != null
        && resource.data.empresaId == request.auth.token.empresaId
        && (resource.data.createdBy == request.auth.uid
            || request.auth.token.role == 'admin');
    }
  }
}
```

```bash
firebase deploy --only firestore:rules
```

### 8. Integrar no Frontend (10 min)

**Adicionar botão no ClientCard:**

```jsx
// src/pages/clients/ClientCard.jsx
import { Camera } from 'lucide-react';
import { useState } from 'react';
import DiagnosisUploader from '../../components/diagnosis/DiagnosisUploader';

// ... dentro do componente
const [showDiagnosis, setShowDiagnosis] = useState(false);

// ... no JSX
<button
  onClick={() => setShowDiagnosis(true)}
  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
>
  <Camera className="w-4 h-4" />
  Analisar Foto
</button>

{showDiagnosis && (
  <Modal onClose={() => setShowDiagnosis(false)}>
    <DiagnosisUploader
      vehicleId={vehicle.id}
      clientId={client.id}
      onComplete={(diagnosisId) => {
        console.log('Diagnosis created:', diagnosisId);
        setShowDiagnosis(false);
      }}
    />
  </Modal>
)}
```

---

## 📊 Treinar Modelo YOLOv8

### 1. Baixar Datasets (30 min)

```bash
# Instalar Kaggle CLI
pip install kaggle

# Configurar credenciais
# Baixe kaggle.json de https://www.kaggle.com/settings
mkdir ~/.kaggle
mv kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json

# Baixar datasets
kaggle datasets download -d anujms/car-damage-detection
kaggle datasets download -d lplenka/coco-car-damage-detection-dataset

# Extrair
unzip car-damage-detection.zip -d datasets/car-damage
unzip coco-car-damage-detection-dataset.zip -d datasets/coco-car
```

### 2. Preparar Dados (1 hora)

```python
# prepare_dataset.py
from ultralytics import YOLO
import os
import shutil

# Converter para formato YOLO
# ... código de conversão ...

# Split train/val/test (70/20/10)
# ... código de split ...
```

### 3. Treinar Modelo (2-4 horas)

```python
# train.py
from ultralytics import YOLO

# Load pretrained model
model = YOLO('yolov8n.pt')  # nano model (fastest)

# Train
results = model.train(
    data='dataset.yaml',
    epochs=50,
    imgsz=640,
    batch=16,
    name='car_damage_detector',
    patience=10,
    save=True,
    device='cpu'  # ou 'cuda' se tiver GPU
)

# Validate
metrics = model.val()

# Export
model.export(format='torchscript')
```

### 4. Testar Modelo (30 min)

```python
# test.py
from ultralytics import YOLO
import cv2

model = YOLO('runs/detect/car_damage_detector/weights/best.pt')

# Test on image
results = model('test_image.jpg')

# Print results
for result in results:
    boxes = result.boxes
    print(f"Found {len(boxes)} damages")
    for box in boxes:
        print(f"- {model.names[int(box.cls)]}: {float(box.conf):.2f}")
```

---

## 🧪 Testar Sistema Completo

### 1. Teste Local (Frontend)

```bash
npm run dev
```

1. Acesse http://localhost:5173/clients
2. Clique em "Analisar Foto" em um veículo
3. Faça upload de uma imagem
4. Aguarde processamento
5. Visualize resultados

### 2. Teste Cloud Function

```bash
# Upload test image
gsutil cp test_image.jpg gs://torq-vehicle-diagnostics/test/

# Check logs
firebase functions:log --only processVehicleImage
```

### 3. Teste Cloud Run

```bash
# Test endpoint
curl -X POST https://yolov8-detector-xxxxx.run.app/detect \
  -H "Content-Type: application/json" \
  -d '{"image": "BASE64_IMAGE_HERE", "confidence_threshold": 0.45}'
```

---

## 📈 Monitoramento

### Firebase Console
- Firestore: Verificar documentos criados
- Storage: Verificar imagens uploaded
- Functions: Verificar execuções e logs

### Cloud Run Console
- Métricas de CPU/Memory
- Latência de requests
- Error rate

### Frontend
- Console do navegador
- Network tab (uploads)
- React DevTools

---

## 🐛 Troubleshooting

### Erro: "Function timeout"
- Aumentar timeout: `firebase functions:config:set timeout=300`
- Otimizar modelo (usar yolov8n ao invés de yolov8x)

### Erro: "Out of memory"
- Aumentar memória do Cloud Run: `--memory 4Gi`
- Reduzir tamanho da imagem antes de processar

### Erro: "Permission denied"
- Verificar Security Rules
- Verificar custom claims do usuário

---

## 💰 Custos Estimados

### Desenvolvimento (Mensal)
- Firebase: ~$50
- Cloud Run: ~$100
- Storage: ~$20
- **Total**: ~$170/mês

### Produção (Mensal - 1000 análises)
- Firebase: ~$100
- Cloud Run: ~$200
- Storage: ~$50
- **Total**: ~$350/mês

---

## 📚 Documentação Adicional

- [YOLOv8 Docs](https://docs.ultralytics.com/)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Cloud Run](https://cloud.google.com/run/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## ✅ Checklist de Deploy

- [ ] Firebase projeto criado
- [ ] Collections Firestore criadas
- [ ] Storage bucket configurado
- [ ] Datasets baixados
- [ ] Modelo YOLOv8 treinado
- [ ] Cloud Run deployado
- [ ] Cloud Function deployada
- [ ] Security Rules deployadas
- [ ] Frontend integrado
- [ ] Testes realizados
- [ ] Monitoramento configurado

---

**Última atualização**: 13/01/2025
**Versão**: 1.0.0
**Status**: Pronto para deploy
