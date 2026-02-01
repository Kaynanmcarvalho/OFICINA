$ErrorActionPreference = "Continue"
Write-Host "🔧 Corrigindo TODOS os erros automaticamente..." -ForegroundColor Cyan

$iteration = 0
$maxIterations = 100

while ($iteration -lt $maxIterations) {
    $iteration++
    Write-Host "`n━━━ Iteração $iteration/$maxIterations ━━━" -ForegroundColor Yellow
    
    $buildOutput = npm run build 2>&1 | Out-String
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅✅✅ BUILD PASSOU! Todos os erros corrigidos. ✅✅✅" -ForegroundColor Green
        exit 0
    }
    
    # Tipo 1: Expected ")" but found "}"
    if ($buildOutput -match '([^:]+):(\d+):\d+:\s*ERROR:\s*Expected "\)" but found "}"') {
        $file = $matches[1] -replace '.*OFICINA[\\/]', '' -replace '\\', '/'
        $line = [int]$matches[2]
        Write-Host "📍 $file`:$line - Falta ')'" -ForegroundColor Magenta
        
        $content = Get-Content $file -Raw -Encoding UTF8
        $lines = $content -split "`n"
        
        if ($line -gt 0 -and $line -le $lines.Count) {
            $errorLine = $lines[$line - 1]
            
            # Se a linha tem })} ou })
            if ($errorLine -match '\}\)\}|\}\)') {
                # Procura linha anterior com fechamento de tag
                for ($i = $line - 2; $i -ge [Math]::Max(0, $line - 10); $i--) {
                    if ($lines[$i] -match '</.*>|^\s*\)') {
                        $lines = $lines[0..$i] + "                          );" + $lines[($i+1)..($lines.Count-1)]
                        $lines -join "`n" | Set-Content $file -Encoding UTF8 -NoNewline
                        Write-Host "   ✓ Adicionado ');" -ForegroundColor Green
                        break
                    }
                }
            }
            # Se a linha é apenas }
            elseif ($errorLine -match '^\s*\}\s*$') {
                $lines[$line - 2] = $lines[$line - 2] + "`n  );"
                $lines -join "`n" | Set-Content $file -Encoding UTF8 -NoNewline
                Write-Host "   ✓ Adicionado ');" -ForegroundColor Green
            }
        }
        continue
    }
    
    # Tipo 2: Failed to parse source (sintaxe JS inválida)
    if ($buildOutput -match 'Failed to parse source.*file:\s*([^\n]+)') {
        $file = $matches[1] -replace '.*OFICINA[\\/]', '' -replace '\\', '/'
        Write-Host "📍 $file - Sintaxe JS inválida" -ForegroundColor Magenta
        
        # Tenta validar com node
        $nodeCheck = node -c $file 2>&1 | Out-String
        if ($nodeCheck -match ':(\d+)') {
            $errorLine = [int]$matches[1]
            Write-Host "   Erro na linha $errorLine" -ForegroundColor Yellow
            
            $content = Get-Content $file -Raw -Encoding UTF8
            $lines = $content -split "`n"
            
            # Procura por padrões comuns
            for ($i = [Math]::Max(0, $errorLine - 5); $i -lt [Math]::Min($lines.Count, $errorLine + 2); $i++) {
                $line = $lines[$i]
                
                # Padrão: linha vazia antes de }
                if ($i -lt $lines.Count - 1 -and $line -match '^\s*$' -and $lines[$i + 1] -match '^\s*\}\s*$') {
                    if ($i -gt 0 -and $lines[$i - 1] -notmatch '[;\)\}]\s*$') {
                        $lines[$i] = "    );"
                        $lines -join "`n" | Set-Content $file -Encoding UTF8 -NoNewline
                        Write-Host "   ✓ Adicionado ');" -ForegroundColor Green
                        break
                    }
                }
            }
        }
        continue
    }
    
    # Se não reconheceu o erro
    Write-Host "`n❌ Erro não reconhecido" -ForegroundColor Red
    $buildOutput -split "`n" | Select-String "ERROR" | Select-Object -First 3 | ForEach-Object { Write-Host $_ }
    exit 1
}

Write-Host "`n⚠️ Atingiu limite de iterações" -ForegroundColor Yellow
exit 1
