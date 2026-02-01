const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔥 CORREÇÃO MASSIVA - MODO AGRESSIVO\n');

// Função para corrigir padrões comuns
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;
  
  // Padrão 1: Linha terminando com || ou && seguida de linha vazia e depois }
  const pattern1 = /(\|\||&&)\s*\n\s*\n\s*(\})/g;
  if (pattern1.test(content)) {
    content = content.replace(pattern1, '$1\n      );\n    $2');
    fixed = true;
  }
  
  // Padrão 2: return ( ... seguido de linha vazia e }
  const pattern2 = /(return\s*\([^)]*)\n\s*\n\s*(\}\))/g;
  if (pattern2.test(content)) {
    content = content.replace(pattern2, '$1\n      );\n    $2');
    fixed = true;
  }
  
  // Padrão 3: Fechamento de JSX sem ); antes de }
  const pattern3 = /(<\/[^>]+>)\s*\n\s*\n\s*(\}\})/g;
  if (pattern3.test(content)) {
    content = content.replace(pattern3, '$1\n                  );\n                $2');
    fixed = true;
  }
  
  // Padrão 4: Linha com apenas } seguida de }; (componente sem return fechado)
  const pattern4 = /\n\s*\}\s*\n\s*\};/g;
  if (pattern4.test(content)) {
    content = content.replace(pattern4, '\n  );\n};');
    fixed = true;
  }
  
  if (fixed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Executar build e corrigir iterativamente
let attempts = 0;
const maxAttempts = 30;

while (attempts < maxAttempts) {
  attempts++;
  console.log(`\n🔄 Tentativa ${attempts}/${maxAttempts}`);
  
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf8' });
    console.log('\n✅✅✅ BUILD PASSOU! FINALMENTE! ✅✅✅\n');
    process.exit(0);
  } catch (error) {
    const output = error.stdout + error.stderr;
    
    // Extrair arquivo do erro
    const match = output.match(/file:\s*([^\s:]+)/);
    if (!match) {
      console.log('❌ Não consegui identificar o arquivo com erro');
      console.log(output.substring(output.length - 500));
      process.exit(1);
    }
    
    let filePath = match[1].replace(/\x1B\[\d+m/g, '');
    
    // Limpar path do Windows
    if (filePath.includes(':\\')) {
      const parts = filePath.split('OFICINA\\');
      if (parts.length > 1) {
        filePath = parts[1].replace(/\\/g, '/');
      }
    }
    
    console.log(`📍 Corrigindo: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Arquivo não encontrado: ${filePath}`);
      process.exit(1);
    }
    
    // Tentar correção automática
    if (fixFile(filePath)) {
      console.log(`   ✅ Corrigido automaticamente`);
      continue;
    }
    
    // Correção manual baseada no erro
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Procurar por padrões problemáticos e corrigir
    let modified = false;
    for (let i = 0; i < lines.length - 2; i++) {
      const curr = lines[i];
      const next1 = lines[i + 1];
      const next2 = lines[i + 2];
      
      // Se linha atual termina com || ou && e próxima é vazia e depois vem }
      if ((curr.trim().endsWith('||') || curr.trim().endsWith('&&')) && 
          next1.trim() === '' && 
          (next2.trim().startsWith('}') || next2.trim().startsWith(')}'))) {
        lines[i + 1] = '      );';
        modified = true;
        break;
      }
      
      // Se linha atual é </div> ou similar e próxima é vazia e depois vem }}
      if (curr.trim().match(/<\/\w+>/) && 
          next1.trim() === '' && 
          next2.trim() === '}}') {
        lines[i + 1] = '                  );';
        modified = true;
        break;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log(`   ✅ Corrigido manualmente`);
      continue;
    }
    
    console.log('❌ Não consegui corrigir automaticamente');
    console.log('Últimas linhas do erro:');
    console.log(output.substring(output.length - 600));
    process.exit(1);
  }
}

console.log(`\n⚠️ Atingido limite de ${maxAttempts} tentativas`);
process.exit(1);
