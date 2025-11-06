# Guia de Teste - NFS-e

## 🧪 Como Testar a Implementação

### Pré-requisitos

1. **Backend rodando** em `http://localhost:8000`
2. **Credenciais configuradas:**
   - Client ID: `Qn0V1xTQWXdvk2zCVJkL`
   - Client Secret: `DE65kY0SZas4j840MlJSAjZ4yRx9fmFH2tnBU9dI`
   - CNPJ: `57.673.794/0001-71`
3. **Ambiente:** Homologação

### Teste 1: Página HTML de Teste

Abra o arquivo `teste-nfse.html` no navegador para testar diretamente a API:

**Funcionalidades disponíveis:**
- 🔌 Testar Conexão
- 📝 Emitir NFS-e Individual
- 📦 Emitir Lote de NFS-e
- 📋 Listar Lotes
- 🔍 Consultar NFS-e por ID

**Fluxo de teste:**
1. Clique em "Testar Conexão" para verificar se a API está respondendo
2. Clique em "Emitir NFS-e" para criar uma nota de teste
3. Copie o ID retornado (ex: `dps_abc123` ou `nfse_xyz789`)
4. Cole no campo "ID da NFS-e salvo"
5. Clique em "Consultar NFS-e" para ver os detalhes

### Teste 2: Integração no Sistema

#### Passo 1: Configurar Permissões

1. Acesse **Integrações → Nota Fiscal**
2. Ative o checkbox **"Ativar NFS-e (Nota Fiscal de Serviço)"**
3. Salve as configurações

#### Passo 2: Realizar Venda

1. Acesse **Caixa**
2. Adicione produtos/serviços ao carrinho
3. Clique em **"Carrinho"**
4. Clique em **"Finalizar Venda"**

#### Passo 3: Configurar Pagamento

1. Escolha o método de pagamento
2. Informe o valor recebido
3. Clique em **"Confirmar Pagamento"**

#### Passo 4: Gerar NFS-e

1. Marque **"Gerar Nota Fiscal Eletrônica"**
2. Selecione **"NFS-e (Serviço)"**
3. Preencha os dados do cliente:
   - Nome completo ✅ (obrigatório)
   - CPF ou CNPJ ✅ (obrigatório)
   - Email
   - Telefone
   - Endereço completo ✅ (obrigatório)
   - Código do município (IBGE)
4. Clique em **"Finalizar Venda"**

#### Passo 5: Verificar Resultado

Se tudo correr bem, você verá:
- ✅ Mensagem de sucesso
- 📄 Número da NFS-e
- 🔑 Chave de acesso
- 📊 Status da nota
- 💾 Nota salva no Firestore

### Teste 3: Consultar NFS-e Emitida

**Via Sistema:**
1. Acesse a lista de vendas
2. Localize a venda com NFS-e
3. Clique para ver detalhes
4. Baixe XML ou PDF (se disponível)

**Via API (teste-nfse.html):**
1. Abra `teste-nfse.html`
2. Cole o ID da NFS-e no campo
3. Clique em "Consultar por ID"

## 📋 Dados de Teste

### Cliente Exemplo (Pessoa Jurídica)

```json
{
  "nome": "BRC Comercio e Servicos Ltda",
  "cpfCnpj": "58959068000182",
  "tipoPessoa": "juridica",
  "email": "contato@clienteteste.com.br",
  "telefone": "(11) 98765-4321",
  "endereco": {
    "cep": "01310100",
    "logradouro": "Avenida Paulista",
    "numero": "1000",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "uf": "SP",
    "codigoMunicipio": "3550308"
  }
}
```

### Cliente Exemplo (Pessoa Física)

```json
{
  "nome": "João da Silva",
  "cpfCnpj": "12345678901",
  "tipoPessoa": "fisica",
  "email": "joao@email.com",
  "telefone": "(11) 91234-5678",
  "endereco": {
    "cep": "01310100",
    "logradouro": "Avenida Paulista",
    "numero": "500",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "uf": "SP",
    "codigoMunicipio": "3550308"
  }
}
```

## 🔍 Verificações de Sucesso

### ✅ Emissão Bem-Sucedida

Você deve ver:
```json
{
  "success": true,
  "data": {
    "id": "dps_abc123xyz",
    "numero": "123",
    "chave_acesso": "35240157673794000171990010000001231234567890",
    "status": "autorizado",
    "protocolo": "135240000123456",
    "data_emissao": "2024-01-15T10:30:00-03:00"
  }
}
```

### ❌ Erros Comuns

**1. Credenciais inválidas:**
```json
{
  "success": false,
  "error": "Credenciais inválidas"
}
```
**Solução:** Verifique Client ID e Client Secret

**2. Dados obrigatórios faltando:**
```json
{
  "success": false,
  "error": "Campo 'xNome' é obrigatório"
}
```
**Solução:** Preencha todos os campos obrigatórios do cliente

**3. Código de município inválido:**
```json
{
  "success": false,
  "error": "Código de município inválido"
}
```
**Solução:** Use código IBGE válido (7 dígitos)

**4. Backend não está rodando:**
```json
{
  "success": false,
  "error": "Failed to fetch"
}
```
**Solução:** Inicie o backend em `http://localhost:8000`

## 🎯 Códigos de Município (IBGE) Comuns

| Cidade | UF | Código IBGE |
|--------|----|----|
| São Paulo | SP | 3550308 |
| Rio de Janeiro | RJ | 3304557 |
| Belo Horizonte | MG | 3106200 |
| Brasília | DF | 5300108 |
| Goiânia | GO | 5208707 |
| Aparecida de Goiânia | GO | 5201405 |

## 📊 Estrutura de Resposta da API

### Emissão de NFS-e

```json
{
  "success": true,
  "data": {
    "id": "dps_abc123",
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

### Consulta de NFS-e

```json
{
  "success": true,
  "data": {
    "id": "dps_abc123",
    "numero": "123",
    "serie": "1",
    "chave_acesso": "35240157673794000171990010000001231234567890",
    "status": "autorizado",
    "protocolo": "135240000123456",
    "data_emissao": "2024-01-15T10:30:00-03:00",
    "prestador": {
      "cnpj": "57673794000171",
      "nome": "Empresa Exemplo"
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

## 🚀 Próximos Passos

Após testar com sucesso:

1. ✅ Testar em ambiente de produção
2. ✅ Configurar códigos de serviço corretos
3. ✅ Ajustar alíquotas de ISS conforme município
4. ✅ Implementar download de XML/PDF
5. ✅ Adicionar relatórios de NFS-e emitidas
6. ✅ Implementar cancelamento de NFS-e

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Verifique os logs do console do navegador (F12)
- Verifique os logs do backend
- Consulte a documentação da Nuvem Fiscal API
- Revise os arquivos de exemplo fornecidos
