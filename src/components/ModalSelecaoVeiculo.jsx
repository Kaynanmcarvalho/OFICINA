import { X, Plus } from '@/utils/icons';
import VehicleCard from './VehicleCard';

const ModalSelecaoVeiculo = ({ isOpen, onClose, vehicles, onSelectVehicle, onAddNew, title = 'Selecione o Veículo', showCheckInTime = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div className="w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                            {title}
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {vehicles.length} {vehicles.length === 1 ? 'veículo encontrado' : 'veículos encontrados'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                        aria-label="Fechar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Lista de Veículos */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-4">
                        {vehicles.map((vehicle) => (
                            <VehicleCard
                                key={vehicle.id || vehicle.plate}
                                vehicle={vehicle}
                                onClick={() => onSelectVehicle(vehicle)}
                                showCheckInTime={showCheckInTime}
                            />
                        ))}

                        {/* Botão Adicionar Novo Veículo */}
                        {onAddNew && (
                            <button
                                type="button"
                                onClick={onAddNew}
                                className="w-full p-5 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-dashed border-green-500 dark:border-green-600 rounded-xl hover:border-green-600 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                            Adicionar Novo Veículo
                                        </div>
                                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                            Cliente trouxe um veículo diferente
                                        </div>
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full px-6 py-2.5 rounded-xl font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-300"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSelecaoVeiculo;
