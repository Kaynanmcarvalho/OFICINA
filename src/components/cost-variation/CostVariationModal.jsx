import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Activity, AlertCircle, BarChart3, Calendar } from 'lucide-react';
import './CostVariationModal.css';

const CostVariationModal = ({ scan, productName, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!scan) return null;

  const { analysis, trends, alerts, forecast, costHistory } = scan;

  const getStatusColor = () => {
    switch (analysis?.severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="cost-variation-modal-overlay" onClick={onClose}>
      <div className="cost-variation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>Scanner de Variação de Custo</h2>
            {productName && <p className="product-name">{productName}</p>}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={16} />
            Visão Geral
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Calendar size={16} />
            Histórico
          </button>
          <button
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <AlertCircle size={16} />
            Alertas ({alerts?.length || 0})
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="card-icon" style={{ color: getStatusColor() }}>
                    {trends?.direction === 'increasing' ? <TrendingUp /> : 
                     trends?.direction === 'decreasing' ? <TrendingDown /> : <Activity />}
                  </div>
                  <div className="card-content">
                    <span className="card-label">Variação Total</span>
                    <span className="card-value" style={{ color: getStatusColor() }}>
                      {analysis?.totalVariation > 0 ? '+' : ''}{analysis?.totalVariation}%
                    </span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-content">
                    <span className="card-label">Custo Atual</span>
                    <span className="card-value">R$ {analysis?.currentCost?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-content">
                    <span className="card-label">Média do Período</span>
                    <span className="card-value">R$ {analysis?.avgCost}</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-content">
                    <span className="card-label">Volatilidade</span>
                    <span className="card-value">{analysis?.avgVolatility}%</span>
                  </div>
                </div>
              </div>

              <div className="analysis-section">
                <h3>Análise Estatística</h3>
                <div className="stats-grid">
                  <div className="stat-row">
                    <span className="stat-label">Custo Mínimo</span>
                    <span className="stat-value">R$ {analysis?.minCost}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Custo Máximo</span>
                    <span className="stat-value">R$ {analysis?.maxCost}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Amplitude</span>
                    <span className="stat-value">R$ {analysis?.range} ({analysis?.rangePercentage}%)</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Coeficiente de Variação</span>
                    <span className="stat-value">{analysis?.coefficientOfVariation}%</span>
                  </div>
                </div>
              </div>

              {trends && (
                <div className="trends-section">
                  <h3>Análise de Tendências</h3>
                  <div className="trend-details">
                    <div className="trend-item">
                      <span className="trend-label">Direção</span>
                      <span className="trend-value">
                        {trends.direction === 'increasing' ? '📈 Crescente' : 
                         trends.direction === 'decreasing' ? '📉 Decrescente' : '➡️ Estável'}
                      </span>
                    </div>
                    <div className="trend-item">
                      <span className="trend-label">Força da Tendência</span>
                      <span className="trend-value">{trends.strength}%</span>
                    </div>
                    <div className="trend-item">
                      <span className="trend-label">Consistência</span>
                      <span className="trend-value">{trends.consistency}%</span>
                    </div>
                    <div className="trend-item">
                      <span className="trend-label">Equação</span>
                      <span className="trend-value trend-equation">{trends.equation}</span>
                    </div>
                  </div>
                </div>
              )}

              {forecast && (
                <div className="forecast-section">
                  <h3>Previsão de Custo</h3>
                  <div className="forecast-card">
                    <div className="forecast-main">
                      <span className="forecast-label">Custo Previsto (30 dias)</span>
                      <span className="forecast-value">R$ {forecast.predicted}</span>
                      <span className={`confidence-badge confidence-${forecast.confidence}`}>
                        Confiança: {forecast.confidence === 'high' ? 'Alta' : 
                                   forecast.confidence === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                    <div className="forecast-range">
                      <span className="range-label">Faixa Esperada</span>
                      <span className="range-value">
                        R$ {forecast.range.min} - R$ {forecast.range.max}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab">
              <h3>Histórico de Custos</h3>
              <div className="history-list">
                {costHistory && costHistory.length > 0 ? (
                  costHistory.map((item, index) => (
                    <div key={index} className="history-item">
                      <div className="history-date">{formatDate(item.date)}</div>
                      <div className="history-cost">R$ {item.cost?.toFixed(2)}</div>
                      {index < costHistory.length - 1 && (
                        <div className={`history-change ${item.cost > costHistory[index + 1].cost ? 'increase' : 'decrease'}`}>
                          {item.cost > costHistory[index + 1].cost ? '↑' : '↓'}
                          {Math.abs(((item.cost - costHistory[index + 1].cost) / costHistory[index + 1].cost) * 100).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-data">Nenhum histórico disponível</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="alerts-tab">
              <h3>Alertas e Recomendações</h3>
              {alerts && alerts.length > 0 ? (
                <div className="alerts-list">
                  {alerts.map((alert, index) => (
                    <div key={index} className={`alert-card alert-${alert.severity}`}>
                      <div className="alert-header">
                        <AlertCircle size={20} />
                        <span className="alert-type">
                          {alert.type === 'cost_increase' ? 'Aumento de Custo' :
                           alert.type === 'cost_decrease' ? 'Redução de Custo' :
                           alert.type === 'high_volatility' ? 'Alta Volatilidade' :
                           alert.type === 'upward_trend' ? 'Tendência de Alta' :
                           alert.type === 'downward_trend' ? 'Tendência de Baixa' : 'Alerta'}
                        </span>
                      </div>
                      <p className="alert-message">{alert.message}</p>
                      <div className="alert-details">
                        <div className="alert-impact">
                          <strong>Impacto:</strong> {alert.impact}
                        </div>
                        <div className="alert-action">
                          <strong>Ação Recomendada:</strong> {alert.action}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-alerts">
                  <Activity size={48} />
                  <p>Nenhum alerta no momento</p>
                  <span>Os custos estão dentro dos parâmetros normais</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostVariationModal;
