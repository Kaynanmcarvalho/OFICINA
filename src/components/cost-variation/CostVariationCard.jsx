import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle, ChevronRight } from 'lucide-react';
import './CostVariationCard.css';

const CostVariationCard = ({ scan, onViewDetails }) => {
  if (!scan) return null;

  const { analysis, trends, alerts } = scan;

  const getStatusColor = () => {
    switch (analysis?.severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getTrendIcon = () => {
    if (trends?.direction === 'increasing') return <TrendingUp size={20} />;
    if (trends?.direction === 'decreasing') return <TrendingDown size={20} />;
    return <Activity size={20} />;
  };

  return (
    <div className="cost-variation-card">
      <div className="card-header">
        <div className="header-left">
          <div className="trend-icon" style={{ color: getStatusColor() }}>
            {getTrendIcon()}
          </div>
          <div className="header-info">
            <h3>Variação de Custo</h3>
            <p className="period-label">Últimos {scan.period || 90} dias</p>
          </div>
        </div>
        <div 
          className="variation-badge"
          style={{ 
            backgroundColor: `${getStatusColor()}15`,
            color: getStatusColor()
          }}
        >
          {analysis?.totalVariation > 0 ? '+' : ''}{analysis?.totalVariation}%
        </div>
      </div>

      <div className="card-stats">
        <div className="stat-item">
          <span className="stat-label">Custo Atual</span>
          <span className="stat-value">R$ {analysis?.currentCost?.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Média</span>
          <span className="stat-value">R$ {analysis?.avgCost}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mín/Máx</span>
          <span className="stat-value">
            R$ {analysis?.minCost} - R$ {analysis?.maxCost}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Volatilidade</span>
          <span className="stat-value">{analysis?.avgVolatility}%</span>
        </div>
      </div>

      {trends && (
        <div className="trend-info">
          <div className="trend-label">
            Tendência: <strong>{trends.direction === 'increasing' ? 'Crescente' : trends.direction === 'decreasing' ? 'Decrescente' : 'Estável'}</strong>
          </div>
          <div className="trend-strength">
            Força: {trends.strength}% | Consistência: {trends.consistency}%
          </div>
        </div>
      )}

      {alerts && alerts.length > 0 && (
        <div className="alerts-section">
          {alerts.slice(0, 2).map((alert, index) => (
            <div key={index} className={`alert-item alert-${alert.severity}`}>
              <AlertCircle size={16} />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {onViewDetails && (
        <button className="view-details-btn" onClick={onViewDetails}>
          Ver Detalhes Completos
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default CostVariationCard;
