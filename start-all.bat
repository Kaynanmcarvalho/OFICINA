@echo off
echo ========================================
echo  Iniciando Sistema Completo
echo ========================================
echo.

echo [1/2] Iniciando Backend API...
start "Backend API" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

echo [2/2] Iniciando Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo  Sistema Iniciado!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Pressione qualquer tecla para sair...
pause > nul
