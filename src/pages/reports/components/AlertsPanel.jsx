import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, TrendingDown, Database, XCircle } from 'lucide-react';

const AlertsPanel = ({ alerts }) => {
  if (!alerts || alerts.count === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alertas do Sistema
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            Tudo certo! Nenhum alerta no momento.
          </p>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'low_margin':
      case 'negative_margin':
        return TrendingDown;
      case 'data_quality':
        return Database;
      case 'revenue_mismatch':
      case 'missing_checkins':
        return AlertCircle;
      case 'system_error':
        return XCircle;
      default:
        return Info;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900/40',
          text: 'text-red-900 dark:text-red-100',
          badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        };
      case 'high':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          icon: 'text-orange-600 dark:text-orange-400',
          iconBg: 'bg-orange-100 dark:bg-orange-900/40',
          text: 'text-orange-900 dark:text-orange-100',
          badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/40',
          text: 'text-yellow-900 dark:text-yellow-100',
          badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-900/40',
          text: 'text-blue-900 dark:text-blue-100',
          badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alertas do Sistema
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {alerts.critical > 0 && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
              {alerts.critical} crítico{alerts.critical > 1 ? 's' : ''}
            </span>
          )}
          {alerts.high > 0 && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
              {alerts.high} alto{alerts.high > 1 ? 's' : ''}
            </span>
          )}
          {alerts.medium > 0 && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
              {alerts.medium} médio{alerts.medium > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {alerts.alerts.map((alert, index) => {
          const Icon = getAlertIcon(alert.type);
          const colors = getAlertColor(alert.severity);

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border ${colors.bg} ${colors.border} transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colors.iconBg} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold ${colors.text}`}>
                      {alert.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.badge} whitespace-nowrap`}>
                      {alert.severity === 'critical' ? 'Crítico' :
                       alert.severity === 'high' ? 'Alto' :
                       alert.severity === 'medium' ? 'Médio' : 'Info'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {alert.message}
                  </p>
                  {alert.action && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Info className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Ação recomendada:</span> {alert.action}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    );
  };

export default AlertsPanel;
