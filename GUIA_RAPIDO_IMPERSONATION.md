# 🎭 Guia Rápido - Impersonation para Super Admins

## 🚀 Como Usar em 3 Passos

### 1️⃣ Acesse o Dashboard Admin
```
http://localhost:5173/admin/dashboard
```

### 2️⃣ Entre como Empresa
1. Encontre a empresa desejada na lista
2. Clique no menu (⋮) no canto direito do card
3. Clique em **"🎭 Entrar como Empresa"**
4. Aguarde o carregamento (2-3 segundos)

### 3️⃣ Navegue Livremente
- ✅ Acesse qualquer página do sistema
- ✅ Veja os dados REAIS da empresa
- ✅ Crie, edite ou delete registros
- ✅ Teste funcionalidades
- ✅ Banner roxo no topo indica que você está em modo impersonation

### 4️⃣ Volte ao Admin
- Clique em **"Voltar ao Admin"** no banner roxo
- Ou clique no **X** para fechar
- Sistema retorna automaticamente ao dashboard admin

---

## 🎯 Casos de Uso

### Suporte ao Cliente
```
Cliente: "Não consigo ver meus check-ins"
Você: 
1. Entra como empresa do cliente
2. Acessa /checkin
3. Verifica o problema
4. Resolve ou orienta
```

### Debug de Problemas
```
Cliente: "Erro ao cadastrar veículo"
Você:
1. Entra como empresa do cliente
2. Tenta cadastrar veículo
3. Vê o erro em tempo real
4. Identifica e corrige
```

### Treinamento
```
Cliente: "Como uso a funcionalidade X?"
Você:
1. Entra como empresa do cliente
2. Demonstra a funcionalidade
3. Cliente vê em seu próprio ambiente
```

---

## ⚠️ Importante

### O que você PODE fazer:
- ✅ Ver todos os dados da empresa
- ✅ Criar, editar e deletar registros
- ✅ Testar todas as funcionalidades
- ✅ Acessar todas as páginas
- ✅ Fazer alterações necessárias

### O que você NÃO PODE fazer:
- ❌ Acessar dados de outras empresas (sem entrar como elas)
- ❌ Ver dados do seu próprio banco enquanto impersonando
- ❌ Fazer logout da empresa (só voltar ao admin)

### Segurança:
- 🔒 Dados completamente isolados
- 🔒 Impossível misturar dados de empresas
- 🔒 Logs automáticos de todas as ações
- 🔒 Banner sempre visível

---

## 🎨 Interface Visual

### Banner de Impersonation (sempre visível)
```
┌────────────────────────────────────────────────────────┐
│ 🛡️ MODO SUPER ADMIN │ Visualizando: Empresa XYZ │ [Voltar] [X] │
└────────────────────────────────────────────────────────┘
```

### Menu de Ações no Card
```
┌─────────────────────────┐
│ 🎭 Entrar como Empresa  │ ← CLIQUE AQUI
├─────────────────────────┤
│ 👁️ Visualizar Detalhes  │
│ ✏️ Editar Empresa       │
│ 👥 Gerenciar Usuários   │
│ 🗑️ Desativar Empresa    │
└─────────────────────────┘
```

---

## 🐛 Troubleshooting

### Problema: Não consigo entrar como empresa
**Solução:**
- Verifique se a empresa está ativa (badge verde)
- Empresas inativas não podem ser acessadas
- Tente recarregar a página

### Problema: Banner não aparece
**Solução:**
- Recarregue a página (F5)
- Limpe o cache do navegador
- Verifique o console para erros

### Problema: Dados não aparecem
**Solução:**
- Aguarde alguns segundos (carregamento)
- Verifique se empresa tem dados cadastrados
- Verifique conexão com Firebase

### Problema: Não consigo voltar ao admin
**Solução:**
- Clique no X do banner
- Ou acesse manualmente: `/admin/dashboard`
- Ou faça logout e login novamente

---

## 📊 Estatísticas do Dashboard

### Cards de Métricas
- **Total de Empresas**: Todas as empresas cadastradas
- **Empresas Ativas**: Empresas que podem ser acessadas
- **Total de Usuários**: Soma de usuários de todas as empresas
- **Total de Clientes**: Soma de clientes de todas as empresas
- **Cache de Placas**: Placas consultadas (compartilhado)
- **Taxa de Ativação**: % de empresas ativas

### Filtros Disponíveis
- **Todas**: Mostra todas as empresas
- **Ativas**: Apenas empresas ativas (verde)
- **Inativas**: Apenas empresas inativas (vermelho)

### Busca
- Busque por nome da empresa
- Busque por CNPJ
- Busca em tempo real

---

## 🎓 Dicas Profissionais

### 1. Use para Suporte Proativo
- Entre periodicamente nas empresas
- Verifique se está tudo funcionando
- Identifique problemas antes do cliente

### 2. Documente Ações
- Anote o que você fez durante impersonation
- Informe o cliente sobre alterações
- Mantenha histórico de suporte

### 3. Seja Rápido
- Entre, resolva, saia
- Não deixe impersonation ativo sem uso
- Volte ao admin quando terminar

### 4. Comunique-se
- Avise o cliente quando for acessar
- Explique o que você está fazendo
- Peça feedback após resolver

---

## ✅ Checklist de Uso

Antes de entrar como empresa:
- [ ] Tenho permissão do cliente?
- [ ] Sei o que preciso fazer?
- [ ] Vou documentar as ações?

Durante impersonation:
- [ ] Banner roxo está visível?
- [ ] Estou na empresa correta?
- [ ] Estou fazendo apenas o necessário?

Depois de sair:
- [ ] Voltei ao dashboard admin?
- [ ] Documentei as ações?
- [ ] Informei o cliente?

---

## 🆘 Suporte

Se tiver problemas ou dúvidas:
1. Verifique este guia
2. Verifique o console do navegador (F12)
3. Verifique os logs do Firebase
4. Entre em contato com o desenvolvedor

---

**Desenvolvido para facilitar o suporte e gestão do Torq** 🚀
