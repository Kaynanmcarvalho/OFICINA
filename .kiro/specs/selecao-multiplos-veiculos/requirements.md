# Requirements Document - Seleção de Múltiplos Veículos

## Introduction

Sistema para permitir que clientes com múltiplos veículos cadastrados possam selecionar qual veículo desejam usar no check-in ou check-out.

## Glossary

- **Cliente**: Usuário cadastrado no sistema
- **Veículo**: Moto, carro ou caminhão cadastrado para um cliente
- **Check-in**: Registro de entrada de um veículo
- **Check-out**: Registro de saída de um veículo
- **Modal de Seleção**: Interface para escolher entre múltiplos veículos

## Requirements

### Requirement 1

**User Story:** Como atendente, quero que ao selecionar um cliente com múltiplos veículos cadastrados, eu possa escolher qual veículo fazer o check-in, para que o sistema preencha automaticamente os dados corretos.

#### Acceptance Criteria

1. WHEN o atendente seleciona um cliente no campo de busca, THE Sistema SHALL verificar quantos veículos o cliente possui cadastrados
2. IF o cliente possui apenas 1 veículo, THEN THE Sistema SHALL preencher automaticamente os campos de placa e modelo com os dados deste veículo
3. IF o cliente possui mais de 1 veículo, THEN THE Sistema SHALL exibir um modal de seleção com todos os veículos cadastrados
4. THE Modal de Seleção SHALL exibir cada veículo com placa, marca, modelo, ano e cor de forma visual e interativa
5. WHEN o atendente seleciona um veículo no modal, THE Sistema SHALL preencher automaticamente os campos de placa e modelo com os dados do veículo selecionado

### Requirement 2

**User Story:** Como atendente, quero visualizar os veículos do cliente de forma clara e bonita, para que eu possa identificar rapidamente qual veículo o cliente trouxe.

#### Acceptance Criteria

1. THE Modal de Seleção SHALL exibir cards visuais para cada veículo
2. EACH card SHALL conter ícone do tipo de veículo (moto/carro/caminhão)
3. EACH card SHALL exibir placa em destaque
4. EACH card SHALL exibir marca, modelo, ano e cor
5. WHEN o atendente passa o mouse sobre um card, THE Sistema SHALL destacar visualmente o card com hover effect

### Requirement 3

**User Story:** Como atendente, quero que ao fazer check-out de um cliente com múltiplos check-ins ativos, eu possa escolher qual veículo está saindo, para evitar fazer check-out do veículo errado.

#### Acceptance Criteria

1. WHEN o atendente clica em fazer check-out de um cliente, THE Sistema SHALL verificar quantos check-ins ativos o cliente possui
2. IF o cliente possui apenas 1 check-in ativo, THEN THE Sistema SHALL abrir o modal de check-out diretamente
3. IF o cliente possui mais de 1 check-in ativo, THEN THE Sistema SHALL exibir um modal de seleção com todos os veículos com check-in ativo
4. THE Modal de Seleção SHALL exibir cada veículo com placa, modelo, data/hora do check-in e tempo decorrido
5. WHEN o atendente seleciona um veículo, THE Sistema SHALL abrir o modal de check-out para aquele veículo específico

### Requirement 4

**User Story:** Como atendente, quero que o sistema salve os veículos cadastrados no cliente, para que nas próximas vezes eu não precise digitar novamente.

#### Acceptance Criteria

1. WHEN um novo cliente é cadastrado com veículos, THE Sistema SHALL salvar todos os veículos no perfil do cliente no Firebase
2. THE Sistema SHALL armazenar placa, marca, modelo, ano, cor e tipo para cada veículo
3. WHEN um cliente faz check-in com um veículo novo, THE Sistema SHALL adicionar este veículo à lista de veículos do cliente
4. THE Sistema SHALL manter histórico de todos os veículos já utilizados pelo cliente
5. THE Sistema SHALL exibir os veículos mais recentes primeiro na lista de seleção

### Requirement 5

**User Story:** Como atendente, quero poder adicionar um novo veículo durante o check-in, para que clientes que trouxeram um veículo diferente possam ser atendidos.

#### Acceptance Criteria

1. THE Modal de Seleção SHALL conter um botão "Adicionar Novo Veículo"
2. WHEN o atendente clica em "Adicionar Novo Veículo", THE Sistema SHALL fechar o modal de seleção e limpar os campos de veículo
3. THE Sistema SHALL permitir que o atendente busque por placa ou preencha manualmente
4. WHEN o check-in é confirmado com um novo veículo, THE Sistema SHALL adicionar este veículo à lista de veículos do cliente
5. THE novo veículo SHALL aparecer nas próximas seleções para este cliente
