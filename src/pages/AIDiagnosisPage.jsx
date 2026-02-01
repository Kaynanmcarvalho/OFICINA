/**
 * AI Diagnosis Page
 * 
 * Página para diagnóstico visual de veículos com IA
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AIVehicleInspector from '../components/diagnosis/AIVehicleInspector';
import { useAIDiagnosis } from '../hooks/useAIDiagnosis';
import { Activity, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import './AIDiagnosisPage.css';

const AIDiagnosisPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  
  const { getHistory } = useAIDiagnosis();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load history if vehicleId is provided
  useEffect(() => {
    if (vehicleId) {
      loadHistory();
    }
  }, [vehicleId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(vehicleId, 5);
      setHistory(data);
      
      // Calculate stats
      calculateStats(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (historyData) => {
    const totalDamages = historyData.reduce((sum, item) => 
      sum + (item.detections?.length || 0), 0

    const avgProcessingTime = historyData.reduce((sum, item) => 
      sum + (item.processing_time_ms || 0), 0
    ) / historyData.length;

    setStats({
      totalInspections: historyData.length,
      totalDamages,
      avgProcessingTime: avgProcessingTime.toFixed(0),
    });
  };

  const handleDetectionComplete = (result) => {
    // Reload history if vehicleId exists
    if (vehicleId) {
      loadHistory();
    }
  };

  return (
    <div className="ai-diagnosis-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Diagnóstico Visual com IA</h1>
          <p>Detecte danos em veículos automaticamente usando inteligência artificial</p>
        </div>
      </div>

      <div className="page-content">
        <div className="content-grid">
          {/* Main Inspector */}
          <div className="inspector-section">
            <AIVehicleInspector
              onDetectionComplete={handleDetectionComplete}
              vehicleId={vehicleId}
            />
          </div>

          {/* Sidebar */}
          <div className="sidebar-section">
            {/* Stats Cards */}
            {stats && (
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#667eea' }}>
                    <Activity size={24} color="white" />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Inspeções</span>
                    <span className="stat-value">{stats.totalInspections}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#f97316' }}>
                    <AlertTriangle size={24} color="white" />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Danos Detectados</span>
                    <span className="stat-value">{stats.totalDamages}</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#22c55e' }}>
                    <Clock size={24} color="white" />
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Tempo Médio</span>
                    <span className="stat-value">{stats.avgProcessingTime}ms</span>
                  </div>
                </div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="history-section">
                <h3>Histórico Recente</h3>
                <div className="history-list">
                  {history.map((item, index) => (
                    <div key={item.id} className="history-item">
                      <div className="history-icon">
                        <Activity size={20} />
                      </div>
                      <div className="history-content">
                        <div className="history-header">
                          <span className="history-date">
                            {new Date(item.createdAt?.toDate()).toLocaleDateString()}
                          </span>
                          <span className="history-count">
                            {item.detections?.length || 0} danos
                          </span>
                        </div>
                        <div className="history-time">
                          {item.processing_time_ms?.toFixed(0)}ms
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="info-card">
              <h4>Como Funciona</h4>
              <ul>
                <li>Faça upload de uma foto do veículo</li>
                <li>A IA analisa automaticamente</li>
                <li>Receba detecção de danos em segundos</li>
                <li>Visualize resultados com marcações</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosisPage;
