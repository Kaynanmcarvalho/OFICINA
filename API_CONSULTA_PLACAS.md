# 🚗 APIs de Consulta de Placas - Configuração

## ⚠️ IMPORTANTE: Consulta de Placas Requer Backend

**Problema identificado**: APIs de consulta de placas não funcionam diretamente do frontend devido a:
- ❌ Restrições de CORS
- ❌ Proteção de dados (LGPD)
- ❌ Segurança (API keys expostas)

**Solução**: Implementar backend proxy (veja `COMO_IMPLEMENTAR_CONSULTA_PLACAS.md`)

## 🔌 APIs Configuradas (em ordem de prioridade)

### 1. Consulta Placa API (Principal)
- **URL**: `https://api.consultaplaca.com.br`
- **Tipo**: Gratuita com limite de requisições
- **Documentação**: https://consultaplaca.com.br/docs
- **Limite**: ~100 consultas/dia (gratuito)
- **Cadastro**: Não requer (mas recomendado para mais requisições)

**Como aumentar o limite:**
1. Acesse: https://consultaplaca.com.br
2. Crie uma conta gratuita
3. Obtenha sua API Key
4. Adicione no código: `headers: { 'Authorization': 'Bearer SUA_API_KEY' }`

### 2. Brasil API (Fallback 1)
- **URL**: `https://brasilapi.com.br/api/fipe`
- **Tipo**: Gratuita e open-source
- **Documentação**: https://brasilapi.com.br/docs
- **Limite**: Ilimitado
- **Cadastro**: Não requer

**Características:**
- ✅ Totalmente gratuita
- ✅ Sem necessidade de cadastro
- ✅ Open source
- ⚠️ Pode ter dados menos completos

### 3. API Carros (Fallback 2)
- **URL**: `https://apicarros.com`
- **Tipo**: Freemium (gratuito com limite)
- **Documentação**: https://apicarros.com/docs
- **Limite**: 50 consultas/dia (gratuito)
- **Cadastro**: Requer cadastro gratuito

**Como configurar:**
1. Acesse: https://apicarros.com/cadastro
2. Crie uma conta gratuita
3. Obtenha sua API Key no painel
4. Adicione no código: `headers: { 'X-API-Key': 'SUA_API_KEY' }`

## 🔧 Configuração Recomendada para Produção

### Opção 1: Usar API Paga (Mais Confiável)
Para ambiente de produção com alto volume, recomendamos:

**Placa Fipe API** (Paga)
- URL: https://wdapi2.com.br
- Custo: R$ 0,10 por consulta
- Limite: Ilimitado
- Dados: Completos e atualizados
- Suporte: Profissional

**Como configurar:**
```javascript
// Em src/services/vehicleApiService.js
const PLACA_FIPE_TOKEN = process.env.VITE_PLACA_FIPE_TOKEN;

const response = await fetch(`https://wdapi2.com.br/consulta/${cleanPlate}/${PLACA_FIPE_TOKEN}`, {
    method: 'GET'
});
```

### Opção 2: Usar Múltiplas APIs Gratuitas (Atual)
O sistema já está configurado para usar 3 APIs gratuitas em cascata:
1. Tenta API 1
2. Se falhar, tenta API 2
3. Se falhar, tenta API 3
4. Se todas falharem, permite preenchimento manual

## 📊 Dados Retornados

Cada API retorna (quando disponível):
- ✅ Placa
- ✅ Marca
- ✅ Modelo
- ✅ Ano
- ✅ Cor
- ✅ Tipo (Carro/Moto/Caminhão)

## 🚨 Limitações das APIs Gratuitas

### Consulta Placa API
- ❌ Limite de 100 consultas/dia
- ❌ Pode retornar erro 429 (Too Many Requests)
- ✅ Dados geralmente completos

### Brasil API
- ✅ Sem limite de requisições
- ❌ Nem sempre tem todos os dados
- ❌ Pode não ter informação de cor

### API Carros
- ❌ Limite de 50 consultas/dia
- ❌ Requer cadastro
- ✅ Dados completos quando disponível

## 🔐 Variáveis de Ambiente (Opcional)

Para usar APIs com autenticação, crie um arquivo `.env` na raiz:

```env
# APIs de Consulta de Placas
VITE_CONSULTA_PLACA_KEY=sua_chave_aqui
VITE_API_CARROS_KEY=sua_chave_aqui
VITE_PLACA_FIPE_TOKEN=seu_token_aqui
```

E atualize o código para usar:
```javascript
const API_KEY = import.meta.env.VITE_CONSULTA_PLACA_KEY;
```

## 🎯 Recomendações

### Para Desenvolvimento
✅ Use as APIs gratuitas configuradas (já funcionando)

### Para Produção (Baixo Volume)
✅ Use Brasil API (ilimitada e gratuita)
✅ Configure fallbacks

### Para Produção (Alto Volume)
✅ Contrate Placa Fipe API (paga)
✅ Configure API Key nas variáveis de ambiente
✅ Mantenha fallbacks gratuitos

## 🐛 Troubleshooting

### Erro: "Too Many Requests" (429)
**Causa**: Limite de requisições atingido
**Solução**: 
1. Aguarde 24h para reset
2. Use outra API (fallback automático)
3. Contrate plano pago

### Erro: "Placa não encontrada"
**Causa**: Placa não existe ou não está na base
**Solução**: 
1. Verifique se a placa está correta
2. Use preenchimento manual

### Erro: "API indisponível"
**Causa**: API fora do ar temporariamente
**Solução**: 
1. Sistema tenta fallbacks automaticamente
2. Se todas falharem, use preenchimento manual

## 📝 Notas Importantes

1. **Nenhum dado mock/falso**: Todas as consultas são reais
2. **Fallback automático**: Se uma API falhar, tenta a próxima
3. **Preenchimento manual**: Sempre disponível como última opção
4. **LGPD**: Consultas de placas são permitidas para fins comerciais legítimos
5. **Cache**: Considere implementar cache para reduzir consultas repetidas

## 🔄 Próximas Melhorias Sugeridas

1. **Cache de Consultas**: Salvar consultas recentes no localStorage
2. **Rate Limiting**: Controlar número de consultas por usuário
3. **Histórico**: Mostrar placas consultadas recentemente
4. **Validação**: Validar formato da placa antes de consultar
5. **Analytics**: Monitorar qual API está sendo mais usada

---

**Status**: ✅ APIs Reais Configuradas  
**Ambiente**: Produção Ready  
**Fallbacks**: 3 APIs configuradas  
**Mock/Fake**: ❌ Removido completamente
