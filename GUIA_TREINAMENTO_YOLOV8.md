# 🎓 GUIA COMPLETO: Treinamento YOLOv8 para Detecção de Danos

## 📋 VISÃO GERAL

Este guia cobre todo o processo de treinamento do modelo YOLOv8 para detectar danos em veículos, desde a preparação dos dados até o deploy em produção.

---

## 🎯 OBJETIVOS

- **Accuracy**: mAP50 > 0.85
- **Precision**: > 0.80
- **Recall**: > 0.75
- **Inference**: < 250ms (CPU) / < 15ms (GPU)
- **Model Size**: < 10MB (YOLOv8n)

---

## 📦 PASSO 1: PREPARAR AMBIENTE

### 1.1 Instalar Dependências

```bash
cd functions/yolov8-detector

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Instalar dependências adicionais para treinamento
pip install matplotlib seaborn pandas
```

### 1.2 Verificar GPU (Opcional mas Recomendado)

```python
import torch
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"GPU: {torch.cuda.get_device_name(0)}")
```

**Sem GPU?** Não tem problema! O treinamento vai funcionar em CPU, só vai demorar mais (8-12 horas vs 2-3 horas).

---

## 📊 PASSO 2: OBTER DATASETS

### 2.1 Datasets Recomendados

#### Opção A: Kaggle (Recomendado)

```bash
# Instalar Kaggle CLI
pip install kaggle

# Configurar credenciais
# 1. Ir em https://www.kaggle.com/settings
# 2. Criar API Token
# 3. Baixar kaggle.json
# 4. Colocar em ~/.kaggle/kaggle.json (Linux/Mac) ou C:\Users\<user>\.kaggle\kaggle.json (Windows)

# Baixar datasets
kaggle datasets download -d anujms/car-damage-detection
kaggle datasets download -d lplenka/coco-car-damage-detection-dataset

# Extrair
unzip car-damage-detection.zip -d datasets/car-damage
unzip coco-car-damage-detection-dataset.zip -d datasets/coco-car
```

#### Opção B: Roboflow

1. Ir em https://universe.roboflow.com/car-damage-detection
2. Escolher um dataset público
3. Exportar em formato YOLOv8
4. Baixar e extrair em `datasets/`

#### Opção C: Dataset Próprio

Se você tem imagens próprias:

```bash
# Estrutura necessária
datasets/car-damage/
├── images/
│   ├── train/
│   │   ├── img001.jpg
│   │   ├── img002.jpg
│   │   └── ...
│   ├── val/
│   │   ├── img101.jpg
│   │   └── ...
│   └── test/
│       ├── img201.jpg
│       └── ...
└── labels/
    ├── train/
    │   ├── img001.txt
    │   ├── img002.txt
    │   └── ...
    ├── val/
    │   ├── img101.txt
    │   └── ...
    └── test/
        ├── img201.txt
        └── ...
```

**Formato dos labels** (YOLO format):
```
# img001.txt
0 0.5 0.5 0.2 0.3
1 0.7 0.3 0.15 0.2
```
Formato: `class_id center_x center_y width height` (valores normalizados 0-1)

### 2.2 Anotar Imagens (Se Necessário)

Use uma dessas ferramentas:

1. **LabelImg** (Desktop)
   ```bash
   pip install labelImg
   labelImg
   ```

2. **Roboflow** (Web - Recomendado)
   - https://roboflow.com
   - Upload de imagens
   - Anotação online
   - Export em formato YOLOv8

3. **CVAT** (Web - Open Source)
   - https://cvat.org
   - Anotação colaborativa
   - Export em YOLO format

---

## ⚙️ PASSO 3: CONFIGURAR DATASET

### 3.1 Criar car_damage.yaml

```yaml
# car_damage.yaml
path: ./datasets/car-damage  # Caminho do dataset
train: images/train  # Caminho relativo das imagens de treino
val: images/val      # Caminho relativo das imagens de validação
test: images/test    # Caminho relativo das imagens de teste

# Classes
names:
  0: broken_glass
  1: broken_light
  2: bumper_damage
  3: dent
  4: scratch
  5: rust
  6: paint_damage
  7: flat_tire
  8: tire_wear
  9: mirror_damage
  10: door_damage
  11: hood_damage
  12: trunk_damage
  13: wheel_damage

# Number of classes
nc: 14
```

### 3.2 Validar Dataset

