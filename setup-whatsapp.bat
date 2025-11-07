@echo off
echo ========================================
echo   Setup WhatsApp Multi-Sessao
echo ========================================
echo.

REM Verificar se está na raiz do projeto
if not exist "server" (
    echo [ERRO] Execute este script na raiz do projeto
    exit /b 1
)

REM 1. Instalar dependências do backend
echo [1/4] Instalando dependencias do backend...
cd server
call npm install
cd ..

REM 2. Instalar dependências do frontend
echo [2/4] Instalando dependencias do frontend...
call npm install socket.io-client

REM 3. Verificar se .env existe
if not exist "server\.env" (
    echo.
    echo [AVISO] Arquivo server\.env nao encontrado!
    echo.
    echo Por favor, crie o arquivo server\.env com:
    echo.
    echo FIREBASE_PROJECT_ID=seu-project-id
    echo FIREBASE_CLIENT_EMAIL=seu-email@projeto.iam.gserviceaccount.com
    echo FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
    echo PORT=3001
    echo CORS_ORIGIN=http://localhost:5173
    echo.
    echo Veja: CONFIGURACAO_URGENTE.md para mais detalhes
    echo.
    exit /b 1
)

REM 4. Verificar se .env do frontend existe
if not exist ".env" (
    echo [3/4] Criando .env do frontend...
    echo VITE_API_URL=http://localhost:3001 > .env
)

echo.
echo ========================================
echo   Setup concluido!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Configure as credenciais do Firebase em server\.env
echo    Veja: CONFIGURACAO_URGENTE.md
echo.
echo 2. Inicie o backend:
echo    cd server
echo    npm start
echo.
echo 3. Em outro terminal, inicie o frontend:
echo    npm run dev
echo.
echo 4. Teste a conexao:
echo    cd server
echo    node test-whatsapp.js
echo.
echo Documentacao completa: README_WHATSAPP_COMPLETO.md
echo.
pause
