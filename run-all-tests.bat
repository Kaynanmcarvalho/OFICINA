@echo off
REM Script para executar todos os testes no Windows
REM Uso: run-all-tests.bat

echo.
echo ========================================
echo   TORQ AI - Suite Completa de Testes
echo ========================================
echo.

REM Verificar se npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] npm nao encontrado. Instale Node.js primeiro.
    exit /b 1
)

REM Instalar dependências
echo [1/6] Instalando dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias
    exit /b 1
)
echo [OK] Dependencias instaladas
echo.

REM Testes unitários
echo [2/6] Executando testes unitarios...
call npm run test:unit
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Testes unitarios falharam
    exit /b 1
)
echo [OK] Testes unitarios passaram
echo.

REM Coverage
echo [3/6] Gerando relatorio de cobertura...
call npm run test:coverage
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Falha ao gerar coverage
) else (
    echo [OK] Coverage gerado: coverage/index.html
)
echo.

REM Build
echo [4/6] Testando build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Build falhou
    exit /b 1
)
echo [OK] Build bem-sucedido
echo.

REM Lint
echo [5/6] Executando lint...
call npm run lint
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Lint encontrou problemas (nao critico)
) else (
    echo [OK] Lint passou
)
echo.

REM Resumo
echo.
echo ========================================
echo   RESUMO DOS TESTES
echo ========================================
echo [OK] Testes unitarios: PASSOU
echo [OK] Build: PASSOU
echo ========================================
echo.
echo Todos os testes passaram com sucesso!
echo.
echo Proximos passos:
echo   1. Revisar coverage: start coverage\index.html
echo   2. Executar testes E2E: npm run test:e2e
echo   3. Fazer commit: git commit -m "feat: add tests"
echo.

pause
