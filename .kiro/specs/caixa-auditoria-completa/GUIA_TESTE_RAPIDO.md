# 🧪 GUIA DE TESTE RÁPIDO - MÓDULO DE CAIXA

**Data:** 22 de Janeiro de 2025  
**Tempo Estimado:** 15-20 minutos

---

## 🎯 OBJETIVO

Testar o fluxo completo do módulo de caixa integrado no PDV.

---

## ⚠️ ANTES DE COMEÇAR

### 1. **Configurar Firestore** (OBRIGATÓRIO)

Você precisa criar os índices no Firestore antes de testar:

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em **Firestore Database** > **Indexes**
4. Clique em **Create Index**

**Índice 1:**
- Collection: `caixas`
- Fields:
  - `empresaId` (Ascending)
  - `status` (Ascending)
  - `dataAbertura` (Descending)

**Índice 2:**
- Collection: `caixas`
- Fields:
  - `empresaId` (Ascending)
  - `operadorAbertura.uid` (Ascending)
  - `status` (Ascending)

5. Aguarde a criação dos índices (pode levar alguns minutos)

---

## 🚀 TESTE 1: ABERTURA DE CAIXA

### Passo a Passo:

1. **Abra o sistema**
   ```
   npm run dev
   ```

2. **Faça login** com seu usuário

3. **Acesse o PDV**
   - Clique em "Caixa" no menu lateral
   - Ou acesse: http://localhost:5173/caixa

4. **Tente fazer uma venda SEM abrir o caixa**
   - Adicione um produto ao carrinho
   - Clique em "Finalizar Venda"
   - ✅ **Deve aparecer:** Erro "Abra o caixa antes de fazer vendas"
   - ✅ **Deve abrir:** Modal de abertura de caixa

5. **Abra o caixa**
   - Informe troco inicial: `R$ 100,00`
   - Selecione turno: `Integral`
   - Adicione observação: `Teste de abertura`
   - Clique em **"Abrir Caixa"**

6. **Verifique o resultado**
   - ✅ Banner deve aparecer no topo
   - ✅ Banner deve mostrar: "Saldo: R$ 100,00"
   - ✅ Banner deve mostrar: "Vendas: R$ 0,00"
   - ✅ Banner deve mostrar tempo decorrido

7. **Verifique no Firestore**
   - Acesse Firestore Console
   - Vá em collection `caixas`
   - ✅ Deve ter um documento com:
     - `status: "aberto"`
     - `saldoInicial: 100`
     - `saldoEsperado: 100`
     - `operadorAbertura.nome: "Seu Nome"`

---

## 💰 TESTE 2: VENDA EM DINHEIRO

### Passo a Passo:

1. **Adicione um produto ao carrinho**
   - Busque um produto
   - Clique para adicionar

2. **Finalize a venda**
   - Clique em "Finalizar Venda"
   - ✅ **Deve funcionar** (caixa está aberto)

3. **Informe o pagamento**
   - Selecione: **Dinheiro**
   - Valor: `R$ 50,00`
   - Clique em "Confirmar Pagamento"

4. **Confirme a venda**
   - Clique em "Confirmar Venda"

5. **Verifique o resultado**
   - ✅ Banner deve atualizar: "Saldo: R$ 150,00"
   - ✅ Banner deve atualizar: "Vendas: R$ 50,00"
   - ✅ Notificação: "Venda finalizada!"

6. **Verifique no Firestore**
   - Collection `caixas` > Seu caixa:
     - ✅ `saldoEsperado: 150`
     - ✅ `totalVendas: 50`
     - ✅ `entradas.dinheiro: 50`
   - Collection `vendas` > Última venda:
     - ✅ `caixaId: "id-do-caixa"`
     - ✅ `afetaCaixaFisico: true`
     - ✅ `valorCaixaFisico: 50`

---

## 💳 TESTE 3: VENDA EM PIX

### Passo a Passo:

1. **Adicione outro produto ao carrinho**

2. **Finalize a venda**
   - Clique em "Finalizar Venda"

3. **Informe o pagamento**
   - Selecione: **PIX**
   - Valor: `R$ 30,00`
   - Clique em "Confirmar Pagamento"

4. **Confirme a venda**
   - Clique em "Confirmar Venda"

5. **Verifique o resultado**
   - ✅ Banner deve manter: "Saldo: R$ 150,00" (PIX não entra no físico)
   - ✅ Banner deve atualizar: "Vendas: R$ 80,00"

6. **Verifique no Firestore**
   - Collection `caixas` > Seu caixa:
     - ✅ `saldoEsperado: 150` (não mudou)
     - ✅ `totalVendas: 80`
     - ✅ `entradas.pix: 30`
   - Collection `vendas` > Última venda:
     - ✅ `afetaCaixaFisico: false`
     - ✅ `valorCaixaFisico: 0`

---

## 🔒 TESTE 4: FECHAMENTO SEM DIFERENÇA

### Passo a Passo:

1. **Clique em "Fechar Caixa"** no banner

2. **Verifique o resumo**
   - ✅ Saldo Inicial: R$ 100,00
   - ✅ Entradas: R$ 50,00 (dinheiro)
   - ✅ Saldo Esperado: R$ 150,00
   - ✅ Total de Vendas: R$ 80,00

3. **Informe o saldo contado**
   - Digite: `R$ 150,00`
   - ✅ Diferença deve aparecer: **R$ 0,00** (verde)

4. **Adicione observação** (opcional)
   - Digite: `Teste de fechamento`

