# Instruções de Uso - Modal de Cliente Completo

## 🎯 Visão Geral

O novo modal de cadastro de cliente foi completamente redesenhado com:
- ✅ Validação completa de CPF e CNPJ
- ✅ Campos adaptativos para Pessoa Física e Jurídica
- ✅ Todos os campos obrigatórios implementados
- ✅ Cadastro obrigatório de pelo menos 1 veículo
- ✅ Busca automática de endereço por CEP
- ✅ Interface intuitiva em 5 etapas
- ✅ Verificação de duplicatas

## 📦 Arquivos Criados

1. **`src/services/documentValidationService.js`**
   - Validação e formatação de CPF/CNPJ
   - Validação de data de nascimento
   - Formatação de telefone e CEP

2. **`src/components/forms/ClientForm.jsx`**
   - Formulário completo em wizard
   - 5 etapas guiadas
   - Validação em tempo real

3. **`src/pages/checkin/componentes/ModalNovoClienteWrapper.jsx`**
   - Wrapper para usar no contexto de check-in
   - Mantém compatibilidade com código existente

## 🔧 Como Usar

### Opção 1: Usar Diretamente (Recomendado)

#### No ClientsPage (já está configurado)
```javascript
import ClientForm from '../components/forms/ClientForm';
import Modal from '../components/ui/Modal';

const ClientsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleSubmit = async (clientData) => {
    if (selectedClient) {
      await updateClient(selectedClient.firestoreId, clientData);
      toast.success('Cliente atualizado!');
    } else {
      await createClient(clientData);
      toast.success('Cliente cadastrado!');
    }
    setIsModalOpen(false);
  };

  return (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="full">
      <ClientForm
        client={selectedClient}
        onSubmit={handleSubmit}
        onClose={() => setIsModalOpen(false)}
      />
    </Modal>
  );
};
```

#### No Modal de Check-in
```javascript
import ClientForm from '../../../components/forms/ClientForm';
import Modal from '../../../components/ui/Modal';

const ModalCheckin = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const handleClientSubmit = async (clientData) => {
    // Cliente já foi criado pelo ClientForm
    // Aqui você pode usar os dados do cliente
    setSelectedClient(clientData);
    setIsClientModalOpen(false);
    toast.success('Cliente cadastrado com sucesso!');
  };

  return (
    <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} size="full">
      <ClientForm
        onSubmit={handleClientSubmit}
        onClose={() => setIsClientModalOpen(false)}
      />
    </Modal>
  );
};
```

### Opção 2: Usar o Wrapper (Para compatibilidade)

```javascript
import ModalNovoClienteWrapper from './componentes/ModalNovoClienteWrapper';

const ModalCheckin = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const handleClientSuccess = (clientData) => {
    setSelectedClient(clientData);
    toast.success('Cliente cadastrado!');
  };

  return (
    <ModalNovoClienteWrapper
      isOpen={isClientModalOpen}
      onClose={() => setIsClientModalOpen(false)}
      onSuccess={handleClientSuccess}
      initialName={searchQuery}
    />
  );
};
```

## 📋 Props do ClientForm

### `client` (opcional)
- Tipo: `Object`
- Descrição: Dados do cliente para edição
- Exemplo:
```javascript
{
  name: 'João Silva',
  cpf: '12345678900',
  phone: '11999999999',
  // ... outros campos
}
```

### `onSubmit` (obrigatório)
- Tipo: `Function`
- Descrição: Callback chamado ao salvar o cliente
- Parâmetros: `(clientData) => void`
- Exemplo:
```javascript
const handleSubmit = async (clientData) => {
  await createClient(clientData);
  toast.success('Cliente cadastrado!');
};
```

### `onClose` (obrigatório)
- Tipo: `Function`
- Descrição: Callback para fechar o modal
- Exemplo:
```javascript
const handleClose = () => {
  setIsModalOpen(false);
};
```

## 🎨 Estrutura dos Dados

### Dados Retornados pelo onSubmit

```javascript
{
  // Tipo de pessoa
  personType: 'fisica' | 'juridica',
  
  // Pessoa Física
  name: 'João Silva Santos',
  cpf: '12345678900',
  birthDate: '1990-01-01',
  
  // Pessoa Jurídica
  razaoSocial: 'Empresa LTDA',
  nomeFantasia: 'Minha Empresa',
  cnpj: '12345678000190',
  inscricaoEstadual: '123456789',
  
  // Contato (ambos)
  phone: '11999999999',
  email: 'email@exemplo.com',
  
  // Endereço (ambos)
  zipCode: '12345678',
  address: 'Rua Exemplo',
  number: '123',
  complement: 'Apto 45',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  
  // Veículos (ambos)
  vehicles: [
    {
      id: '1234567890',
      type: 'moto',
      brand: 'Honda',
      model: 'CB 600F',
      plate: 'ABC1234',
      year: '2023',
      color: 'Preto'
    }
  ],
  
  // Observações (ambos)
  observations: 'Cliente preferencial'
}
```

