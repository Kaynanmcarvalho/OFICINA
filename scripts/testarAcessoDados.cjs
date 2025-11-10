/**
 * Script de Teste - Verificar Acesso aos Dados
 * Testa se Super Admins conseguem acessar dados antigos
 * E se empresas conseguem acessar apenas seus dados isolados
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Verificar se arquivo de credenciais existe
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('\n❌ ERRO: Arquivo serviceAccountKey.json não encontrado!');
  console.error('\n📋 Para obter as credenciais:');
  console.error('   1. Acesse: https://console.firebase.google.com/');
  console.error('   2. Selecione seu projeto');
  console.error('   3. Vá em: Project Settings > Service Accounts');
  console.error('   4. Clique em "Generate new private key"');
  console.error('   5. Salve o arquivo como "serviceAccountKey.json" na raiz do projeto\n');
  process.exit(1);
}

// Inicializar Firebase Admin
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function testarAcessoDados() {
  console.log('\n' + colors.bright + colors.cyan + '🧪 TESTE DE ACESSO AOS DADOS' + colors.reset);
  console.log('='.repeat(70) + '\n');

  // Coleções para testar
  const colecoes = [
    { nome: 'clients', descricao: 'Clientes (inglês - dados antigos)' },
    { nome: 'clientes', descricao: 'Clientes (português - dados novos)' },
    { nome: 'checkins', descricao: 'Check-ins' },
    { nome: 'budgets', descricao: 'Orçamentos (inglês - dados antigos)' },
    { nome: 'orcamentos', descricao: 'Orçamentos (português - dados novos)' },
    { nome: 'inventory', descricao: 'Estoque (inglês - dados antigos)' },
    { nome: 'estoque', descricao: 'Estoque (português - dados novos)' },
    { nome: 'vehicles', descricao: 'Veículos (inglês - dados antigos)' },
    { nome: 'veiculos', descricao: 'Veículos (português - dados novos)' },
    { nome: 'tools', descricao: 'Ferramentas (inglês - dados antigos)' },
    { nome: 'ferramentas', descricao: 'Ferramentas (português - dados novos)' }
  ];

  const resultados = {
    raiz: {},
    empresas: {}
  };

  console.log(colors.bright + '📦 TESTANDO COLEÇÕES NA RAIZ (Dados Antigos)' + colors.reset);
  console.log('-'.repeat(70) + '\n');

  // Testar coleções na raiz
  for (const colecao of colecoes) {
    try {
      const snapshot = await db.collection(colecao.nome).limit(5).get();
      const count = snapshot.size;
      
      if (count > 0) {
        console.log(colors.green + `✅ ${colecao.nome}` + colors.reset + ` - ${count} documento(s)`);
        console.log(`   ${colors.cyan}${colecao.descricao}${colors.reset}`);
        
        // Mostrar exemplos
        snapshot.docs.forEach((doc, index) => {
          const data = doc.data();
          const nome = data.name || data.nome || data.clientName || data.nomeCliente || 'Sem nome';
          console.log(`   ${index + 1}. ${nome} (ID: ${doc.id})`);
        });
        
        resultados.raiz[colecao.nome] = count;
      } else {
        console.log(colors.yellow + `⚠️  ${colecao.nome}` + colors.reset + ` - Vazio`);
      }
      console.log('');
    } catch (error) {
      console.log(colors.red + `❌ ${colecao.nome}` + colors.reset + ` - Erro: ${error.message}\n`);
    }
  }

  // Testar estrutura multi-tenant
  console.log('\n' + colors.bright + '🏢 TESTANDO ESTRUTURA MULTI-TENANT (Dados Isolados)' + colors.reset);
  console.log('-'.repeat(70) + '\n');

  try {
    const empresasSnapshot = await db.collection('empresas').limit(5).get();
    
    if (empresasSnapshot.empty) {
      console.log(colors.yellow + '⚠️  Nenhuma empresa encontrada na coleção "empresas"' + colors.reset + '\n');
    } else {
      console.log(colors.green + `✅ Encontradas ${empresasSnapshot.size} empresa(s)` + colors.reset + '\n');
      
      for (const empresaDoc of empresasSnapshot.docs) {
        const empresaData = empresaDoc.data();
        const empresaId = empresaDoc.id;
        const nomeEmpresa = empresaData.nomeFantasia || empresaData.razaoSocial || 'Sem nome';
        
        console.log(colors.bright + `\n📊 Empresa: ${nomeEmpresa}` + colors.reset);
        console.log(`   ID: ${empresaId}`);
        console.log(`   Status: ${empresaData.ativo ? colors.green + 'Ativa' : colors.red + 'Inativa'}${colors.reset}`);
        console.log('');
        
        resultados.empresas[empresaId] = {
          nome: nomeEmpresa,
          colecoes: {}
        };
        
        // Testar subcoleções da empresa
        const subcolecoes = ['clientes', 'checkins', 'orcamentos', 'estoque', 'veiculos', 'ferramentas'];
        
        for (const subcolecao of subcolecoes) {
          try {
            const subSnapshot = await db
              .collection('empresas')
              .doc(empresaId)
              .collection(subcolecao)
              .limit(3)
              .get();
            
            const subCount = subSnapshot.size;
            
            if (subCount > 0) {
              console.log(`   ${colors.green}✅ ${subcolecao}${colors.reset}: ${subCount} documento(s)`);
              
              subSnapshot.docs.forEach((doc, index) => {
                const data = doc.data();
                const nome = data.name || data.nome || data.clientName || data.nomeCliente || 'Sem nome';
                console.log(`      ${index + 1}. ${nome}`);
              });
              
              resultados.empresas[empresaId].colecoes[subcolecao] = subCount;
            } else {
              console.log(`   ${colors.yellow}⚠️  ${subcolecao}${colors.reset}: Vazio`);
            }
          } catch (error) {
            console.log(`   ${colors.red}❌ ${subcolecao}${colors.reset}: Erro - ${error.message}`);
          }
        }
      }
    }
  } catch (error) {
    console.log(colors.red + `❌ Erro ao acessar empresas: ${error.message}` + colors.reset + '\n');
  }

  // Resumo final
  console.log('\n' + '='.repeat(70));
  console.log(colors.bright + colors.cyan + '\n📊 RESUMO DO TESTE' + colors.reset + '\n');
  
  const totalRaiz = Object.values(resultados.raiz).reduce((sum, count) => sum + count, 0);
  const colecoesRaizComDados = Object.keys(resultados.raiz).length;
  
  console.log(colors.bright + '📦 Dados na Raiz (Super Admins):' + colors.reset);
  console.log(`   Total de documentos: ${totalRaiz}`);
  console.log(`   Coleções com dados: ${colecoesRaizComDados}`);
  
  if (totalRaiz > 0) {
    console.log(colors.green + '\n   ✅ Super Admins PODEM acessar dados antigos!' + colors.reset);
    console.log('\n   Coleções disponíveis:');
    Object.entries(resultados.raiz).forEach(([colecao, count]) => {
      console.log(`      - ${colecao}: ${count} documento(s)`);
    });
  } else {
    console.log(colors.red + '\n   ❌ Nenhum dado antigo encontrado!' + colors.reset);
    console.log(colors.yellow + '   ⚠️  Super Admins não terão dados para visualizar' + colors.reset);
  }
  
  console.log('\n' + colors.bright + '🏢 Dados Isolados (Empresas):' + colors.reset);
  const totalEmpresas = Object.keys(resultados.empresas).length;
  console.log(`   Total de empresas: ${totalEmpresas}`);
  
  if (totalEmpresas > 0) {
    console.log(colors.green + '\n   ✅ Sistema multi-tenant funcionando!' + colors.reset);
    
    Object.entries(resultados.empresas).forEach(([empresaId, dados]) => {
      const totalDocs = Object.values(dados.colecoes).reduce((sum, count) => sum + count, 0);
      console.log(`\n   📊 ${dados.nome}:`);
      console.log(`      Total de documentos: ${totalDocs}`);
      if (totalDocs > 0) {
        Object.entries(dados.colecoes).forEach(([colecao, count]) => {
          console.log(`         - ${colecao}: ${count} documento(s)`);
        });
      }
    });
  } else {
    console.log(colors.yellow + '\n   ⚠️  Nenhuma empresa cadastrada ainda' + colors.reset);
  }

  // Recomendações
  console.log('\n' + '='.repeat(70));
  console.log(colors.bright + colors.cyan + '\n💡 RECOMENDAÇÕES' + colors.reset + '\n');
  
  if (totalRaiz === 0) {
    console.log(colors.yellow + '⚠️  ATENÇÃO: Nenhum dado antigo encontrado!' + colors.reset);
    console.log('\nOpções:');
    console.log('   1. Migrar dados de outra estrutura para a raiz');
    console.log('   2. Atribuir empresaId aos Super Admins');
    console.log('   3. Criar dados de teste na raiz');
  } else {
    console.log(colors.green + '✅ Dados antigos encontrados!' + colors.reset);
    console.log('\nPróximos passos:');
    console.log('   1. Fazer logout de todos os usuários');
    console.log('   2. Fazer login como Super Admin');
    console.log('   3. Verificar se os dados aparecem no sistema');
  }
  
  if (totalEmpresas === 0) {
    console.log('\n' + colors.yellow + '⚠️  Nenhuma empresa cadastrada' + colors.reset);
    console.log('\nPara criar empresas:');
    console.log('   1. Fazer login como Super Admin');
    console.log('   2. Acessar "Gerenciar Empresas"');
    console.log('   3. Criar nova empresa via onboarding');
  }

  console.log('\n' + '='.repeat(70));
  console.log(colors.green + '\n✅ Teste concluído!' + colors.reset + '\n');
}

// Executar
testarAcessoDados()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error(colors.red + '\n❌ Erro ao executar teste:' + colors.reset, error);
    process.exit(1);
  });
