import React from 'react';
import clsx from 'clsx';

const ToggleSwitch = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        checked ? 'bg-green-600' : 'bg-gray-300'
      )}
    >
      <span
        className={clsx(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  </div>
);

const PermissoesNF = ({ config, updateConfig }) => {
  return (
    <div className="space-y-4">
      <ToggleSwitch
        checked={!!config.nfeAtivo}
        onChange={(value) => updateConfig('nfeAtivo', value)}
        label="Ativar Emissão de NFe"
        description="Habilita a emissão de Nota Fiscal Eletrônica (NFe)"
      />

      <ToggleSwitch
        checked={!!config.nfceAtivo}
        onChange={(value) => updateConfig('nfceAtivo', value)}
        label="Ativar Emissão de NFCe"
        description="Habilita a emissão de Nota Fiscal de Consumidor Eletrônica (NFCe)"
      />
    </div>
  );
};

export default PermissoesNF;
