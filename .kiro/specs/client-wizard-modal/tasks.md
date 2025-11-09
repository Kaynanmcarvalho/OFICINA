# Implementation Plan - Client Wizard Modal

- [x] 1. Criar estrutura base e hooks customizados


  - Criar hook useWizardState para gerenciar navegação e estado do wizard
  - Criar hook useFormValidation para validações em tempo real
  - Criar hook useCepLookup para integração com API ViaCEP
  - Criar funções utilitárias de validação (CPF, CNPJ, email, telefone, placa)
  - _Requirements: 1.1, 1.2, 8.1, 8.2_



- [ ] 2. Implementar componentes compartilhados
  - Criar componente FormField reutilizável com label, input e validação
  - Criar componente FormSection para agrupar campos relacionados
  - Criar componente ValidationMessage para exibir erros


  - Criar componente SegmentedControl para toggle PF/PJ estilo iOS
  - _Requirements: 7.1, 8.3_

- [ ] 3. Implementar WizardProgress (indicador de progresso)
  - Criar componente com linha de progresso horizontal
  - Implementar círculos numerados para cada step


  - Adicionar animações de transição entre steps
  - Implementar indicadores visuais de validação (check/x)
  - Adicionar títulos dos steps abaixo dos círculos
  - _Requirements: 1.1, 7.2, 7.3_

- [x] 4. Implementar Step1BasicInfo (Informações Básicas)

  - Criar componente com toggle PF/PJ
  - Implementar campo nome completo com validação
  - Implementar campo CPF com máscara e validação (modo PF)
  - Implementar campos CNPJ e Razão Social com validação (modo PJ)
  - Adicionar transições suaves ao alternar entre PF/PJ
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 5. Implementar Step2Contact (Contato e Localização)
  - Criar campos de telefone com máscaras

  - Implementar campo e-mail com validação
  - Implementar campo WhatsApp com botão "Usar telefone principal"
  - Criar campo CEP com busca automática via ViaCEP
  - Implementar campos de endereço com preenchimento automático
  - Adicionar loading state durante busca de CEP
  - Adicionar tratamento de erro para CEP não encontrado
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_


- [ ] 6. Implementar Step3Additional (Informações Adicionais)
  - Criar campo data de nascimento com date picker
  - Implementar select de gênero
  - Criar campo profissão
  - Implementar select "Como conheceu"
  - Criar multi-select para preferências de contato
  - Implementar textarea de observações com contador de caracteres
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_


- [ ] 7. Implementar Step4Vehicles (Veículos - Opcional)
  - Criar lista de veículos adicionados
  - Implementar formulário inline para adicionar veículo
  - Adicionar campos: marca, modelo, ano, placa, cor, chassi
  - Implementar validação de placa (Mercosul e antigo)
  - Adicionar botão remover para cada veículo
  - Implementar botão "Pular esta etapa"
  - Adicionar animações ao adicionar/remover veículos
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_


- [ ] 8. Implementar Step5Review (Revisão e Confirmação)
  - Criar layout de cards organizados por seção
  - Implementar card de Informações Básicas com dados do Step 1
  - Implementar card de Contato e Localização com dados do Step 2
  - Implementar card de Informações Adicionais com dados do Step 3
  - Implementar card de Veículos (se houver) com dados do Step 4
  - Adicionar botão "Editar" em cada card que navega para o step correspondente
  - Destacar campos obrigatórios faltantes

  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 9. Implementar WizardNavigation (Navegação)
  - Criar footer fixo com botões de navegação
  - Implementar botão "Voltar" com lógica de navegação
  - Implementar botão "Próximo" com validação antes de avançar
  - Implementar botão "Salvar Cliente" no último step
  - Implementar botão "Cancelar" com confirmação
  - Adicionar estados de loading nos botões
  - Adicionar animações em hover e click

  - _Requirements: 1.2, 1.3, 1.4, 7.4_

