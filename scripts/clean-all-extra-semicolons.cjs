const fs = require('fs');
const path = require('path');

console.log('Limpando TODOS os arquivos com ); extras...\n');

const files = [
  'src/pages/checkin/componentes/ModalCheckoutPremium.jsx',
  'src/pages/checkin/components/details/CheckinDetailsModal.jsx'
];

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Arquivo nao encontrado: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  
  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim();
    return trimmed !== ');';
  });
  
  const removed = lines.length - cleanedLines.length;
  
  if (removed > 0) {
    content = cleanedLines.join('\n');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`OK ${filePath}`);
    console.log(`   Linhas removidas: ${removed}`);
  } else {
    console.log(`OK ${filePath} (ja limpo)`);
  }
});

console.log('\nLimpeza concluida!\n');