5. **Clique em "Fechar Caixa"**

6. **Verifique o resultado**
   - ✅ Banner deve desaparecer
   - ✅ Notificação: "Caixa fechado! Sem diferenças."

7. **Verifique no Firestore**
   - Collection `caixas` > Seu caixa:
     - ✅ `status: "fechado"`
     - ✅ `saldoContado: 150`
     - ✅ `diferenca: 0`

---

## ⚠️ TESTE 5: FECHAMENTO COM DIFERENÇA

### Passo a Passo:

1. **Abra um novo caixa**
   - Troco inicial: `R$ 100,00`
   - Turno: `Integral`

2. **Faça uma venda em dinheiro**
   - Valor: `R$ 50,00`
   - ✅ Saldo esperado: R$ 150,00

3. **Clique em "Fechar Caixa"**

4. **Informe saldo contado DIFERENTE**
   - Digite: `R$ 140,00` (faltando R$ 10)
   - ✅ Diferença deve aparecer: **-R$ 10,00** (vermelho)
   - ✅ Alerta deve aparecer: "Diferença detectada!"

5. **Informe justificativa**
   - ✅ Campo de justificativa deve aparecer
   - Digite: `Teste de diferença`

6. **Clique em "Fechar Caixa"**

7. **Verifique o resultado**
   - ✅ Notificação: "Caixa fechado! Diferença: R$ 10,00"

8. **Verifique no Firestore**
   - Collection `caixas` > Seu caixa:
     - ✅ `status: "fechado"`
     - ✅ `saldoContado: 140`
     - ✅ `diferenca: -10`
     - ✅ `justificativaDiferenca: "Teste de diferença"`

---

## 🔐 TESTE 6: DIFERENÇA CRÍTICA (> R$ 10)

### Passo a Passo:

1. **Abra um novo caixa**
   - Troco inicial: `R$ 100,00`

2. **Faça uma venda em dinheiro**
   - Valor: `R$ 50,00`
   - ✅ Saldo esperado: R$ 150,00

3. **Clique em "Fechar Caixa"**

4. **Informe saldo contado com diferença > R$ 10**
   - Digite: `R$ 135,00` (faltando R$ 15)
   - ✅ Diferença: **-R$ 15,00** (vermelho)
   - ✅ Alerta crítico deve aparecer

5. **Informe justificativa**
   - Digite: `Teste de diferença crítica`

6. **Informe senha de gerente**
   - ✅ Campo de senha deve aparecer
   - Digite: `teste123` (ou sua senha de gerente)

7. **Clique em "Fechar Caixa"**

8. **Verifique o resultado**
   - ✅ Notificação: "Caixa fechado! Diferença: R$ 15,00"

9. **Verifique no Firestore**
   - Collection `caixas` > Seu caixa:
     - ✅ `diferenca: -15`
     - ✅ `autorizacaoGerente.autorizado: true`
     - ✅ `autorizacaoGerente.senha: "teste123"`

---

## ✅ CHECKLIST DE VALIDAÇÃO

Marque cada item após testar:

### Abertura de Caixa
- [ ] Modal abre ao tentar vender sem caixa
- [ ] Validação de troco inicial funciona
- [ ] Banner aparece após abertura
- [ ] Dados salvos no Firestore

### Vendas
- [ ] Venda em dinheiro atualiza saldo
- [ ] Venda em PIX não atualiza saldo físico
- [ ] Banner atualiza em tempo real
- [ ] Campos de caixa salvos na venda

### Fechamento
- [ ] Resumo exibe valores corretos
- [ ] Cálculo de diferença funciona
- [ ] Justificativa obrigatória (> R$ 5)
- [ ] Autorização obrigatória (> R$ 10)
- [ ] Banner desaparece após fechar

### Firestore
- [ ] Collection `caixas` criada
- [ ] Documentos com estrutura correta
- [ ] Movimentações registradas
- [ ] Timestamps corretos

---

## 🐛 PROBLEMAS COMUNS

### 1. **Erro: "Missing or insufficient permissions"**
**Solução:** Adicione as rules do Firestore (veja `PROXIMOS_PASSOS_EXATOS.md`)

### 2. **Erro: "Index not found"**
**Solução:** Crie os índices no Firestore Console (veja início deste guia)

### 3. **Banner não aparece**
**Solução:** Verifique se o caixa foi salvo no Firestore e recarregue a página

### 4. **Saldo não atualiza**
**Solução:** Verifique se a venda foi registrada no caixa (console.log no handleSaleConfirm)

---

## 📊 MÉTRICAS DE SUCESSO

Se todos os testes passarem:
- ✅ **100% das funcionalidades** da FASE 1 estão funcionando
- ✅ **0 bugs críticos** encontrados
- ✅ **Pronto para produção** (após configurar Firestore)

---

## 🎉 PRÓXIMOS PASSOS

Após todos os testes passarem:

1. ✅ Configurar Firestore Rules
2. ✅ Deploy em staging
3. ✅ Validação com stakeholders
4. ✅ Deploy em produção
5. ✅ Iniciar FASE 2 (Sangria e Reforço)

---

**Boa sorte com os testes!** 🚀

Se encontrar algum problema, consulte:
- `INTEGRACAO_COMPLETA.md` - Detalhes da integração
- `PROXIMOS_PASSOS_EXATOS.md` - Próximos passos
- `CHECKLIST_INTEGRACAO.md` - Checklist completo

---

**Última Atualização:** 22 de Janeiro de 2025, 15:35  
**Tempo de Teste:** 15-20 minutos

