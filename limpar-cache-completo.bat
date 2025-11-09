@echo off
echo ========================================
echo Limpeza Completa de Cache - TORQ
echo ========================================
echo.

echo [1/6] Parando processos Node.js...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Removendo node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules removido com sucesso!
) else (
    echo node_modules nao encontrado.
)

echo [3/6] Removendo cache do npm...
call npm cache clean --force

echo [4/6] Removendo cache do Vite...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo Cache do Vite removido!
)

if exist .vite (
    rmdir /s /q .vite
    echo Pasta .vite removida!
)

echo [5/6] Removendo dist...
if exist dist (
    rmdir /s /q dist
    echo Pasta dist removida!
)

echo [6/6] Reinstalando dependencias...
call npm install

echo.
echo ========================================
echo Limpeza concluida com sucesso!
echo ========================================
echo.
echo Para iniciar o servidor, execute: npm run dev
echo.
pause
