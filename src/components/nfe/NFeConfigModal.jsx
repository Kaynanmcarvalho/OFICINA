import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useNFe } from '../../hooks/useNFe';

export default function NFeConfigModal({ config, onClose, onSave }) {
  const { updateConfig, loading } = useNFe();
  const [formData, setFormData] = useState(config || {
    empresa: {
      cnpj: '',
      razaoSocial: '',
      nomeFantasia: '',
      ie: '',
      crt: 1,
      endereco: {
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: 'SP',
        cep: ''
      }
    },
    series: { nfe: 1, nfce: 1 },
    proximoNumero: { nfe: 1, nfce: 1 },
    ambiente: 'homologacao',
    estado: 'SP',
    fiscal: {
      cfopPadrao: '5102',
      aliquotaICMS: 18,
      aliquotaPIS: 1.65,
      aliquotaCOFINS: 7.6,
      aliquotaISS: 5
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateConfig(formData);
      alert('Configuração salva com sucesso!');
      onSave();
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const updateField = (path, value) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setFormData(newData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuração de NF-e
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Dados da Empresa */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Dados da Empresa</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={formData.empresa.cnpj}
                  onChange={(e) => updateField('empresa.cnpj', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Inscrição Estadual *
                </label>
                <input
                  type="text"
                  value={formData.empresa.ie}
                  onChange={(e) => updateField('empresa.ie', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Razão Social *
                </label>
                <input
                  type="text"
                  value={formData.empresa.razaoSocial}
                  onChange={(e) => updateField('empresa.razaoSocial', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  value={formData.empresa.nomeFantasia}
                  onChange={(e) => updateField('empresa.nomeFantasia', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  value={formData.empresa.endereco.cep}
                  onChange={(e) => updateField('empresa.endereco.cep', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  UF *
                </label>
                <select
                  value={formData.empresa.endereco.uf}
                  onChange={(e) => updateField('empresa.endereco.uf', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                  {/* Adicionar outros estados */}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Logradouro *
                </label>
                <input
                  type="text"
                  value={formData.empresa.endereco.logradouro}
                  onChange={(e) => updateField('empresa.endereco.logradouro', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Configurações Fiscais */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Configurações Fiscais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CFOP Padrão
                </label>
                <input
                  type="text"
                  value={formData.fiscal.cfopPadrao}
                  onChange={(e) => updateField('fiscal.cfopPadrao', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alíquota ICMS (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.fiscal.aliquotaICMS}
                  onChange={(e) => updateField('fiscal.aliquotaICMS', parseFloat(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Ambiente */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Ambiente</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="homologacao"
                  checked={formData.ambiente === 'homologacao'}
                  onChange={(e) => updateField('ambiente', e.target.value)}
                />
                <span className="text-gray-700 dark:text-gray-300">Homologação</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="producao"
                  checked={formData.ambiente === 'producao'}
                  onChange={(e) => updateField('ambiente', e.target.value)}
                />
                <span className="text-gray-700 dark:text-gray-300">Produção</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Configuração
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
