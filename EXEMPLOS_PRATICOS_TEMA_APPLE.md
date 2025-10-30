# 💡 Exemplos Práticos - Tema Apple Premium

## 🎯 Casos de Uso Reais

Exemplos práticos de como aplicar o tema Apple Premium em componentes comuns do seu sistema.

---

## 📊 Dashboard Cards

### Card de Estatística

```jsx
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

function StatCard({ title, value, change, icon: Icon, trend }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="card-macos p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-dark-accent to-dark-accent-alt dark:from-dark-accent dark:to-dark-accent-alt flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {change}
        </span>
      </div>
      
      {/* Content */}
      <div>
        <p className="text-sm text-gray-600 dark:text-dark-muted">
          {title}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-dark-text mt-1">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

// Uso
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatCard
    title="Total de Clientes"
    value="1,234"
    change="+12%"
    icon={Users}
    trend="up"
  />
  <StatCard
    title="Receita Mensal"
    value="R$ 45.6k"
    change="+8%"
    icon={DollarSign}
    trend="up"
  />
  <StatCard
    title="Taxa de Crescimento"
    value="23%"
    change="-2%"
    icon={TrendingUp}
    trend="down"
  />
</div>
```

---

## 📝 Formulários

### Form de Check-in

```jsx
import { motion } from 'framer-motion';
import { Car, User, Calendar } from 'lucide-react';

function CheckinForm() {
  return (
    <div className="card-macos p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6">
        Novo Check-in
      </h2>
      
      <form className="space-y-6">
        {/* Cliente */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-900 dark:text-dark-text">
            <User className="w-4 h-4 mr-2 text-dark-accent dark:text-dark-accent" />
            Cliente
          </label>
          <input
            type="text"
            placeholder="Nome do cliente..."
            className="input-macos"
          />
        </div>
        
        {/* Veículo */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-900 dark:text-dark-text">
            <Car className="w-4 h-4 mr-2 text-dark-accent dark:text-dark-accent" />
            Veículo
          </label>
          <input
            type="text"
            placeholder="Placa do veículo..."
            className="input-macos"
          />
        </div>
        
        {/* Data */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-900 dark:text-dark-text">
            <Calendar className="w-4 h-4 mr-2 text-dark-accent dark:text-dark-accent" />
            Data de Entrada
          </label>
          <input
            type="date"
            className="input-macos"
          />
        </div>
        
        {/* Observações */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-dark-text">
            Observações
          </label>
          <textarea
            placeholder="Descreva o serviço..."
            rows={4}
            className="input-macos resize-none"
          />
        </div>
        
        {/* Divider */}
        <div className="divider-apple" />
        
        {/* Actions */}
        <div className="flex gap-3">
          <button type="button" className="btn-macos flex-1">
            Cancelar
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="btn-primary flex-1"
          >
            Criar Check-in
          </motion.button>
        </div>
      </form>
    </div>
  );
}
```

---

## 📋 Listas e Tabelas

### Lista de Clientes

```jsx
import { motion } from 'framer-motion';
import { User, Phone, Mail, MoreVertical } from 'lucide-react';

function ClientesList({ clientes }) {
  return (
    <div className="card-macos p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-6">
        Clientes Recentes
      </h2>
      
      <div className="space-y-2">
        {clientes.map((cliente, index) => (
          <motion.div
            key={cliente.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-hover transition-all duration-200 cursor-pointer"
          >
            {/* Avatar e Info */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-dark-accent to-dark-purple dark:from-dark-accent dark:to-dark-purple flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-dark-text">
                  {cliente.nome}
                </h3>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center text-xs text-gray-600 dark:text-dark-muted">
                    <Phone className="w-3 h-3 mr-1" />
                    {cliente.telefone}
                  </span>
                  <span className="flex items-center text-xs text-gray-600 dark:text-dark-muted">
                    <Mail className="w-3 h-3 mr-1" />
                    {cliente.email}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover-strong transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-dark-muted" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔔 Notificações e Alertas

### Toast Notification

```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

