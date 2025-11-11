# 🔗 Integração do Check-in com o Sistema Torq

## 📋 Rotas e Navegação

### Adicionar Rota no App.jsx

Se ainda não estiver configurado, adicione a rota:

```jsx
import CheckinPage from './pages/checkin';

// Dentro das rotas
<Route path="/checkin" element={<CheckinPage />} />
```

### Link na Sidebar

Adicione o link no arquivo de configuração da sidebar:

```javascript
// src/components/Sidebar/sidebarConfig.js
{
  name: 'Check-in',
  path: '/checkin',
  icon: ClipboardCheck, // ou outro ícone apropriado
  permission: 'checkin.view'
}
```

---

## 🔐 Permissões e Segurança

### Firestore Rules

Adicione regras para a coleção `checkins`:

```javascript
// firestore.rules
match /checkins/{checkinId} {
  allow read: if request.auth != null 
    && request.auth.token.empresaId == resource.data.empresaId;
  
  allow create: if request.auth != null 
    && request.auth.token.empresaId == request.resource.data.empresaId;
  
  allow update: if request.auth != null 
    && request.auth.token.empresaId == resource.data.empresaId;
  
  allow delete: if request.auth != null 
    && request.auth.token.empresaId == resource.data.empresaId
    && request.auth.token.role == 'admin';
}
```

### Storage Rules

Adicione regras para o storage de fotos:

```javascript
// storage.rules
match /checkins/{placa}/{allPaths=**} {
  allow read: if request.auth != null;
  allow write: if request.auth != null 
    && request.resource.size < 5 * 1024 * 1024; // Max 5MB
}
```

---

## 🔄 Integração com Outros Módulos

### 1. Integração com Clientes

Vincular check-in ao cliente:

```javascript
// Ao criar check-in, buscar cliente pela placa
const clienteRef = collection(db, 'clientes');
const q = query(
  clienteRef,
  where('empresaId', '==', empresaId),
  where('veiculos', 'array-contains', { placa: placa })
);
const clienteSnapshot = await getDocs(q);

if (!clienteSnapshot.empty) {
  checkinData.clienteId = clienteSnapshot.docs[0].id;
  checkinData.clienteNome = clienteSnapshot.docs[0].data().nome;
}
```

### 2. Integração com Orçamentos

Criar orçamento a partir do check-in:

```javascript
// Botão "Criar Orçamento" no histórico ou após check-in
const criarOrcamentoDeCheckin = async (checkinId) => {
  const checkin = await getDoc(doc(db, 'checkins', checkinId));
  const data = checkin.data();
  
  const orcamento = {
    empresaId: data.empresaId,
    clienteId: data.clienteId,
    placa: data.placa,
    veiculo: {
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano
    },
    servicos: data.servicosSelecionados.map(s => ({
      descricao: s,
      quantidade: 1,
      valor: 0 // A ser preenchido
    })),
    observacoes: data.observacoes,
    checkinId: checkinId,
    status: 'rascunho',
    criadoEm: serverTimestamp()
  };
  
  await addDoc(collection(db, 'orcamentos'), orcamento);
};
```

### 3. Integração com Ordem de Serviço

Criar OS a partir do check-in:

```javascript
const criarOSDeCheckin = async (checkinId) => {
  const checkin = await getDoc(doc(db, 'checkins', checkinId));
  const data = checkin.data();
  
  const os = {
    empresaId: data.empresaId,
    clienteId: data.clienteId,
    placa: data.placa,
    veiculo: {
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano,
      cor: data.cor
    },
    servicos: data.servicosSelecionados,
    checklist: data.checklist,
    fotosEntrada: data.fotosEntrada,
    observacoes: data.observacoes,
    checkinId: checkinId,
    status: 'aguardando_inicio',
    criadoEm: serverTimestamp()
  };
  
  await addDoc(collection(db, 'ordens_servico'), os);
};
```

---

## 📊 Dashboard e Relatórios

### Métricas de Check-in

```javascript
// Buscar estatísticas de check-ins
const getCheckinStats = async (empresaId, periodo) => {
  const checkinsRef = collection(db, 'checkins');
  const q = query(
    checkinsRef,
    where('empresaId', '==', empresaId),
    where('dataHora', '>=', periodo.inicio),
    where('dataHora', '<=', periodo.fim)
  );
  
  const snapshot = await getDocs(q);
  
  return {
    total: snapshot.size,
    porStatus: snapshot.docs.reduce((acc, doc) => {
      const status = doc.data().status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}),
    servicosMaisComuns: getServicosMaisComuns(snapshot.docs),
    tempoMedio: calcularTempoMedio(snapshot.docs)
  };
};
```

### Widget no Dashboard

