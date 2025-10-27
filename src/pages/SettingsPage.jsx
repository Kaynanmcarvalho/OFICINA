import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore, useAuthStore, useOrganizationStore, useSettingsStore } from '../store/index.jsx';
import { MdDarkMode, MdLightMode, MdLanguage, MdBusiness, MdLocationOn, MdPhone, MdEmail, MdSchedule, MdEdit, MdSave, MdCancel, MdWarning } from 'react-icons/md';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { organization, fetchOrganization, updateOrganization, isLoading: orgLoading, error } = useOrganizationStore();
  const { settings, fetchSettings, updateSettings, isLoading: settingsLoading } = useSettingsStore();

  const [workshopData, setWorkshopData] = useState({
    workshopName: '',
    address: '',
    phone: '',
    email: '',
    openingTime: '',
    closingTime: '',
  });

  const [preferences, setPreferences] = useState({
    theme: 'auto',
    language: 'pt-BR',
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    appointmentReminders: true,
  });

  const [isEditingWorkshop, setIsEditingWorkshop] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = user?.role === 'admin';
  const loading = orgLoading || settingsLoading;

  useEffect(() => {
    if (user?.organizationId) {
      fetchOrganization(user.organizationId);
    }
    if (user?.uid) {
      fetchSettings(user.uid);
    }
  }, [user, fetchOrganization, fetchSettings]);

  useEffect(() => {
    if (organization) {
      setWorkshopData({
        workshopName: organization.name || '',
        address: organization.address || '',
        phone: organization.phone || '',
        email: organization.email || '',
        openingTime: organization.openingTime || '',
        closingTime: organization.closingTime || '',
      });
    }
  }, [organization]);

  useEffect(() => {
    if (settings) {
      setPreferences({
        theme: settings.theme || 'auto',
        language: settings.language || 'pt-BR',
        emailNotifications: settings.emailNotifications ?? true,
        pushNotifications: settings.pushNotifications ?? true,
        lowStockAlerts: settings.lowStockAlerts ?? true,
        appointmentReminders: settings.appointmentReminders ?? true,
      });
    }
  }, [settings]);

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleWorkshopSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Apenas administradores podem editar essas informações.');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateOrganization(user.organizationId, {
        name: workshopData.workshopName,
        address: workshopData.address,
        phone: workshopData.phone,
        email: workshopData.email,
        openingTime: workshopData.openingTime,
        closingTime: workshopData.closingTime,
      });

      if (result.success) {
        setIsEditingWorkshop(false);
        toast.success('Dados da oficina salvos com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar dados da oficina:', error);
      toast.error('Erro ao salvar dados da oficina.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const result = await updateSettings(user.uid, preferences);

      if (result.success) {
        // Aplicar o tema imediatamente
        if (preferences.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (preferences.theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // Auto - detectar preferência do sistema
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        
        // Aplicar o idioma imediatamente
        if (preferences.language) {
          i18n.changeLanguage(preferences.language);
          localStorage.setItem('i18nextLng', preferences.language);
        }
        
        toast.success('Preferências salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast.error('Erro ao salvar preferências.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie as configurações do sistema e preferências da oficina
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Categorias
            </h2>
            <nav className="space-y-2">
              <a href="#general" className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">
                <span className="mr-3">⚙️</span>
                Geral
              </a>
              <a href="#notifications" className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <span className="mr-3">🔔</span>
                Notificações
              </a>
              <a href="#security" className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <span className="mr-3">🔒</span>
                Segurança
              </a>
              <a href="/integrations" className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <span className="mr-3">🔗</span>
                Integrações
              </a>
              <a href="#backup" className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <span className="mr-3">💾</span>
                Backup
              </a>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div id="general" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <MdBusiness className="mr-2" />
                Informações da Oficina
              </h2>
              {isAdmin && !isEditingWorkshop ? (
                <button
                  onClick={() => setIsEditingWorkshop(true)}
                  className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <MdEdit className="mr-1" />
                  Editar
                </button>
              ) : isAdmin && isEditingWorkshop ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditingWorkshop(false)}
                    className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <MdCancel className="mr-1" />
                    Cancelar
                  </button>
                </div>
              ) : null}
            </div>

            {!isAdmin && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center text-yellow-800 dark:text-yellow-200">
                  <MdWarning className="mr-2" />
                  <span className="text-sm">Apenas administradores podem editar essas informações.</span>
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-4">
                <span className="text-gray-500">Carregando...</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleWorkshopSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Oficina
                </label>
                <input
                  type="text"
                  value={workshopData.workshopName}
                  onChange={(e) => setWorkshopData({ ...workshopData, workshopName: e.target.value })}
                  disabled={!isAdmin || !isEditingWorkshop}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                  placeholder="Digite o nome da oficina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  value={workshopData.address}
                  onChange={(e) => setWorkshopData({ ...workshopData, address: e.target.value })}
                  disabled={!isAdmin || !isEditingWorkshop}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                  placeholder="Digite o endereço completo"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={workshopData.phone}
                    onChange={(e) => setWorkshopData({ ...workshopData, phone: e.target.value })}
                    disabled={!isAdmin || !isEditingWorkshop}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={workshopData.email}
                    onChange={(e) => setWorkshopData({ ...workshopData, email: e.target.value })}
                    disabled={!isAdmin || !isEditingWorkshop}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                    placeholder="contato@oficina.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Horário de Funcionamento
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Abertura</label>
                    <input
                      type="time"
                      value={workshopData.openingTime}
                      onChange={(e) => setWorkshopData({ ...workshopData, openingTime: e.target.value })}
                      disabled={!isAdmin || !isEditingWorkshop}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Fechamento</label>
                    <input
                      type="time"
                      value={workshopData.closingTime}
                      onChange={(e) => setWorkshopData({ ...workshopData, closingTime: e.target.value })}
                      disabled={!isAdmin || !isEditingWorkshop}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {isAdmin && isEditingWorkshop && (
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MdSave className="mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Informações da Oficina'}
                </button>
              )}
            </form>
          </div>

          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Aparência
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tema
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={preferences.theme === 'light'}
                      onChange={handlePreferenceChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Claro</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={preferences.theme === 'dark'}
                      onChange={handlePreferenceChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Escuro</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value="auto"
                      checked={preferences.theme === 'auto'}
                      onChange={handlePreferenceChange}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Automático</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Idioma
                </label>
                <select
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferenceChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div id="notifications" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Notificações
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notificações por Email</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receber notificações importantes por email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notificações Push</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receber notificações no navegador</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={preferences.pushNotifications}
                    onChange={handlePreferenceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Alertas de Estoque Baixo</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Notificar quando itens estiverem com estoque baixo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="lowStockAlerts"
                    checked={preferences.lowStockAlerts}
                    onChange={handlePreferenceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Lembretes de Agendamento</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Lembrar sobre agendamentos próximos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="appointmentReminders"
                    checked={preferences.appointmentReminders}
                    onChange={handlePreferenceChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <form onSubmit={handlePreferencesSubmit}>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  if (settings) {
                    setPreferences({
                      theme: settings.theme || 'auto',
                      language: settings.language || 'pt-BR',
                      emailNotifications: settings.emailNotifications ?? true,
                      pushNotifications: settings.pushNotifications ?? true,
                      lowStockAlerts: settings.lowStockAlerts ?? true,
                      appointmentReminders: settings.appointmentReminders ?? true,
                    });
                  }
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving || loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;