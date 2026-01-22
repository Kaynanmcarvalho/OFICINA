# 🚀 GUIA RÁPIDO DE USO - CORREÇÕES /CHECKIN

## 📋 ÍNDICE
1. [Auto-Save](#auto-save)
2. [Busca Automática de Placa](#busca-automática-de-placa)
3. [Atalhos de Teclado](#atalhos-de-teclado)
4. [Validadores](#validadores)
5. [Validação de Duplicidade](#validação-de-duplicidade)
6. [Auditoria](#auditoria)

---

## 1. AUTO-SAVE

### Como Usar
```javascript
import useAutoSave from '../hooks/useAutoSave';

const MyComponent = () => {
  const [formData, setFormData] = useState({});
  
  // Configurar auto-save
  const { loadDraft, clearDraft, hasDraft } = useAutoSave(
    formData,           // Dados a salvar
    'minha-chave',      // Chave única
    30000               // Intervalo (30s)
  );
  
  // Carregar rascunho ao montar
  useEffect(() => {
    if (hasDraft()) {
      const draft = loadDraft();
      if (draft) {
        setFormData(draft);
        toast.success('Rascunho recuperado!');
      }
    }
  }, []);
  
  // Limpar após sucesso
  const handleSubmit = async () => {
    await saveData(formData);
    clearDraft();
  };
};
```

### Características
- ✅ Salva automaticamente a cada 30 segundos
- ✅ Salva ao desmontar componente
- ✅ Expira após 24 horas
- ✅ Usa localStorage

---

## 2. BUSCA AUTOMÁTICA DE PLACA

### Como Usar
```javascript
import useAutoPlateSearch from '../hooks/useAutoPlateSearch';

const MyComponent = () => {
  const [plate, setPlate] = useState('');
  
  // Configurar busca automática
  const { 
    isSearching,      // Estado de busca
    vehicleData,      // Dados encontrados
    error,            // Erro se houver
    hasSearched,      // Se já buscou
    manualSearch,     // Forçar busca
    clearData         // Limpar dados
  } = useAutoPlateSearch(plate, 500); // 500ms debounce
  
  // Preencher dados automaticamente
  useEffect(() => {
    if (vehicleData) {
      setForm(prev => ({
        ...prev,
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        color: vehicleData.color
      }));
      toast.success('Veículo encontrado!');
    }
  }, [vehicleData]);
  
  return (
    <div>
      <input 
        value={plate}
        onChange={(e) => setPlate(e.target.value)}
        placeholder="ABC1D23"
      />
      {isSearching && <span>Buscando...</span>}
      {error && <span>{error}</span>}
      <button onClick={manualSearch}>Buscar Novamente</button>
    </div>
  );
};
```

### Características
- ✅ Busca automática após 7 caracteres
- ✅ Debounce configurável (padrão 500ms)
- ✅ Cache de última busca
- ✅ Validação de formato
- ✅ Busca manual forçada

---

## 3. ATALHOS DE TECLADO

### Como Usar

#### Atalhos de Navegação
```javascript
import { useNavigationShortcuts } from '../hooks/useKeyboardShortcuts';

const MyPage = () => {
  useNavigationShortcuts({
    onNew: () => openModal(),      // Ctrl+N
    onSearch: () => focusSearch()  // Ctrl+F
  });
};
```

#### Atalhos de Modal
```javascript
import { useModalShortcuts } from '../hooks/useKeyboardShortcuts';

const MyModal = ({ isOpen, onClose }) => {
  useModalShortcuts({
    onClose: onClose,  // Esc
    isOpen: isOpen
  });
};
```

#### Atalhos de Formulário
```javascript
import { useFormShortcuts } from '../hooks/useKeyboardShortcuts';

const MyForm = () => {
  useFormShortcuts({
    onNext: handleNext,           // Enter
    onPrevious: handlePrevious,   // Shift+Enter
    onSubmit: handleSubmit,       // Ctrl+Enter
    canSubmit: isValid,
    isEnabled: true
  });
};
```

### Lista de Atalhos
| Atalho | Ação | Contexto |
|--------|------|----------|
| `Ctrl+N` | Novo check-in | Global |
| `Ctrl+F` | Buscar | Global |
| `Esc` | Fechar modal | Modal |
| `Enter` | Avançar step | Formulário |
| `Shift+Enter` | Voltar step | Formulário |
| `Ctrl+Enter` | Submeter | Formulário (último step) |

---

## 4. VALIDADORES

### Como Usar
```javascript
import { 
  validateCPF, 
  validateCNPJ, 
  validatePlate, 
  validatePhone, 
  validateEmail,
  formatCPF,
  formatCNPJ,
  formatPhone
} from '../utils/validators';

// Validar
if (!validateCPF(cpf)) {
  toast.error('CPF inválido');
  return;
}

if (!validatePlate(plate)) {
  toast.error('Placa inválida');
  return;
}

// Formatar
const formattedCPF = formatCPF('12345678900');
// Resultado: 123.456.789-00

const formattedPhone = formatPhone('11987654321');
// Resultado: (11) 98765-4321
```

### Validadores Disponíveis
| Função | Descrição | Exemplo |
|--------|-----------|---------|
| `validateCPF(cpf)` | Valida CPF com dígito verificador | `validateCPF('123.456.789-00')` |
| `validateCNPJ(cnpj)` | Valida CNPJ com dígito verificador | `validateCNPJ('12.345.678/0001-00')` |
| `validatePlate(plate)` | Valida placa antiga e Mercosul | `validatePlate('ABC1D23')` |
| `validatePhone(phone)` | Valida telefone celular e fixo | `validatePhone('(11) 98765-4321')` |
| `validateEmail(email)` | Valida email RFC 5322 | `validateEmail('user@example.com')` |

### Formatadores Disponíveis
| Função | Descrição | Exemplo |
|--------|-----------|---------|
| `formatCPF(cpf)` | Formata CPF | `'12345678900' → '123.456.789-00'` |
| `formatCNPJ(cnpj)` | Formata CNPJ | `'12345678000100' → '12.345.678/0001-00'` |
| `formatPhone(phone)` | Formata telefone | `'11987654321' → '(11) 98765-4321'` |

---

## 5. VALIDAÇÃO DE DUPLICIDADE

### Como Usar
```javascript
import { useCheckinStore } from '../store/checkinStore';

const MyComponent = () => {
  const { checkDuplicateCheckin } = useCheckinStore();
  
  const handleSubmit = async () => {
    // Verificar duplicidade ANTES de criar
    const duplicate = await checkDuplicateCheckin(plate);
    
    if (duplicate) {
      toast.error(
        `Já existe um check-in ativo para esta placa!\n` +
        `Check-in ID: ${duplicate.id}\n` +
        `Status: ${duplicate.status}`,
        { duration: 5000 }
      );
      return;
    }
    
    // Criar check-in
    await createCheckin(data);
  };
};
```

### Características
- ✅ Verifica ANTES de criar
- ✅ Normaliza placa automaticamente
- ✅ Busca por múltiplos status ativos
- ✅ Retorna ID do check-in existente

---

## 6. AUDITORIA

### Como Usar
```javascript
import { 
  logCheckinCreated, 
  logCheckinUpdated, 
  logCheckinDeleted,
  getAuditLogs
} from '../services/auditService';

// Log de criação
const handleCreate = async () => {
  const result = await createCheckin(data);
  await logCheckinCreated(result.id, data);
};

// Log de atualização
const handleUpdate = async () => {
  const previousData = { ...currentData };
  await updateCheckin(id, newData);
  await logCheckinUpdated(id, previousData, newData);
};

// Log de exclusão
const handleDelete = async () => {
  await deleteCheckin(id);
  await logCheckinDeleted(id, data);
};

// Buscar logs
const logs = await getAuditLogs({
  entityType: 'checkin',
  entityId: checkinId,
  startDate: new Date('2026-01-01'),
  endDate: new Date('2026-01-31')
});
```

### Características
- ✅ Log completo de todas as ações
- ✅ Rastreabilidade total (userId, userName, timestamp)
- ✅ Histórico de alterações com diff
- ✅ Busca de logs com filtros
- ✅ Compliance e segurança

---

## 🎯 EXEMPLO COMPLETO

```javascript
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Hooks
import useAutoSave from '../hooks/useAutoSave';
import useAutoPlateSearch from '../hooks/useAutoPlateSearch';
import { useFormShortcuts, useModalShortcuts } from '../hooks/useKeyboardShortcuts';

// Validators
import { validatePlate, validatePhone, formatPhone } from '../utils/validators';

// Services
import { logCheckinCreated } from '../services/auditService';

// Store
import { useCheckinStore } from '../store/checkinStore';

const NovoCheckinModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ plate: '', phone: '' });
  const { checkDuplicateCheckin } = useCheckinStore();
  
  // Auto-save
  const { loadDraft, clearDraft, hasDraft } = useAutoSave(form, 'checkin', 30000);
  
  // Busca automática
  const { vehicleData, isSearching, error } = useAutoPlateSearch(form.plate);
  
  // Atalhos
  useModalShortcuts({ onClose, isOpen });
  useFormShortcuts({
    onSubmit: handleSubmit,
    canSubmit: isValid,
    isEnabled: isOpen
  });
  
  // Carregar rascunho
  useEffect(() => {
    if (isOpen && hasDraft()) {
      const draft = loadDraft();
      if (draft) {
        setForm(draft);
        toast.success('Rascunho recuperado!');
      }
    }
  }, [isOpen]);
  
  // Preencher dados automáticos
  useEffect(() => {
    if (vehicleData) {
      setForm(prev => ({ ...prev, ...vehicleData }));
      toast.success('Veículo encontrado!');
    }
  }, [vehicleData]);
  
  const handleSubmit = async () => {
    // Validar
    if (!validatePlate(form.plate)) {
      toast.error('Placa inválida');
      return;
    }
    
    if (form.phone && !validatePhone(form.phone)) {
      toast.error('Telefone inválido');
      return;
    }
    
    // Verificar duplicidade
    const duplicate = await checkDuplicateCheckin(form.plate);
    if (duplicate) {
      toast.error(`Check-in duplicado! ID: ${duplicate.id}`);
      return;
    }
    
    // Criar
    const data = {
      ...form,
      phone: formatPhone(form.phone)
    };
    
    const result = await createCheckin(data);
    
    // Auditar
    await logCheckinCreated(result.id, data);
    
    // Limpar
    clearDraft();
    toast.success('Check-in criado!');
    onClose();
  };
  
  return (
    <div>
      <input 
        value={form.plate}
        onChange={(e) => setForm({ ...form, plate: e.target.value })}
      />
      {isSearching && <span>Buscando...</span>}
      {error && <span>{error}</span>}
      <button onClick={handleSubmit}>Criar</button>
    </div>
  );
};
```

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- [Auditoria Completa](./requirements.md)
- [Correções Implementadas](./correcoes-implementadas.md)
- [Fase 2 Completa](./fase2-completa.md)
- [Entrega Final](./ENTREGA_FINAL.md)

---

**Última Atualização:** 21 de Janeiro de 2026  
**Versão:** 1.0.0  
**Status:** Produção ✅
