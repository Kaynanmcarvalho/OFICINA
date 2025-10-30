# Implementation Plan - Sistema de Ícones Premium

- [x] 1. Criar estrutura de utilitários de ícones


  - Criar diretório `src/utils/icons/`
  - Criar arquivo `src/utils/icons/index.js` para exportações centralizadas
  - _Requirements: 4.1, 4.4_



- [ ] 1.1 Implementar commonIcons utility
  - Criar `src/utils/icons/commonIcons.jsx` com exportações do Lucide React
  - Exportar ícones comuns: Car, Bike, Truck, Clock, Calendar, User, Phone, Mail, Search, Plus, X, Check, Settings, Menu
  - Adicionar comentários documentando cada grupo de ícones


  - _Requirements: 1.1, 4.3_

- [ ] 1.2 Implementar VehicleTypeIcon component
  - Criar `src/utils/icons/vehicleIcons.jsx`
  - Implementar componente VehicleTypeIcon com suporte a tipos: car, motorcycle, truck
  - Usar ícones do Lucide React (Car, Bike, Truck)


  - Adicionar props: type, className, size
  - Implementar tamanho padrão de 24px
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 1.3 Criar mapeamento de marcas de veículos


  - No arquivo `src/utils/icons/brandIcons.jsx`, criar objeto brandIconMap
  - Mapear no mínimo 30 marcas usando Simple Icons do React Icons
  - Incluir marcas de carros: Honda, Toyota, Ford, Chevrolet, VW, BMW, Mercedes, Audi, Hyundai, Kia, Nissan, Fiat, Tesla, Porsche, Ferrari
  - Incluir marcas de motos: Yamaha, Suzuki, Kawasaki, Ducati, Harley-Davidson, Triumph, KTM
  - Adicionar aliases para variações de nomes (ex: MERCEDES-BENZ, HARLEY-DAVIDSON)


  - _Requirements: 2.3, 4.3_

- [ ] 2. Implementar BrandIcon component refatorado
  - Refatorar `src/utils/icons/brandIcons.jsx` para usar Simple Icons

  - Implementar função extractBrand que normaliza e extrai marca do vehicleModel

  - Implementar lógica de busca no brandIconMap
  - _Requirements: 2.1, 2.2, 4.2_


- [ ] 2.1 Adicionar sistema de fallback inteligente
  - Implementar fallback para VehicleTypeIcon quando marca não encontrada

  - Integrar com detectVehicleType para determinar tipo correto


  - Adicionar prop showFallback (padrão: true)
  - _Requirements: 2.4_

- [ ] 2.2 Implementar logging e debug
  - Adicionar console.warn quando ícone de marca não for encontrado
  - Incluir informações: vehicleModel, marca extraída, tipo detectado


  - Adicionar modo DEBUG_ICONS para desenvolvimento
  - _Requirements: 2.5, 4.3_



- [ ] 2.3 Adicionar tratamento de erros
  - Implementar try-catch no BrandIcon component
  - Garantir que erros não quebrem a renderização
  - Retornar fallback em caso de erro
  - _Requirements: 2.4_



- [ ] 3. Atualizar VehicleCard component
  - Atualizar imports para usar novos utilitários de ícones
  - Substituir ícones antigos por BrandIcon component
  - Manter animações de hover existentes (scale-110, duration-300)


  - Ajustar tamanhos: ícone principal 48px (w-12 h-12)
  - _Requirements: 1.1, 2.2, 5.1, 5.2, 5.3, 5.4_



- [ ] 3.1 Garantir compatibilidade com tema claro/escuro
  - Verificar que ícones usam currentColor
  - Testar renderização em ambos os temas
  - Ajustar cores se necessário


  - _Requirements: 1.5_

- [ ] 4. Atualizar ModalSelecaoVeiculo component
  - Atualizar imports para usar commonIcons


  - Substituir ícones X e Plus por versões do Lucide
  - Garantir que VehicleCard dentro do modal use novos ícones
  - Verificar espaçamentos e alinhamentos
  - _Requirements: 1.1, 1.4_

- [ ] 5. Otimizar performance e bundle size
  - Verificar que todas as importações são específicas (não globais)
  - Implementar memoization no BrandIcon se necessário
  - Adicionar lazy loading para ícones raramente usados
  - _Requirements: 6.1, 6.2, 6.4_

- [ ] 5.1 Adicionar análise de bundle
  - Configurar vite-bundle-visualizer se não estiver configurado
  - Verificar tamanho do bundle de ícones
  - Garantir que está abaixo de 50KB
  - _Requirements: 6.4_

- [ ] 6. Atualizar arquivo de exportações centralizadas
  - Criar/atualizar `src/utils/icons/index.js`
  - Exportar VehicleTypeIcon, BrandIcon, e commonIcons
  - Adicionar JSDoc comments para documentação
  - _Requirements: 4.1, 4.4_

- [ ] 7. Remover código legado
  - Remover implementação antiga de @cardog-icons/react se não for mais usada
  - Remover SVGs customizados antigos (CarIcon, MotorcycleIcon, TruckIcon)
  - Limpar imports não utilizados
  - _Requirements: 4.4_

- [ ] 8. Verificar outros componentes que usam ícones
  - Buscar por imports de lucide-react em outros arquivos
  - Atualizar para usar commonIcons utility
  - Garantir consistência em toda aplicação
  - _Requirements: 1.1, 4.1_

- [ ]* 9. Testes e validação
  - Testar renderização de ícones de marcas conhecidas
  - Testar fallback para marcas desconhecidas
  - Testar detecção de tipo de veículo (carro, moto, caminhão)
  - Verificar animações de hover
  - Testar em tema claro e escuro
  - Verificar performance de carregamento
  - _Requirements: 1.1, 2.2, 2.4, 3.1, 3.2, 3.3, 5.1, 6.3_

- [ ]* 9.1 Criar documentação de uso
  - Documentar como usar BrandIcon component
  - Documentar como adicionar novas marcas
  - Criar exemplos de uso
  - Adicionar troubleshooting guide
  - _Requirements: 4.3, 4.4_
