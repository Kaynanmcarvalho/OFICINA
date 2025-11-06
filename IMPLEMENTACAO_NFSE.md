# Implementação de NFS-e no Sistema

## ✅ Alterações Realizadas

### 1. Modal de Confirmação de Venda (SaleConfirmationModal.jsx)

**Adicionado:**
- Opção de radio button para NFS-e (Serviço) junto com NFe e NFCe
- Permissão `nfseAtivo` no estado de permissões
- Lógica para validar se NFS-e está ativa nas configurações
- Ajuste automático do tipo de impressão (tpImp) para NFS-e
- Dados do cliente obrigatórios para NFS-e (assim como NFe)

**Código adicionado:**
```jsx
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="radio"
    name="nfeType"
    value="nfse"
    checked={nfeType === 'nfse'}
    onChange={(e) => handleNfeTypeChange(e.target.value)}
    disabled={!permissions.nfseAtivo}
    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
  />
  <span className="text-sm">NFS-e (Serviço)</span>
</label>
```

### 2. Serviço de NFS-e (nfseService.js)

**Criado novo arquivo:** `src/config/nfseService.js`

**Funcionalidades:**
- `emitirNFSe()` - Emitir NFS-e individual
- `emitirLoteNFSe()` - Emitir lote de NFS-e
- `consultarNFSe()` - Consultar NFS-e por ID
- `listarLotesNFSe()` - Listar lotes de NFS-e
- `prepareDadosNFSe()` - Preparar dados da venda para formato NFS-e
- `testarConexao()` - Testar conexão com API

**Estrutura de dados NFS-e:**
```javascript
{
  provedor: 'padrao',
  ambiente: 'homologacao',
  referencia: 'NFSE-001',
  infDPS: {
    tpAmb: 2,
    dhEmi: '2024-01-15T10:30:00-03:00',
    verAplic: '1.0',
    dCompet: '2024-01-15',
    prest: {
      CNPJ: '57673794000171',
      regTrib: { regEspTrib: 6 }
    },
    toma: {
      orgaoPublico: false,
      CNPJ: '58959068000182',
      xNome: 'Cliente Exemplo',
      end: {
        endNac: {
          cMun: '3550308',
          CEP: '01310100'
        },
        xLgr: 'Avenida Paulista',
        nro: '1000',
        xBairro: 'Bela Vista'
      },
      email: 'contato@cliente.com.br'
    },
    serv: {
      locPrest: {
        cLocPrestacao: '3550308'
      },
      cServ: {
        cTribNac: '01.01',
        cTribMun: '0101',
        xDescServ: 'Serviços de consultoria'
      }
    },
    valores: {
      vServPrest: {
        vReceb: 1000.00,
        vServ: 1000.00
      },
      trib: {
        tribMun: {
          tribISSQN: 1,
          cLocIncid: '3550308',
          vBC: 1000.00,
          pAliq: 5.00,
          vISSQN: 50.00,
          tpRetISSQN: 1,
          vLiq: 950.00
        }
      }
    }
  }
}
```

## 🔧 Próximos Passos para Completar a Implementação

### 3. Modificar Caixa.jsx

**Adicionar import:**
```javascript
import nfseService from '../config/nfseService';
```

**Modificar função `handleGenerateNF` para incluir NFS-e:**

Localizar a seção onde está:
```javascript
if (saleData.nfeType === 'nfe') {
  // Lógica NFe
} else {
  // Lógica NFCe
}
```

