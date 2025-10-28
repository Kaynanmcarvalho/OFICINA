# Mapeamento Gyn Fiscal Online SDK

## Formato do JSON Enviado ao Backend Python

### Estrutura Principal

```json
{
  "action": "emitir_nfce" | "emitir_nfe",
  "Autorizador": "codigo_autorizador",
  "Senha": "senha_autorizada",
  "dados": { ... }
}
```

## Mapeamento de Campos

### 1. Credenciais
| Campo Frontend | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| clientId | Autorizador | string |
| clientSecret | Senha | string |

### 2. Ambiente
| Valor Original | Valor Gyn Fiscal | Descrição |
|----------------|------------------|-----------|
| "homologacao" | 2 | Ambiente de testes |
| "producao" | 1 | Ambiente de produção |

### 3. Dados da Nota
| Campo Original | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| infNFe.ide.mod | nota.modelo | number |
| infNFe.ide.serie | nota.serie | number |
| infNFe.ide.nNF | nota.numero | number |
| infNFe.ide.dhEmi | nota.dataEmissao | string (ISO) |
| infNFe.ide.natOp | nota.naturezaOperacao | string |
| infNFe.ide.tpNF | nota.tipoOperacao | number |
| infNFe.ide.idDest | nota.destinoOperacao | number |
| infNFe.ide.finNFe | nota.finalidadeEmissao | number |
| infNFe.ide.indFinal | nota.consumidorFinal | number |
| infNFe.ide.indPres | nota.presencaComprador | number |

### 4. Dados da Empresa (Emitente)
| Campo Original | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| emit.CNPJ | empresa.cnpj | string |
| emit.xNome | empresa.empresaNome | string |
| emit.xFant | empresa.fantasia | string |
| enderEmit.xLgr | empresa.logradouro | string |
| enderEmit.nro | empresa.numero | string |
| enderEmit.xBairro | empresa.bairro | string |
| enderEmit.xMun | empresa.municipio | string |
| enderEmit.UF | empresa.estado | string (sigla) |
| enderEmit.CEP | empresa.cep | string |
| enderEmit.fone | empresa.telefone | string |
| emit.IE | empresa.impostoEstadual | string |
| emit.CRT | empresa.regimeTributario | number |

### 5. Estado (UF)
| Código Original | Sigla Gyn Fiscal |
|-----------------|------------------|
| 52 | GO |
| 35 | SP |
| 33 | RJ |
| 31 | MG |
| 41 | PR |
| 42 | SC |
| 43 | RS |
| 29 | BA |
| ... | ... |

### 6. Dados do Cliente (Destinatário)
| Campo Original | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| dest.xNome | cliente.nome | string |
| dest.CPF/CNPJ | cliente.cpfCnpj | string |
| enderDest.xLgr | cliente.logradouro | string |
| enderDest.nro | cliente.numero | string |
| enderDest.xBairro | cliente.bairro | string |
| enderDest.xMun | cliente.municipio | string |
| enderDest.UF | cliente.estado | string |
| enderDest.CEP | cliente.cep | string |
| dest.indIEDest | cliente.indicadorIE | number |

### 7. Itens da Nota
| Campo Original | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| det.nItem | numeroItem | number |
| prod.cProd | produto.codigo | string |
| prod.cEAN | produto.codigoBarras | string |
| prod.xProd | produto.descricao | string |
| prod.NCM | produto.ncm | string |
| prod.CEST | produto.cest | string |
| prod.CFOP | produto.cfop | string |
| prod.uCom | produto.unidade | string |
| prod.qCom | produto.quantidade | number |
| prod.vUnCom | produto.valorUnitario | number |
| prod.vProd | produto.valorTotal | number |

### 8. Impostos (ICMS)
| Campo Original | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| ICMS.orig | impostos.icms.origem | number |
| ICMS.CST/CSOSN | impostos.icms.cst | string |
| ICMS.modBC | impostos.icms.modalidadeBC | number |
| ICMS.vBC | impostos.icms.baseCalculo | number |
| ICMS.pICMS | impostos.icms.aliquota | number |
| ICMS.vICMS | impostos.icms.valor | number |

### 9. Impostos (PIS)
| Campo Original | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| PIS.CST | impostos.pis.cst | string |
| PIS.vBC | impostos.pis.baseCalculo | number |
| PIS.pPIS | impostos.pis.aliquota | number |
| PIS.vPIS | impostos.pis.valor | number |

### 10. Impostos (COFINS)
| Campo Original | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| COFINS.CST | impostos.cofins.cst | string |
| COFINS.vBC | impostos.cofins.baseCalculo | number |
| COFINS.pCOFINS | impostos.cofins.aliquota | number |
| COFINS.vCOFINS | impostos.cofins.valor | number |

### 11. Totais
| Campo Original | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| ICMSTot.vBC | totais.baseCalculoICMS | number |
| ICMSTot.vICMS | totais.valorICMS | number |
| ICMSTot.vProd | totais.valorProdutos | number |
| ICMSTot.vFrete | totais.valorFrete | number |
| ICMSTot.vSeg | totais.valorSeguro | number |
| ICMSTot.vDesc | totais.valorDesconto | number |
| ICMSTot.vPIS | totais.valorPIS | number |
| ICMSTot.vCOFINS | totais.valorCOFINS | number |
| ICMSTot.vNF | totais.valorTotal | number |
| ICMSTot.vTotTrib | totais.valorTributos | number |

