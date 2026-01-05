/**
 * TORQ Budget Feature
 * 
 * Sistema de orçamentos premium automotivo
 * Arquitetura completamente nova - Janeiro 2026
 * 
 * "Tudo deve parecer um produto premium automotivo, não um formulário."
 * 
 * ESTRUTURA:
 * /features/budget/
 *   ├─ routes/
 *   │   ├─ create.tsx      - Rota para criar orçamento
 *   │   └─ edit.tsx        - Rota para editar orçamento
 *   ├─ components/
 *   │   ├─ BudgetShell.tsx     - Container principal
 *   │   ├─ BudgetHeader.tsx    - Header com marca
 *   │   ├─ BudgetStepper.tsx   - Navegação de steps
 *   │   ├─ BudgetSection.tsx   - Container de seção
 *   │   ├─ BudgetFooter.tsx    - Footer com totais
 *   │   ├─ BudgetInput.tsx     - Input premium
 *   │   └─ steps/
 *   │       ├─ StepClient.tsx  - Step 1: Cliente
 *   │       ├─ StepVehicle.tsx - Step 2: Veículo
 *   │       ├─ StepItems.tsx   - Step 3: Itens
 *   │       └─ StepSummary.tsx - Step 4: Resumo
 *   ├─ styles/
 *   │   ├─ budget.tokens.ts    - Design tokens
 *   │   └─ budget.styles.ts    - Estilos computados
 *   └─ hooks/
 *       └─ useBudgetFlow.ts    - Hook de estado
 * 
 * DESIGN SYSTEM:
 * - Z0: Plano Base (fundo escuro com blur)
 * - Z1: Plano Estrutural (seções com sombra profunda)
 * - Z2: Plano Interativo (inputs embutidos, CTAs flutuantes)
 * 
 * REGRA DE OURO DA MARCA:
 * A cor da montadora define APENAS:
 * - Glows
 * - Estados ativos
 * - CTA
 * - Feedback
 * NÃO define layout ou fundo.
 */

// Routes
export { CreateBudgetRoute, EditBudgetRoute } from './routes';

// Components
export {
  BudgetShell,
  BudgetHeader,
  BudgetFooter,
  BudgetStepper,
  BudgetSection,
  SectionCard,
  BudgetInput,
  BudgetTextarea,
} from './components';

// Hooks
export { useBudgetFlow, BUDGET_STEPS } from './hooks/useBudgetFlow';
export type { BudgetData, BudgetClient, BudgetVehicle, BudgetItem, BudgetStep, BudgetFlowReturn } from './hooks/useBudgetFlow';

// Styles
export { colors, shadows, spacing, radius, typography, transitions, getBrandAccent } from './styles/budget.tokens';
export * from './styles/budget.styles';
