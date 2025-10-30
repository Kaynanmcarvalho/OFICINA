import { motion } from 'framer-motion';
import { ExternalLink, Copy, CheckCircle, Clock } from '@/utils/icons';
import toast from 'react-hot-toast';
import { detectVehicleType } from '../../../services/vehicleTypeDetector';
import { VehicleTypeIcon } from '../../../utils/icons/vehicleIcons';

const RegistroCard = ({ checkin, onViewDetails, onSelect, isSelected }) => {
  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success('ID copiado!', {
      duration: 2000,
      style: {
        background: '#1C1C1E',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '10px 16px',
      },
    });
  };

  const isCompleted = checkin.status === 'completed';
  const vehicleType = checkin.vehicleType || detectVehicleType(checkin.vehicleBrand, checkin.vehicleModel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(checkin)}
      className="w-full cursor-pointer"
      style={{ maxWidth: '100%' }}
    >
      <div 
        className={`
          relative rounded-2xl p-4
          transition-all duration-300
          ${isSelected 
            ? 'bg-[#1C1C1E] shadow-[0_8px_24px_rgba(0,0,0,0.6)]' 
            : 'bg-[#1C1C1E] shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]'
          }
        `}
        style={{
          border: isSelected 
            ? '1px solid rgba(16,185,129,0.5)' 
            : '1px solid rgba(255,255,255,0.08)',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        <div className="flex items-center gap-3" style={{ maxWidth: '100%' }}>
          {/* Ícone */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
              ${isCompleted || isSelected
                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/25'
                : 'bg-gradient-to-br from-blue-500/15 to-indigo-500/20'
              }
            `}
            style={{
              boxShadow: isCompleted || isSelected
                ? '0 4px 12px rgba(16,185,129,0.25)'
                : '0 4px 12px rgba(59,130,246,0.2)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : (
              <VehicleTypeIcon 
                type={vehicleType}
                className={`w-6 h-6 ${isSelected ? 'text-emerald-400' : 'text-blue-400'}`}
                size={24}
              />
            )}
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0" style={{ overflow: 'hidden' }}>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-semibold text-sm text-white truncate">
                {checkin.clientName}
              </h4>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => copyToClipboard(checkin.id, e)}
                className="text-gray-500 hover:text-emerald-400 transition-colors flex-shrink-0"
              >
                <Copy className="w-3 h-3" />
              </motion.button>
            </div>
            
            <p className="text-xs text-gray-400 truncate mb-1">
              {checkin.vehicleModel} • <span className="font-mono">{checkin.vehiclePlate}</span>
            </p>
            
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {new Date(checkin.createdAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Badge */}
            <span
              className={`
                px-2.5 py-1 rounded-full text-[10px] font-semibold
                ${isCompleted || isSelected
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
                }
              `}
              style={{
                border: isCompleted || isSelected
                  ? '1px solid rgba(16,185,129,0.3)'
                  : '1px solid rgba(245,158,11,0.3)'
              }}
            >
              {isCompleted ? 'Concluído' : isSelected ? 'Selecionado' : 'Em andamento'}
            </span>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(checkin);
              }}
              className={`
                p-2 rounded-lg
                ${isSelected
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                }
              `}
              style={{
                border: isSelected
                  ? '1px solid rgba(16,185,129,0.3)'
                  : '1px solid rgba(59,130,246,0.2)'
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegistroCard;
