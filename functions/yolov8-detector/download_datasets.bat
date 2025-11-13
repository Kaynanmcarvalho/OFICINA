@echo off
REM Script para baixar datasets de treinamento (Windows)
REM Uso: download_datasets.bat

echo ==========================================
echo   Baixando Datasets para Treinamento
echo ==========================================
echo.

REM Verificar se kaggle está instalado
where kaggle >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Kaggle CLI nao encontrado
    echo Instalando...
    pip install kaggle
)

REM Verificar credenciais do Kaggle
if not exist "%USERPROFILE%\.kaggle\kaggle.json" (
    echo [ERRO] Credenciais do Kaggle nao encontradas
    echo.
    echo Por favor:
    echo 1. Va em https://www.kaggle.com/settings
    echo 2. Clique em 'Create New API Token'
    echo 3. Salve kaggle.json em %USERPROFILE%\.kaggle\
    echo.
    pause
    exit /b 1
)

REM Criar diretório de datasets
if not exist "datasets" mkdir datasets
cd datasets

REM Dataset 1: Car Damage Detection
echo [1/2] Baixando Car Damage Detection...
if not exist "car-damage" (
    kaggle datasets download -d anujms/car-damage-detection
    tar -xf car-damage-detection.zip -C car-damage
    del car-damage-detection.zip
    echo [OK] Car Damage Detection baixado
) else (
    echo [SKIP] Car Damage Detection ja existe
)

REM Dataset 2: COCO Car Damage
echo.
echo [2/2] Baixando COCO Car Damage...
if not exist "coco-car" (
    kaggle datasets download -d lplenka/coco-car-damage-detection-dataset
    tar -xf coco-car-damage-detection-dataset.zip -C coco-car
    del coco-car-damage-detection-dataset.zip
    echo [OK] COCO Car Damage baixado
) else (
    echo [SKIP] COCO Car Damage ja existe
)

cd ..

echo.
echo ==========================================
echo   Datasets Prontos!
echo ==========================================
echo.
echo Proximo passo:
echo   python train.py
echo.

pause
