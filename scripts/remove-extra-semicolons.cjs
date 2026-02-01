const fs = require('fs');
const path = require('path');

console.log('🧹 Removendo linhas com apenas ");"\n');

const filePath = 'src/pages/checkin/componentes/ModalEditarCheckin.jsx';
const fullPath = path.join(process.cwd(), filePath);

let content = fs.readFileSync(fullPath, 'utf8');
const lines = content.split('\n');

// Remover linhas que contêm apenas espaços e ");
const cleanedLines = lines.filter(line => {
  const trimmed = line.trim();
  return trimmed !== ');';
});

content = cleanedLines.join('\n');
fs.writeFileSync(fullPath, content, 'utf8');

console.log(`✅ Arquivo limpo: ${filePath}`);
console.log(`   Linhas removidas: ${lines.length - cleanedLines.length}\n`);
