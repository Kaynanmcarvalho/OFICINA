/**
 * Script para adicionar compatibilidades de exemplo
 * Execução: node scripts/addSampleCompatibility.js
 */

const admin = require('firebase-admin');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

// Dados de exemplo de compatibilidades comuns
const sampleCompatibilities = [
  {
    partName: 'Filtro de Óleo',
    categoria: 'Filtros',
    fabricante: 'Mann Filter',
    codigosOE: ['HF303', '15410-MCJ-505'],
    vehicles: [
      { marca: 'Honda', modelo: 'CG 160', tipo: 'motos', anoInicio: 2015, anoFim: 2024 },
      { marca: 'Honda', modelo: 'Bros 160', tipo: 'motos', anoInicio: 2015, anoFim: 2024 }
    ],
    evidencias: [
      {
        tipo: 'OEM',
        descricao: 'Catálogo oficial Honda 2024',
        data: new Date().toISOString()
      },
      {
        tipo: 'Marketplace',
        descricao: 'Confirmado em 50+ anúncios Mercado Livre',
        data: new Date().toISOString()
      }
    ]
  },
  {
    partName: 'Pastilha de Freio Dianteira',
    categoria: 'Freios',
    fabricante: 'Cobreq',
    codigosOE: ['N-1080'],
    vehicles: [
      { marca: 'Fiat', modelo: 'Argo', tipo: 'carros', anoInicio: 2017, anoFim: 2024 },
      { marca: 'Fiat', modelo: 'Cronos', tipo: 'carros', anoInicio: 2018, anoFim: 2024 }
    ],
    evidencias: [
      {
        tipo: 'OEM',
        descricao: 'Manual do proprietário Fiat',
        data: new Date().toISOString()
      }
    ]
  },
  {
    partName: 'Vela de Ignição',
    categoria: 'Motor',
    fabricante: 'NGK',
    codigosOE: ['CR8EH-9', 'CPR8EA-9'],
    vehicles: [
      { marca: 'Yamaha', modelo: 'Factor 150', tipo: 'motos', anoInicio: 2016, anoFim: 2024 },
      { marca: 'Yamaha', modelo: 'Fazer 150', tipo: 'motos', anoInicio: 2016, anoFim: 2024 }
    ],
    evidencias: [
      {
        tipo: 'OEM',
        descricao: 'Catálogo NGK oficial',
        data: new Date().toISOString()
      },
      {
        tipo: 'Forum',
        descricao: 'Confirmado por usuários em fórum Yamaha Club',
        data: new Date().toISOString()
      }
    ]
  }
];

async function addSampleData() {
  console.log('🚀 Adicionando compatibilidades de exemplo...\n');

  for (const sample of sampleCompatibilities) {
    console.log(`📦 Processando: ${sample.partName}`);

    // Criar ou buscar a peça
    let partId;
    const existingPart = await db.collection('parts')
      .where('nome', '==', sample.partName)
      .limit(1)
      .get();

    if (existingPart.empty) {
      const partRef = await db.collection('parts').add({
        nome: sample.partName,
        categoria: sample.categoria,
        fabricante: sample.fabricante,
        codigosOE: sample.codigosOE,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      partId = partRef.id;
      console.log(`   ✓ Peça criada: ${partId}`);
    } else {
      partId = existingPart.docs[0].id;
      console.log(`   ℹ Peça já existe: ${partId}`);
    }

    // Adicionar compatibilidades para cada veículo
    for (const vehicle of sample.vehicles) {
      // Buscar ou criar veículo
      let vehicleId;
      const existingVehicle = await db.collection('vehicles')
        .where('marca', '==', vehicle.marca)
        .where('modelo', '==', vehicle.modelo)
        .where('tipo', '==', vehicle.tipo)
        .limit(1)
        .get();

      if (existingVehicle.empty) {
        const vehicleRef = await db.collection('vehicles').add({
          marca: vehicle.marca,
          modelo: vehicle.modelo,
          anoInicio: vehicle.anoInicio,
          anoFim: vehicle.anoFim,
          tipo: vehicle.tipo,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        vehicleId = vehicleRef.id;
        console.log(`   ✓ Veículo criado: ${vehicle.marca} ${vehicle.modelo}`);
      } else {
        vehicleId = existingVehicle.docs[0].id;
      }

      // Verificar se compatibilidade já existe
      const existingCompat = await db.collection('compatibility')
        .where('partId', '==', partId)
        .where('vehicleId', '==', vehicleId)
        .limit(1)
        .get();

      if (existingCompat.empty) {
        await db.collection('compatibility').add({
          partId,
          vehicleId,
          anoInicio: vehicle.anoInicio,
          anoFim: vehicle.anoFim,
          fonte: 'OEM',
          evidencias: sample.evidencias,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`   ✓ Compatibilidade adicionada: ${vehicle.marca} ${vehicle.modelo}`);
      }
    }

    console.log('');
  }

  console.log('✅ Dados de exemplo adicionados com sucesso!');
}

// Executar
addSampleData()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
