/**
 * Exemplo de Integração - Compatibilidade de Peças no Check-in
 * 
 * Este arquivo mostra como integrar o sistema de compatibilidade
 * de peças na página de check-in do TORQ AI.
 * 
 * @example
 * // No ModalCheckinPremium.jsx, adicione:
 * import { PartsCompatibilityPanel } from '@/features/parts-compatibility';
 * 
 * // Dentro do modal, após selecionar o veículo:
 * {selectedVehicle && (
 *   <PartsCompatibilityPanel
 *     vehicleBrand={selectedVehicle.marca}
 *     vehicleModel={selectedVehicle.modelo}
 *     vehicleYear={selectedVehicle.ano}
 *     onPartSelect={handlePartSelect}
 *   />
 * )}
 */

import React, { useState } from 'react';
import { PartsCompatibilityPanel, VehicleSearchPanel } from '../index';
import type { PartData, VehicleSearchResult } from '../services/partsFullService';

interface CheckinIntegrationExampleProps {
  // Dados do veículo do check-in
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  // Callback quando uma peça é selecionada
  onPartSelect?: (part: PartData) => void;
  // Callback para adicionar peça ao orçamento
  onAddToBudget?: (part: PartData) => void;
}

export function CheckinIntegrationExample({
  vehicleBrand,
  vehicleModel,
  vehicleYear,
  onPartSelect,
  onAddToBudget,
}: CheckinIntegrationExampleProps) {
  const [selectedPart, setSelectedPart] = useState<PartData | null>(null);
  const [showPartsPanel, setShowPartsPanel] = useState(false);

  const handlePartSelect = (part: PartData) => {
    setSelectedPart(part);
    onPartSelect?.(part);
  };

  const handleAddToBudget = () => {
    if (selectedPart) {
      onAddToBudget?.(selectedPart);
      setSelectedPart(null);
    }
  };

  // Se não tem veículo selecionado, mostra mensagem
  if (!vehicleBrand || !vehicleModel || !vehicleYear) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Selecione um veículo para ver as peças compatíveis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botão para mostrar/esconder painel de peças */}
      <button
        onClick={() => setShowPartsPanel(!showPartsPanel)}
        className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <span>🔧</span>
        {showPartsPanel ? 'Ocultar Peças Compatíveis' : 'Ver Peças Compatíveis'}
      </button>

      {/* Painel de peças */}
      {showPartsPanel && (
        <PartsCompatibilityPanel
          vehicleBrand={vehicleBrand}
          vehicleModel={vehicleModel}
          vehicleYear={vehicleYear}
          onPartSelect={handlePartSelect}
          className="mt-4"
        />
      )}

      {/* Modal de confirmação para adicionar ao orçamento */}
      {selectedPart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Adicionar ao Orçamento?
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
              <p className="font-mono text-blue-600 dark:text-blue-400">
                {selectedPart.partNumber}
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedPart.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedPart.brand}
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
                R$ {selectedPart.avgPrice?.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPart(null)}
                className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddToBudget}
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Exemplo de uso completo com busca de veículos
 */
export function FullPartsSearchExample() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleSearchResult | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Sistema de Compatibilidade de Peças
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Painel de busca */}
          <VehicleSearchPanel
            onVehicleSelect={setSelectedVehicle}
          />

          {/* Painel de peças */}
          {selectedVehicle ? (
            <PartsCompatibilityPanel
              vehicleId={selectedVehicle.vehicleId}
              onPartSelect={(part) => console.log('Peça selecionada:', part)}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Selecione um veículo na busca para ver as peças compatíveis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckinIntegrationExample;
