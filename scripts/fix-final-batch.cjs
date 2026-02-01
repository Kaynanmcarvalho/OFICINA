const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/pages/CaixaPremium.jsx',
    search: /(\s+const cartTotal = useMemo\(\(\) =>\s+cartItems\.reduce\(\(sum, item\) => sum \+ \(item\.preco \* item\.quantidade\), 0\),\s+\[cartItems\]\n\n)/,
    replace: '$1  );\n'
  },
  {
    file: 'src/pages/CaixaPremium.jsx',
    search: /(\s+const cartItemsCount = useMemo\(\(\) =>\s+cartItems\.reduce\(\(sum, item\) => sum \+ item\.quantidade, 0\),\s+\[cartItems\]\n\n)/,
    replace: '$1  );\n'
  }
];

let totalFixed = 0;

fixes.forEach(({ file, search, replace }) => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Arquivo não encontrado: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;
  
  content = content.replace(search, replace);
  
  if (content !== before) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigido: ${file}`);
    totalFixed++;
  }
});

console.log(`\n✅ Total de arquivos corrigidos: ${totalFixed}`);
