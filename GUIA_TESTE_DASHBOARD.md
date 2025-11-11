# Guia de Teste - Dashboard Corrigido

## 🧪 Como Testar as Correções

### Preparação
1. Abra o sistema no navegador
2. Faça login
3. Navegue para `/dashboard`

---

## ✅ Testes a Realizar

### Teste 1: Card "Veículos Ativos"

**Objetivo**: Verificar se mostra apenas veículos em atendimento

**Passos**:
1. Anote o número mostrado no card "Veículos Ativos"
2. Vá para a página de Check-ins (`/checkins`)
3. Conte quantos veículos têm status:
   - "Em Montagem"
   - "Aguardando Peças"
   - "Teste"
   - "Em Serviço"
4. Compare com o número do card

**Resultado Esperado**: ✅ Números devem ser iguais

**Se falhar**: ❌ Verifique se há check-ins com status diferentes dos listados

---

### Teste 2: Card "Ferramentas Disponíveis"

**Objetivo**: Verificar se mostra apenas ferramentas disponíveis

**Passos**:
1. Anote o número mostrado no card "Ferramentas Disponíveis"
2. Vá para a página de Ferramentas (`/tools`)
3. Conte:
   - Total de ferramentas
   - Ferramentas "Em Uso"
   - Ferramentas "Em Manutenção"
4. Calcule: Total - Em Uso - Em Manutenção
5. Compare com o número do card

**Resultado Esperado**: ✅ Números devem ser iguais

**Se falhar**: ❌ Verifique os status das ferramentas no banco

---

### Teste 3: Card "Produtos em Estoque"

**Objetivo**: Verificar se mostra número de produtos, não unidades

**Passos**:
1. Anote o número mostrado no card "Produtos em Estoque"
2. Vá para a página de Estoque (`/inventory`)
3. Conte quantos produtos diferentes existem
4. Compare com o número do card

**Resultado Esperado**: ✅ Números devem ser iguais

**Nota**: Não deve ser a soma de unidades!

**Exemplo**:
- Se você tem 10 produtos com 100 unidades cada
- Card deve mostrar: **10** (produtos)
- Card NÃO deve mostrar: 1000 (unidades)

---

### Teste 4: Atualização em Tempo Real

**Objetivo**: Verificar se dashboard atualiza automaticamente

**Passos**:
1. Abra o dashboard em uma aba
2. Abra a página de Check-ins em outra aba
3. Crie um novo check-in
4. Volte para a aba do dashboard
5. Aguarde até 3 segundos

**Resultado Esperado**: ✅ Card "Veículos Ativos" deve aumentar em 1

**Se falhar**: ❌ Verifique o console do navegador para erros

---

### Teste 5: Tendências

**Objetivo**: Verificar se tendências são calculadas corretamente

**Passos**:
1. Observe os badges de tendência nos cards (setas com %)
2. Verifique se fazem sentido:
   - Seta para cima (verde) = crescimento
   - Seta para baixo (vermelha) = queda
   - Traço (cinza) = estável

**Resultado Esperado**: ✅ Tendências devem refletir mudanças reais

**Nota**: Tendências comparam últimos 7 dias com 7 dias anteriores

---

### Teste 6: Gráfico Financeiro

**Objetivo**: Verificar se gráfico mostra dados corretos

**Passos**:
1. Role até o "Gráfico Financeiro"
2. Verifique se há dados no gráfico
3. Passe o mouse sobre as barras para ver valores
4. Compare com orçamentos aprovados no período

**Resultado Esperado**: ✅ Gráfico deve mostrar receita de serviços concluídos

**Se falhar**: ❌ Verifique se há check-ins com status "completed"

---

### Teste 7: Lista de Clientes Recentes

**Objetivo**: Verificar se mostra clientes mais recentes

**Passos**:
1. Role até "Clientes Recentes"
2. Verifique se lista mostra clientes
3. Vá para página de Clientes (`/clients`)
4. Ordene por data de cadastro (mais recentes primeiro)
5. Compare os 5 primeiros com a lista do dashboard

**Resultado Esperado**: ✅ Listas devem ser iguais

---

### Teste 8: Estoque Crítico

**Objetivo**: Verificar se mostra produtos com estoque baixo

**Passos**:
1. Role até "Estoque Crítico"
2. Verifique se lista mostra produtos
3. Vá para página de Estoque (`/inventory`)
4. Filtre produtos com quantidade <= estoque mínimo
5. Compare com a lista do dashboard

**Resultado Esperado**: ✅ Listas devem ser iguais

---

### Teste 9: Ferramentas em Uso

**Objetivo**: Verificar se mostra ferramentas em uso

**Passos**:
1. Role até "Ferramentas em Uso"
2. Verifique se lista mostra ferramentas
3. Vá para página de Ferramentas (`/tools`)
4. Filtre ferramentas com status "Em Uso"
5. Compare com a lista do dashboard

