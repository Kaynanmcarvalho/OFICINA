/**
 * Script para popular a coleção /vehicles com dados da API FIPE
 * Execução: node scripts/populateVehiclesFromFIPE.js
 */

const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v1';

const VEHICLE_TYPES = {
  CARRO: 'carros',
  MOTO: 'motos',
  CAMINHAO: 'caminhoes'
};

// Delay para evitar rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchBrands(tipo) {
  const response = await fetch(`${FIPE_BASE_URL}/${tipo}/marcas`);
  return await response.json();
}

async function fetchModels(tipo, brandId) {
  const response = await fetch(`${FIPE_BASE_URL}/${tipo}/marcas/${brandId}/modelos`);
  const data = await response.json();
  return data.modelos || [];
}

async function fetchYears(tipo, brandId, modelId) {
  const response = await fetch(
    `${FIPE_BASE_URL}/${tipo}/marcas/${brandId}/modelos/${modelId}/anos`
  );
  return await response.json();
}

async function populateVehicles() {
  console.log('🚀 Iniciando população de veículos...\n');

  let totalVehicles = 0;

  for (const [typeName, typeValue] of Object.entries(VEHICLE_TYPES)) {
    console.log(`\n📦 Processando ${typeName}...`);

    try {
      const brands = await fetchBrands(typeValue);
      console.log(`   Encontradas ${brands.length} marcas`);

      for (const brand of brands.slice(0, 10)) { // Limitar para teste
        console.log(`   ├─ ${brand.nome}`);
        
        await delay(100); // Evitar rate limiting
        const models = await fetchModels(typeValue, brand.codigo);
        
        for (const model of models.slice(0, 5)) { // Limitar para teste
          await delay(100);
          const years = await fetchYears(typeValue, brand.codigo, model.codigo);
          
          if (years.length > 0) {
            // Extrair ano inicial e final
            const yearNumbers = years
              .map(y => parseInt(y.nome.split('-')[0]))
              .filter(y => !isNaN(y));
            
            const anoInicio = Math.min(...yearNumbers);
            const anoFim = Math.max(...yearNumbers);

            // Verificar se já existe
            const existingQuery = await db.collection('vehicles')
              .where('marca', '==', brand.nome)
              .where('modelo', '==', model.nome)
              .where('tipo', '==', typeValue)
              .limit(1)
              .get();

            if (existingQuery.empty) {
              await db.collection('vehicles').add({
                marca: brand.nome,
                modelo: model.nome,
                anoInicio,
                anoFim,
                tipo: typeValue,
                fipeData: {
                  marcaId: brand.codigo,
                  modeloId: model.codigo
                },
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
              });

              totalVehicles++;
              console.log(`      ✓ ${model.nome} (${anoInicio}-${anoFim})`);
            }
          }
        }
      }
    } catch (error) {
      console.error(`   ✗ Erro ao processar ${typeName}:`, error.message);
    }
  }

  console.log(`\n✅ Concluído! ${totalVehicles} veículos adicionados.`);
}

// Executar
populateVehicles()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