```python
# validate_dataset.py
from pathlib import Path
import yaml

# Load config
with open('car_damage.yaml', 'r') as f:
    config = yaml.safe_load(f)

# Check paths
dataset_path = Path(config['path'])
train_path = dataset_path / config['train']
val_path = dataset_path / config['val']

# Count images
train_images = list(train_path.glob('*.jpg')) + list(train_path.glob('*.png'))
val_images = list(val_path.glob('*.jpg')) + list(val_path.glob('*.png'))

print(f"Training images: {len(train_images)}")
print(f"Validation images: {len(val_images)}")

# Check labels
labels_path = dataset_path / 'labels' / 'train'
train_labels = list(labels_path.glob('*.txt'))
print(f"Training labels: {len(train_labels)}")

if len(train_images) != len(train_labels):
    print("⚠️  Warning: Number of images and labels don't match!")
else:
    print("✅ Dataset looks good!")
```

---

## 🏋️ PASSO 4: TREINAR MODELO

### 4.1 Treinamento Básico

```bash
python train.py
```

Isso vai:
1. Verificar ambiente
2. Carregar modelo YOLOv8n pré-treinado
3. Treinar por 200 epochs
4. Validar no test set
5. Exportar modelo
6. Gerar relatório

### 4.2 Monitorar Treinamento

Durante o treinamento, você verá:

```
Epoch    GPU_mem   box_loss   cls_loss   dfl_loss  Instances       Size
  1/200      2.1G      1.234      0.876      1.123         45        640
  2/200      2.1G      1.156      0.823      1.089         42        640
  ...
```

**Métricas importantes:**
- `box_loss`: Erro na localização das caixas (deve diminuir)
- `cls_loss`: Erro na classificação (deve diminuir)
- `mAP50`: Accuracy (deve aumentar)

### 4.3 Ajustar Hiperparâmetros

Se o modelo não está performando bem, ajuste em `train.py`:

```python
CONFIG = {
    'model': 'yolov8s.pt',  # Modelo maior (melhor accuracy, mais lento)
    'epochs': 300,          # Mais epochs
    'batch': 8,             # Batch menor se out of memory
    'imgsz': 800,           # Imagens maiores (melhor accuracy)
    'patience': 50,         # Mais paciência para early stopping
    # ... outros parâmetros
}
```

---

## 📊 PASSO 5: AVALIAR RESULTADOS

### 5.1 Métricas de Validação

Após o treinamento, você verá:

```
📈 Validation Metrics
============================================================
mAP50: 0.8734
mAP50-95: 0.6521
Precision: 0.8456
Recall: 0.8123

📋 Per-Class Metrics:
------------------------------------------------------------
broken_glass        : mAP50=0.9123
broken_light        : mAP50=0.8876
bumper_damage       : mAP50=0.8654
dent                : mAP50=0.8432
scratch             : mAP50=0.8234
...
```

### 5.2 Analisar Curvas de Treinamento

```bash
# Abrir results.png
open runs/train/car_damage_detector/results.png
```

**O que procurar:**
- Loss diminuindo consistentemente
- mAP aumentando
- Sem overfitting (val loss não aumentando)

### 5.3 Matriz de Confusão

```bash
# Abrir confusion_matrix.png
open runs/train/car_damage_detector/confusion_matrix.png
```

**O que procurar:**
- Diagonal forte (predições corretas)
- Poucos falsos positivos/negativos

### 5.4 Testar com Imagens Reais

```python
# test_model.py
from ultralytics import YOLO
from PIL import Image

# Load model
model = YOLO('runs/train/car_damage_detector/weights/best.pt')

# Test on image
results = model('test_car.jpg')

# Show results
results[0].show()

# Print detections
for box in results[0].boxes:
    print(f"Class: {model.names[int(box.cls)]}")
    print(f"Confidence: {box.conf:.2f}")
    print(f"BBox: {box.xyxy}")
```

---

## 🚀 PASSO 6: OTIMIZAR MODELO

### 6.1 Exportar para ONNX (Mais Rápido)

```python
from ultralytics import YOLO

model = YOLO('runs/train/car_damage_detector/weights/best.pt')
model.export(format='onnx', simplify=True)
```

### 6.2 Quantização (Menor Tamanho)

```python
model.export(format='onnx', simplify=True, int8=True)
```

### 6.3 Benchmark

```python
# benchmark.py
from ultralytics import YOLO
import time
import numpy as np

model = YOLO('model/best.pt')

# Warm up
for _ in range(10):
    model('test_car.jpg', verbose=False)

# Benchmark
times = []
for _ in range(100):
    start = time.time()
    model('test_car.jpg', verbose=False)
    times.append((time.time() - start) * 1000)

print(f"Average inference time: {np.mean(times):.2f}ms")
print(f"Min: {np.min(times):.2f}ms")
print(f"Max: {np.max(times):.2f}ms")
```

