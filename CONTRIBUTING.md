# 🤝 Guia de Contribuição - TORQ AI

Obrigado por considerar contribuir com o TORQ AI! Este documento fornece diretrizes para contribuir com o projeto.

---

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Contribuir](#como-contribuir)
3. [Padrões de Código](#padrões-de-código)
4. [Processo de Pull Request](#processo-de-pull-request)
5. [Testes](#testes)
6. [Documentação](#documentação)
7. [Comunicação](#comunicação)

---

## 📜 Código de Conduta

### Nossos Compromissos

- Ser respeitoso e inclusivo
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros

### Comportamentos Inaceitáveis

- Uso de linguagem ou imagens sexualizadas
- Trolling, insultos ou comentários depreciativos
- Assédio público ou privado
- Publicar informações privadas de terceiros
- Outras condutas antiéticas ou não profissionais

---

## 🚀 Como Contribuir

### 1. Encontre uma Issue

- Procure por issues com label `good first issue` ou `help wanted`
- Comente na issue que deseja trabalhar nela
- Aguarde aprovação antes de começar

### 2. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/torq-ai.git
cd torq-ai

# Adicione o repositório original como upstream
git remote add upstream https://github.com/torq-ai/torq-ai.git
```

### 3. Crie uma Branch

```bash
# Atualize sua branch main
git checkout main
git pull upstream main

# Crie uma nova branch
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 4. Faça suas Alterações

- Siga os [Padrões de Código](#padrões-de-código)
- Escreva testes para novas funcionalidades
- Atualize a documentação conforme necessário
- Commit suas mudanças seguindo [Conventional Commits](#conventional-commits)

### 5. Teste suas Alterações

```bash
# Execute os testes
npm test

# Execute o linter
npm run lint

# Execute o type check
npm run type-check
```

### 6. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/nome-da-feature

# Abra um Pull Request no GitHub
```

---

## 💻 Padrões de Código

### JavaScript/TypeScript

#### Estilo de Código

```javascript
// ✅ BOM
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// ❌ RUIM
function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}
```

#### Naming Conventions

```javascript
// Componentes: PascalCase
const UserProfile = () => {};

// Funções e variáveis: camelCase
const getUserData = () => {};
const userName = 'John';

// Constantes: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Arquivos de componentes: PascalCase.jsx
// UserProfile.jsx

// Arquivos de serviços: camelCase.js
// userService.js
```

#### Comentários

```javascript
/**
 * Calcula o total de um orçamento
 * 
 * @param {Array} items - Lista de itens do orçamento
 * @param {Object} options - Opções de cálculo
 * @returns {number} Total calculado
 */
const calculateBudgetTotal = (items, options = {}) => {
  // Implementação
};
```

### React

#### Componentes Funcionais

```javascript
// ✅ BOM
import React, { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser(userId);
  }, [userId]);

  const loadUser = async (id) => {
    setLoading(true);
    try {
      const data = await fetchUser(id);
      setUser(data);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!user) return <NotFound />;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
};

export default UserProfile;
```

#### Hooks Customizados

```javascript
// ✅ BOM
import { useState, useEffect } from 'react';

export const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUser(userId);
      setUser(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, reload: loadUser };
};
```

### CSS/Tailwind

```jsx
// ✅ BOM - Tailwind com dark mode
<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Título
  </h2>
  <p className="text-gray-600 dark:text-gray-400">
    Descrição
  </p>
</div>

// ❌ RUIM - Inline styles
<div style={{ background: 'white', padding: '16px' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
    Título
  </h2>
</div>
```

---

## 🔄 Processo de Pull Request

### Checklist

Antes de abrir um PR, certifique-se de que:

- [ ] O código segue os padrões do projeto
- [ ] Todos os testes passam (`npm test`)
- [ ] Novos testes foram adicionados para novas funcionalidades
- [ ] A documentação foi atualizada
- [ ] O código foi revisado por você mesmo
- [ ] Commits seguem Conventional Commits
- [ ] A branch está atualizada com main

### Template de PR

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots (se aplicável)
![Screenshot](url)

## Checklist
- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Code review feito
```

### Conventional Commits

```bash
# Formato
<type>(<scope>): <subject>

# Tipos
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Documentação
style:    Formatação
refactor: Refatoração
test:     Testes
chore:    Manutenção

# Exemplos
feat(auth): add login with Google
fix(budget): correct margin calculation
docs(readme): update installation steps
style(button): improve hover effect
refactor(api): simplify error handling
test(user): add unit tests for user service
chore(deps): update dependencies
```

---

## 🧪 Testes

### Estrutura de Testes

```
tests/
├── unit/              # Testes unitários
│   ├── services/
│   ├── utils/
│   └── hooks/
├── integration/       # Testes de integração
│   ├── api/
│   └── database/
└── e2e/              # Testes end-to-end
    ├── auth/
    ├── budget/
    └── checkin/
```

### Escrevendo Testes

```javascript
// tests/unit/userService.test.js
import { describe, it, expect, beforeEach } from '@jest/globals';
import { UserService } from '../../src/services/userService';

describe('UserService', () => {
  let service;

  beforeEach(() => {
    service = new UserService();
  });

  describe('getUser', () => {
    it('should return user data', async () => {
      const user = await service.getUser('user123');
      expect(user).toBeDefined();
      expect(user.id).toBe('user123');
    });

    it('should throw error for invalid id', async () => {
      await expect(service.getUser('')).rejects.toThrow();
    });
  });
});
```

### Executando Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- userService

# Com coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 📚 Documentação

### Documentando Código

```javascript
/**
 * Calcula a margem de lucro de um item
 * 
 * @param {Object} item - Item do orçamento
 * @param {number} item.cost - Custo do item
 * @param {number} item.price - Preço de venda
 * @param {number} [item.quantity=1] - Quantidade
 * @returns {number} Margem em percentual
 * @throws {Error} Se cost ou price forem inválidos
 * 
 * @example
 * const margin = calculateMargin({ cost: 100, price: 150 });
 * // Returns: 33.33
 */
const calculateMargin = (item) => {
  // Implementação
};
```

### README de Funcionalidades

Cada funcionalidade deve ter um README com:

1. **Visão Geral**: O que a funcionalidade faz
2. **Instalação**: Como configurar
3. **Uso**: Exemplos de código
4. **API**: Referência completa
5. **Testes**: Como testar
6. **Troubleshooting**: Problemas comuns

---

## 💬 Comunicação

### Canais

- **GitHub Issues**: Bugs e feature requests
- **GitHub Discussions**: Perguntas e discussões
- **Discord**: Chat em tempo real
- **Email**: contato@torq.ai

### Reportando Bugs

Use o template de issue:

```markdown
## Descrição do Bug
Descrição clara e concisa do bug

## Passos para Reproduzir
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## Comportamento Esperado
O que deveria acontecer

## Comportamento Atual
O que está acontecendo

## Screenshots
Se aplicável

## Ambiente
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 96]
- Versão: [e.g. 2.1.0]

## Informações Adicionais
Qualquer outra informação relevante
```

### Sugerindo Features

```markdown
## Descrição da Feature
Descrição clara da funcionalidade

## Problema que Resolve
Qual problema esta feature resolve?

## Solução Proposta
Como você imagina que funcione?

## Alternativas Consideradas
Outras soluções que você pensou?

## Informações Adicionais
Mockups, exemplos, etc.
```

---

## 🎯 Áreas de Contribuição

### Frontend
- Componentes React
- Hooks customizados
- Estilos e animações
- Acessibilidade

### Backend
- Cloud Functions
- Serviços
- Integrações
- Performance

### IA/ML
- Modelos de detecção
- Processamento de linguagem
- Otimizações
- Datasets

### Documentação
- Guias de usuário
- Tutoriais
- API reference
- Traduções

### Testes
- Testes unitários
- Testes de integração
- Testes E2E
- Performance tests

---

## 🏆 Reconhecimento

Contribuidores são reconhecidos em:

- README.md (seção Contributors)
- CHANGELOG.md
- Release notes
- Hall of Fame no site

---

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT License).

---

## ❓ Dúvidas?

Se tiver dúvidas sobre como contribuir:

1. Leia a documentação completa
2. Procure em issues existentes
3. Pergunte no Discord
4. Envie email para contato@torq.ai

---

**Obrigado por contribuir com o TORQ AI! 🚀**

Juntos estamos transformando o mercado automotivo!
