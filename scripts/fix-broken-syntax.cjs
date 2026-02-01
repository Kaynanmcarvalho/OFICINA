const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Padrões de código quebrado para corrigir
const patterns = [
  // Linhas órfãs com apenas );
  { regex: /^\s+\);\s*$/gm, replacement: '' },
  // Template strings quebrados
  { regex: /^\s+`\);\s*$/gm, replacement: '' },
  // Linhas começando com : (resto de template string)
  { regex: /^\s+:\s*['"`][^'"`]*\);\s*$/gm, replacement: '' },
  // Linhas começando com + (concatenação quebrada)
  { regex: /^\s+\+\s*['"`][^'"`]*\);\s*$/gm, replacement: '' },
  // Linhas com apenas .
  { regex: /^\s+\.\s*$/gm, replacement: '' },
  // Linhas com .join quebrado
  { regex: /^\s+\.\s*join\([^)]+\)\s*`\);\s*$/gm, replacement: '' },
  // Linhas com .toFixed quebrado
  { regex: /^\s+\.\s*toFixed\([^)]+\)\s*}\s*s\s*`\);\s*$/gm, replacement: '' },
  // Linhas com ! Usando ID:
  { regex: /^\s+!\s+Usando\s+ID:.*$/gm, replacement: '' },
  // Linhas com - empresaId:
  { regex: /^\s+-\s+empresaId:.*$/gm, replacement: '' },
  // Linhas com : ${...} veículos
  { regex: /^\s+:\s*\$\{[^}]+\}\s*veículos.*$/gm, replacement: '' },
  // Fechar parênteses antes de } isolado
  { regex: /(<\/[^>]+>)\s*\n\s*}\s*\n\s*if\s*\(/gm, replacement: '$1\n    );\n  }\n\n  if (' },
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    patterns.forEach(({ regex, replacement }) => {
      const newContent = content.replace(regex, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
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

// Buscar todos os arquivos .js, .jsx, .ts, .tsx no src
const files = glob.sync('src/**/*.{js,jsx,ts,tsx}', { nodir: true });

console.log(`🔍 Scanning ${files.length} files...`);

let fixedCount = 0;
files.forEach(file => {
  if (fixFile(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);