**Resultado Esperado**: ✅ Listas devem ser iguais

---

### Teste 10: Veículos Ativos (Lista)

**Objetivo**: Verificar se lista mostra veículos em atendimento

**Passos**:
1. Role até "Veículos Ativos" (lista, não card)
2. Verifique se lista mostra veículos
3. Vá para página de Check-ins (`/checkins`)
4. Filtre check-ins ativos (não concluídos)
5. Compare com a lista do dashboard

**Resultado Esperado**: ✅ Listas devem ser iguais

---

## 🐛 Problemas Comuns e Soluções

### Problema: Card mostra 0
**Causa**: Não há dados no banco  
**Solução**: Cadastre alguns registros para testar

### Problema: Dashboard não atualiza
**Causa**: Listeners não conectados  
**Solução**: Recarregue a página (F5)

### Problema: Tendências sempre em 0%
**Causa**: Não há dados suficientes para comparar  
**Solução**: Normal se sistema é novo, aguarde acumular dados

### Problema: Gráfico vazio
**Causa**: Não há check-ins concluídos  
**Solução**: Conclua alguns check-ins para popular o gráfico

### Problema: Listas vazias
**Causa**: Não há dados nas coleções  
**Solução**: Cadastre dados nas respectivas páginas

---

## 📊 Dados de Teste Sugeridos

Para testar completamente, crie:

### Clientes
- Mínimo: 5 clientes
- Recomendado: 10-20 clientes

### Veículos
- Mínimo: 3 veículos
- Recomendado: 10-15 veículos

### Check-ins
- Mínimo: 2 ativos, 2 concluídos
- Recomendado: 5-10 de cada

### Ferramentas
- Mínimo: 3 disponíveis, 2 em uso
- Recomendado: 10-15 ferramentas

### Estoque
- Mínimo: 5 produtos
- Recomendado: 20-30 produtos
- Alguns com estoque baixo para testar alertas

### Orçamentos
- Mínimo: 2 aprovados, 2 pendentes
- Recomendado: 10-15 orçamentos

---

## ✅ Checklist de Teste

Use este checklist para garantir que tudo foi testado:

- [ ] Card "Clientes" mostra total correto
- [ ] Card "Veículos Ativos" mostra apenas em atendimento
- [ ] Card "Ferramentas Disponíveis" mostra apenas disponíveis
- [ ] Card "Produtos em Estoque" mostra número de produtos
- [ ] Tendências aparecem e fazem sentido
- [ ] Dashboard atualiza em tempo real
- [ ] Gráfico Financeiro mostra dados
- [ ] Lista de Clientes Recentes está correta
- [ ] Lista de Estoque Crítico está correta
- [ ] Lista de Ferramentas em Uso está correta
- [ ] Lista de Veículos Ativos está correta
- [ ] Alertas aparecem quando necessário
- [ ] Sem erros no console do navegador
- [ ] Performance está boa (sem travamentos)

---

## 🔍 Verificação no Console

Abra o Console do Navegador (F12) e verifique:

### Mensagens Esperadas ✅
```
[Dashboard] empresaId available, setting up listeners
[Dashboard] Atualização detectada em: clients
[Dashboard] Atualização detectada em: checkins
```

### Mensagens de Erro ❌
Se aparecer algum erro, anote e reporte:
```
[Dashboard] Erro ao buscar estatísticas: ...
[Dashboard] Erro ao buscar alertas: ...
```

---

## 📈 Métricas de Performance

O dashboard deve:
- ✅ Carregar em menos de 2 segundos
- ✅ Atualizar em tempo real em até 3 segundos
- ✅ Não travar ao rolar a página
- ✅ Não consumir muita memória (< 100MB)

Para verificar performance:
1. Abra DevTools (F12)
2. Vá para aba "Performance"
3. Clique em "Record"
4. Navegue pelo dashboard
5. Pare a gravação
6. Analise o resultado

---

## 🎯 Resultado Final Esperado

Após todos os testes, o dashboard deve:

✅ Mostrar dados precisos e atualizados  
✅ Atualizar automaticamente quando há mudanças  
✅ Ter performance fluida sem travamentos  
✅ Exibir alertas quando necessário  
✅ Ter gráficos e listas populados  
✅ Não apresentar erros no console  

---

## 📞 Reportar Problemas

Se encontrar algum problema:

1. **Anote**:
   - O que você estava fazendo
   - O que esperava acontecer
   - O que realmente aconteceu
   - Mensagens de erro (se houver)

2. **Capture**:
   - Screenshot do problema
   - Console do navegador (F12)

3. **Reporte**:
   - Descreva o problema detalhadamente
   - Anexe screenshots e logs
   - Informe navegador e versão

---

## 🎉 Conclusão

Se todos os testes passarem, o dashboard está funcionando corretamente com as correções aplicadas!

**Próximo passo**: Implementar as melhorias sugeridas em `PROXIMAS_MELHORIAS_DASHBOARD.md`
