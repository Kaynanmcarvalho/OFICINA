# Requirements Document

## Introduction

Este documento especifica os requisitos para implementar uma flag que controla quando um cliente não possui número no endereço, evitando a exibição de "nº 0" ou campos vazios nos endereços formatados. A funcionalidade deve estar disponível em todos os modais de cadastramento e edição de clientes.

## Glossary

- **Sistema_Cliente**: Sistema de gerenciamento de dados de clientes
- **Modal_Cadastro**: Interface modal para cadastro de novos clientes
- **Modal_Edicao**: Interface modal para edição de clientes existentes
- **Flag_HasNumber**: Campo booleano que indica se o endereço possui numeração
- **Endereco_Formatado**: Representação textual completa do endereço do cliente
- **Campo_Numero**: Campo de entrada para o número do endereço

## Requirements

### Requirement 1

**User Story:** Como usuário do sistema, eu quero poder marcar quando um endereço não possui número, para que endereços rurais, estradas e locais sem numeração sejam exibidos corretamente sem mostrar "nº 0".

#### Acceptance Criteria

1. WHEN o usuário acessa um modal de cadastro de cliente, THE Sistema_Cliente SHALL exibir um checkbox para indicar se o endereço possui número
2. WHILE o checkbox estiver desmarcado, THE Sistema_Cliente SHALL desabilitar o Campo_Numero e marcar como opcional
3. WHEN o checkbox for marcado, THE Sistema_Cliente SHALL habilitar o Campo_Numero e torná-lo obrigatório
4. IF o usuário desmarcar o checkbox, THEN THE Sistema_Cliente SHALL limpar o conteúdo do Campo_Numero
5. THE Sistema_Cliente SHALL salvar o estado da Flag_HasNumber junto com os dados do cliente

### Requirement 2

**User Story:** Como usuário do sistema, eu quero que endereços sem número sejam formatados corretamente na visualização, para que não apareçam informações desnecessárias como "nº 0" ou "nº ".

#### Acceptance Criteria

1. WHEN um cliente possui Flag_HasNumber como false, THE Sistema_Cliente SHALL omitir a parte do número no Endereco_Formatado
2. WHEN um cliente possui Flag_HasNumber como true E possui número, THE Sistema_Cliente SHALL incluir "nº [número]" no Endereco_Formatado
3. THE Sistema_Cliente SHALL manter compatibilidade com dados existentes que não possuem Flag_HasNumber
4. WHILE exibindo endereços, THE Sistema_Cliente SHALL aplicar formatação consistente em todas as interfaces

### Requirement 3

**User Story:** Como usuário do sistema, eu quero poder editar a flag de número em clientes existentes, para que possa corrigir informações de endereço quando necessário.

#### Acceptance Criteria

1. WHEN o usuário abre um Modal_Edicao de cliente existente, THE Sistema_Cliente SHALL exibir o estado atual da Flag_HasNumber
2. THE Sistema_Cliente SHALL permitir alteração da Flag_HasNumber durante a edição
3. WHEN a Flag_HasNumber for alterada de true para false, THE Sistema_Cliente SHALL limpar o Campo_Numero
4. WHEN a Flag_HasNumber for alterada de false para true, THE Sistema_Cliente SHALL habilitar o Campo_Numero para preenchimento

### Requirement 4

**User Story:** Como desenvolvedor do sistema, eu quero utilitários reutilizáveis para formatação de endereços, para que a lógica seja consistente em todo o sistema.

#### Acceptance Criteria

1. THE Sistema_Cliente SHALL fornecer função utilitária para formatação de endereços completos
2. THE Sistema_Cliente SHALL fornecer função de validação que considera a Flag_HasNumber
3. THE Sistema_Cliente SHALL fornecer função de migração para dados antigos sem Flag_HasNumber
4. THE Sistema_Cliente SHALL garantir que todas as funções utilitárias sejam reutilizáveis entre componentes

### Requirement 5

**User Story:** Como usuário do sistema, eu quero que a interface seja intuitiva para controlar a numeração do endereço, para que seja fácil de entender e usar.

#### Acceptance Criteria

1. THE Sistema_Cliente SHALL exibir label dinâmica no Campo_Numero baseada na Flag_HasNumber
2. WHEN Flag_HasNumber for true, THE Sistema_Cliente SHALL mostrar "Número *" indicando obrigatoriedade
3. WHEN Flag_HasNumber for false, THE Sistema_Cliente SHALL mostrar "Número (Opcional)" 
4. THE Sistema_Cliente SHALL aplicar estilos visuais diferentes para campos habilitados e desabilitados
5. THE Sistema_Cliente SHALL exibir texto explicativo no checkbox como "Este endereço possui número"