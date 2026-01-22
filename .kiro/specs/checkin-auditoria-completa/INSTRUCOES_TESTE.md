# 🧪 INSTRUÇÕES DE TESTE - CORREÇÕES /CHECKIN

## 📋 OBJETIVO

Validar todas as correções implementadas no módulo /checkin do TORQ.

---

## 🎯 CENÁRIOS DE TESTE

### 1. AUTO-SAVE ✅

#### Teste 1.1: Salvar Automaticamente
**Passos:**
1. Abrir modal de novo check-in
2. Preencher campo "Nome do Cliente"
3. Aguardar 30 segundos
4. Verificar console: `[AutoSave] Draft saved at...`

**Resultado Esperado:**
- ✅ Mensagem de log no console
- ✅ Dados salvos no localStorage

#### Teste 1.2: Recuperar Rascunho
**Passos:**
1. Abrir modal de novo check-in
2. Preencher alguns campos
3. Fechar modal (Esc)
4. Reabrir modal

**Resultado Esperado:**
- ✅ Toast: "Rascunho recuperado!"
- ✅ Campos preenchidos com dados anteriores

#### Teste 1.3: Limpar Após Sucesso
**Passos:**
1. Abrir modal de novo check-in
2. Preencher todos os campos
3. Finalizar check-in
4. Reabrir modal

**Resultado Esperado:**
- ✅ Modal vazio (sem rascunho)
- ✅ Campos limpos

---

### 2. BUSCA AUTOMÁTICA DE PLACA ✅

#### Teste 2.1: Busca Automática
**Passos:**
1. Abrir modal de novo check-in
2. Ir para step "Veículo"
3. Digitar placa válida (7 caracteres): `ABC1D23`
4. Aguardar 500ms

**Resultado Esperado:**
- ✅ Indicador "Buscando..." aparece
- ✅ Dados do veículo preenchidos automaticamente
- ✅ Toast: "Veículo encontrado: [Marca] [Modelo]"
- ✅ Borda verde no campo de placa

#### Teste 2.2: Placa Não Encontrada
**Passos:**
1. Abrir modal de novo check-in
2. Ir para step "Veículo"
3. Digitar placa inválida: `XXX9999`
4. Aguardar 500ms

**Resultado Esperado:**
- ✅ Mensagem de erro: "Veículo não encontrado. Preencha os dados manualmente."
- ✅ Borda vermelha no campo de placa
- ✅ Campos vazios (permite preenchimento manual)

#### Teste 2.3: Busca Manual
**Passos:**
1. Abrir modal de novo check-in
2. Ir para step "Veículo"
3. Digitar placa: `ABC1234`
4. Clicar no botão "Buscar"

**Resultado Esperado:**
- ✅ Busca forçada imediatamente
- ✅ Dados preenchidos se encontrado

---

### 3. ATALHOS DE TECLADO ✅

#### Teste 3.1: Esc para Fechar
**Passos:**
1. Abrir modal de novo check-in
2. Pressionar `Esc`

**Resultado Esperado:**
- ✅ Modal fecha imediatamente

#### Teste 3.2: Enter para Avançar
**Passos:**
1. Abrir modal de novo check-in
2. Preencher "Nome do Cliente"
3. Pressionar `Enter`

**Resultado Esperado:**
- ✅ Avança para step "Veículo"

#### Teste 3.3: Shift+Enter para Voltar
**Passos:**
1. Abrir modal de novo check-in
2. Ir para step "Veículo"
3. Pressionar `Shift+Enter`

**Resultado Esperado:**
- ✅ Volta para step "Cliente"

#### Teste 3.4: Ctrl+Enter para Submeter
**Passos:**
1. Abrir modal de novo check-in
2. Preencher todos os campos
3. Ir para último step "Fotos"
4. Pressionar `Ctrl+Enter`

**Resultado Esperado:**
- ✅ Check-in criado
- ✅ Toast: "Check-in realizado com sucesso!"
- ✅ Modal fecha

---

### 4. VALIDAÇÕES ✅

#### Teste 4.1: Telefone Inválido
**Passos:**
1. Abrir modal de novo check-in
2. Preencher "Telefone": `123`
3. Finalizar check-in

**Resultado Esperado:**
- ✅ Toast: "Telefone inválido"
- ✅ Volta para step "Cliente"
- ✅ Check-in não criado

#### Teste 4.2: Email Inválido
**Passos:**
1. Abrir modal de novo check-in
2. Preencher "Email": `teste@`
3. Finalizar check-in

**Resultado Esperado:**
- ✅ Toast: "Email inválido"
- ✅ Volta para step "Cliente"
- ✅ Check-in não criado

#### Teste 4.3: Placa Inválida
**Passos:**
1. Abrir modal de novo check-in
2. Preencher "Placa": `ABC`
3. Finalizar check-in

