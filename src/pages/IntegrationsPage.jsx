import { useState, useEffect } from 'react';
import { Link2, Calendar, Save, RotateCcw } from 'lucide-react';
import { useAuthStore } from '../store';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';

const IntegrationsPage = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [scheduleIntegrations, setScheduleIntegrations] = useState({
    showEmployeeName: true,
    showResponsibilities: true,
    enableColorCustomization: true,
    defaultColor: '#3B82F6',
    urgentColor: '#EF4444',
    highColor: '#F97316',
    normalColor: '#3B82F6',
    lowColor: '#6B7280',
  });

  useEffect(() => {
    loadIntegrations();
  }, [user]);

  const loadIntegrations = async () => {
    if (!user?.organizationId) return;
    
    setIsLoading(true);
    try {
      const docRef = doc(db, 'integrations', user.organizationId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setScheduleIntegrations({
          ...scheduleIntegrations,
          ...data.schedule
        });
      }
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.organizationId) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsSaving(true);
    try {
      const docRef = doc(db, 'integrations', user.organizationId);
      await setDoc(docRef, {
        schedule: scheduleIntegrations,
        updatedAt: new Date().toISOString(),
        updatedBy: user.uid
      }, { merge: true });
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar integrações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setScheduleIntegrations({
      showEmployeeName: true,
      showResponsibilities: true,
      enableColorCustomization: true,
      defaultColor: '#3B82F6',
      urgentColor: '#EF4444',
      highColor: '#F97316',
      normalColor: '#3B82F6',
      lowColor: '#6B7280',
    });
    toast.success('Configurações resetadas para o padrão');
  };

  const handleToggle = (field) => {
    setScheduleIntegrations({
      ...scheduleIntegrations,
      [field]: !scheduleIntegrations[field]
    });
  };

  const handleColorChange = (field, value) => {
    setScheduleIntegrations({
      ...scheduleIntegrations,
      [field]: value
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando integrações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Integrações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure as integrações e personalizações do sistema
        </p>
      </div>

      {/* Integração com Agenda */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6">
          <div className="flex items-center gap-3 text-white">
            <Calendar className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Agenda e Cronograma</h2>
              <p className="text-blue-100 mt-1">Personalize a exibição e funcionalidades da agenda</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Funcionalidades de Exibição */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-600" />
              Funcionalidades de Exibição
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Mostrar Nome do Funcionário</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Exibe o nome do funcionário responsável dentro do card de agendamento
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleIntegrations.showEmployeeName}
                    onChange={() => handleToggle('showEmployeeName')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Mostrar Responsabilidades</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Exibe as responsabilidades e tarefas atribuídas ao agendamento
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleIntegrations.showResponsibilities}
                    onChange={() => handleToggle('showResponsibilities')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Personalização de Cores</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permite customizar as cores dos agendamentos por prioridade
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduleIntegrations.enableColorCustomization}
                    onChange={() => handleToggle('enableColorCustomization')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Personalização de Cores */}
          {scheduleIntegrations.enableColorCustomization && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cores por Prioridade
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Cor Padrão
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={scheduleIntegrations.defaultColor}
                      onChange={(e) => handleColorChange('defaultColor', e.target.value)}
                      className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={scheduleIntegrations.defaultColor}
                      onChange={(e) => handleColorChange('defaultColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Urgente
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={scheduleIntegrations.urgentColor}
                      onChange={(e) => handleColorChange('urgentColor', e.target.value)}
                      className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={scheduleIntegrations.urgentColor}
                      onChange={(e) => handleColorChange('urgentColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Alta Prioridade
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={scheduleIntegrations.highColor}
                      onChange={(e) => handleColorChange('highColor', e.target.value)}
                      className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={scheduleIntegrations.highColor}
                      onChange={(e) => handleColorChange('highColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Normal
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={scheduleIntegrations.normalColor}
                      onChange={(e) => handleColorChange('normalColor', e.target.value)}
                      className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={scheduleIntegrations.normalColor}
                      onChange={(e) => handleColorChange('normalColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Baixa Prioridade
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={scheduleIntegrations.lowColor}
                      onChange={(e) => handleColorChange('lowColor', e.target.value)}
                      className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={scheduleIntegrations.lowColor}
                      onChange={(e) => handleColorChange('lowColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsPage;
