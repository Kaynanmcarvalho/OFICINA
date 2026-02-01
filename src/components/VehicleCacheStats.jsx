import { useState, useEffect } from 'react';
import { Database, TrendingUp, Clock, Zap } from 'lucide-react';
import { getCacheStats, getMostSearchedPlates } from '../services/vehicleCacheService';

const VehicleCacheStats = () => {
    const [stats, setStats] = useState({
        totalPlates: 0,
        totalHits: 0,
        averageHitsPerPlate: 0
    });
    const [topPlates, setTopPlates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setIsLoading(true);
        try {
            const [statsData, topPlatesData] = await Promise.all([
                getCacheStats(),
                getMostSearchedPlates(5)
            ]);
            setStats(statsData);
            setTopPlates(topPlatesData);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                    <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                </div>
            </div>
  );
}

return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        Cache de Placas
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Base de dados compartilhada
                    </p>
                </div>
            </div>

            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        {stats.totalPlates}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Placas no cache
                    </p>
                </div>

                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        {stats.totalHits}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Total de consultas
                    </p>
                </div>

                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        {stats.averageHitsPerPlate}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Média por placa
                    </p>
                </div>
            </div>

            {/* Placas Mais Consultadas */}
            {topPlates.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Placas mais consultadas
                    </h4>
                    <div className="space-y-2">
                        {topPlates.map((plate, index) => (
                            <div
                                key={plate.placa}
                                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-neutral-400 w-6">
                                        #{index + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                            {plate.placa}
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {plate.vehicleData?.marca} {plate.vehicleData?.modelo}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {plate.hitCount}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        consultas
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Benefícios */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                            Cache Inteligente Ativo
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                            Consultas em cache são instantâneas (&lt; 1s) e não fazem scraping.
                            Base compartilhada entre todos os clientes do sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default VehicleCacheStats;
