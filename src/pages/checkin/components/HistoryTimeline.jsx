/**
 * HistoryTimeline - Timeline de histórico de retornos
 * Busca registros anteriores da mesma placa
 */

import { useState, useEffect } from 'react';

import { Clock, Wrench, FileText, Calendar, MapPin } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useEmpresa } from '../../../contexts/EmpresaContext';

const HistoryTimeline = ({ placa }) => {
  const { isDarkMode } = useThemeStore();
  const { empresaId } = useEmpresa();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (placa && empresaId) {
      loadHistory();
    }
  }, [placa, empresaId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const checkinsRef = collection(db, 'checkins');
      const q = query(
        checkinsRef,
        where('empresaId', '==', empresaId),
        where('placa', '==', placa.toUpperCase()),
        orderBy('dataHora', 'desc'),
        limit(5)

      const snapshot = await getDocs(q);
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setHistory(records);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getServiceIcon = (services) => {
    if (!services || services.length === 0) return Wrench;
    // Você pode adicionar lógica para retornar ícones diferentes baseado no tipo de serviço
    return Wrench;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          rounded-2xl border-2 p-6
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          shadow-xl
        `}
      >
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </motion.div>
  );
}

if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          rounded-2xl border-2 p-6
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          shadow-xl
        `}
      >
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Histórico de Atendimentos
        </h3>
        
        <div className={`
          flex flex-col items-center justify-center p-8 rounded-lg
          ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'}
        `}>
          <Clock className={`w-12 h-12 mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Primeira visita registrada
          </p>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Este veículo não possui histórico anterior
          </p>
        </div>
      </motion.div>
  );
}

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        rounded-2xl border-2 p-6
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        shadow-xl
      `}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Histórico de Atendimentos
        </h3>
        
        <span className={`
          text-xs font-medium px-3 py-1 rounded-full
          ${isDarkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'}
        `}>
          {history.length} {history.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Linha vertical */}
        <div className={`
          absolute left-6 top-0 bottom-0 w-0.5
          ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
        `} />

        {/* Itens da timeline */}
        <div className="space-y-6">
          {history.map((record, index) => {
            const ServiceIcon = getServiceIcon(record.servicosSelecionados);
            
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Ícone na timeline */}
                <div className={`
                  absolute left-0 w-12 h-12 rounded-full
                  flex items-center justify-center
                  ${isDarkMode ? 'bg-blue-600/20 border-2 border-blue-600' : 'bg-blue-100 border-2 border-blue-500'}
                `}>
                  <ServiceIcon className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>

                {/* Card do registro */}
                <div className={`
                  p-4 rounded-lg border-2 transition-all hover:shadow-md
                  ${isDarkMode 
                    ? 'bg-gray-700/50 border-gray-700 hover:border-gray-600' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }
                `}>
                  {/* Data e hora */}
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {formatDate(record.dataHora)}
                    </span>
                  </div>

                  {/* Serviços */}
                  {record.servicosSelecionados && record.servicosSelecionados.length > 0 && (
                    <div className="mb-2">
                      <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Serviços realizados:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {record.servicosSelecionados.slice(0, 3).map((service, idx) => (
                          <span
                            key={idx}
                            className={`
                              text-xs px-2 py-1 rounded-full
                              ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}
                            `}
                          >
                            {service}
                          </span>
                        ))}
                        {record.servicosSelecionados.length > 3 && (
                          <span className={`text-xs px-2 py-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            +{record.servicosSelecionados.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Localização */}
                  {record.localizacao?.cidade && (
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className={`w-3 h-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {record.localizacao.cidade}, {record.localizacao.estado}
                      </span>
                    </div>
                  )}

                  {/* Observações */}
                  {record.observacoes && (
                    <div className={`
                      mt-3 pt-3 border-t
                      ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}
                    `}>
                      <div className="flex items-start gap-2">
                        <FileText className={`w-4 h-4 mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {record.observacoes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

          })}
        </div>
      </div>

      {/* Indicador de mais registros */}
      {history.length >= 5 && (
        <div className={`
          mt-6 text-center text-xs
          ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}
        `}>
          Mostrando os 5 registros mais recentes
        </div>
      )}
    </motion.div>
  );
};

export default HistoryTimeline;
