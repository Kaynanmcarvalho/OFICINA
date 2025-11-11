# 🚀 Testar Check-in Agora - Guia Rápido

## ⚡ Início Rápido

### 1. Certifique-se que o sistema está rodando
```bash
npm run dev
```

### 2. Acesse a página de check-in
```
http://localhost:5173/checkin
```

---

## 🧪 Cenário de Teste Completo

### Passo 1: Buscar Veículo
1. Digite uma placa válida (ex: `ABC1234` ou `ABC1D23`)
2. Aguarde o sistema buscar os dados
3. ✅ Deve aparecer: painel de informações, visual do veículo, painel técnico

### Passo 2: Visualizar Informações
1. Veja o painel de informações com marca, modelo, ano, cor
2. Observe o SVG do veículo (muda conforme o tipo)
3. Confira o painel técnico lateral com especificações
4. ✅ Tudo deve estar com tema claro/escuro correto

### Passo 3: Adicionar Fotos (OBRIGATÓRIO)
1. Clique em "Tirar Foto" ou "Upload"
2. Selecione uma ou mais fotos
3. Aguarde o processamento (overlay será aplicado)
4. ✅ Fotos devem aparecer com preview
5. ✅ Marca e placa devem estar visíveis nas fotos

### Passo 4: Selecionar Serviços (Opcional)
1. Role até "Serviços Recomendados"
2. Clique nos serviços desejados
3. ✅ Contador deve atualizar no botão de finalizar

### Passo 5: Preencher Checklist (Opcional)
1. Role até "Checklist de Inspeção"
2. Marque itens como OK/Atenção/Crítico
3. Adicione observações se necessário
4. ✅ Progresso deve atualizar em tempo real

### Passo 6: Ver Histórico
1. Observe o painel "Histórico de Atendimentos"
2. ✅ Se primeira visita: mensagem apropriada
3. ✅ Se já existe: timeline com registros anteriores

### Passo 7: Finalizar Check-in
1. Clique em "Finalizar Check-in" (botão fixo no bottom)
2. Revise as informações no modal
3. Adicione observações se desejar
4. Clique em "Finalizar Check-in"
5. ✅ Sistema deve processar e gerar PIN
6. ✅ Localização deve ser capturada
7. ✅ PIN de 6 dígitos deve aparecer

### Passo 8: Copiar PIN
1. Clique em "Copiar PIN"
2. ✅ Botão deve mudar para "Copiado!"
3. Clique em "Concluir"

### Passo 9: Verificar Salvamento
1. Abra o Firebase Console
2. Vá em Firestore > checkins
3. ✅ Deve ter um novo documento com todos os dados
4. Vá em Storage > checkins/{placa}
5. ✅ Deve ter as fotos com overlay

---

## 🎯 Pontos de Atenção

### Validações
- ❌ Não permite finalizar sem fotos
- ✅ Placa deve ser válida (formato brasileiro)
- ✅ Todos os campos opcionais funcionam vazios

### Tema
- ✅ Mude o tema do sistema (claro/escuro)
- ✅ Todos os componentes devem adaptar automaticamente

### Responsividade
- ✅ Teste em desktop (grid 2 colunas)
- ✅ Teste em tablet (grid adaptativo)
- ✅ Teste em mobile (1 coluna, botão fixo)

### Animações
- ✅ Todos os elementos devem aparecer suavemente
- ✅ Hover effects devem funcionar
- ✅ Transições devem ser suaves

---

## 🐛 Possíveis Problemas e Soluções

### Problema: "Erro ao buscar dados da placa"
**Solução**: Verifique se o backend está rodando e acessível

### Problema: "Erro ao fazer upload de fotos"
**Solução**: Verifique as permissões do Firebase Storage

### Problema: "Geolocalização não funciona"
**Solução**: 
- Permita acesso à localização no navegador
- Use HTTPS (ou localhost)
- API Nominatim pode estar lenta (normal)

### Problema: "Histórico não aparece"
**Solução**: 
- Verifique se há registros anteriores da placa
- Confirme que empresaId está correto
- Verifique índices do Firestore

### Problema: "Tema não muda"
**Solução**: Verifique se useThemeStore está funcionando

---

## 📊 Dados de Teste

### Placas Válidas para Teste
```
ABC1234  (formato antigo)
ABC1D23  (formato Mercosul)
XYZ9876
DEF5G67
```

### Marcas que Acionam Tipos Diferentes
```
Honda CG 160    → Moto
Volvo FH        → Caminhão
Toyota Corolla  → Carro
Yamaha Fazer    → Moto
Scania R450     → Caminhão
```

---

## ✅ Checklist de Teste

### Funcionalidades Básicas
- [ ] Busca de placa funciona
- [ ] Dados do veículo aparecem
- [ ] Visual do veículo renderiza
- [ ] Painel técnico exibe informações
- [ ] Upload de fotos funciona
- [ ] Overlay é aplicado nas fotos
- [ ] Preview de fotos funciona

### Funcionalidades Avançadas
- [ ] Sugestões de serviços aparecem
- [ ] Seleção de serviços funciona
- [ ] Checklist carrega por tipo
- [ ] Status do checklist funciona
- [ ] Observações do checklist salvam
- [ ] Histórico busca registros anteriores
- [ ] Timeline exibe corretamente

### Finalização
- [ ] Modal de finalização abre
- [ ] Localização é capturada
- [ ] PIN é gerado (6 dígitos)
- [ ] Copiar PIN funciona
- [ ] Dados salvam no Firestore
- [ ] Fotos salvam no Storage
- [ ] Formulário reseta após salvar

### Design e UX
- [ ] Tema claro funciona
- [ ] Tema escuro funciona
- [ ] Animações são suaves
- [ ] Layout responsivo funciona
- [ ] Botões têm feedback visual
- [ ] Loading states aparecem
- [ ] Mensagens de erro são claras

---

## 🎉 Teste Completo

Se todos os itens acima funcionarem, o sistema está **100% operacional**!

### Próximo Passo
Teste com dados reais de veículos da sua oficina e valide o fluxo completo.

---

## 📞 Suporte

Se encontrar algum problema:
1. Verifique o console do navegador (F12)
2. Verifique o console do terminal
3. Confirme que Firebase está configurado
4. Verifique se o backend está respondendo

**Boa sorte com os testes! 🚀**
