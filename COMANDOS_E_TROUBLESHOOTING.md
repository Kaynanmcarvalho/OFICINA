# 🛠️ Comandos Úteis e Troubleshooting - CheckIn Premium

## 📋 Comandos Rápidos

---

## 🚀 INSTALAÇÃO

### Instalar todas as dependências:
```bash
npm install browser-image-compression html5-qrcode jspdf jspdf-autotable react-signature-canvas date-fns --legacy-peer-deps
```

### Instalar individualmente (se houver erro):
```bash
npm install browser-image-compression --legacy-peer-deps
npm install html5-qrcode --legacy-peer-deps
npm install jspdf --legacy-peer-deps
npm install jspdf-autotable --legacy-peer-deps
npm install react-signature-canvas --legacy-peer-deps
npm install date-fns --legacy-peer-deps
```

### Verificar instalação:
```bash
npm list browser-image-compression
npm list html5-qrcode
npm list jspdf
npm list react-signature-canvas
npm list date-fns
```

---

## 🔥 FIREBASE

### Deploy de regras:
```bash
# Storage rules
firebase deploy --only storage

# Firestore indexes
firebase deploy --only firestore:indexes

# Tudo
firebase deploy
```

### Testar localmente:
```bash
# Emuladores
firebase emulators:start

# Apenas Storage
firebase emulators:start --only storage

# Apenas Firestore
firebase emulators:start --only firestore
```

### Ver logs:
```bash
firebase functions:log
```

---

## 💻 DESENVOLVIMENTO

### Iniciar servidor:
```bash
npm run dev
# ou
npm start
```

### Build de produção:
```bash
npm run build
```

### Analisar bundle:
```bash
npm run build
npm run analyze
```

### Limpar cache:
```bash
# Node modules
rm -rf node_modules
npm install

# Build
rm -rf dist
npm run build

# Cache do npm
npm cache clean --force
```

---

## 🧪 TESTES

### Rodar testes:
```bash
npm test
```

### Testes com coverage:
```bash
npm run test:coverage
```

### Testes E2E:
```bash
npm run test:e2e
```

### Lint:
```bash
npm run lint
npm run lint:fix
```

---

## 🐛 TROUBLESHOOTING

### ❌ Erro: "Cannot find module 'browser-image-compression'"

**Solução:**
```bash
npm install browser-image-compression --legacy-peer-deps
```

Se persistir:
```bash
rm -rf node_modules package-lock.json
npm install
npm install browser-image-compression --legacy-peer-deps
```

---

### ❌ Erro: "ERESOLVE could not resolve"

**Causa:** Conflito de versões do React

**Solução:**
```bash
npm install --legacy-peer-deps
```

Ou adicione no `.npmrc`:
```
legacy-peer-deps=true
```

---

### ❌ Erro: "Firebase Storage: User does not have permission"

**Causa:** Regras do Storage não configuradas

**Solução:**