- [ ] 10. Implementar ClientWizardModal (Container Principal)
  - Criar estrutura do modal com backdrop e animações
  - Integrar todos os steps e componentes
  - Implementar lógica de navegação entre steps
  - Implementar validação global antes de salvar
  - Adicionar suporte para modo edição

  - Implementar keyboard shortcuts (Tab, Enter, Esc)
  - Adicionar focus management entre steps
  - Integrar com clientStore para salvar dados
  - _Requirements: 1.1, 1.5, 7.1, 7.2, 9.1, 9.2, 9.3, 9.4, 9.5, 10.3, 10.4_

- [ ] 11. Implementar validações e máscaras
  - Criar função de validação de CPF com dígitos verificadores

  - Criar função de validação de CNPJ com dígitos verificadores
  - Criar função de validação de e-mail
  - Criar função de validação de telefone
  - Criar função de validação de placa (Mercosul e antigo)
  - Implementar máscaras de formatação para CPF, CNPJ, telefone, CEP, placa
  - _Requirements: 2.4, 2.5, 2.6, 3.4, 3.5, 5.5, 8.1_

- [x] 12. Integrar com API ViaCEP

  - Implementar função de busca de CEP
  - Adicionar debounce na busca (500ms)
  - Implementar tratamento de erro (CEP não encontrado)
  - Adicionar loading state durante busca
  - Preencher automaticamente campos de endereço
  - _Requirements: 3.3_


- [ ] 13. Adicionar animações e transições Apple-like
  - Implementar transições slide entre steps (300-500ms)
  - Adicionar micro-animações em botões (scale on hover/click)
  - Implementar animações de entrada/saída do modal
  - Adicionar animações de validação (shake on error, check on success)
  - Implementar animação de progresso no WizardProgress
  - Adicionar transições suaves em campos de formulário

  - _Requirements: 1.5, 7.2, 7.3, 7.4_

- [ ] 14. Implementar feedback visual e toasts
  - Adicionar feedback visual em validações (verde/vermelho)
  - Implementar toast de sucesso ao salvar cliente
  - Implementar toast de erro em caso de falha
  - Adicionar indicadores de loading em operações assíncronas
  - Implementar mensagens de erro claras abaixo dos campos

  - _Requirements: 7.5, 8.2, 8.3, 8.4, 8.5_

- [ ] 15. Implementar responsividade
  - Adaptar layout para mobile (single column)
  - Adaptar layout para tablet (two columns)
  - Manter layout desktop (two/three columns)
  - Ajustar tamanho do modal para diferentes telas

  - Garantir scroll adequado em telas pequenas
  - _Requirements: 10.1, 10.5_

- [ ] 16. Implementar acessibilidade
  - Adicionar navegação por teclado (Tab, Enter, Esc)
  - Implementar focus trap dentro do modal
  - Adicionar ARIA labels em todos os campos
  - Implementar auto-focus no primeiro campo de cada step
  - Adicionar anúncios de screen reader para validações
  - Garantir contraste adequado de cores
  - _Requirements: 10.2, 10.3, 10.4_

- [ ] 17. Integrar com ClientsPage
  - Substituir ClientModal antigo por ClientWizardModal
  - Atualizar imports e props em ClientsPage
  - Testar criação de novo cliente
  - Testar edição de cliente existente
  - Verificar integração com clientStore
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 18. Aplicar design tokens e estilo Apple-like
  - Aplicar cores do design system (light/dark mode)
  - Implementar espaçamento generoso entre elementos
  - Aplicar tipografia clara e hierárquica
  - Adicionar contornos escuros e sombreamento profundo
  - Implementar backdrop blur no modal
  - Garantir consistência visual com resto da aplicação
  - _Requirements: 7.1, 7.6, 7.7_

- [ ]* 19. Testes e validação final
  - Testar fluxo completo de criação de cliente
  - Testar fluxo completo de edição de cliente
  - Testar validações em todos os campos
  - Testar busca de CEP (sucesso e erro)
  - Testar adição/remoção de veículos
  - Testar navegação entre steps
  - Testar responsividade em diferentes telas
  - Testar acessibilidade (keyboard, screen reader)
  - Verificar performance e otimizações
  - _Requirements: All_
