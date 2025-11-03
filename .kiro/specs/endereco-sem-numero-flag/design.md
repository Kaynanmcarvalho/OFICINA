# Design Document

## Overview

Esta funcionalidade implementa uma flag booleana `hasNumber` que controla se um endereço possui numeração, permitindo formatação inteligente de endereços e melhor experiência do usuário para casos como endereços rurais, estradas e locais sem numeração oficial.

## Architecture

### Data Model Extension
```javascript
// Extensão do modelo de cliente
const clientModel = {
  // ... campos existentes
  address: string,
  number: string,
  hasNumber: boolean, // Nova flag - padrão true para compatibilidade
  complement: string,
  neighborhood: string,
  city: string,
  state: string,
  zipCode: string
}
```

### Component Architecture
```
src/
├── utils/
│   └── addressUtils.js          # Utilitários de formatação
├── pages/
│   ├── checkin/componentes/
│   │   └── ModalNovoCliente.jsx # Modal de cadastro
│   └── clients/components/
│       ├── ClientViewModal.jsx   # Visualização
│       └── ClientFormHorizontal.jsx # Edição
```

## Components and Interfaces

### 1. AddressUtils (Utility Module)

#### formatFullAddress(addressData)
```javascript
/**
 * Formata endereço completo considerando hasNumber
 * @param {Object} addressData - Dados do endereço
 * @returns {string} Endereço formatado
 */
export const formatFullAddress = (addressData) => {
  const parts = [
    addressData.address,
    // Só inclui número se hasNumber for true E number existir
    (addressData.hasNumber !== false && addressData.number) && `nº ${addressData.number}`,
    addressData.complement,
    addressData.neighborhood,
    addressData.city,
    addressData.state,
    addressData.zipCode && formatCEP(addressData.zipCode)
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : 'Não informado';
};
```

#### validateAddress(addressData)
```javascript
/**
 * Valida endereço considerando hasNumber
 * @param {Object} addressData - Dados do endereço
 * @returns {Object} Resultado da validação
 */
export const validateAddress = (addressData) => {
  const errors = {};
  
  if (!addressData.address?.trim()) {
    errors.address = 'Endereço é obrigatório';
  }
  
  // Número só é obrigatório se hasNumber for true
  if (addressData.hasNumber && !addressData.number?.trim()) {
    errors.number = 'Número é obrigatório quando o endereço possui numeração';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

### 2. Form Components Interface

#### State Management
```javascript
const [formData, setFormData] = useState({
  // ... outros campos
  address: existingClient?.address || '',
  number: existingClient?.number || '',
  hasNumber: existingClient?.hasNumber !== false, // true por padrão
  complement: existingClient?.complement || '',
  // ... outros campos
});
```

#### UI Component Structure
```jsx
<div>
  <label>
    Número {formData.hasNumber ? '*' : '(Opcional)'}
  </label>
  <div className="space-y-3">
    <input
      type="text"
      value={formData.number}
      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
      disabled={!formData.hasNumber}
      className={formData.hasNumber ? 'enabled-styles' : 'disabled-styles'}
    />
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={formData.hasNumber}
        onChange={(e) => setFormData({ 
          ...formData, 
          hasNumber: e.target.checked,
          number: e.target.checked ? formData.number : ''
        })}
      />
      <span>Este endereço possui número</span>
    </label>
  </div>
</div>
```

## Data Models

### Client Data Structure
```javascript
// Estrutura completa do cliente
const client = {
  id: string,
  name: string,
  email: string,
  phone: string,
  // Dados de endereço
  address: string,        // Rua/Avenida
  number: string,         // Número (pode estar vazio)
  hasNumber: boolean,     // Flag de controle
  complement: string,     // Complemento
  neighborhood: string,   // Bairro
  city: string,          // Cidade
  state: string,         // Estado
  zipCode: string,       // CEP
  // ... outros campos
};
```

### Migration Strategy
```javascript
// Para dados existentes sem hasNumber
const migrateAddress = (oldClient) => ({
  ...oldClient,
  hasNumber: oldClient.hasNumber !== undefined 
    ? oldClient.hasNumber 
    : Boolean(oldClient.number?.trim()) // Inferir baseado na existência de número
});
```

## Error Handling

### Validation Rules
1. **Endereço obrigatório**: Sempre validado
2. **Número condicional**: Obrigatório apenas se `hasNumber = true`
3. **Compatibilidade**: Dados sem `hasNumber` assumem `true` se `number` existir

### Error Messages
```javascript
const errorMessages = {
  address: 'Endereço é obrigatório',
  number: 'Número é obrigatório quando o endereço possui numeração',
  neighborhood: 'Bairro é obrigatório',
  city: 'Cidade é obrigatória',
  state: 'Estado é obrigatório'
};
```

## Testing Strategy

### Unit Tests
1. **formatFullAddress()**: Testar com e sem número
2. **validateAddress()**: Testar validação condicional
3. **migrateAddress()**: Testar migração de dados antigos

### Integration Tests
1. **Form Behavior**: Checkbox habilitando/desabilitando campo
2. **Data Persistence**: Salvamento correto da flag
3. **Display Logic**: Formatação correta na visualização

### Test Cases
```javascript
// Casos de teste principais
const testCases = [
  {
    name: 'Endereço com número',
    input: { address: 'Rua A', number: '123', hasNumber: true },
    expected: 'Rua A, nº 123'
  },
  {
    name: 'Endereço sem número',
    input: { address: 'Estrada Rural', number: '', hasNumber: false },
    expected: 'Estrada Rural'
  },
  {
    name: 'Dados antigos com número',
    input: { address: 'Rua B', number: '456' }, // sem hasNumber
    expected: 'Rua B, nº 456' // deve inferir hasNumber = true
  }
];
```

## Implementation Details

### Components to Update
1. **ModalNovoCliente.jsx**: Adicionar checkbox e lógica
2. **ClientFormHorizontal.jsx**: Implementar interface consistente
3. **ClientViewModal.jsx**: Usar formatação inteligente
4. **addressUtils.js**: Criar utilitários reutilizáveis

### Styling Approach
- **Campo habilitado**: Estilos normais com foco azul
- **Campo desabilitado**: Opacidade reduzida, cursor not-allowed
- **Checkbox**: Estilo consistente com design system
- **Labels dinâmicas**: Indicação visual de obrigatoriedade

### Backward Compatibility
- Clientes existentes sem `hasNumber` assumem `true` se `number` existir
- Função de migração automática para dados antigos
- Formatação defensiva para evitar quebras

## Design Decisions

### 1. Default Value Strategy
**Decisão**: `hasNumber = true` por padrão
**Rationale**: Maioria dos endereços possui número, minimiza impacto em dados existentes

### 2. Field Interaction
**Decisão**: Desabilitar campo quando `hasNumber = false`
**Rationale**: Feedback visual claro, previne entrada de dados inconsistentes

### 3. Data Clearing
**Decisão**: Limpar `number` quando `hasNumber` vira `false`
**Rationale**: Evita dados inconsistentes, força decisão consciente do usuário

### 4. Utility Functions
**Decisão**: Criar módulo `addressUtils.js` separado
**Rationale**: Reutilização, testabilidade, manutenibilidade