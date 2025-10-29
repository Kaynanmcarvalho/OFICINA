# Script para limpar cache do Vite e resolver erro 404

Write-Host "🧹 Limpando cache do Vite..." -ForegroundColor Yellow

# Limpar cache do Vite
if (Test-Path "node_modules/.vite") {
    Remove-Item -Path "node_modules/.vite" -Recurse -Force
    Write-Host "✅ Cache do Vite removido" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Cache do Vite já estava limpo" -ForegroundColor Cyan
}

# Limpar dist se existir
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
    Write-Host "✅ Pasta dist removida" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Cache limpo com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Reinicie o servidor: npm run dev" -ForegroundColor White
Write-Host "2. No navegador, pressione: Ctrl + Shift + R" -ForegroundColor White
Write-Host ""
