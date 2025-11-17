# 🔒 Política de Segurança - TORQ AI

## 📋 Versões Suportadas

Atualmente, as seguintes versões do TORQ AI recebem atualizações de segurança:

| Versão | Suportada          |
| ------ | ------------------ |
| 2.1.x  | ✅ Sim             |
| 2.0.x  | ✅ Sim             |
| 1.x.x  | ⚠️ Suporte limitado |
| < 1.0  | ❌ Não             |

---

## 🚨 Reportando uma Vulnerabilidade

### Como Reportar

Se você descobrir uma vulnerabilidade de segurança, por favor **NÃO** abra uma issue pública. Em vez disso:

1. **Email**: Envie um email para security@torq.ai
2. **Assunto**: "SECURITY: [Breve descrição]"
3. **Conteúdo**: Inclua o máximo de detalhes possível

### Informações a Incluir

- Tipo de vulnerabilidade
- Localização do código afetado
- Passos para reproduzir
- Impacto potencial
- Sugestões de correção (se houver)

### O Que Esperar

- **Confirmação**: Resposta em até 48 horas
- **Avaliação**: Análise completa em até 7 dias
- **Correção**: Patch em até 30 dias (dependendo da severidade)
- **Divulgação**: Coordenada após correção

---

## 🛡️ Práticas de Segurança

### Autenticação e Autorização

#### Firebase Authentication
```javascript
// ✅ BOM - Verificar autenticação
const user = auth.currentUser;
if (!user) {
  throw new Error('Não autenticado');
}

// ❌ RUIM - Confiar em dados do cliente
const userId = request.body.userId; // Nunca confie nisso!
```

#### Firestore Security Rules
```javascript
// ✅ BOM - Regras estritas
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /budgets/{budgetId} {
      allow read: if request.auth != null 
        && request.auth.token.empresaId == resource.data.empresaId;
      allow write: if request.auth != null 
        && request.auth.token.empresaId == request.resource.data.empresaId;
    }
  }
}

// ❌ RUIM - Regras permissivas
allow read, write: if true; // NUNCA faça isso!
```

### Proteção de Dados

#### Dados Sensíveis
```javascript
// ✅ BOM - Criptografar dados sensíveis
import CryptoJS from 'crypto-js';

const encryptData = (data, key) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptData = (encryptedData, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// ❌ RUIM - Armazenar dados sensíveis em texto plano
localStorage.setItem('creditCard', '1234-5678-9012-3456'); // NUNCA!
```

#### Sanitização de Input
```javascript
// ✅ BOM - Sanitizar input
import DOMPurify from 'dompurify';

const sanitizedInput = DOMPurify.sanitize(userInput);

// ❌ RUIM - Usar input diretamente
element.innerHTML = userInput; // XSS vulnerability!
```

### API Security

#### Rate Limiting
```javascript
// ✅ BOM - Implementar rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições
});

app.use('/api/', limiter);
```

#### CORS
```javascript
// ✅ BOM - CORS configurado corretamente
const cors = require('cors');

app.use(cors({
  origin: ['https://torq.ai', 'https://app.torq.ai'],
  credentials: true
}));

// ❌ RUIM - CORS permissivo
app.use(cors({ origin: '*' })); // Evite em produção!
```

### Secrets Management

#### Variáveis de Ambiente
```javascript
// ✅ BOM - Usar variáveis de ambiente
const apiKey = process.env.OPENAI_API_KEY;

// ❌ RUIM - Hardcoded secrets
const apiKey = 'sk-1234567890abcdef'; // NUNCA!
```

#### .env.example
```bash
# ✅ Forneça um exemplo sem valores reais
OPENAI_API_KEY=your_openai_api_key_here
FIREBASE_API_KEY=your_firebase_api_key_here
```

---

## 🔐 Checklist de Segurança

### Para Desenvolvedores

