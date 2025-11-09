# Requirements Document - Client Wizard Modal

## Introduction

Este documento define os requisitos para reimplementar o modal de criação e edição de clientes como um Wizard multi-step elegante estilo Apple, com transições fluidas e campos adicionais importantes para gestão completa de clientes em uma oficina mecânica.

## Glossary

- **System**: O modal wizard de cliente
- **User**: Usuário da oficina (gerente, atendente)
- **Client**: Cliente da oficina
- **Step**: Etapa do wizard
- **Wizard**: Interface de múltiplas etapas sequenciais
- **Validation**: Validação de dados em tempo real

## Requirements

### Requirement 1: Wizard Multi-Step Navigation

**User Story:** Como usuário, quero navegar entre diferentes etapas do cadastro de cliente de forma intuitiva, para organizar melhor as informações e não me sentir sobrecarregado.

#### Acceptance Criteria

1. WHEN o usuário abre o modal, THE System SHALL exibir a primeira etapa do wizard com indicadores visuais de progresso
2. WHEN o usuário clica em "Próximo", THE System SHALL validar os campos obrigatórios da etapa atual antes de avançar
3. WHEN o usuário clica em "Voltar", THE System SHALL retornar à etapa anterior mantendo os dados preenchidos
4. WHEN o usuário está na última etapa, THE System SHALL exibir o botão "Salvar" ao invés de "Próximo"
5. THE System SHALL exibir transições suaves e fluidas entre as etapas com animações Apple-like

### Requirement 2: Step 1 - Informações Básicas

**User Story:** Como usuário, quero cadastrar as informações básicas do cliente (nome, tipo de pessoa, documentos), para identificá-lo corretamente no sistema.

#### Acceptance Criteria

1. THE System SHALL exibir campos para nome completo (obrigatório), tipo de pessoa (PF/PJ), CPF ou CNPJ
2. WHEN o usuário seleciona "Pessoa Física", THE System SHALL exibir apenas o campo CPF
3. WHEN o usuário seleciona "Pessoa Jurídica", THE System SHALL exibir campos para CNPJ e Razão Social
4. THE System SHALL validar o formato do CPF em tempo real (11 dígitos, formato XXX.XXX.XXX-XX)
5. THE System SHALL validar o formato do CNPJ em tempo real (14 dígitos, formato XX.XXX.XXX/XXXX-XX)
6. THE System SHALL aplicar máscaras de formatação automaticamente durante a digitação

### Requirement 3: Step 2 - Contato e Localização

**User Story:** Como usuário, quero cadastrar informações de contato e endereço completo do cliente, para poder contatá-lo e localizá-lo quando necessário.

#### Acceptance Criteria

1. THE System SHALL exibir campos para telefone principal (obrigatório), telefone secundário, e-mail, e WhatsApp
2. THE System SHALL exibir campos de endereço: CEP, rua, número, complemento, bairro, cidade, estado
3. WHEN o usuário digita um CEP válido, THE System SHALL buscar automaticamente o endereço via API ViaCEP
4. THE System SHALL validar o formato do e-mail em tempo real
5. THE System SHALL validar o formato do telefone (formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX)
6. THE System SHALL permitir que o campo WhatsApp seja preenchido automaticamente com o telefone principal

### Requirement 4: Step 3 - Informações Adicionais

**User Story:** Como usuário, quero cadastrar informações complementares do cliente (data de nascimento, gênero, observações), para ter um perfil mais completo.

#### Acceptance Criteria

1. THE System SHALL exibir campos para data de nascimento, gênero, profissão, e observações
2. THE System SHALL exibir campo para indicação (como conheceu a oficina)
3. THE System SHALL exibir campo para preferências de contato (WhatsApp, E-mail, Telefone)
4. THE System SHALL exibir campo de observações com limite de 500 caracteres
5. THE System SHALL exibir contador de caracteres restantes no campo de observações

### Requirement 5: Step 4 - Veículos (Opcional)

