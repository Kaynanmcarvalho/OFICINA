@echo off
echo ========================================
echo WhatsApp Warm-Up (Pre-aquecimento)
echo ========================================
echo.
echo Este script inicializa a sessao do WhatsApp
echo para que ela esteja pronta quando voce precisar.
echo.
echo Aguarde 30-60 segundos apos executar...
echo.
pause
echo.
echo Iniciando warm-up...
curl -X POST http://localhost:5000/api/whatsapp/warmup -H "Content-Type: application/json" -d "{\"empresaId\":\"super-admin-renier\"}"
echo.
echo.
echo ========================================
echo Warm-up iniciado!
echo ========================================
echo.
echo Aguarde 30-60 segundos e verifique o status:
echo http://localhost:5000/api/whatsapp/status?empresaId=super-admin-renier
echo.
echo Quando "connected": true, o WhatsApp estara pronto!
echo.
pause
