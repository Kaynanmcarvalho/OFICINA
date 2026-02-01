const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Corrigindo TODOS os erros de sintaxe automaticamente...\n');

// Lista de arquivos conhecidos com problemas
const filesToFix = [
  'src/config/taxCalculationService.js',
  'src/services/plateApiService.js',
  'src/services/vehicleApiService.js'
];

// Corrige parênteses não fechados em todos os arquivos
for (const filePath of filesToFix) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
      continue;
    }

    console.log(`📝 Corrigindo: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let modified = false;

    // Procura por padrões comuns de erro
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';
      
      // Padrão 1: linha com apenas espaços seguida de }
      if (line.trim() === '' && nextLine.trim() === '}' && i > 0) {
        const prevLine = lines[i - 1];
        // Se linha anterior não termina com ; ou ) ou }, adiciona );
        if (prevLine && !prevLine.trim().endsWith(';') && 
            !prevLine.trim().endsWith(')') && 
            !prevLine.trim().endsWith('}') &&
            !prevLine.trim().endsWith(',')) {
          lines[i] = '    );';
          modified = true;
          console.log(`   ✓ Adicionado "); na linha ${i + 1}`);
        }
      }
      
      // Padrão 2: linha que parece ser fim de função mas sem fechar parêntese
      if (line.includes('throw new Error(') && !line.includes(');')) {
        let j = i + 1;
        while (j < lines.length && !lines[j].includes(');')) {
          if (lines[j].trim() === '' || lines[j].trim() === '}') {
            lines[j - 1] = lines[j - 1] + '\n    );';
            modified = true;
            console.log(`   ✓ Fechado throw new Error na linha ${j}`);
            break;
          }
          j++;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
      console.log(`   ✅ Arquivo corrigido\n`);
    } else {
      console.log(`   ℹ️  Nenhuma correção necessária\n`);
    }
  } catch (error) {
    console.log(`   ❌ Erro ao processar: ${error.message}\n`);
  }
}

// Agora executa o build iterativamente
let iteration = 0;
const maxIterations = 50;

while (iteration < maxIterations) {
  iteration++;
  console.log(`\n━━━ Build Iteração ${iteration}/${maxIterations} ━━━`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf-8' });
    console.log('\n✅✅✅ BUILD PASSOU! Todos os erros corrigidos. ✅✅✅');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Procura por erro de sintaxe JS inválida
    const invalidJsMatch = output.match(/Failed to parse source.*?file:\s*([^\n]+)/);
    if (invalidJsMatch) {
      const filePath = invalidJsMatch[1].replace(/^.*OFICINA[\\/]/, '').replace(/\\/g, '/');
      console.log(`📍 Erro de sintaxe em: ${filePath}`);
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        let fixed = false;
        
        // Procura por throw new Error( sem fechar
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('throw new Error(')) {
            let j = i + 1;
            let foundClose = false;
            while (j < Math.min(lines.length, i + 5)) {
              if (lines[j].includes(');')) {
                foundClose = true;
                break;
              }
              if (lines[j].trim() === '' && lines[j + 1]?.trim() === '}') {
                lines[j] = '    );';
                fixed = true;
                console.log(`   ✓ Fechado throw new Error na linha ${j + 1}`);
                break;
              }
              j++;
            }
          }
        }
        
        if (fixed) {
          fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
          continue;
        }
      } catch (e) {
        console.log(`   ❌ Erro ao corrigir: ${e.message}`);
      }
    }
    
    // Se não conseguiu identificar o erro, mostra output
    console.log('\n❌ Erro não reconhecido:');
    console.log(output.substring(output.indexOf('error during build:'), 600));
    process.exit(1);
  }
}

console.log('\n⚠️ Atingiu limite de iterações');
process.exit(1);