function Toast({ type, message, onClose }) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  };
  
  const colors = {
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-rose-500',
    info: 'from-dark-accent to-dark-accent-alt',
  };
  
  const Icon = icons[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className="glass-apple rounded-2xl p-4 shadow-apple-lg max-w-md"
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[type]} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
            {message}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-dark-muted" />
        </motion.button>
      </div>
    </motion.div>
  );
}
```

---

## 🎛️ Modais

### Modal de Confirmação

```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="card-elevated rounded-2xl p-6 max-w-md w-full"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text text-center mb-2">
                {title}
              </h3>
              <p className="text-gray-600 dark:text-dark-muted text-center mb-6">
                {message}
              </p>
              
              {/* Divider */}
              <div className="divider-apple mb-6" />
              
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="btn-macos flex-1"
                >
                  Cancelar
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className="btn-primary flex-1"
                >
                  Confirmar
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

## 🎨 Cards com Glassmorphism

### Card de Veículo

```jsx
import { motion } from 'framer-motion';
import { Car, Calendar, Wrench } from 'lucide-react';

function VehicleCard({ veiculo }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass-apple rounded-2xl p-6 space-y-4"
    >
      {/* Header com imagem */}
      <div className="relative h-40 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {veiculo.imagem ? (
          <img
            src={veiculo.imagem}
            alt={veiculo.modelo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-16 h-16 text-gray-600" />
          </div>
        )}
        
        {/* Badge de status */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/90 text-white backdrop-blur-sm">
            Em serviço
          </span>
        </div>
      </div>
      
      {/* Info */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">
          {veiculo.modelo}
        </h3>
        <p className="text-sm text-gray-600 dark:text-dark-muted">
          {veiculo.placa}
        </p>
      </div>
      
      {/* Divider */}
      <div className="divider-apple" />
      
      {/* Metadata */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
          <Calendar className="w-4 h-4 mr-2 text-dark-accent dark:text-dark-accent" />
          Entrada: {veiculo.dataEntrada}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-dark-muted">
          <Wrench className="w-4 h-4 mr-2 text-dark-accent dark:text-dark-accent" />
          Serviço: {veiculo.servico}
        </div>
      </div>
      
      {/* Action */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="w-full btn-primary"
      >
        Ver Detalhes
      </motion.button>
    </motion.div>
  );
}
```

---

## 🔍 Search Bar Premium

```jsx
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <motion.div
      animate={{
        scale: isFocused ? 1.02 : 1,
      }}
      className="relative"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-dark-muted" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Pesquisar..."
          className="input-macos pl-12 pr-12"
        />
        
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-dark-muted" />
          </motion.button>
        )}
      </div>
      
      {/* Glow effect quando focado */}
      {isFocused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-1 bg-dark-accent/20 dark:bg-dark-accent/20 rounded-xl blur-lg -z-10"
        />
      )}
    </motion.div>
  );
}
```

---

## 🎯 Dicas de Uso

### 1. Sempre use motion para interatividade
```jsx
<motion.div whileHover={{ y: -2 }}>
```

### 2. Combine classes para efeitos premium
```jsx
className="card-macos shadow-apple-lg"
```

### 3. Use gradientes para ícones
```jsx
className="bg-gradient-to-br from-dark-accent to-dark-purple"
```

### 4. Adicione dividers para separação
```jsx
<div className="divider-apple" />
```

### 5. Glassmorphism para destaque
```jsx
className="glass-apple"
```

---

## 🎨 Paleta Rápida

```jsx
// Backgrounds
bg-dark-bg          // #0C0D11
bg-dark-surface     // #14161D
bg-dark-card        // #181A20
bg-dark-elevated    // #1C1E26

// Texto
text-dark-text      // #E8E8EA
text-dark-muted     // #A7A8AE
text-dark-subtle    // #6E6F76

// Accent
text-dark-accent    // #0A84FF
bg-dark-accent      // #0A84FF
```

---

**Status**: ✅ Exemplos Prontos para Uso
**Copie e Cole**: Adapte conforme necessário
**Documentação**: Consulte TEMA_APPLE_PREMIUM_DARK.md para mais detalhes
