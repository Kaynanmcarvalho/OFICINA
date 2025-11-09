# 🔍 Debug - Ícones não Carregando

## 🎯 Diagnóstico Rápido

### 1. Verificar Console do Navegador (F12)

Abra o console e procure por:

✅ **Mensagem de Sucesso:**
```
✅ Ícones pré-carregados com sucesso
```

❌ **Erros Comuns:**
```
Failed to resolve module specifier "lucide-react"
Cannot find module 'lucide-react'
404 Not Found: /@id/lucide-react
```

### 2. Verificar Network (Aba Network no F12)

Procure por requisições falhadas:
- ❌ Status 404 em arquivos `.js`
- ❌ Erros de CORS
- ❌ Timeout em módulos

### 3. Verificar Estrutura de Arquivos

```bash
# Verificar se lucide-react está instalado
dir node_modules\lucide-react

# Verificar versão
npm list lucide-react
```

## 🛠️ Soluções por Tipo de Erro

### Erro: "Cannot find module 'lucide-react'"

**Causa:** Pacote não instalado ou corrompido

**Solução:**
```bash
# Reinstalar lucide-react
npm uninstall lucide-react
npm install lucide-react@^0.460.0

# Limpar cache e reiniciar
rmdir /s /q node_modules\.vite
npm run dev
```

### Erro: "404 Not Found: /@id/lucide-react"

**Causa:** Cache do Vite desatualizado

**Solução:**
```bash
# Limpar cache do Vite
rmdir /s /q node_modules\.vite
rmdir /s /q .vite

# Forçar pré-bundling
npm run dev
```

### Erro: Ícones aparecem como quadrados vazios

**Causa:** CSS não carregado ou fonte não encontrada

**Solução:**
```bash
# Verificar se framer-motion está instalado
npm list framer-motion

# Reinstalar se necessário
npm install framer-motion@^10.18.0

# Limpar cache do navegador
# Ctrl+Shift+Delete
```

### Erro: Logo não aparece

**Causa:** Componente LogoSVG não renderizando

**Solução:**
1. Verificar console por erros de React
2. Verificar se `Logo.module.css` existe
3. Verificar tema (light/dark) está funcionando

```bash
# Verificar arquivos
dir src\components\Logo\Logo.jsx
dir src\components\Logo\LogoSVG.jsx
dir src\components\Logo\Logo.module.css
```

## 🔧 Comandos de Debug

### Verificar Instalação

```bash
# Listar todas as dependências
npm list --depth=0

# Verificar pacotes específicos
npm list lucide-react react-icons framer-motion

# Verificar versões
npm outdated
```

### Limpar Tudo

```bash
# Parar servidor
# Ctrl+C

# Remover tudo
rmdir /s /q node_modules
rmdir /s /q node_modules\.vite
rmdir /s /q .vite
rmdir /s /q dist

# Limpar cache npm
npm cache clean --force

# Reinstalar
npm install

# Iniciar
npm run dev
```

### Verificar Vite Config

```bash
# Abrir vite.config.js
code vite.config.js

# Verificar se contém:
# optimizeDeps: {
#   include: ['lucide-react', 'react-icons', ...],
#   force: true
# }
```

## 📊 Checklist de Verificação

- [ ] Node.js instalado (v18+)
- [ ] npm funcionando
- [ ] `node_modules` existe
- [ ] `lucide-react` instalado
- [ ] `react-icons` instalado
- [ ] `framer-motion` instalado
- [ ] `vite.config.js` atualizado
- [ ] Cache do Vite limpo
- [ ] Cache do navegador limpo
- [ ] Servidor rodando sem erros
- [ ] Console sem erros
- [ ] Network sem 404s

## 🎯 Teste Final

Execute este comando para verificar tudo:

```bash
# Windows
echo Verificando instalacao... && ^
npm list lucide-react && ^
npm list react-icons && ^
npm list framer-motion && ^
echo. && ^
echo Tudo OK! Execute: npm run dev
```

## 📝 Logs Úteis

### Habilitar Logs Detalhados do Vite

Edite `package.json`:
```json
{
  "scripts": {
    "dev": "vite --debug",
    "dev:verbose": "vite --debug --force"
  }
}
```

Execute:
```bash
npm run dev:verbose
```

### Verificar Pré-bundling

Procure no console por:
```
Pre-bundling dependencies:
  lucide-react
  react-icons
  framer-motion
  ...
```

## 🆘 Ainda não Funciona?

### 1. Verificar Permissões

```bash
# Executar como Administrador
# Botão direito no terminal > Executar como Administrador
```

### 2. Verificar Antivírus/Firewall

- Adicione exceção para pasta do projeto
- Adicione exceção para Node.js

### 3. Verificar Espaço em Disco

```bash
# Verificar espaço disponível
wmic logicaldisk get size,freespace,caption
```

### 4. Reinstalar Node.js

1. Desinstalar Node.js
2. Baixar versão LTS: https://nodejs.org
3. Instalar
4. Reiniciar computador
5. Executar `limpar-cache-completo.bat`

## 📞 Suporte

Se nada funcionar, colete estas informações:

```bash
# Versões
node --version
npm --version

# Logs
npm run dev > logs.txt 2>&1

# Estrutura
dir /s /b src\components\Logo
dir /s /b src\components\layout

# Dependências
npm list > dependencies.txt
```

Envie os arquivos:
- `logs.txt`
- `dependencies.txt`
- Screenshot do erro no console (F12)
- Screenshot da tela sem ícones

---

**Última atualização:** 2025-01-XX
**Versão:** 1.0.0
