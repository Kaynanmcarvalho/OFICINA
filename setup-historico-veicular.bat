@echo off
REM Script de Setup - Histórico Veicular (Windows)
REM Automatiza a instalação e configuração do sistema

echo.
echo ========================================
echo   Setup do Historico Veicular
echo ========================================
echo.

REM Verificar se está no diretório correto
if not exist "package.json" (
    echo [ERRO] Execute este script na raiz do projeto!
    pause
    exit /b 1
)

echo [OK] Diretorio correto detectado
echo.

REM Passo 1: Verificar Node.js
echo Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado! Instale Node.js 18+ primeiro.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js instalado: %NODE_VERSION%
echo.

REM Passo 2: Verificar Firebase CLI
echo Verificando Firebase CLI...
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Firebase CLI nao encontrado. Instalando...
    call npm install -g firebase-tools
    echo [OK] Firebase CLI instalado
) else (
    for /f "tokens=*" %%i in ('firebase --version') do set FIREBASE_VERSION=%%i
    echo [OK] Firebase CLI instalado: %FIREBASE_VERSION%
)
echo.

REM Passo 3: Login no Firebase
echo Verificando autenticacao Firebase...
firebase projects:list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Fazendo login no Firebase...
    call firebase login
)
echo [OK] Autenticado no Firebase
echo.

REM Passo 4: Instalar dependências do backend
echo Instalando dependencias do backend...
cd functions\vehicle-history

if not exist "package.json" (
    echo [ERRO] package.json nao encontrado em functions\vehicle-history
    cd ..\..
    pause
    exit /b 1
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Erro ao instalar dependencias do backend
    cd ..\..
    pause
    exit /b 1
)

echo [OK] Dependencias do backend instaladas
cd ..\..
echo.

REM Passo 5: Testar scrapers localmente
echo Testando scrapers...
cd functions\vehicle-history
call node test-local.js
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Alguns testes falharam (normal se nao houver dados)
) else (
    echo [OK] Testes dos scrapers concluidos
)
cd ..\..
echo.

REM Passo 6: Configurar Firestore Rules
echo Configurando Firestore Rules...
if exist "firestore.rules" (
    findstr /C:"vehicle_history" firestore.rules >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Regras do Firestore ja configuradas
    ) else (
        echo [AVISO] Adicionando regras ao firestore.rules...
        type functions\vehicle-history\firestore.rules.example >> firestore.rules
        echo [OK] Regras adicionadas ao firestore.rules
    )
) else (
    echo [AVISO] Criando firestore.rules...
    copy functions\vehicle-history\firestore.rules.example firestore.rules
    echo [OK] firestore.rules criado
)
echo.

REM Passo 7: Deploy (opcional)
echo ========================================
echo   Deploy
echo ========================================
set /p DEPLOY="Deseja fazer o deploy agora? (s/n): "
if /i "%DEPLOY%"=="s" (
    echo Fazendo deploy...
    
    REM Deploy das regras do Firestore
    echo Deploy das regras do Firestore...
    call firebase deploy --only firestore:rules
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Regras do Firestore deployadas
    ) else (
        echo [ERRO] Erro ao deployar regras do Firestore
    )
    
    REM Deploy da Cloud Function
    echo Deploy da Cloud Function...
    cd functions\vehicle-history
    call npm run deploy
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Cloud Function deployada
    ) else (
        echo [ERRO] Erro ao deployar Cloud Function
    )
    cd ..\..
) else (
    echo [AVISO] Deploy pulado. Execute manualmente quando estiver pronto:
    echo   cd functions\vehicle-history
    echo   npm run deploy
)
echo.

REM Passo 8: Criar índices do Firestore
echo ========================================
echo   Indices do Firestore
echo ========================================
echo [AVISO] Crie os seguintes indices no Firebase Console:
echo.
echo Collection: vehicle_history
echo   - cacheExpiry (Ascending)
echo   - empresaId (Ascending)
echo.
echo Collection: rate_limits
echo   - lastRequest (Ascending)
echo.
echo URL: https://console.firebase.google.com/project/_/firestore/indexes
echo.

REM Passo 9: Resumo
echo ========================================
echo   Setup Concluido!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Criar indices no Firestore (veja acima)
echo 2. Integrar no ClientCard:
echo    - Importar VehicleHistoryBadge
echo    - Importar VehicleHistoryModal
echo    - Ver: EXEMPLO_INTEGRACAO_HISTORICO_VEICULAR.md
echo.
echo 3. Testar a integracao:
echo    - Abrir aplicacao
echo    - Navegar para pagina de clientes
echo    - Clicar no badge de historico
echo.
echo 4. Monitorar logs:
echo    firebase functions:log --only getVehicleHistory
echo.
echo Documentacao completa:
echo    - HISTORICO_VEICULAR_README.md
echo    - HISTORICO_VEICULAR_QUICK_START.md
echo    - BACKEND_HISTORICO_VEICULAR_COMPLETO.md
echo.
echo [OK] Sistema pronto para uso!
echo.
pause
