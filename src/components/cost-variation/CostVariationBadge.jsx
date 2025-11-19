import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import './CostVariationBadge.css';

const CostVariationBadge = ({ scan, compact = false }) => {
  if (!scan || !scan.hasVariation) {
    return compact ? (
      <div className="cost-badge-compact stable">
        <Activity size={14} />
        <span>Estável</span>
      </div>
    ) : null;
  }

  const { analysis } = scan;

  const getStatusColor = () => {
    switch (analysis.severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusIcon = () => {
    if (analysis.variationType.includes('increase')) {
      return <TrendingUp className="status-icon" />;
    }
    if (analysis.variationType.includes('decrease')) {
      return <TrendingDown className="status-icon" />;
    }
    if (analysis.variationType === 'volatile') {
      return <Activity className="status-icon" />;
    }
    return <Activity className="status-icon" />;
  };

  const getStatusLabel = () => {
    switch (analysis.variationType) {
      case 'high_increase': return 'Alto Aumento';
      case 'moderate_increase': return 'Aumento Moderado';
      case 'high_decrease': return 'Alta Redução';
      case 'moderate_decrease': return 'Redução Moderada';
      case 'volatile': return 'Volátil';
      default: return 'Estável';
    }
  };

  if (compact) {
    return (
      <div 
        className="cost-badge-compact"
        style={{ backgroundColor: `${getStatusColor()}15`, color: getStatusColor() }}
      >
        {getStatusIcon()}
        <span>{getStatusLabel()}</span>
        {analysis.severity === 'high' && <AlertTriangle size={12} className="alert-icon" />}
      </div>
    );
  }

  return (
    <div className="cost-badge-full">
      <div className="cost-badge-header" style={{ backgroundColor: `${getStatusColor()}15` }}>
        <div className="badge-title">
          {getStatusIcon()}
          <span style={{ color: getStatusColor() }}>{getStatusLabel()}</span>
        </div>
        <div className="badge-variation">
          {analysis.totalVariation > 0 ? '+' : ''}{analysis.totalVariation}%
        </div>
      </div>
      <div className="cost-badge-details">
        <div className="detail-item">
          <span className="detail-label">Custo Atual</span>
          <span className="detail-value">R$ {analysis.currentCost.toFixed(2)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Média Período</span>
          <span className="detail-value">R$ {analysis.avgCost}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Volatilidade</span>
          <span className="detail-value">{analysis.avgVolatility}%</span>
        </div>
      </div>
    </div>
  );
};

export default CostVariationBadge;
