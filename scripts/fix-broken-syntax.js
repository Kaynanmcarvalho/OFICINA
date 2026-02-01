const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Padrões de código quebrado para corrigir
const patterns = [
  // Template strings quebrados
  { regex: /^\s+\);\s*$/gm, replacement: '' },
  { regex: /^\s+`\);\s*$/gm, replacement: '' },
  { regex: /^\s+:\s*['"`][^'"`]*$/gm, replacement: '' },
  { regex: /^\s+\+\s*['"`][^'"`]*$/gm, replacement: '' },
  { regex: /^\s+\.\s*$/gm, replacement: '' },
  { regex: /^\s+}\s*%\s*\(R\$\s*\$\{[^}]+\}\)\s*`\);\s*$/gm, replacement: '' },
  { regex: /^\s+\.\s*join\([^)]+\)\s*`\);\s*$/gm, replacement: '' },
  { regex: /^\s+\.\s*toFixed\([^)]+\)\s*}\s*s\s*`\);\s*$/gm, replacement: '' },
  { regex: /^\s+!\s+Usando\s+ID:['"`][^'"`]*$/gm, replacement: '' },
  { regex: /^\s+-\s+empresaId:['"`][^'"`]*$/gm, replacement: '' },
  { regex: /^\s+:\s*\$\{[^}]+\}\s*veículos\s*`\);\s*$/gm, replacement: '' },
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
