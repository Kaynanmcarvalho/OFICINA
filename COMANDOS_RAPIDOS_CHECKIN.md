# ⚡ Comandos Rápidos - Check-in

## 🚀 Iniciar Sistema

```bash
# Iniciar o projeto
npm run dev

# Acessar check-in
# http://localhost:5173/checkin
```

---

## 🔍 Verificar Arquivos

```bash
# Listar componentes do check-in
ls src/pages/checkin/components/

# Verificar serviços
ls src/services/vehicleDataService.js

# Ver dados JSON
ls src/pages/checkin/data/
```

---

## 🧪 Testar Funcionalidades

### Teste Rápido de Placa
```javascript
// No console do navegador (F12)
import { isValidPlaca, formatPlaca } from './src/services/vehicleDataService.js';

// Testar validação
isValidPlaca('ABC1234');  // true
isValidPlaca('ABC1D23');  // true
isValidPlaca('INVALID');  // false

// Testar formatação
formatPlaca('ABC1234');   // 'ABC-1234'
```

### Teste de Upload de Foto
```javascript
// Simular upload
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
// Use o componente PhotoUploadSection
```

### Teste de PIN
```javascript
// Gerar PIN de teste
const pin = Math.floor(100000 + Math.random() * 900000).toString();
console.log('PIN:', pin);  // Ex: '123456'
```

---

## 🔥 Firebase Console

### Verificar Check-ins
```
1. Abra: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em Firestore Database
4. Navegue até: checkins/
5. Veja os documentos salvos
```

### Verificar Fotos
```
1. Abra: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em Storage
4. Navegue até: checkins/{placa}/
5. Veja as fotos com overlay
```

---

## 🐛 Debug Rápido

### Ver Logs no Console
```javascript
// Adicione nos componentes para debug
console.log('Vehicle Data:', vehicleData);
console.log('Photos:', photos);
console.log('Selected Services:', selectedServices);
console.log('Checklist:', checklistResults);
```

### Verificar Estado do Tema
```javascript
// No console
const { isDarkMode } = useThemeStore.getState();
console.log('Dark Mode:', isDarkMode);
```

### Verificar EmpresaId
```javascript
// No console
const { empresaId } = useEmpresa();
console.log('Empresa ID:', empresaId);
```

---

## 📊 Queries Úteis do Firestore

### Buscar Check-ins de Hoje
```javascript
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

const hoje = new Date();
hoje.setHours(0, 0, 0, 0);

const q = query(
  collection(db, 'checkins'),
  where('empresaId', '==', empresaId),
  where('dataHora', '>=', Timestamp.fromDate(hoje))
);

const snapshot = await getDocs(q);
console.log('Check-ins hoje:', snapshot.size);
```

### Buscar por Placa
```javascript
const q = query(
  collection(db, 'checkins'),
  where('empresaId', '==', empresaId),
  where('placa', '==', 'ABC1234')
);

const snapshot = await getDocs(q);
snapshot.forEach(doc => console.log(doc.data()));
```

### Buscar por Status
```javascript
const q = query(
  collection(db, 'checkins'),
  where('empresaId', '==', empresaId),
  where('status', '==', 'em_atendimento')
);

const snapshot = await getDocs(q);
console.log('Em atendimento:', snapshot.size);
```

---

## 🔧 Ajustes Rápidos

### Mudar Cor do Tema
```javascript
// Em qualquer componente
const { toggleTheme } = useThemeStore();
toggleTheme();
```

### Limpar Cache do Navegador
```bash
# Chrome/Edge
Ctrl + Shift + Delete

# Ou no console
localStorage.clear();
sessionStorage.clear();
```

### Recarregar Componente
```javascript
// Adicione key dinâmica
<Component key={Date.now()} />
```

---

## 📝 Snippets Úteis

### Criar Novo Check-in Manualmente
```javascript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const checkin = {
  empresaId: 'sua-empresa-id',
  placa: 'ABC1234',
  marca: 'Toyota',
  modelo: 'Corolla',
  ano: '2020',
  cor: '#FFFFFF',
  fotosEntrada: [],
  servicosSelecionados: ['Troca de óleo'],
  checklist: [],
  localizacao: {
    cidade: 'São Paulo',
    estado: 'SP',
    latitude: -23.5505,
    longitude: -46.6333
  },
  pinRetirada: '123456',
  observacoes: 'Teste',
  dataHora: serverTimestamp(),
  status: 'em_atendimento'
};

await addDoc(collection(db, 'checkins'), checkin);
```

### Atualizar Check-in
```javascript
import { doc, updateDoc } from 'firebase/firestore';

const checkinRef = doc(db, 'checkins', 'checkin-id');
await updateDoc(checkinRef, {
  status: 'concluido',
  observacoes: 'Atualizado'
});
```

### Deletar Check-in
```javascript
import { doc, deleteDoc } from 'firebase/firestore';

const checkinRef = doc(db, 'checkins', 'checkin-id');
await deleteDoc(checkinRef);
```

---

## 🎨 Customizar Cores

### Adicionar Nova Cor ao Mapa
```javascript
// Em vehicleDataService.js
const colorMap = {
  // ... cores existentes
  'roxo': '#9333EA',
  'rosa': '#EC4899',
  'turquesa': '#14B8A6'
};
```

### Mudar Cor de Status
```javascript
// Em qualquer componente
const statusColors = {
  ok: 'bg-green-500',
  atencao: 'bg-yellow-500',
  critico: 'bg-red-500'
};
```

---

## 📱 Testar Responsividade

### Chrome DevTools
```
1. F12 para abrir DevTools
2. Ctrl + Shift + M para modo responsivo
3. Testar em:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)
```

### Breakpoints Tailwind
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🔐 Testar Permissões

### Simular Usuário Sem Permissão
```javascript
// Temporariamente mude empresaId
const { empresaId } = useEmpresa();
// Deve bloquear acesso a dados de outras empresas
```

---

## ⚡ Atalhos do Teclado

```
F5          - Recarregar página
Ctrl + F5   - Recarregar sem cache
F12         - Abrir DevTools
Ctrl + K    - Limpar console
Esc         - Fechar modais
```

---

## 📊 Monitorar Performance

### Chrome DevTools Performance
```
1. F12 > Performance
2. Clique em Record
3. Use o check-in
4. Stop recording
5. Analise o flamegraph
```

### Lighthouse Audit
```
1. F12 > Lighthouse
2. Selecione categorias
3. Generate report
4. Veja sugestões
```

---

## 🎯 Comandos Git (Se Necessário)

```bash
# Ver status
git status

# Adicionar arquivos
git add src/pages/checkin/

# Commit
git commit -m "feat: implementa sistema de check-in completo"

# Push
git push origin main
```

---

## 🚀 Deploy Rápido

```bash
# Build de produção
npm run build

# Preview do build
npm run preview

# Deploy (se configurado)
npm run deploy
```

---

## 📞 Comandos de Ajuda

```bash
# Ver versão do Node
node --version

# Ver versão do npm
npm --version

# Listar scripts disponíveis
npm run

# Ver dependências
npm list --depth=0

# Verificar atualizações
npm outdated
```

---

## ✅ Checklist Rápido

Antes de usar em produção:

```
[ ] Sistema rodando sem erros
[ ] Firebase configurado
[ ] Backend respondendo
[ ] Fotos fazendo upload
[ ] Geolocalização funcionando
[ ] PIN sendo gerado
[ ] Dados salvando no Firestore
[ ] Tema claro/escuro funcionando
[ ] Responsivo em mobile
[ ] Performance adequada
```

---

**Comandos prontos para uso! ⚡**
