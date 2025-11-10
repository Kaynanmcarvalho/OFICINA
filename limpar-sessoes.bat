@echo off
echo ========================================
echo Limpando sessoes WhatsApp corrompidas
echo ========================================
echo.

cd server-whatsapp

echo Parando processos Node.js...
taskkill /F /IM node.exe 2>nul

echo.
echo Aguardando 2 segundos...
timeout /t 2 /nobreak >nul

echo.
echo Removendo pasta whatsapp_sessions...
if exist whatsapp_sessions (
    rmdir /s /q whatsapp_sessions 2>nul
    if exist whatsapp_sessions (
        echo AVISO: Nao foi possivel remover completamente. Tentando metodo alternativo...
        rd /s /q whatsapp_sessions 2>nul
    )
)

echo.
echo Criando pasta limpa...
mkdir whatsapp_sessions 2>nul

echo.
echo ========================================
echo Sessoes limpas com sucesso!
echo ========================================
echo.
echo Agora execute: npm start
echo.
pause
