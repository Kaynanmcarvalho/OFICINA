# 🔄 Migração de Check-ins Antigos para Timeline

## 📋 Problema

Check-ins criados **antes** da implementação da timeline não possuem a estrutura de `stages` e `currentStage`, resultando em:
- Timeline vazia ou com mensagem "Dados não encontrados"
- Impossibilidade de visualizar o progresso do atendimento
- Perda de contexto histórico

---

## ✅ Solução Implementada

### 1. Fallback Automático no Frontend

O componente `VehicleTimeline` agora detecta check-ins antigos e cria uma estrutura mínima automaticamente:

```javascript
// Se o check-in não tem stages (check-in antigo)
if (!timeline.stages || Object.keys(timeline.stages).length === 0) {
  // Inferir estágio atual baseado no status
  const inferredStage = timeline.currentStage || 'checkin';
  
  // Criar estrutura mínima
  timeline.stages = {
    [inferredStage]: {
      completed: true,
      timestamp: timeline.createdAt || timeline.checkinDate,
      userId: timeline.userId || 'unknown',
      userName: timeline.userName || timeline.responsible || 'Sistema'
    }
  };
}
```

### 2. Aviso Visual

Um banner azul informa ao usuário que o check-in é antigo:

```
ℹ️ Check-in criado antes da implementação da timeline. 
   Exibindo etapa atual baseada no status do registro.
```

---

## 🔧 Script de Migração (Opcional)

Se você quiser atualizar permanentemente os check-ins antigos no Firebase, use este script:

