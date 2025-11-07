# 📋 Exemplo de Integração - Página de Orçamentos

## 🎯 Objetivo

Adicionar funcionalidade de envio de orçamentos via WhatsApp na página de orçamentos existente.

---

## 📝 Passo a Passo

### 1. Importar Componentes

```jsx
// src/pages/budgets/BudgetsPage.jsx
import { useState } from 'react';
import WhatsAppButton from '../../components/whatsapp/WhatsAppButton';
import WhatsAppIntegration from './components/WhatsAppIntegration';
import { whatsappService } from '../../services/whatsappService';
import toast from 'react-hot-toast';
```

### 2. Adicionar Botão no Header

```jsx
export default function BudgetsPage() {
  return (
    <div className="p-6">
      {/* Header com botão WhatsApp */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Orçamentos
        </h1>
        
        {/* Botão de conexão WhatsApp */}
        <WhatsAppButton />
      </div>

      {/* Resto da página */}
    </div>
  );
}
```

### 3. Adicionar Botão de Envio em Cada Orçamento

```jsx
function BudgetCard({ budget }) {
  const [isSending, setIsSending] = useState(false);

  const handleSendWhatsApp = async () => {
    try {
      setIsSending(true);

      // Verificar se cliente tem telefone
      if (!budget.client?.phone) {
        toast.error('Cliente não possui telefone cadastrado');
        return;
      }

      // Enviar orçamento
      const result = await whatsappService.sendBudget(
        budget.client.phone,
        budget
      );

      if (result.success) {
        toast.success('Orçamento enviado com sucesso!');
      }
    } catch (error) {
      toast.error(error.message || 'Erro ao enviar orçamento');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {budget.client.name}
          </h3>
          <p className="text-sm text-gray-500">
            {budget.vehicle?.brand} {budget.vehicle?.model}
          </p>
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          R$ {budget.total.toFixed(2)}
        </span>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-2">
        <button
          onClick={handleSendWhatsApp}
          disabled={isSending}
          className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isSending ? 'Enviando...' : 'Enviar via WhatsApp'}
        </button>
        
        <button className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
```

### 4. Usar Componente de Integração (Alternativa)

```jsx
function BudgetCard({ budget }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
      {/* Conteúdo do orçamento */}
      
      {/* Integração WhatsApp */}
      <WhatsAppIntegration
        budget={budget}
        onSent={() => {
          toast.success('Orçamento enviado!');
          // Atualizar status, etc.
        }}
      />
    </div>
  );
}
```

---

## 🎨 Exemplo Completo

```jsx
// src/pages/budgets/BudgetsPage.jsx
import { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import WhatsAppButton from '../../components/whatsapp/WhatsAppButton';
import WhatsAppIntegration from './components/WhatsAppIntegration';
import { useBudgetStore } from '../../store/budgetStore';
import toast from 'react-hot-toast';

export default function BudgetsPage() {
  const { budgets, fetchBudgets } = useBudgetStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.client.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || budget.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Orçamentos
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gerencie e envie orçamentos para seus clientes
            </p>
          </div>
          
          <div className="flex gap-3">
            <WhatsAppButton />
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
              <Plus className="w-5 h-5" />
              Novo Orçamento
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendente</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Rejeitado</option>
          </select>
        </div>
      </div>

      {/* Lista de Orçamentos */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBudgets.map(budget => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>

        {filteredBudgets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum orçamento encontrado
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BudgetCard({ budget }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return 'Pendente';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header do Card */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {budget.client.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {budget.client.phone}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(budget.status)}`}>
            {getStatusText(budget.status)}
          </span>
        </div>
        
        {budget.vehicle && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            🚗 {budget.vehicle.brand} {budget.vehicle.model} - {budget.vehicle.plate}
          </p>
        )}
      </div>

      {/* Itens */}
      <div className="p-4 space-y-2">
        {budget.items.slice(0, 3).map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {item.description}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              R$ {item.price.toFixed(2)}
            </span>
          </div>
        ))}
        
        {budget.items.length > 3 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            +{budget.items.length - 3} itens
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            R$ {budget.total.toFixed(2)}
          </span>
        </div>

        {/* Integração WhatsApp */}
        <WhatsAppIntegration
          budget={budget}
          onSent={() => {
            toast.success('Orçamento enviado com sucesso!');
          }}
        />
      </div>
    </div>
  );
}
```

---

## 📱 Formato da Mensagem Enviada

```
🔧 *Orçamento - Torq*

👤 Cliente: João Silva
🚗 Veículo: Toyota Corolla
📋 Placa: ABC-1234

*Serviços/Produtos:*
1. Troca de óleo - R$ 150.00
2. Filtro de ar - R$ 80.00
3. Alinhamento - R$ 120.00

💰 *Total: R$ 350.00*

Obrigado pela preferência! 🙏
```

---

## 🎨 Personalizar Mensagem

```javascript
// src/services/whatsappService.js

formatBudgetMessage(budget) {
  const { client, vehicle, items, total, validUntil } = budget;
  
  let message = `🔧 *Orçamento - ${process.env.VITE_APP_NAME || 'Torq'}*\n\n`;
  message += `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
  message += `👤 Cliente: ${client.name}\n`;
  
  if (vehicle) {
    message += `🚗 Veículo: ${vehicle.brand} ${vehicle.model}\n`;
    if (vehicle.plate) {
      message += `📋 Placa: ${vehicle.plate}\n`;
    }
    if (vehicle.year) {
      message += `📆 Ano: ${vehicle.year}\n`;
    }
  }
  
  message += `\n*Serviços/Produtos:*\n`;
  
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.description}`;
    if (item.quantity > 1) {
      message += ` (${item.quantity}x)`;
    }
    message += ` - R$ ${item.price.toFixed(2)}\n`;
  });
  
  message += `\n💰 *Total: R$ ${total.toFixed(2)}*\n`;
  
  if (validUntil) {
    message += `⏰ Válido até: ${new Date(validUntil).toLocaleDateString('pt-BR')}\n`;
  }
  
  message += `\n✅ Para aprovar, responda "SIM"`;
  message += `\n❌ Para recusar, responda "NÃO"`;
  message += `\n\nObrigado pela preferência! 🙏`;
  
  return message;
}
```

---

## 🔔 Notificações

```jsx
import toast from 'react-hot-toast';

// Sucesso
toast.success('Orçamento enviado com sucesso!', {
  icon: '✅',
  duration: 3000
});

// Erro
toast.error('Erro ao enviar orçamento', {
  icon: '❌',
  duration: 4000
});

// Loading
const toastId = toast.loading('Enviando orçamento...');
// ... após enviar
toast.success('Enviado!', { id: toastId });
```

---

## ✅ Checklist de Integração

- [ ] Importar componentes WhatsApp
- [ ] Adicionar botão de conexão no header
- [ ] Adicionar botão de envio em cada orçamento
- [ ] Validar telefone do cliente
- [ ] Testar envio de mensagem
- [ ] Personalizar formato da mensagem
- [ ] Adicionar feedback visual (toast)
- [ ] Testar com tema claro e escuro
- [ ] Documentar para a equipe

---

**Pronto! Integração completa funcionando! 🎉**
