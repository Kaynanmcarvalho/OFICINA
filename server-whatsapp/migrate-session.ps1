# Script para migrar sessão antiga do WhatsApp para os 3 super admins
Write-Host "Migrando sessão do WhatsApp para super admins..." -ForegroundColor Cyan

# IDs dos super admins
$superAdminIds = @("super-admin-renier", "super-admin-thamires", "super-admin-teste")

# Criar pasta de sessões
if (-not (Test-Path "whatsapp_sessions")) {
    New-Item -ItemType Directory -Path "whatsapp_sessions" | Out-Null
    Write-Host "Pasta whatsapp_sessions criada" -ForegroundColor Green
}

# Copiar sessão para cada super admin
foreach ($adminId in $superAdminIds) {
    $destPath = "whatsapp_sessions/empresa-$adminId"
    
    if (Test-Path $destPath) {
        Write-Host "Sessão já existe para $adminId - pulando" -ForegroundColor Yellow
        continue
    }
    
    if (Test-Path "whatsapp_session") {
        Copy-Item -Path "whatsapp_session" -Destination $destPath -Recurse -Force
        Write-Host "Sessão copiada para $adminId" -ForegroundColor Green
    } else {
        Write-Host "Sessão antiga não encontrada!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Migração concluída!" -ForegroundColor Green
