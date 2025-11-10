# Limpar qualquer sessão que não seja dos super admins
Write-Host "Limpando sessões incorretas..." -ForegroundColor Yellow

Get-ChildItem "whatsapp_sessions" -Directory | Where-Object { 
    $_.Name -notlike "empresa-super-admin-*" 
} | ForEach-Object {
    Write-Host "Removendo sessão: $($_.Name)" -ForegroundColor Red
    Remove-Item $_.FullName -Recurse -Force
}

Write-Host "Limpeza concluída!" -ForegroundColor Green
Write-Host "Sessões restantes:" -ForegroundColor Cyan
Get-ChildItem "whatsapp_sessions" -Directory | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor White }
