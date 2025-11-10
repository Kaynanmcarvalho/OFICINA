@echo off
echo ========================================
echo Atualizar Numero do WhatsApp
echo ========================================
echo.
echo Digite o numero do WhatsApp (apenas numeros):
echo Exemplo: 5511999999999
echo.
set /p PHONE_NUMBER="Numero: "

if "%PHONE_NUMBER%"=="" (
    echo Erro: Numero nao pode ser vazio!
    pause
    exit /b 1
)

echo.
echo Atualizando numero para: %PHONE_NUMBER%
echo.

echo {"phoneNumber":"%PHONE_NUMBER%","connectedAt":"%date% %time%"} > whatsapp_sessions\empresa-super-admin-renier\session-info.json

echo.
echo ✓ Numero atualizado com sucesso!
echo.
echo Arquivo: whatsapp_sessions\empresa-super-admin-renier\session-info.json
echo.
pause
