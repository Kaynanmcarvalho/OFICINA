# 🧪 Guia de Testes - Módulo Inventory

## Checklist completo para testar todas as funcionalidades

---

## ✅ 1. Testes Básicos de CRUD

### 1.1 Criar Produto
- [ ] Acessar `/inventory`
- [ ] Clicar em "Novo Produto"
- [ ] Preencher Step 1 (nome e categoria obrigatórios)
- [ ] Clicar em "Próximo" até o final
- [ ] Clicar em "Criar Produto"
- [ ] Verificar se produto aparece na lista
- [ ] Verificar toast de sucesso

### 1.2 Editar Produto
- [ ] Clicar em "Ver Detalhes" ou "Editar" em um produto
- [ ] Modificar informações
- [ ] Clicar em "Atualizar"
- [ ] Verificar se alterações foram salvas
- [ ] Verificar toast de sucesso

### 1.3 Visualizar Produto
- [ ] Clicar em "Ver Detalhes"
- [ ] Verificar todas as informações
- [ ] Navegar pelos 6 steps
- [ ] Verificar histórico (Step 6)

### 1.4 Buscar Produto
- [ ] Digite na barra de busca
- [ ] Verificar resultados em tempo real
- [ ] Buscar por: nome, SKU, código de barras, marca
- [ ] Limpar busca

---

## ✅ 2. Testes de Estoque

### 2.1 Adicionar Lotes
- [ ] Criar/editar produto
- [ ] Ir para Step 2
- [ ] Adicionar lote com validade
- [ ] Verificar lote na lista
- [ ] Remover lote

### 2.2 Reservar Estoque
```javascript
// Via código ou integração com orçamento
await reserveStock(productId, 5, 'BDG-123', 'Teste de reserva');
```
- [ ] Verificar que `stock_reserved` aumentou
- [ ] Verificar que estoque disponível diminuiu
- [ ] Verificar badge "Reservado" no card

### 2.3 Liberar Reserva
```javascript
await releaseReservedStock(productId, 5, 'BDG-123', 'Teste de liberação');
```
- [ ] Verificar que `stock_reserved` diminuiu
- [ ] Verificar que estoque disponível aumentou

### 2.4 Baixar Estoque
```javascript
await decreaseStock(productId, 3, 'sale', 'SALE-123', 'Teste de baixa');
```
- [ ] Verificar que `stock_total` diminuiu
- [ ] Verificar movimentação no histórico

### 2.5 Adicionar Estoque
```javascript
await increaseStock(productId, 10, lotData, 'Teste de entrada');
```
- [ ] Verificar que `stock_total` aumentou
- [ ] Verificar movimentação no histórico

---

## ✅ 3. Testes de Filtros

### 3.1 Filtro por Categoria
- [ ] Selecionar categoria no dropdown
- [ ] Verificar que apenas produtos da categoria aparecem
- [ ] Limpar filtro

### 3.2 Filtro Estoque Baixo
- [ ] Clicar em "Estoque Baixo"
- [ ] Verificar que apenas produtos com estoque <= mínimo aparecem
- [ ] Badge amarelo visível

### 3.3 Filtro Sem Estoque
- [ ] Clicar em "Sem Estoque"
- [ ] Verificar que apenas produtos com estoque = 0 aparecem
- [ ] Badge vermelho visível

### 3.4 Filtro Vencendo
- [ ] Clicar em "Vencendo"
- [ ] Verificar que apenas produtos com lotes vencendo em 30 dias aparecem
- [ ] Badge laranja visível

### 3.5 Múltiplos Filtros
- [ ] Aplicar categoria + estoque baixo
- [ ] Verificar que ambos os filtros funcionam juntos
- [ ] Limpar todos os filtros

---

## ✅ 4. Testes de Visualização

### 4.1 Grid View
- [ ] Verificar layout em grade
- [ ] Cards com imagens/ícones
- [ ] Hover effects funcionando
- [ ] Responsivo (testar em mobile)

### 4.2 List View
- [ ] Clicar no ícone de lista
- [ ] Verificar tabela responsiva
- [ ] Todas as colunas visíveis
- [ ] Scroll horizontal em mobile

### 4.3 Empty States
- [ ] Limpar todos os produtos (ou usar conta nova)
- [ ] Verificar empty state inicial
- [ ] Aplicar filtros sem resultados
- [ ] Verificar empty state de busca

