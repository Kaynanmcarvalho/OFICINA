const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Corrigindo TODOS os erros de sintaxe...\n');

let iteration = 0;
const maxIterations = 100;

while (iteration < maxIterations) {
  iteration++;
  console.log(`📍 Iteração ${iteration}/${maxIterations}`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf8' });
    console.log('\n✅✅✅ BUILD PASSOU! Sistema estável.\n');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Extrair informação do erro
    const match = output.match(/file: ([^\r\n]+):(\d+):(\d+)/);
    if (!match) {
      console.log('❌ Erro não identificável');
      process.exit(1);
    }
    
    const [, filePath, line, col] = match;
    const relativePath = filePath.replace(/^.*[\\\/](src[\\\/].+)$/, '$1').replace(/\\/g, '/');
    
    console.log(`   ${relativePath}:${line}:${col}`);
    
    const fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado`);
      process.exit(1);
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    const lineNum = parseInt(line) - 1;
    let fixed = false;
    
    // PADRÃO 1: Linha anterior termina com /> ou </tag> ou ) ou ], próxima linha vazia, depois }
    if (lineNum > 0 && lines[lineNum].trim().match(/^[\}\)]/)) {
      for (let i = lineNum - 1; i >= Math.max(0, lineNum - 10); i--) {
        const prevLine = lines[i].trim();
        if (prevLine.match(/\/>$|<\/\w+>$|^\)$|^\];?$/)) {
          if (lines[i + 1].trim() === '' || lines[i + 1].trim().match(/^[\}\)]/)) {
            const indent = lines[i].match(/^(\s*)/)[1];
            lines[i + 1] = indent + '  );';
            fixed = true;
            break;
          }
        }
      }
    }
    
    // PADRÃO 2: Linha anterior tem query( ou filter( ou map( sem fechar
    if (!fixed && lineNum > 0) {
      for (let i = lineNum - 1; i >= Math.max(0, lineNum - 15); i--) {
        const prevLine = lines[i].trim();
        if (prevLine.match(/(query|filter|map|reduce|collection|where|orderBy|limit)\([^)]*$/)) {
          const indent = lines[i].match(/^(\s*)/)[1];
          lines[i] = lines[i].trimEnd() + '\n' + indent + '      );';
          fixed = true;
          break;
        }
      }
    }
    
    if (fixed) {
      content = lines.join('\n');
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`   ✅ Corrigido\n`);
    } else {
      console.log(`   ❌ Padrão não reconhecido\n`);
      console.log('Contexto:');
      for (let i = Math.max(0, lineNum - 3); i <= Math.min(lines.length - 1, lineNum + 2); i++) {
        console.log(`   ${i + 1}: ${lines[i]}`);
      }
      process.exit(1);
    }
  }
}

console.log(`\n❌ Limite de ${maxIterations} iterações atingido`);
process.exit(1);