E adicionar:
```javascript
if (saleData.nfeType === 'nfe') {
  console.log('🏢 Gerando NFe (modelo 55) via Gyn Fiscal Online...');
  // ... código existente NFe
} else if (saleData.nfeType === 'nfse') {
  console.log('📝 Gerando NFS-e (serviços) via Nuvem Fiscal...');
  
  // Validar dados do cliente para NFS-e
  if (!customer || !customer.cpfCnpj || !customer.nome) {
    showNotification('Para NFS-e é obrigatório informar os dados completos do cliente', 'error');
    return;
  }
  
  // Preparar dados para NFS-e
  const nfseData = await nfseService.prepareDadosNFSe(saleData, config, customer);
  console.log('📄 Dados NFS-e preparados:', nfseData);
  
  // Emitir NFS-e
  result = await nfseService.emitirNFSe(
    config.nfClientId,
    config.nfClientSecret,
    nfseData,
    config.ambiente !== 'producao'
  );
} else {
  console.log('🛒 Gerando NFCe (modelo 65) via Gyn Fiscal Online...');
  // ... código existente NFCe
}
```

### 4. Adicionar Permissão NFS-e na Página de Integrações

**Arquivo:** `src/pages/IntegrationsPage.jsx` (ou similar)

Adicionar checkbox para ativar/desativar NFS-e:
```jsx
<label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={invoiceSettings.nfseAtivo}
    onChange={(e) => handleInvoiceChange('nfseAtivo', e.target.checked)}
    className="w-4 h-4 text-blue-600 rounded"
  />
  <span>Ativar NFS-e (Nota Fiscal de Serviço)</span>
</label>
```

### 5. Configurar Backend para NFS-e

**Arquivo backend:** Adicionar endpoint para NFS-e

O backend já deve ter a rota `/nuvem-fiscal` configurada. Certifique-se de que aceita a action `emitir_nfse`.

### 6. Testar a Implementação

**Passos de teste:**

1. Ativar permissão NFS-e em Integrações → Nota Fiscal
2. Adicionar produtos ao carrinho no Caixa
3. Finalizar venda
4. Selecionar "Gerar Nota Fiscal Eletrônica"
5. Escolher tipo "NFS-e (Serviço)"
6. Preencher dados do cliente (obrigatório)
7. Confirmar venda
8. Verificar se NFS-e foi emitida com sucesso

## 📋 Checklist de Implementação

- [x] Adicionar opção NFS-e no modal de confirmação
- [x] Criar serviço nfseService.js
- [x] Adicionar permissão nfseAtivo
- [x] Ajustar validação de dados obrigatórios
- [x] Adicionar checkbox de permissão na página de Integrações
- [ ] Modificar handleGenerateNF no Caixa.jsx
- [ ] Testar emissão de NFS-e
- [ ] Testar consulta de NFS-e
- [ ] Adicionar download de XML/PDF da NFS-e

## 🔗 Referências

- Arquivo de exemplo: `teste-nfse.html`
- JSON de exemplo: `exemplo-nfse.json`
- JSON de lote: `exemplo-lote-nfse.json`
- API Base URL: `https://torq.up.railway.app/api/nfse`

## 🌐 Endpoints da API

1. **Testar Conexão:** `POST https://torq.up.railway.app/api/nfse/testar-conexao`
2. **Emitir NFS-e:** `POST https://torq.up.railway.app/api/nfse/emitir`
3. **Emitir Lote:** `POST https://torq.up.railway.app/api/nfse/emitir-lote`
4. **Consultar NFS-e:** `POST https://torq.up.railway.app/api/nfse/consultar`
5. **Listar Lotes:** `POST https://torq.up.railway.app/api/nfse/listar-lotes`

## 📝 Notas Importantes

1. **Dados obrigatórios para NFS-e:**
   - Nome completo do cliente
   - CPF ou CNPJ
   - Endereço completo
   - Código do município (IBGE)

2. **Cálculo de impostos:**
   - ISS é calculado sobre o valor total dos serviços
   - Alíquota padrão: 5% (ajustar conforme município)
   - Valor líquido = Total - ISS

3. **Códigos de serviço:**
   - `cTribNac`: Código de tributação nacional (ex: 01.01)
   - `cTribMun`: Código de tributação municipal (ex: 0101)
   - Ajustar conforme o tipo de serviço prestado

4. **Ambiente:**
   - Homologação: Para testes
   - Produção: Para emissão real
