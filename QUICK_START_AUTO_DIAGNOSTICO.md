# 🚀 QUICK START: Auto Diagnóstico Visual

Guia rápido para colocar o Auto Diagnóstico Visual funcionando em **15 minutos**.

---

## ⚡ OPÇÃO 1: Teste Local (Desenvolvimento)

### Passo 1: Instalar Dependências

```bash
# Python 3.10+
pip install fastapi uvicorn ultralytics opencv-python-headless pillow numpy

# Ou usar requirements.txt
cd functions/yolov8-detector
pip install -r requirements.txt
```

### Passo 2: Iniciar Detector

```bash
cd functions/yolov8-detector
python detector.py
```

Aguarde o modelo baixar (~6MB) e inicializar. Você verá:
```
✅ Model loaded successfully: yolov8n.pt
✅ Model warmed up
INFO:     Uvicorn running on http://0.0.0.0:8080
```

### Passo 3: Testar Detector

```bash
# Em outro terminal
python test_detector.py --image sample_car.jpg --url http://localhost:8080
```

### Passo 4: Configurar Cloud Function

```bash
# Editar functions/processVehicleImage/index.js
# Linha 18: Alterar DETECTOR_ENDPOINT
const DETECTOR_ENDPOINT = 'http://localhost:8080/detect';

# Deploy function (local emulator)
cd functions
firebase emulators:start --only functions
```

### Passo 5: Testar Frontend

```bash
# Iniciar frontend
npm run dev

# Abrir http://localhost:5173
# Navegar para /clients
# Fazer upload de imagem de teste
```

---

## ☁️ OPÇÃO 2: Deploy Produção (Cloud Run)

### Passo 1: Configurar GCloud

```bash
# Login
gcloud auth login

# Set project
gcloud config set project oficina-reparofacil

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Passo 2: Deploy Detector

```bash
cd functions/yolov8-detector

# Deploy to Cloud Run
gcloud run deploy yolov8-detector \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0

# Aguarde ~5 minutos para build e deploy
```

### Passo 3: Obter URL do Detector

```bash
DETECTOR_URL=$(gcloud run services describe yolov8-detector \
  --region us-central1 \
  --format 'value(status.url)')

echo "Detector URL: $DETECTOR_URL"
# Exemplo: https://yolov8-detector-xxxxx-uc.a.run.app
```

### Passo 4: Configurar Cloud Function

```bash
cd functions

# Set environment variable
firebase functions:config:set yolov8.detector_url="$DETECTOR_URL"

# Deploy function
firebase deploy --only functions:processVehicleImage

# Aguarde ~2 minutos
```

### Passo 5: Deploy Frontend

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting

# Aguarde ~1 minuto
```

### Passo 6: Testar End-to-End

```bash
# Abrir app
firebase open hosting:site

# Navegar para /clients
# Fazer upload de imagem
# Aguardar processamento (~20-30s)
# Visualizar resultados
```

---

## 🧪 TESTE RÁPIDO

### Teste 1: Health Check

```bash
curl https://yolov8-detector-xxxxx-uc.a.run.app/health
```

Resposta esperada:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_path": "yolov8n.pt",
  "confidence_threshold": 0.45
}
```

### Teste 2: Detecção com Imagem

```bash
# Criar request.json
cat > request.json << 'EOF'
{
  "image": "BASE64_IMAGE_HERE",
  "confidence_threshold": 0.45
}
EOF

# Chamar API
curl -X POST https://yolov8-detector-xxxxx-uc.a.run.app/detect \
  -H "Content-Type: application/json" \
  -d @request.json
```

### Teste 3: Upload de Arquivo

```bash
curl -X POST https://yolov8-detector-xxxxx-uc.a.run.app/detect/file \
  -F "file=@sample_car.jpg" \
  -F "confidence_threshold=0.5"
