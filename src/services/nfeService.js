/**
 * NF-e Service
 * Serviço de geração e gerenciamento de Notas Fiscais Eletrônicas
 */

import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc,
  updateDoc,
  query, 
  where, 
  orderBy,
  Timestamp
} from 'firebase/firestore';

/**
 * Gera XML da NF-e
 */
export function generateNFeXML(nfeData) {
  const { emitente, destinatario, itens, totais, numero, serie, chaveAcesso } = nfeData;
  
  // Simplificado - em produção usar biblioteca específica
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${chaveAcesso}">
    <ide>
      <cUF>${emitente.endereco.uf}</cUF>
      <nNF>${numero}</nNF>
      <serie>${serie}</serie>
      <mod>55</mod>
      <tpNF>1</tpNF>
      <dhEmi>${new Date().toISOString()}</dhEmi>
    </ide>
    <emit>
      <CNPJ>${emitente.cnpj}</CNPJ>
      <xNome>${emitente.razaoSocial}</xNome>
      <xFant>${emitente.nomeFantasia}</xFant>
      <IE>${emitente.ie}</IE>
      <enderEmit>
        <xLgr>${emitente.endereco.logradouro}</xLgr>
        <nro>${emitente.endereco.numero}</nro>
        <xBairro>${emitente.endereco.bairro}</xBairro>
        <xMun>${emitente.endereco.cidade}</xMun>
        <UF>${emitente.endereco.uf}</UF>
        <CEP>${emitente.endereco.cep}</CEP>
      </enderEmit>
    </emit>
    <dest>
      <CPF>${destinatario.cpfCnpj}</CPF>
      <xNome>${destinatario.nome}</xNome>
      <enderDest>
        <xLgr>${destinatario.endereco.logradouro}</xLgr>
        <nro>${destinatario.endereco.numero}</nro>
        <xBairro>${destinatario.endereco.bairro}</xBairro>
        <xMun>${destinatario.endereco.cidade}</xMun>
        <UF>${destinatario.endereco.uf}</UF>
        <CEP>${destinatario.endereco.cep}</CEP>
      </enderDest>
    </dest>
    <det>
      ${itens.map((item, index) => `
      <det nItem="${index + 1}">
        <prod>
          <cProd>${item.codigo}</cProd>
          <xProd>${item.descricao}</xProd>
          <NCM>${item.ncm}</NCM>
          <CFOP>${item.cfop}</CFOP>
          <uCom>${item.unidade}</uCom>
          <qCom>${item.quantidade}</qCom>
          <vUnCom>${item.valorUnitario.toFixed(2)}</vUnCom>
          <vProd>${item.valorTotal.toFixed(2)}</vProd>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <orig>0</orig>
              <CST>00</CST>
              <vBC>${item.valorTotal.toFixed(2)}</vBC>
              <pICMS>${item.impostos.icms.aliquota}</pICMS>
              <vICMS>${item.impostos.icms.valor.toFixed(2)}</vICMS>
            </ICMS00>
          </ICMS>
        </imposto>
      </det>
      `).join('')}
    </det>
    <total>
      <ICMSTot>
        <vBC>${totais.baseCalculo.toFixed(2)}</vBC>
        <vICMS>${totais.valorICMS.toFixed(2)}</vICMS>
        <vNF>${totais.valorTotal.toFixed(2)}</vNF>
      </ICMSTot>
    </total>
  </infNFe>
</NFe>`;

  return xml;
}

/**
 * Gera chave de acesso da NF-e (44 dígitos)
 */
export function generateChaveAcesso(nfeData) {
  const { emitente, numero, serie } = nfeData;
  const uf = getUFCode(emitente.endereco.uf);
  const aamm = new Date().toISOString().slice(2, 7).replace('-', '');
  const cnpj = emitente.cnpj.replace(/\D/g, '');
  const mod = '55';
  const serieFormatted = serie.toString().padStart(3, '0');
  const numeroFormatted = numero.toString().padStart(9, '0');
  const tpEmis = '1';
  const cNF = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  
  const chave = `${uf}${aamm}${cnpj}${mod}${serieFormatted}${numeroFormatted}${tpEmis}${cNF}`;
  const dv = calculateDV(chave);
  
  return chave + dv;
}

/**
 * Calcula dígito verificador da chave
 */
function calculateDV(chave) {
  const weights = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  
  for (let i = 0; i < chave.length; i++) {
    sum += parseInt(chave[i]) * weights[i];
  }
  
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Obtém código da UF
 */
function getUFCode(uf) {
  const codes = {
    'AC': '12', 'AL': '27', 'AP': '16', 'AM': '13', 'BA': '29',
    'CE': '23', 'DF': '53', 'ES': '32', 'GO': '52', 'MA': '21',
    'MT': '51', 'MS': '50', 'MG': '31', 'PA': '15', 'PB': '25',
    'PR': '41', 'PE': '26', 'PI': '22', 'RJ': '33', 'RN': '24',
    'RS': '43', 'RO': '11', 'RR': '14', 'SC': '42', 'SP': '35',
    'SE': '28', 'TO': '17'
  };
  return codes[uf] || '35';
}

/**
 * Calcula impostos
 */
export function calculateTaxes(item, config) {
  const { valorTotal } = item;
  const { aliquotaICMS, aliquotaPIS, aliquotaCOFINS, aliquotaISS } = config.fiscal;
  
  return {
    icms: {
      aliquota: aliquotaICMS,
      valor: valorTotal * (aliquotaICMS / 100)
    },
    pis: {
      aliquota: aliquotaPIS,
      valor: valorTotal * (aliquotaPIS / 100)
    },
    cofins: {
      aliquota: aliquotaCOFINS,
      valor: valorTotal * (aliquotaCOFINS / 100)
    },
    iss: {
      aliquota: aliquotaISS,
      valor: valorTotal * (aliquotaISS / 100)
    }
  };
}

/**
 * Cria NF-e a partir de orçamento
 */
export async function createNFeFromBudget(budgetId, empresaId) {
  try {
    // 1. Buscar orçamento
    const budgetRef = doc(db, `empresas/${empresaId}/orcamentos`, budgetId);
    const budgetSnap = await getDoc(budgetRef);
    
    if (!budgetSnap.exists()) {
      throw new Error('Orçamento não encontrado');
    }
    
    const budget = { id: budgetSnap.id, ...budgetSnap.data() };
    
    // 2. Buscar configuração da empresa
    const configRef = doc(db, `empresas/${empresaId}/nfe_config`, empresaId);
    const configSnap = await getDoc(configRef);
    
    if (!configSnap.exists()) {
      throw new Error('Configuração de NF-e não encontrada. Configure primeiro.');
    }
    
    const config = configSnap.data();
    
    // 3. Obter próximo número
    const numero = config.proximoNumero.nfe;
    const serie = config.series.nfe;
    
    // 4. Preparar dados da NF-e
    const nfeData = {
      empresaId,
      budgetId,
      numero,
      serie,
      tipo: 'saida',
      modelo: '55',
      emitente: config.empresa,
      destinatario: {
        cpfCnpj: budget.cliente.cpf || budget.cliente.cnpj,
        nome: budget.cliente.nome,
        endereco: budget.cliente.endereco || {},
        email: budget.cliente.email,
        telefone: budget.cliente.telefone
      },
      itens: budget.itens.map((item, index) => ({
        numero: index + 1,
        codigo: item.codigo || `ITEM${index + 1}`,
        descricao: item.descricao,
        ncm: item.ncm || '00000000',
        cfop: config.fiscal.cfopPadrao,
        unidade: item.unidade || 'UN',
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorTotal,
        impostos: calculateTaxes(item, config)
      })),
      totais: calculateTotals(budget.itens, config),
      status: 'pendente',
      ambiente: config.ambiente,
      createdAt: Timestamp.now(),
      createdBy: budget.createdBy
    };
    
    // 5. Gerar chave de acesso
    nfeData.chaveAcesso = generateChaveAcesso(nfeData);
    
    // 6. Gerar XML
    nfeData.xmlGerado = generateNFeXML(nfeData);
    
    // 7. Salvar NF-e
    const nfeRef = doc(collection(db, `empresas/${empresaId}/nfe`));
    await setDoc(nfeRef, nfeData);
    
    // 8. Atualizar próximo número
    await updateDoc(configRef, {
      'proximoNumero.nfe': numero + 1
    });
    
    // 9. Atualizar orçamento
    await updateDoc(budgetRef, {
      nfeId: nfeRef.id,
      nfeStatus: 'pendente'
    });
    
    return { id: nfeRef.id, ...nfeData };
  } catch (error) {
    console.error('Erro ao criar NF-e:', error);
    throw error;
  }
}

/**
 * Calcula totais da NF-e
 */
function calculateTotals(itens, config) {
  let baseCalculo = 0;
  let valorICMS = 0;
  let valorPIS = 0;
  let valorCOFINS = 0;
  let valorISS = 0;
  let valorTotal = 0;
  
  itens.forEach(item => {
    const impostos = calculateTaxes(item, config);
    baseCalculo += item.valorTotal;
    valorICMS += impostos.icms.valor;
    valorPIS += impostos.pis.valor;
    valorCOFINS += impostos.cofins.valor;
    valorISS += impostos.iss.valor;
    valorTotal += item.valorTotal;
  });
  
  return {
    baseCalculo,
    valorICMS,
    valorPIS,
    valorCOFINS,
    valorISS,
    valorTotal
  };
}

/**
 * Assina XML (simulado - em produção usar certificado real)
 */
export async function signXML(xml, empresaId) {
  try {
    // Em produção, usar node-forge ou similar com certificado A1
    // Por enquanto, apenas retorna o XML com tag de assinatura simulada
    const signedXML = xml.replace('</NFe>', `
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
    </SignedInfo>
    <SignatureValue>SIMULADO_${Date.now()}</SignatureValue>
  </Signature>
</NFe>`);
    
    return signedXML;
  } catch (error) {
    console.error('Erro ao assinar XML:', error);
    throw error;
  }
}

/**
 * Envia NF-e para SEFAZ (simulado)
 */
export async function sendToSEFAZ(nfeId, empresaId) {
  try {
    const nfeRef = doc(db, `empresas/${empresaId}/nfe`, nfeId);
    const nfeSnap = await getDoc(nfeRef);
    
    if (!nfeSnap.exists()) {
      throw new Error('NF-e não encontrada');
    }
    
    const nfe = nfeSnap.data();
    
    // Atualizar status para processando
    await updateDoc(nfeRef, {
      status: 'processando',
      updatedAt: Timestamp.now()
    });
    
    // Assinar XML
    const xmlAssinado = await signXML(nfe.xmlGerado, empresaId);
    
    // Simular envio para SEFAZ
    // Em produção, fazer requisição SOAP real
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular resposta da SEFAZ (90% de sucesso)
    const success = Math.random() > 0.1;
    
    if (success) {
      const protocolo = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      await updateDoc(nfeRef, {
        status: 'autorizada',
        xmlAssinado,
        protocolo,
        dataAutorizacao: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return { success: true, protocolo };
    } else {
      const motivo = 'Erro de validação: Campo obrigatório não informado';
      
      await updateDoc(nfeRef, {
        status: 'rejeitada',
        xmlAssinado,
        motivoRejeicao: motivo,
        updatedAt: Timestamp.now()
      });
      
      throw new Error(motivo);
    }
  } catch (error) {
    console.error('Erro ao enviar para SEFAZ:', error);
    
    // Atualizar status para erro
    const nfeRef = doc(db, `empresas/${empresaId}/nfe`, nfeId);
    await updateDoc(nfeRef, {
      status: 'rejeitada',
      motivoRejeicao: error.message,
      updatedAt: Timestamp.now()
    });
    
    throw error;
  }
}

/**
 * Gera DANFE (PDF) - simulado
 */
export async function generateDANFE(nfeId, empresaId) {
  try {
    const nfeRef = doc(db, `empresas/${empresaId}/nfe`, nfeId);
    const nfeSnap = await getDoc(nfeRef);
    
    if (!nfeSnap.exists()) {
      throw new Error('NF-e não encontrada');
    }
    
    const nfe = nfeSnap.data();
    
    // Em produção, usar pdfkit ou similar
    // Por enquanto, retornar URL simulada
    const danfePdf = `https://storage.googleapis.com/torq-nfe/danfe_${nfeId}.pdf`;
    
    await updateDoc(nfeRef, {
      danfePdf,
      updatedAt: Timestamp.now()
    });
    
    return danfePdf;
  } catch (error) {
    console.error('Erro ao gerar DANFE:', error);
    throw error;
  }
}

