const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Iniciando correção automática de todos os erros de sintaxe...\n');

let iteration = 0;
const maxIterations = 50;

while (iteration < maxIterations) {
  iteration++;
  console.log(`\n📍 Iteração ${iteration}/${maxIterations}`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf8' });
    console.log('\n✅ BUILD PASSOU! Todos os erros foram corrigidos.');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Extrair informação do erro
    const errorMatch = output.match(/(.+?):(\d+):(\d+): ERROR: (.+)/);
    
    if (!errorMatch) {
      console.log('❌ Não foi possível identificar o erro.');
      console.log(output);
      process.exit(1);
    }
    
    const [, filePath, line, col, errorMsg] = errorMatch;
    const relativePath = filePath.replace(/^.*[\\\/](src[\\\/].+)$/, '$1').replace(/\\/g, '/');
    
    console.log(`   Arquivo: ${relativePath}`);
    console.log(`   Linha: ${line}, Coluna: ${col}`);
    console.log(`   Erro: ${errorMsg}`);
    
    const fullPath = path.join(process.cwd(), relativePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Arquivo não encontrado: ${fullPath}`);
      process.exit(1);
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    const lineNum = parseInt(line) - 1;
    
    // Padrão: Expected ")" but found "}"
    if (errorMsg.includes('Expected ")"') && errorMsg.includes('found "}"')) {
      // Procurar para trás a partir da linha do erro
      let fixed = false;
      
      // Verificar se a linha anterior tem um fechamento JSX sem );
      for (let i = lineNum - 1; i >= Math.max(0, lineNum - 10); i--) {
        const prevLine = lines[i];
        
        // Padrão 1: />  seguido de linha vazia e depois }
        if (prevLine.trim().endsWith('/>') && lines[i + 1].trim() === '' && lines[lineNum].trim().startsWith('}')) {
          lines[i + 1] = lines[i].match(/^(\s*)/)[1] + '  );';
          console.log(`   ✅ Adicionado ");\" após linha ${i + 1}`);
          fixed = true;
          break;
        }
        
        // Padrão 2: </tag>  seguido de linha vazia e depois }
        if (prevLine.trim().match(/<\/\w+>$/) && lines[i + 1].trim() === '' && lines[lineNum].trim().startsWith('}')) {
          lines[i + 1] = lines[i].match(/^(\s*)/)[1] + '  );';
          console.log(`   ✅ Adicionado ");\" após linha ${i + 1}`);
          fixed = true;
          break;
        }
        
        // Padrão 3: )  seguido de linha vazia e depois } (useMemo, filter, map)
        if (prevLine.trim() === ')' && lines[i + 1].trim() === '' && lines[lineNum].trim() === '}') {
          lines[i + 1] = lines[i].match(/^(\s*)/)[1] + ');';
          console.log(`   ✅ Adicionado ");\" após linha ${i + 1}`);
          fixed = true;
          break;
        }
        
        // Padrão 4: [deps]  seguido de linha vazia e depois } (hooks)
        if (prevLine.trim().match(/\[[\w,\s]*\]$/) && lines[i + 1].trim() === '' && lines[lineNum].trim() === '}') {
          lines[i + 1] = lines[i].match(/^(\s*)/)[1] + ');';
          console.log(`   ✅ Adicionado ");\" após linha ${i + 1}`);
          fixed = true;
          break;
        }
        
        // Padrão 5: </motion.button>  seguido de linha vazia e depois })}
        if (prevLine.trim().match(/<\/motion\.\w+>$/) && lines[i + 1].trim() === '' && lines[lineNum].trim().match(/^\s*\}\)/)) {
          lines[i + 1] = lines[i].match(/^(\s*)/)[1] + '    );';
          console.log(`   ✅ Adicionado ");\" após linha ${i + 1}`);
          fixed = true;
          break;
        }
      }
      
      if (!fixed) {
        console.log(`   ⚠️  Padrão não reconhecido, tentando correção genérica...`);
        // Adiciona ); na linha vazia antes do }
        if (lineNum > 0 && lines[lineNum - 1].trim() === '') {
          const indent = lines[lineNum].match(/^(\s*)/)[1];
          lines[lineNum - 1] = indent + '  );';
          console.log(`   ✅ Adicionado ");\" genérico na linha ${lineNum}`);
          fixed = true;
        }
      }
      
      if (fixed) {
        content = lines.join('\n');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`   💾 Arquivo salvo: ${relativePath}`);
      } else {
        console.log(`   ❌ Não foi possível corrigir automaticamente`);
        process.exit(1);
      }
    } else {
      console.log(`   ❌ Tipo de erro não suportado: ${errorMsg}`);
      process.exit(1);
    }
  }
}

console.log(`\n❌ Atingido limite de ${maxIterations} iterações sem sucesso.`);
process.exit(1);
