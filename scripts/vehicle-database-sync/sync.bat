@echo off
echo.
echo ========================================
echo   TORQ AI - Vehicle Database Sync
echo ========================================
echo.

cd /d "%~dp0"

:menu
echo Escolha uma opcao:
echo.
echo   1. Baixar dados de marcas (rapido)
echo   2. Sincronizar CARROS (demora)
echo   3. Sincronizar MOTOS (demora)
echo   4. Sincronizar marca especifica
echo   5. Aplicar resultados ao arquivo
echo   6. Ver estatisticas da base
echo   7. Sair
echo.
set /p choice="Opcao: "

if "%choice%"=="1" goto download
if "%choice%"=="2" goto sync_cars
if "%choice%"=="3" goto sync_motos
if "%choice%"=="4" goto sync_brand
if "%choice%"=="5" goto apply
if "%choice%"=="6" goto stats
if "%choice%"=="7" goto end

echo Opcao invalida!
goto menu

:download
echo.
echo Baixando dados de marcas...
node src/downloadFipeData.js
echo.
pause
goto menu

:sync_cars
echo.
echo Sincronizando carros (isso pode demorar horas)...
echo Pressione Ctrl+C para cancelar.
echo.
node src/syncFromLocal.js --type=cars
echo.
pause
goto menu

:sync_motos
echo.
echo Sincronizando motos...
node src/syncFromLocal.js --type=motos
echo.
pause
goto menu

:sync_brand
echo.
set /p brand="Digite o nome da marca: "
echo Sincronizando %brand%...
node src/syncFromLocal.js --brand=%brand%
echo.
pause
goto menu

:apply
echo.
echo Aplicando resultados...
node src/applySync.js
echo.
pause
goto menu

:stats
echo.
node src/stats.js
echo.
pause
goto menu

:end
echo.
echo Ate mais!
