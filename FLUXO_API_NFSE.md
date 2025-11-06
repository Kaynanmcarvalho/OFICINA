# 🔄 Fluxo de Comunicação API - NFS-e

## 📡 Visão Geral

O React envia requisições **POST** para `http://localhost:8000/nuvem-fiscal` com diferentes `actions` no body.

```
┌─────────────┐         POST          ┌──────────────┐         API         ┌──────────────┐
│   React     │ ──────────────────→   │   Backend    │ ──────────────────→ │ Nuvem Fiscal │
│  Frontend   │                       │  (Node.js)   │                     │     API      │
│             │ ←──────────────────   │              │ ←──────────────────  │              │
└─────────────┘      Response         └──────────────┘      Response       └──────────────┘
```

---

## 🎯 Endpoints e Actions

### Base URL
```javascript
const API_BASE_URL = 'http://localhost:8000/nuvem-fiscal';
```

### Método HTTP
Todas as requisições usam **POST**

---

## 📤 1. Testar Conexão

### Request (React → Backend)
```javascript
// Arquivo: nfseService.js
async testarConexao(clientId, clientSecret) {
  const response = await fetch('http://localhost:8000/nuvem-fiscal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'test_connection',
      clientId: 'Qn0V1xTQWXdvk2zCVJkL',
      clientSecret: 'DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI',
      ambiente: 'homologacao'
    })
  });
  
  return await response.json();
}
```

### JSON Enviado
```json
{
  "action": "test_connection",
  "clientId": "Qn0V1xTQWXdvk2zCVJkL",
  "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
  "ambiente": "homologacao"
}
```

