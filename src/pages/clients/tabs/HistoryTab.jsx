/**
 * HistoryTab - Histórico de serviços do cliente
 */

import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { History, Loader2, Calendar, DollarSign } from 'lucide-react';
import { useThemeStore } from '../../../store/themeStore';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';

const HistoryTab = ({ client }) => {
  const { isDarkMode } = useThemeStore();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [client]);

  const loadServices = async () => {
    if (!client?.firestoreId) return;
    
    try {
      setIsLoading(true);
      const servicesRef = collection(db, 'clients', client.firestoreId, 'services');
      const q = query(servicesRef, orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setServices(servicesData);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className={`w-8 h-8 animate-spin ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`} />
      </div>
  );
}

return (
    <Motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className={`text-lg font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Histórico de Serviços ({services.length})
      </h3>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <History className={`w-16 h-16 mx-auto mb-4 ${
            isDarkMode ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Nenhum serviço realizado ainda
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className={`
                p-4 rounded-xl border
                ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className={`font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {service.description || 'Serviço'}
                </h4>
                <span className={`
                  px-2 py-1 rounded text-xs font-semibold
                  ${service.status === 'completed'
                    ? isDarkMode
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-green-100 text-green-700'
                    : isDarkMode
                      ? 'bg-yellow-900/30 text-yellow-400'
                      : 'bg-yellow-100 text-yellow-700'
                  }
                `}>
                  {service.status === 'completed' ? 'Concluído' : 'Pendente'}
                </span>
              </div>
              
              <div className={`text-sm space-y-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDateTime(service.date)}
                </div>
                {service.value && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(service.value)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Motion.div>
  );
};

export default HistoryTab;

