const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Corrigindo TODOS os erros de build automaticamente...\n');

let iteration = 0;
const maxIterations = 100;

while (iteration < maxIterations) {
  iteration++;
  console.log(`\n━━━ Iteração ${iteration}/${maxIterations} ━━━`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf-8' });
    console.log('\n✅ BUILD PASSOU! Todos os erros corrigidos.');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Tipo 1: Expected ")" but found "}"
    let match = output.match(/([^:\n]+):(\d+):(\d+):\s*ERROR:\s*Expected "\)" but found "}"/);
    
    if (match) {
      const [, filePath, line] = match;
      const lineNum = parseInt(line);
      console.log(`📍 ${filePath}:${lineNum}`);
      console.log(`   Tipo: Falta ")" antes de "}"`);
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      if (lineNum > 0 && lineNum <= lines.length) {
        const errorLine = lines[lineNum - 1];
        
        if (errorLine.includes('})}')) {
          // Procura linha anterior com fechamento de tag
          let fixLine = lineNum - 1;
          while (fixLine > 0 && fixLine > lineNum - 10) {
            const prevLine = lines[fixLine - 1];
            if (prevLine.includes('</motion.button>') || prevLine.includes('</button>') || 
                prevLine.includes('</motion.div>') || prevLine.includes('</div>') ||
                prevLine.includes('</span>')) {
              lines.splice(fixLine, 0, '                          );');
              console.log(`   ✓ Adicionado ");"`);
              fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
              break;
            }
            fixLine--;
          }
        }
      }
      continue;
    }
    
    // Tipo 2: Unterminated regular expression (caracteres especiais mal formatados)
    match = output.match(/([^:\n]+):(\d+):(\d+):\s*ERROR:\s*Unterminated regular expression/);
    
    if (match) {
      const [, filePath, line] = match;
      const lineNum = parseInt(line);
      console.log(`📍 ${filePath}:${lineNum}`);
      console.log(`   Tipo: Caractere especial mal formatado`);
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      // Procura por caracteres mal formatados nas linhas próximas
      for (let i = Math.max(0, lineNum - 10); i < Math.min(lines.length, lineNum + 5); i++) {
        let line = lines[i];
        let fixed = false;
        
        // Corrige caracteres comuns mal formatados
        const replacements = [
          [/SaÃ­da:/g, 'Saída:'],
          [/Ã s /g, 'às '],
          [/Ã© /g, 'é '],
          [/Ã³ /g, 'ó '],
          [/Ã§Ã£o/g, 'ção'],
          [/nÃ£o/g, 'não'],
          [/Ã /g, 'à '],
          [/Ãª/g, 'ê'],
          [/Ã¡/g, 'á'],
          [/Ã­/g, 'í'],
          [/Ãº/g, 'ú'],
          [/Ã£/g, 'ã'],
          [/Ã´/g, 'ô'],
        ];
        
        for (const [pattern, replacement] of replacements) {
          if (pattern.test(line)) {
            line = line.replace(pattern, replacement);
            fixed = true;
          }
        }
        
        if (fixed) {
          lines[i] = line;
          console.log(`   ✓ Corrigido caracteres na linha ${i + 1}`);
        }
      }
      
      fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
      continue;
    }
    
    // Tipo 3: Expected ";" but found ...
    match = output.match(/([^:\n]+):(\d+):(\d+):\s*ERROR:\s*Expected ";" but found/);
    
    if (match) {
      const [, filePath, line] = match;
      const lineNum = parseInt(line);
      console.log(`📍 ${filePath}:${lineNum}`);
      console.log(`   Tipo: Falta ";"`);
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      if (lineNum > 1 && lineNum <= lines.length) {
        const prevLine = lines[lineNum - 2];
        if (!prevLine.trim().endsWith(';') && !prevLine.trim().endsWith('{') && 
            !prevLine.trim().endsWith(',') && !prevLine.trim().endsWith(')')) {
          lines[lineNum - 2] = prevLine + ';';
          console.log(`   ✓ Adicionado ";"`);
          fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
        }
      }
      continue;
    }
    
    // Tipo 4: Unexpected ")"
    match = output.match(/([^:\n]+):(\d+):(\d+):\s*ERROR:\s*Unexpected "\)"/);
    
    if (match) {
      const [, filePath, line] = match;
      const lineNum = parseInt(line);
      console.log(`📍 ${filePath}:${lineNum}`);
      console.log(`   Tipo: ")" extra`);
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      if (lineNum > 0 && lineNum <= lines.length) {
        const errorLine = lines[lineNum - 1];
        // Remove ) extra se for linha com apenas );
        if (errorLine.trim() === ');') {
          lines.splice(lineNum - 1, 1);
          console.log(`   ✓ Removido linha com ");"`);
          fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
        }
      }
      continue;
    }
    
    // Se chegou aqui, erro não reconhecido
    console.log('\n❌ Erro não reconhecido:');
    console.log(output.substring(output.indexOf('error during build:'), 800));
    process.exit(1);
  }
}

console.log('\n⚠️ Atingiu limite de iterações');
process.exit(1);
