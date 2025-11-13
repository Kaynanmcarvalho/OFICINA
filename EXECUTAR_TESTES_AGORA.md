# 🚀 EXECUTAR TESTES - GUIA RÁPIDO

## ⚡ SETUP INICIAL (Uma vez)

### 1. Instalar Dependências

```bash
npm install
```

Isso instalará:
- `vitest` - Framework de testes unitários
- `@testing-library/react` - Testes de componentes React
- `@testing-library/jest-dom` - Matchers customizados
- `@vitest/coverage-v8` - Relatórios de cobertura
- `cypress` - Testes E2E
- `cypress-file-upload` - Upload de arquivos no Cypress
- `jsdom` - Ambiente DOM para testes
- `@firebase/rules-unit-testing` - Testes com Firebase Emulator

---

## 🧪 EXECUTAR TESTES UNITÁRIOS

### Opção 1: Executar Todos

```bash
npm run test:unit
```

### Opção 2: Modo Watch (Recomendado para desenvolvimento)

```bash
npm run test:watch
```

### Opção 3: Com Coverage

```bash
npm run test:coverage
```

Depois abra o relatório:
```bash
# Windows
start coverage/index.html

# Mac
open coverage/index.html

# Linux
xdg-open coverage/index.html
```

### Opção 4: Teste Específico

```bash
npm run test:unit -- diagnosisService.test.js
```

---

## 🔗 EXECUTAR TESTES DE INTEGRAÇÃO

### Passo 1: Iniciar Firebase Emulator

```bash
# Terminal 1
firebase emulators:start --only firestore,storage
```

Aguarde até ver:
```
✔  All emulators ready! It is now safe to connect your app.
┌─────────────┬────────────────┬─────────────────────────────────┐
│ Emulator    │ Host:Port      │ View in Emulator UI             │
├─────────────┼────────────────┼─────────────────────────────────┤
│ Firestore   │ localhost:8080 │ http://localhost:4000/firestore │
│ Storage     │ localhost:9199 │ http://localhost:4000/storage   │
└─────────────┴────────────────┴─────────────────────────────────┘
```

### Passo 2: Executar Testes

```bash
# Terminal 2
npm run test:integration
```

---

## 🌐 EXECUTAR TESTES E2E (Cypress)

### Passo 1: Iniciar Aplicação

```bash
# Terminal 1
npm run dev
```

Aguarde até ver:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.x:5173/
```

### Passo 2: Executar Cypress

#### Opção A: Modo Interativo (Recomendado)

```bash
# Terminal 2
npm run test:e2e
```

Isso abrirá a interface do Cypress. Clique em "E2E Testing" e depois em "diagnosis.cy.js".

#### Opção B: Modo Headless (CI/CD)

```bash
# Terminal 2
npm run test:e2e:headless
```

---

## 🎯 EXECUTAR TODOS OS TESTES

```bash
# 1. Iniciar Firebase Emulator (Terminal 1)
firebase emulators:start --only firestore,storage

# 2. Iniciar aplicação (Terminal 2)
npm run dev

# 3. Executar todos os testes (Terminal 3)
npm run test:all
```

Ou usar o script helper:

```bash
# Windows
.\run-all-tests.bat

# Mac/Linux
./run-all-tests.sh
```

---

## 📊 VERIFICAR RESULTADOS

### Unit Tests

```
✓ tests/unit/diagnosisService.test.js (18)
  ✓ createDiagnosis (3)
  ✓ uploadImage (3)
  ✓ getDiagnosis (2)
  ✓ updateDiagnosisStatus (2)
  ✓ calculateSummary (2)
  ✓ getDamageDescription (2)
  ✓ getSeverityColor (2)
  ✓ validateImageFile (4)
  ✓ compressImage (2)

Test Files  1 passed (1)
     Tests  18 passed (18)
  Start at  10:30:00
  Duration  2.45s
```

### Coverage Report

```
File                          | % Stmts | % Branch | % Funcs | % Lines
------------------------------|---------|----------|---------|--------
All files                     |   85.23 |    78.45 |   82.67 |   85.23
 services/diagnosisService.js |   92.15 |    85.71 |   90.00 |   92.15
 hooks/useDiagnosis.js        |   78.45 |    70.00 |   75.00 |   78.45
```

### E2E Tests

```
  (Run Finished)

       Spec                                              Tests  Passing  Failing  Pending  Skipped
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  diagnosis.cy.js                          00:45        11       11        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:45        11       11        -        -        -
```

---

## 🐛 TROUBLESHOOTING

### Problema: "Cannot find module"

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problema: Firebase Emulator não inicia

```bash
# Verificar se portas estão livres
# Windows
netstat -ano | findstr :8080
netstat -ano | findstr :9199

# Mac/Linux
lsof -i :8080
lsof -i :9199

# Matar processo se necessário
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

### Problema: Cypress não encontra elementos

```bash
# Verificar se app está rodando
curl http://localhost:5173

# Se não estiver, iniciar:
npm run dev
```

### Problema: Testes falhando aleatoriamente

```bash
# Aumentar timeouts
# Editar vitest.config.js:
test: {
  testTimeout: 30000,
  hookTimeout: 30000,
}

# Editar cypress.config.js:
defaultCommandTimeout: 20000,
```

---

## ✅ CHECKLIST PRÉ-COMMIT

Antes de fazer commit, execute:

```bash
# 1. Lint
npm run lint

# 2. Testes unitários
npm run test:unit

# 3. Coverage (deve ser > 80%)
npm run test:coverage

# 4. Build
npm run build
```

Se tudo passar, pode fazer commit!

---

## 📝 ADICIONAR NOVOS TESTES

### Unit Test

```javascript
// tests/unit/myService.test.js
import { describe, it, expect } from 'vitest';
import { myService } from '../../src/services/myService';

describe('myService', () => {
  it('should do something', () => {
    const result = myService.doSomething();
    expect(result).toBe('expected');
  });
});
```

### E2E Test

```javascript
// cypress/e2e/myFeature.cy.js
describe('My Feature', () => {
  it('should work', () => {
    cy.visit('/my-page');
    cy.get('[data-testid="my-button"]').click();
    cy.get('[data-testid="result"]').should('contain', 'Success');
  });
});
```

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Executar testes localmente**
   ```bash
   npm run test:all
   ```

2. ✅ **Verificar coverage**
   ```bash
   npm run test:coverage
   open coverage/index.html
   ```

3. ✅ **Configurar CI/CD**
   - Adicionar GitHub Actions workflow
   - Configurar Codecov

4. ✅ **Adicionar mais testes**
   - Testes de performance
   - Testes de acessibilidade
   - Testes de segurança

---

**Data**: 2025-01-13
**Status**: ✅ PRONTO PARA EXECUTAR
**Tempo estimado**: 5-10 minutos para setup + execução
