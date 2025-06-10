import React from 'react';

const SchedulePage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Agenda e Cronograma
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie horários, agendamentos e cronogramas da oficina
        </p>
      </div>

      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Agendamentos Hoje
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">8</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">+2 desde ontem</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Esta Semana
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">32</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">85% ocupação</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Próximo Mês
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">124</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">62% ocupação</p>
        </div>
      </div>

      {/* Calendar and Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Calendário
            </h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                Hoje
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                Semana
              </button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                Mês
              </button>
            </div>
          </div>
          
          {/* Calendar placeholder */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => (
                <div key={i} className="aspect-square flex items-center justify-center text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  {i % 31 + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Agenda de Hoje
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              + Novo Agendamento
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Schedule items */}
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">09:00 - Revisão Honda CB600</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente: João Silva</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">11:30 - Montagem Yamaha R3</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente: Maria Santos</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">14:00 - Manutenção Kawasaki Z400</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente: Pedro Costa</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">16:30 - Customização Harley Davidson</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente: Ana Oliveira</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Cronograma Semanal
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Horário</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Segunda</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Terça</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Quarta</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Quinta</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Sexta</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Sábado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">08:00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Revisão</span></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Montagem</span></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Manutenção</span></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Customização</span></td>
                <td className="py-3 px-4"></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">10:00</td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Revisão</span></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Montagem</span></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Manutenção</span></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Customização</span></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">14:00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Montagem</span></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Revisão</span></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Customização</span></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Manutenção</span></td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">16:00</td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Manutenção</span></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Customização</span></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Montagem</span></td>
                <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Revisão</span></td>
                <td className="py-3 px-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;