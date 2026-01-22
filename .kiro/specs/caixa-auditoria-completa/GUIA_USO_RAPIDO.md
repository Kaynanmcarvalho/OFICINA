# 🚀 GUIA DE USO RÁPIDO - MÓDULO DE CAIXA

**Versão:** 1.0  
**Data:** 22 de Janeiro de 2025

---

## 📖 VISÃO GERAL

O Módulo de Caixa do TORQ permite controlar o dinheiro físico do seu negócio de forma profissional, com:
- ✅ Abertura e fechamento de caixa
- ✅ Controle de saldo em tempo real
- ✅ Separação por forma de pagamento
- ✅ Cálculo automático de diferenças
- ✅ Auditoria completa

---

## 🎯 FLUXO BÁSICO

### 1️⃣ **ABRIR O CAIXA** (Início do Dia)

1. Acesse o PDV (`/caixa`)
2. Se não houver caixa aberto, você verá um aviso
3. Clique em **"Abrir Caixa"**
4. Informe:
   - **Troco Inicial:** Conte o dinheiro físico no caixa
   - **Turno:** Selecione o turno de trabalho
   - **Observações:** (opcional) Ex: "Troco conferido"
5. Clique em **"Abrir Caixa"**

✅ **Pronto!** O caixa está aberto e você pode fazer vendas.

---

### 2️⃣ **FAZER VENDAS** (Durante o Dia)

1. Adicione produtos ao carrinho
2. Clique em **"Finalizar Venda"**
3. Escolha a forma de pagamento:
   - **Dinheiro:** Entra no caixa físico
   - **PIX/Cartão:** Não entra no caixa físico
4. Confirme a venda

✅ **Automático!** A venda é registrada no caixa automaticamente.

---

### 3️⃣ **ACOMPANHAR O CAIXA** (Durante o Dia)

No topo da página, você verá o **Banner de Caixa Aberto** com:
- 💰 **Saldo Esperado:** Quanto deveria ter no caixa
- 📊 **Total de Vendas:** Quantas vendas foram feitas
- ⏱️ **Tempo Aberto:** Há quanto tempo o caixa está aberto

**Dica:** Clique em **"Detalhes"** para ver o resumo completo.

---

### 4️⃣ **FECHAR O CAIXA** (Fim do Dia)

1. Clique em **"Fechar Caixa"** no banner
2. Você verá o **Resumo de Movimentações**:
   - Saldo inicial
   - Entradas (dinheiro, PIX, cartões)
   - Saídas (sangrias)
   - Reforços (troco)
   - **Saldo Esperado**
3. **Conte o dinheiro físico** no caixa
4. Informe o **Saldo Contado**
5. O sistema calcula a **Diferença** automaticamente:
   - ✅ **Verde:** Sobra
   - ❌ **Vermelho:** Falta
   - ⚪ **Sem diferença:** Perfeito!

#### Se houver diferença:

**Diferença > R$ 5,00:**
- ⚠️ Justificativa obrigatória
- Ex: "Nota de R$ 10 rasgada"

**Diferença > R$ 10,00:**
- 🔐 Autorização de gerente obrigatória
- Informe a senha do gerente

**Diferença > R$ 50,00:**
- 🚨 Alerta grave
- Verifique a contagem antes de prosseguir

6. Clique em **"Fechar Caixa"**

✅ **Pronto!** O caixa está fechado e os dados foram salvos.

---

## 💡 DICAS IMPORTANTES

### ✅ BOAS PRÁTICAS

1. **Sempre conte o dinheiro** antes de abrir o caixa
2. **Confira o saldo** durante o dia
3. **Registre sangrias** quando retirar dinheiro
4. **Adicione reforço** quando precisar de mais troco
5. **Conte com calma** ao fechar o caixa
6. **Justifique diferenças** com clareza

### ⚠️ EVITE

1. ❌ Abrir caixa sem contar o troco
2. ❌ Fazer vendas sem caixa aberto
3. ❌ Retirar dinheiro sem registrar sangria
4. ❌ Fechar caixa sem contar o dinheiro
5. ❌ Ignorar diferenças sem justificar

---

## 🔐 SEGURANÇA

### Validações Automáticas:

- ✅ Apenas **um caixa aberto** por operador
- ✅ Apenas **um caixa aberto** por ponto de venda
- ✅ **Justificativa obrigatória** para diferenças > R$ 5,00
- ✅ **Autorização de gerente** para diferenças > R$ 10,00
- ✅ **Registro de todas as movimentações**
- ✅ **Dados imutáveis** no histórico

---

## 📊 ENTENDENDO OS VALORES

### 💰 Saldo Esperado
É o valor que **deveria ter** no caixa físico:
```
Saldo Esperado = Saldo Inicial + Entradas (Dinheiro) - Saídas + Reforços
```

