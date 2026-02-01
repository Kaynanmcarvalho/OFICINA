const fs = require('fs');
const { execSync } = require('child_process');

console.log('Corrigindo erros de fechamento de return...\n');

let iteration = 0;
const maxIterations = 100;

while (iteration < maxIterations) {
  iteration++;
  console.log(`\nIteracao ${iteration}/${maxIterations}`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf-8' });
    console.log('\n✅ BUILD PASSOU! Todos os erros corrigidos.');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Procura por erro: Expected ")" but found "}"
    const match = output.match(/([^:\n]+):(\d+):(\d+):\s*ERROR:\s*Expected "\)" but found "}"/);
    
    if (!match) {
      console.log('Nenhum erro de fechamento encontrado.');
      console.log('\nOutput do build:');
      console.log(output.substring(0, 500));
      process.exit(1);
    }
    
    const [, filePath, line] = match;
    const lineNum = parseInt(line);
    
    console.log(`   ${filePath}:${lineNum}`);
    console.log(`   Falta ")" antes de "}"`);
    
    // Lê o arquivo
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Encontra a linha com o erro
    if (lineNum > 0 && lineNum <= lines.length) {
      const errorLine = lines[lineNum - 1];
      
      // Verifica se é um })} sem o ) do return
      if (errorLine.includes('})}')) {
        // Procura a linha anterior com </motion.button> ou similar
        let fixLine = lineNum - 1;
        while (fixLine > 0 && fixLine > lineNum - 10) {
          const prevLine = lines[fixLine - 1];
          if (prevLine.includes('</motion.button>') || prevLine.includes('</button>') || prevLine.includes('</div>')) {
            // Adiciona ); depois dessa linha
            lines[fixLine - 1] = prevLine;
            // Adiciona nova linha com );
            lines.splice(fixLine, 0, '                          );');
            
            console.log(`   ✓ Adicionado "); na linha ${fixLine + 1}`);
            
            // Salva o arquivo
            fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
            break;
          }
          fixLine--;
        }
      } else {
        console.log(`   Padrao nao reconhecido: ${errorLine.trim()}`);
        process.exit(1);
      }
    }
  }
}

console.log('\n⚠️ Atingiu limite de iteracoes');
process.exit(1);
