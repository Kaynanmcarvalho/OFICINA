const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔍 Procurando erros de sintaxe...\n');

let attempts = 0;
const maxAttempts = 50;

while (attempts < maxAttempts) {
  attempts++;
  console.log(`\n📝 Tentativa ${attempts}/${maxAttempts}`);
  
  try {
    // Tentar build
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf8' });
    console.log('\n✅ BUILD PASSOU! Todos os erros corrigidos!');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Extrair informações do erro
    const fileMatch = output.match(/file: ([^\n]+)/);
    const lineMatch = output.match(/:(\d+):(\d+):/);
    const errorMatch = output.match(/ERROR: ([^\n]+)/);
    
    if (!fileMatch || !lineMatch) {
      console.log('❌ Não foi possível identificar o erro');
      console.log(output.substring(0, 500));
      process.exit(1);
    }
    
    const filePath = fileMatch[1].trim().replace(/\x1B\[\d+m/g, '').split(':')[0];
    const line = parseInt(lineMatch[1]);
    const errorMsg = errorMatch ? errorMatch[1] : 'Unknown error';
    
    console.log(`📍 Erro em: ${filePath}:${line}`);
    console.log(`   ${errorMsg}`);
    
    // Ler o arquivo
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Estratégias de correção baseadas no erro
    if (errorMsg.includes('Expected ")"')) {
      // Procurar para trás a partir da linha do erro
      let fixed = false;
      
      for (let i = line - 1; i >= Math.max(0, line - 20); i--) {
        const currentLine = lines[i];
        
        // Padrão 1: Linha termina sem fechar parêntese antes de }
        if (currentLine.match(/^\s+[a-zA-Z_].*[^);]\s*$/) && 
            lines[i + 1] && lines[i + 1].trim() === '' &&
            lines[i + 2] && lines[i + 2].trim().startsWith('}')) {
          lines[i] = currentLine.trimEnd() + '\n      );';
          console.log(`   ✅ Adicionado ); na linha ${i + 1}`);
          fixed = true;
          break;
        }
        
        // Padrão 2: Linha com return/arrow function sem fechar
        if (currentLine.match(/=>\s*$/) || currentLine.match(/return\s+\($/) ||
            currentLine.match(/\|\|\s*$/) || currentLine.match(/&&\s*$/)) {
          // Procurar próxima linha vazia seguida de }
          for (let j = i + 1; j < Math.min(lines.length, i + 15); j++) {
            if (lines[j].trim() === '' && lines[j + 1] && lines[j + 1].trim().match(/^[}\)]/) && !lines[j + 1].includes(');')) {
              lines[j] = lines[j] + '      );';
              console.log(`   ✅ Adicionado ); na linha ${j + 1}`);
              fixed = true;
              break;
            }
          }
          if (fixed) break;
        }
      }
      
      if (!fixed) {
        // Fallback: adicionar ); antes da linha do erro
        const errorLine = lines[line - 1];
        if (errorLine && errorLine.trim().startsWith('}')) {
          lines.splice(line - 1, 0, '      );');
          console.log(`   ✅ Adicionado ); antes da linha ${line}`);
          fixed = true;
        }
      }
      
      if (fixed) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        console.log(`   💾 Arquivo salvo`);
        continue;
      }
    }
    
    console.log('❌ Não foi possível corrigir automaticamente');
    console.log('Últimas linhas do erro:');
    console.log(output.substring(output.length - 800));
    process.exit(1);
  }
}

console.log(`\n⚠️  Atingido limite de ${maxAttempts} tentativas`);
process.exit(1);
