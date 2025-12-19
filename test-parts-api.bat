@echo off
echo ========================================
echo  TESTE DA API DE COMPATIBILIDADE DE PECAS
echo ========================================
echo.

echo [1/4] Testando /api/parts-full/stats...
curl -s http://localhost:3001/api/parts-full/stats | findstr /C:"totalVehicles"
if %ERRORLEVEL% EQU 0 (
    echo    [OK] Stats funcionando!
) else (
    echo    [ERRO] Stats nao respondeu
)
echo.

echo [2/4] Testando /api/parts-full/platforms...
curl -s http://localhost:3001/api/parts-full/platforms | findstr /C:"VW_PQ24"
if %ERRORLEVEL% EQU 0 (
    echo    [OK] Platforms funcionando!
) else (
    echo    [ERRO] Platforms nao respondeu
)
echo.

echo [3/4] Testando /api/parts-full/search?brand=Volkswagen...
curl -s "http://localhost:3001/api/parts-full/search?brand=Volkswagen&limit=5" | findstr /C:"vehicleId"
if %ERRORLEVEL% EQU 0 (
    echo    [OK] Search funcionando!
) else (
    echo    [ERRO] Search nao respondeu
)
echo.

echo [4/4] Testando /api/parts-full/categories...
curl -s http://localhost:3001/api/parts-full/categories | findstr /C:"oil_filters"
if %ERRORLEVEL% EQU 0 (
    echo    [OK] Categories funcionando!
) else (
    echo    [ERRO] Categories nao respondeu
)
echo.

echo ========================================
echo  TESTE CONCLUIDO!
echo ========================================
echo.
echo Para iniciar o sistema:
echo   1. Backend: cd server ^& npm start
echo   2. Frontend: npm run dev
echo   3. Acesse: http://localhost:5173/parts-compatibility
echo.
pause
