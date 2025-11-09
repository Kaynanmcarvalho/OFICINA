@echo off
echo ========================================
echo Iniciando Servidor TORQ (Modo Limpo)
echo ========================================
echo.

echo [1/4] Limpando cache do Vite...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo Cache do Vite limpo!
)

if exist .vite (
    rmdir /s /q .vite
    echo Pasta .vite removida!
)

echo [2/4] Limpando cache do navegador...
echo Por favor, limpe o cache do navegador (Ctrl+Shift+Delete)
timeout /t 3 /nobreak >nul

echo [3/4] Verificando dependencias...
if not exist node_modules (
    echo Instalando dependencias...
    call npm install
)

echo [4/4] Iniciando servidor com pre-bundling forcado...
echo.
echo ========================================
echo Servidor iniciando...
echo ========================================
echo.
call npm run dev

pause