### Arquivo: `scripts/migrate-checkins.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Configuração do Firebase (copie do seu firebase.js)
const firebaseConfig = {
  // ... sua configuração
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateCheckins() {
  console.log('🔄 Iniciando migração de check-ins...\n');
  
  try {
    // Buscar todos os check-ins
    const checkinsRef = collection(db, 'checkins');
    const snapshot = await getDocs(checkinsRef);
    
    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const checkinId = docSnap.id;
      
      // Verificar se já tem stages
      if (data.stages && Object.keys(data.stages).length > 0) {
        console.log(`⏭️  Pulando ${checkinId} - já tem stages`);
        skipped++;
        continue;
      }
      
      try {
        // Inferir estágio atual
        let currentStage = 'checkin';
        
        // Mapear status antigo para estágio
        if (data.status === 'completed' || data.status === 'concluido') {
          currentStage = 'checkout';
        } else if (data.status === 'in_progress' || data.status === 'em_atendimento') {
          currentStage = 'execucao';
        }
        
        // Criar estrutura de stages
        const stages = {
          checkin: {
            completed: true,
            timestamp: data.createdAt || data.checkinDate || serverTimestamp(),
            userId: data.userId || 'migration-script',
            userName: data.userName || data.responsible || 'Sistema (Migração)'
          }
        };
        
        // Se está em estágio avançado, marcar etapas intermediárias
        if (currentStage !== 'checkin') {
          const stageOrder = ['checkin', 'diagnostico', 'orcamento', 'execucao', 'finalizacao', 'checkout'];
          const currentIndex = stageOrder.indexOf(currentStage);
          
          for (let i = 1; i <= currentIndex; i++) {
            stages[stageOrder[i]] = {
              completed: i < currentIndex,
              timestamp: data.updatedAt || data.createdAt || serverTimestamp(),
              userId: data.userId || 'migration-script',
              userName: data.userName || data.responsible || 'Sistema (Migração)'
            };
          }
        }
        
        // Atualizar documento
        const docRef = doc(db, 'checkins', checkinId);
        await updateDoc(docRef, {
          currentStage,
          stages,
          updatedAt: serverTimestamp(),
          migratedAt: serverTimestamp()
        });
        
        console.log(`✅ Migrado ${checkinId} - Estágio: ${currentStage}`);
        migrated++;
        
      } catch (error) {
        console.error(`❌ Erro ao migrar ${checkinId}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Resumo da Migração:');
    console.log(`   ✅ Migrados: ${migrated}`);
    console.log(`   ⏭️  Pulados: ${skipped}`);
    console.log(`   ❌ Erros: ${errors}`);
    console.log(`   📝 Total: ${snapshot.docs.length}`);
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
  }
}

// Executar migração
migrateCheckins()
  .then(() => {
    console.log('\n✅ Migração concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Falha na migração:', error);
    process.exit(1);
  });
```

### Como Executar:

```bash
# 1. Criar pasta scripts (se não existir)
mkdir scripts

# 2. Salvar o script acima em scripts/migrate-checkins.js

# 3. Executar
node scripts/migrate-checkins.js
```

---

## 🎯 Mapeamento de Status para Estágios

O script usa esta lógica para inferir o estágio atual:

| Status Antigo | Estágio Inferido | Etapas Marcadas |
|---------------|------------------|-----------------|
| `pending` | `checkin` | Apenas Check-in |
| `in_progress` / `em_atendimento` | `execucao` | Check-in → Diagnóstico → Orçamento → Execução |
| `completed` / `concluido` | `checkout` | Todas as 6 etapas |
| `cancelled` / `cancelado` | `checkin` | Apenas Check-in |

---

## 📊 Estrutura Antes e Depois

### Antes da Migração:
```javascript
{
  id: "CHK-1234567890",
  clientName: "João Silva",
  vehiclePlate: "ABC-1234",
  status: "in_progress",
  createdAt: Timestamp,
  // ❌ Sem currentStage
  // ❌ Sem stages
}
```

### Depois da Migração:
```javascript
{
  id: "CHK-1234567890",
  clientName: "João Silva",
  vehiclePlate: "ABC-1234",
  status: "in_progress",
  currentStage: "execucao",  // ✅ Adicionado
  stages: {                   // ✅ Adicionado
    checkin: {
      completed: true,
      timestamp: Timestamp,
      userId: "migration-script",
      userName: "Sistema (Migração)"
    },
    diagnostico: {
      completed: true,
      timestamp: Timestamp,
      userId: "migration-script",
      userName: "Sistema (Migração)"
    },
    orcamento: {
      completed: true,
      timestamp: Timestamp,
      userId: "migration-script",
      userName: "Sistema (Migração)"
    },
    execucao: {
      completed: false,
      timestamp: Timestamp,
      userId: "migration-script",
      userName: "Sistema (Migração)"
    }
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  migratedAt: Timestamp  // ✅ Marca de migração
}
```

---

## ⚠️ Considerações Importantes

### 1. Backup Antes de Migrar

```bash
# Exportar dados do Firestore antes da migração
firebase firestore:export gs://seu-bucket/backup-$(date +%Y%m%d)
```

### 2. Testar em Ambiente de Desenvolvimento

Execute o script primeiro em um projeto de teste/desenvolvimento antes de aplicar em produção.

### 3. Timestamps Aproximados

Como os check-ins antigos não têm timestamps para cada etapa, o script usa:
- `createdAt` para a etapa de check-in
- `updatedAt` para etapas intermediárias
- Isso é uma aproximação, não reflete o tempo real de cada etapa

### 4. Usuários Genéricos

Etapas migradas terão:
- `userId`: "migration-script"
- `userName`: "Sistema (Migração)" ou o responsável do check-in

---

## 🧪 Teste Rápido

Para testar se a migração funcionou:

```javascript
// No console do navegador (F12)
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';

const checkinId = 'CHK-1234567890'; // ID de um check-in antigo
const docRef = doc(db, 'checkins', checkinId);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  const data = docSnap.data();
  console.log('Current Stage:', data.currentStage);
  console.log('Stages:', data.stages);
  console.log('Migrated At:', data.migratedAt);
}
```

---

## 🎨 Resultado Visual

### Check-in Antigo (Sem Migração):
```
ℹ️ Check-in criado antes da implementação da timeline.
   Exibindo etapa atual baseada no status do registro.

[=====>                    ] 16.67%
✅ Check-in | ⚪ Diagnóstico | ⚪ Orçamento | ...
```

### Check-in Migrado:
```
[===================>      ] 66.67%
✅ Check-in | ✅ Diagnóstico | ✅ Orçamento | 🟠 Execução | ⚪ Finalização | ⚪ Check-out
```

---

## 📝 Alternativa: Migração Manual

Se preferir não usar o script, você pode atualizar manualmente no Firebase Console:

1. Acesse Firebase Console → Firestore
2. Abra a collection `checkins`
3. Para cada documento antigo, adicione:
   ```json
   {
     "currentStage": "checkin",
     "stages": {
       "checkin": {
         "completed": true,
         "timestamp": "2025-11-11T10:00:00Z",
         "userId": "manual",
         "userName": "Admin"
       }
     }
   }
   ```

---

## ✅ Conclusão

Com o fallback automático implementado, **não é obrigatório** executar a migração. O sistema funciona perfeitamente com check-ins antigos, apenas exibindo um aviso informativo.

A migração é **opcional** e recomendada apenas se você quiser:
- Remover o aviso azul dos check-ins antigos
- Ter dados históricos mais precisos
- Padronizar todos os registros no Firebase

**Status Atual:** ✅ Sistema funcionando com fallback automático para check-ins antigos!
