# 🤖 Scripts de Automação - Sistema de Compatibilidade

## 📋 Scripts Disponíveis

### 1. addSampleCompatibility.js
**Propósito**: Adicionar dados de exemplo para teste

**Uso**:
```bash
node scripts/addSampleCompatibility.js
```

**O que faz**:
- Cria 3 peças de exemplo (Filtro, Pastilha, Vela)
- Cria 6 veículos populares
- Cria 9 compatibilidades com evidências
- Perfeito para demonstração e testes

**Tempo**: ~10 segundos
**Requisições**: ~20 ao Firestore

---

### 2. populateVehiclesFromFIPE.js
**Propósito**: Popular base completa com dados da FIPE

**Uso**:
```bash
node scripts/populateVehiclesFromFIPE.js
```

**O que faz**:
- Busca todas as marcas da FIPE
- Para cada marca, busca modelos
- Para cada modelo, busca anos
- Cria documentos em `/vehicles`

**⚠️ Atenção**:
- Pode levar **várias horas**
- Faz **milhares de requisições**
- Use com moderação
- Recomendado apenas para produção

**Configuração**:
```javascript
// Limitar para teste (linha 67)
for (const brand of brands.slice(0, 10)) { // Apenas 10 marcas
  for (const model of models.slice(0, 5)) { // Apenas 5 modelos
```

**Tempo**: 2-8 horas (completo)
**Requisições**: 10.000+ ao FIPE

---

## 🔧 Pré-requisitos

### Dependências
```bash
npm install node-fetch
```

### Firebase Admin
Certifique-se de ter:
- Firebase Admin SDK configurado
- Credenciais de serviço (`serviceAccountKey.json`)
- Ou variável de ambiente `GOOGLE_APPLICATION_CREDENTIALS`

### Firestore Rules
```javascript
match /vehicles/{doc} { allow read, write: if request.auth != null; }
match /parts/{doc} { allow read, write: if request.auth != null; }
match /compatibility/{doc} { allow read, write: if request.auth != null; }
```

---

## 📊 Estrutura de Dados Criada

### Coleção: vehicles
```javascript
{
  marca: "Honda",
  modelo: "CG 160 Titan",
  anoInicio: 2015,
  anoFim: 2024,
  tipo: "motos",
  fipeData: {
    marcaId: "123",
    modeloId: "456"
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Coleção: parts
```javascript
{
  nome: "Filtro de Óleo",
  categoria: "Filtros",
  fabricante: "Mann Filter",
  codigosOE: ["HF303", "15410-MCJ-505"],
  imagemURL: null,
  createdAt: timestamp
}
```

### Coleção: compatibility
```javascript
{
  partId: "ref-to-parts",
  vehicleId: "ref-to-vehicles",
  anoInicio: 2015,
  anoFim: 2024,
  fonte: "OEM",
  evidencias: [
    {
      tipo: "OEM",
      descricao: "Catálogo oficial Honda 2024",
      data: "2024-01-15T00:00:00.000Z"
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🚀 Fluxo Recomendado

### Para Desenvolvimento/Teste
```bash
# 1. Adicionar dados de exemplo
node scripts/addSampleCompatibility.js

# 2. Testar na interface
npm run dev

# 3. Verificar no Firebase Console
# https://console.firebase.google.com
```

### Para Produção
```bash
# 1. Configurar limites no script
# Editar populateVehiclesFromFIPE.js
# Ajustar slice(0, 10) para slice(0, 100)

# 2. Executar em horário de baixo tráfego
node scripts/populateVehiclesFromFIPE.js

# 3. Monitorar logs
# Verificar erros e rate limiting

# 4. Deploy índices
firebase deploy --only firestore:indexes
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'firebase-admin'"
```bash
npm install firebase-admin
```

### Erro: "Cannot find module 'node-fetch'"
```bash
npm install node-fetch
```

### Erro: "Permission denied"
Verifique:
1. Firestore Rules permitem escrita
2. Credenciais do Firebase Admin estão corretas
3. Projeto Firebase está ativo

### Erro: "FIPE API not responding"
- API FIPE pode ter rate limiting
- Aguarde alguns minutos
- Tente novamente
- Considere adicionar delays maiores

### Script trava/não responde
- Verifique conexão com internet
- Verifique logs do Firebase
- Reduza quantidade de dados (slice)
- Aumente delays entre requisições

---

## 📈 Monitoramento

### Verificar Dados Criados

**Firebase Console**:
1. Acesse https://console.firebase.google.com
2. Selecione seu projeto
3. Firestore Database
4. Verifique coleções: `vehicles`, `parts`, `compatibility`

**Via Script**:
```javascript
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Contar documentos
const vehiclesCount = await db.collection('vehicles').count().get();
console.log('Veículos:', vehiclesCount.data().count);

const partsCount = await db.collection('parts').count().get();
console.log('Peças:', partsCount.data().count);

const compatCount = await db.collection('compatibility').count().get();
console.log('Compatibilidades:', compatCount.data().count);
```

---

## 🔮 Próximos Scripts (Planejado)

### scrapeMarketplaces.js
- Buscar anúncios no Mercado Livre
- Extrair compatibilidades de títulos
- Adicionar evidências tipo "Marketplace"

### extractOEMPDFs.js
- Download de catálogos OEM públicos
- Extração com pdfminer.six
- Parsing com regex
- Adicionar evidências tipo "OEM"

### analyzeForums.js
- Scraping de fóruns automotivos
- Análise de tópicos sobre compatibilidade
- Adicionar evidências tipo "Forum"

### updateCoPurchase.js
- Analisar histórico de vendas
- Identificar peças vendidas juntas
- Aumentar confidence score
- Adicionar evidências tipo "CoPurchase"

---

## 📚 Recursos

- [API FIPE](https://deividfortuna.github.io/fipe/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Node Fetch](https://www.npmjs.com/package/node-fetch)

---

**Última Atualização**: 2024
**Versão**: 1.0.0
**Status**: Pronto para Uso ✅
