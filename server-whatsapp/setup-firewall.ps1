# Script para configurar Firewall do Windows para WhatsApp Server
# Execute como Administrador: Clique com botão direito > Executar como Administrador

Write-Host "Configurando Firewall do Windows para WhatsApp Server..." -ForegroundColor Green

# Adicionar regra de entrada para porta 5000
netsh advfirewall firewall add rule name="WhatsApp Server - Porta 5000" dir=in action=allow protocol=TCP localport=5000

# Adicionar regra para Node.js
$nodePath = (Get-Command node).Source
netsh advfirewall firewall add rule name="WhatsApp Server - Node.js" dir=in action=allow program="$nodePath" enable=yes

Write-Host ""
Write-Host "Firewall configurado com sucesso!" -ForegroundColor Green
Write-Host "Regras criadas:" -ForegroundColor Yellow
Write-Host "  - WhatsApp Server - Porta 5000" -ForegroundColor Cyan
Write-Host "  - WhatsApp Server - Node.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
