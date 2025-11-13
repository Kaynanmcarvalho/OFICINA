# 🎯 YOLOv8 Training Workflow - Guia Completo

Guia passo a passo para treinar, avaliar e deployar modelos YOLOv8 para detecção de danos em veículos.

## 📋 Índice

1. [Preparação do Ambiente](#1-preparação-do-ambiente)
2. [Download e Preparação dos Dados](#2-download-e-preparação-dos-dados)
3. [Validação do Dataset](#3-validação-do-dataset)
4. [Treinamento do Modelo](#4-treinamento-do-modelo)
5. [Análise de Resultados](#5-análise-de-resultados)
6. [Exportação para Produção](#6-exportação-para-produção)
7. [Benchmark de Performance](#7-benchmark-de-performance)
8. [Deploy](#8-deploy)

---

## 1. Preparação do Ambiente

### Requisitos

```bash
# Python 3.8+
python --version

# GPU (opcional, mas recomendado)
nvidia-smi
```

### Instalação de Dependências

```bash
# Instalar dependências
pip install -r requirements.txt

# Verificar instalação
python -c "from ultralytics import YOLO; print('✅ YOLOv8 instalado')"
```

### Estrutura de Diretórios

```
functions/yolov8-detector/
├── datasets/              # Datasets de treinamento
│   └── car-damage/
│       ├── images/
│       │   ├── train/
│       │   ├── val/
│       │   └── test/
│       └── labels/
│           ├── train/
│           ├── val/
│           └── test/
├── runs/                  # Resultados de treinamento
│   └── train/
│       └── car_damage_detector/
├── exports/               # Modelos exportados
├── benchmark_results/     # Resultados de benchmark
└── model/                 # Modelo final para produção
```

---

## 2. Download e Preparação dos Dados

### Opção A: Download Automático (Recomendado)

```bash
# Windows
download_datasets.bat

# Linux/Mac
chmod +x download_datasets.sh
./download_datasets.sh
```

### Opção B: Download Manual

#### Kaggle Car Damage Detection

```bash
# 1. Instalar Kaggle CLI
pip install kaggle

# 2. Configurar credenciais
# Baixe kaggle.json de: https://www.kaggle.com/settings
mkdir -p ~/.kaggle
cp kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json

# 3. Download dataset
kaggle datasets download -d anujms/car-damage-detection
unzip car-damage-detection.zip -d datasets/car-damage
```

#### COCO Car Damage

```bash
kaggle datasets download -d lplenka/coco-car-damage-detection-dataset
unzip coco-car-damage-detection-dataset.zip -d datasets/coco-car
```

#### Roboflow (Opcional)

1. Acesse: https://universe.roboflow.com/car-damage-detection
2. Selecione um dataset
3. Download em formato YOLOv8
4. Extraia para `datasets/roboflow-car`

### Organização dos Dados

```bash
# Estrutura esperada
datasets/car-damage/
├── images/
│   ├── train/    # 70% das imagens
│   ├── val/      # 20% das imagens
│   └── test/     # 10% das imagens
└── labels/
    ├── train/    # Anotações YOLO format
    ├── val/
    └── test/
```

### Formato das Anotações

Cada arquivo `.txt` deve conter:
```
class_id x_center y_center width height
```

Exemplo:
```
3 0.5 0.5 0.2 0.15    # dent no centro da imagem
4 0.3 0.7 0.1 0.08    # scratch no canto inferior esquerdo
```

---

## 3. Validação do Dataset

Antes de treinar, valide o dataset:

```bash
python validate_dataset.py
```

### O que é verificado:

✅ **Estrutura de diretórios**
- Existência de pastas train/val/test
- Correspondência entre images/ e labels/

✅ **Qualidade das imagens**
- Formato válido (JPG, PNG)
- Resolução mínima
- Imagens corrompidas

✅ **Anotações**
- Formato YOLO correto
- Valores dentro do range [0, 1]
- Classes válidas

✅ **Distribuição**
- Balanceamento de classes
- Split train/val/test adequado
- Número mínimo de amostras

### Exemplo de Saída

```
📊 Dataset Validation Report
════════════════════════════════════════════════════════════

✅ Dataset Structure
  Train images: 1,234
  Val images: 352
  Test images: 176
  Total: 1,762

✅ Image Quality
  Valid images: 1,762 (100%)
  Average resolution: 1920x1080
  Formats: JPG (98%), PNG (2%)

✅ Annotations
  Valid labels: 1,762 (100%)
  Total objects: 3,524
  Avg objects/image: 2.0

✅ Class Distribution
  dent: 892 (25.3%)
  scratch: 756 (21.5%)
  bumper_damage: 623 (17.7%)
  ...

⚠️  Warnings
  - Class 'rust' has only 45 samples (< 100 recommended)
  - Consider collecting more data for underrepresented classes

✅ Dataset is ready for training!
```

---

## 4. Treinamento do Modelo

### Configuração Básica

Edite `train.py` ou use argumentos de linha de comando:

```python
# Escolha do modelo base
model = YOLO('yolov8n.pt')  # Nano - Rápido, menor precisão
model = YOLO('yolov8s.pt')  # Small - Balanceado (recomendado)
model = YOLO('yolov8m.pt')  # Medium - Mais preciso, mais lento
model = YOLO('yolov8l.pt')  # Large - Máxima precisão
```

### Iniciar Treinamento

```bash
# Treinamento básico
python train.py

# Com configurações customizadas
python train.py --epochs 200 --batch 16 --imgsz 640
```

### Parâmetros Importantes

| Parâmetro | Descrição | Recomendado |
|-----------|-----------|-------------|
| `epochs` | Número de épocas | 100-300 |
| `batch` | Tamanho do batch | 16-32 (GPU), 4-8 (CPU) |
| `imgsz` | Tamanho da imagem | 640 (padrão) |
| `patience` | Early stopping | 30-50 |
| `lr0` | Learning rate inicial | 0.01 |
| `device` | CPU ou GPU | 'cuda' ou 'cpu' |

### Monitoramento

Durante o treinamento, monitore:

```
Epoch    GPU_mem   box_loss   cls_loss   dfl_loss  Instances       Size
  1/200     2.84G      1.234      0.876      1.123        156        640
  2/200     2.84G      1.156      0.823      1.089        142        640
  ...
```

Métricas importantes:
- **box_loss** - Precisão da localização (deve diminuir)
- **cls_loss** - Precisão da classificação (deve diminuir)
- **mAP50** - Precisão geral (deve aumentar)

### Tempo Estimado

| Hardware | Modelo | 100 Épocas |
|----------|--------|------------|
| CPU (8 cores) | YOLOv8n | ~12 horas |
| GPU (RTX 3060) | YOLOv8n | ~2 horas |
| GPU (RTX 3090) | YOLOv8s | ~3 horas |
| GPU (A100) | YOLOv8m | ~4 horas |

### Resultados

Após o treinamento, os resultados são salvos em:

```
runs/train/car_damage_detector/
├── weights/
│   ├── best.pt          # Melhor modelo (use este!)
│   └── last.pt          # Último checkpoint
├── results.csv          # Métricas por época
├── confusion_matrix.png # Matriz de confusão
├── results.png          # Curvas de treinamento
└── val_batch*.jpg       # Predições de validação
```

---

## 5. Análise de Resultados

Execute a análise completa:

```bash
python analyze_results.py
```

### Relatório Gerado

#### 1. Training Curves (`training_analysis.png`)

Visualiza:
- Loss curves (box, cls, dfl)
- mAP progression
- Learning rate schedule

#### 2. Comprehensive Report (`training_analysis_report.md`)

Inclui:
- **Executive Summary** - Qualidade geral do modelo
- **Best Metrics** - Melhores resultados alcançados
- **Overfitting Analysis** - Detecção de overfitting
- **Performance Benchmarks** - Velocidade de inferência
- **Recommendations** - Sugestões de melhoria

#### 3. Sample Predictions (`test_result_*.jpg`)

Visualiza predições em imagens de teste para inspeção visual.

### Interpretação dos Resultados

#### Métricas de Qualidade

| Métrica | Excelente | Bom | Aceitável | Ruim |
|---------|-----------|-----|-----------|------|
| mAP@0.5 | > 0.90 | 0.85-0.90 | 0.75-0.85 | < 0.75 |
| mAP@0.5:0.95 | > 0.70 | 0.60-0.70 | 0.50-0.60 | < 0.50 |
| Precision | > 0.85 | 0.75-0.85 | 0.65-0.75 | < 0.65 |
| Recall | > 0.80 | 0.70-0.80 | 0.60-0.70 | < 0.60 |

#### Sinais de Overfitting

🔴 **Alto Overfitting**
- Val loss > Train loss em 30%+
- mAP diminuindo nas últimas épocas
- Gap grande entre train e val metrics

🟡 **Overfitting Moderado**
- Val loss > Train loss em 15-30%
- mAP estável mas não melhorando

✅ **Sem Overfitting**
- Val loss próximo de Train loss
- mAP melhorando consistentemente

#### Velocidade de Inferência

| Tempo | Rating | Uso Recomendado |
|-------|--------|-----------------|
| < 50ms | 🚀 Excelente | Real-time, vídeo |
| 50-100ms | ✅ Bom | Near real-time |
| 100-250ms | 🟡 Aceitável | Batch processing |
| > 250ms | 🔴 Lento | Otimização necessária |

---

## 6. Exportação para Produção

### Exportar Modelo

```bash
# ONNX (recomendado para produção)
python export_model.py --formats onnx

# Múltiplos formatos
python export_model.py --formats onnx tensorrt tflite

# Todos os formatos
python export_model.py --formats all
```

### Formatos Disponíveis

#### ONNX (Recomendado)
- ✅ Cross-platform
- ✅ Otimizado para CPU e GPU
- ✅ Suporte amplo (Python, C++, JavaScript)
- ✅ Tamanho reduzido

```python
# Uso em produção
import onnxruntime as ort

session = ort.InferenceSession('exports/best.onnx')
output = session.run(None, {input_name: image_array})
```

#### TensorRT
- ✅ Máxima performance em NVIDIA GPUs
- ✅ 2-5x mais rápido que ONNX
- ⚠️ Requer GPU NVIDIA e TensorRT instalado

```python
from ultralytics import YOLO

model = YOLO('exports/best.engine')
results = model('image.jpg')
```

#### CoreML
- ✅ Nativo para iOS/macOS
- ✅ Otimizado para Apple Silicon
- ⚠️ Apenas Apple devices

#### TFLite
- ✅ Android e edge devices
- ✅ Tamanho muito reduzido
- ✅ Quantização INT8 disponível

#### OpenVINO
- ✅ Otimizado para Intel CPUs/GPUs
- ✅ Boa performance em hardware Intel

### Deployment Package

A exportação cria:

```
exports/
├── best.onnx                    # Modelo ONNX
├── best.engine                  # TensorRT (se disponível)
├── best.mlpackage/              # CoreML
├── best_saved_model/            # TFLite
├── best_openvino_model/         # OpenVINO
├── deployment_info.json         # Metadados
└── DEPLOYMENT_README.md         # Instruções de uso
```

---

## 7. Benchmark de Performance

Execute benchmark completo:

```bash
python benchmark.py --model runs/train/car_damage_detector/weights/best.pt
```

### Testes Realizados

#### 1. Speed Benchmark
- 100 inferências em imagem dummy
- Estatísticas: mean, std, min, max, P95, P99
- FPS estimado

#### 2. Accuracy Benchmark
- Teste em 100 imagens reais
- Taxa de detecção
- Distribuição de confiança
- Detecções por imagem

#### 3. Resource Benchmark
- Uso de CPU durante 30 segundos
- Uso de memória
- Baseline vs. inference

### Resultados

```
benchmark_results/
├── benchmark_results.png        # Visualizações
├── benchmark_report.md          # Relatório detalhado
└── benchmark_results.json       # Dados brutos
```

### Comparação de Modelos

| Modelo | mAP50 | Inferência (CPU) | Inferência (GPU) | Tamanho |
|--------|-------|------------------|------------------|---------|
| YOLOv8n | 0.85 | 250ms | 15ms | 6.2MB |
| YOLOv8s | 0.89 | 450ms | 25ms | 22MB |
| YOLOv8m | 0.92 | 800ms | 40ms | 52MB |
| YOLOv8l | 0.94 | 1200ms | 60ms | 87MB |

### Escolha do Modelo

**Para Real-Time (< 50ms)**
- Use YOLOv8n
- Deploy em GPU
- Considere TensorRT

**Para Máxima Precisão**
- Use YOLOv8m ou YOLOv8l
- Aceite latência maior
- Batch processing

**Para Balanceado**
- Use YOLOv8s
- ONNX em CPU ou GPU
- Melhor custo-benefício

---

## 8. Deploy

### Preparação

```bash
# 1. Copiar melhor modelo
cp runs/train/car_damage_detector/weights/best.pt model/best.pt

# 2. Ou usar modelo exportado
cp exports/best.onnx model/best.onnx
```

### Local Testing

```bash
# Iniciar servidor
python detector.py

# Testar
python test_detector.py
```

### Docker

```bash
# Build
docker build -t yolov8-detector .

# Run
docker run -p 8080:8080 yolov8-detector

# Test
curl http://localhost:8080/health
```

### Google Cloud Run

```bash
# Deploy
gcloud run deploy yolov8-detector \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300

# Get URL
gcloud run services describe yolov8-detector \
  --region us-central1 \
  --format 'value(status.url)'
```

### Configuração de Produção

```bash
# Variáveis de ambiente
export MODEL_PATH=model/best.onnx
export CONFIDENCE_THRESHOLD=0.45
export IOU_THRESHOLD=0.45
export MAX_DETECTIONS=100

# Cloud Run
gcloud run services update yolov8-detector \
  --set-env-vars MODEL_PATH=model/best.onnx \
  --set-env-vars CONFIDENCE_THRESHOLD=0.45
```

---

## 🎯 Checklist Completo

### Antes do Treinamento
- [ ] Ambiente configurado
- [ ] Dependências instaladas
- [ ] Dataset baixado
- [ ] Dataset validado
- [ ] GPU disponível (opcional)

### Durante o Treinamento
- [ ] Monitorar loss curves
- [ ] Verificar overfitting
- [ ] Ajustar hyperparameters se necessário
- [ ] Salvar checkpoints

### Após o Treinamento
- [ ] Analisar resultados
- [ ] Verificar métricas (mAP > 0.85)
- [ ] Testar em imagens reais
- [ ] Exportar modelo
- [ ] Fazer benchmark

### Deploy
- [ ] Testar localmente
- [ ] Testar com Docker
- [ ] Deploy em Cloud Run
- [ ] Testar endpoint de produção
- [ ] Monitorar performance

---

## 🚨 Troubleshooting

### Problema: Out of Memory

**Solução:**
```python
# Reduzir batch size
batch = 8  # ou 4

# Reduzir imgsz
imgsz = 416  # ao invés de 640

# Usar modelo menor
model = YOLO('yolov8n.pt')
```

### Problema: Overfitting

**Solução:**
```python
# Aumentar data augmentation
hsv_h = 0.02
hsv_s = 0.8
hsv_v = 0.5
flipl = 0.5
mosaic = 1.0

# Adicionar dropout
dropout = 0.1

# Early stopping
patience = 30

# Coletar mais dados
```

### Problema: Low mAP

**Solução:**
1. Verificar qualidade das anotações
2. Balancear classes
3. Aumentar epochs
4. Usar modelo maior
5. Ajustar learning rate
6. Coletar mais dados

### Problema: Slow Inference

**Solução:**
1. Usar modelo menor (YOLOv8n)
2. Exportar para ONNX
3. Usar TensorRT (GPU)
4. Reduzir imgsz
5. Batch processing

---

## 📚 Recursos Adicionais

### Documentação
- [Ultralytics YOLOv8](https://docs.ultralytics.com/)
- [YOLO Training Tips](https://docs.ultralytics.com/guides/training-tips/)
- [Model Export Guide](https://docs.ultralytics.com/modes/export/)

### Datasets
- [Kaggle Car Damage](https://www.kaggle.com/datasets/anujms/car-damage-detection)
- [Roboflow Universe](https://universe.roboflow.com/)
- [COCO Dataset](https://cocodataset.org/)

### Papers
- [YOLOv8 Paper](https://arxiv.org/abs/2305.09972)
- [Object Detection Survey](https://arxiv.org/abs/1905.05055)

---

**Última Atualização**: 2025-01-13  
**Versão**: 1.0.0  
**Autor**: Torq AI Team
