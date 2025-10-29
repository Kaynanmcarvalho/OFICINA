import { motion } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const InsightsClientes = ({ insights }) => {
  if (!insights) {
    return null;
  }

  const dadosGrafico = [
    { name: 'Novos', value: insights.novosClientes, color: '#3b82f6' },
    { name: 'Recorrentes', value: insights.clientesRecorrentes, color: '#10b981' },
    { name: 'Inativos', value: insights.clientesInativos, color: '#ef4444' }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#ef4444'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Insights de Clientes
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Análise de comportamento
          </p>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Total
            </span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {insights.totalClientes}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Ticket Médio
            </span>
            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0
            }).format(insights.ticketMedio)}
          </p>
        </div>
      </div>

      {/* Gráfico de Pizza */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={dadosGrafico}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {dadosGrafico.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0];
                  const percentual = ((data.value / insights.totalClientes) * 100).toFixed(1);
                  return (
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: data.payload.color }}
                        />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {data.name}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {data.value} cliente{data.value !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percentual}% do total
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda Customizada com Percentuais */}
      <div className="space-y-3">
        {dadosGrafico.map((item, index) => {
          const percentual = ((item.value / insights.totalClientes) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({percentual}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clientes Mais Recorrentes */}
      {insights.clientesMaisRecorrentes && insights.clientesMaisRecorrentes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Top Clientes
          </h4>
          <motion.div
            className="space-y-2"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="initial"
            animate="animate"
          >
            {insights.clientesMaisRecorrentes.slice(0, 3).map((cliente, index) => {
              // Cores de badge para ranking
              const getBadgeGradient = (pos) => {
                if (pos === 0) return 'from-yellow-400 to-yellow-600'; // Ouro
                if (pos === 1) return 'from-gray-300 to-gray-500'; // Prata
                if (pos === 2) return 'from-orange-400 to-orange-600'; // Bronze
                return 'from-blue-500 to-purple-600';
              };

              return (
                <motion.div
                  key={index}
                  variants={{
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getBadgeGradient(index)} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                      {index + 1}º
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white block">
                        {cliente.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Última visita: {cliente.lastVisit}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900 dark:text-white block">
                      {cliente.totalServices}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      serviços
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InsightsClientes;
