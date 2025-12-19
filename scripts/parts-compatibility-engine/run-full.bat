@echo off
echo ========================================
echo  PARTS COMPATIBILITY ENGINE
echo  Pipeline Completo Automatico
echo ========================================
echo.
echo Este processo ira:
echo  1. Gerar compatibilidade para 20.000+ veiculos
echo  2. Validar todos os resultados
echo  3. Exportar para Firebase
echo.
echo ATENCAO: Este processo pode levar varias horas!
echo.
pause

cd /d "%~dp0"

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
)

echo.
echo ========================================
echo  INICIANDO PIPELINE COMPLETO
echo ========================================
echo.

node src/index.js full

echo.
echo ========================================
echo  PIPELINE FINALIZADO!
echo ========================================
pause
