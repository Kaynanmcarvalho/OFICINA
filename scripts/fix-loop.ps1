$ErrorActionPreference = "Continue"
$maxAttempts = 50
$attempt = 0

Write-Host "🔥 CORREÇÃO EM LOOP ATÉ BUILD PASSAR`n" -ForegroundColor Cyan

while ($attempt -lt $maxAttempts) {
    $attempt++
    Write-Host "`n🔄 Tentativa $attempt/$maxAttempts" -ForegroundColor Yellow
    
    # Executar build e capturar saída
    $buildOutput = npm run build 2>&1 | Out-String
    
    # Verificar se passou
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅✅✅ BUILD PASSOU! FINALMENTE! ✅✅✅`n" -ForegroundColor Green
        exit 0
    }
    
    # Extrair arquivo e linha do erro
    if ($buildOutput -match 'file:\s*([^:]+):(\d+):') {
        $file = $matches[1].Trim()
        $line = [int]$matches[2]
        
        Write-Host "📍 Erro em: $file linha $line" -ForegroundColor Red
        
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            $lines = $content -split "`n"
            
            # Estratégia 1: Procurar linha vazia antes de } e adicionar );
            $fixed = $false
            for ($i = 0; $i -lt $lines.Count - 2; $i++) {
                $curr = $lines[$i]
                $next = $lines[$i + 1]
                $after = $lines[$i + 2]
                
                # Padrão: linha termina com || ou && seguida de vazia e }
                if (($curr -match '\|\|\s*$' -or $curr -match '&&\s*$') -and 
                    $next.Trim() -eq '' -and 
                    ($after.Trim() -match '^[\}\)]')) {
                    $lines[$i + 1] = '      );'
                    $fixed = $true
                    break
                }
                
                # Padrão: </tag> seguido de vazia e }}
                if ($curr -match '</\w+>\s*$' -and 
                    $next.Trim() -eq '' -and 
                    $after.Trim() -eq '}}') {
                    $lines[$i + 1] = '                  );'
                    $fixed = $true
                    break
                }
                
                # Padrão: </div> seguido de vazia e }
                if ($curr -match '</div>\s*$' -and 
                    $next.Trim() -eq '' -and 
                    $after.Trim() -match '^[\}]') {
                    $lines[$i + 1] = '  );'
                    $fixed = $true
                    break
                }
            }
            
            if ($fixed) {
                $lines -join "`n" | Set-Content $file -NoNewline
                Write-Host "   ✅ Corrigido!" -ForegroundColor Green
                continue
            }
            
            Write-Host "   ⚠️ Não consegui corrigir automaticamente" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n❌ Falhou na tentativa $attempt" -ForegroundColor Red
    Start-Sleep -Milliseconds 500
}

Write-Host "`n⚠️ Atingido limite de $maxAttempts tentativas" -ForegroundColor Red
exit 1