### Response Esperada
```json
{
  "success": true,
  "message": "Conexão estabelecida com sucesso",
  "data": {
    "status": "online",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## 📤 2. Emitir NFS-e Individual

### Request (React → Backend)
```javascript
// Arquivo: nfseService.js
async emitirNFSe(clientId, clientSecret, nfseData, ambiente) {
  const response = await fetch('http://localhost:8000/nuvem-fiscal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'emitir_nfse',
      clientId: clientId,
      clientSecret: clientSecret,
      ambiente: ambiente,
      nfseData: nfseData
    })
  });
  
  return await response.json();
}
```

### JSON Enviado (Completo)
```json
{
  "action": "emitir_nfse",
  "clientId": "Qn0V1xTQWXdvk2zCVJkL",
  "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
  "ambiente": "homologacao",
  "nfseData": {
    "provedor": "padrao",
    "ambiente": "homologacao",
    "referencia": "NFSE-1705320600000",
    "infDPS": {
      "tpAmb": 2,
      "dhEmi": "2024-01-15T10:30:00-03:00",
      "verAplic": "1.0",
      "dCompet": "2024-01-15",
      "prest": {
        "CNPJ": "57673794000171",
        "regTrib": {
          "regEspTrib": 6
        }
      },
      "toma": {
        "orgaoPublico": false,
        "CNPJ": "58959068000182",
        "xNome": "BRC Comercio e Servicos Ltda",
        "end": {
          "endNac": {
            "cMun": "3550308",
            "CEP": "01310100"
          },
          "xLgr": "Avenida Paulista",
          "nro": "1000",
          "xBairro": "Bela Vista"
        },
        "email": "contato@clienteteste.com.br"
      },
      "serv": {
        "locPrest": {
          "cLocPrestacao": "3550308"
        },
        "cServ": {
          "cTribNac": "01.01",
          "cTribMun": "0101",
          "xDescServ": "Serviços de consultoria em tecnologia da informação"
        }
      },
      "valores": {
        "vServPrest": {
          "vReceb": 1000.00,
          "vServ": 1000.00
        },
        "trib": {
          "tribMun": {
            "tribISSQN": 1,
            "cLocIncid": "3550308",
            "vBC": 1000.00,
            "pAliq": 5.00,
            "vISSQN": 50.00,
            "tpRetISSQN": 1,
            "vLiq": 950.00
          }
        }
      }
    }
  }
}
```

### Response Esperada (Sucesso)
```json
{
  "success": true,
  "data": {
    "id": "dps_abc123xyz789",
    "numero": "123",
    "serie": "1",
    "chave_acesso": "35240157673794000171990010000001231234567890",
    "status": "autorizado",
    "protocolo": "135240000123456",
    "data_emissao": "2024-01-15T10:30:00-03:00",
    "ambiente": "homologacao",
    "modelo": "99"
  }
}
```

### Response Esperada (Erro)
```json
{
  "success": false,
  "error": "Campo 'xNome' é obrigatório",
  "details": {
    "campo": "toma.xNome",
    "mensagem": "Nome do tomador é obrigatório"
  }
}
```

---

## 📤 3. Emitir Lote de NFS-e

### Request (React → Backend)
```javascript
async emitirLoteNFSe(clientId, clientSecret, loteData, ambiente) {
  const response = await fetch('http://localhost:8000/nuvem-fiscal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'emitir_lote_nfse',
      clientId: clientId,
      clientSecret: clientSecret,
      ambiente: ambiente,
      loteData: loteData
    })
  });
  
  return await response.json();
}
```

### JSON Enviado
```json
{
  "action": "emitir_lote_nfse",
  "clientId": "Qn0V1xTQWXdvk2zCVJkL",
  "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
  "ambiente": "homologacao",
  "loteData": {
    "provedor": "padrao",
    "ambiente": "homologacao",
    "referencia": "LOTE-NFSE-001",
    "documentos": [
      {
        "provedor": "padrao",
        "ambiente": "homologacao",
        "referencia": "NFSE-001",
        "infDPS": {
          // ... dados da primeira NFS-e
        }
      },
      {
        "provedor": "padrao",
        "ambiente": "homologacao",
        "referencia": "NFSE-002",
        "infDPS": {
          // ... dados da segunda NFS-e
        }
      }
    ]
  }
}
```

### Response Esperada
```json
{
  "success": true,
  "data": {
    "lote_id": "lot_xyz789abc123",
    "status": "processando",
    "total_documentos": 2,
    "documentos_processados": 2,
    "documentos_com_erro": 0
  }
}
```

---

## 📤 4. Consultar NFS-e por ID

### Request (React → Backend)
```javascript
async consultarNFSe(clientId, clientSecret, nfseId, ambiente) {
  const response = await fetch('http://localhost:8000/nuvem-fiscal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'consultar_nfse',
      clientId: clientId,
      clientSecret: clientSecret,
      ambiente: ambiente,
      nfseId: nfseId
    })
  });
  
  return await response.json();
}
```

### JSON Enviado
```json
{
  "action": "consultar_nfse",
  "clientId": "Qn0V1xTQWXdvk2zCVJkL",
  "clientSecret": "DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI",
  "ambiente": "homologacao",
  "nfseId": "dps_abc123xyz789"
}
```

### Response Esperada
```json
{
  "success": true,
  "data": {
    "id": "dps_abc123xyz789",
    "numero": "123",
    "serie": "1",
    "chave_acesso": "35240157673794000171990010000001231234567890",
    "status": "autorizado",
    "protocolo": "135240000123456",
    "data_emissao": "2024-01-15T10:30:00-03:00",
    "prestador": {
      "cnpj": "57673794000171",
      "nome": "Empresa Exemplo Ltda"
    },
    "tomador": {
      "cnpj": "58959068000182",
      "nome": "BRC Comercio e Servicos Ltda"
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

## 📤 5. Listar Lotes de NFS-e

### Request (React → Backend)
```javascript
async listarLotesNFSe(clientId, clientSecret, filters, ambiente) {
  const response = await fetch('http://localhost:8000/nuvem-fiscal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'listar_lotes_nfse',
      clientId: clientId,
      clientSecret: clientSecret,
      ambiente: ambiente,
      filters: filters
    })
  });
  
  return await response.json();
}
```

### JSON Enviado
```json
{
  "action": "listar_lotes_nfse",
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

### Response Esperada
```json
{
  "success": true,
  "data": {
    "count": 25,
    "items": [
      {
        "id": "lot_xyz789",
        "referencia": "LOTE-001",
        "status": "processado",
        "total_documentos": 5,
        "data_criacao": "2024-01-15T10:00:00Z"
      },
      {
        "id": "lot_abc456",
        "referencia": "LOTE-002",
        "status": "processando",
        "total_documentos": 3,
        "data_criacao": "2024-01-15T11:00:00Z"
      }
    ]
  }
}
```

---

## 🔄 Fluxo Completo no React

### 1. Usuário Finaliza Venda no Caixa

```javascript
// Arquivo: Caixa.jsx
const handleSaleConfirm = async (confirmationData) => {
  // 1. Salvar venda no Firestore
  const vendaDoc = await addDoc(collection(db, 'vendas'), vendaData);
  
  // 2. Verificar se deve gerar NFS-e
  if (confirmationData.options.generateNFe && 
      confirmationData.options.nfeType === 'nfse') {
    
    // 3. Preparar dados da NFS-e
    const nfseData = await nfseService.prepareDadosNFSe(
      saleData, 
      config, 
      customer
    );
    
    // 4. Emitir NFS-e
    const result = await nfseService.emitirNFSe(
      config.nfClientId,
      config.nfClientSecret,
      nfseData,
      config.ambiente !== 'producao'
    );
    
    // 5. Processar resultado
    if (result.success) {
      // Salvar NFS-e no Firestore
      await addDoc(collection(db, 'nfses'), {
        numero: result.data.numero,
        chave: result.data.chave_acesso,
        status: result.data.status,
        vendaId: vendaDoc.id
      });
      
      showNotification('NFS-e emitida com sucesso!');
    } else {
      showNotification('Erro ao emitir NFS-e: ' + result.error, 'error');
    }
  }
};
```

---

## 📊 Estrutura de Dados Preparada pelo React

### Função prepareDadosNFSe()

```javascript
// Arquivo: nfseService.js
async prepareDadosNFSe(saleData, config, customer) {
  const now = new Date();
  const dhEmi = now.toISOString();
  const dCompet = now.toISOString().split('T')[0];

  // Calcular valores
  const vServicos = saleData.items.reduce(
    (sum, item) => sum + (item.preco * item.quantidade), 
    0
  );
  const vDesconto = saleData.desconto || 0;
  const vTotal = vServicos - vDesconto;

  // Calcular ISS (5%)
  const pAliqISS = 5.00;
  const vISS = (vTotal * pAliqISS) / 100;
  const vLiquido = vTotal - vISS;

  return {
    provedor: 'padrao',
    ambiente: config.ambiente === 'producao' ? 'producao' : 'homologacao',
    referencia: `NFSE-${Date.now()}`,
    infDPS: {
      tpAmb: config.ambiente === 'producao' ? 1 : 2,
      dhEmi: dhEmi,
      verAplic: '1.0',
      dCompet: dCompet,
      prest: {
        CNPJ: config.cnpj?.replace(/\D/g, ''),
        regTrib: {
          regEspTrib: this.mapRegimeTributario(config.regimeTributario)
        }
      },
      toma: {
        orgaoPublico: false,
        [customer.tipoPessoa === 'juridica' ? 'CNPJ' : 'CPF']: 
          customer.cpfCnpj?.replace(/\D/g, ''),
        xNome: customer.nome,
        end: {
          endNac: {
            cMun: customer.endereco?.codigoMunicipio || '5201405',
            CEP: customer.endereco?.cep?.replace(/\D/g, '') || ''
          },
          xLgr: customer.endereco?.logradouro || '',
          nro: customer.endereco?.numero || 'S/N',
          xBairro: customer.endereco?.bairro || ''
        },
        email: customer.email || ''
      },
      serv: {
        locPrest: {
          cLocPrestacao: customer.endereco?.codigoMunicipio || '5201405'
        },
        cServ: {
          cTribNac: '01.01',
          cTribMun: '0101',
          xDescServ: this.gerarDescricaoServicos(saleData.items)
        }
      },
      valores: {
        vServPrest: {
          vReceb: vTotal,
          vServ: vServicos
        },
        trib: {
          tribMun: {
            tribISSQN: 1,
            cLocIncid: customer.endereco?.codigoMunicipio || '5201405',
            vBC: vTotal,
            pAliq: pAliqISS,
            vISSQN: vISS,
            tpRetISSQN: 1,
            vLiq: vLiquido
          }
        }
      }
    }
  };
}
```

---

## 🎯 Resumo dos Métodos HTTP

| Action | Método | Endpoint | Descrição |
|--------|--------|----------|-----------|
| `test_connection` | POST | `/nuvem-fiscal` | Testar conexão |
| `emitir_nfse` | POST | `/nuvem-fiscal` | Emitir NFS-e individual |
| `emitir_lote_nfse` | POST | `/nuvem-fiscal` | Emitir lote de NFS-e |
| `consultar_nfse` | POST | `/nuvem-fiscal` | Consultar NFS-e por ID |
| `listar_lotes_nfse` | POST | `/nuvem-fiscal` | Listar lotes |

**Observação:** Todos usam POST porque o backend usa um único endpoint com diferentes actions no body.

---

## 🔐 Headers Enviados

```javascript
headers: {
  'Content-Type': 'application/json'
}
```

**Não há autenticação no header!** As credenciais (`clientId` e `clientSecret`) vão no **body** da requisição.

---

## ⚠️ Tratamento de Erros

```javascript
try {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });

  const result = await response.json();

  if (result.success) {
    // Sucesso
    return { success: true, data: result.data };
  } else {
    // Erro da API
    return { 
      success: false, 
      error: result.error,
      details: result.details 
    };
  }
} catch (error) {
  // Erro de rede/conexão
  return { 
    success: false, 
    error: error.message 
  };
}
```

---

## 🎨 Exemplo Completo de Uso

```javascript
// 1. Importar o serviço
import nfseService from '../config/nfseService';

// 2. Preparar dados
const nfseData = await nfseService.prepareDadosNFSe(
  saleData,
  config,
  customer
);

// 3. Emitir NFS-e
const result = await nfseService.emitirNFSe(
  'Qn0V1xTQWXdvk2zCVJkL',
  'DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI',
  nfseData,
  'homologacao'
);

// 4. Verificar resultado
if (result.success) {
  console.log('NFS-e emitida:', result.data.numero);
  console.log('Chave:', result.data.chave_acesso);
} else {
  console.error('Erro:', result.error);
}
```

---

## 🚀 Conclusão

- **Método:** Sempre POST
- **Endpoint:** Único (`/nuvem-fiscal`)
- **Diferenciação:** Via campo `action` no body
- **Autenticação:** No body (`clientId` e `clientSecret`)
- **Formato:** JSON puro
- **Response:** Sempre JSON com `success` boolean