/**
 * Busca NF-e por ID
 */
export async function getNFe(nfeId, empresaId) {
  try {
    const nfeRef = doc(db, `empresas/${empresaId}/nfe`, nfeId);
    const nfeSnap = await getDoc(nfeRef);
    
    if (nfeSnap.exists()) {
      return { id: nfeSnap.id, ...nfeSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar NF-e:', error);
    throw error;
  }
}

/**
 * Lista todas as NF-es
 */
export async function listNFes(empresaId, filters = {}) {
  try {
    let q = collection(db, `empresas/${empresaId}/nfe`);
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao listar NF-es:', error);
    throw error;
  }
}

/**
 * Cancela NF-e
 */
export async function cancelNFe(nfeId, empresaId, motivo) {
  try {
    const nfeRef = doc(db, `empresas/${empresaId}/nfe`, nfeId);
    const nfeSnap = await getDoc(nfeRef);
    
    if (!nfeSnap.exists()) {
      throw new Error('NF-e não encontrada');
    }
    
    const nfe = nfeSnap.data();
    
    if (nfe.status !== 'autorizada') {
      throw new Error('Apenas NF-es autorizadas podem ser canceladas');
    }
    
    // Verificar prazo de 24h
    const horasDiff = (Date.now() - nfe.dataAutorizacao.toMillis()) / (1000 * 60 * 60);
    if (horasDiff > 24) {
      throw new Error('Prazo de cancelamento expirado (24h)');
    }
    
    // Simular envio de evento de cancelamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await updateDoc(nfeRef, {
      status: 'cancelada',
      motivoCancelamento: motivo,
      dataCancelamento: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao cancelar NF-e:', error);
    throw error;
  }
}

/**
 * Salva configuração de NF-e
 */
export async function saveNFeConfig(empresaId, config) {
  try {
    const configRef = doc(db, `empresas/${empresaId}/nfe_config`, empresaId);
    
    const configData = {
      ...config,
      updatedAt: Timestamp.now()
    };
    
    if (!config.createdAt) {
      configData.createdAt = Timestamp.now();
    }
    
    await setDoc(configRef, configData, { merge: true });
    
    return configData;
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    throw error;
  }
}

/**
 * Busca configuração de NF-e
 */
export async function getNFeConfig(empresaId) {
  try {
    const configRef = doc(db, `empresas/${empresaId}/nfe_config`, empresaId);
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      return configSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    throw error;
  }
}
