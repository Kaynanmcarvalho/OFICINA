const fs = require('fs');

const file = 'src/features/voice-assistant/components/VoiceAssistantButton.tsx';
console.log('🔧 Corrigindo VoiceAssistantButton.tsx...\n');

const content = fs.readFileSync(file, 'utf-8');
const lines = content.split('\n');

let modified = false;

// Procura por padrões: ],\n\n  const (sem fechar o useCallback anterior)
for (let i = 0; i < lines.length - 2; i++) {
  const line = lines[i];
  const nextLine = lines[i + 1];
  const nextNextLine = lines[i + 2];
  
  // Padrão: linha com ], seguida de linha vazia, seguida de const
  if (line.trim().match(/^\],?\s*$/) && 
      nextLine.trim() === '' && 
      nextNextLine.trim().startsWith('const ')) {
    // Adiciona ); depois do ]
    lines[i] = line.replace(/\],?\s*$/, '\n  );');
    modified = true;
    console.log(`✓ Fechado useCallback na linha ${i + 1}`);
  }
}

if (modified) {
  fs.writeFileSync(file, lines.join('\n'), 'utf-8');
  console.log('\n✅ Arquivo corrigido!');
} else {
  console.log('\nℹ️  Nenhuma correção necessária');
}
