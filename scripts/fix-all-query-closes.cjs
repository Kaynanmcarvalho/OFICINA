const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Corrigindo TODOS os query() sem fechar...\n');

let iteration = 0;
const maxIterations = 50;

while (iteration < maxIterations) {
  iteration++;
  console.log(`Iteracao ${iteration}/${maxIterations}`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf8' });
    console.log('\nBUILD PASSOU! Sistema estavel.\n');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Procurar por erro de query/limit/orderBy/where sem fechar
    const match = output.match(/file: ([^\r\n]+):(\d+):(\d+)/);
    if (!match) {
      console.log('Erro nao identificavel');
      process.exit(1);
    }
    
    const [, filePath, line] = match;
    const relativePath = filePath.replace(/^.*[\\\/](src[\\\/].+)$/, '$1').replace(/\\/g, '/');
    
    console.log(`   ${relativePath}:${line}`);
    
    const fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`Arquivo nao encontrado`);
      process.exit(1);
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    const lineNum = parseInt(line) - 1;
    let fixed = false;
    
    // Procurar por query/limit/orderBy/where sem fechar nos últimos 20 linhas
    for (let i = lineNum - 1; i >= Math.max(0, lineNum - 20); i--) {
      const currentLine = lines[i].trim();
      
      // Se encontrar query( ou limit( ou orderBy( ou where( sem fechar
      if (currentLine.match(/(query|limit|orderBy|where|collection)\s*\([^)]*$/) && 
          !currentLine.includes(');')) {
        
        // Adicionar ); na próxima linha vazia ou antes do const/if
        const indent = lines[i].match(/^(\s*)/)[1];
        
        // Procurar próxima linha que não seja continuação
        for (let j = i + 1; j <= lineNum; j++) {
          if (lines[j].trim() === '' || 
              lines[j].trim().match(/^(const|if|return|\/\/)/)) {
            lines.splice(j, 0, indent + '      );');
            fixed = true;
            break;
          }
        }
        
        if (fixed) break;
      }
    }
    
    if (fixed) {
      content = lines.join('\n');
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`   Corrigido\n`);
    } else {
      console.log(`   Padrao nao reconhecido\n`);
      process.exit(1);
    }
  }
}

console.log(`\nLimite de ${maxIterations} iteracoes atingido`);
process.exit(1);