**Resultado Esperado:**
- ✅ Toast: "Placa inválida"
- ✅ Volta para step "Veículo"
- ✅ Check-in não criado

#### Teste 4.4: Formatação Automática
**Passos:**
1. Abrir modal de novo check-in
2. Preencher "Telefone": `11987654321`
3. Finalizar check-in
4. Verificar no Firestore

**Resultado Esperado:**
- ✅ Telefone salvo como: `(11) 98765-4321`

---

### 5. VALIDAÇÃO DE DUPLICIDADE ✅

#### Teste 5.1: Check-in Duplicado
**Passos:**
1. Criar check-in com placa `ABC1234`
2. Tentar criar outro check-in com mesma placa

**Resultado Esperado:**
- ✅ Toast: "Já existe um check-in ativo para esta placa!"
- ✅ Mensagem mostra ID do check-in existente
- ✅ Check-in não criado

#### Teste 5.2: Placa Diferente
**Passos:**
1. Criar check-in com placa `ABC1234`
2. Criar check-in com placa `XYZ5678`

**Resultado Esperado:**
- ✅ Ambos criados com sucesso
- ✅ Sem erro de duplicidade

---

### 6. AUDITORIA ✅

#### Teste 6.1: Log de Criação
**Passos:**
1. Criar novo check-in
2. Verificar Firestore: `auditLogs` collection

**Resultado Esperado:**
- ✅ Documento criado com:
  - `action: 'create'`
  - `entityType: 'checkin'`
  - `entityId: [ID do check-in]`
  - `userId: [ID do usuário]`
  - `userName: [Nome do usuário]`
  - `timestamp: [Data/hora]`
  - `data: [Dados do check-in]`

---

## 🎯 CHECKLIST RÁPIDO

### Funcionalidades Básicas
- [ ] Modal abre e fecha
- [ ] Steps navegam corretamente
- [ ] Campos salvam dados
- [ ] Check-in é criado

### Auto-Save
- [ ] Salva após 30s
- [ ] Recupera ao reabrir
- [ ] Limpa após sucesso

### Busca Automática
- [ ] Busca após 7 caracteres
- [ ] Preenche dados automaticamente
- [ ] Mostra erro se não encontrar

### Atalhos
- [ ] Esc fecha modal
- [ ] Enter avança step
- [ ] Shift+Enter volta step
- [ ] Ctrl+Enter submete

### Validações
- [ ] Telefone inválido bloqueado
- [ ] Email inválido bloqueado
- [ ] Placa inválida bloqueada
- [ ] Formatação automática funciona

### Duplicidade
- [ ] Check-in duplicado bloqueado
- [ ] Mensagem clara com ID

### Auditoria
- [ ] Log criado no Firestore
- [ ] Dados completos registrados

---

## 🐛 COMO REPORTAR BUGS

### Informações Necessárias
1. **Cenário:** Qual teste estava executando?
2. **Passos:** O que fez exatamente?
3. **Esperado:** O que deveria acontecer?
4. **Obtido:** O que aconteceu de fato?
5. **Console:** Erros no console do navegador?
6. **Screenshots:** Capturas de tela (se aplicável)

### Exemplo de Reporte
```
CENÁRIO: Teste 2.1 - Busca Automática
PASSOS: 
1. Abri modal
2. Digitei placa ABC1234
3. Aguardei 500ms

ESPERADO: Dados preenchidos automaticamente
OBTIDO: Nada aconteceu

CONSOLE: 
[AutoPlateSearch] Error: Network request failed

SCREENSHOT: [anexar]
```

---

## 📊 RELATÓRIO DE TESTES

### Template
```markdown
# Relatório de Testes - /checkin

**Data:** [Data]
**Testador:** [Nome]
**Ambiente:** [Desenvolvimento/Homologação/Produção]

## Resumo
- Total de testes: X
- Passou: Y
- Falhou: Z
- Taxa de sucesso: Y/X %

## Detalhes

### Auto-Save
- [ ] Teste 1.1: ✅ Passou / ❌ Falhou
- [ ] Teste 1.2: ✅ Passou / ❌ Falhou
- [ ] Teste 1.3: ✅ Passou / ❌ Falhou

### Busca Automática
- [ ] Teste 2.1: ✅ Passou / ❌ Falhou
- [ ] Teste 2.2: ✅ Passou / ❌ Falhou
- [ ] Teste 2.3: ✅ Passou / ❌ Falhou

[... continuar para todos os testes]

## Bugs Encontrados
1. [Descrição do bug 1]
2. [Descrição do bug 2]

## Observações
[Comentários adicionais]
```

---

## 🚀 PRÓXIMOS PASSOS

Após completar todos os testes:

1. ✅ Preencher relatório de testes
2. ✅ Reportar bugs encontrados
3. ✅ Aguardar correções (se necessário)
4. ✅ Re-testar bugs corrigidos
5. ✅ Aprovar para produção

---

**Boa sorte nos testes!** 🎯
