# Script para aplicar correções de isolamento em todos os stores

$stores = @(
    'inventoryStore.jsx',
    'vehicleStore.jsx', 
    'toolStore.jsx',
    'teamStore.jsx',
    'motorcycleStore.jsx'
)

$storesDir = "src/store"

foreach ($storeName in $stores) {
    $filePath = Join-Path $storesDir $storeName
    
    if (-not (Test-Path $filePath)) {
        Write-Host "❌ Arquivo não encontrado: $storeName" -ForegroundColor Red
        continue
    }
    
    Write-Host "`n🔧 Corrigindo: $storeName" -ForegroundColor Cyan
    
    $content = Get-Content $filePath -Raw
    
    # 1. Remover imports do Firebase
    $content = $content -replace "import\s*\{[^}]*collection[^}]*\}\s*from\s*['\"]firebase/firestore['\"];?", ""
    $content = $content -replace "import\s*\{\s*db\s*\}\s*from\s*['\"]\.\.\/config\/firebase['\"];?", ""
    
    # 2. Adicionar import do storeHelpers após import do zustand
    if ($content -notmatch "storeHelpers") {
        $content = $content -replace "(import\s*\{\s*create\s*\}\s*from\s*['\"]zustand['\"];)", "`$1`nimport {`n  addDocument,`n  getAllDocuments,`n  getDocumentById,`n  updateDocument,`n  deleteDocument,`n  subscribeToCollection`n} from '../services/storeHelpers';"
    }
    
    # 3. Substituir addDoc
    $content = $content -replace "await\s+addDoc\(collection\(db,\s*['\"]([^'\"]+)['\"]\),\s*([^)]+)\)", "await addDocument('`$1', `$2)"
    $content = $content -replace "const\s+docRef\s*=\s*await\s+addDocument\([^;]+;\s*const\s+(\w+)\s*=\s*\{\s*\.\.\.([^,]+),\s*firestoreId:\s*docRef\.id\s*\};", "const `$1 = await addDocument"
    
    # 4. Substituir getDocs simples
    $content = $content -replace "await\s+getDocs\(collection\(db,\s*['\"]([^'\"]+)['\"]\)\)", "await getAllDocuments('`$1')"
    
    # 5. Substituir getDocs com query
    $content = $content -replace "const\s+querySnapshot\s*=\s*await\s+getDocs\(q\);", "const querySnapshot = await getAllDocuments"
    
    # 6. Substituir getDoc
    $content = $content -replace "await\s+getDoc\(doc\(db,\s*['\"]([^'\"]+)['\"]\s*,\s*([^)]+)\)\)", "await getDocumentById('`$1', `$2)"
    
    # 7. Substituir updateDoc
    $content = $content -replace "await\s+updateDoc\(doc\(db,\s*['\"]([^'\"]+)['\"]\s*,\s*([^)]+)\),\s*([^)]+)\)", "await updateDocument('`$1', `$2, `$3)"
    
    # 8. Substituir deleteDoc
    $content = $content -replace "await\s+deleteDoc\(doc\(db,\s*['\"]([^'\"]+)['\"]\s*,\s*([^)]+)\)\)", "await deleteDocument('`$1', `$2)"
    
    # Salvar arquivo corrigido
    Set-Content -Path $filePath -Value $content -NoNewline
    
    Write-Host "✅ Corrigido: $storeName" -ForegroundColor Green
}

Write-Host "`n✅ Correções aplicadas em todos os stores!" -ForegroundColor Green
Write-Host "⚠️  IMPORTANTE: Revise manualmente cada store para ajustes finos" -ForegroundColor Yellow