---

## ✅ 5. Testes de Imagens

### 5.1 Upload de Imagens
- [ ] Ir para Step 4
- [ ] Fazer upload de múltiplas imagens
- [ ] Verificar preview
- [ ] Verificar upload no Firebase Storage

### 5.2 Definir Imagem Principal
- [ ] Clicar na estrela de uma imagem
- [ ] Verificar badge "Principal"
- [ ] Verificar que imagem aparece primeiro no card

### 5.3 Remover Imagens
- [ ] Clicar no X de uma imagem
- [ ] Verificar que imagem foi removida
- [ ] Verificar que imagem principal ajusta automaticamente

---

## ✅ 6. Testes de Compatibilidade

### 6.1 Adicionar Compatibilidade
- [ ] Ir para Step 5
- [ ] Adicionar marca, modelo, ano, motorização
- [ ] Verificar na lista
- [ ] Adicionar múltiplas compatibilidades

### 6.2 Remover Compatibilidade
- [ ] Clicar no ícone de lixeira
- [ ] Verificar que foi removida

### 6.3 Buscar por Compatibilidade
- [ ] Buscar por marca de veículo nas tags
- [ ] Verificar que produtos compatíveis aparecem

---

## ✅ 7. Testes de Histórico

### 7.1 Movimentações
- [ ] Criar produto
- [ ] Fazer várias movimentações (entrada, saída, reserva)
- [ ] Ir para Step 6
- [ ] Verificar todas as movimentações listadas
- [ ] Verificar ordem cronológica (mais recente primeiro)

### 7.2 Auditoria
- [ ] Criar produto
- [ ] Editar produto várias vezes
- [ ] Ir para Step 6 → Histórico de Alterações
- [ ] Verificar todos os logs
- [ ] Verificar usuário e timestamp

---

## ✅ 8. Testes de Integração

### 8.1 Com Orçamentos
```javascript
// Criar orçamento
const budgetId = 'TEST-BDG-001';

// Adicionar produto
await addProductToBudget(productId, 5, budgetId);
// ✓ Verificar reserva

// Aprovar orçamento
await approveBudget(budgetId, items, clientId);
// ✓ Verificar baixa definitiva
// ✓ Verificar histórico do cliente

// Cancelar orçamento
await cancelBudget(budgetId, items);
// ✓ Verificar liberação de reserva
```

### 8.2 Com Vendas
```javascript
// Venda direta
await processSale('SALE-001', items, clientId);
// ✓ Verificar baixa de estoque
// ✓ Verificar histórico do cliente
```

### 8.3 ProductSelector
- [ ] Abrir ProductSelector em orçamento/venda
- [ ] Buscar produtos
- [ ] Selecionar produto
- [ ] Definir quantidade
- [ ] Adicionar ao orçamento/venda
- [ ] Verificar que produto já selecionado fica desabilitado

---

## ✅ 9. Testes de Estatísticas

### 9.1 Cards de Estatísticas
- [ ] Verificar "Total de Produtos"
- [ ] Verificar "Valor Total"
- [ ] Verificar "Estoque Baixo" (com alerta se > 0)
- [ ] Verificar "Sem Estoque" (com alerta se > 0)
- [ ] Verificar "Vencendo em 30 dias" (com alerta se > 0)
- [ ] Verificar "Reservados"

### 9.2 Cálculos
- [ ] Criar produtos com diferentes preços
- [ ] Verificar que valor total está correto
- [ ] Adicionar/remover produtos
- [ ] Verificar que estatísticas atualizam em tempo real

---

## ✅ 10. Testes de Responsividade

### 10.1 Desktop (1920x1080)
- [ ] Grid com 4 colunas
- [ ] Todos os elementos visíveis
- [ ] Modal centralizado

### 10.2 Laptop (1366x768)
- [ ] Grid com 3 colunas
- [ ] Layout ajustado

### 10.3 Tablet (768x1024)
- [ ] Grid com 2 colunas
- [ ] Filtros colapsados
- [ ] Modal responsivo

### 10.4 Mobile (375x667)
- [ ] Grid com 1 coluna
- [ ] Cards empilhados
- [ ] Tabela com scroll horizontal
- [ ] Modal full-screen

---

## ✅ 11. Testes de Dark Mode