---

## 📦 PASSO 7: DEPLOY

### 7.1 Copiar Modelo

```bash
# Copiar best model para diretório model/
cp runs/train/car_damage_detector/weights/best.pt model/best.pt
```

### 7.2 Atualizar Detector

```python
# detector.py
MODEL_PATH = os.getenv("MODEL_PATH", "model/best.pt")  # Usar modelo treinado
```

### 7.3 Testar Localmente

```bash
# Iniciar detector
python detector.py

# Em outro terminal, testar
python test_detector.py --image test_car.jpg --url http://localhost:8080
```

### 7.4 Deploy para Cloud Run

```bash
# Build e deploy
gcloud run deploy yolov8-detector \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 300 \
  --set-env-vars MODEL_PATH=model/best.pt
```

---

## 🎯 PASSO 8: MELHORAR CONTINUAMENTE

### 8.1 Coletar Feedback

- Revisar predições com baixa confiança
- Identificar falsos positivos/negativos
- Coletar mais imagens de casos difíceis

### 8.2 Re-treinar

```bash
# Adicionar novas imagens ao dataset
# Re-treinar com mais dados
python train.py
```

### 8.3 Human-in-the-Loop

Implementar interface para:
- Revisar detecções
- Corrigir bounding boxes
- Re-treinar com correções

---

## 📈 MÉTRICAS DE SUCESSO

### Targets Mínimos
- ✅ mAP50 > 0.85
- ✅ Precision > 0.80
- ✅ Recall > 0.75
- ✅ Inference < 250ms (CPU)

### Targets Ideais
- 🎯 mAP50 > 0.90
- 🎯 Precision > 0.85
- 🎯 Recall > 0.80
- 🎯 Inference < 150ms (CPU)

---

## 🐛 TROUBLESHOOTING

### Problema: Out of Memory

```python
# Reduzir batch size
CONFIG['batch'] = 8  # ou 4

# Reduzir image size
CONFIG['imgsz'] = 416  # ao invés de 640
```

### Problema: Overfitting

```python
# Mais data augmentation
CONFIG['hsv_h'] = 0.03
CONFIG['hsv_s'] = 0.9
CONFIG['hsv_v'] = 0.6
CONFIG['degrees'] = 15.0
CONFIG['flipud'] = 0.5

# Early stopping mais agressivo
CONFIG['patience'] = 20
```

### Problema: Underfitting

```python
# Modelo maior
CONFIG['model'] = 'yolov8m.pt'

# Mais epochs
CONFIG['epochs'] = 300

# Learning rate maior
CONFIG['lr0'] = 0.02
```

### Problema: Baixa Accuracy em Classe Específica

1. Coletar mais imagens dessa classe
2. Verificar qualidade das anotações
3. Aumentar peso dessa classe no loss

---

## 📚 RECURSOS

### Documentação
- [Ultralytics YOLOv8](https://docs.ultralytics.com/)
- [YOLOv8 Training Tips](https://docs.ultralytics.com/modes/train/)
- [Data Augmentation](https://docs.ultralytics.com/modes/train/#augmentation)

### Datasets
- [Kaggle Car Damage](https://www.kaggle.com/datasets/anujms/car-damage-detection)
- [COCO Car Damage](https://www.kaggle.com/datasets/lplenka/coco-car-damage-detection-dataset)
- [Roboflow Universe](https://universe.roboflow.com/car-damage-detection)

### Ferramentas
- [LabelImg](https://github.com/tzutalin/labelImg)
- [Roboflow](https://roboflow.com)
- [CVAT](https://cvat.org)

---

## ✅ CHECKLIST

- [ ] Ambiente configurado
- [ ] Datasets baixados e organizados
- [ ] car_damage.yaml criado
- [ ] Dataset validado
- [ ] Treinamento executado
- [ ] Métricas > targets
- [ ] Modelo testado com imagens reais
- [ ] Modelo exportado
- [ ] Deploy local testado
- [ ] Deploy Cloud Run realizado
- [ ] Documentação atualizada

---

**Tempo estimado total**: 2-3 dias
- Preparação: 4-6 horas
- Treinamento: 8-12 horas (CPU) / 2-3 horas (GPU)
- Validação e ajustes: 4-6 horas
- Deploy: 1-2 horas

**Última atualização**: 2025-01-13
**Responsável**: Claude 4.5 (Kiro AI)
**Status**: ✅ GUIA COMPLETO
