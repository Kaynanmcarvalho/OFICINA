const fs = require('fs');
const path = require('path');

const files = [
  'src/features/parts-compatibility/hooks/usePartsCompatibility.ts',
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`Arquivo não encontrado: ${file}`);
    return;
  }

  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Padrão: linha com apenas ); seguida de linha em branco e depois const/export/function
  // Corrigir: adicionar ); antes do const/export/function
  const pattern1 = /(\n\s*),\s*\[([^\]]+)\]\s*\n\s*\n\s*(\/\*\*|const|export|function)/g;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, '$1,\n    [$2]\n  );\n\n  $3');
    modified = true;
  }

  // Padrão: empresaId seguido diretamente de setAlternatives
  const pattern2 = /(\s+empresaId\s*)\n\s+(setAlternatives)/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, '$1\n          );\n\n          $2');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✓ Corrigido: ${file}`);
  } else {
    console.log(`- Sem alterações: ${file}`);
  }
});

console.log('\nConcluído!');
