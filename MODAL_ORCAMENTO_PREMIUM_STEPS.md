# Modal de Orçamento Premium - Steps Detalhados

## Estrutura Completa dos 4 Steps

### Step 1: Cliente (Dados do Cliente)
```jsx
- Campo de busca inteligente de clientes
- Dropdown com resultados filtrados
- Campos: Nome, Telefone, Email
- Validação: Nome e Telefone obrigatórios
- Badge "Do Check-in" se vier de um check-in
```

### Step 2: Veículo (Informações do Veículo)
```jsx
- Campo de placa com busca automática
- Botão "Buscar Dados" com loading
- Campos: Placa, Marca, Modelo, Ano, Cor
- Preview do veículo com ícone
- Validação: Placa e Modelo obrigatórios
```

### Step 3: Itens (Produtos e Serviços)
```jsx
- Toggle entre Produto/Serviço
- Busca de produtos do inventário
- Campos: Nome, Descrição, Quantidade, Preço
- Lista de itens adicionados
- Botão remover item
- Edição inline de quantidade/preço
- Validação: Pelo menos 1 item
```

### Step 4: Resumo (Valores e Observações)
```jsx
- Tabela de itens com totais
- Campo de desconto
- Cálculo automático do total
- Data de validade
- Observações para o cliente
- Observações internas
- Preview final do orçamento
```

## Design Apple-Like

### Paleta de Cores
- 🟣 Roxo/Rosa: Tema principal (orçamento = proposta comercial)
- 🔵 Azul: Cliente
- 🔴 Vermelho: Veículo
- 🟢 Verde: Produtos
- 🟡 Amarelo: Serviços

### Elementos Visuais
- Gradientes suaves
- Backdrop blur
- Sombras coloridas
- Animações fluidas
- Ícones em badges circulares
- Cards com glassmorphism

## Funcionalidades Inteligentes

### Auto-preenchimento
- Se vier de check-in: dados do cliente e veículo já preenchidos
- Se editar: todos os dados carregados
- Busca de placa: preenche marca/modelo/ano automaticamente

### Cálculos Automáticos
- Subtotal = Soma(item.price * item.quantity)
- Total = Subtotal - Desconto
- Atualização em tempo real

### Validações
- Por step (não avança sem preencher)
- Mensagens contextuais
- Feedback visual imediato

## Integrações

### Com Inventário
- Busca produtos cadastrados
- Mostra estoque disponível
- Reserva produtos ao criar orçamento

### Com Check-in
- Carrega dados do veículo
- Vincula orçamento ao check-in
- Facilita aprovação e execução

### Com Clientes
- Busca clientes cadastrados
- Histórico de orçamentos
- Dados de contato atualizados
