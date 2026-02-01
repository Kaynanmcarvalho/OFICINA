const fs = require('fs');
const glob = require('glob');

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // 1. Remover linhas órfãs
    content = content.replace(/^\s+\);\s*$/gm, '');
    content = content.replace(/^\s+`\);\s*$/gm, '');
    content = content.replace(/^\s+:\s*['"`][^'"`]*\);\s*$/gm, '');
    content = content.replace(/^\s+\+\s*['"`][^'"`]*\);\s*$/gm, '');
    content = content.replace(/^\s+\.\s*$/gm, '');
    content = content.replace(/^\s+\.\s*join\([^)]+\)\s*`\);\s*$/gm, '');
    content = content.replace(/^\s+\.\s*toFixed\([^)]+\)\s*}\s*s\s*`\);\s*$/gm, '');
    content = content.replace(/^\s+!\s+Usando\s+ID:.*$/gm, '');
    content = content.replace(/^\s+-\s+empresaId:.*$/gm, '');
    content = content.replace(/^\s+:\s*\$\{[^}]+\}\s*veículos.*$/gm, '');
    
    // 2. Corrigir filter/map sem fechamento
    // Padrão: .filter(...\n\n  const
    content = content.replace(/(\.[a-z]+\([^)]*\))\s*\n\s*\n\s+(const|function|return|if|export)/gm, '$1\n  );\n\n  $2');
    
    // 3. Corrigir JSX sem return
    // Padrão: </tag>\n\n  }\n\n  (palavra)
    content = content.replace(/(<\/[^>]+>)\s*\n\s*\n\s*}\s*\n\s*\n\s*(const|function|return|if|export|[A-Z])/gm, '$1\n  );\n}\n\n$2');
    
    // 4. Corrigir JSX sem return (variação com };)
    content = content.replace(/(<\/[^>]+>)\s*\n\s*\n\s*};\s*\n\s*\n\s*(const|function|return|if|export|[A-Z])/gm, '$1\n  );\n};\n\n$2');
    
    // 5. Corrigir JSX sem return (variação com });)
    content = content.replace(/(<\/[^>]+>)\s*\n\s*\n\s*}\);\s*\n\s*\n\s*(const|function|return|if|export|[A-Z])/gm, '$1\n  );\n});\n\n$2');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

const files = glob.sync('src/**/*.{js,jsx,ts,tsx}', { nodir: true });
console.log(`🔍 Scanning ${files.length} files...`);

let fixedCount = 0;
files.forEach(file => {
  if (fixFile(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
