const fs = require('fs');

const file = 'src/features/parts-compatibility/hooks/usePartsCompatibility.ts';
let content = fs.readFileSync(file, 'utf8');

// Corrigir todos os padrões de empresaId seguido de setXXX ou outro código
content = content.replace(
  /(\s+empresaId\s*)\n\s+(setVehicleProfile|setAlternatives)/g,
  '$1\n        );\n\n        $2'
);

// Corrigir padrões de [empresaId] seguido de comentário ou const
content = content.replace(
  /,\s*\[empresaId\]\s*\n\s*\n\s*(\/\*\*|const)/g,
  ',\n    [empresaId]\n  );\n\n  $1'
);

fs.writeFileSync(file, content, 'utf8');
console.log('✓ Arquivo corrigido');
