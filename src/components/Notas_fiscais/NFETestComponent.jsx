import React, { useState, useEffect } from 'react';
import { checkServerHealth } from '../../config/apiConfig';
import NFEService from '../../config/nfeApi';

const NFETestComponent = () => {
  const [serverStatus, setServerStatus] = useState(null);
  const [nfes, setNfes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [nfeService] = useState(new NFEService());

  // Verificar status do servidor ao carregar
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await checkServerHealth();
      setServerStatus(health);
    } catch (error) {
      console.error('Erro ao verificar saúde do servidor:', error);
    }
  };

  // Listar NFes
  const listarNFes = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await nfeService.listarNFes();
      if (result.success) {
        setNfes(result.data.nfes || []);
        setMessage(`${result.data.nfes?.length || 0} NFe(s) encontrada(s)`);
      } else {
        setMessage('Erro ao listar NFes: ' + result.message);
      }
    } catch (error) {
      setMessage('Erro ao listar NFes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Emitir NFe de teste
  const emitirNFeTest = async () => {
    setLoading(true);
    setMessage('');
    
    const nfeData = {
      emitente: {
        cnpj: "58959068000182",
        nome: "BRC ALIMENTOS LTDA",
        nome_fantasia: "BRC Alimentos",
        inscricao_estadual: "ISENTO",
        regime_tributario: 1,
        endereco: {
          logradouro: "Rua Exemplo",
          numero: "123",
          bairro: "Centro",
          municipio: "São Paulo",
          uf: "SP",
          cep: "01000000"
        },
        telefone: "11999999999",
        email: "contato@lojaplayfit.com.br"
      },
      destinatario: {
        cpf: "12345678901",
        nome: "Cliente Teste",
        endereco: {
          logradouro: "Rua do Cliente",
          numero: "456",
          bairro: "Vila Nova",
          municipio: "São Paulo",
          uf: "SP",
          cep: "02000000"
        },
        telefone: "11888888888",
        email: "cliente@email.com"
      },
      itens: [
        {
          numero_item: 1,
          codigo_produto: "WHEY001",
          descricao: "Whey Protein 1kg - Chocolate",
          ncm: "21069090",
          cfop: "5102",
          unidade_comercial: "UN",
          quantidade_comercial: 1,
          valor_unitario_comercial: 89.90,
          valor_total_bruto: 89.90,
          unidade_tributavel: "UN",
          quantidade_tributavel: 1,
          valor_unitario_tributavel: 89.90,
          icms: {
            origem: 0,
            situacao_tributaria: "102"
          },
          pis: {
            situacao_tributaria: "07"
          },
          cofins: {
            situacao_tributaria: "07"
          }
        }
      ],
      informacoes_adicionais: "Nota Fiscal de teste - Ambiente Sandbox",
      serie: 1,
      tipo_operacao: 1,
      finalidade_emissao: 1,
      consumidor_final: 1,
      presenca_comprador: 1
    };

    try {
      const result = await nfeService.emitirNFe(nfeData);
      if (result.success) {
        setMessage(`NFe emitida com sucesso! Chave: ${result.chave}`);
        // Atualizar lista após emissão
        await listarNFes();
      } else {
        setMessage('Erro ao emitir NFe: ' + result.message);
      }
    } catch (error) {
      setMessage('Erro ao emitir NFe: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Teste da API NFe - Backend Flask</h2>
      
      {/* Status do Servidor */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Status do Servidor</h3>
        {serverStatus ? (
          <div>
            <div className={`inline-block px-3 py-1 rounded text-sm ${
              serverStatus.nfeApi?.status === 'online' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              Backend Flask: {serverStatus.nfeApi?.status || 'offline'}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              URL: {serverStatus.nfeApi?.url}
            </p>
          </div>
        ) : (
          <p>Verificando...</p>
        )}
      </div>

      {/* Ações */}
      <div className="mb-6 space-x-4">
        <button
          onClick={listarNFes}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Listar NFes'}
        </button>
        
        <button
          onClick={emitirNFeTest}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Emitindo...' : 'Emitir NFe Teste'}
        </button>
        
        <button
          onClick={checkHealth}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Verificar Status
        </button>
      </div>

      {/* Mensagens */}
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('sucesso') 
            ? 'bg-green-100 text-green-800' 
            : message.includes('Erro') 
            ? 'bg-red-100 text-red-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      {/* Lista de NFes */}
      {nfes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">NFes Emitidas</h3>
          <div className="space-y-2">
            {nfes.map((nfe, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <p><strong>Chave:</strong> {nfe.chave_acesso}</p>
                <p><strong>Número:</strong> {nfe.numero}</p>
                <p><strong>Data:</strong> {new Date(nfe.data_emissao).toLocaleString()}</p>
                <p><strong>Status:</strong> {nfe.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFETestComponent;