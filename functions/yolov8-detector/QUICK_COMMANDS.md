# ⚡ Quick Commands - YOLOv8 Detector

Comandos rápidos para uso diário do sistema.

## 🚀 Setup Inicial

```bash
# Instalar dependências
pip install -r requirements.txt

# Download datasets (escolha um)
./download_datasets.sh          # Linux/Mac
download_datasets.bat           # Windows
```

## 📊 Validação de Dados

```bash
# Validar dataset completo
python validate_dataset.py

# Validar dataset específico
python validate_dataset.py --data-dir datasets/custom-dataset
```

## 🎓 Treinamento

```bash
# Treinamento básico (YOLOv8s, 200 epochs)
python train.py

# Treinamento rápido (YOLOv8n, 100 epochs)
python train.py --model yolov8n.pt --epochs 100

# Treinamento de alta precisão (YOLOv8m, 300 epochs)
python train.py --model yolov8m.pt --epochs 300 --batch 8

# Treinamento com configurações customizadas
python train.py --epochs 200 --batch 16 --imgsz 640 --device cuda
```

## 📈 Análise de Resultados

```bash
# Análise completa (após treinamento)
python analyze_results.py

# Análise de treinamento específico
python analyze_results.py --results-dir runs/train/custom_run
```

## 🚀 Exportação

```bash
# Exportar para ONNX (recomendado)
python export_model.py --formats onnx

# Exportar para múltiplos formatos
python export_model.py --formats onnx tensorrt tflite

# Exportar todos os formatos
python export_model.py --formats all

# Exportar modelo específico
python export_model.py --model runs/train/custom/weights/best.pt --formats onnx
```

## ⚡ Benchmark

```bash
# Benchmark completo
python benchmark.py

# Benchmark de modelo específico
python benchmark.py --model runs/train/custom/weights/best.pt

# Benchmark com imagens customizadas
python benchmark.py --test-images datasets/custom/images/test

# Benchmark com output customizado
python benchmark.py --output custom_benchmark_results
```

## 🧪 Testes

```bash
# Testar detector localmente
python test_detector.py

# Iniciar servidor local
python detector.py

# Testar health endpoint
curl http://localhost:8080/health

# Testar detecção com imagem
curl -X POST http://localhost:8080/detect/file \
  -F "file=@test_image.jpg"
```

## 🐳 Docker

```bash
# Build imagem
docker build -t yolov8-detector .

# Run container
docker run -p 8080:8080 yolov8-detector

# Run com GPU
docker run --gpus all -p 8080:8080 yolov8-detector

# Run com modelo customizado
docker run -p 8080:8080 \
  -v $(pwd)/model:/app/model \
  -e MODEL_PATH=model/best.pt \
  yolov8-detector

# Ver logs
docker logs -f <container_id>

# Parar container
docker stop <container_id>
```

## ☁️ Google Cloud Run

```bash
# Configurar projeto
gcloud config set project oficina-reparofacil

# Deploy básico
gcloud run deploy yolov8-detector \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy com configurações customizadas
gcloud run deploy yolov8-detector \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0 \
  --set-env-vars MODEL_PATH=model/best.pt \
  --set-env-vars CONFIDENCE_THRESHOLD=0.45

# Ver URL do serviço
gcloud run services describe yolov8-detector \
  --region us-central1 \
  --format 'value(status.url)'

# Ver logs
gcloud run services logs read yolov8-detector \
  --region us-central1 \
  --limit 50

# Atualizar configuração
gcloud run services update yolov8-detector \
  --region us-central1 \
  --memory 8Gi \
  --set-env-vars CONFIDENCE_THRESHOLD=0.5

# Deletar serviço
gcloud run services delete yolov8-detector \
  --region us-central1
```

## 📊 Monitoramento

```bash
# Ver resultados de treinamento
ls -lh runs/train/car_damage_detector/

# Ver curvas de treinamento
open runs/train/car_damage_detector/results.png

# Ver matriz de confusão
open runs/train/car_damage_detector/confusion_matrix.png

# Ver predições de validação
open runs/train/car_damage_detector/val_batch0_pred.jpg

# Ver análise completa
open runs/train/car_damage_detector/training_analysis.png
open runs/train/car_damage_detector/training_analysis_report.md
```

