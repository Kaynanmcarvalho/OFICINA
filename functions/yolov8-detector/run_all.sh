#!/bin/bash
# ============================================================================
# YOLOv8 Detector - Run All Pipeline
# Executa todo o workflow de treinamento automaticamente
# ============================================================================

set -e  # Exit on error

echo ""
echo "============================================================================"
echo "  YOLOv8 Car Damage Detector - Pipeline Completo"
echo "============================================================================"
echo ""

# Verificar se Python está instalado
if ! command -v python &> /dev/null; then
    echo "[ERRO] Python não encontrado!"
    echo "Por favor, instale Python 3.8+ primeiro."
    exit 1
fi

echo "[1/7] Validando dataset..."
python validate_dataset.py || {
    echo "[ERRO] Validação falhou!"
    echo "Verifique se o dataset está no local correto."
    exit 1
}

echo ""
echo "[2/7] Iniciando treinamento..."
echo "Isso pode levar várias horas dependendo do hardware."
python train.py || {
    echo "[ERRO] Treinamento falhou!"
    exit 1
}

echo ""
echo "[3/7] Analisando resultados..."
python analyze_results.py || {
    echo "[AVISO] Análise falhou, mas continuando..."
}

echo ""
echo "[4/7] Exportando modelo para ONNX..."
python export_model.py --formats onnx || {
    echo "[AVISO] Exportação falhou, mas continuando..."
}

echo ""
echo "[5/7] Fazendo benchmark..."
python benchmark.py || {
    echo "[AVISO] Benchmark falhou, mas continuando..."
}

echo ""
echo "[6/7] Testando detector..."
python detector.py &
DETECTOR_PID=$!
sleep 5
python test_detector.py || {
    echo "[AVISO] Testes falharam!"
}
kill $DETECTOR_PID 2>/dev/null || true

echo ""
echo "[7/7] Pipeline completo!"
echo ""
echo "============================================================================"
echo "  Resultados disponíveis em:"
echo "  - runs/train/car_damage_detector/"
echo "  - exports/"
echo "  - benchmark_results/"
echo "============================================================================"
echo ""
