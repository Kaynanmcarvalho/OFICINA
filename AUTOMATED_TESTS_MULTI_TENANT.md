# 🧪 Testes Automatizados - Sistema Multi-Tenant

## 📋 Suite de Testes Completa

Execute estes testes antes de fazer deploy em produção.

---

## 🔒 Testes de Segurança

### Test 1: Isolamento de Dados Entre Empresas

```javascript
// tests/security/isolation.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

describe('Data Isolation Between Companies', () => {
  let empresaA, empresaB;

  beforeEach(() => {
    empresaA = 'test-empresa-a';
    empresaB = 'test-empresa-b';
  });

  it('should NOT allow reading data from another company', async () => {
    // Login como empresa A
    sessionStorage.setItem('empresaId', empresaA);

    // Tentar ler dados da empresa B
    const ref = collection(db, `empresas/${empresaB}/clientes`);
    
    await expect(getDocs(ref)).rejects.toThrow('permission-denied');
  });

  it('should NOT allow creating documents with wrong empresaId', async () => {
    // Login como empresa A
    sessionStorage.setItem('empresaId', empresaA);

    // Tentar criar documento com empresaId da empresa B
    const ref = collection(db, `empresas/${empresaA}/clientes`);
    
    await expect(
      addDoc(ref, {
        nome: 'Cliente Malicioso',
        empresaId: empresaB // ❌ Deve falhar
      })
    ).rejects.toThrow('permission-denied');
  });

  it('should allow reading own company data', async () => {
    // Login como empresa A
    sessionStorage.setItem('empresaId', empresaA);

    // Ler dados da própria empresa
    const ref = collection(db, `empresas/${empresaA}/clientes`);
    const snapshot = await getDocs(ref);

    expect(snapshot).toBeDefined();
    expect(snapshot.docs).toBeInstanceOf(Array);
  });
});
```

---

### Test 2: Validação de empresaId

```javascript
// tests/security/empresaId-validation.test.js
import { describe, it, expect } from 'vitest';
import { firestoreService } from '../services/firestoreService';

describe('EmpresaId Validation', () => {
  const maliciousIds = [
    '../../../etc/passwd',
    '<script>alert("xss")</script>',
    'empresa-a; DROP TABLE usuarios--',
    'empresa-a\x00empresa-b',
    '../../outras-empresas',
    'empresa-a\nempresa-b',
    'empresa-a\rempresa-b'
  ];

  maliciousIds.forEach(maliciousId => {
    it(`should reject malicious empresaId: ${maliciousId}`, () => {
      sessionStorage.setItem('empresaId', maliciousId);

      expect(() => {
        firestoreService.getEmpresaId();
      }).toThrow('empresaId com formato inválido');
    });
  });

  it('should accept valid empresaId', () => {
    const validIds = [
      'empresa-123',
      'empresa_abc',
      'EMPRESA-XYZ',
      'empresa123'
    ];

    validIds.forEach(validId => {
      sessionStorage.setItem('empresaId', validId);
      
      expect(() => {
        firestoreService.getEmpresaId();
      }).not.toThrow();
    });
  });
});
```

---

### Test 3: Unicode Injection em Placas

```javascript
// tests/security/unicode-injection.test.js
import { describe, it, expect } from 'vitest';
import { placaCacheService } from '../services/placaCacheService';

describe('Unicode Injection Prevention', () => {
  const maliciousPlates = [
    { input: 'АВС1234', expected: 'ABC1234' }, // А cirílico
    { input: 'ABC​1234', expected: 'ABC1234' }, // Zero-width space
    { input: 'ABC‮4321', expected: 'ABC4321' }, // RTL override
    { input: 'ABC\u200B1234', expected: 'ABC1234' }, // Zero-width space
    { input: 'ABC\uFEFF1234', expected: 'ABC1234' }, // Zero-width no-break
    { input: 'ＡＢＣ１２３４', expected: 'ABC1234' } // Fullwidth
  ];

  maliciousPlates.forEach(({ input, expected }) => {
    it(`should normalize ${input} to ${expected}`, () => {
      const normalized = placaCacheService.normalizarPlaca(input);
      expect(normalized).toBe(expected);
    });
  });

  it('should limit plate length to 10 characters', () => {
    const longPlate = 'ABCDEFGHIJKLMNOP';
    const normalized = placaCacheService.normalizarPlaca(longPlate);
    
    expect(normalized.length).toBeLessThanOrEqual(10);
  });
});
```

---

### Test 4: XSS via CSS Injection

