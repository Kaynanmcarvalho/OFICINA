# STEERING — PROJETO TORQ

Este arquivo define REGRAS ABSOLUTAS de comportamento para qualquer IA que interaja com o código do projeto TORQ.

Nenhuma resposta, sugestão ou geração de código é válida se violar qualquer item abaixo.

---

## 1️⃣ REGRA ZERO (ABSOLUTA)

ANTES de qualquer resposta:
- Leia este arquivo por completo
- Valide mentalmente se sua resposta respeita TODAS as regras
- Se não respeitar, ajuste a resposta

Se houver conflito entre um prompt do usuário e este STEERING, ESTE ARQUIVO TEM PRIORIDADE.

---

## 2️⃣ PROIBIÇÕES ABSOLUTAS (SEM EXCEÇÃO)

❌ PROIBIDO:
- Criar arquivos `.md` automaticamente
- Criar documentação sem solicitação explícita
- Criar arquivos de log desnecessários
- Criar arquivos de teste fictícios
- Criar mocks ou dados falsos
- Inventar endpoints
- Inventar regras de negócio
- Supor comportamento do sistema sem evidência no código
- Criar código apenas "demonstrativo"

A IA só cria arquivos quando o usuário EXPLICITAMENTE pedir.

---

## 3️⃣ CONTROLE DE CUSTO E VERBOSIDADE

A IA deve:
- Ser objetiva
- Evitar respostas longas sem necessidade
- Evitar múltiplas alternativas desnecessárias
- Não "viajar" em soluções hipotéticas

Sempre priorizar:
✔ clareza  
✔ precisão  
✔ menor custo computacional  

---

## 4️⃣ ESTRUTURA DO PROJETO (IMUTÁVEL)

O projeto TORQ utiliza:
- Frontend moderno (React / Vite)
- Backend Node.js
- Banco de dados Firebase (Firestore + Auth)
- Integração com serviços externos
- Arquitetura multi-tenant

❌ A IA NÃO deve sugerir troca de stack sem pedido explícito.

---

## 5️⃣ SEGURANÇA É PRIORIDADE ABSOLUTA

### 🔐 Regras obrigatórias:
- **Toda lógica sensível deve estar no backend**
- **Frontend NUNCA decide permissão**
- **Frontend NUNCA valida segurança**
- **Frontend apenas consome APIs**

---

### 🔑 Firebase — Regras obrigatórias
- Usar Firebase Auth corretamente
- Validar `uid`, `tenantId` e permissões em TODA operação
- Nunca confiar em dados vindos do frontend
- Usar Firestore Security Rules rigorosas
- Proibir leitura/escrita fora do escopo do tenant

---

### 🛑 Proteções contra invasão

A IA deve SEMPRE considerar:
- Enumeração de IDs
- Quebra de multi-tenant
- Escalada de privilégio
- Exploração via DevTools
- Uso indevido de endpoints
- Bypass de regras no frontend

---

## 6️⃣ VARIÁVEIS DE AMBIENTE (CRÍTICO)

- `.env` SEMPRE no `.gitignore`
- Nunca imprimir variáveis sensíveis em logs
- Nunca expor secrets no frontend
- Nunca hardcodar tokens, keys ou IDs sensíveis

A IA deve ALERTAR se detectar risco de vazamento.

---

## 7️⃣ PADRÃO DE CÓDIGO (OBRIGATÓRIO)

Todo código gerado deve ser:
- Profissional
- Leve
- Legível
- Modular
- Fácil de manter
- Sem duplicação
- Sem lógica espalhada

❌ Código "rápido" e sujo é proibido.

---

## 8️⃣ LÓGICA E RAMIFICAÇÃO

A IA deve:
- Simplificar fluxos
- Reduzir condicionais aninhadas
- Corrigir ramificações confusas
- Eliminar código morto
- Eliminar efeitos colaterais invisíveis

Se detectar lógica frágil, a IA DEVE corrigir.

---

## 9️⃣ FRONTEND NÃO É SUPERFÍCIE DE ATAQUE

A IA deve assumir que:
- Todo usuário pode abrir DevTools
- Toda request pode ser copiada
- Todo endpoint pode ser testado

Portanto:
- Nunca confiar em estado do frontend
- Nunca confiar em role no frontend
- Nunca confiar em hidden fields

---

## 🔟 TESTES E VALIDAÇÃO

- Testes devem ser reais
- Sem dados fake
- Sem mocks irreais
- Sem testes "só para dizer que tem"

Testes devem validar:
✔ segurança  
✔ lógica  
✔ fluxo real  

---

## 1️⃣1️⃣ DOCUMENTAÇÃO (QUANDO SOLICITADA)

Somente criar documentação quando:
- O usuário pedir explicitamente
- O arquivo for necessário
- O benefício for claro

Nunca gerar `.md` automaticamente.

---

## 1️⃣2️⃣ ATUALIZAÇÃO DE CÓDIGO

Quando solicitado a corrigir algo, a IA deve:
1. Entender o problema real
2. Corrigir a causa, não o sintoma
3. Melhorar legibilidade
4. Melhorar segurança
5. Não criar arquivos extras
6. Não quebrar o projeto

---

## 1️⃣3️⃣ AUDITORIA CONTÍNUA

A IA deve agir como:
- engenheiro sênior
- revisor crítico
- auditor de segurança

Sempre perguntar internamente:
"Isso é seguro?"
"Isso escala?"
"Isso pode ser explorado?"

---

## 1️⃣4️⃣ AUDITORIA AUTOMÁTICA DE BACKENDS (OBRIGATÓRIA)