**User Story:** Como usuário, quero cadastrar os veículos do cliente durante o cadastro inicial, para agilizar o processo e ter todas as informações em um só lugar.

#### Acceptance Criteria

1. THE System SHALL exibir opção para adicionar veículos durante o cadastro
2. WHEN o usuário clica em "Adicionar Veículo", THE System SHALL exibir formulário com campos: marca, modelo, ano, placa, cor, chassi
3. THE System SHALL permitir adicionar múltiplos veículos
4. THE System SHALL permitir remover veículos adicionados
5. THE System SHALL validar o formato da placa (formato Mercosul ABC1D23 ou antigo ABC-1234)
6. THE System SHALL permitir pular esta etapa se o usuário não quiser cadastrar veículos

### Requirement 6: Step 5 - Revisão e Confirmação

**User Story:** Como usuário, quero revisar todas as informações cadastradas antes de salvar, para garantir que tudo está correto.

#### Acceptance Criteria

1. THE System SHALL exibir um resumo organizado de todas as informações preenchidas
2. THE System SHALL permitir editar qualquer informação clicando em "Editar" ao lado de cada seção
3. WHEN o usuário clica em "Editar", THE System SHALL navegar para a etapa correspondente
4. THE System SHALL exibir indicador visual de campos obrigatórios não preenchidos
5. THE System SHALL exibir botão "Salvar Cliente" apenas quando todos os campos obrigatórios estiverem preenchidos

### Requirement 7: Design Apple-Like e Transições

**User Story:** Como usuário, quero uma interface elegante e fluida, para ter uma experiência agradável ao cadastrar clientes.

#### Acceptance Criteria

1. THE System SHALL aplicar design minimalista com espaçamento generoso e tipografia clara
2. THE System SHALL usar transições suaves (300-500ms) entre etapas com efeito slide
3. THE System SHALL exibir indicadores de progresso com animações fluidas
4. THE System SHALL usar micro-animações em botões e campos de formulário
5. THE System SHALL aplicar feedback visual imediato em validações (verde para válido, vermelho para inválido)
6. THE System SHALL usar contornos escuros e sombreamento profundo no tema claro
7. THE System SHALL manter consistência visual com o restante da aplicação

### Requirement 8: Validação e Feedback

**User Story:** Como usuário, quero receber feedback claro sobre erros de validação, para corrigir rapidamente os problemas.

#### Acceptance Criteria

1. THE System SHALL validar campos em tempo real durante a digitação
2. THE System SHALL exibir mensagens de erro claras abaixo dos campos inválidos
3. THE System SHALL impedir avanço para próxima etapa se houver campos obrigatórios vazios ou inválidos
4. THE System SHALL exibir toast de sucesso após salvar o cliente
5. THE System SHALL exibir toast de erro se houver falha ao salvar

### Requirement 9: Modo Edição

**User Story:** Como usuário, quero editar clientes existentes usando o mesmo wizard, para manter consistência na interface.

#### Acceptance Criteria

1. WHEN o modal é aberto em modo edição, THE System SHALL preencher todos os campos com os dados existentes
2. THE System SHALL permitir navegação livre entre todas as etapas em modo edição
3. THE System SHALL exibir "Atualizar Cliente" ao invés de "Criar Cliente" no botão final
4. THE System SHALL manter os dados originais se o usuário cancelar a edição
5. THE System SHALL exibir indicador visual de que está em modo edição

### Requirement 10: Responsividade e Acessibilidade

**User Story:** Como usuário, quero usar o wizard em diferentes dispositivos, para ter flexibilidade no cadastro.

#### Acceptance Criteria

1. THE System SHALL adaptar o layout para telas mobile, tablet e desktop
2. THE System SHALL permitir navegação por teclado (Tab, Enter, Esc)
3. THE System SHALL fechar o modal ao pressionar ESC
4. THE System SHALL focar automaticamente no primeiro campo de cada etapa
5. THE System SHALL manter scroll position ao navegar entre etapas