```javascript
// tests/security/xss-prevention.test.js
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EmpresaProvider } from '../contexts/EmpresaContext';

describe('XSS Prevention in Theme', () => {
  const maliciousThemes = [
    {
      corPrimaria: 'red; background: url("http://evil.com/steal")',
      expected: '#000000'
    },
    {
      corPrimaria: 'expression(alert("xss"))',
      expected: '#000000'
    },
    {
      corPrimaria: '@import url("evil.css")',
      expected: '#000000'
    },
    {
      corPrimaria: 'javascript:alert("xss")',
      expected: '#000000'
    }
  ];

  maliciousThemes.forEach(({ corPrimaria, expected }) => {
    it(`should sanitize malicious color: ${corPrimaria}`, () => {
      // Mock tema malicioso
      const tema = { corPrimaria };
      
      // Renderizar com tema
      const { container } = render(
        <EmpresaProvider>
          <div>Test</div>
        </EmpresaProvider>
      );

      // Verificar que cor foi sanitizada
      const root = document.documentElement;
      const appliedColor = root.style.getPropertyValue('--color-primary');
      
      expect(appliedColor).toBe(expected);
    });
  });

  it('should accept valid hex colors', () => {
    const validColors = ['#FF0000', '#00FF00', '#0000FF', '#FFF', '#000'];

    validColors.forEach(color => {
      const tema = { corPrimaria: color };
      
      render(
        <EmpresaProvider>
          <div>Test</div>
        </EmpresaProvider>
      );

      const root = document.documentElement;
      const appliedColor = root.style.getPropertyValue('--color-primary');
      
      expect(appliedColor).toBe(color);
    });
  });
});
```

---

## 🚀 Testes de Performance

### Test 5: Memory Leak no Cache

```javascript
// tests/performance/cache-memory.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { placaCacheService } from '../services/placaCacheService';

describe('Cache Memory Management', () => {
  beforeEach(() => {
    placaCacheService.clearLocalCache();
  });

  it('should limit cache size to MAX_CACHE_SIZE', async () => {
    const MAX_SIZE = 500;

    // Adicionar 1000 placas
    for (let i = 0; i < 1000; i++) {
      const placa = `ABC${i.toString().padStart(4, '0')}`;
      await placaCacheService.consultarPlaca(placa, async () => ({
        marca: 'Test',
        modelo: 'Test',
        ano: '2020'
      }));
    }

    const stats = placaCacheService.getLocalCacheStats();
    
    expect(stats.size).toBeLessThanOrEqual(MAX_SIZE);
  });

  it('should expire cache after TTL', async () => {
    const placa = 'ABC1234';
    
    // Adicionar ao cache
    await placaCacheService.consultarPlaca(placa, async () => ({
      marca: 'Test',
      modelo: 'Test',
      ano: '2020'
    }));

    // Verificar que está no cache
    let cached = await placaCacheService.buscarNoCache(placa);
    expect(cached).toBeDefined();

    // Simular passagem de tempo (24h + 1ms)
    const TTL = 24 * 60 * 60 * 1000;
    jest.advanceTimersByTime(TTL + 1);

    // Verificar que expirou
    cached = await placaCacheService.buscarNoCache(placa);
    expect(cached).toBeNull();
  });

  it('should use FIFO when cache is full', async () => {
    const MAX_SIZE = 500;

    // Adicionar MAX_SIZE placas
    for (let i = 0; i < MAX_SIZE; i++) {
      const placa = `ABC${i.toString().padStart(4, '0')}`;
      await placaCacheService.consultarPlaca(placa, async () => ({
        marca: 'Test',
        modelo: 'Test'
      }));
    }

    const firstPlaca = 'ABC0000';
    
    // Verificar que primeira placa está no cache
    let cached = await placaCacheService.buscarNoCache(firstPlaca);
    expect(cached).toBeDefined();

    // Adicionar mais uma placa (deve remover a primeira)
    await placaCacheService.consultarPlaca('XYZ9999', async () => ({
      marca: 'Test',
      modelo: 'Test'
    }));

    // Verificar que primeira placa foi removida
    cached = await placaCacheService.buscarNoCache(firstPlaca);
    expect(cached).toBeNull();
  });
});
```

---

### Test 6: Firestore Query Performance

```javascript
// tests/performance/firestore-queries.test.js
import { describe, it, expect } from 'vitest';
import { firestoreService } from '../services/firestoreService';

describe('Firestore Query Performance', () => {
  it('should complete query in less than 500ms', async () => {
    const startTime = Date.now();
    
    await firestoreService.getAll('clientes', {
      limit: 50,
      orderBy: { field: 'createdAt', direction: 'desc' }
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(500);
  });

  it('should use empresaId in all queries', async () => {
    const spy = jest.spyOn(firestoreService, 'getCollectionPath');
    
    await firestoreService.getAll('clientes');
    
    expect(spy).toHaveBeenCalled();
    const path = spy.mock.results[0].value;
    expect(path).toMatch(/^empresas\/[^/]+\/clientes$/);
  });
});
```

---

## 🎯 Testes de Integração

### Test 7: Login Flow Completo

