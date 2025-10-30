# 🧪 Teste Visual de Sombras

## Como Testar

### 1. Abra o DevTools (F12)
### 2. Vá para a aba Console
### 3. Cole este código:

```javascript
// Teste de sombras
const cards = document.querySelectorAll('[class*="rounded-3xl"]');
console.log('Cards encontrados:', cards.length);

cards.forEach((card, index) => {
  const styles = window.getComputedStyle(card);
  console.log(`Card ${index}:`, {
    boxShadow: styles.boxShadow,
    border: styles.border,
    borderColor: styles.borderColor,
    background: styles.background
  });
});
```

## O Que Você Deve Ver

### Modo Claro - Card Normal
```
boxShadow: "rgba(0, 0, 0, 0.07) 0px 2px 15px -3px, rgba(0, 0, 0, 0.04) 0px 10px 20px -2px"
border: "1px solid rgba(209, 213, 219, 0.4)"
background: "rgb(255, 255, 255)"
```

### Modo Claro - Card Hover
```
boxShadow: "rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px"
```

## Se Não Estiver Funcionando

### Verifique o Tailwind Config
```bash
cat tailwind.config.js | grep -A 5 "boxShadow"
```

### Verifique se o Tailwind está compilando
```bash
# No terminal onde o npm run dev está rodando
# Você deve ver algo como:
# ✓ built in XXXms
```

### Force Rebuild
```bash
# Pare o servidor
Ctrl + C

# Delete cache
rm -rf node_modules/.vite

# Reinicie
npm run dev
```

## Teste Manual Rápido

### 1. Inspecione um Card
- Clique com botão direito em um card
- Selecione "Inspecionar"

### 2. Verifique as Classes
Procure por:
- `shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]`
- `border-gray-300/40`

### 3. Se as Classes Estão Lá
- ✅ Tailwind está funcionando
- ✅ As mudanças foram aplicadas
- ❌ Pode ser problema de cache do navegador

### 4. Se as Classes NÃO Estão Lá
- ❌ Arquivo não foi salvo corretamente
- ❌ Hot reload não funcionou
- ❌ Precisa reiniciar o servidor

## Solução Definitiva

```bash
# 1. Pare TUDO
Ctrl + C

# 2. Limpe TUDO
rm -rf node_modules/.vite
rm -rf dist

# 3. Reinicie
npm run dev

# 4. Abra em aba anônima
Ctrl + Shift + N (Chrome)
Cmd + Shift + N (Mac)

# 5. Acesse
http://localhost:5173/checkin
```

---

**Se ainda não funcionar, me avise!** 🔧