## ✅ Validações Automáticas

### Etapa 1: Identificação
- ✅ CPF válido (11 dígitos + validação algorítmica)
- ✅ CNPJ válido (14 dígitos + validação algorítmica)
- ✅ CPF/CNPJ único (verifica duplicatas)
- ✅ Nome completo (mínimo 3 caracteres)
- ✅ Data de nascimento (maior de 18 anos)
- ✅ Razão social (mínimo 3 caracteres)
- ✅ Nome fantasia (mínimo 3 caracteres)

### Etapa 2: Contato
- ✅ Telefone obrigatório (10-11 dígitos)
- ✅ Email válido (se preenchido)

### Etapa 3: Endereço
- ✅ CEP válido (8 dígitos)
- ✅ Endereço completo obrigatório
- ✅ Número obrigatório
- ✅ Bairro obrigatório
- ✅ Cidade obrigatória
- ✅ Estado obrigatório

### Etapa 4: Veículos
- ✅ Pelo menos 1 veículo obrigatório
- ✅ Tipo, Placa, Marca e Modelo obrigatórios

### Etapa 5: Observações
- ✅ Campo opcional
- ✅ Resumo visual do cadastro

## 🔄 Migração do Código Antigo

### Antes (ModalNovoCliente antigo)
```javascript
import ModalNovoCliente from './componentes/ModalNovoCliente';

<ModalNovoCliente
  isOpen={isOpen}
  onClose={handleClose}
  onSuccess={handleSuccess}
  initialName={name}
/>
```

### Depois (Novo ClientForm)
```javascript
import ClientForm from '../../../components/forms/ClientForm';
import Modal from '../../../components/ui/Modal';

<Modal isOpen={isOpen} onClose={handleClose} size="full">
  <ClientForm
    client={name ? { name } : null}
    onSubmit={handleSuccess}
    onClose={handleClose}
  />
</Modal>
```

## 🎯 Benefícios da Nova Implementação

1. **Validação Robusta**: CPF e CNPJ validados algoritmicamente
2. **Prevenção de Duplicatas**: Verifica CPF/CNPJ antes de salvar
3. **Campos Adaptativos**: Interface muda baseada no tipo de pessoa
4. **Busca Automática**: CEP preenche endereço automaticamente
5. **Experiência Guiada**: Wizard em 5 etapas com feedback visual
6. **Formatação Automática**: CPF, CNPJ, telefone e CEP formatados
7. **Validação em Tempo Real**: Erros mostrados imediatamente
8. **Design Moderno**: Interface limpa e profissional
9. **Responsivo**: Funciona em qualquer tamanho de tela
10. **Tema Escuro**: Suporte completo a dark mode

## 🚨 Pontos de Atenção

### 1. Tamanho do Modal
Use `size="full"` no Modal para melhor experiência:
```javascript
<Modal isOpen={isOpen} onClose={handleClose} size="full">
```

### 2. Tratamento de Erros
O ClientForm já trata erros internamente, mas você pode adicionar tratamento adicional:
```javascript
const handleSubmit = async (clientData) => {
  try {
    await createClient(clientData);
    toast.success('Cliente cadastrado!');
  } catch (error) {
    toast.error('Erro ao cadastrar cliente');
    console.error(error);
  }
};
```

### 3. Edição de Clientes
Para editar, passe o objeto `client` completo:
```javascript
<ClientForm
  client={selectedClient}
  onSubmit={handleUpdate}
  onClose={handleClose}
/>
```

### 4. Validação de Veículos
O formulário exige pelo menos 1 veículo. Se quiser tornar opcional:
```javascript
// Em ClientForm.jsx, linha ~XXX
const validateStep4 = () => {
  // Remover ou comentar a validação de veículos
  return true;
};
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador
2. Confirme que todos os arquivos foram criados
3. Verifique se o Modal está com `size="full"`
4. Teste as validações individualmente

## 🎉 Pronto!

O modal está completo e pronto para uso. Basta importar o `ClientForm` e usar conforme os exemplos acima.

**Aproveite o novo modal de cliente! 🚀**