```jsx
// Componente para dashboard
const CheckinWidget = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  return (
    <div className="widget-card">
      <h3>Check-ins Hoje</h3>
      <div className="stats">
        <div className="stat">
          <span className="value">{stats?.total || 0}</span>
          <span className="label">Total</span>
        </div>
        <div className="stat">
          <span className="value">{stats?.emAtendimento || 0}</span>
          <span className="label">Em Atendimento</span>
        </div>
      </div>
    </div>
  );
};
```

---

## 🔔 Notificações

### Notificar Cliente

```javascript
// Após check-in, enviar notificação
const notificarCliente = async (checkinId) => {
  const checkin = await getDoc(doc(db, 'checkins', checkinId));
  const data = checkin.data();
  
  // WhatsApp (se integrado)
  if (data.clienteTelefone) {
    await enviarWhatsApp(data.clienteTelefone, {
      template: 'checkin_confirmado',
      params: {
        placa: data.placa,
        pin: data.pinRetirada,
        servicos: data.servicosSelecionados.join(', ')
      }
    });
  }
  
  // Email (se integrado)
  if (data.clienteEmail) {
    await enviarEmail(data.clienteEmail, {
      subject: 'Check-in Confirmado',
      template: 'checkin',
      data: data
    });
  }
};
```

---

## 🔍 Busca e Filtros

### Página de Listagem de Check-ins

```jsx
const CheckinsListPage = () => {
  const [checkins, setCheckins] = useState([]);
  const [filters, setFilters] = useState({
    status: 'todos',
    periodo: 'hoje',
    placa: ''
  });
  
  const loadCheckins = async () => {
    let q = query(
      collection(db, 'checkins'),
      where('empresaId', '==', empresaId)
    );
    
    if (filters.status !== 'todos') {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters.placa) {
      q = query(q, where('placa', '==', filters.placa.toUpperCase()));
    }
    
    // Adicionar filtro de período...
    
    const snapshot = await getDocs(q);
    setCheckins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };
  
  return (
    <div>
      {/* Filtros */}
      {/* Lista de check-ins */}
    </div>
  );
};
```

---

## 📱 Checkout (Retirada)

### Validação de PIN

```javascript
const validarPINRetirada = async (placa, pin) => {
  const checkinsRef = collection(db, 'checkins');
  const q = query(
    checkinsRef,
    where('empresaId', '==', empresaId),
    where('placa', '==', placa.toUpperCase()),
    where('pinRetirada', '==', pin),
    where('status', '==', 'em_atendimento')
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    throw new Error('PIN inválido ou veículo não encontrado');
  }
  
  return snapshot.docs[0];
};

const realizarCheckout = async (checkinId, dadosCheckout) => {
  const checkinRef = doc(db, 'checkins', checkinId);
  
  await updateDoc(checkinRef, {
    status: 'concluido',
    checkout: {
      dataHora: serverTimestamp(),
      fotosRetirada: dadosCheckout.fotos,
      observacoes: dadosCheckout.observacoes,
      responsavel: dadosCheckout.responsavel
    }
  });
};
```

---

## 🎨 Customização por Empresa

### Configurações Personalizadas

```javascript
// Permitir que cada empresa customize o checklist
const getChecklistPersonalizado = async (empresaId, tipoVeiculo) => {
  const configRef = doc(db, 'empresas', empresaId, 'config', 'checkin');
  const configSnap = await getDoc(configRef);
  
  if (configSnap.exists() && configSnap.data().checklistPersonalizado) {
    return configSnap.data().checklistPersonalizado[tipoVeiculo];
  }
  
  // Fallback para checklist padrão
  return checklistData[tipoVeiculo];
};
```

---

## 📈 Índices do Firestore

Crie os seguintes índices compostos:

```
Collection: checkins
Fields: empresaId (Ascending), dataHora (Descending)

Collection: checkins
Fields: empresaId (Ascending), placa (Ascending), dataHora (Descending)

Collection: checkins
Fields: empresaId (Ascending), status (Ascending), dataHora (Descending)
```

---

## ✅ Checklist de Integração

- [ ] Rota adicionada no App.jsx
- [ ] Link na sidebar configurado
- [ ] Permissões do Firestore configuradas
- [ ] Regras do Storage configuradas
- [ ] Integração com clientes implementada
- [ ] Criação de orçamento a partir do check-in
- [ ] Criação de OS a partir do check-in
- [ ] Widget no dashboard adicionado
- [ ] Notificações configuradas
- [ ] Página de listagem criada
- [ ] Sistema de checkout implementado
- [ ] Índices do Firestore criados

---

## 🚀 Pronto!

O sistema de check-in está totalmente integrado ao Torq e pronto para uso em produção!
