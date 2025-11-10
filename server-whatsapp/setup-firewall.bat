@echo off
echo ========================================
echo  Configurar Firewall - WhatsApp Server
echo ========================================
echo.
echo Este script precisa de permissoes de Administrador
echo Clique com botao direito e escolha "Executar como Administrador"
echo.
pause

PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0setup-firewall.ps1'"

pause