## 🔧 Utilitários

```bash
# Verificar GPU
nvidia-smi

# Verificar instalação PyTorch
python -c "import torch; print(f'PyTorch: {torch.__version__}'); print(f'CUDA: {torch.cuda.is_available()}')"

# Verificar instalação YOLOv8
python -c "from ultralytics import YOLO; print('YOLOv8 OK')"

# Listar modelos disponíveis
ls -lh runs/train/*/weights/best.pt

# Verificar tamanho do modelo
du -h model/best.pt

# Limpar cache
rm -rf __pycache__
rm -rf .pytest_cache
```

## 📦 Gestão de Modelos

```bash
# Copiar melhor modelo para produção
cp runs/train/car_damage_detector/weights/best.pt model/best.pt

# Backup de modelo
cp model/best.pt model/best_backup_$(date +%Y%m%d).pt

# Comparar tamanhos de modelos
ls -lh runs/train/*/weights/best.pt

# Listar todos os checkpoints
find runs/train -name "*.pt" -type f
```

## 🧹 Limpeza

```bash
# Limpar runs antigos (manter último)
rm -rf runs/train/car_damage_detector[0-9]*

# Limpar cache de datasets
rm -rf datasets/*/cache

# Limpar resultados de benchmark
rm -rf benchmark_results/*

# Limpar exports
rm -rf exports/*

# Limpeza completa (CUIDADO!)
rm -rf runs/ exports/ benchmark_results/
```

## 📝 Logs e Debug

```bash
# Ver logs de treinamento
tail -f runs/train/car_damage_detector/train.log

# Ver logs do servidor
tail -f detector.log

# Debug mode
export LOG_LEVEL=debug
python detector.py

# Verbose training
python train.py --verbose
```

## 🔄 Workflow Completo (Copy-Paste)

```bash
# 1. Setup
pip install -r requirements.txt
./download_datasets.sh

# 2. Validar
python validate_dataset.py

# 3. Treinar
python train.py

# 4. Analisar
python analyze_results.py

# 5. Exportar
python export_model.py --formats onnx

# 6. Benchmark
python benchmark.py

# 7. Testar
python detector.py &
sleep 5
python test_detector.py

# 8. Deploy
docker build -t yolov8-detector .
gcloud run deploy yolov8-detector --source .
```

## 🎯 Comandos por Caso de Uso

### Desenvolvimento Rápido
```bash
python train.py --model yolov8n.pt --epochs 50 --batch 16
python analyze_results.py
python test_detector.py
```

### Produção de Alta Qualidade
```bash
python train.py --model yolov8m.pt --epochs 300 --batch 8
python analyze_results.py
python export_model.py --formats onnx tensorrt
python benchmark.py
```

### Teste e Validação
```bash
python validate_dataset.py
python test_detector.py
curl http://localhost:8080/health
```

### Deploy Rápido
```bash
docker build -t yolov8-detector .
docker run -p 8080:8080 yolov8-detector
```

## 🆘 Troubleshooting Rápido

```bash
# Out of Memory
python train.py --batch 4 --imgsz 416

# Slow Training
python train.py --device cuda --workers 8

# Low mAP
python train.py --epochs 300 --patience 50

# Slow Inference
python export_model.py --formats onnx
```

## 📱 Aliases Úteis (Adicionar ao .bashrc/.zshrc)

```bash
# Adicione ao seu shell config
alias yolo-train='python train.py'
alias yolo-analyze='python analyze_results.py'
alias yolo-export='python export_model.py --formats onnx'
alias yolo-benchmark='python benchmark.py'
alias yolo-test='python test_detector.py'
alias yolo-serve='python detector.py'
alias yolo-validate='python validate_dataset.py'

# Uso
yolo-train
yolo-analyze
yolo-export
```

## 🔗 Links Rápidos

```bash
# Abrir documentação
open README.md
open TRAINING_WORKFLOW.md
open IMPLEMENTATION_COMPLETE.md

# Abrir resultados
open runs/train/car_damage_detector/
open benchmark_results/
open exports/
```

---

**Dica**: Salve este arquivo como referência rápida! 📌

**Última Atualização**: 2025-01-13  
**Versão**: 1.0.0
