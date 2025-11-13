#!/bin/bash

# Script para baixar datasets de treinamento
# Uso: ./download_datasets.sh

set -e

echo "=========================================="
echo "  Baixando Datasets para Treinamento"
echo "=========================================="
echo ""

# Verificar se kaggle está instalado
if ! command -v kaggle &> /dev/null; then
    echo "❌ Kaggle CLI não encontrado"
    echo "Instalando..."
    pip install kaggle
fi

# Verificar credenciais do Kaggle
if [ ! -f ~/.kaggle/kaggle.json ]; then
    echo "❌ Credenciais do Kaggle não encontradas"
    echo ""
    echo "Por favor:"
    echo "1. Vá em https://www.kaggle.com/settings"
    echo "2. Clique em 'Create New API Token'"
    echo "3. Salve kaggle.json em ~/.kaggle/"
    echo "4. Execute: chmod 600 ~/.kaggle/kaggle.json"
    echo ""
    exit 1
fi

# Criar diretório de datasets
mkdir -p datasets
cd datasets

# Dataset 1: Car Damage Detection
echo "📦 Baixando Car Damage Detection..."
if [ ! -d "car-damage" ]; then
    kaggle datasets download -d anujms/car-damage-detection
    unzip -q car-damage-detection.zip -d car-damage
    rm car-damage-detection.zip
    echo "✅ Car Damage Detection baixado"
else
    echo "⏭️  Car Damage Detection já existe"
fi

# Dataset 2: COCO Car Damage
echo ""
echo "📦 Baixando COCO Car Damage..."
if [ ! -d "coco-car" ]; then
    kaggle datasets download -d lplenka/coco-car-damage-detection-dataset
    unzip -q coco-car-damage-detection-dataset.zip -d coco-car
    rm coco-car-damage-detection-dataset.zip
    echo "✅ COCO Car Damage baixado"
else
    echo "⏭️  COCO Car Damage já existe"
fi

cd ..

# Contar imagens
echo ""
echo "=========================================="
echo "  Resumo dos Datasets"
echo "=========================================="

if [ -d "datasets/car-damage/images/train" ]; then
    train_count=$(find datasets/car-damage/images/train -type f \( -name "*.jpg" -o -name "*.png" \) | wc -l)
    echo "Training images: $train_count"
fi

if [ -d "datasets/car-damage/images/val" ]; then
    val_count=$(find datasets/car-damage/images/val -type f \( -name "*.jpg" -o -name "*.png" \) | wc -l)
    echo "Validation images: $val_count"
fi

echo ""
echo "✅ Datasets prontos para treinamento!"
echo ""
echo "Próximo passo:"
echo "  python train.py"
