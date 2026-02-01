Write-Host "🔧 Corrigindo todos os stores..." -ForegroundColor Cyan

$files = @(
    "src/store/productStore.jsx",
    "src/store/authStore.jsx",
    "src/store/notificationStore.jsx",
    "src/store/caixaStore.js",
    "src/store/budgetStore.jsx",
    "src/store/clientStore.jsx",
    "src/store/inventoryStore.jsx",
    "src/store/teamStore.jsx",
    "src/store/checkinStore.jsx",
    "src/store/reportsStore.jsx"
)

$fixed = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $original = $content
        
        # Padrão 1: where(...) seguido de linha vazia e const
        $content = $content -replace '(where\([^\)]+\))\s*\n\s*\n\s+(const|let|var)', '$1' + [Environment]::NewLine + '      );' + [Environment]::NewLine + [Environment]::NewLine + '      $2'
        
        # Padrão 2: orderBy(...) seguido de linha vazia e const/}
        $content = $content -replace '(orderBy\([^\)]+\))\s*\n\s*\n\s+(const|let|var|\})', '$1' + [Environment]::NewLine + '      );' + [Environment]::NewLine + [Environment]::NewLine + '      $2'
        
        # Padrão 3: limit(...) seguido de linha vazia e const/}
        $content = $content -replace '(limit\(\d+\))\s*\n\s*\n\s+(const|let|var|\})', '$1' + [Environment]::NewLine + '      );' + [Environment]::NewLine + [Environment]::NewLine + '      $2'
        
        if ($content -ne $original) {
            Set-Content $file -Value $content -NoNewline
            Write-Host "  ✅ $file" -ForegroundColor Green
            $fixed++
        }
    }
}

Write-Host "`n✅ Total corrigido: $fixed arquivos" -ForegroundColor Green
Write-Host "`n🔨 Executando build..." -ForegroundColor Cyan
npm run build
