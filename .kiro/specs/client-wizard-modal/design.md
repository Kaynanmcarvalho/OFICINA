# Design Document - Client Wizard Modal

## Overview

O Client Wizard Modal é um componente React sofisticado que implementa um fluxo multi-step para criação e edição de clientes. O design segue os princípios Apple de simplicidade, elegância e fluidez, com transições suaves e feedback visual imediato.

## Architecture

### Component Structure

```
ClientWizardModal/
├── ClientWizardModal.jsx          # Container principal
├── components/
│   ├── WizardProgress.jsx         # Indicador de progresso
│   ├── WizardNavigation.jsx       # Botões de navegação
│   ├── steps/
│   │   ├── Step1BasicInfo.jsx    # Informações básicas
│   │   ├── Step2Contact.jsx      # Contato e localização
│   │   ├── Step3Additional.jsx   # Informações adicionais
│   │   ├── Step4Vehicles.jsx     # Veículos (opcional)
│   │   └── Step5Review.jsx       # Revisão final
│   └── shared/
│       ├── FormField.jsx          # Campo de formulário reutilizável
│       ├── FormSection.jsx        # Seção de formulário
│       └── ValidationMessage.jsx  # Mensagem de validação
└── hooks/
    ├── useWizardState.js          # Gerenciamento de estado do wizard
    ├── useFormValidation.js       # Validação de formulários
    └── useCepLookup.js            # Busca de CEP
```

### State Management

```javascript
// Estado principal do wizard
{
  currentStep: 1,
  totalSteps: 5,
  isEditing: false,
  formData: {
    // Step 1
    personType: 'PF', // 'PF' ou 'PJ'
    name: '',
    cpf: '',
    cnpj: '',
    companyName: '',
    
    // Step 2
    phone: '',
    phoneSecondary: '',
    email: '',
    whatsapp: '',
    address: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    },
    
    // Step 3
    birthDate: '',
    gender: '',
    profession: '',
    referralSource: '',
    contactPreferences: [],
    notes: '',
    
    // Step 4
    vehicles: [],
    
    // Meta
    active: true
  },
  validation: {
    step1: { isValid: false, errors: {} },
    step2: { isValid: false, errors: {} },
    step3: { isValid: true, errors: {} },
    step4: { isValid: true, errors: {} },
    step5: { isValid: false, errors: {} }
  },
  touched: {}
}
```

## Components and Interfaces

### 1. ClientWizardModal (Main Container)

**Props:**
```typescript
interface ClientWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: ClientData) => Promise<void>;
  client?: Client | null;
  isLoading?: boolean;
}
```

**Responsibilities:**
- Gerenciar estado global do wizard
- Controlar navegação entre steps
- Coordenar validações
- Executar save final

**Key Features:**
- Backdrop com blur
- Modal centralizado responsivo
- Animações de entrada/saída
- Gerenciamento de keyboard shortcuts

### 2. WizardProgress

**Props:**
```typescript
interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    number: number;
    title: string;
    isValid: boolean;
  }>;
  onStepClick?: (step: number) => void;
}
```

**Design:**
- Linha de progresso horizontal
- Círculos numerados para cada step
- Animação de preenchimento progressivo
- Indicadores visuais de validação (check verde, x vermelho)
- Títulos dos steps abaixo dos círculos

### 3. Step Components

#### Step1BasicInfo

**Fields:**
- Toggle PF/PJ (segmented control estilo iOS)
- Nome completo (text input)
- CPF (masked input) - se PF
- CNPJ + Razão Social (masked inputs) - se PJ

**Validations:**
- Nome: obrigatório, mínimo 3 caracteres
- CPF: formato válido, dígitos verificadores
- CNPJ: formato válido, dígitos verificadores

#### Step2Contact

**Fields:**
- Telefone principal (masked input)
- Telefone secundário (masked input)
- E-mail (email input)
- WhatsApp (masked input com botão "Usar telefone principal")
- CEP (masked input com busca automática)
- Rua, Número, Complemento
- Bairro, Cidade, Estado

**Validations:**
- Telefone principal: obrigatório, formato válido
- E-mail: formato válido se preenchido
- CEP: formato válido, busca automática

**Features:**
- Busca automática de endereço por CEP (ViaCEP API)
- Loading state durante busca
- Preenchimento automático de campos
- Botão para copiar telefone para WhatsApp

#### Step3Additional

**Fields:**
- Data de nascimento (date picker)
- Gênero (select: Masculino, Feminino, Outro, Prefiro não informar)
- Profissão (text input)
- Como conheceu (select: Indicação, Google, Redes Sociais, Outros)
- Preferências de contato (multi-select: WhatsApp, E-mail, Telefone)
- Observações (textarea com contador)

**Validations:**
- Todos os campos opcionais
- Observações: máximo 500 caracteres

#### Step4Vehicles

