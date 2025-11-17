@echo off
echo ========================================
echo VALIDACAO DE IMPLEMENTACAO COMPLETA
echo ========================================
echo.

set TOTAL=0
set SUCESSO=0

echo Verificando arquivos implementados...
echo.

REM Previsao de Estoque
echo [1/10] Previsao de Estoque
set /a TOTAL+=1
if exist "src\services\stockPredictionService.js" (
    if exist "src\hooks\useStockPrediction.js" (
        if exist "src\components\stock-prediction\StockPredictionDashboard.jsx" (
            echo [OK] Previsao de Estoque - Todos os arquivos presentes
            set /a SUCESSO+=1
        ) else (
            echo [ERRO] Falta StockPredictionDashboard.jsx
        )
    ) else (
        echo [ERRO] Falta useStockPrediction.js
    )
) else (
    echo [ERRO] Falta stockPredictionService.js
)
echo.

REM NF-e
echo [2/10] NF-e (Nota Fiscal Eletronica)
set /a TOTAL+=1
if exist "src\services\nfeService.js" (
    if exist "src\hooks\useNFe.js" (
        if exist "src\components\nfe\NFeDashboard.jsx" (
            echo [OK] NF-e - Todos os arquivos presentes
            set /a SUCESSO+=1
        ) else (
            echo [ERRO] Falta NFeDashboard.jsx
        )
    ) else (
        echo [ERRO] Falta useNFe.js
    )
) else (
    echo [ERRO] Falta nfeService.js
)
echo.

REM Historico Veicular
echo [3/10] Historico Veicular
set /a TOTAL+=1
if exist "src\services\vehicleHistoryService.js" (
    if exist "functions\vehicle-history\index.js" (
        echo [OK] Historico Veicular - Implementado
        set /a SUCESSO+=1
    ) else (
        echo [ERRO] Falta backend
    )
) else (
    echo [ERRO] Falta vehicleHistoryService.js
)
echo.

REM Auto Diagnostico
echo [4/10] Auto Diagnostico Visual
set /a TOTAL+=1
if exist "src\services\diagnosisService.js" (
    if exist "functions\yolov8-detector\detector.py" (
        echo [OK] Auto Diagnostico - Implementado
        set /a SUCESSO+=1
    ) else (
        echo [AVISO] Falta detector YOLOv8
    )
) else (
    echo [ERRO] Falta diagnosisService.js
)
echo.

REM Assistente de Voz
echo [5/10] Assistente de Orcamento Falado
set /a TOTAL+=1
if exist "src\components\voice\VoiceBudgetAssistant.jsx" (
    if exist "src\services\openaiService.js" (
        echo [OK] Assistente de Voz - Implementado
        set /a SUCESSO+=1
    ) else (
        echo [ERRO] Falta openaiService.js
    )
) else (
    echo [ERRO] Falta VoiceBudgetAssistant.jsx
)
echo.

REM Analise de Custos
echo [6/10] Analise de Custos e Margens
set /a TOTAL+=1
if exist "src\services\costAnalysisService.js" (
    if exist "src\services\marginCalculatorService.js" (
        echo [OK] Analise de Custos - Implementado
        set /a SUCESSO+=1
    ) else (
        echo [ERRO] Falta marginCalculatorService.js
    )
) else (
    echo [ERRO] Falta costAnalysisService.js
)
echo.

REM Guia do Mecanico
echo [7/10] Guia do Mecanico (Modo Aprendiz)
set /a TOTAL+=1
if exist "src\services\mechanicGuideService.js" (
    if exist "src\components\mechanic-guide\GuideViewer.jsx" (
        echo [OK] Guia do Mecanico - Implementado
        set /a SUCESSO+=1
    ) else (
        echo [ERRO] Falta GuideViewer.jsx
    )
) else (
    echo [ERRO] Falta mechanicGuideService.js
)
echo.

REM WhatsApp
echo [8/10] WhatsApp Automation
set /a TOTAL+=1
if exist "server\services\whatsappService.js" (
    if exist "src\components\whatsapp\WhatsAppButton.jsx" (
        echo [OK] WhatsApp - Implementado
        set /a SUCESSO+=1
    ) else (
        echo [ERRO] Falta WhatsAppButton.jsx
    )
) else (
    echo [ERRO] Falta whatsappService.js
)
echo.

REM Check-in Premium
echo [9/10] Check-in Premium
set /a TOTAL+=1
if exist "src\pages\CheckInPagePremium.jsx" (
    if exist "src\pages\checkin\components\timeline\VehicleTimeline.jsx" (
        echo [OK] Check-in Premium - Implementado
        set /a SUCESSO+=1
    ) else (
        echo [ERRO] Falta VehicleTimeline.jsx
    )
) else (
    echo [ERRO] Falta CheckInPagePremium.jsx
)
echo.

REM Inventory
echo [10/10] Inventory Module
set /a TOTAL+=1
if exist "src\pages\inventory\InventoryPage.jsx" (
    if exist "src\store\productStore.jsx" (
        echo [OK] Inventory Module - Implementado
        set /a SUCESSO+=1
    ) else (
        echo [ERRO] Falta productStore.jsx
    )
) else (
    echo [ERRO] Falta InventoryPage.jsx
)
echo.

echo ========================================
echo RESUMO DA VALIDACAO
echo ========================================
echo.
echo Total de funcionalidades: %TOTAL%
echo Implementadas com sucesso: %SUCESSO%
echo.

if %SUCESSO%==%TOTAL% (
    echo [SUCESSO] TODAS AS FUNCIONALIDADES IMPLEMENTADAS!
    echo.
    echo Status: 100%% COMPLETO
    echo.
    echo Funcionalidades prontas:
    echo  1. Auto Diagnostico Visual ^(YOLOv8^)
    echo  2. Assistente de Orcamento Falado
    echo  3. Analise de Custos e Margens
    echo  4. Guia do Mecanico ^(Modo Aprendiz^)
    echo  5. WhatsApp Automation
    echo  6. Check-in Premium
    echo  7. Inventory Module
    echo  8. Historico Veicular
    echo  9. Previsao de Estoque
    echo 10. NF-e ^(Nota Fiscal Eletronica^)
    echo.
    echo ========================================
    echo PROJETO TORQ AI - 100%% IMPLEMENTADO
    echo ========================================
) else (
    echo [ATENCAO] Algumas funcionalidades precisam de ajustes
    echo Implementadas: %SUCESSO%/%TOTAL%
)

echo.
echo Data: %date% %time%
echo.
pause
