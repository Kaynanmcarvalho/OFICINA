@echo off
REM ============================================================================
REM YOLOv8 Detector - Run All Pipeline
REM Executa todo o workflow de treinamento automaticamente
REM ============================================================================

echo.
echo ============================================================================
echo   YOLOv8 Car Damage Detector - Pipeline Completo
echo ============================================================================
echo.

REM Verificar se Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado!
    echo Por favor, instale Python 3.8+ primeiro.
    pause
    exit /b 1
)

echo [1/7] Validando dataset...
python validate_dataset.py
if errorlevel 1 (
    echo [ERRO] Validacao falhou!
    echo Verifique se o dataset esta no local correto.
    pause
    exit /b 1
)

echo.
echo [2/7] Iniciando treinamento...
echo Isso pode levar varias horas dependendo do hardware.
python train.py
if errorlevel 1 (
    echo [ERRO] Treinamento falhou!
    pause
    exit /b 1
)

echo.
echo [3/7] Analisando resultados...
python analyze_results.py
if errorlevel 1 (
    echo [AVISO] Analise falhou, mas continuando...
)

echo.
echo [4/7] Exportando modelo para ONNX...
python export_model.py --formats onnx
if errorlevel 1 (
    echo [AVISO] Exportacao falhou, mas continuando...
)

echo.
echo [5/7] Fazendo benchmark...
python benchmark.py
if errorlevel 1 (
    echo [AVISO] Benchmark falhou, mas continuando...
)

echo.
echo [6/7] Testando detector...
start /B python detector.py
timeout /t 5 /nobreak >nul
python test_detector.py
if errorlevel 1 (
    echo [AVISO] Testes falharam!
)

echo.
echo [7/7] Pipeline completo!
echo.
echo ============================================================================
echo   Resultados disponiveis em:
echo   - runs/train/car_damage_detector/
echo   - exports/
echo   - benchmark_results/
echo ============================================================================
echo.

pause