```javascript
// tests/integration/login-flow.test.js
import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import App from '../App';

describe('Complete Login Flow', () => {
  it('should load empresa data after login', async () => {
    // Mock login
    const mockUser = {
      uid: 'test-user-123',
      email: 'test@example.com'
    };

    // Mock Firestore responses
    const mockUserData = {
      empresaId: 'test-empresa',
      role: 'admin',
      nome: 'Test User'
    };

    const mockEmpresaData = {
      nomeFantasia: 'Test Company',
      plano: 'premium',
      ativo: true
    };

    // Render app
    const { getByText } = render(<App />);

    // Fazer login
    await signInWithEmailAndPassword(auth, 'test@example.com', 'password');

    // Aguardar carregamento da empresa
    await waitFor(() => {
      expect(sessionStorage.getItem('empresaId')).toBe('test-empresa');
    });

    // Verificar que empresa foi carregada
    expect(getByText('Test Company')).toBeInTheDocument();
  });

  it('should block access if empresa is inactive', async () => {
    // Mock empresa inativa
    const mockEmpresaData = {
      nomeFantasia: 'Inactive Company',
      plano: 'premium',
      ativo: false
    };

    // Tentar fazer login
    await expect(
      signInWithEmailAndPassword(auth, 'test@example.com', 'password')
    ).rejects.toThrow('Empresa desativada');

    // Verificar que empresaId foi removido
    expect(sessionStorage.getItem('empresaId')).toBeNull();
  });
});
```

---

### Test 8: Permission Guard

```javascript
// tests/integration/permission-guard.test.js
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PermissionGuard } from '../components/PermissionGuard';
import { EmpresaProvider } from '../contexts/EmpresaContext';

describe('Permission Guard', () => {
  it('should show content for admin', () => {
    // Mock empresa data com role admin
    const mockEmpresaData = {
      role: 'admin',
      permissoes: []
    };

    const { getByText } = render(
      <EmpresaProvider value={mockEmpresaData}>
        <PermissionGuard requiredRole="admin">
          <div>Admin Content</div>
        </PermissionGuard>
      </EmpresaProvider>
    );

    expect(getByText('Admin Content')).toBeInTheDocument();
  });

  it('should hide content for non-admin', () => {
    // Mock empresa data com role atendente
    const mockEmpresaData = {
      role: 'atendente',
      permissoes: []
    };

    const { queryByText } = render(
      <EmpresaProvider value={mockEmpresaData}>
        <PermissionGuard requiredRole="admin">
          <div>Admin Content</div>
        </PermissionGuard>
      </EmpresaProvider>
    );

    expect(queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('should show fallback for unauthorized users', () => {
    const mockEmpresaData = {
      role: 'atendente',
      permissoes: []
    };

    const { getByText } = render(
      <EmpresaProvider value={mockEmpresaData}>
        <PermissionGuard 
          requiredRole="admin"
          fallback={<div>Access Denied</div>}
        >
          <div>Admin Content</div>
        </PermissionGuard>
      </EmpresaProvider>
    );

    expect(getByText('Access Denied')).toBeInTheDocument();
  });
});
```

---

## 🏃 Executar Testes

### Configuração

```bash
# Instalar dependências de teste
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Configurar vitest.config.js
```

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js'
      ]
    }
  }
});
```

### Executar

```bash
# Todos os testes
npm run test

# Apenas testes de segurança
npm run test tests/security

# Apenas testes de performance
npm run test tests/performance

# Com coverage
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

---

## 📊 Cobertura Esperada

### Mínimo Aceitável
- ✅ Segurança: 100%
- ✅ Isolamento: 100%
- ✅ Validação: 100%
- ⚠️ Performance: 80%
- ⚠️ Integração: 70%
- ⚠️ E2E: 50%

### Ideal
- ✅ Todas as categorias: 90%+

---

## ✅ Checklist de Testes

Antes de fazer deploy:

- [ ] Todos os testes de segurança passando
- [ ] Todos os testes de isolamento passando
- [ ] Testes de validação passando
- [ ] Testes de performance dentro dos limites
- [ ] Testes de integração passando
- [ ] Coverage mínimo de 80% alcançado
- [ ] Testes executados no Firebase Emulator
- [ ] Testes executados em ambiente de staging
- [ ] Documentação de testes atualizada

---

## 🐛 Troubleshooting

### Testes falhando com "permission-denied"

**Causa**: Custom claims não configurados

**Solução**:
```bash
# Executar testes no emulator
firebase emulators:start

# Configurar custom claims no emulator
# Ver SETUP_CUSTOM_CLAIMS.md
```

### Testes de performance lentos

**Causa**: Firestore indexes não criados

**Solução**:
```bash
# Deploy indexes
firebase deploy --only firestore:indexes

# Aguardar criação (pode levar minutos)
```

### Memory leak tests falhando

**Causa**: Jest timers não configurados

**Solução**:
```javascript
// No início do teste
jest.useFakeTimers();

// No final do teste
jest.useRealTimers();
```

---

**Última atualização**: 2024-01-XX
**Versão**: 1.0.0
**Próxima revisão**: Após cada deploy
