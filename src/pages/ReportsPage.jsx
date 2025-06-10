import React from 'react';

const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Relatórios e Análises
        </h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Gerar Relatório
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório de Vendas
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Análise detalhada das vendas por período.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full">
            Visualizar
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório de Estoque
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Controle e movimentação do estoque.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full">
            Visualizar
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório de Produção
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Acompanhamento da montagem de motos.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full">
            Visualizar
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório de Equipe
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Produtividade e presença da equipe.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full">
            Visualizar
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório Financeiro
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Análise de receitas e despesas.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full">
            Visualizar
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório de Clientes
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Análise do comportamento dos clientes.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full">
            Visualizar
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Dashboard Executivo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">R$ 0,00</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Receita do Mês</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Motos Vendidas</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Clientes Ativos</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">0%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Taxa de Crescimento</p>
          </div>
        </div>
        
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Gráficos serão exibidos aqui
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;