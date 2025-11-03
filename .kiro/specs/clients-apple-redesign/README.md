# Clients Page Apple Redesign - Spec

## Overview

Esta spec define a reformulação completa da página `/clients` do sistema TORQ com design Apple-like premium. O objetivo é criar uma experiência minimalista, elegante e imersiva, mantendo todas as funcionalidades existentes.

## Objetivos

- ✨ Design Apple-like premium com glassmorphism
- 🎨 Suporte completo a modo claro/escuro
- ⚡ Performance otimizada (< 1s load, 60fps animations)
- ♿ Acessibilidade WCAG AA
- 📱 Responsividade mobile-first
- ⌨️ Atalhos de teclado para power users
- 🎭 Microinterações suaves e elegantes

## Estrutura da Spec

1. **requirements.md** - Requisitos funcionais e não-funcionais
2. **design.md** - Especificações visuais e de UX
3. **tasks.md** - Plano de implementação detalhado

## Principais Funcionalidades

### Existentes (Mantidas)
- Listagem de clientes com tabela dinâmica
- Busca e filtros
- Criação de novos clientes
- Edição de clientes existentes
- Integração com Firebase
- Alternância de tema claro/escuro

### Novas (Adicionadas)
- Glassmorphism design system
- Busca instantânea com debounce
- Placeholder animado no campo de busca
- Drawer lateral para detalhes do cliente
- Notificações flutuantes elegantes
- Atalhos de teclado (⌘+K, ⌘+N, ESC)
- Microinterações em hover e click
- Empty state com ilustração
- Loading states com skeleton
- Virtualization para listas grandes

## Design Highlights

### Visual Language
- **Glassmorphism**: Cards translúcidos com backdrop-blur
- **Tipografia**: SF Pro Display/Text inspired
- **Cores**: Tons suaves com acentos em azul elétrico
- **Animações**: Transições suaves de 0.15s - 0.3s
- **Espaçamento**: Proporções harmoniosas estilo Apple

### Key Components
1. **PageHeader** - Título + Badge + Botão Novo Cliente
2. **SearchBar** - Busca instantânea com placeholder animado
3. **ClientTable** - Tabela com hover effects e microinterações
4. **ClientModal** - Modal flutuante para criar/editar
5. **ClientDrawer** - Painel lateral com detalhes completos
6. **EmptyState** - Estado vazio elegante
7. **Toast** - Notificações flutuantes

## Tech Stack

- **React** - Framework principal
- **Framer Motion** - Animações suaves
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones minimalistas
- **React Hot Toast** - Notificações
- **Firebase** - Backend (já integrado)

## Implementation Plan

### Fase 1: Setup e Base (2 dias)
- Tokens de design
- Componentes base reutilizáveis
- Sistema de cores e tema

### Fase 2: Componentes Principais (3 dias)
- PageHeader
- SearchBar com busca instantânea
- ClientTable com microinterações

### Fase 3: Modal e Drawer (2 dias)
- ClientModal redesenhado
- ClientDrawer com detalhes

### Fase 4: Responsive e Performance (2 dias)
- Adaptações mobile
- Virtualization
- Otimizações

### Fase 5: Accessibility e Testing (2 dias)
- ARIA labels
- Keyboard navigation
- Testes automatizados

### Fase 6: Polimento (1 dia)
- Ajustes finais
- Documentação
- QA

**Total: ~12 dias**

## Success Metrics

- ✅ Page load < 1s on 3G
- ✅ Search results < 300ms
- ✅ 60fps on all animations
- ✅ WCAG AA compliance
- ✅ User satisfaction > 4.5/5
- ✅ Zero accessibility violations

## Getting Started

1. Leia `requirements.md` para entender os requisitos
2. Revise `design.md` para especificações visuais
3. Siga `tasks.md` para implementação passo a passo

## References

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Glassmorphism Design](https://uxdesign.cc/glassmorphism-in-user-interfaces-1f39bb1308c9)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Notes

- Manter compatibilidade com código existente
- Testar em ambos os temas (claro/escuro)
- Garantir responsividade em todas as telas
- Priorizar acessibilidade desde o início
- Documentar decisões de design importantes
