const fs = require('fs');

const file = 'src/features/parts-compatibility/services/partsCompatibilityService.ts';
let content = fs.readFileSync(file, 'utf8');

// Corrigir padrões de filter sem fechamento
content = content.replace(
  /(\.filter\([^)]+\n\s+[^)]+)\n\s+\n\s+\}/g,
  '$1\n        )\n      }'
);

fs.writeFileSync(file, content, 'utf8');
console.log('✓ Corrigido');
