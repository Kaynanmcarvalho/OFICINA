# Design System Premium - Sistema de Oficina

## Visão Geral
Design System inspirado nos padrões da Apple com foco em clareza, hierarquia visual e micro-interações polidas.

## Arquivos Criados
- `design-tokens.json` - Tokens de design (cores, tipografia, espaçamentos)
- `tailwind.config.premium.js` - Configuração Tailwind com tokens
- Componentes React em `src/components/premium/`

## Paleta de Cores

### Modo Claro
- Background: neutral-50
- Surface: white com glass effect
- Text: neutral-900
- Borders: neutral-200

### Modo Escuro  
- Background: neutral-900
- Surface: neutral-800 com glass effect
- Text: neutral-50
- Borders: neutral-700

## Tipografia
- Font: Inter / SF Pro (fallback: system fonts)
- Scale: 12px → 60px (modular scale 1.25)
- Weights: 300, 400, 500, 600, 700

## Espaçamento
- Base: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px

## Elevação (Sombras)
- xs, sm, base, md, lg, xl
- Glass effect com backdrop-blur

## Animações
- Duration: 150ms (fast), 200ms (base), 300ms (slow)
- Easing: cubic-bezier(0.2, 0.9, 0.2, 1) - Apple style

## Componentes Principais
1. DashboardCard - Card com glass effect
2. AlertCenter - Central de alertas
3. Navbar - Barra superior
4. Sidebar - Menu lateral
5. DataTable - Tabela de dados
6. FormControls - Controles de formulário

## Acessibilidade
- Contraste mínimo 4.5:1
- Focus visible em todos os elementos interativos
- Keyboard navigation completa
- ARIA labels apropriados

## Performance
- Lazy loading de componentes
- CSS crítico inline
- SVGs otimizados
- Bundle size < 5KB por componente
