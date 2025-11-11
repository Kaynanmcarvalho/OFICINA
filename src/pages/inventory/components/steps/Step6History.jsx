import { useThemeStore } from '../../../../store/themeStore';
import { useProductStore } from '../../../../store/productStore';
import { useEffect, useState } from 'react';
import { Clock, TrendingUp, TrendingDown, Package, User } from 'lucide-react';

const Step6History = ({ formData, product }) => {
  const { isDarkMode } = useThemeStore();
  const { getMovements, getAuditLogs } = useProductStore();
  const [movements, setMovements] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && (product.id || product.firestoreId)) {
      loadHistory();
    }
  }, [product]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const productId = product.id || product.firestoreId;
      const [movs, audits] = await Promise.all([
        getMovements(productId),
        getAuditLogs(productId)
      ]);
      setMovements(movs);
      setAuditLogs(audits);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementIcon = (type) => {
    switch (type) {
      case 'in': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'out': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'reserve': return <Package className="w-4 h-4 text-purple-500" />;
      case 'release': return <Package className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMovementLabel = (type) => {
    switch (type) {
      case 'in': return 'Entrada';
      case 'out': return 'Saída';
      case 'reserve': return 'Reserva';
      case 'release': return 'Liberação';
      default: return 'Ajuste';
    }
  };

  if (!product) {
    return (
      <div className={`
        text-center py-12 rounded-xl
        ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
      `}>
        <Clock className={`w-12 h-12 mx-auto mb-4 ${
          isDarkMode ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          O histórico estará disponível após salvar o produto
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Movimentações de Estoque */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Movimentações de Estoque
        </h3>

        {loading ? (
          <div className={`text-center py-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Carregando...
          </div>
        ) : movements.length === 0 ? (
          <div className={`
            text-center py-8 rounded-xl
            ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
          `}>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Nenhuma movimentação registrada
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className={`
                  flex items-start gap-4 p-4 rounded-xl
                  ${isDarkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                `}>
                  {getMovementIcon(movement.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {getMovementLabel(movement.type)}
                    </span>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {movement.createdAt ? new Date(movement.createdAt).toLocaleString('pt-BR') : '-'}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {movement.reason || 'Sem descrição'}
                  </p>
                  <div className={`text-sm mt-1 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Quantidade: <span className="font-semibold">{movement.quantity}</span>
                    {movement.newStock !== undefined && (
                      <> • Estoque após: <span className="font-semibold">{movement.newStock}</span></>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auditoria */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Histórico de Alterações
        </h3>

        {loading ? (
          <div className={`text-center py-8 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Carregando...
          </div>
        ) : auditLogs.length === 0 ? (
          <div className={`
            text-center py-8 rounded-xl
            ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
          `}>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Nenhuma alteração registrada
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className={`
                  flex items-start gap-4 p-4 rounded-xl
                  ${isDarkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                `}>
                  <User className={`w-4 h-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {log.description}
                    </span>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleString('pt-BR') : '-'}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Ação: {log.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step6History;


