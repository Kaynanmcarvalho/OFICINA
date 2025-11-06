# 🌐 URLs da API NFS-e

## 📍 Base URL

```
https://torq.up.railway.app/api/nfse
```

---

## 🔗 Endpoints Disponíveis

### 1. Testar Conexão
**Endpoint:** `/testar-conexao`  
**URL Completa:** `https://torq.up.railway.app/api/nfse/testar-conexao`  
**Método:** `POST`

**Body:**
```json
{
  "clientId": "Qn0V1xTQWXdvk2zCVJkL",
  "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
  "ambiente": "homologacao"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Conexão estabelecida com sucesso",
  "online": true
}
```

---

### 2. Emitir NFS-e
**Endpoint:** `/emitir`  
**URL Completa:** `https://torq.up.railway.app/api/nfse/emitir`  
**Método:** `POST`

**Body:**
```json
{
  "clientId": "Qn0V1xTQWXdvk2zCVJkL",
  "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
  "ambiente": "homologacao",
  "nfseData": {
    "provedor": "padrao",
    "ambiente": "homologacao",
    "referencia": "NFSE-001",
    "infDPS": {
      // ... dados da NFS-e
    }
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "dps_abc123",
    "numero": "123",
    "chave_acesso": "35240157673794000171990010000001231234567890",
    "status": "autorizado",
    "protocolo": "135240000123456"
  }
}
```

---

### 3. Emitir Lote de NFS-e
**Endpoint:** `/emitir-lote`  
**URL Completa:** `https://torq.up.railway.app/api/nfse/emitir-lote`  
**Método:** `POST`

**Body:**
```json
{
  "clientId": "Qn0V1xTQWXdvk2zCVJkL",
  "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
  "ambiente": "homologacao",
  "loteData": {
    "provedor": "padrao",
    "ambiente": "homologacao",
    "referencia": "LOTE-001",
    "documentos": [
      // ... array de NFS-e
    ]
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "lote_id": "lot_xyz789",
    "quantidade": 2,
    "status": "processando"
  }
}
```

---

### 4. Consultar NFS-e
**Endpoint:** `/consultar`  
**URL Completa:** `https://torq.up.railway.app/api/nfse/consultar`  
**Método:** `POST`

**Body:**
```json
{
  "clientId": "Qn0V1xTQWXdvk2zCVJkL",
  "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
  "ambiente": "homologacao",
  "nfseId": "dps_abc123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "dps_abc123",
    "numero": "123",
    "status": "autorizado",
    "chave_acesso": "35240157673794000171990010000001231234567890",
    "prestador": {
      "cnpj": "57673794000171",
      "nome": "Empresa Exemplo"
    },
    "tomador": {
      "cnpj": "58959068000182",
      "nome": "Cliente Exemplo"
    },
    "valores": {
      "servicos": 1000.00,
      "iss": 50.00,
      "liquido": 950.00
    }
  }
}
```

---

### 5. Listar Lotes
**Endpoint:** `/listar-lotes`  
**URL Completa:** `https://torq.up.railway.app/api/nfse/listar-lotes`  
**Método:** `POST`

**Body:**
```json
{
  "clientId": "Qn0V1xTQWXdvk2zCVJkL",
  "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
  "ambiente": "homologacao",
  "filters": {
    "cpf_cnpj": "57673794000171",
    "$top": 10,
    "$skip": 0,
    "$inlinecount": true
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "count": 5,
    "data": [
      {
        "id": "lot_xyz789",
        "referencia": "LOTE-001",
        "quantidade": 2,
        "status": "processado",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## 🔐 Autenticação

Todas as requisições requerem:
- `clientId`: Código Autorizador fornecido pela Nuvem Fiscal
- `clientSecret`: Senha Autorizada fornecida pela Nuvem Fiscal

**Credenciais de Teste:**
```javascript
clientId: 'Qn0V1xTQWXdvk2zCVJkL'
clientSecret: 'DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI'
```

---

## 🌍 Ambientes

- **Homologação:** `ambiente: "homologacao"` (para testes)
- **Produção:** `ambiente: "producao"` (para emissão real)

---

## 📝 Headers Obrigatórios

```javascript
{
  'Content-Type': 'application/json'
}
```

---

## ⚠️ Tratamento de Erros

### Erro de Autenticação
```json
{
  "success": false,
  "error": "Credenciais inválidas"
}
```

### Erro de Validação
```json
{
  "success": false,
  "error": "Campo 'xNome' é obrigatório",
  "details": {
    "field": "xNome",
    "message": "Campo obrigatório não preenchido"
  }
}
```

### Erro de Servidor
```json
{
  "success": false,
  "error": "Erro interno do servidor",
  "message": "Detalhes do erro..."
}
```

---

## 🧪 Testando com cURL

### Testar Conexão
```bash
curl -X POST https://torq.up.railway.app/api/nfse/testar-conexao \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "Qn0V1xTQWXdvk2zCVJkL",
    "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
    "ambiente": "homologacao"
  }'
```

### Emitir NFS-e
```bash
curl -X POST https://torq.up.railway.app/api/nfse/emitir \
  -H "Content-Type: application/json" \
  -d @exemplo-nfse.json
```

### Consultar NFS-e
```bash
curl -X POST https://torq.up.railway.app/api/nfse/consultar \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "Qn0V1xTQWXdvk2zCVJkL",
    "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
    "ambiente": "homologacao",
    "nfseId": "dps_abc123"
  }'
```

---

## 🔄 Migração de localhost para Railway

### Antes (localhost)
```javascript
const API_URL = 'http://localhost:8000/nuvem-fiscal';
```

### Depois (Railway)
```javascript
const API_URL = 'https://torq.up.railway.app/api/nfse';
```

### Mudanças nos Endpoints

| Antes | Depois |
|-------|--------|
| `POST /nuvem-fiscal` com `action: 'test_connection'` | `POST /api/nfse/testar-conexao` |
| `POST /nuvem-fiscal` com `action: 'emitir_nfse'` | `POST /api/nfse/emitir` |
| `POST /nuvem-fiscal` com `action: 'emitir_lote_nfse'` | `POST /api/nfse/emitir-lote` |
| `POST /nuvem-fiscal` com `action: 'consultar_nfse'` | `POST /api/nfse/consultar` |
| `POST /nuvem-fiscal` com `action: 'listar_lotes_nfse'` | `POST /api/nfse/listar-lotes` |

---

## 📊 Status da API

Para verificar se a API está online:

```bash
curl https://torq.up.railway.app/api/nfse/testar-conexao
```

**Resposta esperada:**
```json
{
  "success": true,
  "online": true,
  "message": "API NFS-e está online"
}
```

---

## 🚀 Próximos Passos

1. ✅ URLs atualizadas no `nfseService.js`
2. ✅ URLs atualizadas no `teste-nfse.html`
3. ✅ Arquivo de configuração criado (`nfseConfig.js`)
4. ⏳ Testar todos os endpoints
5. ⏳ Integrar no fluxo do Caixa

---

## 📞 Suporte

Em caso de problemas com a API:
- Verifique se a URL está correta
- Confirme que as credenciais estão válidas
- Verifique o console do navegador para erros
- Teste com o arquivo `teste-nfse.html`
