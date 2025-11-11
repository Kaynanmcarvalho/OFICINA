/**
 * CheckinPage - Página principal de check-in inteligente
 * Integra todos os componentes e gerencia o fluxo completo
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

import { useThemeStore } from '../../store/themeStore';
import { useEmpresa } from '../../contexts/EmpresaContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Componentes
import PlateSearch from './components/PlateSearch';
import VehicleInfoPanel from './components/VehicleInfoPanel';
import VehicleVisual from './components/VehicleVisual';
import TechnicalPanel from './components/TechnicalPanel';
import PhotoUploadSection from './components/PhotoUploadSection';
import ServiceSuggestions from './components/ServiceSuggestions';
import Checklist from './components/Checklist';
import HistoryTimeline from './components/HistoryTimeline';
import FinalizeModal from './components/FinalizeModal';

const CheckinPage = () => {
  const { isDarkMode } = useThemeStore();
  const { empresaId } = useEmpresa();
  
  // Estados principais
  const [placa, setPlaca] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [checklistResults, setChecklistResults] = useState([]);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePlacaSearch = (placaValue, data) => {
    setPlaca(placaValue);
    setVehicleData(data);
  };

  const handleFinalize = async (finalData) => {
    setSaving(true);
    
    try {
      const checkinData = {
        empresaId,
        placa: placa.toUpperCase(),
        marca: vehicleData?.marca || '',
        modelo: vehicleData?.modelo || '',
        ano: vehicleData?.ano || '',
        cor: vehicleData?.cor || '',
        fotosEntrada: photos,
        servicosSelecionados: selectedServices,
        checklist: checklistResults,
        localizacao: finalData.localizacao,
        pinRetirada: finalData.pinRetirada,
        observacoes: finalData.observacoes || '',
        dataHora: serverTimestamp(),
        status: 'em_atendimento',
        criadoEm: serverTimestamp()
      };

      const checkinsRef = collection(db, 'checkins');
      await addDoc(checkinsRef, checkinData);

      console.log('Check-in salvo com sucesso!');
      
      // Aguarda um pouco para o usuário ver o PIN
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset do formulário
      resetForm();
      
    } catch (error) {
      console.error('Erro ao salvar check-in:', error);
      alert('Erro ao salvar check-in. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setPlaca('');
    setVehicleData(null);
    setPhotos([]);
    setSelectedServices([]);
    setChecklistResults([]);
    setShowFinalizeModal(false);
  };

  const canFinalize = () => {
    return placa && vehicleData && photos.length > 0;
  };

  return (
    <div className={`
      min-h-screen transition-colors duration-200
      ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
    `}>
      {/* Header */}
      <div className={`
        sticky top-0 z-10 backdrop-blur-lg border-b
        ${isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Check-in de Veículos
            </h1>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sistema inteligente de entrada de veículos com reconhecimento automático
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Busca por placa */}
          <PlateSearch onSearch={handlePlacaSearch} />

          {/* Conteúdo principal - aparece após buscar placa */}
          {vehicleData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Grid principal - 2 colunas em desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna esquerda - 2/3 */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Painel de informações do veículo */}
                  <VehicleInfoPanel vehicleData={vehicleData} />

                  {/* Visual do veículo */}
                  <VehicleVisual vehicleData={vehicleData} />

                  {/* Upload de fotos */}
                  <PhotoUploadSection
                    vehicleData={vehicleData}
                    placa={placa}
                    onPhotosChange={setPhotos}
                  />

                  {/* Sugestões de serviços */}
                  <ServiceSuggestions
                    vehicleData={vehicleData}
                    onServicesChange={setSelectedServices}
                  />

                  {/* Checklist */}
                  <Checklist
                    vehicleData={vehicleData}
                    onChecklistChange={setChecklistResults}
                  />
                </div>

                {/* Coluna direita - 1/3 */}
                <div className="space-y-8">
                  {/* Painel técnico */}
                  <TechnicalPanel vehicleData={vehicleData} />

                  {/* Histórico */}
                  <HistoryTimeline placa={placa} />
                </div>
              </div>

              {/* Botão de finalizar - fixo no bottom em mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  sticky bottom-4 z-10
                  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
                  rounded-2xl shadow-2xl border-2
                  ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
                  p-6
                `}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Pronto para finalizar?
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {photos.length} foto(s) • {selectedServices.length} serviço(s) • {checklistResults.filter(r => r.status).length} itens verificados
                    </p>
                  </div>

                  <button
                    onClick={() => setShowFinalizeModal(true)}
                    disabled={!canFinalize() || saving}
                    className={`
                      px-8 py-3 rounded-xl font-semibold transition-all
                      ${canFinalize() && !saving
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {saving ? 'Salvando...' : 'Finalizar Check-in'}
                  </button>
                </div>

                {!canFinalize() && (
                  <div className={`
                    mt-4 p-3 rounded-lg text-sm
                    ${isDarkMode ? 'bg-yellow-600/20 text-yellow-300' : 'bg-yellow-50 text-yellow-800'}
                  `}>
                    ⚠️ Adicione pelo menos uma foto para finalizar o check-in
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Estado vazio */}
          {!vehicleData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                flex flex-col items-center justify-center py-20 px-4
                rounded-2xl border-2 border-dashed
                ${isDarkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-300 bg-gray-50'}
              `}
            >
              <div className={`
                w-20 h-20 rounded-full mb-6 flex items-center justify-center
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
              `}>
                <svg
                  className={`w-10 h-10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Nenhum veículo selecionado
              </h3>
              
              <p className={`text-sm text-center max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Digite a placa do veículo acima para iniciar o check-in inteligente.
                O sistema buscará automaticamente as informações do veículo.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal de finalização */}
      <FinalizeModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onFinalize={handleFinalize}
        vehicleData={vehicleData}
        placa={placa}
      />
    </div>
  );
};

export default CheckinPage;
