const fs = require('fs');
const glob = require('glob');

// Encontrar todos os arquivos TS/TSX/JS/JSX
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  ignore: ['**/node_modules/**', '**/dist/**']
});

let totalFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  const original = content;

  // Padrão 1: empresaId/tenantId seguido de código sem )
  if (content.match(/(\s+empresaId|\s+tenantId)\s*\n\s+(set|if|const|return)/)) {
    content = content.replace(
      /(\s+empresaId|\s+tenantId)\s*\n\s+(set|if|const|return)/g,
      '$1\n      );\n\n      $2'
    );
    modified = true;
  }

  // Padrão 2: filter/map/find sem fechamento
  if (content.match(/\.(filter|map|find)\([^)]+\n\s+[^)]+\n\s+\n\s+\}/)) {
    content = content.replace(
      /(\.(filter|map|find)\([^)]+\n\s+[^)]+)\n\s+\n\s+\}/g,
      '$1\n        )\n      }'
    );
    modified = true;
  }

  // Padrão 3: [deps] seguido de comentário/const sem )
  if (content.match(/,\s*\[[^\]]+\]\s*\n\s*\n\s*(\/\*\*|const|export)/)) {
    content = content.replace(
      /,\s*\[([^\]]+)\]\s*\n\s*\n\s*(\/\*\*|const|export)/g,
      ',\n    [$1]\n  );\n\n  $2'
    );
    modified = true;
  }

  // Padrão 4: função/componente terminando com } sem );
  if (content.match(/\n\s+\}\n\s+\n\s*\};\s*\n\s*\n\s*(\/\/|export|const|interface)/)) {
    content = content.replace(
      /(\n\s+\})\n\s+\n\s*\};\s*\n\s*\n\s*(\/\/|export|const|interface)/g,
      '$1\n  );\n};\n\n$2'
    );
    modified = true;
  }

  if (modified && content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalFixed++;
    console.log(`✓ ${file}`);
  }
});

console.log(`\n✓ Total de arquivos corrigidos: ${totalFixed}`);