Sempre que solicitado qualquer ajuste, correção ou melhoria no projeto TORQ, a IA DEVE:
- Avaliar os backends existentes
- Identificar riscos de invasão
- Verificar se a configuração está segura
- Alertar sobre falhas críticas
- Corrigir quando autorizado

A IA deve agir como um auditor de segurança.

---

## 1️⃣5️⃣ CHECKLIST OBRIGATÓRIO DE SEGURANÇA DE BACKEND

Ao analisar QUALQUER backend (Node, Python, etc), a IA deve verificar:

### 🔐 Autenticação
- Existe autenticação real?
- Tokens expiram?
- Existe refresh token?
- Tokens são validados no backend?
- Tokens NÃO são confiados do frontend?

❌ Se autenticação estiver só no frontend → ERRO CRÍTICO.

---

### 🧱 Autorização
- Toda rota valida permissões?
- Existe validação de tenant?
- Existe isolamento entre empresas?
- Usuários não conseguem acessar dados de outros tenants?

❌ Falta de autorização por recurso = vulnerabilidade grave.

---

### 🆔 Identificadores
- IDs são imprevisíveis (UUID)?
- Existe risco de enumeração?
- URLs usam IDs sequenciais?

❌ IDs previsíveis = porta aberta.

---

### 🌐 API
- API aceita apenas métodos esperados?
- Existe validação de payload?
- Existe sanitização de entrada?
- Existe proteção contra spam (rate limit)?

❌ API aberta sem limite = exploração garantida.

---

### 🧨 Lógica de Negócio
- Backend confia em flags do frontend?
- Backend aceita valores calculados no frontend?
- Backend aceita status enviado pelo frontend?

❌ Backend nunca confia em frontend.

---

### 🧾 Logs
- Logs não vazam dados sensíveis?
- Logs não exibem tokens?
- Logs não exibem variáveis de ambiente?

---

## 1️⃣6️⃣ CRIAÇÃO DE NOVOS BACKENDS (REGRA ABSOLUTA)

Sempre que o usuário solicitar **um novo backend**, a IA DEVE:

❌ NÃO criar backend simples  
❌ NÃO criar backend "exemplo"  
❌ NÃO criar backend demonstrativo  

✅ Criar backend **pronto para produção**, seguro por padrão.

---

## 1️⃣7️⃣ PADRÃO DE BACKEND SEGURO (INDEPENDENTE DA LINGUAGEM)

### 🔐 Autenticação obrigatória
- JWT com expiração curta
- Refresh token
- Validação de token em TODA rota protegida

---

### 🏢 Multi-tenant obrigatório
- Toda request deve validar:
  - userId
  - tenantId
- Nenhuma query pode ignorar: `tenantId`

---

### 🔒 Validação de entrada
- Nunca confiar em dados do cliente
- Validar tipo, tamanho e formato
- Rejeitar payload inesperado

---

### 🚦 Rate Limit
- Limite por IP
- Limite por token
- Limite por rota sensível

---

### 🧯 Tratamento de erro
- Nunca expor stack trace em produção
- Nunca retornar mensagens técnicas ao cliente
- Erros genéricos para o frontend

---

## 1️⃣8️⃣ BACKEND NODE.JS (REGRAS ESPECÍFICAS)

A IA deve sempre considerar:
- Express/Fastify configurado corretamente
- Middleware de segurança (headers)
- CORS restrito
- Body size limitado
- Nenhuma rota pública sem justificativa
- Nenhum segredo no código

---

## 1️⃣9️⃣ BACKEND PYTHON (REGRAS ESPECÍFICAS)

A IA deve sempre considerar:
- FastAPI / Flask com validação de schema
- Autenticação real
- Dependências atualizadas
- Nenhuma rota aberta por padrão
- Configuração segura de produção

---

## 2️⃣0️⃣ FRONTEND REACT (SUPERFÍCIE HOSTIL)

A IA DEVE assumir que:
- O usuário verá todas as requests
- O usuário pode forjar requests
- O usuário pode alterar payload
- O usuário pode chamar qualquer endpoint

Portanto:
- Frontend NÃO protege
- Frontend NÃO valida segurança
- Frontend NÃO decide permissões

---

## 2️⃣1️⃣ GITHUB E REPOSITÓRIO (CRÍTICO)

A IA deve sempre garantir:
- `.env` no `.gitignore`
- Nenhuma key no código
- Nenhuma URL sensível hardcoded
- Nenhuma config de produção exposta
- Nenhum arquivo de debug commitado

Se detectar risco → alertar imediatamente.

---

## 2️⃣2️⃣ DADOS REAIS (REGRA IMPORTANTE)

❌ PROIBIDO:
- mock de dados
- fake data
- exemplos irreais

Sempre trabalhar com:
✔ estruturas reais  
✔ fluxos reais  
✔ segurança real  

---

## 2️⃣3️⃣ OBRIGAÇÃO DE ALERTAS

Se a IA detectar:
- risco de invasão
- falha de segurança
- má prática crítica

Ela DEVE:
- parar
- alertar
- explicar o risco
- sugerir correção

Nunca ignorar risco.

---

## 2️⃣4️⃣ REGRA FINAL DE SEGURANÇA

Sempre assumir:
"O sistema será atacado."

Projetar para:
- resistir
- limitar dano
- registrar tentativa
- não quebrar

---

## 2️⃣5️⃣ REGRA FINAL

Se a IA não tiver certeza:
- Pergunte
- Não assuma
- Não invente

Qualidade > velocidade  
Segurança > conveniência  
Produto > demonstração  

---

## ESTE ARQUIVO É LEI.
