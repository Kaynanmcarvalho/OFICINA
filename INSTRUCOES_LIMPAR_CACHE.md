# 🗑️ Instruções para Limpar Cache da Placa FRD4486

## 🎯 Objetivo

Limpar o cache antigo da placa FRD4486 que contém dados incompletos (marca e cor vazias).

---

## ✅ Método Recomendado: Firebase Console

### Passo 1: Acessar Firebase Console

1. Abra: https://console.firebase.google.com
2. Selecione seu projeto
3. No menu lateral, clique em **"Firestore Database"**

### Passo 2: Navegar até a Placa

1. Na lista de coleções, procure por: **`vehiclesCache`**
2. Clique na coleção `vehiclesCache`
3. Procure o documento: **`FRD4486`**

### Passo 3: Deletar o Documento

1. Clique no documento `FRD4486`
2. No canto superior direito, clique nos **3 pontinhos (⋮)**
3. Selecione **"Delete document"**
4. Confirme a exclusão

### Passo 4: Verificar

1. O documento `FRD4486` deve desaparecer da lista
2. ✅ Cache limpo com sucesso!

---

## 🧪 Testar Nova Busca

Agora que o cache foi limpo, vamos testar:

### 1. Abrir o Sistema

```
http://localhost:5173
```

### 2. Ir para Novo Cliente

1. Clique em "Check-in"
2. Clique em "Novo Check-in"
3. Preencha os dados do cliente
4. Vá para etapa "Veículos"

### 3. Buscar a Placa

1. Clique em "Adicionar Veículo"
2. Digite a placa: **FRD4486**
3. Clique em **"Buscar"**

### 4. Resultado Esperado

Você deve ver a caixa verde com:

```
┌─────────────────────────────────────┐
│ Tipo: Carro                         │
│ Marca: MERCEDES-BENZ        ✅      │
│ Modelo: A45AMG4M            ✅      │
│ Ano: 2013                   ✅      │
│ Cor: Cinza                  ✅      │
└─────────────────────────────────────┘
```

---

## 📊 Verificar Logs

Abra o Console do navegador (F12) e você deve ver:

```
[CACHE] 🔍 Buscando placa FRD4486 no cache...
[CACHE] ❌ Placa não encontrada no cache
[VEHICLE API] 🔍 Buscando placa: FRD4486
[KEPLACA] 🔍 Consultando placa: FRD4486
[KEPLACA] ✅ Dados extraídos!
[KEPLACA] 📦 Marca: MERCEDES-BENZ | Modelo: A45AMG4M | Ano: 2013 | Cor: Cinza
[CACHE] 💾 Validando dados antes de salvar placa FRD4486...
[CACHE] ✅ Validação OK! Todos os campos obrigatórios preenchidos
[CACHE] 📦 Marca: MERCEDES-BENZ | Modelo: A45AMG4M | Ano: 2013 | Cor: Cinza
[CACHE] ✅ Placa salva no cache com sucesso!
```

---

## ✅ Checklist

- [ ] Acessei Firebase Console
- [ ] Encontrei a coleção `vehiclesCache`
- [ ] Deletei o documento `FRD4486`
- [ ] Abri o sistema no navegador
- [ ] Busquei a placa FRD4486
- [ ] Vi todos os dados completos (marca, modelo, ano, cor)
- [ ] Verifiquei os logs no console

---

## 🎉 Pronto!

Agora:
1. ✅ Cache antigo foi removido
2. ✅ Nova busca pega dados completos do scraper
3. ✅ Dados completos são salvos no cache
4. ✅ Próximas buscas usarão cache correto

---

## 🔧 Solução Permanente Implementada

A partir de agora, o sistema **só salva no cache se TODOS os campos obrigatórios estiverem preenchidos**:

- ✅ Marca
- ✅ Modelo
- ✅ Ano
- ✅ Cor

Se algum campo estiver vazio, o sistema:
- ❌ NÃO salva no cache
- 🔄 Busca novamente do scraper na próxima vez
- 📝 Registra nos logs

**Isso garante que o cache sempre terá dados de qualidade!**
