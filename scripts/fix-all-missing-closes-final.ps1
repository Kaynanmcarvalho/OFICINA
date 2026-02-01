# Script para corrigir TODOS os erros de sintaxe de uma vez
$ErrorActionPreference = "Stop"

Write-Host "🔧 Corrigindo TODOS os erros de sintaxe..." -ForegroundColor Cyan

$iteration = 0
$maxIterations = 100

while ($iteration -lt $maxIterations) {
    $iteration++
    Write-Host "`n📍 Iteração $iteration/$maxIterations" -ForegroundColor Yellow
    
    # Executar build e capturar erro
    $buildOutput = npm run build 2>&1 | Out-String
    
    if ($buildOutput -match "✓.*modules transformed" -and $buildOutput -notmatch "ERROR:") {
        Write-Host "`n✅✅✅ BUILD PASSOU! Sistema estável." -ForegroundColor Green
        exit 0
    }
    
    # Extrair informação do erro
    if ($buildOutput -match 'file: ([^\r\n]+):(\d+):(\d+)') {
        $filePath = $matches[1]
        $lineNum = [int]$matches[2]
        $colNum = [int]$matches[3]
        
        # Converter para caminho relativo
        $relativePath = $filePath -replace '.*[/\\](src[/\\].+)$', '$1' -replace '\\', '/'
        
        Write-Host "   Arquivo: $relativePath" -ForegroundColor White
        Write-Host "   Linha: $lineNum" -ForegroundColor White
        
        $fullPath = Join-Path $PWD $relativePath
        
        if (-not (Test-Path $fullPath)) {
            Write-Host "   ❌ Arquivo não encontrado" -ForegroundColor Red
            exit 1
        }
        
        $content = Get-Content $fullPath -Raw
        $lines = $content -split "`n"
        
        $fixed = $false
        $targetLine = $lineNum - 1
        
        # PADRÃO 1: Linha anterior termina com /> ou </tag> ou ) ou ], próxima linha vazia, depois }
        if ($targetLine -gt 0 -and $lines[$targetLine].Trim() -match '^[\}\)]') {
            for ($i = $targetLine - 1; $i -ge [Math]::Max(0, $targetLine - 10); $i--) {
                $prevLine = $lines[$i].Trim()
                if ($prevLine -match '/>$|</\w+>$|^\)$|^\];?$') {
                    if ($lines[$i + 1].Trim() -eq '' -or $lines[$i + 1].Trim() -match '^[\}\)]') {
                        $indent = ($lines[$i] -replace '\S.*$', '')
                        $lines[$i + 1] = "$indent  );"
                        $fixed = $true
                        break
                    }
                }
            }
        }
        
        # PADRÃO 2: Linha anterior tem query( ou filter( ou map( sem fechar
        if (-not $fixed -and $targetLine -gt 0) {
            for ($i = $targetLine - 1; $i -ge [Math]::Max(0, $targetLine - 15); $i--) {
                $prevLine = $lines[$i].Trim()
                if ($prevLine -match '(query|filter|map|reduce|collection|where|orderBy|limit)\([^)]*$') {
                    $indent = ($lines[$i] -replace '\S.*$', '')
                    $lines[$i] = $lines[$i].TrimEnd() + "`n$indent      );"
                    $fixed = $true
                    break
                }
            }
        }
        
        if ($fixed) {
            $newContent = $lines -join "`n"
            [System.IO.File]::WriteAllText($fullPath, $newContent)
            Write-Host "   ✅ Corrigido" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Padrão não reconhecido" -ForegroundColor Red
            Write-Host "`nContexto:" -ForegroundColor Yellow
            for ($i = [Math]::Max(0, $targetLine - 3); $i -le [Math]::Min($lines.Length - 1, $targetLine + 2); $i++) {
                Write-Host "   $($i + 1): $($lines[$i])"
            }
            exit 1
        }
    } else {
        Write-Host "   ❌ Erro não identificável" -ForegroundColor Red
        Write-Host $buildOutput
        exit 1
    }
}

Write-Host "`n❌ Limite de $maxIterations iterações atingido" -ForegroundColor Red
exit 1
