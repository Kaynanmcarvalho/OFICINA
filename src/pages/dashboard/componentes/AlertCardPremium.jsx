import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Clock, User, Phone, Car } from 'lucide-react';

/**
 * AlertCardPremium - Design Apple-like silenciosamente sofisticado
 * 
 * FILOSOFIA:
 * - Elegância sem ostentação
 * - Hierarquia por tipografia e espaçamento, não por cor
 * - Cor de estado usada com extrema moderação
 * - Comunicar urgência sem estresse visual
 * - Escalável de 1 a 20 alertas sem virar bagunça
 */

const AlertCardPremium = ({ alerta, onDismiss, index = 0 }) => {
  const getIconeConfig = (tipo) => {
    switch (tipo) {
      case 'critico':
      case 'erro':
        return {
          Icone: AlertCircle,
          cor: 'text-red-600 dark:text-red-500',
          indicador: 'bg-red-500'
        };
      case 'aviso':
        return {
          Icone: AlertTriangle,
          cor: 'text-amber-600 dark:text-amber-500',
          indicador: 'bg-amber-500'
        };
      case 'info':
        return {
          Icone: Info,
          cor: 'text-blue-600 dark:text-blue-500',
          indicador: 'bg-blue-500'
        };
      case 'sucesso':
        return {
          Icone: CheckCircle,
          cor: 'text-green-600 dark:text-green-500',
          indicador: 'bg-green-500'
        };
      default:
        return {
          Icone: Info,
          cor: 'text-gray-600 dark:text-gray-400',
          indicador: 'bg-gray-400'
        };
    }
  };

  const { Icone, cor, indicador } = getIconeConfig(alerta.tipo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ 
        delay: index * 0.03,
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1] // Easing suave Apple-like
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      {/* Card Container - Fundo neutro, borda sutil */}
      <div className="
        relative
        bg-white dark:bg-gray-900/40
        border border-gray-200/60 dark:border-gray-700/40
        rounded-xl
        p-4
        transition-all duration-300
        hover:border-gray-300/80 dark:hover:border-gray-600/60
        hover:shadow-sm
      ">
        
        {/* Indicador de Estado - Pequeno, discreto, à esquerda */}
        <div className={`
          absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full
          ${indicador}
          opacity-60 group-hover:opacity-100
          transition-opacity duration-300
        `} />

        {/* Layout Principal */}
        <div className="flex items-start gap-3 pl-3">
          
          {/* Ícone - Pequeno (16px) e discreto */}
          <div className="flex-shrink-0 mt-0.5">
            <Icone className={`w-4 h-4 ${cor} opacity-70`} />
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 min-w-0 space-y-2">
            
            {/* Título - Bold, hierarquia clara */}
            <h4 className="
              text-sm font-semibold
              text-gray-900 dark:text-gray-100
              leading-tight
            ">
              {alerta.titulo}
            </h4>

            {/* Mensagem - Regular, contexto secundário */}
            <p className="
              text-sm font-normal
              text-gray-600 dark:text-gray-400
              leading-relaxed
            ">
              {alerta.mensagem}
            </p>

            {/* Metadados Estruturados - Tipografia leve, espaçamento generoso */}
            {alerta.dados && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-500">
                
                {/* Placa */}
                {alerta.dados.placa && (
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 opacity-50" />
                    <span className="font-mono font-medium tracking-wide">
                      {alerta.dados.placa}
                    </span>
                  </div>
                )}

                {/* Cliente */}
                {alerta.dados.cliente && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 opacity-50" />
                    <span>{alerta.dados.cliente}</span>
                  </div>
                )}

                {/* Telefone */}
                {alerta.dados.telefone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 opacity-50" />
                    <span className="font-mono">{alerta.dados.telefone}</span>
                  </div>
                )}

                {/* Tempo - Destaque sutil com cor de estado */}
                {(alerta.dados.diasAtraso || alerta.dados.diasParado || alerta.dados.diasPronto) && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 opacity-50" />
                    <span className={`font-medium ${cor}`}>
                      {alerta.dados.diasAtraso && `${alerta.dados.diasAtraso}d atraso`}
                      {alerta.dados.diasParado && `${alerta.dados.diasParado}d parado`}
                      {alerta.dados.diasPronto && `${alerta.dados.diasPronto}d pronto`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Ação - Link discreto, não botão primário */}
            {alerta.acao && (
              <div className="pt-1">
                <a
                  href={alerta.acao.link}
                  className="
                    inline-flex items-center gap-1.5
                    text-xs font-medium
                    text-gray-700 dark:text-gray-300
                    hover:text-gray-900 dark:hover:text-gray-100
                    transition-colors duration-200
                    group/link
                  "
                >
                  <span className="border-b border-gray-300 dark:border-gray-600 group-hover/link:border-gray-900 dark:group-hover/link:border-gray-100 transition-colors">
                    {alerta.acao.label}
                  </span>
                  <svg 
                    className="w-3 h-3 transform group-hover/link:translate-x-0.5 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Botão Dismiss - Discreto, aparece no hover */}
          <button
            onClick={() => onDismiss(alerta.id)}
            className="
              flex-shrink-0
              w-6 h-6
              flex items-center justify-center
              rounded-md
              text-gray-400 dark:text-gray-500
              hover:text-gray-600 dark:hover:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800/50
              opacity-0 group-hover:opacity-100
              transition-all duration-200
            "
            aria-label="Dispensar alerta"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AlertCardPremium;