- [ ] Nunca commitar secrets ou credenciais
- [ ] Sempre validar e sanitizar input do usuário
- [ ] Implementar autenticação e autorização adequadas
- [ ] Usar HTTPS em todas as comunicações
- [ ] Manter dependências atualizadas
- [ ] Revisar código para vulnerabilidades
- [ ] Implementar logging de segurança
- [ ] Testar para vulnerabilidades comuns (OWASP Top 10)

### Para Administradores

- [ ] Configurar Firestore Security Rules
- [ ] Habilitar 2FA para contas admin
- [ ] Monitorar logs de acesso
- [ ] Realizar backups regulares
- [ ] Implementar disaster recovery
- [ ] Revisar permissões de usuários
- [ ] Atualizar certificados SSL
- [ ] Configurar alertas de segurança

---

## 🚫 Vulnerabilidades Conhecidas

### Nenhuma Atualmente

Não há vulnerabilidades conhecidas na versão atual (2.1.0).

Histórico de vulnerabilidades corrigidas:
- Nenhuma até o momento

---

## 🔄 Atualizações de Segurança

### Como Manter-se Atualizado

1. **Watch no GitHub**: Receba notificações de releases
2. **Newsletter**: Inscreva-se em security@torq.ai
3. **RSS Feed**: Acompanhe o changelog

### Aplicando Atualizações

```bash
# Verificar versão atual
npm list torq-ai

# Atualizar para última versão
npm update torq-ai

# Ou instalar versão específica
npm install torq-ai@2.1.0
```

---

## 📚 Recursos de Segurança

### Documentação
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security](https://firebase.google.com/docs/rules)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

### Ferramentas
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [OWASP ZAP](https://www.zaproxy.org/)

### Treinamento
- [Web Security Academy](https://portswigger.net/web-security)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)

---

## 🏆 Programa de Recompensas

### Bug Bounty

Atualmente não temos um programa formal de bug bounty, mas reconhecemos e agradecemos contribuições de segurança:

- **Menção**: Crédito no CHANGELOG e SECURITY.md
- **Swag**: Camiseta e adesivos TORQ AI
- **Reconhecimento**: Hall of Fame no site

---

## 📞 Contato

### Equipe de Segurança

- **Email**: security@torq.ai
- **PGP Key**: [Link para chave pública]
- **Response Time**: 48 horas

### Emergências

Para vulnerabilidades críticas que estão sendo ativamente exploradas:

- **Email**: emergency@torq.ai
- **Telefone**: +55 11 9999-9999 (24/7)

---

## 📜 Política de Divulgação

### Divulgação Responsável

Seguimos o princípio de divulgação responsável:

1. **Descoberta**: Vulnerabilidade reportada
2. **Confirmação**: Equipe confirma e avalia
3. **Correção**: Patch desenvolvido e testado
4. **Release**: Atualização lançada
5. **Divulgação**: Detalhes publicados após 90 dias

### Créditos

Reconhecemos publicamente pesquisadores que reportam vulnerabilidades de forma responsável.

---

## ✅ Compliance

### Regulamentações

- **LGPD**: Lei Geral de Proteção de Dados (Brasil)
- **GDPR**: General Data Protection Regulation (EU)
- **PCI DSS**: Payment Card Industry Data Security Standard

### Certificações

- [ ] ISO 27001 (em progresso)
- [ ] SOC 2 Type II (planejado)

---

## 📊 Métricas de Segurança

### Tempo de Resposta

| Severidade | Tempo de Resposta | Tempo de Correção |
|------------|-------------------|-------------------|
| Crítica    | < 24h             | < 7 dias          |
| Alta       | < 48h             | < 14 dias         |
| Média      | < 7 dias          | < 30 dias         |
| Baixa      | < 14 dias         | < 90 dias         |

### Estatísticas

- **Vulnerabilidades Reportadas**: 0
- **Vulnerabilidades Corrigidas**: 0
- **Tempo Médio de Correção**: N/A
- **Última Auditoria**: 17/01/2025

---

**Última Atualização**: 17 de Janeiro de 2025  
**Versão**: 2.1.0  
**Mantido por**: Torq AI Security Team  

**SEGURANÇA É PRIORIDADE! 🔒🛡️**
