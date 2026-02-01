const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Corrigindo TODOS os erros restantes...\n');

// Lista de arquivos conhecidos com problemas de query() sem fechar
const filesToFix = [
  'src/config/productService.js'
];

// Corrige todos os query() sem fechar
for (const file of filesToFix) {
  if (!fs.existsSync(file)) continue;
  
  console.log(`📝 Corrigindo: ${file}`);
  let content = fs.readFileSync(file, 'utf-8');
  
  // Padrão: query( ... where(...) SEM fechar com );
  // Procura por where() seguido de linha vazia ou próxima linha sem );
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';
    
    // Se linha tem where() e próxima linha não tem ); e não é continuação
    if (line.includes("where(") && line.includes(")") && 
        !nextLine.includes(");") && 
        (nextLine.trim() === '' || !nextLine.includes("where(") && !nextLine.includes("orderBy("))) {
      lines[i] = line + '\n      );';
      modified = true;
      console.log(`   ✓ Fechado query na linha ${i + 1}`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(file, lines.join('\n'), 'utf-8');
  }
}

// Agora executa build iterativamente
let iteration = 0;
const maxIterations = 50;

while (iteration < maxIterations) {
  iteration++;
  console.log(`\n━━━ Iteração ${iteration}/${maxIterations} ━━━`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf-8' });
    console.log('\n✅✅✅ BUILD PASSOU! Sistema pronto para usar! ✅✅✅');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Procura por erro de sintaxe JS
    const jsErrorMatch = output.match(/Failed to parse source.*?file:\s*([^\n]+)/);
    if (jsErrorMatch) {
      const file = jsErrorMatch[1].replace(/.*OFICINA[\\/]/, '').replace(/\\/g, '/');
      console.log(`📍 ${file} - Sintaxe inválida`);
      
      try {
        execSync(`node -c "${file}"`, { stdio: 'pipe' });
      } catch (nodeErr) {
        const nodeOut = (nodeErr.stderr || nodeErr.stdout || '').toString();
        const lineMatch = nodeOut.match(/:(\d+)/);
        if (lineMatch) {
          const errorLine = parseInt(lineMatch[1]);
          const content = fs.readFileSync(file, 'utf-8');
          const lines = content.split('\n');
          
          // Procura padrão: linha com where() ou orderBy() sem fechar
          for (let i = Math.max(0, errorLine - 3); i < Math.min(lines.length, errorLine + 1); i++) {
            if ((lines[i].includes('where(') || lines[i].includes('orderBy(')) && 
                lines[i].includes(')') && 
                !lines[i].includes(');')) {
              const nextLine = lines[i + 1] || '';
              if (nextLine.trim() === '' || !nextLine.includes(');')) {
                lines[i] = lines[i] + '\n      );';
                fs.writeFileSync(file, lines.join('\n'), 'utf-8');
                console.log(`   ✓ Fechado na linha ${i + 1}`);
                break;
              }
            }
          }
        }
      }
      continue;
    }
    
    // Erro não reconhecido
    console.log('\n❌ Erro não reconhecido:');
    const errLines = output.split('\n').filter(l => l.includes('ERROR'));
    errLines.slice(0, 2).forEach(l => console.log(l));
    process.exit(1);
  }
}

console.log('\n⚠️ Limite atingido');
process.exit(1);
