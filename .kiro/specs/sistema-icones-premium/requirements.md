# Requirements Document

## Introduction

Este documento define os requisitos para a melhoria do sistema de ícones da aplicação de oficina. O sistema atual apresenta problemas de qualidade visual e os ícones de marcas de veículos não estão sendo exibidos corretamente. A solução implementará uma biblioteca de ícones moderna e profissional, com suporte adequado para ícones de marcas de veículos.

## Glossary

- **Sistema de Ícones**: Conjunto de componentes e utilitários responsáveis por renderizar ícones na interface
- **Lucide React**: Biblioteca de ícones moderna e minimalista baseada em Feather Icons
- **React Icons**: Biblioteca que agrega múltiplas coleções de ícones populares (Font Awesome, Material Design, etc.)
- **Brand Icon**: Ícone que representa a marca de um veículo (Honda, Toyota, Yamaha, etc.)
- **Vehicle Type Icon**: Ícone genérico que representa o tipo de veículo (carro, moto, caminhão)
- **Fallback Icon**: Ícone padrão exibido quando o ícone específico não está disponível
- **VehicleCard**: Componente que exibe informações de um veículo em formato de cartão
- **BrandIcon Component**: Componente responsável por renderizar ícones de marcas de veículos

## Requirements

### Requirement 1

**User Story:** Como usuário do sistema, eu quero ver ícones de alta qualidade e visualmente atraentes em toda a interface, para que a aplicação tenha uma aparência profissional e moderna.

#### Acceptance Criteria

1. WHEN THE Sistema de Ícones renderiza qualquer ícone, THE Sistema de Ícones SHALL utilizar a biblioteca Lucide React como fonte primária de ícones
2. WHEN THE Sistema de Ícones não encontra um ícone específico no Lucide React, THE Sistema de Ícones SHALL utilizar React Icons como fonte secundária
3. THE Sistema de Ícones SHALL garantir que todos os ícones tenham tamanho consistente de 24x24 pixels por padrão
4. THE Sistema de Ícones SHALL suportar customização de tamanho através de classes CSS
5. THE Sistema de Ícones SHALL manter a compatibilidade com o tema claro e escuro da aplicação

### Requirement 2

**User Story:** Como usuário visualizando veículos, eu quero ver os ícones corretos das marcas dos veículos (Honda, Toyota, Yamaha, etc.), para que eu possa identificar rapidamente a marca de cada veículo.

#### Acceptance Criteria

1. WHEN THE BrandIcon Component recebe um modelo de veículo, THE BrandIcon Component SHALL extrair corretamente o nome da marca do texto
2. WHEN THE BrandIcon Component identifica uma marca conhecida, THE BrandIcon Component SHALL renderizar o ícone correspondente da marca
3. THE BrandIcon Component SHALL suportar no mínimo 30 marcas diferentes de veículos (carros e motos)
4. WHEN THE BrandIcon Component não encontra um ícone específico da marca, THE BrandIcon Component SHALL exibir um Fallback Icon baseado no tipo de veículo
5. THE BrandIcon Component SHALL registrar no console quando um ícone de marca não for encontrado para facilitar debugging

### Requirement 3

**User Story:** Como usuário visualizando diferentes tipos de veículos, eu quero ver ícones distintos e reconhecíveis para carros, motos e caminhões, para que eu possa identificar rapidamente o tipo de cada veículo.

#### Acceptance Criteria

1. WHEN THE Sistema de Ícones renderiza um Vehicle Type Icon para carro, THE Sistema de Ícones SHALL utilizar o ícone "Car" do Lucide React
2. WHEN THE Sistema de Ícones renderiza um Vehicle Type Icon para moto, THE Sistema de Ícones SHALL utilizar o ícone "Bike" do Lucide React
3. WHEN THE Sistema de Ícones renderiza um Vehicle Type Icon para caminhão, THE Sistema de Ícones SHALL utilizar o ícone "Truck" do Lucide React
4. THE Sistema de Ícones SHALL aplicar cores e estilos consistentes aos Vehicle Type Icons
5. THE Sistema de Ícones SHALL garantir que os Vehicle Type Icons sejam visualmente distintos entre si

### Requirement 4

**User Story:** Como desenvolvedor mantendo o código, eu quero ter um sistema de ícones bem organizado e documentado, para que seja fácil adicionar novos ícones ou modificar os existentes.

#### Acceptance Criteria

1. THE Sistema de Ícones SHALL centralizar todas as importações de ícones em arquivos utilitários dedicados
2. THE Sistema de Ícones SHALL fornecer funções auxiliares para seleção automática de ícones baseada em contexto
3. THE Sistema de Ícones SHALL incluir comentários explicativos sobre o mapeamento de marcas e tipos
4. THE Sistema de Ícones SHALL seguir padrões de nomenclatura consistentes para todos os componentes de ícones
5. THE Sistema de Ícones SHALL exportar componentes reutilizáveis que encapsulem a lógica de seleção de ícones

### Requirement 5

**User Story:** Como usuário interagindo com cartões de veículos, eu quero ver ícones que respondam visualmente às minhas ações (hover, click), para que a interface seja mais dinâmica e responsiva.

#### Acceptance Criteria

1. WHEN o usuário posiciona o cursor sobre um VehicleCard, THE VehicleCard SHALL aplicar uma animação de escala ao ícone do veículo
2. THE VehicleCard SHALL utilizar transições suaves (duration-300) para todas as animações de ícones
3. THE VehicleCard SHALL manter a proporção e qualidade visual dos ícones durante as animações
4. WHEN o usuário remove o cursor do VehicleCard, THE VehicleCard SHALL retornar o ícone ao estado original suavemente
5. THE VehicleCard SHALL garantir que as animações não causem layout shift ou flickering

### Requirement 6

**User Story:** Como usuário do sistema, eu quero que os ícones carreguem rapidamente e não afetem o desempenho da aplicação, para que a experiência seja fluida e responsiva.

#### Acceptance Criteria

1. THE Sistema de Ícones SHALL utilizar tree-shaking para importar apenas os ícones necessários
2. THE Sistema de Ícones SHALL evitar importações globais de bibliotecas de ícones completas
3. WHEN THE Sistema de Ícones carrega ícones, THE Sistema de Ícones SHALL completar o carregamento em menos de 100ms
4. THE Sistema de Ícones SHALL manter o bundle size de ícones abaixo de 50KB
5. THE Sistema de Ícones SHALL implementar lazy loading para ícones de marcas raramente utilizados
