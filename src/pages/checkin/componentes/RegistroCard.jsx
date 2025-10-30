// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ExternalLink, Copy, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { BrandIcon } from '../../../utils/brandIcons';

const RegistroCard = ({ checkin, onViewDetails, onSelect, isSelected }) => {
  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success('ID copiado!', {
      style: {
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        backdropFilter: 'blur(10px)',
      },
    });
  };

  const isCompleted = checkin.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={() => onSelect(checkin)}
      className="group relative cursor-pointer"
    >
      {/* Ring de seleção com bordas arredondadas */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-[1.75rem] opacity-75 blur-sm"
        />
      )}
      
      {/* Card principal - Premium em ambos os modos */}
      <div className={`relative rounded-3xl p-6 transition-all duration-300 ${
        isSelected 
          ? 'bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)]' 
          : 'bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]'
      } border ${
        isSelected
          ? 'border-emerald-500/30 dark:border-emerald-500/30'
          : 'border-gray-300/40 dark:border-gray-700/30'
      }`}>
        {/* Brilho sutil no hover - mais visível no modo claro */}
        <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
          isSelected
            ? 'bg-gradient-to-br from-emerald-500/[0.08] via-emerald-400/[0.04] to-emerald-500/[0.08] dark:from-emerald-500/20 dark:via-emerald-500/10 dark:to-emerald-500/20'
            : 'bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/[0.06] group-hover:via-purple-500/[0.04] group-hover:to-pink-500/[0.06] dark:group-hover:from-blue-500/10 dark:group-hover:via-purple-500/10 dark:group-hover:to-pink-500/10'
        }`} />
        
        <div className="relative flex items-center justify-between">
          {/* Lado esquerdo - Info */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Avatar/Ícone - com sombra e profundidade */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg ${
                isCompleted
                  ? 'bg-gradient-to-br from-emerald-400/25 to-emerald-600/25 shadow-emerald-500/20'
                  : isSelected
                  ? 'bg-gradient-to-br from-emerald-400/25 to-emerald-600/25 shadow-emerald-500/20'
                  : 'bg-gradient-to-br from-blue-400/25 to-blue-600/25 shadow-blue-500/20'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <BrandIcon 
                  vehicleModel={checkin.vehicleModel} 
                  className={`w-7 h-7 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}
                />
              )}
            </motion.div>

            {/* Informações */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                  {checkin.clientName}
                </h4>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => copyToClipboard(checkin.id, e)}
                  className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors"
                  title="Copiar ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </motion.button>
              </div>
              
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                {checkin.vehicleModel} • <span className="font-mono">{checkin.vehiclePlate}</span>
              </p>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{new Date(checkin.createdAt).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Lado direito - Status e Ações */}
          <div className="flex items-center space-x-3 ml-4">
            {/* Badge de Status - com mais contraste e sombra */}
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm shadow-md ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 shadow-emerald-500/30 border border-emerald-200 dark:border-emerald-800'
                  : isSelected
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 shadow-emerald-500/30 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 shadow-amber-500/30 border border-amber-200 dark:border-amber-800'
              }`}
            >
              {isCompleted ? 'Concluído' : isSelected ? 'Selecionado' : 'Em andamento'}
            </motion.span>

            {/* Botão Ver Detalhes - com mais profundidade */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(checkin);
              }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-emerald-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg dark:shadow-lg border border-gray-200 dark:border-gray-700"
              title="Ver detalhes"
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