1. Abra Firebase Console
2. Vá em Storage > Rules
3. Adicione:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /checkins/{checkinId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Publique as regras

---

### ❌ Erro: "Camera not accessible"

**Causa:** Permissões de câmera não concedidas

**Solução:**

1. **Chrome/Edge:**
   - Clique no ícone de cadeado na barra de endereço
   - Permita acesso à câmera
   - Recarregue a página

2. **Firefox:**
   - Clique no ícone de câmera na barra de endereço
   - Permita acesso
   - Recarregue

3. **Safari:**
   - Safari > Preferências > Sites > Câmera
   - Permita para o site

4. **Mobile:**
   - Configurações do navegador
   - Permissões do site
   - Ativar câmera

---

### ❌ Erro: "PDF generation failed"

**Causa:** Biblioteca jspdf não instalada ou imagens muito grandes

**Solução:**

1. Verificar instalação:
```bash
npm list jspdf jspdf-autotable
```

2. Reinstalar se necessário:
```bash
npm install jspdf jspdf-autotable --legacy-peer-deps
```

3. Verificar tamanho das imagens:
```javascript
// As imagens devem estar comprimidas
console.log('Image size:', imageBlob.size / 1024, 'KB');
```

---

### ❌ Erro: "Web Speech API not supported"

**Causa:** Navegador não suporta Web Speech API

**Solução:**

O componente já tem fallback. Navegadores suportados:
- ✅ Chrome/Edge (desktop e mobile)
- ✅ Safari (desktop e mobile)
- ❌ Firefox (não suporta)

Para Firefox, o usuário verá mensagem:
"Seu navegador não suporta reconhecimento de voz. Use Chrome ou Safari."

---

### ❌ Erro: "QR Code scanner not working"

**Causas possíveis:**

1. **Câmera não acessível**
   - Veja solução de "Camera not accessible" acima

2. **QR Code inválido**
   - Verifique formato do QR Code:
   ```json
   {
     "type": "vehicle",
     "vehicleId": "abc123",
     "plate": "ABC1234",
     "clientId": "client456"
   }
   ```

3. **Biblioteca não instalada**
   ```bash
   npm install html5-qrcode --legacy-peer-deps
   ```

---

### ❌ Erro: "Signature canvas not rendering"

**Causa:** react-signature-canvas não instalado ou canvas não inicializado

**Solução:**

1. Verificar instalação:
```bash
npm list react-signature-canvas
```

2. Reinstalar:
```bash
npm install react-signature-canvas --legacy-peer-deps
```

3. Verificar ref:
```jsx
const signatureRef = useRef(null);

<SignatureCanvas
  ref={signatureRef}
  canvasProps={{
    width: 400,
    height: 200,
    className: 'signature-canvas'
  }}
/>
```

---

### ❌ Erro: "Images not compressing"

**Causa:** browser-image-compression não configurado corretamente

**Solução:**

```javascript
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
};

try {
  const compressedFile = await imageCompression(file, options);
  console.log('Original:', file.size / 1024, 'KB');
  console.log('Compressed:', compressedFile.size / 1024, 'KB');
} catch (error) {
  console.error('Compression error:', error);
}
```

---

### ❌ Erro: "Animations are laggy"

**Causa:** Performance não otimizada

**Solução:**

1. **Usar React.memo:**
```jsx
export default React.memo(StatusCard);
```

2. **Usar useMemo:**
```jsx
const metrics = useMemo(() => 
  calculateMetrics(checkins), 
  [checkins]
);
```

3. **Usar useCallback:**
```jsx
const handleFilter = useCallback((filters) => {
  // ...
}, []);
```

4. **Reduzir re-renders:**
```jsx
// Evitar criar objetos inline
// ❌ Ruim
<Component style={{ color: 'red' }} />

// ✅ Bom
const style = { color: 'red' };
<Component style={style} />
```

---

### ❌ Erro: "Dark mode not working"

**Causa:** Variáveis CSS não definidas ou tema não aplicado

**Solução:**

1. Verificar variáveis CSS:
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
}

[data-theme="dark"] {
  --bg-primary: #1c1c1e;
  --text-primary: #ffffff;
}
```

2. Aplicar tema:
```jsx
<div data-theme={theme}>
  {/* Conteúdo */}
</div>
```

3. Usar variáveis:
```jsx
className="bg-[var(--bg-primary)] text-[var(--text-primary)]"
```

---

### ❌ Erro: "Filters not working"

**Causa:** Lógica de filtro incorreta ou estado não atualizado

**Solução:**

1. Verificar callback:
```jsx
const handleFilterChange = (filtered) => {
  console.log('Filtered:', filtered);
  setFilteredCheckins(filtered);
};
```

2. Usar filtrados na renderização:
```jsx
const displayCheckins = filteredCheckins.length > 0 
  ? filteredCheckins 
  : checkins;
```

3. Debug:
```jsx
console.log('All checkins:', checkins.length);
console.log('Filtered:', filteredCheckins.length);
```

---

### ❌ Erro: "Firebase quota exceeded"

**Causa:** Muitas operações de leitura/escrita

**Solução:**

1. **Usar cache:**
```jsx
const [cache, setCache] = useState({});

