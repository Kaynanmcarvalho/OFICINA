const fs = require('fs');
const glob = require('glob');

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // Padrão 1: Remover linhas órfãs com apenas );
    content = content.replace(/^\s+\);\s*$/gm, '');
    
    // Padrão 2: Remover linhas com template strings quebrados
    content = content.replace(/^\s+`\);\s*$/gm, '');
    content = content.replace(/^\s+:\s*['"`][^'"`]*\);\s*$/gm, '');
    content = content.replace(/^\s+\+\s*['"`][^'"`]*\);\s*$/gm, '');
    content = content.replace(/^\s+\.\s*$/gm, '');
    content = content.replace(/^\s+\.\s*join\([^)]+\)\s*`\);\s*$/gm, '');
    content = content.replace(/^\s+\.\s*toFixed\([^)]+\)\s*}\s*s\s*`\);\s*$/gm, '');
    content = content.replace(/^\s+!\s+Usando\s+ID:.*$/gm, '');
    content = content.replace(/^\s+-\s+empresaId:.*$/gm, '');
    content = content.replace(/^\s+:\s*\$\{[^}]+\}\s*veículos.*$/gm, '');
    
    // Padrão 3: Corrigir fechamento de JSX sem return
    // Procurar por padrão: </tag>\n\n  }\n\n  (if|return|const)
    content = content.replace(/(<\/[^>]+>)\s*\n\s*\n\s*}\s*\n\s*\n\s*(if|return|const|export)/gm, '$1\n  );\n}\n\n$2');
    
    // Padrão 4: Corrigir fechamento de JSX sem return (variação)
    // Procurar por: </tag>\n\n  };\n\nexport
    content = content.replace(/(<\/[^>]+>)\s*\n\s*\n\s*};\s*\n\s*\n\s*export/gm, '$1\n  );\n};\n\nexport');
    
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