```

---

## 📊 VERIFICAR LOGS

### Cloud Run Logs

```bash
# Ver logs do detector
gcloud run services logs read yolov8-detector \
  --region us-central1 \
  --limit 50

# Seguir logs em tempo real
gcloud run services logs tail yolov8-detector \
  --region us-central1
```

### Cloud Functions Logs

```bash
# Ver logs da function
firebase functions:log --only processVehicleImage

# Ou no console
firebase open functions:log
```

### Frontend Logs

```bash
# Ver logs do hosting
firebase hosting:channel:list

# Ou no console do navegador
# F12 > Console
```

---

## 🐛 TROUBLESHOOTING

### Problema: Detector não inicia

```bash
# Verificar Python version
python --version  # Deve ser 3.10+

# Reinstalar dependências
pip install --upgrade -r requirements.txt

# Verificar porta
lsof -i :8080  # Deve estar livre
```

### Problema: Model not found

```bash
# Baixar modelo manualmente
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

# Verificar arquivo
ls -lh ~/.cache/ultralytics/
```

### Problema: Out of memory (Cloud Run)

```bash
# Aumentar memória
gcloud run services update yolov8-detector \
  --memory 8Gi \
  --region us-central1
```

### Problema: Timeout (Cloud Run)

```bash
# Aumentar timeout
gcloud run services update yolov8-detector \
  --timeout 600 \
  --region us-central1
```

### Problema: Cloud Function não encontra detector

```bash
# Verificar variável de ambiente
firebase functions:config:get

# Reconfigurar
firebase functions:config:set yolov8.detector_url="https://..."

# Redeploy
firebase deploy --only functions:processVehicleImage
```

---

## 📈 MONITORAMENTO

### Cloud Run Metrics

```bash
# Abrir dashboard
gcloud run services describe yolov8-detector \
  --region us-central1 \
  --format 'value(status.url)' | \
  xargs -I {} echo "https://console.cloud.google.com/run/detail/us-central1/yolov8-detector"
```

### Firebase Console

```bash
# Abrir console
firebase open

# Ver:
# - Functions > processVehicleImage > Logs
# - Firestore > diagnostics collection
# - Storage > vehicle-diagnostics folder
```

---

## 🎯 PRÓXIMOS PASSOS

### 1. Treinar Modelo Custom

```bash
# Ver: functions/yolov8-detector/README.md
# Seção: Training Custom Model
```

### 2. Integrar em /clients

```bash
# Ver: IMPLEMENTACAO_COMPLETA_SPRINT1.md
# Seção: Integração com /clients
```

### 3. Adicionar Testes

```bash
# Ver: SPRINT1_AUTO_DIAGNOSTICO_STATUS.md
# Seção: Testes
```

---

## 📚 RECURSOS

### Documentação
- [YOLOv8 Detector README](functions/yolov8-detector/README.md)
- [Firestore Schema](FIRESTORE_SCHEMA_AI.md)
- [Master Plan](TORQ_AI_MASTER_PLAN.md)

### Datasets
- [Kaggle Car Damage](https://www.kaggle.com/datasets/anujms/car-damage-detection)
- [COCO Car Damage](https://www.kaggle.com/datasets/lplenka/coco-car-damage-detection-dataset)
- [Roboflow](https://universe.roboflow.com/car-damage-detection)

### Suporte
- GitHub Issues
- Discord: #torq-ai
- Email: support@torq.ai

---

## ✅ CHECKLIST

- [ ] Python 3.10+ instalado
- [ ] Dependências instaladas
- [ ] Detector rodando localmente
- [ ] Teste local funcionando
- [ ] GCloud configurado
- [ ] Detector deployed no Cloud Run
- [ ] Cloud Function deployed
- [ ] Frontend deployed
- [ ] Teste end-to-end funcionando
- [ ] Logs verificados
- [ ] Monitoramento configurado

---

**Tempo estimado**: 15-30 minutos
**Dificuldade**: Fácil
**Última atualização**: 2025-01-13
