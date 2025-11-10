# 🔍 Diagnóstico Rápido - Empresa não identificada

## Execute estes comandos no Console do Navegador (F12)

### 1. Verificar SessionStorage
```javascript
console.log('=== DIAGNÓSTICO EMPRESA ===');
console.log('empresaId:', sessionStorage.getItem('empresaId'));
console.log('userId:', sessionStorage.getItem('userId'));
console.log('Todos os dados:', Object.keys(sessionStorage).map(key => ({
  key,
  value: sessionStorage.getItem(key)
})));
```

### 2. Verificar Estado do Usuário
```javascript
// Copie e cole no console
const checkUserState = () => {
  const empresaId = sessionStorage.getItem('empresaId');
  const userId = sessionStorage.getItem('userId');
  
  console.log('📊 Estado do Usuário:');
  console.log('✓ empresaId:', empresaId || '❌ NÃO ENCONTRADO');
  console.log('✓ userId:', userId || '❌ NÃO ENCONTRADO');
  
  if (!empresaId) {
    console.log('');
    console.log('🔴 PROBLEMA IDENTIFICADO: empresaId não está definido');
    console.log('');
    console.log('💡 SOLUÇÕES:');
    console.log('1. Faça logout e login novamente');
    console.log('2. Limpe o cache do navegador (Ctrl+Shift+Del)');
    console.log('3. Verifique se seu usuário tem empresaId no Firestore');
    console.log('');
    console.log('🔧 SOLUÇÃO TEMPORÁRIA:');
    console.log('Execute: sessionStorage.setItem("empresaId", "SEU_EMPRESA_ID")');
  } else {
    console.log('');
    console.log('✅ empresaId está OK! O problema pode ser outro.');
  }
};

checkUserState();
```

---

## Soluções Rápidas

### Solução 1: Relogar
```
1. Clique no seu perfil (canto superior direito)
2. Clique em "Sair"
3. Faça login novamente
4. Tente criar o produto novamente
```

### Solução 2: Limpar Cache
```
1. Pressione Ctrl+Shift+Del (Windows) ou Cmd+Shift+Del (Mac)
2. Selecione "Cookies e dados de sites"
3. Clique em "Limpar dados"
4. Faça login novamente
```

### Solução 3: Definir Manualmente (TEMPORÁRIO)
```javascript
// APENAS PARA TESTE - Execute no console
sessionStorage.setItem('empresaId', 'COLE_SEU_EMPRESA_ID_AQUI');
```

Para encontrar seu empresaId:
1. Vá para Firebase Console
2. Firestore Database
3. Collection "users"
4. Encontre seu documento de usuário
5. Copie o valor do campo "empresaId"

---

## Verificar se Funcionou

Após aplicar uma solução, execute:

```javascript
// Verificar
console.log('empresaId:', sessionStorage.getItem('empresaId'));

// Se retornar um ID (ex: "abc123xyz"), está OK!
// Tente criar o produto novamente
```

---

## Ainda não funcionou?

Execute este diagnóstico completo:

```javascript
const diagnosticoCompleto = async () => {
  console.log('=== DIAGNÓSTICO COMPLETO ===');
  
  // 1. SessionStorage
  console.log('\n1️⃣ SessionStorage:');
  console.log('empresaId:', sessionStorage.getItem('empresaId'));
  console.log('userId:', sessionStorage.getItem('userId'));
  
  // 2. LocalStorage
  console.log('\n2️⃣ LocalStorage:');
  console.log('Dados:', Object.keys(localStorage).map(key => ({
    key,
    value: localStorage.getItem(key)?.substring(0, 50) + '...'
  })));
  
  // 3. Cookies
  console.log('\n3️⃣ Cookies:');
  console.log('Cookies:', document.cookie);
  
  // 4. URL
  console.log('\n4️⃣ URL Atual:');
  console.log('URL:', window.location.href);
  console.log('Path:', window.location.pathname);
  
  // 5. Zustand Stores (se disponível)
  console.log('\n5️⃣ Stores:');
  try {
    // Tente acessar os stores
    console.log('Verifique os stores manualmente no React DevTools');
  } catch (e) {
    console.log('Não foi possível acessar stores');
  }
  
  console.log('\n=== FIM DO DIAGNÓSTICO ===');
  console.log('\n📋 Copie este log e envie para suporte se necessário');
};

diagnosticoCompleto();
```

---

## Contato para Suporte

Se nenhuma solução funcionou, forneça:
1. O log do diagnóstico completo
2. Screenshot do erro
3. Navegador e versão
4. Passos que levaram ao erro
