import { VehicleTypeIcon, Clock } from '@/utils/icons';
import { detectVehicleType } from '../services/vehicleTypeDetector';

const VehicleCard = ({ vehicle, onClick, showCheckInTime = false }) => {

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const now = new Date();
        const checkInDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diffMs = now - checkInDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays}d atrás`;
        if (diffHours > 0) return `${diffHours}h atrás`;
        if (diffMins > 0) return `${diffMins}min atrás`;
        return 'Agora';
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full p-5 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-left group"
        >
            <div className="flex items-start gap-4">
                {/* Ícone do Veículo */}
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    <VehicleTypeIcon 
                        type={vehicle.type || detectVehicleType(vehicle.brand, vehicle.model)}
                        className="w-8 h-8"
                        size={32}
                    />
                </div>

                {/* Informações do Veículo */}
                <div className="flex-1 min-w-0">
                    {/* Placa */}
                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        {vehicle.plate || 'Sem placa'}
                    </div>

                    {/* Marca e Modelo */}
                    <div className="text-base font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        {vehicle.brand && vehicle.model 
                            ? `${vehicle.brand} ${vehicle.model}`
                            : vehicle.model || vehicle.brand || 'Modelo não informado'
                        }
                    </div>

                    {/* Ano e Cor */}
                    <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                        {vehicle.year && (
                            <span className="flex items-center gap-1">
                                📅 {vehicle.year}
                            </span>
                        )}
                        {vehicle.color && (
                            <span className="flex items-center gap-1">
                                🎨 {vehicle.color}
                            </span>
                        )}
                    </div>

                    {/* Tempo de Check-in (se aplicável) */}
                    {showCheckInTime && vehicle.checkInDate && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                            <Clock className="w-4 h-4" />
                            <span>Check-in: {getTimeAgo(vehicle.checkInDate)}</span>
                        </div>
                    )}
                </div>

                {/* Indicador de Seleção */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-neutral-300 dark:border-neutral-600 group-hover:border-blue-500 group-hover:bg-blue-500 transition-all duration-300 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-white transition-all duration-300"></div>
                </div>
            </div>
        </button>
    );
};

export default VehicleCard;