### 11.1 Alternar Tema
- [ ] Ativar dark mode
- [ ] Verificar cores de fundo
- [ ] Verificar contraste de texto
- [ ] Verificar badges coloridos
- [ ] Verificar borders e sombras

### 11.2 Consistência
- [ ] Todos os componentes respeitam o tema
- [ ] Transições suaves ao alternar
- [ ] Sem elementos com cor errada

---

## ✅ 12. Testes de Performance

### 12.1 Carregamento
- [ ] Tempo de carregamento inicial < 2s
- [ ] Loading states visíveis
- [ ] Skeleton screens (se implementado)

### 12.2 Busca
- [ ] Busca em tempo real sem lag
- [ ] Debounce funcionando
- [ ] Resultados instantâneos

### 12.3 Filtros
- [ ] Aplicar filtros sem delay
- [ ] Múltiplos filtros sem travamento

### 12.4 Real-time
- [ ] Abrir em 2 abas
- [ ] Criar produto em uma aba
- [ ] Verificar que aparece na outra aba automaticamente

---

## ✅ 13. Testes de Validação

### 13.1 Campos Obrigatórios
- [ ] Tentar criar produto sem nome
- [ ] Verificar mensagem de erro
- [ ] Tentar criar produto sem categoria
- [ ] Verificar mensagem de erro

### 13.2 Valores Numéricos
- [ ] Tentar inserir quantidade negativa
- [ ] Tentar inserir preço negativo
- [ ] Verificar que não permite

### 13.3 Estoque Insuficiente
- [ ] Tentar reservar mais que disponível
- [ ] Verificar mensagem de erro
- [ ] Tentar baixar mais que disponível
- [ ] Verificar mensagem de erro

---

## ✅ 14. Testes de Segurança

### 14.1 Isolamento Multi-Tenant
- [ ] Criar produto na Empresa A
- [ ] Logar na Empresa B
- [ ] Verificar que produto da Empresa A não aparece

### 14.2 Permissões
- [ ] Tentar acessar produto de outra empresa via URL
- [ ] Verificar erro de permissão
- [ ] Tentar modificar empresaId via DevTools
- [ ] Verificar que Firestore bloqueia

---

## ✅ 15. Testes de Erros

### 15.1 Sem Conexão
- [ ] Desconectar internet
- [ ] Tentar criar produto
- [ ] Verificar mensagem de erro apropriada

### 15.2 Timeout
- [ ] Simular timeout no Firebase
- [ ] Verificar tratamento de erro

### 15.3 Dados Inválidos
- [ ] Tentar salvar com dados corrompidos
- [ ] Verificar validação

---

## 🎯 Cenários de Teste Completos

### Cenário 1: Fluxo Completo de Orçamento
1. Criar produto com estoque de 10 unidades
2. Criar orçamento e adicionar 5 unidades do produto
3. Verificar que estoque reservado = 5
4. Verificar que disponível = 5
5. Aprovar orçamento
6. Verificar que estoque total = 5
7. Verificar que reservado = 0
8. Verificar histórico de movimentações
9. Verificar histórico do cliente

### Cenário 2: Expiração de Orçamento
1. Criar produto com estoque de 10
2. Criar orçamento e reservar 5
3. Aguardar 48h (ou simular)
4. Verificar que reserva foi liberada automaticamente
5. Verificar que disponível voltou para 10

### Cenário 3: Alerta de Estoque Baixo
1. Criar produto com estoque mínimo = 5
2. Adicionar 10 unidades
3. Fazer vendas até chegar em 5
4. Verificar badge amarelo "Estoque Baixo"
5. Verificar alerta no card de estatísticas

### Cenário 4: Produto Vencendo
1. Criar produto com lote
2. Definir validade para daqui 20 dias
3. Verificar badge laranja "Vencendo"
4. Verificar no filtro "Vencendo em 30 dias"

---

## 📊 Relatório de Testes

Após completar todos os testes, preencher:

```
✅ Testes Passados: ____ / ____
❌ Testes Falhados: ____
⚠️ Bugs Encontrados: ____

Bugs Críticos:
- [ ] Bug 1: Descrição
- [ ] Bug 2: Descrição

Melhorias Sugeridas:
- [ ] Melhoria 1
- [ ] Melhoria 2

Status Final: [ ] APROVADO  [ ] REPROVADO
```

---

## 🚀 Pronto para Produção!

Se todos os testes passarem, o módulo está pronto para uso em produção! 🎉
