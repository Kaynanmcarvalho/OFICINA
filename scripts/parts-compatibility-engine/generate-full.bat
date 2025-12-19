@echo off
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     TORQ AI - Full Parts Compatibility Generator               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/3] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)

echo.
echo [2/3] Criando diretorio de output...
if not exist "output" mkdir output

echo.
echo [3/3] Executando gerador de compatibilidade...
echo.

node src/fullCompatibilityGenerator.js

echo.
echo ════════════════════════════════════════════════════════════════
echo Processo concluido! Verifique a pasta output para os resultados.
echo ════════════════════════════════════════════════════════════════
pause
