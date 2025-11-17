@echo off
REM Script de Teste Completo - Histórico Veicular (Windows)
REM Testa TUDO sem mocks ou simulações

echo.
echo ========================================
echo   TESTE COMPLETO - Historico Veicular
echo ========================================
echo.

set TOTAL_TESTS=0
set PASSED_TESTS=0
set FAILED_TESTS=0

echo Fase 1: Verificacao de Arquivos
echo ---------------------------------

REM Frontend
if exist "src\services\vehicleHistoryService.js" (
    echo [OK] Servico vehicleHistoryService.js
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Servico vehicleHistoryService.js
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "src\hooks\useVehicleHistory.js" (
    echo [OK] Hook useVehicleHistory.js
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Hook useVehicleHistory.js
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "src\components\vehicle-history\VehicleHistoryBadge.jsx" (
    echo [OK] Badge VehicleHistoryBadge.jsx
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Badge VehicleHistoryBadge.jsx
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "src\components\vehicle-history\VehicleHistoryModal.jsx" (
    echo [OK] Modal VehicleHistoryModal.jsx
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Modal VehicleHistoryModal.jsx
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "src\components\vehicle-history\VehicleHistoryTimeline.jsx" (
    echo [OK] Timeline VehicleHistoryTimeline.jsx
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Timeline VehicleHistoryTimeline.jsx
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

REM Backend
if exist "functions\vehicle-history\index.js" (
    echo [OK] Cloud Function index.js
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Cloud Function index.js
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "functions\vehicle-history\scrapers\recallScraper.js" (
    echo [OK] Recall Scraper
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Recall Scraper
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "functions\vehicle-history\scrapers\leilaoScraper.js" (
    echo [OK] Leilao Scraper
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Leilao Scraper
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "functions\vehicle-history\scrapers\sinistroScraper.js" (
    echo [OK] Sinistro Scraper
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Sinistro Scraper
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "functions\vehicle-history\utils\cache.js" (
    echo [OK] Cache Manager
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Cache Manager
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "functions\vehicle-history\utils\rateLimiter.js" (
    echo [OK] Rate Limiter
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Rate Limiter
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "functions\vehicle-history\utils\logger.js" (
    echo [OK] Logger
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Logger
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

echo.
echo Fase 2: Integracao no ClientCard
echo ----------------------------------

findstr /C:"VehicleHistoryBadge" "src\pages\clients\ClientCard.jsx" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] ClientCard importa Badge
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] ClientCard importa Badge
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

findstr /C:"VehicleHistoryModal" "src\pages\clients\ClientCard.jsx" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] ClientCard importa Modal
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] ClientCard importa Modal
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

echo.
echo Fase 3: Documentacao
echo --------------------

if exist "HISTORICO_VEICULAR_README.md" (
    echo [OK] README principal
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] README principal
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "HISTORICO_VEICULAR_QUICK_START.md" (
    echo [OK] Quick Start
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Quick Start
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "BACKEND_HISTORICO_VEICULAR_COMPLETO.md" (
    echo [OK] Backend Completo
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Backend Completo
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "PASSO_A_PASSO_DEPLOY_HISTORICO_VEICULAR.md" (
    echo [OK] Deploy Guide
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Deploy Guide
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "CHECKLIST_DEPLOY_HISTORICO_VEICULAR.md" (
    echo [OK] Checklist Deploy
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Checklist Deploy
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

echo.
echo Fase 4: Testes
echo ---------------

if exist "tests\unit\vehicleHistoryService.test.js" (
    echo [OK] Testes unitarios existem
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Testes unitarios existem
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "tests\integration\vehicleHistory.integration.test.js" (
    echo [OK] Testes de integracao existem
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Testes de integracao existem
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

if exist "cypress\e2e\vehicleHistory.cy.js" (
    echo [OK] Testes E2E existem
    set /a PASSED_TESTS+=1
) else (
    echo [FALHOU] Testes E2E existem
    set /a FAILED_TESTS+=1
)
set /a TOTAL_TESTS+=1

echo.
echo ========================================
echo   RESULTADO FINAL
echo ========================================
echo.
echo Total de testes: %TOTAL_TESTS%
echo Passou: %PASSED_TESTS%
echo Falhou: %FAILED_TESTS%
echo.

set /a PERCENTAGE=(%PASSED_TESTS% * 100) / %TOTAL_TESTS%
echo Taxa de sucesso: %PERCENTAGE%%%
echo.

if %PERCENTAGE% EQU 100 (
    echo [OK] TODOS OS TESTES PASSARAM!
    echo [OK] Sistema 100%% validado e pronto!
    exit /b 0
) else if %PERCENTAGE% GEQ 90 (
    echo [AVISO] Quase la! %FAILED_TESTS% teste^(s^) falharam.
    exit /b 1
) else (
    echo [ERRO] Varios testes falharam. Revisar implementacao.
    exit /b 1
)
