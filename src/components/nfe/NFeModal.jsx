import React, { useState } from 'react';
import { X, Download, Send, XCircle } from 'lucide-react';
import { useNFe } from '../../hooks/useNFe';

export default function NFeModal({ nfe, onClose, onUpdate }) {
  const { send, generatePDF, cancel, loading } = useNFe(nfe.id);
  const [cancelMotivo, setCancelMotivo] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  const handleSend = async () => {
    try {
      await send();
      alert('NF-e enviada com sucesso!');
      onUpdate();
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const pdfUrl = await generatePDF();
      window.open(pdfUrl, '_blank');
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleCancel = async () => {
    if (!cancelMotivo.trim()) {
      alert('Informe o motivo do cancelamento');
      return;
    }
    try {
      await cancel(nfe.id, cancelMotivo);
      alert('NF-e cancelada com sucesso!');
      setShowCancelForm(false);
      onUpdate();
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return timestamp.toDate().toLocaleString('pt-BR');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              NF-e #{nfe.numero.toString().padStart(6, '0')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Chave: {nfe.chaveAcesso}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className={`p-4 rounded-lg ${
            nfe.status === 'autorizada' ? 'bg-green-50 dark:bg-green-900/20' :
            nfe.status === 'rejeitada' ? 'bg-red-50 dark:bg-red-900/20' :
            'bg-yellow-50 dark:bg-yellow-900/20'
          }`}>
            <p className="font-semibold text-gray-900 dark:text-white mb-2">
              Status: {nfe.status.toUpperCase()}
            </p>
            {nfe.protocolo && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Protocolo: {nfe.protocolo}
              </p>
            )}
            {nfe.motivoRejeicao && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Motivo: {nfe.motivoRejeicao}
              </p>
            )}
          </div>

          {/* Destinatário */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Destinatário</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white font-medium">{nfe.destinatario.nome}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">CPF/CNPJ: {nfe.destinatario.cpfCnpj}</p>
            </div>
          </div>

          {/* Itens */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Itens ({nfe.itens.length})</h3>
            <div className="space-y-2">
              {nfe.itens.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-gray-900 dark:text-white">{item.descricao}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      R$ {item.valorTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.quantidade} {item.unidade} × R$ {item.valorUnitario.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totais */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                R$ {nfe.totais.baseCalculo.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700 dark:text-gray-300">Impostos:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                R$ {(nfe.totais.valorICMS + nfe.totais.valorPIS + nfe.totais.valorCOFINS).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
              <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                R$ {nfe.totais.valorTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Cancelamento */}
          {showCancelForm && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-3">Cancelar NF-e</h3>
              <textarea
                value={cancelMotivo}
                onChange={(e) => setCancelMotivo(e.target.value)}
                placeholder="Motivo do cancelamento (mínimo 15 caracteres)"
                className="w-full p-3 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={3}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Confirmar Cancelamento
                </button>
                <button
                  onClick={() => setShowCancelForm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
          {nfe.status === 'pendente' && (
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar para SEFAZ
            </button>
          )}
          {nfe.status === 'autorizada' && (
            <>
              <button
                onClick={handleGeneratePDF}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar DANFE
              </button>
              <button
                onClick={() => setShowCancelForm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancelar NF-e
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