### 12. Pagamentos
| Campo Original | Campo Gyn Fiscal | Tipo |
|----------------|------------------|------|
| detPag.indPag | formasPagamento[].indicadorPagamento | number |
| detPag.tPag | formasPagamento[].meioPagamento | string (traduzido) |
| detPag.vPag | formasPagamento[].valor | number |
| pag.vTroco | pagamentos.troco | number |

### 13. Meios de Pagamento (Tradução)
| Código | Nome Gyn Fiscal |
|--------|-----------------|
| 01 | Dinheiro |
| 02 | Cheque |
| 03 | Cartão de Crédito |
| 04 | Cartão de Débito |
| 05 | Crédito Loja |
| 10 | Vale Alimentação |
| 11 | Vale Refeição |
| 12 | Vale Presente |
| 13 | Vale Combustível |
| 15 | Boleto Bancário |
| 16 | Depósito Bancário |
| 17 | Cartão |
| 18 | PIX |
| 19 | Transferência Bancária |
| 90 | Sem Pagamento |
| 99 | Outros |

## Exemplo Completo de Requisição

```json
{
  "action": "emitir_nfce",
  "Autorizador": "ABC123XYZ",
  "Senha": "senha_secreta_123",
  "dados": {
    "ambiente": 2,
    "referencia": "VENDA-1730067883553",
    "nota": {
      "modelo": 65,
      "serie": 1,
      "numero": 283553,
      "dataEmissao": "2025-10-27T21:24:43.553Z",
      "naturezaOperacao": "Venda",
      "tipoOperacao": 1,
      "destinoOperacao": 1,
      "finalidadeEmissao": 1,
      "consumidorFinal": 1,
      "presencaComprador": 1
    },
    "empresa": {
      "cnpj": "58959068000182",
      "empresaNome": "BRC Alimentos",
      "fantasia": "BRC Alimentos",
      "logradouro": "Alameda das Campinas",
      "numero": "01",
      "bairro": "Goiânia Park Sul",
      "municipio": "Aparecida de Goiânia",
      "estado": "GO",
      "cep": "74945040",
      "telefone": "",
      "impostoEstadual": "548432185",
      "regimeTributario": 1
    },
    "cliente": null,
    "itens": [
      {
        "numeroItem": 1,
        "produto": {
          "codigo": "PROD001",
          "codigoBarras": "7891234567890",
          "descricao": "Produto Exemplo",
          "ncm": "61091000",
          "cest": "0301300",
          "cfop": "5102",
          "unidade": "UN",
          "quantidade": 2,
          "valorUnitario": 20.00,
          "valorTotal": 40.00
        },
        "impostos": {
          "icms": {
            "origem": 0,
            "cst": "00",
            "modalidadeBC": 3,
            "baseCalculo": 40.00,
            "aliquota": 18.00,
            "valor": 7.20
          },
          "pis": {
            "cst": "01",
            "baseCalculo": 40.00,
            "aliquota": 1.65,
            "valor": 0.66
          },
          "cofins": {
            "cst": "01",
            "baseCalculo": 40.00,
            "aliquota": 7.60,
            "valor": 3.04
          }
        }
      }
    ],
    "totais": {
      "baseCalculoICMS": 40.00,
      "valorICMS": 7.20,
      "valorProdutos": 40.00,
      "valorFrete": 0.00,
      "valorSeguro": 0.00,
      "valorDesconto": 0.00,
      "valorPIS": 0.66,
      "valorCOFINS": 3.04,
      "valorTotal": 40.00,
      "valorTributos": 0.00
    },
    "pagamentos": {
      "formasPagamento": [
        {
          "indicadorPagamento": 0,
          "meioPagamento": "PIX",
          "valor": 40.00
        }
      ],
      "troco": 0.00
    }
  }
}
```

## Resposta Esperada do Backend

```json
{
  "success": true,
  "data": {
    "id": "nfe_123456789",
    "numero": 283553,
    "serie": 1,
    "chave_acesso": "52251058959068000182650010002835531234567890",
    "status": "autorizada",
    "protocolo": "152250000123456",
    "data_emissao": "2025-10-27T21:24:43.553Z",
    "ambiente": "homologacao"
  },
  "message": "NFCe emitida com sucesso"
}
```

## Notas Importantes

1. **Todos os campos estão em português** no formato Gyn Fiscal
2. **O backend Python** receberá este JSON e converterá de volta para o formato da Nuvem Fiscal
3. **Nenhuma referência à "Nuvem Fiscal"** aparece nos logs do frontend
4. **Ambiente**: 1 = Produção, 2 = Homologação (invertido do padrão)
5. **Estado**: Sempre usar sigla (GO, SP, RJ) ao invés de código numérico
6. **Meios de pagamento**: Traduzidos para português legível
