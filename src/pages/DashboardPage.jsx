
const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Check-ins Hoje
          </h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Clientes Ativos
          </h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Estoque Baixo
          </h3>
          <p className="text-3xl font-bold text-yellow-600">0</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Veículos em Montagem
          </h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Bem-vindo ao Sistema de Gestão da Oficina
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Este é o painel principal onde você pode acompanhar todas as atividades da oficina.
          Use o menu de navegação para acessar as diferentes funcionalidades do sistema.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;