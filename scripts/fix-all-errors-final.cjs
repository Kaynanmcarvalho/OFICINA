const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Correção automática FINAL de todos os erros...\n');

let iteration = 0;
const maxIterations = 100;

while (iteration < maxIterations) {
  iteration++;
  console.log(`📍 Iteração ${iteration}/${maxIterations}`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf8' });
    console.log('\n✅✅✅ BUILD PASSOU! Sistema estável e pronto para uso.\n');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    const errorMatch = output.match(/(.+?):(\d+):(\d+): ERROR: (.+)/);
    
    if (!errorMatch) {
      console.log('❌ Erro não identificável');
      process.exit(1);
    }
    
    const [, filePath, line, col, errorMsg] = errorMatch;
    const relativePath = filePath.replace(/^.*[\\\/](src[\\\/].+)$/, '$1').replace(/\\/g, '/');
    
    console.log(`   ${relativePath}:${line}:${col}`);
    console.log(`   ${errorMsg}`);
    
    const fullPath = path.join(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado`);
      process.exit(1);
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    const lineNum = parseInt(line) - 1;
    let fixed = false;
    
    // TIPO 1: Expected ")" but found "}"
    if (errorMsg.includes('Expected ")"') && errorMsg.includes('"}"')) {
      for (let i = lineNum - 1; i >= Math.max(0, lineNum - 15); i--) {
        const prevLine = lines[i];
        const nextLine = lines[i + 1];
        
        if ((prevLine.trim().endsWith('/>') || prevLine.trim().match(/<\/\w+>$/) || 
             prevLine.trim() === ')' || prevLine.trim().match(/\[[\w,\s]*\]$/)) &&
            nextLine.trim() === '' && lines[lineNum].trim().match(/^\}/) ) {
          const indent = lines[i].match(/^(\s*)/)[1];
          lines[i + 1] = indent + '  );';
          fixed = true;
          break;
        }
      }
      
      if (!fixed && lineNum > 0 && lines[lineNum - 1].trim() === '') {
        const indent = lines[lineNum].match(/^(\s*)/)[1];
        lines[lineNum - 1] = indent + '  );';
        fixed = true;
      }
    }
    
    // TIPO 2: Expected ")" but found "const" ou "if" ou identificador
    if (errorMsg.includes('Expected ")"') && !errorMsg.includes('"}"')) {
      for (let i = lineNum - 1; i >= Math.max(0, lineNum - 15); i--) {
        const prevLine = lines[i].trim();
        
        // Procura por chamadas de função sem fechar parênteses
        if (prevLine.match(/\w+\([^)]*$/) || prevLine.match(/collection\([^)]*$/)) {
          // Adiciona ) no final da linha anterior
          lines[i] = lines[i].trimEnd() + '\n' + lines[i].match(/^(\s*)/)[1] + '      );';
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
