import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import LoaderAnimado from './LoaderAnimado';

const GraficoFinanceiro = () => {
  const [dados, setDados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [periodo, setPeriodo] = useState('7dias'); // 7dias, 30dias, 90dias

  useEffect(() => {
    carregarDadosFinanceiros();
  }, [periodo]);

  const carregarDadosFinanceiros = async () => {
    setIsLoading(true);
    try {
      // Calcular data inicial baseada no período
      const hoje = new Date();
      const diasAtras = periodo === '7dias' ? 7 : periodo === '30dias' ? 30 : 90;
      const dataInicial = new Date(hoje);
      dataInicial.setDate(dataInicial.getDate() - diasAtras);

      // Buscar check-ins concluídos no período
      const checkinsRef = collection(db, 'checkins');
      const q = query(
        checkinsRef,
        where('status', '==', 'completed'),
        where('checkOutDate', '>=', dataInicial.toISOString())
      );

      const snapshot = await getDocs(q);
      
      // Agrupar por data
      const dadosPorData = {};
      
      snapshot.forEach(doc => {
        const checkin = doc.data();
        const data = new Date(checkin.checkOutDate).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit'
        });
        
        if (!dadosPorData[data]) {
          dadosPorData[data] = {
            data,
            receita: 0,
            servicos: 0
          };
        }
        
        dadosPorData[data].receita += checkin.totalCost || 0;
        dadosPorData[data].servicos += 1;
      });

      // Converter para array e ordenar
      const dadosArray = Object.values(dadosPorData).sort((a, b) => {
        const [diaA, mesA] = a.data.split('/');
        const [diaB, mesB] = b.data.split('/');
        return new Date(2024, mesA - 1, diaA) - new Date(2024, mesB - 1, diaB);
      });

      setDados(dadosArray);
    } catch (error) {
      console.error('[GraficoFinanceiro] Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calcularTotal = () => {
    return dados.reduce((acc, item) => acc + item.receita, 0);
  };

  const calcularMedia = () => {
    if (dados.length === 0) return 0;
    return calcularTotal() / dados.length;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <LoaderAnimado tipo="chart" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Receita
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Últimos {periodo === '7dias' ? '7' : periodo === '30dias' ? '30' : '90'} dias
            </p>
          </div>
        </div>

        {/* Seletor de Período */}
        <div className="flex gap-2">
          {['7dias', '30dias', '90dias'].map(p => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                periodo === p
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {p === '7dias' ? '7D' : p === '30dias' ? '30D' : '90D'}
            </button>
          ))}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(calcularTotal())}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Média Diária</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(calcularMedia())}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      {dados.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dados}>
            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="data" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => [
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value),
                'Receita'
              ]}
            />
            <Area
              type="monotone"
              dataKey="receita"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#colorReceita)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
          Nenhum dado disponível para o período selecionado
        </div>
      )}
    </motion.div>
  );
};

export default GraficoFinanceiro;
