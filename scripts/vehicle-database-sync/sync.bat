@echo off
echo.
echo ========================================
echo   Vehicle Database Sync - TORQ AI
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    echo.
)

echo Escolha uma opcao:
echo.
echo   1. Sincronizacao Completa (recomendado)
echo   2. Sincronizar apenas Carros
echo   3. Sincronizar apenas Motos
echo   4. Sincronizar apenas Caminhoes
echo   5. Ver Estatisticas da Base
echo   6. Sincronizar marca especifica
echo   7. Dry Run (apenas mostra o que seria feito)
echo   0. Sair
echo.

set /p opcao="Digite a opcao: "

if "%opcao%"=="1" (
    echo.
    echo Iniciando sincronizacao completa...
    call npm run full-sync
)

if "%opcao%"=="2" (
    echo.
    echo Sincronizando carros...
    node src/fullSync.js --type=cars
)

if "%opcao%"=="3" (
    echo.
    echo Sincronizando motos...
    node src/fullSync.js --type=motos
)

if "%opcao%"=="4" (
    echo.
    echo Sincronizando caminhoes...
    node src/fullSync.js --type=trucks
)

if "%opcao%"=="5" (
    echo.
    call npm run stats
)

if "%opcao%"=="6" (
    echo.
    set /p marca="Digite o nome da marca (ex: Honda, Yamaha, BMW): "
    node src/fullSync.js --brand="%marca%"
)

if "%opcao%"=="7" (
    echo.
    echo Executando dry run...
    node src/fullSync.js --dry-run
)

if "%opcao%"=="0" (
    exit /b 0
)

echo.
pause
