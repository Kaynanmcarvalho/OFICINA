/**
 * Script para Criar Dados de Teste
 * Popula o Firebase com dados de exemplo para testar o sistema
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Verificar se arquivo de credenciais existe
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('\n❌ ERRO: Arquivo serviceAccountKey.json não encontrado!');
  process.exit(1);
}

// Inicializar Firebase Admin
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Dados de teste
const dadosTeste = {
  clients: [
    {
      name: 'João Silva',
      phone: '11987654321',
      cpf: '123.456.789-00',
      email: 'joao@email.com',
      address: 'Rua das Flores, 123',
      vehicles: [],
      serviceHistory: [],
      totalServices: 0,
      createdAt: new Date().toISOString()
    },
    {
      name: 'Maria Santos',
      phone: '11976543210',
      cpf: '987.654.321-00',
      email: 'maria@email.com',
      address: 'Av. Principal, 456',
      vehicles: [],
      serviceHistory: [],
      totalServices: 0,
      createdAt: new Date().toISOString()
    },
    {
      name: 'Pedro Oliveira',
      phone: '11965432109',
      cpf: '456.789.123-00',
      email: 'pedro@email.com',
      address: 'Rua do Comércio, 789',
      vehicles: [],
      serviceHistory: [],
      totalServices: 0,
      createdAt: new Date().toISOString()
    }
  ],
  
  inventory: [
    {
      name: 'Óleo Motor 5W30',
      partNumber: 'OL-5W30-001',
      category: 'Óleos',
      brand: 'Castrol',
      quantity: 50,
      minQuantity: 10,
      unitPrice: 45.90,
      supplier: 'Distribuidora Auto Peças',
      location: 'Prateleira A1',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Filtro de Óleo',
      partNumber: 'FO-001',
      category: 'Filtros',
      brand: 'Mann',
      quantity: 30,
      minQuantity: 5,
      unitPrice: 25.50,
      supplier: 'Distribuidora Auto Peças',
      location: 'Prateleira B2',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Pastilha de Freio Dianteira',
      partNumber: 'PF-DIANT-001',
      category: 'Freios',
      brand: 'Bosch',
      quantity: 15,
      minQuantity: 3,
      unitPrice: 120.00,
      supplier: 'Auto Center Peças',
      location: 'Prateleira C3',
      createdAt: new Date().toISOString()
    },
    {
      name: 'Vela de Ignição',
      partNumber: 'VI-001',
      category: 'Elétrica',
      brand: 'NGK',
      quantity: 40,
      minQuantity: 8,
      unitPrice: 18.90,
      supplier: 'Distribuidora Auto Peças',
      location: 'Prateleira D1',
      createdAt: new Date().toISOString()
    }
  ],
  
  checkins: [
    {
      clientName: 'João Silva',
      clientPhone: '11987654321',
      vehiclePlate: 'ABC-1234',
      vehicleBrand: 'Volkswagen',
      vehicleModel: 'Gol',
      vehicleYear: '2020',
      services: ['Troca de óleo', 'Revisão geral'],
      observations: 'Cliente solicitou urgência',
      status: 'in-progress',
      checkinDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      clientName: 'Maria Santos',
      clientPhone: '11976543210',
      vehiclePlate: 'XYZ-5678',
      vehicleBrand: 'Fiat',
      vehicleModel: 'Uno',
      vehicleYear: '2019',
      services: ['Alinhamento', 'Balanceamento'],
      observations: 'Veículo com vibração no volante',
      status: 'waiting-parts',
      checkinDate: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  
  budgets: [
    {
      budgetNumber: 'ORC-2024-001',
      clientName: 'Pedro Oliveira',
      clientPhone: '11965432109',
      vehiclePlate: 'DEF-9012',
      items: [
        {
          id: '1',
          type: 'product',
          name: 'Óleo Motor 5W30',
          quantity: 4,
          price: 45.90
        },
        {
          id: '2',
          type: 'service',
          name: 'Troca de óleo',
          quantity: 1,
          price: 80.00
        }
      ],
      total: 263.60,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 172800000).toISOString() // 2 dias
    }
  ]
};

async function criarDadosTeste() {
  console.log('\n🔧 CRIANDO DADOS DE TESTE\n');
  console.log('='.repeat(60) + '\n');

  let totalCriados = 0;

  for (const [colecao, dados] of Object.entries(dadosTeste)) {
    console.log(`\n📦 Criando dados em: ${colecao}`);
    
    try {
      for (const item of dados) {
        const docRef = await db.collection(colecao).add(item);
        console.log(`   ✅ Criado: ${item.name || item.clientName || item.budgetNumber} (ID: ${docRef.id})`);
        totalCriados++;
      }
    } catch (error) {
      console.error(`   ❌ Erro ao criar em ${colecao}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Total de documentos criados: ${totalCriados}`);
  console.log('\n📋 Dados criados:');
  console.log(`   - ${dadosTeste.clients.length} clientes`);
  console.log(`   - ${dadosTeste.inventory.length} produtos no estoque`);
  console.log(`   - ${dadosTeste.checkins.length} check-ins`);
  console.log(`   - ${dadosTeste.budgets.length} orçamentos`);
  
  console.log('\n💡 Próximos passos:');
  console.log('   1. Fazer logout de todos os usuários');
  console.log('   2. Fazer login como Super Admin');
  console.log('   3. Verificar se os dados aparecem no sistema');
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Dados de teste criados com sucesso!\n');
}

// Executar
criarDadosTeste()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Erro ao criar dados de teste:', error);
    process.exit(1);
  });
