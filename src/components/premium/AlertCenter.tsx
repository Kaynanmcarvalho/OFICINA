import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X, Filter } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  timestamp: Date;
  isRead?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export interface AlertCenterProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  maxVisible?: number;
}

const alertIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
};

const alertColors = {
  info: {
    bg: 'bg-info-50 dark:bg-info-900/20',
    border: 'border-info-200 dark:border-info-800',
    text: 'text-info-700 dark:text-info-400',
    icon: 'text-info-600 dark:text-info-400',
  },
  success: {
    bg: 'bg-success-50 dark:bg-success-900/20',
    border: 'border-success-200 dark:border-success-800',
    text: 'text-success-700 dark:text-success-400',
    icon: 'text-success-600 dark:text-success-400',
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-900/20',
    border: 'border-warning-200 dark:border-warning-800',
    text: 'text-warning-700 dark:text-warning-400',
    icon: 'text-warning-600 dark:text-warning-400',
  },
  error: {
    bg: 'bg-error-50 dark:bg-error-900/20',
    border: 'border-error-200 dark:border-error-800',
    text: 'text-error-700 dark:text-error-400',
    icon: 'text-error-600 dark:text-error-400',
  },
};

const priorityBadges = {
  low: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  medium: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  high: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  critical: 'bg-error-600 text-white dark:bg-error-500',
};

export const AlertCenter = ({
  alerts,
  onDismiss,
  onMarkAsRead,
  maxVisible = 5,
}: AlertCenterProps) => {
  const [filter, setFilter] = useState<AlertType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filter);

  const visibleAlerts = filteredAlerts.slice(0, maxVisible);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Central de Alertas
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Filtrar alertas"
        >
          <Filter className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 overflow-hidden"
          >
            {(['all', 'info', 'success', 'warning', 'error'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                }`}
              >
                {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visibleAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-neutral-500 dark:text-neutral-400"
            >
              Nenhum alerta no momento
            </motion.div>
          ) : (
            visibleAlerts.map((alert) => {
              const Icon = alertIcons[alert.type];
              const colors = alertColors[alert.type];

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`relative rounded-xl border p-4 ${colors.bg} ${colors.border} ${
                    alert.isRead ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 ${colors.icon}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-semibold text-sm ${colors.text}`}>
                          {alert.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            priorityBadges[alert.priority]
                          }`}
                        >
                          {alert.priority}
                        </span>
                      </div>

                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        {alert.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500 dark:text-neutral-500">
                          {new Date(alert.timestamp).toLocaleString('pt-BR')}
                        </span>

                        {alert.actions && (
                          <div className="flex gap-2">
                            {alert.actions.map((action, idx) => (
                              <button
                                key={idx}
                                onClick={action.onClick}
                                className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(alert.id)}
                        className="flex-shrink-0 p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Dispensar alerta"
                      >
                        <X className="w-4 h-4 text-neutral-500" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {filteredAlerts.length > maxVisible && (
        <div className="text-center">
          <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
            Ver mais {filteredAlerts.length - maxVisible} alertas
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertCenter;