**Features:**
- Lista de veículos adicionados
- Botão "Adicionar Veículo"
- Form inline para novo veículo:
  - Marca (text)
  - Modelo (text)
  - Ano (number)
  - Placa (masked input)
  - Cor (text)
  - Chassi (text, opcional)
- Botão remover em cada veículo
- Botão "Pular esta etapa"

**Validations:**
- Marca e Modelo obrigatórios se adicionar veículo
- Placa: formato Mercosul ou antigo

#### Step5Review

**Layout:**
- Cards organizados por seção
- Cada card mostra dados de um step
- Botão "Editar" em cada card
- Resumo visual elegante
- Destaque para campos obrigatórios faltantes

**Sections:**
1. Informações Básicas
2. Contato e Localização
3. Informações Adicionais
4. Veículos (se houver)

### 4. WizardNavigation

**Props:**
```typescript
interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoBack: boolean;
  isLastStep: boolean;
  isLoading: boolean;
  onNext: () => void;
  onBack: () => void;
  onSave: () => void;
  onCancel: () => void;
}
```

**Layout:**
- Footer fixo no modal
- Botão "Voltar" (esquerda)
- Botão "Cancelar" (centro-esquerda)
- Botão "Próximo" ou "Salvar" (direita)
- Animações em hover e click

## Data Models

### Client Data Model

```typescript
interface ClientData {
  // Identificação
  personType: 'PF' | 'PJ';
  name: string;
  cpf?: string;
  cnpj?: string;
  companyName?: string;
  
  // Contato
  phone: string;
  phoneSecondary?: string;
  email?: string;
  whatsapp?: string;
  
  // Endereço
  address: {
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  
  // Informações Adicionais
  birthDate?: string;
  gender?: string;
  profession?: string;
  referralSource?: string;
  contactPreferences?: string[];
  notes?: string;
  
  // Veículos
  vehicles?: Vehicle[];
  
  // Meta
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year?: string;
  plate?: string;
  color?: string;
  chassis?: string;
  addedAt: string;
}
```

## Error Handling

### Validation Errors

```javascript
{
  field: 'cpf',
  message: 'CPF inválido',
  type: 'format'
}
```

### API Errors

- CEP não encontrado: Exibir mensagem e permitir preenchimento manual
- Erro ao salvar: Toast de erro com mensagem clara
- Timeout: Retry automático com feedback visual

## Testing Strategy

### Unit Tests

1. **Validation Functions**
   - CPF/CNPJ validation
   - Email validation
   - Phone validation
   - Plate validation

2. **Hooks**
   - useWizardState navigation logic
   - useFormValidation error handling
   - useCepLookup API integration

3. **Components**
   - Form field rendering
   - Validation message display
   - Step navigation

### Integration Tests

1. **Wizard Flow**
   - Complete wizard navigation
   - Data persistence between steps
   - Validation blocking navigation
   - Save functionality

2. **Edit Mode**
   - Pre-fill existing data
   - Update functionality
   - Cancel without saving

### E2E Tests

1. **Happy Path**
   - Create new client (all steps)
   - Edit existing client
   - Add vehicles during creation

2. **Error Scenarios**
   - Invalid CPF/CNPJ
   - CEP lookup failure
   - Save failure

## Design Tokens

### Colors

```javascript
// Light Mode
{
  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: 'rgba(17, 24, 39, 0.8)',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF'
  },
  accent: '#3B82F6',
  success: '#10B981',
  error: '#EF4444'
}

// Dark Mode
{
  background: 'rgba(17, 24, 39, 0.95)',
  surface: 'rgba(31, 41, 55, 0.8)',
  border: 'rgba(75, 85, 99, 0.8)',
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    tertiary: '#9CA3AF'
  },
  accent: '#3B82F6',
  success: '#10B981',
  error: '#EF4444'
}
```

### Spacing

```javascript
{
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem'   // 48px
}
```

### Typography

```javascript
{
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    lineHeight: 1.2
  },
  subheading: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  body: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.4
  }
}
```

### Animations

```javascript
{
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)'
  },
  spring: {
    type: 'spring',
    damping: 30,
    stiffness: 300
  }
}
```

## Performance Considerations

1. **Lazy Loading**: Carregar steps sob demanda
2. **Debounce**: Validações em tempo real com debounce de 300ms
3. **Memoization**: Usar React.memo em componentes pesados
4. **Virtual Scrolling**: Para lista de veículos se houver muitos

## Accessibility

1. **Keyboard Navigation**
   - Tab para navegar entre campos
   - Enter para avançar step
   - Esc para fechar modal

2. **Screen Readers**
   - Labels descritivos
   - ARIA labels em ícones
   - Anúncio de erros de validação

3. **Focus Management**
   - Auto-focus no primeiro campo de cada step
   - Trap focus dentro do modal
   - Restaurar focus ao fechar

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
