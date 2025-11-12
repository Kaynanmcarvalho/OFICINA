# 🔍 Debug - Busca de Clientes

## 🎯 Problema Identificado

Cliente não retorna resultados na busca mesmo estando cadastrado.

## 🔧 Correções Aplicadas

### 1. **Logs de Debug Adicionados**
```javascript
console.log('[CampoBuscaCliente] Buscando:', query);
console.log('[CampoBuscaCliente] Resultados:', clientes?.length || 0, clientes);
```

### 2. **Carregamento Automático de Clientes**
```javascript
const { fetchClients, clients } = useClientStore();

useEffect(() => {
  if (clients.length === 0) {
    console.log('[CampoBuscaCliente] Carregando clientes...');
    fetchClients();
  }
}, [clients.length, fetchClients]);
```

### 3. **Debounce Aumentado**
- Antes: 200ms
- Depois: 300ms
- Motivo: Dar mais tempo para o usuário terminar de digitar

## 📊 Como Verificar

### No Console do Navegador (F12):

1. **Ao abrir o modal de check-in:**
```
[CampoBuscaCliente] Carregando clientes...
```

2. **Ao digitar na busca:**
```
[CampoBuscaCliente] Buscando: ren
[Smart Search] { term: 'ren', totalClients: X, results: Y, duration: 'Xms' }
[CampoBuscaCliente] Resultados: Y [...]
```

## 🔍 Possíveis Causas do Problema

### 1. Cache Vazio
- Clientes não foram carregados do Firebase
- Solução: `fetchClients()` automático

### 2. Busca Muito Restritiva
- `minScore: 10` pode estar filtrando demais
- Verificar no console quantos clientes existem vs quantos retornam

### 3. Normalização de Texto
- Busca remove acentos e normaliza
- "Renier" vs "Rénier" devem funcionar igual

## 🧪 Teste Manual

1. Abra o console (F12)
2. Abra o modal de check-in
3. Digite pelo menos 2 caracteres
4. Verifique os logs:
   - Quantos clientes totais?
   - Quantos resultados?
   - Qual a duração da busca?

## 📝 Próximos Passos

Se ainda não funcionar, verificar:
- [ ] Firebase está retornando os clientes?
- [ ] Campo `name` existe no documento?
- [ ] Empresa do usuário está correta?
- [ ] Regras do Firestore permitem leitura?
