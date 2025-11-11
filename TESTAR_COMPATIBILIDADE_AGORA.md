# 🚀 Teste Rápido - Sistema de Compatibilidade

## ⚡ Teste em 3 Minutos

### 1️⃣ Instalar Dependência (30 segundos)
```bash
npm install node-fetch
```

### 2️⃣ Popular Dados de Exemplo (1 minuto)
```bash
node scripts/addSampleCompatibility.js
```

Você verá:
```
🚀 Adicionando compatibilidades de exemplo...

📦 Processando: Filtro de Óleo
   ✓ Peça criada: abc123
   ✓ Veículo criado: Honda CG 160
   ✓ Compatibilidade adicionada: Honda CG 160
   ...

✅ Dados de exemplo adicionados com sucesso!
```

### 3️⃣ Testar na Interface (1 minuto)

1. **Inicie o projeto**:
   ```bash
   npm run dev
   ```

2. **Acesse**: `http://localhost:5173/inventory`

3. **Clique** no botão roxo **"Buscar por Veículo"**

4. **Selecione**:
   - Tipo: **Moto** 🏍️
   - Marca: **Honda**
   - Modelo: **CG 160**
   - Ano: **2024**

5. **Veja** as peças compatíveis aparecerem! ✨

6. **Clique** em **"Ver Evidências"** para ver as fontes

---

## 🎯 O Que Você Deve Ver

### Modal de Busca
- ✅ Seletor de tipo com ícones (Carro/Moto/Caminhão)
- ✅ Autocomplete de marcas
- ✅ Autocomplete de modelos
- ✅ Dropdown de anos
- ✅ Animações suaves

### Resultados
- ✅ Cards de peças com imagens
- ✅ Badges de confiança coloridos (Alta/Média/Baixa)
- ✅ Códigos OE
- ✅ Contador de fontes
- ✅ Botões de ação

### Modal de Evidências
- ✅ Glass effect (fundo fosco)
- ✅ Timeline de fontes
- ✅ Pontuação de confiança
- ✅ Links externos
- ✅ Data de atualização

---

## 🐛 Problemas Comuns

### "Cannot find module 'node-fetch'"
```bash
npm install node-fetch
```

### "No such file or directory"
Certifique-se de estar na raiz do projeto:
```bash
cd /caminho/do/projeto
node scripts/addSampleCompatibility.js
```

### "Permission denied"
No Firebase Console:
1. Vá em Firestore Database
2. Rules
3. Adicione:
```javascript
match /vehicles/{doc} { allow read, write: if true; }
match /parts/{doc} { allow read, write: if true; }
match /compatibility/{doc} { allow read, write: if true; }
```

### Nenhuma peça aparece
1. Verifique o console do navegador (F12)
2. Execute novamente: `node scripts/addSampleCompatibility.js`
3. Verifique no Firebase Console se há dados em `/compatibility`

---

## 📊 Dados de Teste Incluídos

### Peças (3)
1. **Filtro de Óleo** - Mann Filter
   - Compatível com: Honda CG 160, Bros 160
   - Confiança: Alta (80%)
   - Fontes: OEM + Marketplace

2. **Pastilha de Freio** - Cobreq
   - Compatível com: Fiat Argo, Cronos
   - Confiança: Alta (50%)
   - Fontes: OEM

3. **Vela de Ignição** - NGK
   - Compatível com: Yamaha Factor, Fazer
   - Confiança: Média (65%)
   - Fontes: OEM + Forum

### Veículos (6)
- Honda CG 160 (2015-2024)
- Honda Bros 160 (2015-2024)
- Fiat Argo (2017-2024)
- Fiat Cronos (2018-2024)
- Yamaha Factor 150 (2016-2024)
- Yamaha Fazer 150 (2016-2024)

---

## ✅ Checklist de Teste

- [ ] Script executado sem erros
- [ ] Modal abre ao clicar no botão
- [ ] Seletor de tipo funciona
- [ ] Marcas carregam da FIPE
- [ ] Modelos carregam ao selecionar marca
- [ ] Anos carregam ao selecionar modelo
- [ ] Peças aparecem após seleção completa
- [ ] Badges de confiança estão coloridos
- [ ] Modal de evidências abre
- [ ] Animações estão suaves
- [ ] Design está premium

---

## 🎉 Próximo Passo

Se tudo funcionou, você está pronto para:

1. **Adicionar mais dados**:
   ```bash
   node scripts/populateVehiclesFromFIPE.js
   ```
   ⚠️ Isso pode levar horas e fazer milhares de requisições

2. **Configurar índices**:
   ```bash
   firebase deploy --only firestore:indexes
   ```

3. **Usar em produção**! 🚀

---

## 📚 Documentação Completa

- `SISTEMA_COMPATIBILIDADE_VEICULOS.md` - Arquitetura completa
- `GUIA_INSTALACAO_COMPATIBILIDADE.md` - Instalação detalhada
- `ENTREGA_SISTEMA_COMPATIBILIDADE.md` - Resumo executivo

---

**Tempo total**: ~3 minutos ⏱️
**Dificuldade**: Fácil 🟢
**Status**: Pronto para testar! ✅
