/**
 * TORQ - Cloud Functions para Validação de Caixa
 * 
 * Validações server-side para garantir integridade financeira
 * e prevenir fraudes no módulo de caixa.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Inicializar Admin SDK se ainda não foi inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ============================================================================
// CONSTANTES
// ============================================================================

const LIMITE_DIFERENCA_ALERTA = 50;
const LIMITE_DIFERENCA_CRITICO = 200;
const LIMITE_DIFERENCA_BLOQUEIO = 500;
const LIMITE_SANGRIA_SEM_APROVACAO = 1000;
const LIMITE_REFORCO_SEM_APROVACAO = 500;

// ============================================================================
// VALIDAR ABERTURA DE CAIXA
// ============================================================================

exports.validarAberturaCaixa = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuário não autenticado'
    );
  }

  const { saldoInicial, turno, empresaId } = data;
  const userId = context.auth.uid;

  try {
    // 1. Verificar se usuário já tem caixa aberto
    const caixasAbertosQuery = await db.collection('caixas')
      .where('status', '==', 'aberto')
      .where('operadorAbertura.uid', '==', userId)
      .where('empresaId', '==', empresaId)
      .get();

    if (!caixasAbertosQuery.empty) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Você já tem um caixa aberto'
      );
    }

    // 2. Verificar se há caixa aberto no ponto de venda
    const caixasPDVQuery = await db.collection('caixas')
      .where('status', '==', 'aberto')
      .where('empresaId', '==', empresaId)
      .where('pontoVenda', '==', 'PDV_01')
      .get();

    if (!caixasPDVQuery.empty) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Já existe um caixa aberto neste ponto de venda'
      );
    }

    // 3. Validar saldo inicial com caixa anterior
    const caixaAnteriorQuery = await db.collection('caixas')
      .where('empresaId', '==', empresaId)
      .where('status', '==', 'fechado')
      .orderBy('dataFechamento', 'desc')
      .limit(1)
      .get();

    let alertaSaldoInicial = null;

    if (!caixaAnteriorQuery.empty) {
      const caixaAnterior = caixaAnteriorQuery.docs[0].data();
      const saldoEsperado = caixaAnterior.saldoContado || 0;
      const diferenca = Math.abs(saldoInicial - saldoEsperado);

      if (diferenca > 10) {
        alertaSaldoInicial = {
          tipo: 'aviso',
          mensagem: `Saldo inicial (R$ ${saldoInicial.toFixed(2)}) difere do saldo final do caixa anterior (R$ ${saldoEsperado.toFixed(2)})`,
          saldoEsperado,
          diferenca
        };
      }
    }

    return {
      success: true,
      validado: true,
      alertaSaldoInicial,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };
  } catch (error) {
    console.error('Erro ao validar abertura:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Erro ao validar abertura de caixa'
    );
  }
});

// ============================================================================
// VALIDAR FECHAMENTO DE CAIXA
// ============================================================================

exports.validarFechamentoCaixa = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { caixaId, saldoContado, autorizadoPor } = data;

  try {
    // Buscar caixa
    const caixaDoc = await db.collection('caixas').doc(caixaId).get();

    if (!caixaDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Caixa não encontrado');
    }

    const caixa = caixaDoc.data();

    if (caixa.status !== 'aberto') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Caixa não está aberto'
      );
    }

    // Calcular diferença
    const diferenca = saldoContado - caixa.saldoEsperado;
    const diferencaAbsoluta = Math.abs(diferenca);

    // Validar diferença
    const validacao = {
      nivel: 'ok',
      mensagem: 'Fechamento autorizado',
      requerAprovacao: false,
      bloqueado: false
    };

    if (diferencaAbsoluta >= LIMITE_DIFERENCA_BLOQUEIO) {
      validacao.nivel = 'bloqueado';
      validacao.mensagem = `Diferença muito alta (R$ ${diferencaAbsoluta.toFixed(2)}). Fechamento bloqueado.`;
      validacao.bloqueado = true;
    } else if (diferencaAbsoluta >= LIMITE_DIFERENCA_CRITICO) {
      validacao.nivel = 'critico';
      validacao.mensagem = `Diferença crítica (R$ ${diferencaAbsoluta.toFixed(2)}). Requer aprovação gerencial.`;
      validacao.requerAprovacao = true;

      if (!autorizadoPor) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Aprovação gerencial obrigatória para diferença crítica'
        );
      }
    } else if (diferencaAbsoluta >= LIMITE_DIFERENCA_ALERTA) {
      validacao.nivel = 'alerta';
      validacao.mensagem = `Diferença detectada (R$ ${diferencaAbsoluta.toFixed(2)}). Justificativa obrigatória.`;
    }

    // Validar integridade
    const movimentacoesQuery = await db.collection('caixa_movimentacoes')
      .where('caixaId', '==', caixaId)
      .orderBy('createdAt', 'asc')
      .get();

    let saldoCalculado = caixa.saldoInicial;

    movimentacoesQuery.forEach(doc => {
      const mov = doc.data();
      if (mov.tipo === 'venda' || mov.tipo === 'reforco') {
        saldoCalculado += mov.valor;
      } else if (mov.tipo === 'sangria') {
        saldoCalculado -= mov.valor;
      }
    });

    const diferencaIntegridade = Math.abs(saldoCalculado - caixa.saldoEsperado);
    const integro = diferencaIntegridade < 0.01;

    if (!integro) {
      validacao.avisoIntegridade = {
        tipo: 'erro',
        mensagem: `Inconsistência detectada. Saldo calculado: R$ ${saldoCalculado.toFixed(2)}, Saldo registrado: R$ ${caixa.saldoEsperado.toFixed(2)}`,
        diferenca: diferencaIntegridade
      };
    }

    return {
      success: true,
      validado: !validacao.bloqueado,
      validacao,
      diferenca,
      diferencaAbsoluta,
      integro,
      saldoCalculado,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };
  } catch (error) {
    console.error('Erro ao validar fechamento:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Erro ao validar fechamento de caixa'
    );
  }
});

// ============================================================================
// VALIDAR SANGRIA
// ============================================================================

exports.validarSangria = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { caixaId, valor, autorizadoPor } = data;

  try {
    const caixaDoc = await db.collection('caixas').doc(caixaId).get();

    if (!caixaDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Caixa não encontrado');
    }

    const caixa = caixaDoc.data();

    if (caixa.status !== 'aberto') {
      throw new functions.https.HttpsError('failed-precondition', 'Caixa não está aberto');
    }

    // Validar saldo suficiente
    if (valor > caixa.saldoEsperado) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        `Saldo insuficiente. Disponível: R$ ${caixa.saldoEsperado.toFixed(2)}`
      );
    }

    // Validar limite de sangria
    const validacao = {
      nivel: 'ok',
      mensagem: 'Sangria autorizada',
      requerAprovacao: false
    };

    if (valor >= LIMITE_SANGRIA_SEM_APROVACAO) {
      validacao.nivel = 'critico';
      validacao.mensagem = `Sangria alta (R$ ${valor.toFixed(2)}). Requer aprovação gerencial.`;
      validacao.requerAprovacao = true;

      if (!autorizadoPor) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Aprovação gerencial obrigatória para sangria alta'
        );
      }
    }

    return {
      success: true,
      validado: true,
      validacao,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };
  } catch (error) {
    console.error('Erro ao validar sangria:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Erro ao validar sangria'
    );
  }
});

// ============================================================================
// VALIDAR REFORÇO
// ============================================================================

exports.validarReforco = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado');
  }

  const { caixaId, valor, autorizadoPor } = data;

  try {
    const caixaDoc = await db.collection('caixas').doc(caixaId).get();

    if (!caixaDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Caixa não encontrado');
    }

    const caixa = caixaDoc.data();

    if (caixa.status !== 'aberto') {
      throw new functions.https.HttpsError('failed-precondition', 'Caixa não está aberto');
    }

    // Validar limite de reforço
    const validacao = {
      nivel: 'ok',
      mensagem: 'Reforço autorizado',
      requerAprovacao: false
    };

    if (valor >= LIMITE_REFORCO_SEM_APROVACAO) {
      validacao.nivel = 'alerta';
      validacao.mensagem = `Reforço alto (R$ ${valor.toFixed(2)}). Requer aprovação gerencial.`;
      validacao.requerAprovacao = true;

      if (!autorizadoPor) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Aprovação gerencial obrigatória para reforço alto'
        );
      }
    }

    return {
      success: true,
      validado: true,
      validacao,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };
  } catch (error) {
    console.error('Erro ao validar reforço:', error);
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'Erro ao validar reforço'
    );
  }
});

// ============================================================================
// TRIGGER: VALIDAR INTEGRIDADE AO FECHAR CAIXA
// ============================================================================

exports.onCaixaFechado = functions.firestore
  .document('caixas/{caixaId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Detectar fechamento
    if (before.status === 'aberto' && after.status === 'fechado') {
      const caixaId = context.params.caixaId;

      try {
        // Validar integridade
        const movimentacoesQuery = await db.collection('caixa_movimentacoes')
          .where('caixaId', '==', caixaId)
          .orderBy('createdAt', 'asc')
          .get();

        let saldoCalculado = after.saldoInicial;

        movimentacoesQuery.forEach(doc => {
          const mov = doc.data();
          if (mov.tipo === 'venda' || mov.tipo === 'reforco') {
            saldoCalculado += mov.valor;
          } else if (mov.tipo === 'sangria') {
            saldoCalculado -= mov.valor;
          }
        });

        const diferencaIntegridade = Math.abs(saldoCalculado - after.saldoEsperado);
        const integro = diferencaIntegridade < 0.01;

        // Atualizar caixa com resultado da validação
        await change.after.ref.update({
          validacaoIntegridade: {
            integro,
            saldoCalculado,
            saldoRegistrado: after.saldoEsperado,
            diferenca: diferencaIntegridade,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          }
        });

        // Se não estiver íntegro, criar alerta
        if (!integro) {
          await db.collection('alertas_caixa').add({
            tipo: 'integridade',
            nivel: 'critico',
            caixaId,
            caixaNumero: after.numero,
            empresaId: after.empresaId,
            mensagem: `Inconsistência detectada no caixa #${after.numero}`,
            diferenca: diferencaIntegridade,
            saldoCalculado,
            saldoRegistrado: after.saldoEsperado,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lido: false
          });
        }

        console.log(`Validação de integridade concluída para caixa ${caixaId}: ${integro ? 'ÍNTEGRO' : 'INCONSISTENTE'}`);
      } catch (error) {
        console.error('Erro ao validar integridade:', error);
      }
    }
  });

// ============================================================================
// TRIGGER: DETECTAR PADRÕES SUSPEITOS
// ============================================================================

exports.detectarPadroesSuspeitos = functions.firestore
  .document('caixas/{caixaId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Detectar fechamento
    if (before.status === 'aberto' && after.status === 'fechado') {
      const caixaId = context.params.caixaId;
      const diferenca = after.diferenca || 0;
      const diferencaAbsoluta = Math.abs(diferenca);

      try {
        // Buscar histórico de fechamentos do operador
        const historico = await db.collection('caixas')
          .where('operadorFechamento.uid', '==', after.operadorFechamento.uid)
          .where('status', '==', 'fechado')
          .orderBy('dataFechamento', 'desc')
          .limit(10)
          .get();

        const diferencas = [];
        historico.forEach(doc => {
          const data = doc.data();
          if (data.diferenca !== undefined) {
            diferencas.push(Math.abs(data.diferenca));
          }
        });

        // Calcular média e desvio padrão
        if (diferencas.length >= 3) {
          const media = diferencas.reduce((a, b) => a + b, 0) / diferencas.length;
          const variancia = diferencas.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / diferencas.length;
          const desvioPadrao = Math.sqrt(variancia);

          // Detectar anomalia (diferença > 2 desvios padrão)
          if (diferencaAbsoluta > media + (2 * desvioPadrao)) {
            await db.collection('alertas_caixa').add({
              tipo: 'anomalia',
              nivel: 'alerta',
              caixaId,
              caixaNumero: after.numero,
              empresaId: after.empresaId,
              operadorUid: after.operadorFechamento.uid,
              operadorNome: after.operadorFechamento.nome,
              mensagem: `Diferença anômala detectada no caixa #${after.numero}`,
              diferenca: diferencaAbsoluta,
              media,
              desvioPadrao,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              lido: false
            });
          }
        }
      } catch (error) {
        console.error('Erro ao detectar padrões suspeitos:', error);
      }
    }
  });
