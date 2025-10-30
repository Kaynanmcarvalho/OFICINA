# 🛠️ Comandos Úteis - Check-in Premium

## 🚀 Desenvolvimento

### Iniciar Servidor
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

### Limpar Cache
```bash
# Windows
rmdir /s /q node_modules
rmdir /s /q .vite
npm install

# Linux/Mac
rm -rf node_modules .vite
npm install
```

---

## 🧪 Testes

### Rodar Todos os Testes
```bash
npm run test
```

### Testes em Watch Mode
```bash
npm run test:watch
```

### Coverage
```bash
npm run test:coverage
```

### Lighthouse
```bash
npm run lighthouse
```

---

## 📦 Dependências

### Instalar Framer Motion (já instalado)
```bash
npm install framer-motion
```

### Instalar Lucide Icons (já instalado)
```bash
npm install lucide-react
```

### Instalar React Hot Toast (já instalado)
```bash
npm install react-hot-toast
```

### Verificar Versões
```bash
npm list framer-motion
npm list lucide-react
npm list react-hot-toast
```

---

## 🔍 Debug

### Ver Erros do Console
```bash
# No navegador
F12 > Console
```

### React DevTools
```bash
# Instalar extensão
Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
Firefox: https://addons.mozilla.org/firefox/addon/react-devtools/
```

### Ver Bundle Size
```bash
npm run build
npm run analyze
```

### Verificar Performance
```bash
# No navegador
F12 > Performance > Record
```

---

## 🎨 Tailwind

### Gerar Classes
```bash
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

### Ver Configuração
```bash
cat tailwind.config.js
```

### Adicionar Plugin
```bash
npm install -D @tailwindcss/forms
npm install -D @tailwindcss/typography
```

---

## 🔧 Git

### Commit das Mudanças
```bash
git add .
git commit -m "feat: redesign premium da página check-in"
git push origin main
```

### Criar Branch
```bash
git checkout -b feature/checkin-premium
```

### Ver Diferenças
```bash
git diff src/pages/CheckInPage.jsx
```

### Reverter Mudanças
```bash
git checkout -- src/pages/CheckInPage.jsx
```

---

## 📊 Firebase

### Ver Logs
```bash
firebase functions:log
```

### Deploy
```bash
firebase deploy
```

### Emuladores
```bash
firebase emulators:start
```

### Backup
```bash
firebase firestore:export backup-$(date +%Y%m%d)
```

---

## 🐛 Troubleshooting

### Erro: Module not found
```bash
npm install
npm run dev
```

### Erro: Port already in use
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Erro: Firebase not initialized
```bash
# Verificar .env
cat .env

# Verificar Firebase config
cat src/config/firebase.js
```

### Erro: Framer Motion não anima
```bash
# Limpar cache
rm -rf node_modules/.vite
npm run dev
```

---

## 📱 Mobile Testing

### Abrir no Dispositivo
```bash
# Encontrar IP local
ipconfig  # Windows
ifconfig  # Linux/Mac

# Acessar no mobile
http://[SEU-IP]:5173
```

### Chrome Remote Debugging
```bash
# No Chrome desktop
chrome://inspect
```

### Safari Web Inspector
```bash
# No Safari desktop
Develop > [Seu iPhone] > [Página]
```

---

## 🎯 Atalhos do VSCode

### Formatar Código
```
Shift + Alt + F
```

### Organizar Imports
```
Shift + Alt + O
```

### Ir para Definição
```
F12
```

### Renomear Símbolo
```
F2
```

### Buscar em Arquivos
```
Ctrl + Shift + F
```

---

## 📝 Scripts Personalizados

### Adicionar ao package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext js,jsx",
    "lint:fix": "eslint src --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
    "analyze": "vite-bundle-visualizer",
    "lighthouse": "lighthouse http://localhost:5173 --view"
  }
}
```

---

## 🔐 Variáveis de Ambiente

### Criar .env
```bash
# .env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Usar no Código
```javascript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
```

---

## 📚 Documentação Útil

### Framer Motion
```
https://www.framer.com/motion/
```

### Tailwind CSS
```
https://tailwindcss.com/docs
```

### React
```
https://react.dev/
```

### Firebase
```
https://firebase.google.com/docs
```

### Lucide Icons
```
https://lucide.dev/
```

---

## 🎨 Ferramentas Online

### Gradientes
```
https://cssgradient.io/
https://uigradients.com/
```

### Cores
```
https://coolors.co/
https://colorhunt.co/
```

### Animações
```
https://easings.net/
https://cubic-bezier.com/
```

### Ícones
```
https://lucide.dev/
https://heroicons.com/
```

---

## 💡 Dicas Rápidas

### Hot Reload não funciona
```bash
# Adicionar ao vite.config.js
server: {
  watch: {
    usePolling: true
  }
}
```

### Build muito grande
```bash
# Analisar bundle
npm run build
npm run analyze

# Lazy load componentes
const Component = lazy(() => import('./Component'));
```

### Animações lentas
```bash
# Reduzir complexidade
# Usar transform e opacity apenas
# Evitar animações de width/height
```

### Dark mode não funciona
```bash
# Verificar classe no html
document.documentElement.classList.add('dark');

# Verificar Tailwind config
darkMode: 'class'
```

---

## 🚨 Comandos de Emergência

### Reverter Tudo
```bash
git reset --hard HEAD
git clean -fd
```

### Reinstalar Tudo
```bash
rm -rf node_modules package-lock.json
npm install
```

### Limpar Tudo
```bash
rm -rf node_modules .vite dist
npm install
npm run dev
```

---

**Mantenha este arquivo como referência rápida!** 📌
