# Implementation Plan

- [x] 1. Criar utilitários de formatação de endereço


  - Implementar função `formatFullAddress` que considera a flag hasNumber
  - Criar função `validateAddress` com validação condicional do número
  - Implementar função `migrateAddress` para compatibilidade com dados antigos
  - Adicionar função `formatCEP` para formatação de CEP
  - _Requirements: 4.1, 4.2, 4.3, 4.4_





- [x] 2. Atualizar ModalNovoCliente com flag hasNumber

  - [x] 2.1 Adicionar campo hasNumber ao estado do formulário


    - Incluir hasNumber no formData com valor padrão true
    - Configurar inicialização baseada em dados existentes do cliente
    - _Requirements: 1.5, 3.1_
  

  - [ ] 2.2 Implementar interface do checkbox para controle de numeração
    - Criar checkbox "Este endereço possui número" 

    - Implementar lógica de habilitação/desabilitação do campo número
    - Adicionar estilos visuais para estados habilitado/desabilitado

    - _Requirements: 1.1, 1.2, 1.3, 5.4_
  

  - [x] 2.3 Implementar lógica de limpeza automática do campo número





    - Limpar campo número quando hasNumber for desmarcado
    - Manter valor quando hasNumber for marcado novamente
    - _Requirements: 1.4_



  
  - [ ] 2.4 Atualizar labels dinâmicas baseadas na flag
    - Mostrar "Número *" quando hasNumber for true





    - Mostrar "Número (Opcional)" quando hasNumber for false
    - _Requirements: 5.1, 5.2, 5.3_


- [ ] 3. Atualizar ClientFormHorizontal com funcionalidade consistente
  - [ ] 3.1 Adicionar flag hasNumber ao formData
    - Incluir hasNumber no estado do formulário
    - Configurar valor padrão e inicialização
    - _Requirements: 3.1, 3.2_
  
  - [ ] 3.2 Implementar interface de checkbox idêntica ao ModalNovoCliente
    - Criar checkbox com mesma funcionalidade e estilos
    - Implementar lógica de controle do campo número
    - Aplicar labels dinâmicas consistentes
    - _Requirements: 1.1, 1.2, 1.3, 3.3, 3.4_

- [ ] 4. Atualizar ClientViewModal para formatação inteligente
  - [ ] 4.1 Integrar utilitário formatFullAddress
    - Importar função de formatação de addressUtils
    - Substituir lógica atual de formatação de endereço
    - _Requirements: 2.1, 2.2, 2.4_
  
  - [ ] 4.2 Garantir compatibilidade com dados existentes
    - Implementar fallback para clientes sem flag hasNumber
    - Testar formatação com diferentes cenários de dados
    - _Requirements: 2.3_

- [ ]* 5. Criar testes unitários para utilitários
  - Escrever testes para formatFullAddress com diferentes cenários
  - Criar testes para validateAddress com validação condicional
  - Implementar testes para migrateAddress com dados antigos
  - Testar formatCEP com diferentes formatos de entrada
  - _Requirements: 4.1, 4.2, 4.3_

- [ ]* 6. Criar testes de integração para componentes
  - Testar comportamento do checkbox nos modais
  - Validar persistência da flag hasNumber
  - Testar formatação de endereços na visualização
  - Verificar compatibilidade com dados existentes
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2_