Write-Host "🔧 Removendo fechamentos extras..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "src" -Recurse -Include *.jsx,*.js | Where-Object { $_.FullName -notmatch "node_modules" }

$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Padrão: filter(... seguido de );  e depois s.date ou outro código
    $content = $content -replace '(\s+const \w+ = \w+\.filter\([^)]+\)\s*\n\s+)\);\s*\n(\s+\w+\.)', '$1$2'
    
    # Padrão: reduce(... seguido de linha vazia e const
    $content = $content -replace '(reduce\([^)]+\), \d+)\s*\n\s*\n\s+(//|const)', '$1' + [Environment]::NewLine + '    );' + [Environment]::NewLine + [Environment]::NewLine + '    $2'
    
    if ($content -ne $original) {
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "  ✅ $($file.Name)" -ForegroundColor Green
        $totalFixed++
    }
}

Write-Host "`n✅ Total: $totalFixed arquivos corrigidos" -ForegroundColor Green
Write-Host "`n🔨 Executando build final..." -ForegroundColor Cyan
npm run build
