@echo off
echo ========================================
echo  PARTS COMPATIBILITY ENGINE v2.0
echo  Motor de Compatibilidade de Pecas
echo  20.000+ veiculos brasileiros
echo ========================================
echo.

cd /d "%~dp0"

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
)

if "%1"=="" (
    echo.
    echo Uso: run.bat [comando] [opcoes]
    echo.
    echo Comandos:
    echo   generate       - Gera compatibilidade de pecas
    echo   validate       - Valida resultados
    echo   export         - Exporta indices para Firebase
    echo   export-parts   - Exporta base de pecas para Firebase
    echo   stats          - Mostra estatisticas gerais
    echo   parts-stats    - Mostra estatisticas da base de pecas
    echo   full           - Pipeline completo
    echo   help           - Ajuda detalhada
    echo.
    echo Opcoes:
    echo   --type=car^|motorcycle^|truck^|bus^|van^|suv^|pickup
    echo   --batch=100
    echo   --strict
    echo   --dry-run
    echo.
    pause
    goto :eof
)

echo.
echo Iniciando motor de compatibilidade...
echo.

node src/index.js %*

echo.
echo Processo finalizado!
pause
