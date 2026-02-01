const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Corrigindo TODOS os erros automaticamente...\n');

let iteration = 0;
const maxIterations = 100;

while (iteration < maxIterations) {
  iteration++;
  console.log(`\n━━━ Iteração ${iteration}/${maxIterations} ━━━`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf-8' });
    console.log('\n✅✅✅ BUILD PASSOU! Todos os erros corrigidos. ✅✅✅');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Tipo 1: Expected ")" but found "}"
    let match = output.match(/([^:\n]+):(\d+):\d+:\s*ERROR:\s*Expected "\)" but found "}"/);
    
    if (match) {
      const filePath = match[1].replace(/.*OFICINA[\\/]/, '').replace(/\\/g, '/');
      const lineNum = parseInt(match[2]);
      console.log(`📍 ${filePath}:${lineNum} - Falta ")"`);
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      if (lineNum > 0 && lineNum <= lines.length) {
        const errorLine = lines[lineNum - 1];
        
        // Se a linha é apenas }
        if (errorLine.trim() === '}' && lineNum > 1) {
          lines[lineNum - 2] = lines[lineNum - 2] + '\n  );';
          fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
          console.log(`   ✓ Adicionado ");"`);
          continue;
        }
      }
    }
    
    // Tipo 2: Failed to parse source
    match = output.match(/Failed to parse source.*?file:\s*([^\n]+)/);
    
    if (match) {
      const filePath = match[1].replace(/.*OFICINA[\\/]/, '').replace(/\\/g, '/');
      console.log(`📍 ${filePath} - Sintaxe JS inválida`);
      
      try {
        execSync(`node -c "${filePath}"`, { stdio: 'pipe', encoding: 'utf-8' });
      } catch (nodeError) {
        const nodeOutput = nodeError.stderr || nodeError.stdout || '';
        const lineMatch = nodeOutput.match(/:(\d+)/);
        
        if (lineMatch) {
          const errorLine = parseInt(lineMatch[1]);
          console.log(`   Erro na linha ${errorLine}`);
          
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n');
          
          // Procura por padrões comuns nas linhas próximas
          for (let i = Math.max(0, errorLine - 5); i < Math.min(lines.length, errorLine + 2); i++) {
            const line = lines[i];
            const nextLine = lines[i + 1] || '';
            
            // Padrão: linha vazia antes de }
            if (line.trim() === '' && nextLine.trim() === '}' && i > 0) {
              const prevLine = lines[i - 1];
              if (!prevLine.trim().endsWith(';') && 
                  !prevLine.trim().endsWith(')') && 
                  !prevLine.trim().endsWith('}')) {
                lines[i] = '    );';
                fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
                console.log(`   ✓ Adicionado "); na linha ${i + 1}`);
                break;
              }
            }
          }
        }
      }
      continue;
    }
    
    // Se não reconheceu
    console.log('\n❌ Erro não reconhecido:');
    const errorLines = output.split('\n').filter(l => l.includes('ERROR'));
    errorLines.slice(0, 3).forEach(l => console.log(l));
    process.exit(1);
  }
}

console.log('\n⚠️ Atingiu limite de iterações');
process.exit(1);