### 💵 Saldo Contado
É o valor que você **contou** no caixa físico ao fechar.

### 📈 Diferença
É a diferença entre o que você contou e o que deveria ter:
```
Diferença = Saldo Contado - Saldo Esperado
```

**Exemplos:**
- Saldo Esperado: R$ 500,00
- Saldo Contado: R$ 500,00
- **Diferença: R$ 0,00** ✅ Perfeito!

- Saldo Esperado: R$ 500,00
- Saldo Contado: R$ 510,00
- **Diferença: +R$ 10,00** ✅ Sobra

- Saldo Esperado: R$ 500,00
- Saldo Contado: R$ 490,00
- **Diferença: -R$ 10,00** ❌ Falta

---

## 🎨 INTERFACE

### Banner de Caixa Aberto
```
┌─────────────────────────────────────────────────────────┐
│ 🟢 Caixa Aberto #46                                     │
│ João Silva • 2h 30min                                   │
│                                                          │
│ 💰 R$ 300,00  |  📊 12 vendas  |  ⏱️ 2h 30min          │
│                                                          │
│ [Detalhes ▼]  [🔒 Fechar Caixa]                        │
└─────────────────────────────────────────────────────────┘
```

### Modal de Abertura
```
┌─────────────────────────────────────────────────────────┐
│ 🔓 ABERTURA DE CAIXA                                    │
│ ─────────────────────────────────────────────────────   │
│                                                          │
│ 💰 Troco Inicial *                                      │
│ R$ [_______100,00_______]                               │
│                                                          │
│ 🎯 Turno                                                │
│ ○ Manhã    ● Tarde    ○ Noite    ○ Integral            │
│                                                          │
│ 📝 Observações (opcional)                               │
│ [Troco conferido e correto]                            │
│                                                          │
│ [Cancelar]  [✅ Abrir Caixa]                            │
└─────────────────────────────────────────────────────────┘
```

### Modal de Fechamento
```
┌─────────────────────────────────────────────────────────┐
│ 🔒 FECHAMENTO DE CAIXA                                  │
│ ─────────────────────────────────────────────────────   │
│                                                          │
│ 📊 RESUMO DO CAIXA #46                                  │
│ Saldo Inicial:        R$    100,00                      │
│ Entradas (Dinheiro):  R$    450,00                      │
│ Saídas (Sangrias):    R$   -300,00                      │
│ Reforços (Troco):     R$     50,00                      │
│ ─────────────────────────────────────────────────────   │
│ SALDO ESPERADO:       R$    300,00                      │
│                                                          │
│ 💵 Contagem do Caixa *                                  │
│ R$ [_______300,00_______]                               │
│                                                          │
│ ✅ DIFERENÇA: R$ 0,00                                   │
│ Caixa está correto!                                     │
│                                                          │
│ [Cancelar]  [🔒 Fechar Caixa]                           │
└─────────────────────────────────────────────────────────┘
```

---

## ❓ PERGUNTAS FREQUENTES

### 1. **Posso fazer vendas sem abrir o caixa?**
❌ Não. O sistema vai pedir para abrir o caixa primeiro.

### 2. **Posso ter dois caixas abertos ao mesmo tempo?**
❌ Não. Apenas um caixa por operador e por ponto de venda.

### 3. **O que acontece se eu fechar o navegador?**
✅ O caixa continua aberto. Os dados estão salvos no servidor.

### 4. **Vendas em PIX entram no caixa físico?**
❌ Não. Apenas vendas em **dinheiro** entram no caixa físico.

### 5. **E se eu errar o valor ao abrir o caixa?**
⚠️ Você precisará fechar o caixa e abrir um novo. Por isso, sempre confira antes!

### 6. **Posso reabrir um caixa fechado?**
⏳ Não na FASE 1. Essa funcionalidade virá na FASE 3.

### 7. **Onde vejo o histórico de caixas?**
⏳ Não na FASE 1. Essa funcionalidade virá na FASE 3.

---

## 🆘 SUPORTE

### Problemas Comuns:

**"Erro ao abrir caixa"**
- Verifique se você já tem um caixa aberto
- Verifique sua conexão com a internet
- Tente recarregar a página

**"Erro ao registrar venda"**
- Verifique se o caixa está aberto
- Verifique sua conexão com a internet
- Tente novamente

**"Erro ao fechar caixa"**
- Verifique se informou o saldo contado
- Verifique se preencheu a justificativa (se necessário)
- Verifique se informou a senha do gerente (se necessário)

---

## 📞 CONTATO

Precisa de ajuda? Entre em contato:
- 📧 Email: suporte@torq.com.br
- 💬 Chat: Disponível no sistema
- 📱 WhatsApp: (00) 0000-0000

---

**Última Atualização:** 22 de Janeiro de 2025  
**Versão do Sistema:** 1.0 - FASE 1