const getCachedData = async (key) => {
  if (cache[key]) return cache[key];
  
  const data = await fetchFromFirebase(key);
  setCache({ ...cache, [key]: data });
  return data;
};
```

2. **Limitar queries:**
```javascript
// Usar limit
const query = collection(db, 'checkins')
  .orderBy('createdAt', 'desc')
  .limit(50);
```

3. **Usar indexes:**
```json
{
  "indexes": [
    {
      "collectionGroup": "checkins",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

### ❌ Erro: "Build failing"

**Causa:** Erros de TypeScript ou imports incorretos

**Solução:**

1. **Verificar erros:**
```bash
npm run build 2>&1 | tee build-errors.log
```

2. **Limpar e rebuildar:**
```bash
rm -rf dist node_modules
npm install
npm run build
```

3. **Verificar imports:**
```javascript
// ❌ Ruim
import Component from './Component';

// ✅ Bom
import Component from './Component.jsx';
```

---

## 🔍 DEBUG ÚTEIS

### Console logs estratégicos:

```javascript
// Início de função
console.log('🚀 Function started:', functionName);

// Dados recebidos
console.log('📥 Data received:', data);

// Processamento
console.log('⚙️ Processing:', step);

// Resultado
console.log('✅ Result:', result);

// Erro
console.error('❌ Error:', error);
```

### Performance monitoring:

```javascript
console.time('Operation');
// ... código
console.timeEnd('Operation');
```

### Memory usage:

```javascript
console.log('Memory:', performance.memory);
```

---

## 📊 MONITORAMENTO

### Adicionar analytics:

```javascript
// Rastrear eventos
const trackEvent = (eventName, params) => {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
  console.log('📊 Event:', eventName, params);
};

// Usar
trackEvent('checkin_complete', {
  checkin_id: checkinId,
  duration: duration,
});
```

---

## 🚨 ERROS COMUNS E SOLUÇÕES RÁPIDAS

| Erro | Solução Rápida |
|------|----------------|
| Module not found | `npm install --legacy-peer-deps` |
| Permission denied | Verificar Firebase rules |
| Camera not working | Permitir acesso no navegador |
| PDF not generating | Reinstalar jspdf |
| Animations laggy | Usar React.memo |
| Dark mode broken | Verificar variáveis CSS |
| Build failing | Limpar cache e rebuildar |
| Quota exceeded | Implementar cache |

---

## 📞 SUPORTE

### Recursos úteis:

1. **Documentação:**
   - GUIA_INTEGRACAO_FINAL.md
   - EXEMPLOS_USO_COMPONENTES.md
   - GUIA_RAPIDO_INSTALACAO.md

2. **Logs:**
   - Console do navegador (F12)
   - Firebase Console > Logs
   - Network tab para requests

3. **Ferramentas:**
   - React DevTools
   - Firebase Emulator Suite
   - Lighthouse (performance)

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de reportar um problema, verifique:

- [ ] Dependências instaladas corretamente
- [ ] Firebase configurado (rules + indexes)
- [ ] Permissões de câmera concedidas
- [ ] Console sem erros críticos
- [ ] Build funcionando
- [ ] Cache limpo
- [ ] Versão correta do Node/npm
- [ ] Navegador atualizado

---

## 🎯 DICAS DE PERFORMANCE

### 1. Lazy Loading:
```jsx
const PDFGenerator = lazy(() => import('./PDFGenerator'));

<Suspense fallback={<Loading />}>
  <PDFGenerator />
</Suspense>
```

### 2. Debounce em inputs:
```jsx
const debouncedSearch = useMemo(
  () => debounce((value) => search(value), 300),
  []
);
```

### 3. Virtualização de listas:
```jsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={80}
>
  {Row}
</FixedSizeList>
```

---

**Mantenha este documento como referência rápida!** 📚

*Última atualização: 2 de Novembro de 2025*
